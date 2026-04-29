import { useState } from 'react';
import { useWebHaptics } from 'web-haptics/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, MessageSquare, Camera, Shield, Menu, X, Plus, Settings, LogOut, Leaf } from 'lucide-react';
import ChatInterface from './components/chat/ChatInterface';
import PatientDashboard from './components/dashboard/PatientDashboard';
import ImagingAnalysis from './components/imaging/ImagingAnalysis';
import HerbalGuide from './components/herbal/HerbalGuide';
import Disclaimer from './components/legal/Disclaimer';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'motion/react';

const SPRING = { type: 'spring', stiffness: 300, damping: 30 } as const;
const SIDEBAR_ITEMS = [
  { icon: Plus, label: 'New Consultation' },
  { icon: Settings, label: 'Settings' },
];

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { trigger } = useWebHaptics();

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 relative overflow-hidden selection:bg-primary/10">
      {/* Dynamic ambient background blobs - refined colors and blur */}
      <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[140px] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[70%] h-[70%] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" aria-hidden="true" />

      {/* Mobile backdrop overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
            role="button"
            tabIndex={-1}
            onClick={() => {
              trigger('nudge');
              setIsSidebarOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -288, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -288, opacity: 0 }}
            transition={SPRING}
            aria-label="Application sidebar"
            className="w-72 glass-panel flex flex-col z-50 fixed inset-y-0 lg:relative overflow-hidden m-4 rounded-3xl"
          >
            {/* Logo Section */}
            <div className="p-8 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div
                  className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 ring-4 ring-primary/5"
                  aria-hidden="true"
                >
                  <Activity className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="font-extrabold text-xl tracking-tight leading-none" translate="no">HealthNet</h1>
                  <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mt-1">Intelligent Care</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-full hover:bg-slate-100 transition-colors"
                onClick={() => {
                  trigger('nudge');
                  setIsSidebarOpen(false);
                }}
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1.5 mt-2" role="navigation" aria-label="Main navigation">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] px-4 mb-4">
                Main Menu
              </p>
              {SIDEBAR_ITEMS.map(({ icon: Icon, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3.5 h-12 text-slate-600 hover:bg-slate-100/50 hover:text-slate-900 rounded-xl px-4 group transition-all duration-200"
                  >
                    <Icon className="w-4.5 h-4.5 shrink-0 text-slate-400 group-hover:text-primary transition-colors" aria-hidden="true" />
                    <span className="font-semibold">{label}</span>
                  </Button>
                </motion.div>
              ))}
            </nav>

            {/* User profile section - elevated glass look */}
            <div className="p-6 mt-auto">
              <div className="bg-white/40 border border-white/50 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm group hover:bg-white/60 transition-colors duration-200 cursor-pointer">
                <div className="relative">
                  <Avatar className="w-11 h-11 border-2 border-white shadow-sm shrink-0 ring-2 ring-emerald-500/20">
                    <AvatarImage
                      src="https://picsum.photos/seed/user/100/100"
                      alt="Jane Doe avatar"
                      width={44}
                      height={44}
                      referrerPolicy="no-referrer"
                    />
                    <AvatarFallback aria-hidden="true">JD</AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shimmer" />
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="text-sm font-bold text-slate-900 truncate">Jane Doe</p>
                  <p className="text-[11px] font-medium text-slate-500 truncate">Premium Member</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-destructive shrink-0 transition-colors"
                  aria-label="Log out"
                >
                  <LogOut className="w-4.5 h-4.5" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative" role="main">
        {/* Header - transparent glass sync with content */}
        <header
          role="banner"
          className="h-20 px-6 md:px-10 flex items-center justify-between sticky top-0 z-40"
        >
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    trigger('nudge');
                    setIsSidebarOpen(true);
                  }}
                  aria-label="Open sidebar"
                  className="rounded-full bg-white/50 backdrop-blur-md shadow-sm border border-white h-11 w-11"
                >
                  <Menu className="w-5 h-5" aria-hidden="true" />
                </Button>
              </motion.div>
            )}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Network Status</span>
              <Badge
                variant="secondary"
                className="bg-emerald-50 text-emerald-700 border-emerald-100/50 gap-2 px-3 py-1 rounded-full font-bold text-[10px]"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" aria-hidden="true" />
                PRIMARY CARE v1.4
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div
              className="hidden lg:flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] bg-white/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/50"
              aria-label="Last synced: Just now"
            >
              <Clock className="w-3.5 h-3.5 text-emerald-500" aria-hidden={true} /> SYNCED: JUST NOW
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-full bg-white/60 hover:bg-white backdrop-blur-md border-white/80 shadow-sm h-10 px-5 transition-all duration-200 hover:shadow-md"
              aria-label="Manage secure access"
            >
              <Shield className="w-4 h-4 text-primary" aria-hidden="true" /> 
              <span className="font-bold">SECURE PORTAL</span>
            </Button>
          </div>
        </header>

        {/* Content Area - Extra padding and alignment */}
        <div className="flex-1 overflow-y-auto px-6 md:px-10 pb-10 max-w-[1600px] mx-auto w-full">
          <Tabs defaultValue="chat" className="space-y-8" onValueChange={() => trigger('nudge')}>
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pt-4">
              <div className="space-y-1.5">
                <motion.h2 
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-black tracking-tight text-slate-900 lg:text-5xl"
                >
                  Dashboard
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="text-slate-500 text-base font-medium flex items-center gap-2"
                >
                  Welcome back, <span className="text-primary font-bold">Jane</span>. Your health at a glance.
                </motion.p>
              </div>
              
              <TabsList className="bg-slate-200/40 p-1.5 h-auto rounded-2xl gap-1.5 backdrop-blur-md">
                <TabsTrigger
                  value="chat"
                  className="rounded-xl px-5 py-3 gap-2.5 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-xl data-[state=active]:shadow-primary/5 transition-all duration-300"
                >
                  <MessageSquare className="w-4 h-4" aria-hidden="true" /> Chat
                </TabsTrigger>
                <TabsTrigger
                  value="dashboard"
                  className="rounded-xl px-5 py-3 gap-2.5 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-xl data-[state=active]:shadow-primary/5 transition-all duration-300"
                >
                  <Activity className="w-4 h-4" aria-hidden="true" /> Vitals
                </TabsTrigger>
                <TabsTrigger
                  value="imaging"
                  className="rounded-xl px-5 py-3 gap-2.5 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-xl data-[state=active]:shadow-primary/5 transition-all duration-300"
                >
                  <Camera className="w-4 h-4" aria-hidden="true" /> Imaging
                </TabsTrigger>
                <TabsTrigger
                  value="herbal"
                  className="rounded-xl px-5 py-3 gap-2.5 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-xl data-[state=active]:shadow-primary/5 transition-all duration-300"
                >
                  <Leaf className="w-4 h-4" aria-hidden="true" /> Herbal
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="chat" className="mt-0 focus-visible:outline-none">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="xl:col-span-8 h-full min-h-[600px]"
                >
                  <div className="glass-panel h-full rounded-[32px] overflow-hidden">
                    <ChatInterface />
                  </div>
                </motion.div>
                
                <div className="xl:col-span-4 space-y-8">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Disclaimer />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card className="border-none shadow-glass bg-gradient-to-br from-primary/10 to-transparent p-2 rounded-[32px]">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-primary/80">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {['Schedule Vaccination', 'Renew Prescription', 'Find Nearest Clinic'].map((action, i) => (
                          <Button 
                            key={action}
                            variant="ghost" 
                            className="w-full justify-between bg-white/50 hover:bg-white text-slate-700 font-bold h-14 px-6 rounded-2xl border border-white/50 transition-all duration-200 group"
                          >
                            {action}
                            <Plus className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                          </Button>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="dashboard" className="mt-0 focus-visible:outline-none">
              <PatientDashboard />
            </TabsContent>

            <TabsContent value="imaging" className="mt-0 focus-visible:outline-none">
              <ImagingAnalysis />
            </TabsContent>

            <TabsContent value="herbal" className="mt-0 focus-visible:outline-none">
              <HerbalGuide />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

function Clock({ className, 'aria-hidden': ariaHidden }: { className?: string; 'aria-hidden'?: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={ariaHidden}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
