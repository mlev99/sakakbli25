<div align="center">

# 🔎 KBLI 2025 AI Search

**Pencarian kode klasifikasi usaha Indonesia (KBLI 2025) yang dipercepat AI — cukup ketik, sisanya otomatis.**

Dibangun oleh **[Saka Omni Webapps](#)** untuk mempermudah UMKM, konsultan, dan tim legal/perizinan menemukan kode KBLI yang tepat tanpa harus membuka ratusan halaman buku klasifikasi BPS.

[![Made with HTML](https://img.shields.io/badge/Frontend-HTML%2FJS-orange?logo=html5)](#)
[![Bootstrap 5](https://img.shields.io/badge/UI-Bootstrap%205-7952B3?logo=bootstrap&logoColor=white)](#)
[![Firebase](https://img.shields.io/badge/Backend-Firebase%20RTDB-FFCA28?logo=firebase&logoColor=black)](#)
[![Multi AI Agent](https://img.shields.io/badge/AI-Multi--Agent%20Fallback-6f42c1)](#)
[![License](https://img.shields.io/badge/license-MIT-green)](#lisensi)
[![Status](https://img.shields.io/badge/status-active--development-brightgreen)](#)

</div>

---

## ✨ Kenapa proyek ini ada

Buku **KBLI 2025** terbitan BPS memuat **1.558 kode klasifikasi 5-digit**. Mencari kode yang relevan secara manual itu lambat dan gampang salah. **KBLI 2025 AI Search** menyelesaikan ini dengan:

- Pencocokan teks instan ke seluruh basis data KBLI 2025 di sisi browser (tidak perlu server backend).
- Lapisan AI yang **berjalan di layar belakang** untuk memilih kode paling relevan dari kandidat hasil pencarian — user tidak perlu tahu, apalagi memilih, AI mana yang dipakai.
- **Sistem multi-agent dengan fallback otomatis**: kalau satu penyedia AI down/timeout, sistem langsung mencoba agent berikutnya tanpa mengganggu pengalaman pencarian.
- Histori & statistik pencarian tersimpan real-time di Firebase, sehingga tim bisa melihat kode apa yang paling sering dicari.

## 🧭 Cara pakai (untuk end-user)

> Cukup ketik. Itu saja.

1. Buka aplikasi.
2. Ketik nama/kata kunci pekerjaan atau bidang usaha di kolom pencarian (mis. `warung kopi`, `konveksi baju`, `jual beras`).
3. Setelah ±3 karakter, sistem otomatis mencari & memproses — hasil kode KBLI paling relevan beserta uraiannya langsung tampil.
4. Riwayat pencarian terkini tersedia di bagian bawah, lengkap dengan jumlah berapa kali tiap kode sudah dicari.

## 🏗️ Arsitektur

```
┌─────────────────┐      ┌───────────────────────┐      ┌────────────────────────┐
│   index.html    │ ───▶ │  kbli-data.js (local)  │ ───▶ │  Kandidat kode cocok   │
│  (Bootstrap 5)  │      │  1.558 kode KBLI 2025  │      │   (skor teks lokal)    │
└─────────────────┘      └───────────────────────┘      └───────────┬────────────┘
                                                                       │
                                                                       ▼
                                                       ┌───────────────────────────┐
                                                       │  AI Fallback Chain        │
                                                       │  Gemini → OpenAI →        │
                                                       │  Mistral → Zai (dst.)     │
                                                       └───────────┬───────────────┘
                                                                       │
                                                                       ▼
                                              ┌────────────────────────────────────┐
                                              │ Firebase Realtime Database         │
                                              │ • apiKeys/{provider}               │
                                              │ • settings/                        │
                                              │ • searchHistory/                   │
                                              │ • codeStats/{kode}/count           │
                                              └────────────────────────────────────┘
```

**Prinsip desain:** *zero backend server*. Semua logika — pencarian, pemanggilan AI, penyimpanan histori — berjalan langsung di browser pengguna. Cocok untuk hosting statis seperti GitHub Pages.

## 🚀 Fitur utama

| Fitur | Keterangan |
|---|---|
| 🔤 Pencarian satu kolom | Tidak ada tombol atau dropdown yang perlu diisi manual |
| 🤖 AI di layar belakang | Provider AI dipilih & dipanggil otomatis, transparan bagi user |
| 🔁 Fallback multi-agent | Jika satu agent gagal/timeout (15 detik), otomatis pindah ke agent aktif berikutnya |
| 🗂️ 1.558 kode KBLI 2025 | Sumber data lengkap level kelompok (5 digit), termasuk hierarki kategori → golongan pokok → golongan → sub-golongan |
| 📊 Histori & statistik | Tabel histori pencarian terkini + accordion deskripsi lengkap + jumlah pencarian per kode |
| ☁️ Real-time sync | Firebase Realtime Database untuk konfigurasi AI, histori, dan statistik |
| 🎨 UI siap pakai | Bootstrap 5 + Bootstrap Icons, responsif untuk mobile & desktop |

## 🛠️ Tech Stack

- **Frontend:** HTML5, vanilla JavaScript, [Bootstrap 5](https://getbootstrap.com/), [Bootstrap Icons](https://icons.getbootstrap.com/)
- **Database & config:** [Firebase Realtime Database](https://firebase.google.com/docs/database)
- **AI Providers (via RTDB `apiKeys/`):** Google Gemini, OpenAI, Mistral, Z.ai — dapat ditambah/dikurangi tanpa mengubah kode
- **Hosting:** Static hosting apa pun (GitHub Pages, Netlify, Firebase Hosting, dsb.)

## 📁 Struktur folder

```
.
├── index.html        # Aplikasi utama (UI + logic pencarian + integrasi Firebase & AI)
├── kbli-data.js       # Data referensi KBLI 2025 (1.558 kode, format array KBLI_DATA)
└── README.md          # Dokumen ini
```

## ⚙️ Konfigurasi Firebase

Struktur node yang digunakan di Realtime Database:

```
formgear-default-rtdb/
├── apiKeys/
│   ├── gemini/   { apiKey, endpoint, model, status }
│   ├── openai/   { apiKey, endpoint, model, status }
│   ├── mistral/  { apiKey, endpoint, model, status }
│   └── zai/      { apiKey, endpoint, model, status }
├── settings/
│   ├── defaultProvider: "gemini"
│   ├── maxTokens: 500
│   └── temperature: 0.7
├── searchHistory/
│   └── {pushId}: { kode, keyword, timestamp }
└── codeStats/
    └── {kode}/count
```

> ⚠️ Hanya provider dengan `status: "active"` dan `apiKey` terisi yang ikut serta dalam antrean fallback.

## 📦 Deploy ke GitHub Pages

```bash
# 1. Clone / siapkan repo
git init kbli-2025-ai-search
cd kbli-2025-ai-search

# 2. Salin index.html dan kbli-data.js ke root repo

# 3. Commit & push
git add .
git commit -m "Initial release: KBLI 2025 AI Search"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main

# 4. Aktifkan GitHub Pages
# Settings → Pages → Branch: main → Folder: / (root) → Save
```

Aplikasi akan tersedia di `https://<username>.github.io/<repo>/`.

## 🗺️ Roadmap

- [ ] Mode offline penuh (tanpa AI, murni pencocokan teks)
- [ ] Export histori pencarian ke Excel/PDF
- [ ] Dukungan pencarian multi-bahasa daerah
- [ ] Dashboard admin untuk kelola `apiKeys` & `settings` langsung dari UI

## 🤝 Kontribusi

Pull request & masukan terbuka lebar. Untuk perubahan besar, mohon buka *issue* terlebih dahulu untuk diskusi arah pengembangan.

## 📄 Lisensi

Kode aplikasi ini dirilis di bawah **Lisensi MIT** — bebas digunakan, dimodifikasi, dan didistribusikan.

## ⚖️ Disclaimer Data

Data kode & uraian KBLI diekstraksi dari **Buku KBLI 2025** terbitan **Badan Pusat Statistik (BPS) Republik Indonesia** dan digunakan murni sebagai referensi pencarian. Hasil rekomendasi AI bersifat **saran**, bukan keputusan resmi — verifikasi ulang ke dokumen resmi BPS sebelum digunakan untuk keperluan administrasi/hukum (NIB, OSS, perizinan usaha, dll).

**Aplikasi ini tidak berafiliasi, tidak disponsori, dan tidak mewakili BPS Republik Indonesia dalam bentuk apa pun.**

---

<div align="center">

Made with ❤️ by **saka_omni** · KBLI 2025 AI Search

</div>
