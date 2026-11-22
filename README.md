# MANAGER

Personal Finance & Fitness Manager. Mobile-first PWA dengan penyimpanan lokal.

## Fitur yang tersedia
- Pemasukan/pengeluaran, kategori otomatis berbasis kata kunci, review kategori, kategori khusus, deteksi duplikat, ringkasan aktual, estimasi alokasi dan budget.
- Aturan merchant disimpan dan diterapkan saat kategorisasi; kategori masih dapat diedit manual.
- OCR gambar via Tesseract.js di browser, ekstraksi teks PDF/TXT/CSV/DOCX, konfirmasi hasil sebelum transaksi disimpan.
- Fitness: rencana latihan, sets/repetitions/weight/rest, edit/hapus, tandai selesai, riwayat.
- Impor jadwal kerja berbasis gambar, PDF, TXT, CSV, DOCX dan teks; parser tanggal, off-day dan jam shift; saran latihan perlu direview.
- IndexedDB, backup/restore JSON dan ekspor CSV.
- Manifest PWA, service worker, ikon, mode gelap/terang dan GitHub Actions artifact.

## Development
Install dependencies, lalu jalankan npm run dev. Verifikasi dengan npm run check, npm test dan npm run build.

## Android install
Push ke main untuk menjalankan GitHub Actions. Unduh artifact bernama manager-pwa, ekstrak lalu deploy isi ZIP ke hosting statis HTTPS. Buka URL HTTPS di Chrome Android lalu pilih Install app atau Add to Home screen. Artifact adalah PWA statis, bukan APK native. Service worker memerlukan HTTPS (localhost untuk development).

## Privasi dan batasan teknis
- Transaksi, workout, aturan, pengaturan disimpan di IndexedDB pada browser/perangkat. Tidak ada sinkronisasi cloud.
- OCR Tesseract berjalan di browser. Image tidak di-upload ke server; file bahasa OCR diunduh saat penggunaan pertama, sehingga OCR pertama kali memerlukan internet.
- PDF dengan teks dapat diekstrak. PDF hasil scan (gambar dalam PDF) belum otomatis dirender menjadi gambar untuk OCR; simpan halaman sebagai gambar terlebih dahulu.
- Hasil OCR hanya saran. Merchant/nominal/tanggal/kategori wajib ditinjau; parser receipt heuristik dan belum memahami semua template e-wallet/bank.
- Parser jadwal heuristik, tidak dapat dijamin membaca seluruh bentuk tabel/foto. Pratinjau wajib diperiksa dan jadwal latihan dapat diedit sebelum digunakan.
- Anggaran adalah perkiraan perencanaan, bukan nasihat keuangan. Biaya tetap/cicilan di Pengaturan dianggap kewajiban belum tercatat, agar tidak menghitung transaksi yang sama dua kali.
- Tidak ada data contoh/fiktif pada dashboard.

CI validation branch: run production build and unit tests against the current main implementation.
