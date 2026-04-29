import { supabase } from '../lib/supabase';
import { Message, PatientData } from '../types';

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
};
