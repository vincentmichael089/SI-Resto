# SIRESTO🍳

Sistem kasir rumah makan sederhana untuk mengkonversi sistem kasir manual menjadi digital dengan harapan mempercepat, mempermudah, dan dapat memberi informasi baru
untuk mengembangkan bisnis rumah makan. Dilengkapi dengan fitur Sistem Kasir, Pencatatan Transaksi, Visualisasi informasi transaksi, dan Market Basket Analysis.

<b>Demo (harap baca 2 poin dibawah url):</b> 
https://siresto.web.app/ 
- demo dilengkapi otentifikasi kasir yang melakukan pencatatan transaksi, murni untuk menunjukan fungsionalitas inti)
- rules write telah di-disable sehingga tidak dapat dilakukan penambahan / pengubahan / penghapsan transaksi pada demo 
untuk menghindari hal-hal yang tidak sepatutnya terjadi

<b>Dibangun dengan:</b>
- [Vue](https://docs.vuejs.id/)
- [Electron](https://electron.atom.io)
- [Bootstrap-Vue](https://bootstrap-vue.org/)
- [Firebase](https://firebase.google.com/)
- [ApexCharts](https://apexcharts.com/)

<b>Credits:</b>
- Ayah dan Ibu ✊
- [Ibu Yunita](https://github.com/yunitata) Kelas Data Mining dan Business Intelligence Universitas Gadjah Mada (Market Basket Analysis) 
- [Mamikos MAMICAMP 2020](https://mamikos.com/) Kelas Front-end (Vue+Firebase) 

## Instalasi
1. &nbsp;Jalankan perintah npm install pada terminal untuk menginstall dependensi yang dibutuhkan
```bash
npm i
```
2. &nbsp;Buat project baru di Firebase, Buka file .env-example, rename menjadi .env, dan ganti dengan konfigurasi firebase
3. &nbsp;Upload sample-data.json ke Firebase Realtime Database
4. &nbsp;Atur rules database menjadi berikut:
```json
{
  "rules": {
    ".read": true,
    ".write": true,
    "transactions": {
       ".indexOn": ["timestamp"]
    },
    "menus": {
     	".indexOn": ["name"]
    },
    "users": {
      ".indexOn" : ["email", "name"]
    }
  }
}
```
5.1 &nbsp;Build Web
```bash
npm run build
```
5.2 &nbsp;Build Electron
```bash
npm run electron:build
```

## Fitur
<div>
  <b> 1. Beranda - Grafik Pendapatan, Jumlah Pengunjung, dan Jumlah Menu Terjual : </b>
  Grafik ditampilkan mengikuti rentang waktu yang dapat dipilih pada pojok kanan atas halaman (hari, minggu, 1 bulan, 3 bulan, 6 bulan, dan 1 tahun).
  Diharapkan dengan adanya grafik pengguna dapat mengetahui pertumbuhan pendapatan/pengunjung dan berapa bahan makanan yang perlu di-stok berdasarkan jumlah menu yang terjual. 
</div>
<br>
<img src="https://github.com/vincentmichael089/SI-Resto/blob/master/asset/disp-01.png" width="400" />
<br>
<div>
  <b> 2. Beranda - Tabel Market Basket Analysis : </b>
  Slider pada bagian atas table dapat diubah untuk memfilter rules berdasarkan tingkat support atau confidence tertentu. Adanya Market Basket Analysis diharapkan dapat membantu
  pengguna untuk membuat paket menu ataupun mengkombinasikan menu paket dengan menu baru yang akan diluncurkan. Karena pertimbangan waktu komputasi rules yang dihasilkan terbatas pada 3 item menu saja.
  
  > perkiraan kompleksitas: (jumlahMenu)kombinasi(3 item) * jumlahTransaksiKeseluruhan

</div>
<br>
<img src="https://github.com/vincentmichael089/SI-Resto/blob/master/asset/disp-02.png" width="400" />
<br>
<div>
  <b> 3. Pengaturan Menu : </b>
  Lakukan penambahan menu baru, penghapusan menu, perubahan harga menu pada halaman ini.
</div>
<br>
<img src="https://github.com/vincentmichael089/SI-Resto/blob/master/asset/disp-03.png" width="400" />
<br>
<div>
  <b> 4. Riwayat Transaksi : </b>
  Halaman Riwayat Transaksi menunjukan transaksi yang tercatat sampai dengan 1 tahun terakhir. 
</div>
<br>
<img src="https://github.com/vincentmichael089/SI-Resto/blob/master/asset/disp-04.png" width="400" />
<br>
<div>
  <b> 5. Kasir : </b>
  Tambah transaksi baru dengan menekan tombol tambah transaksi, tekan selesai untuk menyelesaikan transaksi, tekan ubah untuk mengubah transaksi, 
  tekan hapus untuk menghapus transaksi. Tekan tab Riwayat Transaksi untuk melihat, mengubah, dan menghapus transaksi yang terjadi pada hari tersebut.
</div>
<br>
<img src="https://github.com/vincentmichael089/SI-Resto/blob/master/asset/disp-05.png" width="400" />

<hr>
