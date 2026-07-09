export interface InvitationConfig {
  coupleNameShort: string;
  backgroundImageUrl: string;
  weddingDate: string; // e.g. "2026-07-12T09:00:00"
  weddingTime: string; // e.g. "09:00 WIB - Selesai"
  locationName: string; // e.g. "Gedung Pertemuan, Jakarta"
  address: string; // e.g. "Jl. Jenderal Sudirman No. 123"
  mapEmbedUrl: string; // Google Maps embed URL (iframe src)
  googleFormRsvpUrl: string; // Google Form URL for RSVP
  musicUrl: string; // Background music MP3 url
  galleryImages: string[]; // List of gallery image URLs
  islamicVerseText?: string; // Quranic wedding verse (e.g. Ar-Rum Ayat 21)
  turutMengundang?: string; // People/families who are inviting ("Turut Mengundang")
}
