# AYO Web Automation

## 📖 Deskripsi Proyek
Proyek **AYO Web Automation** ini dikembangkan untuk melakukan **pengujian otomatis (Automation Testing)** pada situs web [https://ayo.co.id](https://ayo.co.id).  
Tujuan utama proyek ini adalah untuk memastikan seluruh proses **booking lapangan** berjalan sesuai ketentuan bisnis dan tidak terjadi anomali seperti **double booking** atau **perbedaan harga** antar waktu pemesanan.

Proyek ini dibangun menggunakan:
- **WebdriverIO v9 (ESM)**
- **Cucumber Framework**
- **Allure Reporter** untuk visualisasi hasil pengujian
- **Node.js (v18 ke atas)**

---

## 📁 Struktur Direktori

```bash
project-root/
├── allure-report/ # Folder hasil report Allure (otomatis terbentuk)
├── allure-results/ # Folder hasil uji mentah Allure
├── node_modules/ # Dependencies project
├── test/
│ ├── data/
│ │ └── bookingData.json # Data input pengujian (email, password, jadwal booking)
│ ├── features/
│ │ └── booking.feature # File feature Cucumber (Gherkin syntax)
│ ├── locators/
│ │ └── bookingPage.js # Locator elemen-elemen halaman web
│ ├── screenshots/ # Folder screenshot otomatis hasil pengujian
│ ├── step-definitions/
│ │ └── bookingSteps.js # Implementasi step dari feature
│ └── support/
│ └── hooks.js # Hook tambahan (setup & teardown)
├── package.json # Daftar dependencies dan script NPM
├── wdio.conf.mjs # Konfigurasi utama WebdriverIO
└── README.md # Dokumentasi proyek
```

---

## ⚙️ Prasyarat (Environment Setup)

Sebelum menjalankan proyek ini, pastikan Anda telah menginstal:
1. **Node.js** versi `18.x` atau lebih tinggi  
   Unduh di [https://nodejs.org](https://nodejs.org)
2. **Google Chrome** versi terbaru
3. **Allure Commandline** (opsional, untuk membuka laporan)
   
   ```bash
   npm install -g allure-commandline --save-dev
   ```

---

## 🚀 Cara Menjalankan Test

### 1️⃣ Clone Repository
   ```bash
   git clone https://github.com/<username>/ayo-web-automation.git
   cd ayo-web-automation
   ```

### 2️⃣ Install Dependencies
   ```bash
   npm install
   ```

### 3️⃣ Jalankan Automation Test
   ```bash
   npm run test
   ```

Selama proses berjalan, sistem akan secara otomatis:

- Membuka browser **Chrome**
- Melakukan **login** menggunakan data pada `bookingData.json`
- Melakukan **pencarian dan booking lapangan** berdasarkan data JSON
- Mengambil **screenshot otomatis** pada setiap hasil booking
- Menyimpan **laporan pengujian** di folder `./allure-results/`


### 📊 Laporan Hasil Pengujian (Allure Report)
🔹 Generate Report
   ```bash
   npm run allure:generate
   ```
🔹 Buka Laporan
   ```bash
   npm run allure:open
   ```

Laporan Allure akan menampilkan:

- Status setiap skenario: ✅ Passed, ❌ Failed, ⚪ Skipped
- Screenshot dari setiap step yang sukses/gagal
- Pesan log otomatis untuk lapangan atau jam yang penuh
- Detail environment dan waktu eksekusi


