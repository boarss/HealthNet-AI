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

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans text-slate-900">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="w-72 bg-white border-r flex flex-col z-50 fixed inset-y-0 lg:relative"
          >
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <h1 className="font-bold text-xl tracking-tight">HealthNet</h1>
              </div>
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">Main Menu</div>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-slate-600 hover:bg-slate-50">
                <Plus className="w-5 h-5" /> New Consultation
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-slate-600 hover:bg-slate-50">
                <Settings className="w-5 h-5" /> Settings
              </Button>
            </nav>

            <div className="p-4 border-t">
              <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
                <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                  <AvatarImage src="https://picsum.photos/seed/user/100/100" referrerPolicy="no-referrer" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold truncate">Jane Doe</p>
                  <p className="text-[10px] text-slate-500 truncate">Premium Member</p>
                </div>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-destructive">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                <Menu className="w-5 h-5" />
              </Button>
            )}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Network:</span>
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-100">Primary Care Alpha</Badge>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Clock className="w-3 h-3" /> Last sync: Just now
            </div>
            <Button variant="outline" size="sm" className="gap-2 rounded-full">
              <Shield className="w-4 h-4" /> Secure Access
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 max-w-7xl mx-auto w-full">
          <Tabs defaultValue="chat" className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Health Dashboard</h2>
                <p className="text-slate-500 mt-1">AI-powered primary care for your family.</p>
              </div>
              <TabsList className="bg-white border p-1 h-12 rounded-xl shadow-sm">
                <TabsTrigger value="chat" className="rounded-lg px-6 gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <MessageSquare className="w-4 h-4" /> Chat
                </TabsTrigger>
                <TabsTrigger value="dashboard" className="rounded-lg px-6 gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Activity className="w-4 h-4" /> Vitals
                </TabsTrigger>
                <TabsTrigger value="imaging" className="rounded-lg px-6 gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Camera className="w-4 h-4" /> Imaging
                </TabsTrigger>
                <TabsTrigger value="herbal" className="rounded-lg px-6 gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Leaf className="w-4 h-4" /> Herbal
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="chat" className="mt-0 focus-visible:outline-none">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2">
                  <ChatInterface />
                </div>
                <div className="space-y-8">
                  <Disclaimer />
                  <Card className="border-none shadow-sm bg-primary/5">
                    <CardHeader>
                      <CardTitle className="text-sm font-bold uppercase tracking-wider">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" className="w-full justify-start bg-white">Schedule Vaccination</Button>
                      <Button variant="outline" className="w-full justify-start bg-white">Renew Prescription</Button>
                      <Button variant="outline" className="w-full justify-start bg-white">Find Nearest Clinic</Button>
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

function Clock({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
