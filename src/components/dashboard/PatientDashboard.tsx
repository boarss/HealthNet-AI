import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Heart, Thermometer, User, Clock, Calendar } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

const vitals = [
  { label: 'Heart Rate', value: '72', unit: 'bpm', icon: Heart, color: 'text-red-500', bg: 'bg-red-50', trend: 'Normal' },
  { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50', trend: 'Normal' },
  { label: 'Temperature', value: '98.6', unit: '°F', icon: Thermometer, color: 'text-orange-500', bg: 'bg-orange-50', trend: 'Normal' },
];

const conditions = ['Hypertension', 'Type 2 Diabetes (Managed)'];
const medications = ['Metformin 500 mg', 'Lisinopril 10 mg'];

const vaccinations = [
  {
    name: 'Influenza (Annual)',
    status: 'completed',
    date: new Intl.DateTimeFormat(undefined, { month: 'short', year: 'numeric' }).format(new Date('2025-10-01')),
  },
  {
    name: 'Pneumococcal',
    status: 'upcoming',
    date: new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(new Date('2026-04-01')),
  },
];

export default function PatientDashboard() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="space-y-6">
      {/* Vitals */}
      <section aria-label="Patient vitals" role="region">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 px-1">
          Current Vitals
        </h3>
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          role="status"
          aria-label="Real-time vitals overview"
          aria-live="polite"
        >
          {vitals.map((vital, i) => (
            <motion.div
              key={vital.label}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: shouldReduceMotion ? 0 : i * 0.08,
                duration: 0.3,
                ease: [0.25, 1, 0.5, 1],
              }}
            >
              <Card className="border-none shadow-sm card-interactive overflow-hidden">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${vital.bg} shrink-0`} aria-hidden="true">
                    <vital.icon className={`w-5 h-5 ${vital.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{vital.label}</p>
                    <p className="text-xl font-bold tabular-nums" aria-label={`${vital.label}: ${vital.value} ${vital.unit}`}>
                      {vital.value}
                      <span className="text-sm font-normal text-muted-foreground ml-1">{vital.unit}</span>
                    </p>
                  </div>
                  <Badge variant="secondary" className="ml-auto shrink-0 text-[10px] bg-green-50 text-green-700">
                    {vital.trend}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Conditions & Medications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <User className="w-4 h-4 text-primary" aria-hidden="true" /> Long-term Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {conditions.map((c) => (
              <div key={c} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30">
                <span className="text-sm font-medium">{c}</span>
                <Badge variant="secondary" className="text-[10px]" aria-label={`${c}: Active`}>Active</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" aria-hidden="true" /> Current Medications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {medications.map((m) => (
              <div key={m} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30">
                <span className="text-sm font-medium tabular-nums">{m}</span>
                <Badge variant="outline" className="text-[10px]" aria-label={`${m}: Daily`}>Daily</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Vaccination Schedule */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" aria-hidden="true" /> Vaccination Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4" role="list" aria-label="Vaccination history and upcoming">
            {vaccinations.map((v) => (
              <li key={v.name} className="flex items-center gap-4">
                <div
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${v.status === 'completed' ? 'bg-green-500' : 'bg-orange-400'}`}
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{v.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {v.status === 'completed' ? `Completed: ${v.date}` : `Due: ${v.date}`}
                  </p>
                </div>
                {v.status === 'upcoming' && (
                  <Badge variant="outline" className="text-orange-500 border-orange-200 shrink-0" aria-label="Vaccination upcoming">
                    Upcoming
                  </Badge>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
