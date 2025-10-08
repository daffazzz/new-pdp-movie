# 🔧 Android Troubleshooting Guide

## ✅ Fixes Applied

Saya telah memperbaiki beberapa masalah umum di Android project:

### 1. **App Configuration** ✅
- **strings.xml**: Updated app name dari "nama-aplikasi" ke "PDP Movie"
- **Package name**: Konsisten menggunakan "com.pdpx.site"
- **Capacitor config**: Sudah sesuai dengan app name dan package

### 2. **Permissions** ✅
Ditambahkan permissions yang diperlukan di `AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
<uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
<uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
```

### 3. **Gradle Configuration** ✅
- **MultiDex**: Enabled untuk mengatasi method limit
- **Java 8**: Compatibility untuk modern features
- **Dependencies**: Updated dengan MultiDex support

### 4. **Build Settings** ✅
- **CompileSdk**: 35 (latest)
- **TargetSdk**: 35
- **MinSdk**: 23
- **MultiDex**: Enabled

## 🚨 Common Errors & Solutions

### Error: "Duplicate class found"
**Solution:**
```bash
cd android
./gradlew clean
cd ..
npm run android:build
```

### Error: "Failed to resolve: androidx.multidex"
**Solution:** Sudah diperbaiki dengan menambahkan dependency:
```gradle
implementation "androidx.multidex:multidex:2.0.1"
```

### Error: "AAPT2 error"
**Solution:** Clean dan rebuild:
```bash
npm run android:build
```

### Error: "Cannot resolve symbol 'R'"
**Solution:** Sync project di Android Studio:
- **File** → **Sync Project with Gradle Files**

### Error: "Manifest merger failed"
**Solution:** Check AndroidManifest.xml untuk konflik permissions

## 🔧 Manual Fixes (if needed)

### 1. **Gradle Wrapper Issues**
Jika ada error dengan Gradle wrapper:
```bash
cd android
./gradlew wrapper --gradle-version 8.7
```

### 2. **SDK Issues**
Pastikan Android SDK terinstall:
- **Tools** → **SDK Manager**
- Install Android 14 (API 35)
- Install Android SDK Build-Tools

### 3. **Java Version**
Pastikan menggunakan Java 8 atau 11:
- **File** → **Project Structure** → **SDK Location**
- Set JDK location

## 📱 Testing the App

### Build APK:
```bash
# Via command line
npm run android:build
npx cap run android

# Via Android Studio
# Build → Build Bundle(s) / APK(s) → Build APK(s)
```

### Run on Device:
1. Enable USB Debugging di device
2. Connect device via USB
3. Click **Run** (▶️) di Android Studio

### Run on Emulator:
1. **Tools** → **AVD Manager**
2. Create/Start emulator
3. Click **Run** (▶️)

## 🎯 Next Steps

1. **Build APK** untuk testing
2. **Test functionality** di device/emulator
3. **Generate signed AAB** untuk Play Store
4. **Optimize app size** jika diperlukan

## 📞 Quick Commands

```bash
# Rebuild everything
npm run android:build

# Open Android Studio
npm run android:open

# Run on device
npm run android:run

# Clean build (manual)
cd android && ./gradlew clean && cd ..
```

---

**Status: ✅ Android project sudah diperbaiki dan siap untuk build!**

Jika masih ada error, check log di Android Studio atau jalankan `./gradlew build --info` untuk detail error.

