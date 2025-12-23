import { GoogleGenAI, Type } from "@google/genai";
import { Bet } from "../types";

// NOTE: In a production environment, never expose API keys on the client side.
// This requires a proxy server. For this demo, we assume the environment variable is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instruction for the OCR model to ensure consistent JSON output
const OCR_SYSTEM_PROMPT = `
You are a specialized OCR engine for sports betting slips. 
Extract the following details from the image and return ONLY a valid JSON object:
- sport (default to 'Futebol' if unsure)
- league
- match (Team A vs Team B)
- market (Map to one of: '1X2', 'DC', 'O/U', 'BTTS', 'AH', 'Other')
- selection (The specific bet pick)
- odds (number)
- stake (number, currency amount)
- bookmaker (e.g., Bet365, Betano)
- date (ISO string format if found, otherwise current date)

If a field is missing, use null or a reasonable guess based on context. 
Do not include markdown formatting like \`\`\`json. Just the raw JSON string.
`;

const ANALYST_SYSTEM_PROMPT = `
You are BetOS AI, a professional sports betting analyst. 
Your goal is to help the user manage risk, identify patterns, and improve their profitability.
Analyze the provided betting history. Focus on:
1. ROI and Yield.
2. Performance by Market (1X2, Over/Under, etc.).
3. Performance by Odds Range (Low <1.4, Medium 1.6-2.0, High >2.5).
4. Bankroll Management (suggest flat stake or Kelly criterion adjustments).
5. Variance warnings (if they are losing too many high odd bets).

Be concise, objective, and use bullet points. Use Portuguese language.
`;

export const extractBetFromImage = async (base64Image: string): Promise<Partial<Bet> | null> => {
  try {
    // We use gemini-3-flash-preview as it supports multimodal inputs (text + image) 
    // and is highly capable of structured data extraction.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
            {
                inlineData: {
                    mimeType: 'image/jpeg', // Assuming JPEG for simplicity, works for PNG too usually in API
                    data: base64Image
                }
            },
            {
                text: OCR_SYSTEM_PROMPT
            }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                sport: { type: Type.STRING },
                league: { type: Type.STRING },
                match: { type: Type.STRING },
                market: { type: Type.STRING },
                selection: { type: Type.STRING },
                odds: { type: Type.NUMBER },
                stake: { type: Type.NUMBER },
                bookmaker: { type: Type.STRING },
                date: { type: Type.STRING }
            }
        }
      }
    });

    const text = response.text;
    if (!text) return null;

    try {
        const parsed = JSON.parse(text);
        return parsed as Partial<Bet>;
    } catch (e) {
        console.error("Failed to parse JSON from Gemini", e);
        return null;
    }

  } catch (error) {
    console.error("Gemini OCR Error:", error);
    return null;
  }
};

export const getAnalystInsights = async (bets: Bet[], userMessage: string): Promise<string> => {
    try {
        const betHistorySummary = bets.map(b => 
            `${b.date.split('T')[0]}: ${b.match} (${b.market}) - ${b.selection} @ ${b.odds}. Stake: ${b.stake}. Result: ${b.status}`
        ).join('\n');

        const prompt = `
        Histórico de Apostas Recentes:
        ${betHistorySummary}

        Pergunta do Usuário: ${userMessage}
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                systemInstruction: ANALYST_SYSTEM_PROMPT,
                thinkingConfig: { thinkingBudget: 1024 } // Use some reasoning for analysis
            }
        });

        return response.text || "Desculpe, não consegui analisar os dados agora.";

    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        return "Erro ao conectar com a IA Analista.";
    }
};