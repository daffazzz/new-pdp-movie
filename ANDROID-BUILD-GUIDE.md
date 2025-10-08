# 📱 Android App Build Guide - PDP Movie

## ✅ Setup Berhasil!

Aplikasi Android Anda telah berhasil dikonfigurasi dan siap untuk di-build.

### 🔧 Konfigurasi yang Telah Diterapkan:

1. **Capacitor Config** ✅
   - `webDir`: `out` (direktori hasil Next.js export)
   - `appName`: "PDP Movie"
   - `appId`: "com.pdpx.site"
   - `androidScheme`: "https"

2. **Next.js Export** ✅
   - `output: 'export'` untuk static export
   - `unoptimized: true` untuk images
   - `trailingSlash: true` untuk routing

3. **Build Scripts** ✅
   - `android:build`: Export Next.js dan sync ke Android
   - `android:open`: Buka Android Studio
   - `android:run`: Build dan run di device/emulator

## 🚀 Cara Build Android App:

### Method 1: Via Command Line
```bash
# Build dan sync web assets ke Android
npm run android:build

# Buka di Android Studio
npm run android:open

# Build dan run langsung (butuh device/emulator)
npm run android:run
```

### Method 2: Via Android Studio
1. Jalankan `npm run android:open`
2. Android Studio akan terbuka
3. Pilih device/emulator
4. Klik **Run** (▶️) button

## 📋 Requirements:

### Software yang Dibutuhkan:
- ✅ **Node.js** (sudah ada)
- ✅ **Android Studio** 
- ✅ **Java JDK 8+**
- ✅ **Android SDK**

### Setup Android Development:
1. Install Android Studio
2. Setup Android SDK (API level 21+)
3. Enable USB Debugging di device (untuk testing)
4. Atau setup Android Emulator

## 🔄 Development Workflow:

### Saat Update Code:
```bash
# 1. Update code Next.js
# 2. Build dan sync ke Android
npm run android:build

# 3. Refresh di Android Studio atau run ulang
```

### Saat Deploy:
```bash
# Build APK untuk testing
npx cap run android

# Build AAB untuk Play Store
# (di Android Studio: Build > Generate Signed Bundle/APK)
```

## 📱 Features yang Tersedia:

- ✅ **Responsive Design**: UI menyesuaikan dengan mobile
- ✅ **Offline Ready**: Service Worker untuk caching
- ✅ **Native Performance**: Hybrid app dengan native wrapper
- ✅ **Push Notifications**: Siap dikonfigurasi
- ✅ **Device APIs**: Camera, storage, dll (bila diperlukan)

## 🎯 App Details:

- **App Name**: PDP Movie
- **Package**: com.pdpx.site
- **Platform**: Android API 21+
- **Architecture**: Hybrid (Web + Native)

## 🔧 Troubleshooting:

### Jika Build Error:
1. Pastikan Android Studio terinstall
2. Check Java PATH environment
3. Update Android SDK tools
4. Clean project: `npx cap clean android`

### Jika Web Assets Tidak Update:
```bash
npm run export
npx cap sync android
```

### Jika App Tidak Jalan:
1. Check device/emulator connection
2. Enable USB debugging
3. Check app permissions

## 📦 Output Files:

- **Development APK**: `android/app/build/outputs/apk/debug/`
- **Release AAB**: `android/app/build/outputs/bundle/release/`

---

**Ready to Build! 🚀**  
Aplikasi Android PDP Movie Anda siap untuk di-build dan di-deploy!

