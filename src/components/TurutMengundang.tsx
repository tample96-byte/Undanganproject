import React from 'react';
import { motion } from 'motion/react';
import { Users } from 'lucide-react';
import { InvitationConfig } from '../types';

interface TurutMengundangProps {
  config: InvitationConfig;
}

export default function TurutMengundang({ config }: TurutMengundangProps) {
  const rawText = config.turutMengundang || "";
  
  // If no content is defined, don't show the section or show a graceful fallback
  if (!rawText.trim()) return null;

  // Split lines by newline and clean them up
  const lines = rawText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  return (
    <section className="relative py-20 px-6 bg-cream-50 text-charcoal-900 overflow-hidden" id="turut-mengundang">
      {/* Decorative patterns */}
      <div className="absolute inset-0 bg-sparkle pointer-events-none opacity-30" />
      
      <div className="max-w-2xl mx-auto text-center z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          {/* Section Icon */}
          <div className="w-12 h-12 rounded-full border border-gold-300/60 bg-white flex items-center justify-center mb-5 shadow-xs">
            <Users className="w-4 h-4 text-gold-500" />
          </div>

          <span className="font-display text-[9px] tracking-[0.25em] text-gold-500 uppercase font-bold">
            Hormat Kami
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-light text-charcoal-800 tracking-wide mt-2">
            Turut Mengundang
          </h2>
          <div className="w-12 h-[1px] bg-gold-400 mx-auto mt-3 mb-10 opacity-60" />

          {/* Elegant Card List Container */}
          <div className="w-full bg-white border border-gold-200/40 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-gold-300/40 rounded-tl-xl m-2 pointer-events-none" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-gold-300/40 rounded-tr-xl m-2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-gold-300/40 rounded-bl-xl m-2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-gold-300/40 rounded-br-xl m-2 pointer-events-none" />

            <div className="space-y-4 max-w-md mx-auto">
              {lines.map((line, index) => {
                // Strip bullet point chars like '•', '-', '*' from the visual display if present
                const cleanLine = line.replace(/^[•\-\*\s]+/, '');
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 shrink-0 opacity-80" />
                    <p className="font-sans text-xs sm:text-sm text-charcoal-700 font-medium tracking-wide">
                      {cleanLine}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
