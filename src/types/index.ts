/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  type?: 'text' | 'diagnosis' | 'recommendation' | 'image_analysis';
  reasoning?: {
    steps: string[];
    confidence: number;
    sources?: string[];
  };
  metadata?: any;
}

export interface PatientData {
  age: number;
  gender: 'male' | 'female' | 'other';
  symptoms: string[];
  chronicConditions: string[];
  medications: string[];
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
  };
}

export interface DiagnosisResult {
  condition: string;
  confidence: number;
  explanation: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  recommendations: string[];
  herbalAlternatives?: string[];
}
