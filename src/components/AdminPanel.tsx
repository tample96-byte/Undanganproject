import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, X, Save, RotateCcw, Copy, Calendar, MapPin, 
  Image as ImageIcon, Link, Check, Lock, LogOut, AlertTriangle, 
  Trash2, Plus, Users, Music, Send, MessageSquare 
} from 'lucide-react';
import { InvitationConfig } from '../types';

interface AdminPanelProps {
  config: InvitationConfig;
  onUpdateConfig: (newConfig: InvitationConfig) => void;
  onResetConfig: () => void;
}

interface Guest {
  id: string;
  name: string;
  phone: string;
}

type TabType = 'general' | 'gallery' | 'guests';

export default function AdminPanel({
  config,
  onUpdateConfig,
  onResetConfig,
}: AdminPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('general');
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

  // State for adding a guest
  const [guestNameInput, setGuestNameInput] = useState('');
  const [guestPhoneInput, setGuestPhoneInput] = useState('');
  
  // Database of Guests (Persisted in localStorage separately)
  const [guestsList, setGuestsList] = useState<Guest[]>(() => {
    const saved = localStorage.getItem('wedding_guests_list');
    return saved ? JSON.parse(saved) : [];
  });

  // State for new gallery image input
  const [newImageUrl, setNewImageUrl] = useState('');

  // Copy success mapping for list items
  const [copiedGuestId, setCopiedGuestId] = useState<string | null>(null);

  // Sync config state if prop changes
  useEffect(() => {
    setLocalConfig({ ...config });
  }, [config]);

  // Save guests list to localStorage when it changes
  const saveGuests = (newList: Guest[]) => {
    setGuestsList(newList);
    localStorage.setItem('wedding_guests_list', JSON.stringify(newList));
  };

  const handleConfigChange = (key: keyof InvitationConfig, value: any) => {
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

  // Add a guest to the database
  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestNameInput.trim()) return;

    const newGuest: Guest = {
      id: Date.now().toString(),
      name: guestNameInput.trim(),
      phone: guestPhoneInput.trim()
    };

    const updated = [newGuest, ...guestsList];
    saveGuests(updated);
    setGuestNameInput('');
    setGuestPhoneInput('');
  };

  // Delete a guest from the database
  const handleDeleteGuest = (id: string) => {
    const filtered = guestsList.filter(g => g.id !== id);
    saveGuests(filtered);
  };

  // Copy invitation link for a guest to clipboard
  const handleCopyGuestLink = async (guest: Guest) => {
    const baseUrl = window.location.origin + window.location.pathname;
    const encodedName = encodeURIComponent(guest.name);
    const link = `${baseUrl}?to=${encodedName}`;
    
    try {
      await navigator.clipboard.writeText(link);
      setCopiedGuestId(guest.id);
      setTimeout(() => setCopiedGuestId(null), 2000);
    } catch (err) {
      console.error("Gagal menyalin link:", err);
    }
  };

  // Open WhatsApp direct share link
  const handleWhatsAppShare = (guest: Guest) => {
    const encodedName = encodeURIComponent(guest.name);
    const inviteLink = `${window.location.origin}${window.location.pathname}?to=${encodedName}`;
    
    // Indonesian custom wedding invitation WhatsApp text template
    const messageText = `Kepada Yth.\n*${guest.name}*\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:\n\n*${localConfig.coupleNameShort}*\n\nBerikut tautan undangan resmi untuk informasi lengkap mengenai acara dan lokasi:\n👉 ${inviteLink}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.\n\nTerima kasih banyak.\nKami yang berbahagia,\n*${localConfig.coupleNameShort}*`;
    
    // Standardize phone number format (replace leading 0 with 62)
    let phoneNum = guest.phone.replace(/\D/g, '');
    if (phoneNum.startsWith('0')) {
      phoneNum = '62' + phoneNum.slice(1);
    } else if (!phoneNum.startsWith('62') && phoneNum.length > 0) {
      phoneNum = '62' + phoneNum;
    }

    const waUrl = `https://api.whatsapp.com/send?phone=${phoneNum}&text=${encodeURIComponent(messageText)}`;
    window.open(waUrl, '_blank');
  };

  // Add image URL to wedding gallery
  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    const currentImages = localConfig.galleryImages || [];
    handleConfigChange('galleryImages', [...currentImages, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  // Remove image from wedding gallery
  const handleRemoveImage = (index: number) => {
    const currentImages = localConfig.galleryImages || [];
    const filtered = currentImages.filter((_, i) => i !== index);
    handleConfigChange('galleryImages', filtered);
  };

  return (
    <>
      {/* Floating Admin Trigger Button (Bottom-Left) */}
      <div className="fixed bottom-22 left-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="cursor-pointer bg-white hover:bg-cream-50 text-gold-600 border border-gold-300 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 group"
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
                  <span className="font-serif text-sm font-semibold tracking-wide">
                    Panel Admin Pernikahan
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
                    <h4 className="font-serif text-sm font-semibold text-charcoal-800">Akses Terbatas Admin</h4>
                    <p className="text-[11px] text-gray-500 max-w-xs leading-relaxed">
                      Silakan masukkan kata sandi admin untuk mengelola isi galeri foto, nama, lagu, lokasi, dan daftar tamu WhatsApp.
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
                        className="w-full bg-white border border-gold-200/40 rounded-lg px-3 py-2.5 text-center text-base font-semibold tracking-widest focus:outline-hidden focus:border-gold-500 shadow-xs"
                        autoFocus
                      />
                      {passwordError && (
                        <p className="text-[10px] text-rose-500 text-center mt-2 font-semibold">
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
                  {/* Category Tabs */}
              <div className="bg-cream-50 border-b border-gold-200/40 grid grid-cols-3 text-center text-[10px] font-bold tracking-wider uppercase">
                    <button
                      onClick={() => setActiveTab('general')}
                      className={`py-3 flex flex-col items-center gap-1 border-b-2 transition-all cursor-pointer ${
                        activeTab === 'general' 
                          ? 'border-gold-500 text-gold-700 bg-white' 
                          : 'border-transparent text-gray-400 hover:text-gold-500'
                      }`}
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>Umum</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('gallery')}
                      className={`py-3 flex flex-col items-center gap-1 border-b-2 transition-all cursor-pointer ${
                        activeTab === 'gallery' 
                          ? 'border-gold-500 text-gold-700 bg-white' 
                          : 'border-transparent text-gray-400 hover:text-gold-500'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Galeri Foto</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('guests')}
                      className={`py-3 flex flex-col items-center gap-1 border-b-2 transition-all cursor-pointer ${
                        activeTab === 'guests' 
                          ? 'border-gold-500 text-gold-700 bg-white' 
                          : 'border-transparent text-gray-400 hover:text-gold-500'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Daftar Tamu</span>
                    </button>
                  </div>

                  {/* Form Content Scrollable */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    
                    {/* TAB 1: SETELAN UMUM */}
                    {activeTab === 'general' && (
                      <div className="space-y-4">
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

                        {/* 2. BACKGROUND MUSIC */}
                        <div className="border border-gold-200/30 bg-cream-50/10 rounded-xl p-4 space-y-3">
                          <h3 className="font-serif text-xs font-semibold text-gold-600 flex items-center gap-1.5 border-b border-gold-100 pb-1.5">
                            <Music className="w-3.5 h-3.5" /> Musik Latar Belakang (MP3)
                          </h3>
                          <div>
                            <label className="block text-[9px] text-gray-400 uppercase font-semibold mb-1">URL File MP3 Musik Latar</label>
                            <input
                              type="text"
                              value={localConfig.musicUrl}
                              onChange={(e) => handleConfigChange('musicUrl', e.target.value)}
                              className="w-full bg-white border border-gold-200/40 rounded-lg px-3 py-2 focus:outline-hidden focus:border-gold-500 font-mono text-base md:text-xs"
                              placeholder="https://example.com/audio.mp3"
                            />
                            <p className="text-[9px] text-gray-400 mt-1 leading-normal">
                              Masukkan direct link MP3. Musik akan dimainkan secara otomatis sewaktu tamu membuka undangan.
                            </p>
                          </div>
                        </div>

                        {/* 3. LATAR BELAKANG FOTO */}
                        <div className="border border-gold-200/30 bg-cream-50/10 rounded-xl p-4 space-y-3">
                          <h3 className="font-serif text-xs font-semibold text-gold-600 flex items-center gap-1.5 border-b border-gold-100 pb-1.5">
                            <ImageIcon className="w-3.5 h-3.5" /> Foto Cover Utama
                          </h3>
                          <div>
                            <label className="block text-[9px] text-gray-400 uppercase font-semibold mb-1">URL Gambar Latar Belakang</label>
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
                            </div>
                          )}
                        </div>

                        {/* 4. TANGGAL & WAKTU */}
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
                              placeholder="e.g. Minggu, 12 Juli 2026 pukul 09:00 WIB"
                            />
                          </div>
                        </div>

                        {/* 5. LOKASI & GMAPS */}
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
                              placeholder="Gedung Pertemuan"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] text-gray-400 uppercase font-semibold mb-1">Alamat Lengkap</label>
                            <textarea
                              rows={2}
                              value={localConfig.address}
                              onChange={(e) => handleConfigChange('address', e.target.value)}
                              className="w-full bg-white border border-gold-200/40 rounded-lg px-3 py-2 focus:outline-hidden focus:border-gold-500 resize-none leading-normal text-base md:text-xs"
                              placeholder="Jl. Sudirman"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] text-gray-400 uppercase font-semibold mb-1">Google Maps Embed Iframe URL (src)</label>
                            <input
                              type="text"
                              value={localConfig.mapEmbedUrl}
                              onChange={(e) => handleConfigChange('mapEmbedUrl', e.target.value)}
                              className="w-full bg-white border border-gold-200/40 rounded-lg px-3 py-2 focus:outline-hidden focus:border-gold-500 font-mono text-base md:text-[9px]"
                              placeholder="https://www.google.com/maps/embed?..."
                            />
                          </div>
                        </div>

                        {/* 6. KUTIPAN PERNIKAHAN */}
                        <div className="border border-gold-200/30 bg-cream-50/10 rounded-xl p-4 space-y-3">
                          <h3 className="font-serif text-xs font-semibold text-gold-600 flex items-center gap-1.5 border-b border-gold-100 pb-1.5">
                            <MessageSquare className="w-3.5 h-3.5" /> Kutipan Surat Ar-Rum (Pernikahan)
                          </h3>
                          <div>
                            <label className="block text-[9px] text-gray-400 uppercase font-semibold mb-1">Isi Kutipan Ayat Al-Quran / Kata-Kata Pernikahan</label>
                            <textarea
                              rows={4}
                              value={localConfig.islamicVerseText || ''}
                              onChange={(e) => handleConfigChange('islamicVerseText', e.target.value)}
                              className="w-full bg-white border border-gold-200/40 rounded-lg px-3 py-2 focus:outline-hidden focus:border-gold-500 leading-normal text-base md:text-xs"
                              placeholder="Dan di antara tanda-tanda (kebesaran)-Nya..."
                            />
                            <p className="text-[9px] text-gray-400 mt-1 leading-normal">
                              Kutipan ayat suci Al-Quran atau kata mutiara pernikahan pilihan Anda yang diletakkan di bawah menu utama countdown.
                            </p>
                          </div>
                        </div>

                        {/* 7. TURUT MENGUNDANG */}
                        <div className="border border-gold-200/30 bg-cream-50/10 rounded-xl p-4 space-y-3">
                          <h3 className="font-serif text-xs font-semibold text-gold-600 flex items-center gap-1.5 border-b border-gold-100 pb-1.5">
                            <Users className="w-3.5 h-3.5" /> Daftar Turut Mengundang
                          </h3>
                          <div>
                            <label className="block text-[9px] text-gray-400 uppercase font-semibold mb-1">Daftar Nama Turut Mengundang (Pisahkan dengan Baris Baru)</label>
                            <textarea
                              rows={5}
                              value={localConfig.turutMengundang || ''}
                              onChange={(e) => handleConfigChange('turutMengundang', e.target.value)}
                              className="w-full bg-white border border-gold-200/40 rounded-lg px-3 py-2 focus:outline-hidden focus:border-gold-500 leading-normal text-base md:text-xs"
                              placeholder="• Nama 1&#10;• Nama 2&#10;• Nama 3"
                            />
                            <p className="text-[9px] text-gray-400 mt-1 leading-normal">
                              Masukkan daftar nama keluarga besar, kerabat, atau rekan kerja yang turut mengundang. Pisahkan setiap nama dengan menekan tombol Enter (Baris Baru).
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 2: GALERI FOTO */}
                    {activeTab === 'gallery' && (
                      <div className="space-y-4">
                        <div className="border border-gold-200/30 bg-cream-50/10 rounded-xl p-4 space-y-3">
                          <h3 className="font-serif text-xs font-semibold text-gold-600 flex items-center gap-1.5 border-b border-gold-100 pb-1.5">
                            <Plus className="w-3.5 h-3.5" /> Tambah Foto Galeri Baru
                          </h3>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newImageUrl}
                              onChange={(e) => setNewImageUrl(e.target.value)}
                              className="flex-1 bg-white border border-gold-200/40 rounded-lg px-3 py-2 focus:outline-hidden focus:border-gold-500 text-base md:text-xs"
                              placeholder="Masukkan URL foto baru..."
                            />
                            <button
                              onClick={handleAddImage}
                              className="cursor-pointer bg-gold-600 hover:bg-gold-700 text-white font-semibold text-[10px] px-3.5 rounded-lg flex items-center uppercase tracking-wide gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Tambah</span>
                            </button>
                          </div>
                          <p className="text-[9px] text-gray-400 leading-normal">
                            Gunakan URL gambar dari internet (misalnya Unsplash, Imgur, atau hosting foto Anda) untuk ditampilkan di galeri kebahagiaan.
                          </p>
                        </div>

                        {/* Existing Gallery Images List */}
                        <div className="space-y-3">
                          <h4 className="font-serif text-xs font-semibold text-charcoal-700 flex items-center gap-1">
                            <span>Daftar Foto Galeri ({ (localConfig.galleryImages || []).length })</span>
                          </h4>

                          <div className="grid grid-cols-2 gap-3">
                            {(localConfig.galleryImages || []).map((imgUrl, idx) => (
                              <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden bg-cream-50 relative group shadow-xs">
                                <img 
                                  src={imgUrl} 
                                  alt={`Thumb ${idx + 1}`} 
                                  className="w-full h-24 object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 flex justify-between items-center">
                                  <span className="text-[9px] text-white font-mono px-1">#{idx + 1}</span>
                                  <button
                                    onClick={() => handleRemoveImage(idx)}
                                    className="p-1 text-rose-300 hover:text-rose-500 hover:bg-white/10 rounded cursor-pointer transition-colors"
                                    title="Hapus Foto"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 3: DAFTAR TAMU & WHATSAPP SHARE */}
                    {activeTab === 'guests' && (
                      <div className="space-y-4">
                        {/* Guest list registration form */}
                        <form onSubmit={handleAddGuest} className="border border-gold-200/30 bg-cream-50/15 rounded-xl p-4 space-y-3">
                          <h3 className="font-serif text-xs font-semibold text-gold-600 flex items-center gap-1.5 border-b border-gold-100 pb-1.5">
                            <Plus className="w-3.5 h-3.5" /> Tambah Tamu Undangan Baru
                          </h3>
                          
                          <div className="space-y-2">
                            <div>
                              <label className="block text-[9px] text-gray-400 uppercase font-semibold mb-1">Nama Lengkap Tamu</label>
                              <input
                                type="text"
                                required
                                value={guestNameInput}
                                onChange={(e) => setGuestNameInput(e.target.value)}
                                className="w-full bg-white border border-gold-200/40 rounded-lg px-3 py-2 focus:outline-hidden focus:border-gold-500 text-base md:text-xs font-semibold"
                                placeholder="e.g. Bapak Joko Widodo"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] text-gray-400 uppercase font-semibold mb-1">No. WhatsApp / HP (Opsional)</label>
                              <input
                                type="text"
                                value={guestPhoneInput}
                                onChange={(e) => setGuestPhoneInput(e.target.value)}
                                className="w-full bg-white border border-gold-200/40 rounded-lg px-3 py-2 focus:outline-hidden focus:border-gold-500 text-base md:text-xs"
                                placeholder="e.g. 08123456789 (Mulai dari 0 atau 62)"
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="cursor-pointer w-full bg-gold-600 hover:bg-gold-700 text-white font-semibold text-[10px] py-2.5 rounded-lg flex items-center justify-center uppercase tracking-wide gap-1.5 mt-2"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Simpan Ke Daftar</span>
                          </button>
                        </form>

                        {/* Guests List Database */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="font-serif text-xs font-semibold text-charcoal-700 flex items-center gap-1">
                              <span>Daftar Tamu ({guestsList.length})</span>
                            </h4>
                            <p className="text-[9px] text-gray-400">Tersimpan secara lokal</p>
                          </div>

                          {guestsList.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 border border-dashed border-gray-200 rounded-xl p-4">
                              <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                              <p className="text-[10px]">Belum ada data tamu undangan.</p>
                            </div>
                          ) : (
                            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                              {guestsList.map(guest => (
                                <div 
                                  key={guest.id} 
                                  className="bg-white border border-gold-200/40 p-3 rounded-xl flex items-center justify-between gap-3 shadow-xs hover:border-gold-300 transition-colors"
                                >
                                  <div className="flex-1 min-w-0">
                                    <p className="font-bold text-xs text-charcoal-800 truncate">{guest.name}</p>
                                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                                      {guest.phone ? guest.phone : 'Tanpa nomor HP'}
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0">
                                    {/* Copy Link Button */}
                                    <button
                                      onClick={() => handleCopyGuestLink(guest)}
                                      className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-lg cursor-pointer border border-gray-100 transition-colors"
                                      title="Salin Tautan Undangan"
                                    >
                                      {copiedGuestId === guest.id ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                      )}
                                    </button>

                                    {/* WhatsApp Direct Share Button */}
                                    <button
                                      onClick={() => handleWhatsAppShare(guest)}
                                      className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg cursor-pointer border border-emerald-100 transition-colors"
                                      title="Kirim Undangan via WhatsApp"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5 fill-emerald-600/10" />
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                      onClick={() => handleDeleteGuest(guest.id)}
                                      className="p-1.5 hover:bg-rose-50 text-gray-300 hover:text-rose-500 rounded-lg cursor-pointer transition-colors"
                                      title="Hapus dari Daftar"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

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
                      <span>Simpan Setelan</span>
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
                      Apakah Anda yakin ingin mengembalikan seluruh konfigurasi undangan ke pengaturan bawaan awal? Semua teks, nama, lagu, dan galeri foto kustom Anda akan terhapus secara permanen.
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
