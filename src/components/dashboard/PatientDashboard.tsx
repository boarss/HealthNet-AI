import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Heart, Thermometer, User, Clock, Calendar } from 'lucide-react';

export default function PatientDashboard() {
  const vitals = [
    { label: 'Heart Rate', value: '72 bpm', icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Blood Pressure', value: '120/80', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Temperature', value: '98.6 °F', icon: Thermometer, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  const conditions = ['Hypertension', 'Type 2 Diabetes (Managed)'];
  const medications = ['Metformin 500mg', 'Lisinopril 10mg'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {vitals.map((vital) => (
          <Card key={vital.label} className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${vital.bg}`}>
                <vital.icon className={`w-5 h-5 ${vital.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{vital.label}</p>
                <p className="text-xl font-bold">{vital.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Long-term Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {conditions.map((c) => (
              <div key={c} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                <span className="text-sm font-medium">{c}</span>
                <Badge variant="secondary" className="text-[10px]">Active</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Current Medications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {medications.map((m) => (
              <div key={m} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                <span className="text-sm font-medium">{m}</span>
                <Badge variant="outline" className="text-[10px]">Daily</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" /> Vaccination Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Influenza (Annual)</p>
                <p className="text-xs text-muted-foreground">Completed: Oct 2025</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Pneumococcal</p>
                <p className="text-xs text-muted-foreground">Due: April 2026</p>
              </div>
              <Badge variant="outline" className="text-orange-500 border-orange-200">Upcoming</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
