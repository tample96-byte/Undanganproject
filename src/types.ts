export interface InvitationConfig {
  coupleNameShort: string;
  backgroundImageUrl: string;
  weddingDate: string; // e.g. "2026-07-12T09:00:00"
  weddingTime: string; // e.g. "09:00 WIB - Selesai"
  locationName: string; // e.g. "Gedung Pertemuan, Jakarta"
  address: string; // e.g. "Jl. Jenderal Sudirman No. 123"
  mapEmbedUrl: string; // Google Maps embed URL (iframe src)
  googleFormRsvpUrl: string; // Google Form URL for RSVP
}
