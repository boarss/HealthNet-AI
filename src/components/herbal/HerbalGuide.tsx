import { useState } from 'react';
import { Leaf, Search, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface Remedy {
  id: string;
  name: string;
  scientificName: string;
  benefits: string[];
  usage: string;
  warnings: string;
  category: 'Respiratory' | 'Digestive' | 'Immunity' | 'Stress' | 'Skin';
  suitability: string[];
}

const REMEDIES: Remedy[] = [
  {
    id: '1',
    name: 'Ginger',
    scientificName: 'Zingiber officinale',
    benefits: ['Nausea relief', 'Anti-inflammatory', 'Digestive aid'],
    usage: 'Fresh tea or supplement. Limit to 4 g daily.',
    warnings: 'May interact with blood thinners. Consult a doctor if pregnant.',
    category: 'Digestive',
    suitability: ['Adults', 'Older Adults', 'Women'],
  },
  {
    id: '2',
    name: 'Chamomile',
    scientificName: 'Matricaria chamomilla',
    benefits: ['Sleep aid', 'Anxiety reduction', 'Skin soothing'],
    usage: 'Brewed as tea 30–60 minutes before bed.',
    warnings: 'Avoid if allergic to ragweed or daisies.',
    category: 'Stress',
    suitability: ['Children', 'Adults', 'Older Adults', 'Women'],
  },
  {
    id: '3',
    name: 'Echinacea',
    scientificName: 'Echinacea purpurea',
    benefits: ['Immune system support', 'Common cold duration reduction'],
    usage: 'Tincture or tea at first sign of symptoms.',
    warnings: 'Not recommended for those with autoimmune disorders.',
    category: 'Immunity',
    suitability: ['Adults', 'Older Adults'],
  },
  {
    id: '4',
    name: 'Peppermint',
    scientificName: 'Mentha piperita',
    benefits: ['IBS relief', 'Headache reduction', 'Mental focus'],
    usage: 'Oil capsules for IBS; tea for general digestion.',
    warnings: 'May worsen heartburn/GERD.',
    category: 'Digestive',
    suitability: ['Children', 'Adults', 'Older Adults', 'Women'],
  },
  {
    id: '5',
    name: 'Turmeric',
    scientificName: 'Curcuma longa',
    benefits: ['Joint health', 'Anti-inflammatory', 'Heart health'],
    usage: 'Combined with black pepper for absorption in cooking or supplements.',
    warnings: 'High doses may cause stomach upset.',
    category: 'Immunity',
    suitability: ['Adults', 'Older Adults'],
  },
];

const CATEGORY_COLORS: Record<Remedy['category'], string> = {
  Respiratory: 'bg-sky-50 text-sky-700',
  Digestive: 'bg-amber-50 text-amber-700',
  Immunity: 'bg-green-50 text-green-700',
  Stress: 'bg-purple-50 text-purple-700',
  Skin: 'bg-pink-50 text-pink-700',
};

export default function HerbalGuide() {
  const shouldReduceMotion = useReducedMotion();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredRemedies = REMEDIES.filter(
    (r) =>
      (searchTerm === '' ||
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.benefits.some((b) => b.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (selectedCategory === null || r.category === selectedCategory)
  );

  const categories = Array.from(new Set(REMEDIES.map((r) => r.category)));

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Search + Filters */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start lg:items-center justify-between">
        <div className="relative w-full lg:w-96 group">
          <label htmlFor="herbal-search" className="sr-only">Search herbal remedies</label>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none" aria-hidden="true" />
          <Input
            id="herbal-search"
            name="herbal-search"
            placeholder="Search herbal remedies..."
            className="pl-12 bg-white border-none shadow-glass h-12 sm:h-14 rounded-2xl sm:rounded-3xl focus-visible:ring-2 focus-visible:ring-primary/20 text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search remedies or symptoms"
            autoComplete="off"
          />
        </div>
        <div
          className="flex flex-wrap gap-2 sm:gap-3 w-full lg:w-auto"
          role="group"
          aria-label="Filter by category"
        >
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="rounded-full h-8 sm:h-10 px-4 sm:px-6 font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-all active:scale-95"
            aria-pressed={selectedCategory === null}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="rounded-full h-8 sm:h-10 px-4 sm:px-6 font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-all active:scale-95"
              aria-pressed={selectedCategory === cat}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Results grid */}
      <div
        role="region"
        aria-live="polite"
        aria-label="Filtered results"
      >
        {filteredRemedies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 sm:py-32 text-slate-300 gap-4 sm:gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center shadow-inner">
              <Leaf className="w-10 h-10 sm:w-12 sm:h-12 opacity-20" />
            </div>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest">No matching remedies</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredRemedies.map((remedy, i) => (
                <motion.div
                  key={remedy.id}
                  layout
                  initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.2,
                    ease: [0.25, 1, 0.5, 1],
                    delay: shouldReduceMotion ? 0 : i * 0.04,
                  }}
                >
                  <Card className="border-none shadow-glass card-interactive h-full flex flex-col rounded-[24px] sm:rounded-[32px] overflow-hidden">
                    <CardHeader className="p-6 sm:p-8 pb-3 sm:pb-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2.5 sm:p-3 bg-green-50 rounded-xl sm:rounded-2xl ring-4 ring-white/30" aria-hidden="true">
                          <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                        </div>
                        <Badge
                          variant="secondary"
                          className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 sm:px-3 py-0.5 sm:py-1 ${CATEGORY_COLORS[remedy.category] || ''}`}
                        >
                          {remedy.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl sm:text-2xl font-black text-slate-900">{remedy.name}</CardTitle>
                      <CardDescription className="italic text-xs sm:text-sm font-medium text-slate-400 mt-1">{remedy.scientificName}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 sm:p-8 pt-0 flex-1 space-y-5 sm:space-y-6">
                      <div className="space-y-2 sm:space-y-3">
                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">Primary Benefits</p>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {remedy.benefits.map((b) => (
                            <Badge
                              key={b}
                              variant="outline"
                              className="text-[9px] sm:text-[10px] font-bold bg-green-50/20 border-green-100 text-slate-600 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg"
                            >
                              {b}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">Preparation & Dosage</p>
                        <p className="text-xs sm:text-[13px] font-medium text-slate-600 leading-relaxed">{remedy.usage}</p>
                      </div>

                      <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100" role="note">
                        <div className="flex gap-2 sm:gap-3 items-start">
                          <AlertCircle className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                          <p className="text-[10px] sm:text-xs text-orange-800 leading-relaxed font-semibold">
                            <strong className="uppercase">Safety:</strong> {remedy.warnings}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 sm:pt-6 border-t border-slate-100">
                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 sm:mb-3">Suitability Registry</p>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {remedy.suitability.map((s) => (
                            <span
                              key={s}
                              className="inline-flex items-center text-[9px] sm:text-[10px] bg-primary/5 text-primary px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-black uppercase tracking-tighter"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* CTA Banner - Optimized for mobile flow */}
      <Card className="border-none shadow-glass bg-primary/5 rounded-[28px] sm:rounded-[40px] overflow-hidden">
        <CardContent className="p-6 sm:p-10">
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-10 items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-[24px] sm:rounded-[32px] shadow-sm flex items-center justify-center shrink-0">
              <Leaf className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <div className="flex-1 text-center lg:text-left space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Need Targeted Advice?</h3>
              <p className="text-sm sm:text-base font-medium text-slate-600 leading-relaxed">
                Our AI can analyze your unique health profile to suggest bio-compatible botanicals that avoid drug-herb interactions.
              </p>
            </div>
            <Button className="w-full lg:w-auto rounded-xl sm:rounded-2xl h-12 sm:h-14 px-8 sm:px-10 font-black uppercase tracking-widest text-[10px] sm:text-[12px] shadow-xl shadow-primary/10 active:scale-95 transition-all">
              Consult Clinical Intelligence
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
