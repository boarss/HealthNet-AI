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
    <div className="space-y-6">
      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-80">
          <label htmlFor="herbal-search" className="sr-only">Search herbal remedies</label>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
          <Input
            id="herbal-search"
            name="herbal-search"
            placeholder="Search remedies or symptoms…"
            className="pl-10 bg-white border-none shadow-sm h-11 rounded-full focus-visible:ring-2 focus-visible:ring-primary/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search remedies or symptoms"
            autoComplete="off"
          />
        </div>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by category"
        >
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="rounded-full transition-all duration-150 active:scale-95"
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
              className="rounded-full transition-all duration-150 active:scale-95"
              aria-pressed={selectedCategory === cat}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Results grid — aria-live for filter changes */}
      <div
        role="region"
        aria-live="polite"
        aria-label="Filtered herbal remedy results"
      >
        {filteredRemedies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
            <Leaf className="w-12 h-12 opacity-20" aria-hidden="true" />
            <p className="text-sm">No remedies found. Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                  <Card className="border-none shadow-sm card-interactive h-full flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start mb-3">
                        <div className="p-2 bg-green-50 rounded-lg" aria-hidden="true">
                          <Leaf className="w-5 h-5 text-green-600" />
                        </div>
                        <Badge
                          variant="secondary"
                          className={`text-[10px] uppercase tracking-wider ${CATEGORY_COLORS[remedy.category] || ''}`}
                        >
                          {remedy.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{remedy.name}</CardTitle>
                      <CardDescription className="italic text-xs">{remedy.scientificName}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Key Benefits</p>
                        <div className="flex flex-wrap gap-1" role="list" aria-label={`Benefits of ${remedy.name}`}>
                          {remedy.benefits.map((b) => (
                            <Badge
                              key={b}
                              variant="outline"
                              className="text-[10px] font-normal bg-green-50/30"
                              role="listitem"
                            >
                              {b}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Recommended Usage</p>
                        <p className="text-xs text-slate-600 leading-relaxed">{remedy.usage}</p>
                      </div>

                      <div className="p-3 bg-orange-50/50 rounded-xl border border-orange-100" role="note" aria-label={`Safety warning for ${remedy.name}`}>
                        <div className="flex gap-2 items-start">
                          <AlertCircle className="w-3 h-3 text-orange-500 shrink-0 mt-0.5" aria-hidden="true" />
                          <p className="text-[10px] text-orange-800 leading-tight">
                            <strong>Safety:</strong> {remedy.warnings}
                          </p>
                        </div>
                      </div>

                      {/* Suitability — accessible tag list */}
                      <div className="pt-2 border-t">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Suitable For</p>
                        <div className="flex flex-wrap gap-1" role="list" aria-label={`Who ${remedy.name} is suitable for`}>
                          {remedy.suitability.map((s) => (
                            <span
                              key={s}
                              role="listitem"
                              className="inline-flex items-center text-[10px] bg-primary/8 text-primary px-2 py-0.5 rounded-full font-medium"
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

      {/* CTA Banner */}
      <Card className="border-none shadow-sm bg-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="p-4 bg-white rounded-2xl shadow-sm shrink-0" aria-hidden="true">
              <Leaf className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-bold">Need a Personalized Recommendation?</h3>
              <p className="text-sm text-slate-600 mt-1">
                Our AI can analyze your specific health profile and suggest natural alternatives that won’t interfere with your current medications.
              </p>
            </div>
            <Button className="rounded-full px-8 shrink-0 transition-all duration-150 active:scale-[0.98]">
              Ask HealthNet AI
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
