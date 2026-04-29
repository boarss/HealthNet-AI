import { ShieldAlert, Scale, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Disclaimer() {
  return (
    <Card
      className="border-none shadow-sm bg-destructive/5 border-l-4 border-l-destructive"
      role="note"
      aria-label="Ethical and legal disclaimer"
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-destructive">
          <ShieldAlert className="w-4 h-4 shrink-0" aria-hidden="true" /> Ethical &amp; Legal Notice
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs leading-relaxed text-destructive/90">
          HealthNet AI is an experimental clinical decision support system. It is designed to provide
          information and guidance based on AI models and rule-based systems.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-3">
            <Scale className="w-4 h-4 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1">Legal Status</p>
              <p className="text-[10px] leading-relaxed opacity-80">
                This software is <em>not</em> a medical device. It has not been cleared by the FDA or
                any other regulatory body for clinical use.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <FileText className="w-4 h-4 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1">Privacy &amp; Ethics</p>
              <p className="text-[10px] leading-relaxed opacity-80">
                Data is processed securely. We adhere to ethical AI principles, ensuring explainability
                and bias mitigation in our recommendations.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
