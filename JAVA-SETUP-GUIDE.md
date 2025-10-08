# ☕ Java Setup Guide untuk Android Development

## 🚨 Error yang Terjadi
```
ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.
Please set the JAVA_HOME variable in your environment to match the location of your Java installation.
```

## 🔧 Solusi Lengkap

### **Option 1: Install Java JDK (Recommended)**

#### 1. **Download & Install OpenJDK 17**
- Buka: https://adoptium.net/
- Download **Eclipse Temurin JDK 17** (LTS)
- Pilih **Windows x64** → **JDK** → **.msi installer**
- Install dengan default settings

#### 2. **Download & Install Oracle JDK 17** (Alternative)
- Buka: https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html
- Download **Windows x64 Installer**
- Install dengan default settings

### **Option 2: Use Android Studio's Bundled JDK**

#### 1. **Install Android Studio**
- Download: https://developer.android.com/studio
- Install dengan semua components
- Android Studio sudah include JDK

#### 2. **Find Android Studio JDK Path**
Biasanya di lokasi ini:
```
C:\Program Files\Android\Android Studio\jre
C:\Program Files\Android\Android Studio\jbr
```

## 🛠️ Set JAVA_HOME Environment Variable

### **Method 1: Via System Properties**
1. **Windows Key + R** → ketik `sysdm.cpl` → Enter
2. **Advanced** tab → **Environment Variables**
3. **System Variables** → **New**
4. **Variable name**: `JAVA_HOME`
5. **Variable value**: Path ke JDK (contoh: `C:\Program Files\Eclipse Adoptium\jdk-17.0.9.9-hotspot`)
6. **OK** → **OK** → **OK**

### **Method 2: Via PowerShell (Temporary)**
```powershell
# Set for current session only
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.9.9-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
```

### **Method 3: Via Command Line (Permanent)**
```cmd
# Run as Administrator
setx JAVA_HOME "C:\Program Files\Eclipse Adoptium\jdk-17.0.9.9-hotspot" /M
setx PATH "%JAVA_HOME%\bin;%PATH%" /M
```

## ✅ Verify Installation

### 1. **Test Java**
```powershell
java -version
javac -version
```

### 2. **Test JAVA_HOME**
```powershell
echo $env:JAVA_HOME
```

### 3. **Test Android Build**
```powershell
cd android
./gradlew --version
```

## 🎯 Quick Fix Commands

### **If you have Android Studio installed:**
```powershell
# Find Android Studio JDK
$androidStudio = "C:\Program Files\Android\Android Studio"
if (Test-Path "$androidStudio\jbr") {
    $env:JAVA_HOME = "$androidStudio\jbr"
} elseif (Test-Path "$androidStudio\jre") {
    $env:JAVA_HOME = "$androidStudio\jre"
}
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

# Test
java -version
```

### **Set permanently for Android Studio JDK:**
```powershell
# Run as Administrator
setx JAVA_HOME "C:\Program Files\Android\Android Studio\jbr" /M
```

## 🔍 Common JDK Installation Paths

Check these locations:
- `C:\Program Files\Eclipse Adoptium\jdk-*`
- `C:\Program Files\Java\jdk-*`
- `C:\Program Files\Android\Android Studio\jbr`
- `C:\Program Files\Android\Android Studio\jre`
- `C:\Program Files\OpenJDK\jdk-*`

## 📋 Requirements for Android Development

- **Java Version**: JDK 8, 11, or 17 (17 recommended)
- **Android Gradle Plugin**: Requires JDK 11+
- **Capacitor**: Works with JDK 8+

## 🚀 After Setting JAVA_HOME

1. **Restart PowerShell/Command Prompt**
2. **Restart Android Studio**
3. **Test build**:
   ```bash
   npm run android:build
   ```

## 🆘 Troubleshooting

### Error: "Could not determine java version"
```powershell
# Check if JAVA_HOME points to JDK (not JRE)
ls "$env:JAVA_HOME\bin"
# Should contain: java.exe, javac.exe, jar.exe
```

### Error: "Unsupported Java version"
- Android Gradle Plugin 8.x requires JDK 17
- Use JDK 17 for latest Android development

### Multiple Java versions installed
```powershell
# List all Java installations
where java
# Set JAVA_HOME to the one you want to use
```

---

## ⚡ Quick Start (Recommended)

1. **Install Eclipse Temurin JDK 17** dari https://adoptium.net/
2. **Set JAVA_HOME** via System Properties
3. **Restart PowerShell**
4. **Run**: `npm run android:build`

**JDK 17 adalah pilihan terbaik untuk Android development modern!**

