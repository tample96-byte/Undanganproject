import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Navigation, ExternalLink } from 'lucide-react';
import { InvitationConfig } from '../types';

interface EventsProps {
  config: InvitationConfig;
}

export default function Events({ config }: EventsProps) {
  // Formatting date to readable format
  const formatEventDate = (dateStr: string) => {
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

  const getCalendarUrl = () => {
    try {
      const dateObj = new Date(config.weddingDate);
      const year = dateObj.getFullYear();
      const monthStr = String(dateObj.getMonth() + 1).padStart(2, '0');
      const dayStr = String(dateObj.getDate()).padStart(2, '0');
      const startHourStr = String(dateObj.getHours()).padStart(2, '0');
      const startMinStr = String(dateObj.getMinutes()).padStart(2, '0');
      
      const formattedStartDate = `${year}${monthStr}${dayStr}T${startHourStr}${startMinStr}00Z`;
      // Default duration is 3 hours
      const endHourStr = String((dateObj.getHours() + 3) % 24).padStart(2, '0');
      const formattedEndDate = `${year}${monthStr}${dayStr}T${endHourStr}${startMinStr}00Z`;

      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pernikahan+${encodeURIComponent(config.coupleNameShort)}&dates=${formattedStartDate}/${formattedEndDate}&details=Mengharap+kehadiran+Anda+di+acara+pernikahan+kami.&location=${encodeURIComponent(config.locationName)}`;
    } catch {
      return "https://calendar.google.com/calendar/render";
    }
  };

  return (
    <section className="relative py-24 px-6 bg-cream-50 text-charcoal-900 overflow-hidden" id="event-section">
      {/* Delicate background patterns */}
      <div className="absolute inset-0 bg-sparkle pointer-events-none opacity-40" />

      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Title */}
        <div className="text-center mb-16">
          <span className="font-display text-[10px] tracking-[0.25em] text-gold-500 uppercase font-bold">
            Detail Informasi Acara
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-light text-charcoal-800 tracking-wide mt-2">
            Waktu & Lokasi Pernikahan
          </h2>
          <div className="w-12 h-[1px] bg-gold-400 mx-auto mt-3 opacity-60" />
        </div>

        {/* Central Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full bg-white border border-gold-200/40 rounded-3xl p-5 sm:p-8 md:p-12 shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden backdrop-blur-xs mb-12"
        >
          {/* Accent Gold Border */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left side details */}
            <div className="space-y-6 text-sm text-gray-600 font-sans">
              <h3 className="font-serif text-2xl text-gold-600 font-light tracking-wide mb-2">
                Hari Bahagia Kami
              </h3>
              
              {/* Date */}
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-cream-100 rounded-lg text-gold-600">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-charcoal-800 text-xs uppercase tracking-wider font-display">Hari & Tanggal</p>
                  <p className="mt-1 font-serif text-md text-charcoal-900 font-medium">
                    {formatEventDate(config.weddingDate)}
                  </p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-cream-100 rounded-lg text-gold-600">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-charcoal-800 text-xs uppercase tracking-wider font-display">Waktu</p>
                  <p className="mt-1 text-charcoal-900 font-medium">{config.weddingTime}</p>
                </div>
              </div>

              {/* Venue */}
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-cream-100 rounded-lg text-gold-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-charcoal-800 text-xs uppercase tracking-wider font-display">Tempat / Lokasi</p>
                  <p className="mt-1 font-semibold text-gold-600 text-md">{config.locationName}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{config.address}</p>
                </div>
              </div>
            </div>

            {/* Right side CTA / Actions - Save the Date focus */}
            <div className="flex flex-col gap-4 bg-cream-50/50 p-6 rounded-2xl border border-gold-100 text-center">
              <h4 className="font-serif text-lg text-gold-600 font-light">Simpan Tanggal</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Tambahkan hari bahagia kami ke kalender Anda agar Anda mendapatkan pengingat otomatis menjelang acara pernikahan kami.
              </p>

              <div className="w-full h-[1px] bg-gold-200/40 my-1" />

              <a
                href={getCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-display text-xs font-semibold tracking-widest uppercase py-3.5 px-6 rounded-xl hover:shadow-md transition-all duration-300 border border-gold-300"
              >
                <Calendar className="w-4 h-4" />
                <span>Simpan di Google Calendar</span>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Interactive Google Map iframe */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full bg-white border border-gold-200/40 rounded-3xl p-4 shadow-md relative"
        >
          <div className="absolute inset-x-0 -top-3.5 flex justify-center">
            <span className="bg-cream-100 border border-gold-300 text-gold-600 px-4 py-1 rounded-full text-[10px] font-display uppercase tracking-widest font-semibold shadow-xs">
              Peta Lokasi Interaktif
            </span>
          </div>

          <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 relative">
            {config.mapEmbedUrl ? (
              <iframe
                title="Peta Lokasi"
                src={config.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center font-sans">
                <MapPin className="w-10 h-10 text-gold-400 mb-2 animate-bounce" />
                <p className="font-semibold text-charcoal-800 text-sm">Peta Lokasi Belum Dikonfigurasi</p>
                <p className="text-xs mt-1">Gunakan panel admin untuk memasukkan URL embed Google Maps Anda.</p>
              </div>
            )}
          </div>

          {/* Direct link to Google Maps */}
          <div className="mt-4 flex justify-center">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${config.locationName} ${config.address}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer flex items-center gap-2 text-gold-600 hover:text-gold-700 font-display text-[11px] font-semibold tracking-wider uppercase bg-cream-50 border border-gold-200/50 px-5 py-2.5 rounded-xl transition-all"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Buka Petunjuk Arah</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
