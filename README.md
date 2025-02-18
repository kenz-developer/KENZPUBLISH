# 🚀 Github Uploader Yosh

![Preview](https://pomf2.lain.la/f/ayaazhh8.jpg)

Yo, bro! Ini dia **Github Uploader Yosh**, project kece buat nge-upload sesuatu ke GitHub pake **JS**. Dibikin pake **React + Vite**, terus ada **TailwindCSS** biar tampilannya makin cakep. 🔥

---

## 🛠️ Setup Gampil

1. **Clone repo dulu, coy!**
   ```sh
   git clone https://github.com/YoshCasaster/Github-uploader-yosh.git
   ```

2. **Masuk ke folder project**
   ```sh
   cd Github-uploader-yosh
   ```

3. **Install semua dependency**
   ```sh
   npm install
   ```

4. **Gaskeun jalankan projectnya!**
   ```sh
   npm run dev
   ```

---

## 🔥 Fitur Yang Ada
✅ Upload ke GitHub pake API Octokit  
✅ UI keren pake TailwindCSS  
✅ Fast & Furious berkat Vite  
✅ Dukung TypeScript buat yang mau coding lebih mantap  

---

## 📦 Struktur Project

```
/project-root
│── public/           # File statis
│── src/              # Source code
│   ├── components/   # Komponen React
│   ├── pages/        # Halaman-halaman
│   ├── App.tsx       # Entry point React
│── package.json      # Config package
│── vite.config.ts    # Config Vite
│── tailwind.config.js # Config Tailwind
```

---

## ⚙️ Konfigurasi

Edit file `App.tsx` dan ubah bagian berikut:

```tsx
const octokit = new Octokit({
  auth: 'GANTI DENGAN TOKEN GITHUB MU'
});

const USERNAME = 'GANTI DENGAN USERNAME GITHUB MU';
```

Pastikan sudah mengganti dengan **token GitHub** dan **username GitHub** agar aplikasi bisa berjalan dengan baik!

---

## 🚀 Build & Deploy

Kalau mau build buat production:
```sh
npm run build
```
Kalau mau preview hasil build:
```sh
npm run preview
```
Mau deploy? Gampang! Bisa pake **Vercel**, **Netlify**, atau **GitHub Pages**.

---

## 🌐 Test Demo Website
Cek langsung hasilnya di sini: [Test Demo](https://gitpublis.netlify.app/)

---

## 📢 Kontribusi
Mau ikut nambahin fitur? Langsung aja **fork & pull request**, bro!

1. Fork repo ini
2. Bikin branch baru buat perubahan lu
3. Commit perubahan dengan pesan jelas
4. Push ke repo fork lu
5. Buka pull request di repo ini

---

## 🎉 Credits
Dibikin dengan ❤️ sama **YoshCasaster**. Follow GitHub gua buat project kece lainnya! 😉

