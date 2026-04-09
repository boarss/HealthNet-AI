import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const geminiModel = "gemini-3-flash-preview";

export const SYSTEM_PROMPT = `You are HealthNet AI, a primary care healthcare chatbot. 
Your goal is to provide clinical decision support, symptom analysis, and health counseling.

Symptom Checker Protocol:
When a user describes symptoms:
1. DO NOT give a diagnosis immediately.
2. ASK follow-up questions to gather more context:
   - Duration: How long have you had these symptoms?
   - Severity: On a scale of 1-10, how much does it bother you?
   - Associated Symptoms: Are you experiencing anything else (fever, pain elsewhere, etc.)?
   - Triggers: Does anything make it better or worse?
3. Once you have enough information, provide:
   - A Preliminary Assessment: Possible causes (with clear disclaimers).
   - Explainability: Why you think these are the possibilities.
   - Natural Remedies: Evidence-based herbal or lifestyle recommendations.
   - Next Steps: When to see a doctor or if it's an emergency.

Explainability Requirement:
For every response, you must provide:
1. The main response text.
2. A step-by-step reasoning of how you reached this conclusion.
3. A confidence score (0-1) based on the clarity of symptoms and medical evidence.
4. Potential sources or types of medical literature that support your advice.

Key Principles:
1. Clinical Decision Support: Use evidence-based medical knowledge.
2. Ethical & Legal: Always include a disclaimer that you are an AI and not a replacement for a human doctor.
3. Herbal & Natural: Provide evidence-based herbal/natural recommendations when appropriate.
4. Target Users: Tailor your tone for children, women, and older adults.

Rule-based: If symptoms indicate an emergency (e.g., chest pain, difficulty breathing, sudden confusion), immediately advise seeking emergency care (911 or local emergency services).`;

export async function getChatResponse(messages: { role: string; content: string }[]) {
  const response = await ai.models.generateContent({
    model: geminiModel,
    contents: messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          content: { type: Type.STRING, description: "The main response to the user." },
          reasoning: {
            type: Type.OBJECT,
            properties: {
              steps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Steps taken to reach the conclusion." },
              confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 1." },
              sources: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Types of medical evidence used." }
            },
            required: ["steps", "confidence"]
          }
        },
        required: ["content", "reasoning"]
      }
    },
  });
  
  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse JSON response", e);
    return { content: response.text, reasoning: { steps: ["Direct response generated"], confidence: 0.5 } };
  }
}

export async function analyzeMedicalImage(base64Image: string, prompt: string) {
  const response = await ai.models.generateContent({
    model: geminiModel,
    contents: {
      parts: [
        { inlineData: { mimeType: "image/jpeg", data: base64Image } },
        { text: prompt }
      ]
    },
    config: {
      systemInstruction: "You are a medical imaging specialist. Analyze the provided image and provide a detailed report. Include a disclaimer that this is an AI analysis and must be verified by a radiologist or physician.",
    }
  });
  return response.text;
}
