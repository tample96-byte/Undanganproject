import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp, Heart } from 'lucide-react';

import { InvitationConfig } from './types';
import { INITIAL_CONFIG } from './initialConfig';
import Envelope from './components/Envelope';
import Hero from './components/Hero';
import Events from './components/Events';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [config, setConfig] = useState<InvitationConfig>(INITIAL_CONFIG);
  const [isOpened, setIsOpened] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Load custom configuration from URL and LocalStorage
  useEffect(() => {
    // 1. Get Guest Name from URL parameter (?to=Nama+Tamu)
    const params = new URLSearchParams(window.location.search);
    const toParam = params.get('to');
    if (toParam) {
      setGuestName(decodeURIComponent(toParam.replace(/\+/g, ' ')));
    } else {
      setGuestName('');
    }

    // 2. Load Config from LocalStorage
    const savedConfig = localStorage.getItem('wedding_invitation_config');
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (e) {
        console.error("Failed to parse saved config:", e);
      }
    }

    // 3. Handle Back To Top scroll listener
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update configuration & save to LocalStorage
  const handleUpdateConfig = (newConfig: InvitationConfig) => {
    setConfig(newConfig);
    localStorage.setItem('wedding_invitation_config', JSON.stringify(newConfig));
  };

  // Reset config back to default
  const handleResetConfig = () => {
    setConfig(INITIAL_CONFIG);
    localStorage.removeItem('wedding_invitation_config');
  };

  // Open the invitation (guest clicked the envelope button)
  const handleOpenInvitation = () => {
    setIsOpened(true);
    // Smooth scroll page back to top if not already there
    window.scrollTo({ top: 0 });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Get dynamic wedding year or custom text for footer
  const getWeddingFooterYear = () => {
    try {
      return new Date(config.weddingDate).getFullYear();
    } catch {
      return 2026;
    }
  };

  return (
    <div className="relative min-h-screen bg-cream-50 font-sans selection:bg-gold-200 selection:text-gold-800">
      
      {/* 1. Envelope Cover Layer */}
      <AnimatePresence>
        {!isOpened && (
          <Envelope
            config={config}
            guestName={guestName}
            onOpen={handleOpenInvitation}
          />
        )}
      </AnimatePresence>

      {/* 2. Main Invitation Content (Visible once opened) */}
      <div className={`transition-all duration-1000 ${isOpened ? 'opacity-100 animate-fade-in' : 'opacity-0 h-screen overflow-hidden'}`}>
        
        {/* Hero & Countdown Banner */}
        <Hero config={config} guestName={guestName} />

        {/* Schedule & Interactive Maps */}
        <Events config={config} />

        {/* Elegant Footer Quote & Credits */}
        <footer className="relative py-16 px-6 bg-charcoal-900 text-cream-100 text-center overflow-hidden">
          <div className="absolute inset-0 bg-sparkle pointer-events-none opacity-10" />
          
          <div className="max-w-2xl mx-auto z-10 relative flex flex-col items-center">
            {/* Heart divider */}
            <Heart className="w-8 h-8 text-gold-400 fill-gold-500 mb-6 animate-pulse" />
            
            <p className="font-serif text-2xl font-light text-gold-300 tracking-wide mb-3">
              Terima Kasih
            </p>
            
            <p className="text-xs text-gray-400 max-w-sm leading-relaxed mb-6 font-sans">
              Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu bagi kami.
            </p>
            
            <p className="font-cursive text-xl italic text-gold-200 mb-8">
              Sampai Jumpa di Hari Bahagia Kami
            </p>

            <div className="w-16 h-[1px] bg-gold-400/30 mb-8" />

            <h4 className="font-serif text-2xl font-extralight tracking-widest text-gold-400 mb-1">
              {config.coupleNameShort}
            </h4>
            <p className="font-display text-[9px] tracking-[0.2em] text-gray-500 uppercase font-bold">
              {getWeddingFooterYear()}
            </p>
          </div>
        </footer>

        {/* Floating CMS Admin customization panel */}
        <AdminPanel
          config={config}
          onUpdateConfig={handleUpdateConfig}
          onResetConfig={handleResetConfig}
        />

        {/* Floating Back-To-Top Button */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed bottom-6 right-6 z-40"
            >
              <button
                onClick={scrollToTop}
                className="cursor-pointer bg-white text-gold-600 border border-gold-300 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
                title="Kembali ke Atas"
                id="btn-back-to-top"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
