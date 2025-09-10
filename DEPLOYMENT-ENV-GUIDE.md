# 🚀 Environment Variables Setup untuk Deployment

## Masalah yang Terjadi
Error: `Environment Variable "TMDB_API_KEY" references Secret "tmdb_api_key", which does not exist.`

Ini terjadi karena environment variables di file `.env.local` tidak otomatis tersedia saat deployment. Setiap platform deployment memerlukan konfigurasi terpisah.

## ✅ Solusi berdasarkan Platform Deployment

### 1. **Vercel Deployment**

#### Via Vercel Dashboard:
1. Buka [vercel.com](https://vercel.com) dan login
2. Pilih project Anda
3. Pergi ke **Settings** → **Environment Variables**
4. Tambahkan environment variables berikut:

```
TMDB_API_KEY = your_actual_api_key_here
TMDB_BASE_URL = https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL = https://image.tmdb.org/t/p
```

#### Via Vercel CLI:
```bash
vercel env add TMDB_API_KEY
vercel env add TMDB_BASE_URL
vercel env add TMDB_IMAGE_BASE_URL
```

### 2. **Netlify Deployment**

1. Buka [netlify.com](https://netlify.com) dan login
2. Pilih project Anda
3. Pergi ke **Site settings** → **Environment variables**
4. Klik **Add variable** dan tambahkan:

```
TMDB_API_KEY = your_actual_api_key_here
TMDB_BASE_URL = https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL = https://image.tmdb.org/t/p
```

### 3. **Railway Deployment**

1. Buka [railway.app](https://railway.app) dan login
2. Pilih project Anda
3. Pergi ke **Variables** tab
4. Tambahkan environment variables yang sama

### 4. **Heroku Deployment**

```bash
heroku config:set TMDB_API_KEY=your_actual_api_key_here
heroku config:set TMDB_BASE_URL=https://api.themoviedb.org/3
heroku config:set TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

## 🔑 Mendapatkan TMDB API Key

Jika Anda belum memiliki TMDB API Key:

1. Daftar di [The Movie Database](https://www.themoviedb.org/)
2. Pergi ke **Settings** → **API**
3. Request API Key (gratis)
4. Copy API Key yang diberikan

## 🔍 Mengecek Environment Variables

Untuk memastikan environment variables tersedia, Anda bisa menambahkan log di API routes:

```javascript
console.log('TMDB_API_KEY:', process.env.TMDB_API_KEY ? 'Set' : 'Not set');
```

## ⚠️ Security Notes

- **JANGAN** commit file `.env.local` ke GitHub
- Environment variables sudah di-gitignore secara default
- Selalu gunakan environment variables untuk API keys, jangan hardcode

## 🚀 Redeploy setelah Setting

Setelah menambahkan environment variables:

1. **Vercel**: Akan auto-redeploy atau trigger manual redeploy
2. **Netlify**: Klik **Deploy site** atau push update ke GitHub
3. **Railway/Heroku**: Akan auto-redeploy

## ✅ Verification

Setelah deployment berhasil, coba akses aplikasi Anda. Jika masih error:

1. Cek logs deployment untuk error lainnya
2. Pastikan API key valid dan aktif
3. Cek Network tab di browser untuk response API

---

**Catatan**: File ini dibuat untuk membantu troubleshooting deployment. Silakan hapus setelah deployment berhasil.
