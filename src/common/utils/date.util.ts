// Kolom `tanggal_reservasi` di Prisma bertipe DateTime (@db.Date).
// Backend menerima & mengembalikan tanggal dalam format string "YYYY-MM-DD"
// (sesuai Kontrak API), jadi kita perlu helper konversi dua arah supaya
// tidak ada pergeseran tanggal akibat timezone.

// String "2026-08-30" -> Date object jam 00:00 UTC
export function toDateOnly(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00.000Z`);
}

// Date object -> String "2026-08-30"
export function formatDateOnly(date: Date | string): string {
  if (typeof date === 'string') return date.slice(0, 10);
  return date.toISOString().slice(0, 10);
}
