# PDP MOVIES - Web Streaming Film

Web aplikasi streaming film dan TV series yang dibangun dengan Next.js, menggunakan data dari TMDB API dan player dari vidsrc.co.

## 🚀 Fitur

- **Browse Movies & TV Shows**: Jelajahi film dan serial TV populer
- **Genre Filtering**: Filter film dan TV series berdasarkan genre (Action, Comedy, Drama, dll)
- **Search**: Cari film dan TV series berdasarkan judul
- **Streaming**: Tonton langsung dengan embedded player dari vidsrc.co
- **Responsive Design**: UI modern yang responsif untuk semua perangkat
- **Detail Pages**: Informasi lengkap film/TV series dengan rating, genre, dll
- **Episode Selection**: Untuk TV series, pilih season dan episode yang ingin ditonton
- **Custom Logo**: Logo PDP MOVIES yang menarik dan professional

## 🛠️ Teknologi

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **API**: TMDB (The Movie Database) API
- **Video Player**: vidsrc.co embedded player
- **Icons**: Lucide React

## 📦 Instalasi

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd movie-streaming-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   
   Buat file `.env.local` di root project dan tambahkan:
   ```env
   TMDB_API_KEY=your_tmdb_api_key_here
   TMDB_BASE_URL=https://api.themoviedb.org/3
   TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
   ```

   **Cara mendapatkan TMDB API Key:**
   - Daftar di [TMDB](https://www.themoviedb.org/)
   - Masuk ke Settings > API
   - Generate API Key (v3 auth)
   - Copy API Key ke file .env.local

4. **Jalankan development server**
   ```bash
   npm run dev
   ```

5. **Buka browser**
   
   Akses `http://localhost:3000`

## 📁 Struktur Project

```
├── components/           # React components
│   ├── Layout.tsx       # Layout utama dengan header & footer
│   ├── MovieCard.tsx    # Card untuk menampilkan film/TV
│   ├── MovieGrid.tsx    # Grid layout untuk daftar film/TV
│   ├── VideoPlayer.tsx  # Embedded video player
│   └── LoadingSpinner.tsx
├── lib/
│   └── tmdb.ts          # TMDB API configuration & types
├── pages/
│   ├── api/             # API routes
│   │   ├── movies/      # Movie endpoints
│   │   ├── tv/          # TV show endpoints
│   │   └── search.ts    # Search endpoint
│   ├── movie/[id].tsx   # Detail halaman film
│   ├── tv/[id].tsx      # Detail halaman TV series
│   ├── movies.tsx       # Halaman daftar film
│   ├── tv.tsx           # Halaman daftar TV series
│   ├── search.tsx       # Halaman hasil pencarian
│   └── index.tsx        # Homepage
├── styles/
│   └── globals.css      # Global styles
└── public/              # Static files
```

## 🎬 Cara Menggunakan

### 1. Browse Movies & TV Shows
- Klik "Movies" untuk melihat film populer
- Klik "TV Shows" untuk melihat serial TV populer
- Scroll ke bawah dan klik "Load More" untuk melihat lebih banyak

### 2. Search Content
- Gunakan search bar di header
- Ketik judul film atau TV series
- Tekan Enter atau klik icon search

### 3. Watch Content
- Klik pada poster film/TV series
- Di halaman detail, klik tombol "Watch Now"
- Untuk TV series, pilih season dan episode yang diinginkan

### 4. Video Player
- **Film**: `https://player.vidsrc.co/embed/movie/{tmdb_id}`
- **TV Series**: `https://player.vidsrc.co/embed/tv/{tmdb_id}/{season}/{episode}`

## 🔧 API Endpoints

### Movies
- `GET /api/movies/popular?page={page}` - Daftar film populer
- `GET /api/movies/{id}` - Detail film

### TV Shows  
- `GET /api/tv/popular?page={page}` - Daftar TV series populer
- `GET /api/tv/{id}` - Detail TV series
- `GET /api/tv/{id}/season/{season}` - Detail season & episode

### Search
- `GET /api/search?query={query}&page={page}` - Pencarian multi (film & TV)

## 🎨 Customization

### Mengubah Tema Warna
Edit file `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Ubah warna primary di sini
        500: '#3b82f6', // Biru
        600: '#2563eb',
        // dst...
      },
    },
  },
}
```

### Menambah Fitur Baru
1. Buat komponen baru di folder `components/`
2. Tambahkan halaman baru di folder `pages/`
3. Buat API endpoint baru di folder `pages/api/`

## 📱 Responsive Design

Aplikasi ini fully responsive dengan breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🚀 Deployment

### Vercel (Recommended)
1. Push code ke GitHub
2. Connect repository di [Vercel](https://vercel.com)
3. Add environment variables di Vercel dashboard
4. Deploy!

### Manual Build
```bash
npm run build
npm start
```

## 🐛 Troubleshooting

### Video tidak bisa diputar
- Pastikan koneksi internet stabil
- Coba refresh halaman
- Beberapa konten mungkin tidak tersedia di vidsrc.co

### Data tidak muncul
- Pastikan TMDB API key valid
- Check console browser untuk error
- Pastikan environment variables sudah benar

### Build error
- Pastikan semua dependencies terinstall
- Check TypeScript errors dengan `npm run lint`
- Clear cache: `rm -rf .next`

## 📄 License

MIT License - bebas digunakan untuk project pribadi dan komersial.

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

## 📞 Support

Jika ada pertanyaan atau masalah, buat issue di GitHub repository.

---

## 🎬 Fitur Genre Filtering:

- **Homepage**: Genre sections dengan quick selection pills
- **Movies Page**: Dropdown filter untuk memilih genre spesifik
- **TV Shows Page**: Dropdown filter untuk memilih genre spesifik
- **Auto-loading**: Content otomatis berubah saat genre dipilih
- **Popular Genres**: Action, Comedy, Drama, Thriller, Adventure, dan lainnya

## 📱 Fitur Tambahan:

- **Genre filtering** dengan dropdown yang mudah digunakan
- **Genre sections** di homepage dengan genre pills
- **Search functionality** dengan auto-complete
- **Loading states** dengan spinner
- **Error handling** yang proper
- **SEO optimized** dengan meta tags
- **Image optimization** dengan Next.js Image
- **Responsive design** untuk semua perangkat
- **Custom logo integration** dengan PDP MOVIES branding

Web streaming film Anda sudah siap digunakan! Semua data film dan TV series akan diambil langsung dari TMDB API, dan video player menggunakan embed dari vidsrc.co seperti yang Anda minta. UI-nya modern, responsive, dan user-friendly dengan logo PDP MOVIES yang menarik.

**Happy Streaming! 🎬🍿**
