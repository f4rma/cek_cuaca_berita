## Cek Cuaca & Berita

Aplikasi sederhana untuk menampilkan prediksi cuaca dan berita terbaru. Dibangun dengan Node.js, Express, dan Handlebars (HBS). Cocok untuk belajar integrasi API (Mapbox, Weatherstack, Mediastack) dan deploy ke platform seperti Vercel.

## Fitur
- Halaman statis: Beranda, Bantuan, Tentang, Berita
- Endpoint cuaca: `/infoCuaca?address=<lokasi>` — mengembalikan prediksi cuaca untuk alamat yang diminta
- Endpoint berita API: `/api/berita?q=<kata>&categories=<kategori>&limit=<n>` — proxied ke Mediastack
- Template server-side rendering menggunakan Handlebars (`hbs`) dan partials di `templates/partials`

## Struktur proyek (singkat)

```
package.json
src/
  app.js                 # entrypoint server
  utils/
    berIta.js            # helper panggil API berita (mediastack)
    geocode.js           # helper geocoding (mapbox)
    prediksiCuaca.js     # helper cuaca (weatherstack)
public/                 # aset statis (css, js, img, file_html)
templates/
  views/                 # views .hbs
  partials/              # partials handlebars
```

## Prasyarat
- Node.js (versi LTS disarankan)
- npm

Catatan: repository ini menyertakan beberapa kunci API yang di-commit ke file util. Untuk produksi, sebaiknya gunakan environment variables dan jangan commit kunci api ke repo publik.

## Dependency utama
- express
- hbs
- express-handlebars
- postman-request

## Menjalankan secara lokal

1. Clone repository dan masuk ke folder project (root project)

2. Install dependensi

```powershell
npm install
```

3. Jalankan server (opsi cepat)

```powershell
cd src
npx nodemon app.js -e js,hbs
```

Atau jalankan langsung dengan Node:

```powershell
node src/app.js
```

Server default mendengarkan pada port `4000`. Buka http://localhost:4000

## Endpoint & Contoh penggunaan

- Halaman utama: `/` — render `index.hbs`
- Halaman bantuan: `/bantuan`
- Halaman berita: `/berita`
- API cuaca: `/infoCuaca?address=jakarta`
- API berita proxied: `/api/berita?q=teknologi&limit=6`

Contoh curl untuk API berita:

```powershell
curl "http://localhost:4000/api/berita?q=teknologi&limit=5"
```

## Konfigurasi API keys (disarankan)

> Saat ini kunci API disisipkan langsung di `src/utils/*.js`. Untuk keamanan, pindahkan ke environment variables. Contoh yang disarankan (gunakan dotenv atau set di environment server):

ENV variables yang direkomendasikan:

- MAPBOX_ACCESS_TOKEN — token Mapbox (digunakan di `geocode.js`)
- WEATHERSTACK_KEY — API key untuk Weatherstack (digunakan di `prediksiCuaca.js`)
- MEDIASTACK_KEY — API key untuk Mediastack (digunakan di `berita.js`)

Contoh pemakaian dengan `dotenv` (opsional):

1. Install `dotenv`:

```powershell
npm install dotenv
```

2. Buat file `.env` di root (jangan commit file ini):

```
MAPBOX_ACCESS_TOKEN=pk.xxxx...
WEATHERSTACK_KEY=xxxxxxxx
MEDIASTACK_KEY=xxxxxxxx
```

3. Ubah `src/app.js` atau file util untuk membaca `process.env` (saya bisa bantu mengubahnya jika mau).

## Deploy ke Vercel

Beberapa catatan khusus saat deploy ke Vercel:

- Pilih repository yang benar (`f4rma/cek_cuaca_berita`) dan branch yang berisi kode (biasanya `main`).
- Root Directory: jika kode ada di root repo (seperti kasus ini), gunakan `./`.
- Build & Output: ini adalah aplikasi Express yang perlu dijalankan sebagai server Node — pada Vercel pilih "Other" sebagai preset, dan pastikan Vercel di-set untuk menjalankan `node src/app.js` sebagai start command (atau gunakan `vercel.json`/start script di `package.json`).
- Konfigurasikan Environment Variables di Vercel (MAPBOX_ACCESS_TOKEN, WEATHERSTACK_KEY, MEDIASTACK_KEY) supaya kunci API tidak disimpan di repo.

Jika Vercel menolak import karena "branch or commit" seperti pada screenshot: pastikan kamu memilih repository & branch yang tepat dan bahwa Vercel memiliki izin akses ke repo (jika private, beri akses pada Vercel GitHub App).

## Rekomendasi perbaikan (security & maintainability)
- Pindahkan API keys ke environment variables.
- Jangan commit kunci API ke git. Hapus kunci yang ada di commit dengan git history rewrite jika repo publik.
- Gunakan modul HTTP modern seperti `node-fetch` atau `axios` (lebih modern daripada `postman-request` yang deprecated).
- Tambahkan scripts pada `package.json`:

```json
"scripts": {
  "start": "node src/app.js",
  "dev": "nodemon src/app.js -e js,hbs"
}
```

## Troubleshooting singkat
- Error "Cannot find module 'express-handlebars'": jalankan `npm install express-handlebars` dari root project.
- Port sudah dipakai: ubah port di `src/app.js` atau pastikan tidak ada proses lain menggunakan port 4000.
- API tidak merespon: cek apakah kunci API valid, atau cek limit/quota pada penyedia layanan.

## Lisensi
Project ini dilisensikan di bawah lisensi ISC (lihat `package.json`).

## Kontak
Jika perlu bantuan menyiapkan domain, lingkungan Vercel, atau memindahkan kunci API ke environment variables — beri tahu, saya bantu langkah demi langkah.
# cek_cuaca_berita