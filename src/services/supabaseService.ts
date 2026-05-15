import { supabase } from '../lib/supabase';
import { Message, PatientData, TrainingEvent } from '../types';

export const supabaseService = {
  // Chat History
  async saveMessage(chatId: string, message: Message) {
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          chat_id: chatId,
          role: message.role,
          content: message.content,
          timestamp: new Date(message.timestamp).toISOString(),
          type: message.type,
          reasoning: message.reasoning,
          metadata: message.metadata,
        },
      ]);

    if (error) throw error;
    return data;
  },

  async getChatHistory(chatId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('timestamp', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Patient Data (Vitals)
  async updatePatientVitals(patientId: string, vitals: PatientData['vitalSigns']) {
    const { data, error } = await supabase
      .from('patients')
      .update({ vital_signs: vitals })
      .eq('id', patientId);

    if (error) throw error;
    return data;
  },

  async getPatientData(patientId: string) {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .single();

    if (error) throw error;
    return data;
  },

  // Medical Knowledge Base
  async getMedicalKnowledge() {
    const { data, error } = await supabase
      .from('medical_knowledge')
      .select('*');

    if (error) throw error;
    return data;
  },

  async updateMedicalKnowledge(disease: string, data: any) {
    const { error } = await supabase
      .from('medical_knowledge')
      .upsert({
        disease,
        symptoms: data.symptoms,
        urgency: data.urgency,
        recommendations: data.recommendations,
        herbal_alternatives: data.herbalAlternatives,
        adjustment_count: data.adjustmentCount || 0,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
  },

  // Training Events — Predict-Compare-Adjust History
  async saveTrainingEvent(event: Omit<TrainingEvent, 'id'>) {
    const { data, error } = await supabase
      .from('training_events')
      .insert([{
        reported_symptoms: event.reportedSymptoms,
        predicted_condition: event.predictedCondition,
        predicted_confidence: event.predictedConfidence,
        actual_condition: event.actualCondition,
        was_correct: event.wasCorrect,
      }]);

    if (error) throw error;
    return data;
  },

  async getTrainingHistory(limit = 50) {
    const { data, error } = await supabase
      .from('training_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }
};

