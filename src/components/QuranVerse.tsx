import React from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { InvitationConfig } from '../types';

interface QuranVerseProps {
  config: InvitationConfig;
}

export default function QuranVerse({ config }: QuranVerseProps) {
  const verseText = config.islamicVerseText || "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir. (QS. Ar-Rum: 21)";

  return (
    <section className="relative py-20 px-6 bg-gradient-to-b from-cream-100/30 to-cream-50 text-charcoal-900 text-center overflow-hidden" id="quran-verse">
      <div className="absolute inset-0 bg-sparkle pointer-events-none opacity-20" />
      
      {/* Decorative floral/geometric element */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-gold-200/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-2xl mx-auto z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          {/* Elegant gold icon wrapper */}
          <div className="w-12 h-12 rounded-full border border-gold-300/60 bg-white flex items-center justify-center mb-6 shadow-xs">
            <Heart className="w-4 h-4 text-gold-500 fill-gold-400/20" />
          </div>

          <span className="font-display text-[9px] tracking-[0.3em] text-gold-500 uppercase font-bold mb-3">
            Kalam Ilahi
          </span>
          
          <h2 className="font-serif text-2xl font-light text-charcoal-800 tracking-wide mb-6">
            QS. Ar-Rum Ayat 21
          </h2>

          <div className="w-10 h-[1px] bg-gold-300 mb-8 opacity-60" />

          {/* Verse Text Card */}
          <div className="relative p-6 sm:p-8 bg-white/60 border border-gold-200/30 rounded-3xl backdrop-blur-xs shadow-xs">
            {/* Elegant Quotation marks */}
            <span className="absolute -top-4 left-6 font-serif text-5xl text-gold-300/40 select-none">&ldquo;</span>
            
            <p className="font-serif text-sm sm:text-base text-charcoal-700 leading-relaxed italic">
              {verseText}
            </p>
            
            <span className="absolute -bottom-10 right-6 font-serif text-5xl text-gold-300/40 select-none">&rdquo;</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
