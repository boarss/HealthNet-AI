import { useState, useRef, ChangeEvent } from 'react';
import { Camera, Upload, FileSearch, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { analyzeMedicalImage } from '@/src/services/geminiService';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

export default function ImagingAnalysis() {
  const shouldReduceMotion = useReducedMotion();
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setImage(null);
    setAnalysis(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    try {
      const base64 = image.split(',')[1];
      const result = await analyzeMedicalImage(
        base64,
        'Analyze this medical image (X-ray, MRI, or skin condition). Provide a detailed report including potential findings, explainability of the AI’s reasoning, and next steps. Include a strong disclaimer.'
      );
      setAnalysis(result);
    } catch (error) {
      console.error(error);
      setAnalysis('Error analyzing image. Please ensure it is a valid medical image.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Upload card */}
      <Card className="border-none shadow-sm" aria-busy={isAnalyzing}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" aria-hidden="true" /> Medical Imaging
          </CardTitle>
          <CardDescription>
            Upload X-rays, MRIs, or photos of skin conditions for AI analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drop zone */}
          <div
            className="aspect-video bg-muted rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-200 hover:border-primary/40 hover:bg-primary/5 focus-within:border-primary/60"
            role="region"
            aria-label="Image upload area"
          >
            <AnimatePresence mode="wait">
              {image ? (
                <motion.div
                  key="image"
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full relative"
                >
                  <img
                    src={image}
                    alt="Uploaded medical image for analysis"
                    width={500}
                    height={281}
                    className="w-full h-full object-contain rounded-lg"
                  />
                  <button
                    onClick={handleClearImage}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-50 transition-colors duration-150 min-w-[32px] min-h-[32px] flex items-center justify-center border"
                    aria-label="Remove uploaded image"
                  >
                    <X className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-3 text-center"
                >
                  <Upload className="w-10 h-10 text-muted-foreground/50" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Upload a medical image</p>
                    <p className="text-xs text-muted-foreground/70 mt-0.5">X-ray, MRI, or skin condition photo</p>
                  </div>
                  <label
                    htmlFor="medical-image-input"
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline cursor-pointer px-3 py-1.5 rounded-full border border-primary/30 hover:bg-primary/5 transition-colors duration-150"
                  >
                    Choose File
                  </label>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hidden file input with visible label (above) */}
            <input
              ref={fileInputRef}
              id="medical-image-input"
              type="file"
              className={image ? 'hidden' : 'absolute inset-0 opacity-0 cursor-pointer'}
              onChange={handleImageUpload}
              accept="image/*"
              aria-label="Upload medical image"
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              className="flex-1"
              variant="outline"
              onClick={handleClearImage}
              disabled={!image}
              aria-label="Clear uploaded image"
            >
              Clear Image
            </Button>
            <Button
              className="flex-1 transition-all duration-150 active:scale-[0.98]"
              onClick={handleAnalyze}
              disabled={!image || isAnalyzing}
              aria-busy={isAnalyzing}
              aria-label={isAnalyzing ? 'Analyzing image…' : 'Analyze image with AI'}
            >
              {isAnalyzing ? 'Analyzing…' : 'Analyze with AI'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results card */}
      <Card className="border-none shadow-sm flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-primary" aria-hidden="true" /> Analysis Report
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-[400px] pr-4">
            <AnimatePresence mode="wait">
              {analysis ? (
                <motion.div
                  key="result"
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                  className="space-y-4"
                  role="region"
                  aria-label="AI analysis result"
                >
                  <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-xs text-orange-800 leading-relaxed">
                      <strong>AI Disclaimer:</strong> This analysis is generated by AI for educational purposes.
                      It is <em>not</em> a clinical diagnosis. Consult a licensed radiologist or physician for a definitive interpretation.
                    </p>
                  </div>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
                    {analysis}
                  </div>
                  <div className="flex items-center gap-2 pt-4 border-t">
                    <CheckCircle2 className="w-4 h-4 text-green-500" aria-hidden="true" />
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      Explainability Verified
                    </span>
                  </div>
                </motion.div>
              ) : isAnalyzing ? (
                <motion.div
                  key="loading"
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground"
                  role="status"
                  aria-label="Analyzing image…"
                >
                  <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" aria-hidden="true" />
                  <p className="text-sm">Analyzing image…</p>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-muted-foreground py-20 gap-4"
                >
                  <FileSearch className="w-12 h-12 opacity-20" aria-hidden="true" />
                  <p className="text-sm">Upload an image to see AI analysis</p>
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
