import { useState } from 'react';
import { Leaf, Search, Info, AlertCircle, CheckCircle2, Sprout, Wind, Droplets, Sun } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'motion/react';

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
    usage: 'Fresh tea or supplement. Limit to 4g daily.',
    warnings: 'May interact with blood thinners. Consult doctor if pregnant.',
    category: 'Digestive',
    suitability: ['Adults', 'Older Adults', 'Women'],
  },
  {
    id: '2',
    name: 'Chamomile',
    scientificName: 'Matricaria chamomilla',
    benefits: ['Sleep aid', 'Anxiety reduction', 'Skin soothing'],
    usage: 'Brewed as tea 30-60 minutes before bed.',
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
    usage: 'Oil capsules for IBS, tea for general digestion.',
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
  }
];

export default function HerbalGuide() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredRemedies = REMEDIES.filter(r => 
    (searchTerm === '' || r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.benefits.some(b => b.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (selectedCategory === null || r.category === selectedCategory)
  );

  const categories = Array.from(new Set(REMEDIES.map(r => r.category)));

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search remedies or symptoms..." 
            className="pl-10 bg-white border-none shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={selectedCategory === null ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setSelectedCategory(null)}
            className="rounded-full"
          >
            All
          </Button>
          {categories.map(cat => (
            <Button 
              key={cat} 
              variant={selectedCategory === cat ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setSelectedCategory(cat)}
              className="rounded-full"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredRemedies.map((remedy) => (
            <motion.div
              key={remedy.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card className="border-none shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Leaf className="w-5 h-5 text-green-600" />
                    </div>
                    <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">{remedy.category}</Badge>
                  </div>
                  <CardTitle className="text-xl mt-4">{remedy.name}</CardTitle>
                  <CardDescription className="italic text-xs">{remedy.scientificName}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Key Benefits</p>
                    <div className="flex flex-wrap gap-1">
                      {remedy.benefits.map(b => (
                        <Badge key={b} variant="outline" className="text-[10px] font-normal bg-green-50/30">{b}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Recommended Usage</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{remedy.usage}</p>
                  </div>

                  <div className="p-3 bg-orange-50/50 rounded-xl border border-orange-100">
                    <div className="flex gap-2 items-start">
                      <AlertCircle className="w-3 h-3 text-orange-500 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-orange-800 leading-tight">
                        <strong>Safety:</strong> {remedy.warnings}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t flex items-center justify-between">
                    <div className="flex gap-1">
                      {remedy.suitability.map(s => (
                        <div key={s} className="w-2 h-2 rounded-full bg-primary/20" title={`Suitable for ${s}`} />
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground">Evidence-based Guide</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Card className="border-none shadow-sm bg-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="p-4 bg-white rounded-2xl shadow-sm">
              <Sprout className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-bold">Need a Personalized Recommendation?</h3>
              <p className="text-sm text-slate-600 mt-1">Our AI can analyze your specific health profile and suggest natural alternatives that won't interfere with your current medications.</p>
            </div>
            <Button className="rounded-full px-8">Ask HealthNet AI</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
