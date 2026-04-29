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
CREATE POLICY "Allow all access to messages" ON public.messages FOR ALL USING (true);
CREATE POLICY "Allow all access to patients" ON public.patients FOR ALL USING (true);
