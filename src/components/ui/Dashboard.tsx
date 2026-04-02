'use client';

import React from 'react';
import { NeoCard } from './NeoCard';
import { NeoButton } from './NeoButton';
import { Plus, Star, Trophy, Users, Calendar, ArrowRight, RotateCw, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GameCanvas from '../game/GameCanvas';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const [view, setView] = React.useState<'dashboard' | 'game'>('dashboard');
  const [isMobile, setIsMobile] = React.useState(false);
  const [isLandscape, setIsLandscape] = React.useState(true);

  React.useEffect(() => {
    const checkState = () => {
      setIsMobile(window.innerWidth < 1024);
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    checkState();
    window.addEventListener('resize', checkState);
    return () => window.removeEventListener('resize', checkState);
  }, []);
  const [tab, setTab] = React.useState<'progress' | 'history'>('progress');
  const history = useStore((state) => state.history);
  const totalStars = history.reduce((acc, session) => acc + session.stars, 0);
  const totalSessions = history.length;
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const currentDay = 4; // Thursday

  const handleStarClick = () => {
    const messages = [
      "Why click? No more stars for you! 😒",
      "Oops! Slipped or intentional? 😏",
      "Stop clicking! These stars are blinding! ✨",
      "Click again and I'll take a star away! 🔪",
      "This star is taken. Don't flirt! 💖",
      "Well done, human. Keep clicking! 🤖",
      "Click once, look handsome instantly! 😎",
      "Aww! What a beautiful finger! 👉👈",
      "Sorry, this button is just for show. 🤡",
      "Want more stars? Go play the game! 🎮",
      "Have you eaten? I'm worried about you. 🍛",
      "Finger tired? Take a rest! 😴"
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    toast.custom((t) => (
      <div 
        className="bg-primary border-neo shadow-neo rounded-2xl p-4 font-black text-black flex items-center gap-3 min-w-[300px] animate-in fade-in slide-in-from-top-4"
        onClick={() => toast.dismiss(t)}
      >
        <div className="w-8 h-8 flex items-center justify-center bg-white border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          ⭐
        </div>
        <p className="flex-1">{randomMessage}</p>
      </div>
    ));
  };

  return (
    <div className={cn(
      "mx-auto p-4 flex flex-col gap-6 min-h-screen relative overflow-hidden transition-all duration-500",
      view === 'dashboard' ? "max-w-md" : "max-w-screen-2xl w-full"
    )}>
      {/* Orientation Warning Overlay */}
      <AnimatePresence>
        {view === 'game' && isMobile && !isLandscape && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-primary flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="bg-white border-neo shadow-neo rounded-3xl p-8 flex flex-col items-center gap-6 max-w-xs">
              <div className="relative">
                <Smartphone className="w-16 h-16 animate-bounce" />
                <RotateCw className="w-8 h-8 absolute -bottom-2 -right-2 text-accent animate-spin-slow" />
              </div>
              <div>
                <h2 className="text-2xl font-black mb-2 uppercase">Rotate Device</h2>
                <p className="font-bold opacity-80 uppercase text-xs leading-relaxed">
                  Doodle Dash is best played in <span className="text-accent">LANDSCAPE</span> mode!<br/>
                  Please rotate your phone to start.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {view === 'dashboard' ? (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-8"
          >
            {/* Header */}
            <header className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-black tracking-tight">Doodle Dash</h1>
                <p className="text-gray-600 font-medium font-mono text-sm leading-tight uppercase">Welcome Back, Artist!</p>
              </div>
              <NeoButton 
                size="icon" 
                variant="outline" 
                className="rounded-full hover:rotate-12 transition-transform"
                onClick={handleStarClick}
              >
                <Star className="fill-primary" />
              </NeoButton>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <NeoCard variant="primary" className="flex flex-col gap-2">
                <Trophy className="w-6 h-6" />
                <div>
                  <div className="text-2xl font-black">{totalStars.toLocaleString()}</div>
                  <div className="text-xs font-bold uppercase opacity-70 leading-none">Total Stars</div>
                </div>
              </NeoCard>
              <NeoCard variant="white" className="flex flex-col gap-2">
                <Users className="w-6 h-6 text-accent" />
                <div>
                  <div className="text-2xl font-black">{totalSessions}</div>
                  <div className="text-xs font-bold uppercase opacity-70 leading-none">Runs Played</div>
                </div>
              </NeoCard>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-2xl border-2 border-black border-b-4">
              <button 
                onClick={() => setTab('progress')}
                className={`flex-1 py-2 font-black rounded-xl transition-colors ${tab === 'progress' ? 'bg-primary text-black' : 'hover:bg-white/50'}`}
              >
                PROGRESS
              </button>
              <button 
                onClick={() => setTab('history')}
                className={`flex-1 py-2 font-black rounded-xl transition-colors ${tab === 'history' ? 'bg-accent text-white' : 'hover:bg-white/50'}`}
              >
                HISTORY
              </button>
            </div>

            <AnimatePresence mode="wait">
              {tab === 'progress' ? (
                <motion.div
                  key="progress"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col gap-6"
                >
                  {/* Calendar Section */}
                  <NeoCard className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <h2 className="font-black text-xl flex items-center gap-2">
                        <Calendar className="w-5 h-5" /> Weekly Progress
                      </h2>
                      <span className="text-xs font-bold uppercase bg-black text-white px-2 py-0.5 rounded">April 2026</span>
                    </div>
                    <div className="flex justify-between">
                      {days.map((day, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <span className="text-[10px] font-black opacity-50">{day}</span>
                          <div 
                            className={`w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                              ${i === currentDay ? 'bg-primary' : 'bg-white'}
                            `}
                          >
                            {29 + i > 31 ? (29 + i - 31) : (29 + i)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </NeoCard>

                  {/* Design Challenge Card */}
                  <NeoCard variant="white" className="relative overflow-hidden group border-4">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform" />
                    <div className="relative z-10">
                      <div className="text-xs font-bold uppercase text-accent mb-1 tracking-widest">Featured Challenge</div>
                      <h3 className="text-2xl font-black leading-tight mb-2">Retro Doodle Platformer</h3>
                      <p className="text-sm font-medium text-gray-700 mb-6 max-w-[200px]">Complete the level using only triangles as platforms!</p>
                      
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 h-3 bg-gray-100 rounded-full border-2 border-black overflow-hidden">
                          <div className="h-full bg-primary w-[65%] border-r-2 border-black" />
                        </div>
                        <span className="text-sm font-black italic">65%</span>
                      </div>

                      <NeoButton variant="accent" className="w-full" onClick={() => setView('game')}>
                        PLAY NOW <ArrowRight className="w-5 h-5" />
                      </NeoButton>
                    </div>
                  </NeoCard>
                </motion.div>
              ) : (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col gap-4"
                >
                  {history.length > 0 ? (
                    history.map((session) => (
                      <NeoCard key={session.id} className="flex items-center gap-4 py-3">
                        <div className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-primary">
                          ★
                        </div>
                        <div className="flex-1">
                          <div className="font-black">{session.stars} Stars</div>
                          <div className="text-[10px] font-bold opacity-60 uppercase">{session.time}s • {session.date}</div>
                        </div>
                        <div className="text-xs font-black px-2 py-1 bg-black text-white rounded">NEW!</div>
                      </NeoCard>
                    ))
                  ) : (
                    <NeoCard className="text-center py-12 border-dashed opacity-50">
                      <div className="font-black uppercase mb-1 text-sm">No History Yet</div>
                      <div className="text-[10px] font-bold">Start playing to see your scores!</div>
                    </NeoCard>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            key="game"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col gap-6"
          >
            <div className="flex justify-between items-center px-2 max-lg:gap-4">
              <NeoButton variant="outline" size="sm" onClick={() => setView('dashboard')} className="max-lg:px-3 text-xs">
                {isMobile ? 'BACK' : 'BACK TO HUB'}
              </NeoButton>
              <div className="font-black text-xl lg:text-xl text-sm uppercase">Playing: Level 1</div>
            </div>
            
            <GameCanvas />
            
            {!isMobile && (
              <NeoCard variant="white" className="p-4 lg:p-6">
                <h4 className="font-black mb-2 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" /> HOW TO PLAY
                </h4>
                <ul className="text-sm font-bold opacity-80 grid grid-cols-2 gap-2">
                  <li>• Move: Arrows/WASD</li>
                  <li>• Jump: Space/W/Up</li>
                  <li>• Goal: Collect Stars</li>
                  <li>• Tip: Don't Fall!</li>
                </ul>
              </NeoCard>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
