import { describe, it, expect, beforeEach } from 'vitest';
import {
  predict,
  adjust,
  extractSymptoms,
  resolveAlias,
  getLearningRate,
  setKnowledgeBase,
  getKnowledgeBase,
  KnowledgeBase
} from './medicalEngine';

// Fresh KB for each test to avoid cross-contamination
const createFreshKB = (): KnowledgeBase => ({
  "Common Cold": {
    symptoms: { "sneezing": 0.8, "runny nose": 0.9, "sore throat": 0.7, "cough": 0.6, "mild fever": 0.3 },
    urgency: "low",
    recommendations: ["Rest", "Hydration"],
    herbalAlternatives: ["Ginger tea"],
    adjustmentCount: 0
  },
  "Influenza (Flu)": {
    symptoms: { "high fever": 0.9, "muscle aches": 0.8, "fatigue": 0.9, "cough": 0.7, "headache": 0.6 },
    urgency: "medium",
    recommendations: ["Rest", "Antipyretics"],
    herbalAlternatives: ["Elderberry syrup"],
    adjustmentCount: 0
  },
  "Malaria": {
    symptoms: { "chills": 0.9, "high fever": 0.8, "sweating": 0.7, "headache": 0.6, "nausea": 0.5 },
    urgency: "high",
    recommendations: ["Seek medical testing"],
    herbalAlternatives: ["Artemisinin"],
    adjustmentCount: 0
  },
});

describe('medicalEngine', () => {
  beforeEach(() => {
    setKnowledgeBase(createFreshKB());
  });

  // ─── resolveAlias ────────────────────────────────────────────────────
  describe('resolveAlias', () => {
    it('resolves known aliases to canonical symptom names', () => {
      expect(resolveAlias('stuffy nose')).toBe('runny nose');
      expect(resolveAlias('high temperature')).toBe('high fever');
      expect(resolveAlias('body aches')).toBe('muscle aches');
      expect(resolveAlias('tiredness')).toBe('fatigue');
      expect(resolveAlias('shivering')).toBe('chills');
    });

    it('returns canonical symptoms unchanged', () => {
      expect(resolveAlias('headache')).toBe('headache');
      expect(resolveAlias('cough')).toBe('cough');
      expect(resolveAlias('nausea')).toBe('nausea');
    });

    it('handles mixed case and whitespace', () => {
      expect(resolveAlias('  Stuffy Nose  ')).toBe('runny nose');
      expect(resolveAlias('HIGH TEMPERATURE')).toBe('high fever');
    });
  });

  // ─── predict ─────────────────────────────────────────────────────────
  describe('predict', () => {
    it('returns ranked results for known symptoms', () => {
      const results = predict(['chills', 'high fever', 'sweating', 'headache', 'nausea']);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].condition).toBe('Malaria');
      expect(results[0].confidence).toBeGreaterThan(0.5);
    });

    it('resolves aliases during prediction', () => {
      // "shivering" -> "chills", "high temperature" -> "high fever"
      const results = predict(['shivering', 'high temperature', 'sweating']);
      const malariaResult = results.find(r => r.condition === 'Malaria');
      expect(malariaResult).toBeDefined();
      expect(malariaResult!.confidence).toBeGreaterThan(0);
    });

    it('uses TF-IDF scoring - normalizes against disease profile weight', () => {
      // Malaria has total weight = 0.9+0.8+0.7+0.6+0.5 = 3.5
      // Matching chills(0.9) + high fever(0.8) = 1.7 / 3.5 ≈ 0.49
      const results = predict(['chills', 'high fever']);
      const malariaResult = results.find(r => r.condition === 'Malaria');
      expect(malariaResult).toBeDefined();
      expect(malariaResult!.confidence).toBeCloseTo(1.7 / 3.5, 1);
    });

    it('returns empty array when no symptoms match', () => {
      const results = predict(['xyz_unknown_symptom']);
      expect(results).toEqual([]);
    });

    it('uses urgency as tiebreaker when confidence is equal', () => {
      // Setup a scenario where two diseases have the same confidence
      setKnowledgeBase({
        "Disease A": { symptoms: { "headache": 1.0 }, urgency: "low", recommendations: [], adjustmentCount: 0 },
        "Disease B": { symptoms: { "headache": 1.0 }, urgency: "high", recommendations: [], adjustmentCount: 0 },
      });
      const results = predict(['headache']);
      expect(results[0].condition).toBe('Disease B'); // higher urgency comes first
    });
  });

  // ─── adjust (positive reinforcement) ─────────────────────────────────
  describe('adjust - positive reinforcement', () => {
    it('increases weights for the confirmed condition', () => {
      const kbBefore = getKnowledgeBase();
      const originalWeight = kbBefore['Common Cold'].symptoms['headache'] || 0;

      adjust(['headache'], 'Common Cold');

      const kbAfter = getKnowledgeBase();
      expect(kbAfter['Common Cold'].symptoms['headache']).toBeGreaterThan(originalWeight);
    });

    it('creates new diseases when adjusting for unknown conditions', () => {
      const kbBefore = getKnowledgeBase();
      expect(kbBefore['Typhoid']).toBeUndefined();

      adjust(['high fever', 'headache'], 'Typhoid');

      const kbAfter = getKnowledgeBase();
      expect(kbAfter['Typhoid']).toBeDefined();
      expect(kbAfter['Typhoid'].symptoms['high fever']).toBeGreaterThan(0);
      expect(kbAfter['Typhoid'].symptoms['headache']).toBeGreaterThan(0);
      expect(kbAfter['Typhoid'].adjustmentCount).toBe(1);
    });

    it('caps weights at 1.0', () => {
      // Adjust many times to try to exceed 1.0
      for (let i = 0; i < 50; i++) {
        adjust(['sneezing'], 'Common Cold');
      }
      const kb = getKnowledgeBase();
      expect(kb['Common Cold'].symptoms['sneezing']).toBeLessThanOrEqual(1.0);
    });

    it('increments adjustmentCount', () => {
      adjust(['headache'], 'Common Cold');
      adjust(['headache'], 'Common Cold');
      adjust(['headache'], 'Common Cold');
      const kb = getKnowledgeBase();
      expect(kb['Common Cold'].adjustmentCount).toBe(3);
    });
  });

  // ─── adjust (negative reinforcement) ──────────────────────────────────
  describe('adjust - negative reinforcement', () => {
    it('decreases weights for the misdiagnosed condition', () => {
      const kbBefore = getKnowledgeBase();
      const originalWeight = kbBefore['Malaria'].symptoms['chills'];

      // User says it's actually "Influenza (Flu)" but engine predicted "Malaria"
      adjust(['chills', 'high fever'], 'Influenza (Flu)', 'Malaria');

      const kbAfter = getKnowledgeBase();
      expect(kbAfter['Malaria'].symptoms['chills']).toBeLessThan(originalWeight);
    });

    it('never removes a symptom entirely (floor at 0.05)', () => {
      // Penalize many times
      for (let i = 0; i < 100; i++) {
        adjust(['chills'], 'Influenza (Flu)', 'Malaria');
      }
      const kb = getKnowledgeBase();
      expect(kb['Malaria'].symptoms['chills']).toBeGreaterThanOrEqual(0.05);
    });

    it('does not penalize when predicted matches actual', () => {
      const kbBefore = getKnowledgeBase();
      const originalWeight = kbBefore['Malaria'].symptoms['chills'];

      adjust(['chills'], 'Malaria', 'Malaria'); // correct prediction

      const kbAfter = getKnowledgeBase();
      // Weight should increase (positive), not decrease
      expect(kbAfter['Malaria'].symptoms['chills']).toBeGreaterThanOrEqual(originalWeight);
    });
  });

  // ─── getLearningRate ──────────────────────────────────────────────────
  describe('getLearningRate', () => {
    it('starts at BASE_LEARNING_RATE for adjustmentCount = 0', () => {
      expect(getLearningRate(0)).toBeCloseTo(0.1, 5);
    });

    it('decays over time', () => {
      const lr0 = getLearningRate(0);
      const lr10 = getLearningRate(10);
      const lr100 = getLearningRate(100);

      expect(lr10).toBeLessThan(lr0);
      expect(lr100).toBeLessThan(lr10);
    });

    it('never reaches zero', () => {
      const lr = getLearningRate(10000);
      expect(lr).toBeGreaterThan(0);
    });
  });

  // ─── extractSymptoms ─────────────────────────────────────────────────
  describe('extractSymptoms', () => {
    it('extracts simple symptoms from text', () => {
      const symptoms = extractSymptoms('I have a headache and fever');
      expect(symptoms).toContain('headache');
      expect(symptoms).toContain('fever');
    });

    it('extracts compound symptoms', () => {
      const symptoms = extractSymptoms('I am experiencing chest pain and shortness of breath');
      expect(symptoms).toContain('chest pain');
      expect(symptoms).toContain('shortness of breath');
    });

    it('resolves aliases during extraction', () => {
      const symptoms = extractSymptoms('I feel tiredness and have a stuffy nose');
      expect(symptoms).toContain('fatigue');       // alias of "tiredness"
      expect(symptoms).toContain('runny nose');     // alias of "stuffy nose"
    });

    it('does not produce duplicates from both canonical and alias', () => {
      // Text contains both "runny nose" (canonical) and "stuffy nose" (alias -> runny nose)
      const symptoms = extractSymptoms('I have a runny nose, very stuffy nose');
      const runnyNoseCount = symptoms.filter(s => s === 'runny nose').length;
      expect(runnyNoseCount).toBe(1);
    });

    it('returns empty array when no symptoms found', () => {
      const symptoms = extractSymptoms('Hello, how are you today?');
      expect(symptoms).toEqual([]);
    });
  });
});
