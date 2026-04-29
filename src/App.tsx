import { useState } from 'react';
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

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans text-slate-900">
      {/* Mobile backdrop overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            aria-hidden="true"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -288 }}
            animate={{ x: 0 }}
            exit={{ x: -288 }}
            transition={SPRING}
            aria-label="Application sidebar"
            className="w-72 bg-white border-r flex flex-col z-50 fixed inset-y-0 shadow-xl lg:shadow-none lg:relative"
          >
            {/* Logo */}
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20"
                  aria-hidden="true"
                >
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <h1 className="font-bold text-xl tracking-tight">HealthNet</h1>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden min-w-[44px] min-h-[44px]"
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1 mt-2" role="navigation" aria-label="Main navigation">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-3">
                Main Menu
              </p>
              {SIDEBAR_ITEMS.map(({ icon: Icon, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-11 text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] transition-all duration-150"
                  >
                    <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                    {label}
                  </Button>
                </motion.div>
              ))}
            </nav>

            {/* User profile */}
            <div className="p-4 border-t">
              <div className="bg-slate-50 rounded-2xl p-3 flex items-center gap-3">
                <Avatar className="w-10 h-10 border-2 border-white shadow-sm shrink-0">
                  <AvatarImage
                    src="https://picsum.photos/seed/user/100/100"
                    alt="Jane Doe avatar"
                    width={40}
                    height={40}
                    referrerPolicy="no-referrer"
                  />
                  <AvatarFallback aria-hidden="true">JD</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="text-sm font-bold truncate">Jane Doe</p>
                  <p className="text-[10px] text-slate-500 truncate">Premium Member</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-destructive shrink-0 min-w-[44px] min-h-[44px] transition-colors duration-150"
                  aria-label="Log out"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden" role="main">
        {/* Header */}
        <header
          role="banner"
          className="h-16 bg-white/80 backdrop-blur-md border-b px-4 md:px-6 flex items-center justify-between sticky top-0 z-40"
        >
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Open sidebar"
                className="min-w-[44px] min-h-[44px]"
              >
                <Menu className="w-5 h-5" aria-hidden="true" />
              </Button>
            )}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Network:</span>
              <Badge
                variant="secondary"
                className="bg-green-50 text-green-700 border border-green-100 gap-1"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" aria-hidden="true" />
                Primary Care Alpha
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="hidden md:flex items-center gap-1 text-[10px] font-medium text-slate-400 uppercase tracking-widest"
              aria-label="Last synced: Just now"
            >
              <Clock className="w-3 h-3" aria-hidden={true} /> Last sync: Just now
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-full hover:bg-slate-50 transition-colors duration-150"
              aria-label="Manage secure access"
            >
              <Shield className="w-4 h-4" aria-hidden="true" /> Secure Access
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
          <Tabs defaultValue="chat" className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Health Dashboard</h2>
                <p className="text-slate-500 mt-1 text-sm">AI-powered primary care for your family.</p>
              </div>
              <TabsList className="bg-white border p-1 h-12 rounded-xl shadow-sm">
                <TabsTrigger
                  value="chat"
                  className="rounded-lg px-4 md:px-6 gap-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-150"
                >
                  <MessageSquare className="w-4 h-4" aria-hidden="true" /> Chat
                </TabsTrigger>
                <TabsTrigger
                  value="dashboard"
                  className="rounded-lg px-4 md:px-6 gap-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-150"
                >
                  <Activity className="w-4 h-4" aria-hidden="true" /> Vitals
                </TabsTrigger>
                <TabsTrigger
                  value="imaging"
                  className="rounded-lg px-4 md:px-6 gap-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-150"
                >
                  <Camera className="w-4 h-4" aria-hidden="true" /> Imaging
                </TabsTrigger>
                <TabsTrigger
                  value="herbal"
                  className="rounded-lg px-4 md:px-6 gap-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-150"
                >
                  <Leaf className="w-4 h-4" aria-hidden="true" /> Herbal
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="chat" className="mt-0 focus-visible:outline-none">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <ChatInterface />
                </div>
                <div className="space-y-6">
                  <Disclaimer />
                  <Card className="border-none shadow-sm bg-primary/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-bold uppercase tracking-wider">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" className="w-full justify-start bg-white hover:bg-slate-50 transition-colors duration-150">
                        Schedule Vaccination
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-white hover:bg-slate-50 transition-colors duration-150">
                        Renew Prescription
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-white hover:bg-slate-50 transition-colors duration-150">
                        Find Nearest Clinic
                      </Button>
                    </CardContent>
                  </Card>
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
