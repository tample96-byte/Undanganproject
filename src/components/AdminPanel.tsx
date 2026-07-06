import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, X, Save, RotateCcw, Copy, Calendar, MapPin, Image, Link, Check, Lock, LogOut, AlertTriangle } from 'lucide-react';
import { InvitationConfig } from '../types';

interface AdminPanelProps {
  config: InvitationConfig;
  onUpdateConfig: (newConfig: InvitationConfig) => void;
  onResetConfig: () => void;
}

export default function AdminPanel({
  config,
  onUpdateConfig,
  onResetConfig,
}: AdminPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localConfig, setLocalConfig] = useState<InvitationConfig>({ ...config });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Password Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Save Success Toast State
  const [showSaveToast, setShowSaveToast] = useState(false);

  // Custom Confirmation Modal State for Reset
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);

  // State for guest invitation link generator
  const [guestInput, setGuestInput] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Sync state if prop changes
  React.useEffect(() => {
    setLocalConfig({ ...config });
  }, [config]);

  const handleConfigChange = (key: keyof InvitationConfig, value: string) => {
    setLocalConfig(prev => {
      const updated = { ...prev, [key]: value };
      setHasUnsavedChanges(true);
      return updated;
    });
  };

  const handleSave = () => {
    onUpdateConfig(localConfig);
    setHasUnsavedChanges(false);
    setShowSaveToast(true);
    setTimeout(() => {
      setShowSaveToast(false);
    }, 3000);
  };

  const handleResetClick = () => {
    setShowResetConfirmModal(true);
  };

  const handleConfirmReset = () => {
    onResetConfig();
    setHasUnsavedChanges(false);
    setShowResetConfirmModal(false);
  };

  const generateLink = () => {
    if (!guestInput.trim()) return;
    const baseUrl = window.location.origin + window.location.pathname;
    const encodedName = encodeURIComponent(guestInput.trim());
    const link = `${baseUrl}?to=${encodedName}`;
    setGeneratedLink(link);
    setIsCopied(false);
  };

  const copyToClipboard = async () => {
    if (!generatedLink) return;
    try {
      await navigator.clipboard.writeText(generatedLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin tautan:", err);
    }
  };

  return (
    <>
      {/* Floating Admin Trigger Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="cursor-pointer bg-cream-50 hover:bg-white text-gold-600 border border-gold-300 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 group"
          title="Buka Pengaturan Undangan (Admin)"
          id="btn-admin-panel"
        >
          <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
        </button>
      </div>

      {/* Slide-out Sidebar Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-charcoal-900"
            />

            {/* Sidebar content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 z-50 w-full max-w-md bg-white text-charcoal-900 border-r border-gold-200/50 shadow-2xl flex flex-col h-full font-sans text-xs"
            >
              {/* Header */}
              <div className="p-4 border-b border-gold-200/40 bg-cream-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-gold-600">
                  <Settings className="w-4 h-4 text-gold-500" />
                  <span className="font-serif text-md font-semibold tracking-wide">
                    Panel Admin Undangan
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  {isAuthenticated && (
                    <button
                      onClick={() => {
                        setIsAuthenticated(false);
                        setPasswordInput('');
                        setPasswordError('');
                      }}
                      className="p-1.5 hover:bg-rose-50 rounded-lg text-gray-400 hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-bold font-display uppercase tracking-wider"
                      title="Keluar (Logout)"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Keluar</span>
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 hover:bg-gold-50 rounded-lg text-gray-400 hover:text-gold-600 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Conditionally Render Password Gate or Configuration Form */}
              {!isAuthenticated ? (
                /* Password Access Gate */
                <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6 bg-cream-50/20">
                  <div className="p-4 bg-gold-50 border border-gold-200 text-gold-600 rounded-full shadow-inner">
                    <Lock className="w-8 h-8 animate-pulse" />
                  </div>
                  <div className="text-center space-y-2">
                    <h4 className="font-serif text-md font-semibold text-charcoal-800">Akses Terbatas</h4>
                    <p className="text-[11px] text-gray-500 max-w-xs leading-relaxed">
                      Silakan masukkan kata sandi admin untuk mengelola setelan lokasi, latar belakang, tanggal, dan RSVP undangan.
                    </p>
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (passwordInput === 'admin123') {
                        setIsAuthenticated(true);
                        setPasswordError('');
                      } else {
                        setPasswordError('Kata sandi salah! Silakan coba lagi.');
                      }
                    }}
                    className="w-full max-w-xs space-y-4"
                  >
                    <div>
                      <input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => {
                          setPasswordInput(e.target.value);
                          setPasswordError('');
                        }}
                        placeholder="Masukkan Kata Sandi..."
                        className="w-full bg-white border border-gold-200/40 rounded-lg px-3 py-2.5 text-center text-base md:text-sm font-semibold tracking-widest focus:outline-hidden focus:border-gold-500 shadow-xs"
                        autoFocus
                      />
                      {passwordError && (
                        <p className="text-[10px] text-rose-500 text-center mt-2 font-semibold animate-shake">
                          {passwordError}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="cursor-pointer w-full bg-gradient-to-r from-gold-500 to-gold-600 text-white font-display text-[10px] font-bold py-3 rounded-xl tracking-widest uppercase shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all border border-gold-400"
                    >
                      Masuk Ke Panel
                    </button>
                  </form>
                </div>
              ) : (
                <>
                  {/* Form Content Scrollable */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    
                    {/* 1. NAMA PASANGAN */}
                    <div className="border border-gold-200/30 bg-cream-50/10 rounded-xl p-4 space-y-3">
                      <h3 className="font-serif text-xs font-semibold text-gold-600 flex items-center gap-1.5 border-b border-gold-100 pb-1.5">
                        Nama Pasangan
                      </h3>
                      <div>
                        <label className="block text-[9px] text-gray-400 uppercase font-semibold mb-1">Nama Pendek Pasangan</label>
                        <input
                          type="text"
                          value={localConfig.coupleNameShort}
                          onChange={(e) => handleConfigChange('coupleNameShort', e.target.value)}
                          className="w-full bg-white border border-gold-200/40 rounded-lg px-3 py-2 focus:outline-hidden focus:border-gold-500 text-base md:text-sm"
                          placeholder="e.g. Dayat & Uswah"
                        />
                      </div>
                    </div>

                    {/* 2. LATAR BELAKANG FOTO */}
                    <div className="border border-gold-200/30 bg-cream-50/10 rounded-xl p-4 space-y-3">
                      <h3 className="font-serif text-xs font-semibold text-gold-600 flex items-center gap-1.5 border-b border-gold-100 pb-1.5">
                        <Image className="w-3.5 h-3.5" /> Foto Background Undangan
                      </h3>
                      <div>
                        <label className="block text-[9px] text-gray-400 uppercase font-semibold mb-1">URL Gambar Latar Belakang (Unsplash / URL)</label>
                        <input
                          type="text"
                          value={localConfig.backgroundImageUrl}
                          onChange={(e) => handleConfigChange('backgroundImageUrl', e.target.value)}
                          className="w-full bg-white border border-gold-200/40 rounded-lg px-3 py-2 focus:outline-hidden focus:border-gold-500 font-mono text-base md:text-[10px]"
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>
                      {localConfig.backgroundImageUrl && (
                        <div className="mt-2 rounded-lg overflow-hidden border border-gold-100 h-24 bg-gray-50 relative">
                          <img 
                            src={localConfig.backgroundImageUrl} 
                            alt="Preview Background" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-end p-1.5">
                            <span className="text-[9px] text-white bg-black/50 px-1.5 py-0.5 rounded">Preview Foto Latar</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 3. TANGGAL & WAKTU */}
                    <div className="border border-gold-200/30 bg-cream-50/10 rounded-xl p-4 space-y-3">
                      <h3 className="font-serif text-xs font-semibold text-gold-600 flex items-center gap-1.5 border-b border-gold-100 pb-1.5">
                        <Calendar className="w-3.5 h-3.5" /> Tanggal & Waktu Acara
                      </h3>
                      <div>
                        <label className="block text-[9px] text-gray-400 uppercase font-semibold mb-1">Tanggal Pernikahan (Format ISO)</label>
                        <input
                          type="datetime-local"
                          value={localConfig.weddingDate.substring(0, 16)}
                          onChange={(e) => handleConfigChange('weddingDate', e.target.value)}
                          className="w-full bg-white border border-gold-200/40 rounded-lg px-3 py-2 focus:outline-hidden focus:border-gold-500 text-base md:text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 uppercase font-semibold mb-1">Teks Keterangan Waktu</label>
                        <input
                          type="text"
                          value={localConfig.weddingTime}
                          onChange={(e) => handleConfigChange('weddingTime', e.target.value)}
                          className="w-full bg-white border border-gold-200/40 rounded-lg px-3 py-2 focus:outline-hidden focus:border-gold-500 text-base md:text-xs"
                          placeholder="e.g. Minggu, 12 Juli 2026 pukul 09:00 WIB - Selesai"
                        />
                      </div>
                    </div>

                    {/* 4. LOKASI & GMAPS */}
                    <div className="border border-gold-200/30 bg-cream-50/10 rounded-xl p-4 space-y-3">
                      <h3 className="font-serif text-xs font-semibold text-gold-600 flex items-center gap-1.5 border-b border-gold-100 pb-1.5">
                        <MapPin className="w-3.5 h-3.5" /> Lokasi & Google Maps
                      </h3>
                      <div>
                        <label className="block text-[9px] text-gray-400 uppercase font-semibold mb-1">Nama Tempat / Gedung</label>
                        <input
                          type="text"
                          value={localConfig.locationName}
                          onChange={(e) => handleConfigChange('locationName', e.target.value)}
                          className="w-full bg-white border border-gold-200/40 rounded-lg px-3 py-2 focus:outline-hidden focus:border-gold-500 text-base md:text-xs"
                          placeholder="e.g. Gedung Pertemuan Graha Kencana"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 uppercase font-semibold mb-1">Alamat Lengkap</label>
                        <textarea
                          rows={2}
                          value={localConfig.address}
                          onChange={(e) => handleConfigChange('address', e.target.value)}
                          className="w-full bg-white border border-gold-200/40 rounded-lg px-3 py-2 focus:outline-hidden focus:border-gold-500 resize-none leading-normal text-base md:text-xs"
                          placeholder="e.g. Jl. Jenderal Sudirman No. 123, Jakarta"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 uppercase font-semibold mb-1">Google Maps Embed Iframe URL (src)</label>
                        <input
                          type="text"
                          value={localConfig.mapEmbedUrl}
                          onChange={(e) => handleConfigChange('mapEmbedUrl', e.target.value)}
                          className="w-full bg-white border border-gold-200/40 rounded-lg px-3 py-2 focus:outline-hidden focus:border-gold-500 font-mono text-base md:text-[9px]"
                          placeholder="https://www.google.com/maps/embed?pb=..."
                        />
                      </div>
                    </div>

                    {/* 5. GUEST LINK GENERATOR */}
                    <div className="border border-gold-200/30 bg-gold-50/30 rounded-xl p-4 space-y-3">
                      <h3 className="font-serif text-xs font-semibold text-gold-600 flex items-center gap-1.5 border-b border-gold-100 pb-1.5">
                        <Link className="w-3.5 h-3.5" /> Pembuat Tautan Undangan Tamu
                      </h3>
                      <p className="text-[10px] text-gray-500 leading-relaxed">
                        Ketik nama tamu di bawah ini untuk membuat link undangan khusus yang otomatis menampilkan namanya di amplop dan halaman utama.
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={guestInput}
                          onChange={(e) => setGuestInput(e.target.value)}
                          className="flex-1 bg-white border border-gold-200/40 rounded-lg px-3 py-2 focus:outline-hidden focus:border-gold-500 text-base md:text-xs font-semibold"
                          placeholder="e.g. Bapak Joko Widodo"
                          onKeyDown={(e) => e.key === 'Enter' && generateLink()}
                        />
                        <button
                          onClick={generateLink}
                          className="cursor-pointer bg-gold-600 hover:bg-gold-700 text-white font-semibold text-[10px] px-3 rounded-lg flex items-center uppercase tracking-wide"
                        >
                          Buat Link
                        </button>
                      </div>
                      {generatedLink && (
                        <div className="mt-3 bg-white border border-gold-200 p-2.5 rounded-lg space-y-2">
                          <p className="font-semibold text-[9px] text-gray-400 uppercase tracking-wider">Tautan Siap Dibagikan:</p>
                          <p className="font-mono text-[9px] text-gray-600 break-all bg-gray-50 p-2 rounded border border-gray-100 max-h-16 overflow-y-auto">
                            {generatedLink}
                          </p>
                          <button
                            onClick={copyToClipboard}
                            className="cursor-pointer w-full flex items-center justify-center gap-1 bg-gold-50 hover:bg-gold-100 text-gold-700 border border-gold-200 text-[10px] py-1.5 rounded font-bold transition-all"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-600">Berhasil Disalin!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Salin Tautan</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                  </div>

                    {/* Action Footer Bar */}
                    <div className="p-4 border-t border-gold-200/40 bg-cream-50/70 grid grid-cols-2 gap-3">
                      <button
                        onClick={handleResetClick}
                        className="cursor-pointer flex items-center justify-center gap-1.5 border border-gold-300 text-gold-700 hover:bg-gold-50 py-3 rounded-xl font-display font-bold text-[10px] uppercase tracking-wider transition-all duration-300"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Default</span>
                      </button>
                      
                      <button
                        onClick={handleSave}
                        disabled={!hasUnsavedChanges}
                        className="cursor-pointer flex items-center justify-center gap-1.5 bg-gradient-to-r from-gold-500 to-gold-600 disabled:from-gray-300 disabled:to-gray-400 disabled:border-gray-300 text-white py-3 rounded-xl font-display font-bold text-[10px] uppercase tracking-wider shadow-xs hover:shadow-md transition-all duration-300 border border-gold-300 disabled:cursor-not-allowed"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Simpan Perubahan</span>
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>

      {/* Save Success Toast */}
      <AnimatePresence>
        {showSaveToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-charcoal-900 text-white border border-gold-400/30 px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md"
          >
            <div className="bg-emerald-500/20 text-emerald-400 p-1 rounded-full">
              <Check className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold tracking-wide font-display text-gold-100">
              Perubahan Undangan Berhasil Disimpan!
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Reset Confirmation Dialog */}
      <AnimatePresence>
        {showResetConfirmModal && (
          <>
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResetConfirmModal(false)}
              className="fixed inset-0 z-55 bg-black/60 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-sm bg-white rounded-3xl border border-gold-200 shadow-2xl p-6 text-charcoal-900 font-sans relative overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-rose-500 to-amber-400" />
                
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-full border border-amber-200">
                    <AlertTriangle className="w-6 h-6 animate-pulse" />
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="font-serif text-lg font-semibold text-charcoal-800">Kembalikan ke Default?</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Apakah Anda yakin ingin mengembalikan seluruh konfigurasi undangan ke pengaturan bawaan awal? Semua teks, nama, dan foto kustom Anda akan terhapus secara permanen.
                    </p>
                  </div>

                  <div className="w-full grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => setShowResetConfirmModal(false)}
                      className="cursor-pointer border border-gray-200 text-gray-500 hover:bg-gray-50 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleConfirmReset}
                      className="cursor-pointer bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-sm"
                    >
                      Ya, Reset
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
