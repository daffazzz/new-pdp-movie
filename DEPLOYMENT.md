# 🚀 Deployment Guide - PDP MOVIES

Panduan lengkap untuk deploy PDP MOVIES ke Vercel.

## 📋 Prerequisites

1. **Akun GitHub** - untuk menyimpan code
2. **Akun Vercel** - untuk hosting (gratis)
3. **TMDB API Key** - untuk data film/TV

## 🔑 Mendapatkan TMDB API Key

1. Daftar di [TMDB](https://www.themoviedb.org/)
2. Login ke akun Anda
3. Pergi ke **Settings** > **API**
4. Klik **Create** atau **Request an API Key**
5. Pilih **Developer** > **Accept Terms**
6. Isi form aplikasi:
   - **Application Name**: PDP MOVIES
   - **Application URL**: (bisa kosong dulu)
   - **Application Summary**: Movie streaming website
7. Submit dan copy **API Key (v3 auth)**

## 📁 Persiapan File

Pastikan file-file berikut ada di project:

### ✅ File yang Sudah Disiapkan:
- `vercel.json` - Konfigurasi Vercel
- `package.json` - Dependencies dan scripts
- `.gitignore` - File yang diabaikan Git
- `env-example.txt` - Template environment variables
- `next.config.js` - Konfigurasi Next.js
- `tsconfig.json` - TypeScript configuration

### 📝 File Environment Variables
Buat file `.env.local` di root project:
```env
TMDB_API_KEY=your_actual_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

## 🚀 Deployment Steps

### Method 1: GitHub + Vercel (Recommended)

1. **Push ke GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - PDP MOVIES"
   git branch -M main
   git remote add origin https://github.com/username/pdp-movies.git
   git push -u origin main
   ```

2. **Deploy di Vercel**:
   - Pergi ke [vercel.com](https://vercel.com)
   - Login dengan GitHub
   - Klik **New Project**
   - Import repository GitHub Anda
   - Klik **Deploy**

3. **Set Environment Variables**:
   - Di Vercel dashboard, pergi ke **Settings** > **Environment Variables**
   - Tambahkan:
     - `TMDB_API_KEY` = your_actual_api_key
     - `TMDB_BASE_URL` = https://api.themoviedb.org/3
     - `TMDB_IMAGE_BASE_URL` = https://image.tmdb.org/t/p
   - Klik **Save**

4. **Redeploy**:
   - Pergi ke **Deployments** tab
   - Klik **Redeploy** pada deployment terakhir

### Method 2: Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login ke Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   - Ikuti prompts
   - Set environment variables saat ditanya

4. **Production Deploy**:
   ```bash
   vercel --prod
   ```

## 🔧 Konfigurasi Vercel

File `vercel.json` sudah dikonfigurasi dengan:
- **Framework**: Next.js
- **Region**: Singapore (sin1) - optimal untuk Asia
- **Environment Variables**: TMDB API configuration
- **Function Timeout**: 30 detik untuk API calls
- **CORS Headers**: Untuk API access

## 🌍 Custom Domain (Opsional)

1. **Beli Domain** (dari Namecheap, GoDaddy, dll)
2. **Di Vercel Dashboard**:
   - Pergi ke **Settings** > **Domains**
   - Klik **Add Domain**
   - Masukkan domain Anda
   - Ikuti instruksi DNS setup

3. **DNS Configuration**:
   - Tambahkan CNAME record:
     - Name: `www` atau `@`
     - Value: `cname.vercel-dns.com`

## 📊 Monitoring & Analytics

Vercel menyediakan:
- **Analytics**: Traffic dan performance metrics
- **Speed Insights**: Core Web Vitals
- **Function Logs**: Debug API issues
- **Real-time Logs**: Live monitoring

## 🔄 Auto-Deployment

Setelah setup GitHub integration:
- Setiap push ke `main` branch = auto deploy
- Pull requests = preview deployments
- Rollback mudah dari dashboard

## 🐛 Troubleshooting

### Common Issues:

1. **Build Failed**:
   ```bash
   npm run build
   ```
   Fix errors locally first

2. **API Key Not Working**:
   - Check environment variables di Vercel
   - Pastikan API key valid di TMDB
   - Redeploy setelah set env vars

3. **Images Not Loading**:
   - Check `next.config.js` domains
   - Pastikan TMDB_IMAGE_BASE_URL benar

4. **Function Timeout**:
   - Check `vercel.json` maxDuration
   - Optimize API calls

## 📱 Performance Tips

1. **Image Optimization**: Sudah menggunakan Next.js Image
2. **API Caching**: Consider adding cache headers
3. **CDN**: Vercel otomatis menggunakan global CDN
4. **Compression**: Otomatis enabled

## 🔒 Security

- Environment variables aman di Vercel
- HTTPS otomatis enabled
- API keys tidak exposed ke client
- CORS headers dikonfigurasi dengan benar

## 📈 Scaling

Vercel Free Plan:
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Custom domains
- ✅ SSL certificates

Untuk traffic tinggi, upgrade ke Pro Plan.

## 🎯 Final Checklist

- [ ] TMDB API key obtained
- [ ] Environment variables set
- [ ] GitHub repository created
- [ ] Vercel project deployed
- [ ] Custom domain configured (optional)
- [ ] Test all features working
- [ ] Analytics enabled

## 🚀 Your PDP MOVIES is Ready!

Setelah deployment sukses, website Anda akan tersedia di:
- `https://your-project.vercel.app`
- `https://your-custom-domain.com` (jika pakai custom domain)

**Happy Streaming! 🎬🍿**
