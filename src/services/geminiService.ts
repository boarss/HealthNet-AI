export const geminiModel = "gemini-1.5-flash";

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
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

  const payload = {
    system_instruction: {
      parts: [{ text: SYSTEM_PROMPT }]
    },
    contents: messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    })),
    generationConfig: {
      responseMimeType: "application/json",
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No candidates returned");
    }

    const text = data.candidates[0].content.parts[0].text;
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to fetch or parse JSON response from Gemini API", e);
    return { content: "I encountered an error connecting to the AI service.", reasoning: { steps: ["Connection failed"], confidence: 0.0 } };
  }
}

export async function analyzeMedicalImage(base64Image: string, prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

  // Extract pure base64 if it has data url scheme
  const cleanBase64 = base64Image.includes('base64,') ? base64Image.split('base64,')[1] : base64Image;

  const payload = {
    system_instruction: {
      parts: [{ text: "You are a medical imaging specialist. Analyze the provided image and provide a detailed report. Include a disclaimer that this is an AI analysis and must be verified by a radiologist or physician." }]
    },
    contents: [{
      parts: [
        { text: prompt },
        { 
          inline_data: { 
            mime_type: "image/jpeg", 
            data: cleanBase64 
          } 
        }
      ]
    }]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (e) {
    console.error("Failed to analyze image", e);
    return "Error analyzing image.";
  }
}
