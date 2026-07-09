import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp, Heart, Music, Play, Pause } from 'lucide-react';

import { InvitationConfig } from './types';
import { INITIAL_CONFIG } from './initialConfig';
import Envelope from './components/Envelope';
import Hero from './components/Hero';
import QuranVerse from './components/QuranVerse';
import Events from './components/Events';
import Gallery from './components/Gallery';
import TurutMengundang from './components/TurutMengundang';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [config, setConfig] = useState<InvitationConfig>(INITIAL_CONFIG);
  const [isOpened, setIsOpened] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Background Music States & Ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
        const parsed = JSON.parse(savedConfig);
        // Otomatis ubah Rian & Salsa ke Dayat & Uswah jika pengguna masih menyimpan cache lama
        if (parsed && parsed.coupleNameShort === "Rian & Salsa") {
          parsed.coupleNameShort = "Dayat & Uswah";
          localStorage.setItem('wedding_invitation_config', JSON.stringify(parsed));
        }
        setConfig(parsed);
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

  // Sync Audio source when config.musicUrl changes
  useEffect(() => {
    if (audioRef.current) {
      const wasPlaying = isPlaying;
      audioRef.current.src = config.musicUrl || '';
      audioRef.current.load();
      if (wasPlaying && isOpened) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(e => console.log("Audio play failed on source change:", e));
      }
    }
  }, [config.musicUrl]);

  // Update configuration & save to LocalStorage
  const handleUpdateConfig = (newConfig: InvitationConfig) => {
    setConfig(newConfig);
    localStorage.setItem('wedding_invitation_config', JSON.stringify(newConfig));
  };

  // Reset config back to default
  const handleResetConfig = () => {
    setConfig(INITIAL_CONFIG);
    localStorage.removeItem('wedding_invitation_config');
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Open the invitation (guest clicked the envelope button)
  const handleOpenInvitation = () => {
    setIsOpened(true);
    // Smooth scroll page back to top if not already there
    window.scrollTo({ top: 0 });
    
    // Play audio once user interacts with "Buka Undangan"
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => {
          console.log("Audio play failed on open:", e);
          setIsPlaying(false);
        });
    }
  };

  // Toggle Play/Pause background music
  const togglePlayMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => console.log("Audio play failed on toggle:", e));
    }
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
      
      {/* Hidden Audio Tag */}
      <audio ref={audioRef} loop className="hidden" />

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

        {/* Elegant Quranic Marriage Verse Section */}
        <QuranVerse config={config} />

        {/* Schedule & Interactive Maps */}
        <Events config={config} />

        {/* Elegant Photo Gallery */}
        <Gallery images={config.galleryImages} />

        {/* Custom "Turut Mengundang" List Section */}
        <TurutMengundang config={config} />

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

        {/* Floating Music Control Button (Bottom-Left) */}
        <AnimatePresence>
          {isOpened && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed bottom-6 left-6 z-40"
            >
              <button
                onClick={togglePlayMusic}
                className="cursor-pointer bg-white text-gold-600 border border-gold-300 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 relative group"
                title={isPlaying ? "Pause Musik" : "Putar Musik"}
                id="btn-music-toggle"
              >
                {/* Rotating disk boundary */}
                <div className={`absolute inset-0.5 rounded-full border border-dashed border-gold-400/50 ${isPlaying ? 'animate-spin-slow' : ''}`} />
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-gold-600 z-10" />
                ) : (
                  <Play className="w-4 h-4 text-gold-600 z-10 translate-x-0.5" />
                )}
                
                {/* Ping wave indicator */}
                {isPlaying && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold-500"></span>
                  </span>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

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
