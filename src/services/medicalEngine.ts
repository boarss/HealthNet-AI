import { DiagnosisResult } from '../types';

/**
 * Diagnostic Knowledge Base Structure
 * maps: Disease Name -> { Symptoms -> Weight, adjustmentCount for learning rate decay }
 */
export interface KnowledgeBase {
  [disease: string]: {
    symptoms: { [symptom: string]: number };
    urgency: 'low' | 'medium' | 'high' | 'emergency';
    recommendations: string[];
    herbalAlternatives?: string[];
    adjustmentCount?: number;
  };
}

/**
 * Symptom Alias Map
 * Maps informal/alternative symptom names to their canonical form.
 * This dramatically increases match rate for user-described symptoms.
 */
const SYMPTOM_ALIASES: { [alias: string]: string } = {
  // Fever variants
  "high temperature": "high fever",
  "burning up": "high fever",
  "feverish": "fever",
  "low grade fever": "mild fever",
  "slight fever": "mild fever",
  // Respiratory
  "blocked nose": "runny nose",
  "stuffy nose": "runny nose",
  "nasal congestion": "runny nose",
  "throat pain": "sore throat",
  "scratchy throat": "sore throat",
  "dry cough": "cough",
  "wet cough": "cough",
  "persistent cough": "cough",
  // Pain
  "head pain": "headache",
  "migraine": "headache",
  "body aches": "muscle aches",
  "body pain": "muscle aches",
  "joint pain": "muscle aches",
  // Gastrointestinal
  "feeling sick": "nausea",
  "queasy": "nausea",
  "throwing up": "vomiting",
  "being sick": "vomiting",
  "stomach ache": "abdominal pain",
  "tummy pain": "abdominal pain",
  "stomach pain": "abdominal pain",
  "loose stools": "diarrhea",
  "watery stool": "diarrhea",
  // General
  "tiredness": "fatigue",
  "exhaustion": "fatigue",
  "feeling tired": "fatigue",
  "no energy": "fatigue",
  "shivering": "chills",
  "cold sweats": "sweating",
  "night sweats": "sweating",
  "watery eyes": "itchy eyes",
  "red eyes": "itchy eyes",
  "hard to breathe": "shortness of breath",
  "difficulty breathing": "shortness of breath",
  "breathlessness": "shortness of breath",
  "no appetite": "loss of appetite",
  "not hungry": "loss of appetite",
  "skin rash": "rash",
  "skin irritation": "rash",
};

/**
 * Expanded common symptoms list for extraction
 */
const COMMON_SYMPTOMS = [
  // Original
  "fever", "high fever", "mild fever", "cough", "headache", "nausea",
  "chills", "sneezing", "runny nose", "sore throat", "fatigue",
  "muscle aches", "sweating", "itchy eyes",
  // Expanded
  "vomiting", "diarrhea", "abdominal pain", "chest pain",
  "shortness of breath", "dizziness", "rash", "loss of appetite",
  "weight loss", "blurred vision", "back pain", "swelling",
  "numbness", "frequent urination", "dry mouth", "wheezing",
  "clear nasal discharge",
];

// Initial "Seed" Knowledge Base
// In a real app, this would be fetched from Supabase and cached locally
let localKB: KnowledgeBase = {
  "Common Cold": {
    symptoms: { "sneezing": 0.8, "runny nose": 0.9, "sore throat": 0.7, "cough": 0.6, "mild fever": 0.3 },
    urgency: "low",
    recommendations: ["Rest", "Hydration", "Vitamin C"],
    herbalAlternatives: ["Ginger tea", "Honey and lemon juice"],
    adjustmentCount: 0
  },
  "Influenza (Flu)": {
    symptoms: { "high fever": 0.9, "muscle aches": 0.8, "fatigue": 0.9, "cough": 0.7, "headache": 0.6 },
    urgency: "medium",
    recommendations: ["Rest", "Antipyretics", "Medical assessment if symptoms worsen"],
    herbalAlternatives: ["Elderberry syrup", "Echinacea tea"],
    adjustmentCount: 0
  },
  "Malaria": {
    symptoms: { "chills": 0.9, "high fever": 0.8, "sweating": 0.7, "headache": 0.6, "nausea": 0.5 },
    urgency: "high",
    recommendations: ["Seek medical testing for malaria immediately", "Antimalarial medication as prescribed"],
    herbalAlternatives: ["Artemisinin (under medical supervision)"],
    adjustmentCount: 0
  },
  "Allergic Rhinitis": {
    symptoms: { "sneezing": 0.9, "itchy eyes": 0.8, "runny nose": 0.7, "clear nasal discharge": 0.9 },
    urgency: "low",
    recommendations: ["Avoid triggers", "Antihistamines"],
    herbalAlternatives: ["Nettle leaf tea", "Quercetin-rich foods"],
    adjustmentCount: 0
  }
};

/**
 * Resolve symptom aliases to their canonical form.
 * If the symptom is already canonical, return it as-is.
 */
export function resolveAlias(symptom: string): string {
  const lower = symptom.toLowerCase().trim();
  return SYMPTOM_ALIASES[lower] || lower;
}

/**
 * PREDICT: Analyze symptoms and return possible diagnoses.
 *
 * Uses TF-IDF-inspired scoring:
 *   confidence = (Sum of matched weights) / (Sum of ALL weights for the disease)
 *
 * This normalizes against the disease's full symptom profile, so a disease
 * with 10 symptoms isn't unfairly boosted when only 2 match.
 */
export function predict(patientSymptoms: string[]): DiagnosisResult[] {
  const results: DiagnosisResult[] = [];
  // Resolve aliases for all patient symptoms
  const normalizedSymptoms = patientSymptoms.map(s => resolveAlias(s));

  for (const [disease, data] of Object.entries(localKB)) {
    let matchedWeight = 0;
    let matchCount = 0;

    // Sum of ALL weights for this disease (the "total profile weight")
    const totalDiseaseWeight = Object.values(data.symptoms).reduce((sum, w) => sum + w, 0);

    for (const symptom of normalizedSymptoms) {
      if (data.symptoms[symptom]) {
        matchedWeight += data.symptoms[symptom];
        matchCount++;
      }
    }

    if (matchCount > 0 && totalDiseaseWeight > 0) {
      // TF-IDF-inspired: matched weight as proportion of total disease profile
      const confidence = Math.min(matchedWeight / totalDiseaseWeight, 1.0);

      results.push({
        condition: disease,
        confidence: parseFloat(confidence.toFixed(2)),
        explanation: `Matches ${matchCount} of ${Object.keys(data.symptoms).length} known symptoms (${(confidence * 100).toFixed(0)}% profile match).`,
        urgency: data.urgency,
        recommendations: data.recommendations,
        herbalAlternatives: data.herbalAlternatives
      });
    }
  }

  // Sort by confidence, then by urgency for tiebreaking
  const urgencyOrder = { emergency: 0, high: 1, medium: 2, low: 3 };
  return results.sort((a, b) => {
    if (b.confidence !== a.confidence) return b.confidence - a.confidence;
    return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
  });
}

/**
 * Calculate the adaptive learning rate.
 * Decays over time so early feedback has bigger impact than late feedback.
 *
 * Formula: lr = BASE_LR / (1 + DECAY_FACTOR * adjustmentCount)
 */
const BASE_LEARNING_RATE = 0.1;
const DECAY_FACTOR = 0.01;

export function getLearningRate(adjustmentCount: number): number {
  return BASE_LEARNING_RATE / (1 + DECAY_FACTOR * adjustmentCount);
}

/**
 * COMPARE & ADJUST: Correct the AI and adjust internal weights.
 *
 * Improvements over the original:
 * 1. Learning rate decay — early feedback has bigger impact
 * 2. Negative reinforcement — misdiagnosed conditions get penalized
 * 3. Adjustment count tracking — enables learning rate decay
 *
 * @param patientSymptoms - The symptoms the patient reported
 * @param actualCondition - The condition the user confirmed
 * @param predictedCondition - The condition the engine predicted (for negative reinforcement)
 * @returns The updated knowledge base
 */
export function adjust(
  patientSymptoms: string[],
  actualCondition: string,
  predictedCondition?: string
): KnowledgeBase {
  const normalizedSymptoms = patientSymptoms.map(s => resolveAlias(s));

  // === POSITIVE REINFORCEMENT: Strengthen the actual condition ===

  // Ensure the disease exists in our KB — if not, create it (learns new diseases!)
  if (!localKB[actualCondition]) {
    localKB[actualCondition] = {
      symptoms: {},
      urgency: "medium",
      recommendations: ["Consult a healthcare professional for proper diagnosis"],
      herbalAlternatives: [],
      adjustmentCount: 0
    };
  }

  const actualData = localKB[actualCondition];
  const adjustCount = actualData.adjustmentCount || 0;
  const lr = getLearningRate(adjustCount);

  // Increase weight for matching symptoms in the ACTUAL condition
  for (const symptom of normalizedSymptoms) {
    const currentWeight = actualData.symptoms[symptom] || 0;
    actualData.symptoms[symptom] = Math.min(currentWeight + lr, 1.0);
  }

  // Increment adjustment count
  actualData.adjustmentCount = adjustCount + 1;

  // === NEGATIVE REINFORCEMENT: Penalize the misdiagnosed condition ===
  if (predictedCondition && predictedCondition !== actualCondition && localKB[predictedCondition]) {
    const predictedData = localKB[predictedCondition];
    const predictedAdjCount = predictedData.adjustmentCount || 0;
    const penaltyLr = getLearningRate(predictedAdjCount) * 0.5; // Half-strength penalty

    for (const symptom of normalizedSymptoms) {
      if (predictedData.symptoms[symptom]) {
        predictedData.symptoms[symptom] = Math.max(
          predictedData.symptoms[symptom] - penaltyLr,
          0.05 // Floor — never remove a symptom entirely
        );
      }
    }

    predictedData.adjustmentCount = predictedAdjCount + 1;
  }

  console.log(
    `[PCA] Knowledge Base adjusted: +reinforced "${actualCondition}" (lr=${lr.toFixed(4)})` +
    (predictedCondition && predictedCondition !== actualCondition
      ? `, -penalized "${predictedCondition}"`
      : '')
  );

  return localKB;
}

/**
 * Enhanced Symptom Extractor
 *
 * 1. Checks against an expanded list of ~30 common symptoms
 * 2. Resolves aliases (e.g. "stuffy nose" → "runny nose")
 * 3. Handles multi-word compound symptoms ("chest pain", "shortness of breath")
 */
export function extractSymptoms(text: string): string[] {
  const found: string[] = [];
  const lowerText = text.toLowerCase();

  // First: check for compound symptoms and aliases in the raw text
  const allTerms = [...COMMON_SYMPTOMS, ...Object.keys(SYMPTOM_ALIASES)];
  // Sort by length descending so longer multi-word matches take priority
  allTerms.sort((a, b) => b.length - a.length);

  for (const term of allTerms) {
    if (lowerText.includes(term)) {
      const resolved = resolveAlias(term);
      if (!found.includes(resolved)) {
        found.push(resolved);
      }
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

/**
 * Get the symptom aliases map (for testing/debugging)
 */
export function getSymptomAliases() {
  return { ...SYMPTOM_ALIASES };
}
