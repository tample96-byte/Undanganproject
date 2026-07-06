import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, ChevronDown } from 'lucide-react';
import { InvitationConfig } from '../types';

interface HeroProps {
  config: InvitationConfig;
  guestName: string;
}

export default function Hero({ config, guestName }: HeroProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  useEffect(() => {
    // Target date from configuration
    const targetDate = new Date(config.weddingDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        clearInterval(interval);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds, isOver: false });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [config.weddingDate]);

  // Format date to Indonesian
  const formatWeddingDateText = (dateStr: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      return new Date(dateStr).toLocaleDateString('id-ID', options);
    } catch {
      return "Minggu, 12 Juli 2026";
    }
  };

  const timeBlocks = [
    { label: 'Hari', value: timeLeft.days },
    { label: 'Jam', value: timeLeft.hours },
    { label: 'Menit', value: timeLeft.minutes },
    { label: 'Detik', value: timeLeft.seconds },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      {/* Background Image with Warm Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${config.backgroundImageUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60 z-0" />

      {/* Elegant Sparkles / Pattern overlay */}
      <div className="absolute inset-0 bg-sparkle pointer-events-none opacity-25 z-0" />

      <div className="z-10 max-w-2xl mx-auto flex flex-col items-center text-white">
        {/* Save the Date Tag */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2 rounded-full shadow-md mb-8"
        >
          <Calendar className="w-4 h-4 text-gold-400" />
          <span className="font-display text-[10px] tracking-[0.2em] text-gold-300 font-semibold uppercase">
            Save The Date
          </span>
        </motion.div>

        {/* Walimatul Ursy */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-cursive italic text-2xl md:text-3xl text-gold-300 mb-2"
        >
          Walimatul Ursy
        </motion.p>
        
        {/* Couple Names */}
        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 1 }}
          className="font-serif text-4xl sm:text-6xl md:text-8xl font-extralight tracking-tight text-white my-4 drop-shadow-md select-none break-words px-4 leading-tight"
        >
          {config.coupleNameShort}
        </motion.h2>

        {/* Personalized Guest Name Banner (Undangan Spesial untuk Tamu) */}
        {guestName && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-8 text-center"
          >
            <p className="text-xs uppercase tracking-widest text-gold-300 font-display font-medium">Spesial Untuk Sahabat/Kerabat:</p>
            <h3 className="text-xl md:text-2xl font-serif text-white font-semibold mt-1 drop-shadow-sm">
              {guestName}
            </h3>
          </motion.div>
        )}

        {/* Wedding Date Info */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="font-display text-sm md:text-md tracking-[0.15em] text-gold-300 uppercase font-medium max-w-md border-y border-white/20 py-3 mb-10 px-4"
        >
          {formatWeddingDateText(config.weddingDate)}
        </motion.p>

        {/* Countdown Timer Blocks */}
        <div className="grid grid-cols-4 gap-1.5 xs:gap-3 md:gap-5 max-w-lg w-full mb-12">
          {timeBlocks.map((block, index) => (
            <motion.div
              key={block.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
              className="bg-black/30 border border-white/10 rounded-xl p-2 xs:p-3 md:p-4 shadow-lg flex flex-col justify-center items-center backdrop-blur-md group hover:border-gold-400/50 transition-all duration-300"
            >
              <span className="font-serif text-xl xs:text-2xl md:text-4xl font-light text-gold-300 group-hover:scale-105 transition-transform duration-300">
                {String(block.value).padStart(2, '0')}
              </span>
              <span className="font-display text-[8px] xs:text-[9px] md:text-[10px] tracking-wider text-gray-300 uppercase mt-1 font-medium">
                {block.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Scroll Cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, repeat: Infinity, repeatType: 'reverse', duration: 1.5 }}
          className="flex flex-col items-center gap-1 text-gold-400 mt-4 cursor-pointer"
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight,
              behavior: 'smooth'
            });
          }}
        >
          <span className="text-[10px] font-display tracking-widest uppercase opacity-80">Lihat Undangan</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}
