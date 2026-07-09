import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface GalleryProps {
  images: string[];
}

export default function Gallery({ images }: GalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // Filter out any empty/invalid URLs just in case
  const validImages = (images || []).filter(url => url && url.trim().length > 0);

  if (validImages.length === 0) {
    return null;
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + validImages.length) % validImages.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % validImages.length);
    }
  };

  return (
    <section className="py-20 px-4 max-w-5xl mx-auto text-center" id="wedding-gallery">
      {/* Elegant Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-12 space-y-3"
      >
        <div className="flex items-center justify-center gap-2 text-gold-600">
          <div className="h-[1px] w-8 bg-gold-300" />
          <ImageIcon className="w-5 h-5" />
          <div className="h-[1px] w-8 bg-gold-300" />
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-800 font-medium tracking-wide">
          Galeri Kebahagiaan
        </h2>
        <p className="font-cursive text-lg text-gold-600/90 italic">
          Kisah cinta kami dalam bingkai gambar
        </p>
      </motion.div>

      {/* Grid of Images */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {validImages.map((imageUrl, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            onClick={() => setSelectedImageIndex(index)}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-gold-200/30 bg-cream-100 aspect-3/4 shadow-sm hover:shadow-md transition-all duration-300 relative"
          >
            {/* Soft overlay on hover */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all duration-300 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="text-white text-xs font-semibold uppercase tracking-wider bg-gold-600/80 px-3 py-1.5 rounded-full backdrop-blur-xs">
                Perbesar
              </span>
            </div>
            
            <img
              src={imageUrl}
              alt={`Wedding moment ${index + 1}`}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
            />
          </motion.div>
        ))}
      </div>

      {/* Full-Screen Lightbox Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedImageIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-4 right-4 z-55 bg-white/10 hover:bg-white/20 text-white w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer border border-white/20 active:scale-90"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Slider container */}
            <div className="relative w-full max-w-3xl aspect-3/4 max-h-[80vh] flex items-center justify-center">
              {/* Previous Button */}
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 z-55 bg-black/40 hover:bg-black/60 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all cursor-pointer border border-white/10 active:scale-90"
                title="Sebelumnya"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Main Image in Lightbox */}
              <motion.img
                key={selectedImageIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                src={validImages[selectedImageIndex]}
                alt={`Wedding moment zoom ${selectedImageIndex + 1}`}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl select-none pointer-events-none"
              />

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-4 z-55 bg-black/40 hover:bg-black/60 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all cursor-pointer border border-white/10 active:scale-90"
                title="Selanjutnya"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Image Indicator / Counter */}
            <div className="mt-4 bg-white/10 px-4 py-1.5 rounded-full border border-white/15 text-white/90 text-xs font-display tracking-widest font-semibold">
              {selectedImageIndex + 1} / {validImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
