import { ShieldAlert, Scale, FileText, Info, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'motion/react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] } },
};

export default function Disclaimer() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      <motion.div variants={item}>
        <Card
          className="border-none shadow-sm bg-red-50/50 border-l-4 border-l-red-500 overflow-hidden"
          role="note"
          aria-label="Critical medical disclaimer"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black flex items-center gap-2 text-red-600 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 shrink-0" aria-hidden="true" /> Experimental System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs leading-relaxed text-slate-600 font-medium">
              HealthNet AI is an experimental clinical decision support system. It is designed to provide
              information and guidance based on AI models. <span className="font-bold text-red-600/80">Always consult a qualified healthcare professional.</span>
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 gap-4">
        <motion.div variants={item}>
          <div className="flex gap-4 p-4 rounded-2xl bg-amber-50/50 border border-amber-100/50 group hover:bg-amber-50 transition-colors duration-300">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-amber-600" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-amber-700 mb-1">Legal Status</p>
              <p className="text-[11px] leading-relaxed text-slate-500 font-medium">
                This software is <em className="text-amber-700 font-bold not-italic">not</em> a medical device. It has not been cleared by regulatory bodies for clinical use.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item}>
          <div className="flex gap-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50 group hover:bg-blue-50 transition-colors duration-300">
            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
              <Info className="w-4 h-4 text-blue-600" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-700 mb-1">Privacy &amp; Ethics</p>
              <p className="text-[11px] leading-relaxed text-slate-500 font-medium">
                Data is processed securely. We adhere to ethical AI principles, ensuring explainability and clinical safety safeguards.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
