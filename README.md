# Backend - Coworking Space API (UKK RPL Paket B)

# Backend - Coworking Space API (UKK RPL Paket B)

Backend REST API untuk Sistem Reservasi Coworking Space, dibangun dengan
**NestJS + Prisma ORM + MySQL**, lengkap dengan autentikasi JWT multi-role
(Member & Admin Space) dan mekanisme multi-tenancy (isolasi data per siswa
via header `x-maker-key`).

## 1. Persiapan

1. Pastikan MySQL sudah menyala dan buat database kosong bernama `coworking_db`
   (atau sesuaikan nama di `.env`).
2. Copy `.env.example` menjadi `.env`, lalu sesuaikan `DATABASE_URL` sesuai
   kredensial MySQL kamu, contoh:
   ```
   DATABASE_URL="mysql://root:passwordku@localhost:3306/coworking_db_baru"
   ```
3. Install dependency (ini juga otomatis menjalankan `prisma generate`
   lewat script `postinstall`):
   ```bash
   npm install
   ```
4. Buat/sinkronkan seluruh tabel ke database MySQL sesuai `prisma/schema.prisma`:
   ```bash
   npx prisma db push
   ```
   Jalankan ulang perintah ini setiap kali kamu mengubah `prisma/schema.prisma`.

5. Jalankan server (mode development, auto-reload):
   ```bash
   npm run start:dev
   ```

6. Server berjalan di: `http://localhost:3000`
   - Root: `GET http://localhost:3000/`
   - Health check: `GET http://localhost:3000/health`
   - Semua endpoint fitur diawali `http://localhost:3000/api/...`
   - File upload dapat diakses di: `http://localhost:3000/uploads/...`
   - **Dokumentasi Swagger (coba-coba endpoint dari browser): `http://localhost:3000/docs`**

> Cara pakai Swagger UI: pertama buka endpoint **POST /maker/register** untuk mendapatkan
> `app_key`, lalu klik tombol **Authorize** (kanan atas halaman Swagger) dan isi kolom
> **x-maker-key** dengan `app_key` tadi. Setelah login (endpoint **POST /auth/login**),
> isi juga kolom **bearer** dengan `access_token` yang didapat (tanpa menuliskan kata
> "Bearer" di depannya, Swagger sudah menambahkannya otomatis).

> Tips: jalankan `npx prisma studio` untuk membuka GUI melihat/mengedit isi
> database langsung dari browser (`http://localhost:5555`).

## 2. Struktur Folder

```
prisma/
└── schema.prisma          # SATU-SATUNYA sumber kebenaran struktur database

src/
├── main.ts                 # Entry point (global prefix /api, validasi, dsb.)
├── app.module.ts            # Modul utama, mendaftarkan semua modul fitur
├── common/
│   ├── prisma/              # PrismaService & PrismaModule (koneksi database)
│   ├── guards/ decorators/ strategies/ filters/ interceptors/  # dipakai bersama
│   └── utils/date.util.ts   # konversi tanggal string <-> Date (untuk Prisma)
└── modules/
    ├── root/                 # GET / dan GET /health
    ├── maker/                # Registrasi & login akun siswa (App Maker)
    ├── auth/                 # Register & login Member / Admin Space
    ├── spaces/                # Katalog & ketersediaan space
    ├── diskon/                # Katalog & cek kode promo
    ├── reservasi/             # Fitur reservasi milik Member
    ├── admin/                 # Semua fitur panel Admin Space
    └── upload/                # Upload file gambar
```

## 3. Alur Multi-Tenancy (Penting!)

Setiap siswa WAJIB register dulu ke `POST /api/maker/register` untuk
mendapatkan `app_key` (contoh: `mk_xxxxxxxx`). Header berikut **wajib**
disertakan di SETIAP request ke endpoint lain:

```
x-maker-key: mk_xxxxxxxxxxxx
```

Tanpa header ini, request akan ditolak (401 Unauthorized). Data antar siswa
otomatis terisolasi berdasarkan `app_key` ini.

## 4. Alur Autentikasi User

1. Register: `POST /api/auth/register/member` atau `/api/auth/register/admin-space`
2. Login: `POST /api/auth/login` → dapat `access_token`
3. Gunakan token di header: `Authorization: Bearer <access_token>` untuk
   endpoint yang butuh login.

## 5. Uji Coba API

Gunakan Postman/Insomnia/Thunder Client. Urutan uji coba yang disarankan:

1. `POST /api/maker/register` → simpan `app_key`
2. `POST /api/auth/register/admin-space` (pakai `x-maker-key`)
3. `POST /api/auth/register/member` (pakai `x-maker-key`)
4. `POST /api/auth/login` sebagai admin → dapat token admin
5. `POST /api/admin/spaces` (pakai token admin) → tambah data space
6. `POST /api/auth/login` sebagai member → dapat token member
7. `POST /api/reservasi` (pakai token member) → buat reservasi
8. `PATCH /api/admin/reservasi/:id/status` → admin konfirmasi
9. `POST /api/admin/reservasi/:id/check-in` lalu `check-out`
10. `GET /api/admin/reports/monthly` → lihat rekap pendapatan
