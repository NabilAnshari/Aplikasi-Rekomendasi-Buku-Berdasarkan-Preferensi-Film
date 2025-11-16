#  Sistem Rekomendasi Buku Berdasarkan Preferensi Film  
### *Menggunakan Content-Based Filtering (TF-IDF & Cosine Similarity)*

Aplikasi mobile yang dikembangkan bertujuan untuk memberikan rekomendasi buku kepada pengguna berdasarkan film favorit mereka. Sistem ini menggunakan pendekatan **Content-Based Filtering**, sehingga mampu menemukan buku dengan konten yang mirip dengan film pilihan pengguna.
--

##  Fitur Utama

-  **Autentikasi Pengguna** (Login & Register)  
-  **Pencarian Film** (IMDb API)  
-  **Pencarian Buku** (Google Books API)  
-  **Rekomendasi Buku Berdasarkan Film Favorit**  
-  **Manajemen Buku Favorit**  
-  **Pengelolaan Profil Pengguna**  
-  **Aplikasi Mobile** menggunakan React Native (Expo)  
-  **Backend API** menggunakan Express.js & Node.js  
 
##  Metode Rekomendasi

### **1. TF-IDF (Term Frequency – Inverse Document Frequency)**
Digunakan untuk mengekstraksi fitur teks dari sinopsis film dan deskripsi buku, sehingga setiap dokumen memiliki representasi numerik.

### **2. Cosine Similarity**
Digunakan untuk mengukur tingkat kemiripan antara film favorit pengguna dan kumpulan data buku.  
Hasilnya adalah daftar buku paling relevan berdasarkan skor kemiripan.

---

##  Teknologi yang Digunakan

### **Frontend (Mobile App)**
- React Native (Expo)
- Axios
- Context API
- Tailwind (NativeWind)

### **Backend**
- Express.js
- Node.js
- JWT Authentication

### **API Eksternal**
- **IMDb API** — pencarian film  
- **Google Books API** — pencarian buku & pengambilan detail buku  



##  Kesimpulan Penelitian

Berdasarkan penelitian yang berjudul **“Sistem Rekomendasi Buku Berbasis Mobile Berdasarkan Preferensi Film Menggunakan Content Based Filtering”**, diperoleh beberapa kesimpulan penting:

1. **Aplikasi rekomendasi buku berbasis mobile berhasil dikembangkan** sesuai kebutuhan pengguna. Proses penelitian mencakup analisis kebutuhan, perancangan sistem, implementasi, serta pengujian fungsi.  
   Backend dibangun menggunakan **Express JS & Node JS**, serta frontend menggunakan **React Native**. Pengujian menunjukkan bahwa aplikasi berjalan dengan baik pada seluruh fitur utama.

2. **Aplikasi memanfaatkan API dinamis IMDb API dan Google Books API** untuk menampilkan data film dan buku serta menyediakan rekomendasi secara otomatis.  
   Metode **Content-Based Filtering dengan TF-IDF dan Cosine Similarity** berhasil mengidentifikasi kesamaan antara film dan buku sehingga menghasilkan rekomendasi yang relevan dan sesuai preferensi pengguna.

