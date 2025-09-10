# 🚀 Quick Deployment Guide

## Step 1: Get TMDB API Key
1. Register at [TMDB](https://www.themoviedb.org/)
2. Go to Settings > API
3. Create API Key (Developer)
4. Copy your API Key

## Step 2: Create .env.local
Create file `.env.local` in root folder:
```
TMDB_API_KEY=your_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

## Step 3: Test Locally
```bash
npm install
npm run build
npm run dev
```

## Step 4: Deploy to Vercel

### Option A: GitHub + Vercel (Recommended)
1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repo
4. Add environment variables in Vercel dashboard
5. Deploy!

### Option B: Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
```

## Step 5: Set Environment Variables in Vercel
In Vercel dashboard > Settings > Environment Variables:
- `TMDB_API_KEY` = your_api_key
- `TMDB_BASE_URL` = https://api.themoviedb.org/3
- `TMDB_IMAGE_BASE_URL` = https://image.tmdb.org/t/p

## Done! 🎉
Your PDP MOVIES website is now live!
