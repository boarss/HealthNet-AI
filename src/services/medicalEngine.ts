import { DiagnosisResult, PatientData } from '../types';

/**
 * Diagnostic Knowledge Base Structure
 * maps: Disease Name -> { Symptoms -> Weight }
 */
export interface KnowledgeBase {
  [disease: string]: {
    symptoms: { [symptom: string]: number };
    urgency: 'low' | 'medium' | 'high' | 'emergency';
    recommendations: string[];
    herbalAlternatives?: string[];
  };
}

// Initial "Seed" Knowledge Base
// In a real app, this would be fetched from Supabase and cached locally
let localKB: KnowledgeBase = {
  "Common Cold": {
    symptoms: { "sneezing": 0.8, "runny nose": 0.9, "sore throat": 0.7, "cough": 0.6, "mild fever": 0.3 },
    urgency: "low",
    recommendations: ["Rest", "Hydration", "Vitamin C"],
    herbalAlternatives: ["Ginger tea", "Honey and lemon juice"]
  },
  "Influenza (Flu)": {
    symptoms: { "high fever": 0.9, "muscle aches": 0.8, "fatigue": 0.9, "dry cough": 0.7, "headache": 0.6 },
    urgency: "medium",
    recommendations: ["Rest", "Antipyretics", "Medical assessment if symptoms worsen"],
    herbalAlternatives: ["Elderberry syrup", "Echinacea tea"]
  },
  "Malaria": {
    symptoms: { "chills": 0.9, "high fever": 0.8, "sweating": 0.7, "headache": 0.6, "nausea": 0.5 },
    urgency: "high",
    recommendations: ["Seek medical testing for malaria immediately", "Antimalarial medication as prescribed"],
    herbalAlternatives: ["Artemisinin (under medical supervision)"]
  },
  "Allergic Rhinitis": {
    symptoms: { "sneezing": 0.9, "itchy eyes": 0.8, "runny nose": 0.7, "clear nasal discharge": 0.9 },
    urgency: "low",
    recommendations: ["Avoid triggers", "Antihistamines"],
    herbalAlternatives: ["Nettle leaf tea", "Quercetin-rich foods"]
  }
};

/**
 * PREDICT: Analyze symptoms and return possible diagnoses
 */
export function predict(patientSymptoms: string[]): DiagnosisResult[] {
  const results: DiagnosisResult[] = [];
  const normalizedSymptoms = patientSymptoms.map(s => s.toLowerCase().trim());

  for (const [disease, data] of Object.entries(localKB)) {
    let score = 0;
    let matchCount = 0;

    for (const symptom of normalizedSymptoms) {
      if (data.symptoms[symptom]) {
        score += data.symptoms[symptom];
        matchCount++;
      }
    }

    if (matchCount > 0) {
      // Normalize score based on number of symptoms checked to get "confidence"
      // This is a simple heuristic: (Sum of matched weights) / (Total number of patient symptoms provided)
      const confidence = Math.min(score / normalizedSymptoms.length, 1.0);

      results.push({
        condition: disease,
        confidence: parseFloat(confidence.toFixed(2)),
        explanation: `Matches ${matchCount} of your reported symptoms.`,
        urgency: data.urgency,
        recommendations: data.recommendations,
        herbalAlternatives: data.herbalAlternatives
      });
    }
  }

  // Sort by confidence
  return results.sort((a, b) => b.confidence - a.confidence);
}

/**
 * COMPARE & ADJUST: Correct the AI and adjust internal weights
 * This is the "Training" part of the loop.
 */
export function adjust(patientSymptoms: string[], actualCondition: string) {
  const normalizedSymptoms = patientSymptoms.map(s => s.toLowerCase().trim());

  // Ensure the disease exists in our KB, if not, create it
  if (!localKB[actualCondition]) {
    localKB[actualCondition] = {
      symptoms: {},
      urgency: "medium",
      recommendations: ["No data yet"],
      herbalAlternatives: []
    };
  }

  // Adjust weights for the actual condition
  for (const symptom of normalizedSymptoms) {
    const currentWeight = localKB[actualCondition].symptoms[symptom] || 0;
    // Simple adjustment: increase weight by 0.1 for matching symptoms, cap at 1.0
    localKB[actualCondition].symptoms[symptom] = Math.min(currentWeight + 0.1, 1.0);
  }

  // Penalize the disease for symptoms reported that it doesn't usually have?
  // (Optional: this could be more complex, but let's stick to positive reinforcement for now)

  console.log(`Knowledge Base adjusted for: ${actualCondition}`);
  return localKB;
}

/**
 * Initialize KB from external source
 */

/**
 * Simple Symptom Extractor
 * In a real app, this might use a local NLP model or a robust keyword matcher
 */
export function extractSymptoms(text: string): string[] {
  const commonSymptoms = [
    "fever", "cough", "headache", "nausea", "chills", "sneezing", 
    "runny nose", "sore throat", "fatigue", "muscle aches", 
    "sweating", "itchy eyes"
  ];
  
  const found: string[] = [];
  const lowerText = text.toLowerCase();
  
  for (const symptom of commonSymptoms) {
    if (lowerText.includes(symptom)) {
      found.push(symptom);
    }
  }
  
  return found;
}

export function setKnowledgeBase(newKB: KnowledgeBase) {
  localKB = newKB;
}

export function getKnowledgeBase() {
  return localKB;
}
