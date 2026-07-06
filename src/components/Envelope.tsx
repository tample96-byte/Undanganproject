import React from 'react';
import { motion } from 'motion/react';
import { MailOpen, Heart } from 'lucide-react';
import { InvitationConfig } from '../types';

interface EnvelopeProps {
  config: InvitationConfig;
  onOpen: () => void;
  guestName: string;
}

export default function Envelope({ config, onOpen, guestName }: EnvelopeProps) {
  // Format wedding date dynamically for the bottom of the envelope
  const formatWeddingYear = () => {
    try {
      return new Date(config.weddingDate).getFullYear();
    } catch {
      return 2026;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: '-100vh' }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 overflow-hidden text-charcoal-900"
    >
      {/* Background Image of the Invitation with Cream/Gold Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 pointer-events-none"
        style={{ backgroundImage: `url(${config.backgroundImageUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-cream-50/95 via-cream-50/90 to-cream-100/98 pointer-events-none" />

      {/* Decorative Gold Corners */}
      <div className="absolute top-0 left-0 w-10 h-10 sm:w-20 sm:h-20 border-t-2 border-l-2 border-gold-300 opacity-60 rounded-tl-lg m-3 sm:m-4 pointer-events-none" />
      <div className="absolute top-0 right-0 w-10 h-10 sm:w-20 sm:h-20 border-t-2 border-r-2 border-gold-300 opacity-60 rounded-tr-lg m-3 sm:m-4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-10 h-10 sm:w-20 sm:h-20 border-b-2 border-l-2 border-gold-300 opacity-60 rounded-bl-lg m-3 sm:m-4 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-10 h-10 sm:w-20 sm:h-20 border-b-2 border-r-2 border-gold-300 opacity-60 rounded-br-lg m-3 sm:m-4 pointer-events-none" />

      <div className="absolute inset-0 bg-sparkle pointer-events-none opacity-40" />

      {/* Header section with high elegant style */}
      <div className="mt-8 text-center z-10">
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-display tracking-[0.3em] text-xs text-gold-500 uppercase font-semibold mb-2"
        >
          The Wedding of
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="font-serif text-4xl sm:text-5xl md:text-7xl font-extralight tracking-tight text-gold-600 my-4 px-4 select-none break-words leading-tight"
        >
          {config.coupleNameShort}
        </motion.h1>
        <div className="flex items-center justify-center gap-2 text-gold-400 mt-2">
          <span className="w-12 h-[1px] bg-gold-400 opacity-50" />
          <Heart className="w-4 h-4 fill-gold-400 animate-pulse" />
          <span className="w-12 h-[1px] bg-gold-400 opacity-50" />
        </div>
      </div>

      {/* Middle Invitation Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="w-full max-w-sm sm:max-w-md bg-white/95 border border-gold-200/50 rounded-2xl p-6 sm:p-8 text-center envelope-shadow z-10 flex flex-col items-center justify-center backdrop-blur-md relative"
      >
        <div className="absolute inset-x-0 -top-3 flex justify-center">
          <div className="bg-cream-100 border border-gold-300 text-gold-600 px-4 py-1 rounded-full text-[10px] font-display uppercase tracking-widest font-semibold">
            Wedding Invitation
          </div>
        </div>

        <p className="text-xs text-gray-500 font-sans tracking-wide mb-4 mt-2">
          Kepada Yth. Bapak/Ibu/Saudara/i:
        </p>
        
        {/* Guest Name Display */}
        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-charcoal-800 font-medium tracking-wide min-h-[3.5rem] flex items-center justify-center px-2 text-center break-words leading-snug">
          {guestName || "Tamu Undangan Yang Terhormat"}
        </h2>

        <div className="w-16 h-[1px] bg-gold-300 my-4 opacity-50" />
        
        <p className="text-xs text-gray-400 italic font-cursive text-md max-w-xs leading-relaxed">
          &ldquo;Tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir di momen bahagia kami.&rdquo;
        </p>
      </motion.div>

      {/* Footer & Open Button */}
      <div className="mb-8 text-center z-10 flex flex-col items-center gap-6">
        <motion.button
          onClick={onOpen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="cursor-pointer flex items-center gap-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-display text-xs font-semibold tracking-widest uppercase px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gold-300 group"
          id="btn-buka-undangan"
        >
          <MailOpen className="w-4 h-4 group-hover:rotate-6 transition-transform duration-300" />
          Buka Undangan
        </motion.button>

        <p className="font-display text-[9px] tracking-wider text-gold-500 font-medium uppercase">
          DIBUAT DENGAN KASIH SAYANG &bull; {formatWeddingYear()}
        </p>
      </div>
    </motion.div>
  );
}
