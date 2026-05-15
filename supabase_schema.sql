-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id SERIAL PRIMARY KEY,
    chat_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    type TEXT,
    reasoning JSONB,
    metadata JSONB
);

-- Create patients table
CREATE TABLE IF NOT EXISTS public.patients (
    id TEXT PRIMARY KEY,
    full_name TEXT,
    vital_signs JSONB,
    conditions TEXT[],
    medications TEXT[],
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert dummy patient for testing
INSERT INTO public.patients (id, full_name, vital_signs, conditions, medications)
VALUES (
    'patient-123',
    'Jane Doe',
    '{"bloodPressure": "120/80", "heartRate": 72, "temperature": 98.6}',
    ARRAY['Hypertension', 'Type 2 Diabetes (Managed)'],
    ARRAY['Metformin 500 mg', 'Lisinopril 10 mg']
) ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Create policies (Allowing all for Alpha testing, adjust for production)
DROP POLICY IF EXISTS "Allow all access to messages" ON public.messages;
CREATE POLICY "Allow all access to messages" ON public.messages FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to patients" ON public.patients;
CREATE POLICY "Allow all access to patients" ON public.patients FOR ALL USING (true);

-- Create medical_knowledge table
CREATE TABLE IF NOT EXISTS public.medical_knowledge (
    disease TEXT PRIMARY KEY,
    symptoms JSONB NOT NULL,
    urgency TEXT NOT NULL,
    recommendations TEXT[],
    herbal_alternatives TEXT[],
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.medical_knowledge ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Allow all access to medical_knowledge" ON public.medical_knowledge;
CREATE POLICY "Allow all access to medical_knowledge" ON public.medical_knowledge FOR ALL USING (true);

-- Add adjustment count to medical_knowledge for learning rate decay
ALTER TABLE public.medical_knowledge ADD COLUMN IF NOT EXISTS adjustment_count INTEGER DEFAULT 0;

-- Create training_events table to track every compare-adjust interaction
CREATE TABLE IF NOT EXISTS public.training_events (
    id SERIAL PRIMARY KEY,
    reported_symptoms TEXT[],
    predicted_condition TEXT NOT NULL,
    predicted_confidence NUMERIC NOT NULL,
    actual_condition TEXT NOT NULL,
    was_correct BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for training_events
ALTER TABLE public.training_events ENABLE ROW LEVEL SECURITY;

-- Create policies for training_events
DROP POLICY IF EXISTS "Allow all access to training_events" ON public.training_events;
CREATE POLICY "Allow all access to training_events" ON public.training_events FOR ALL USING (true);
