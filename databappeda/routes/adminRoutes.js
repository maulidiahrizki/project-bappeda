const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const AdminKabidModel = require("../model/adminModel");
const modelBidang = require("../model/bidangModel");

// Konfigurasi penyimpanan untuk upload gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/profile");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Mendapatkan semua data admin_kabid
router.get("/", async (req, res) => {
  try {
    const data = await AdminKabidModel.getAll();
    res.render("adminkabid/inputadmin", { data });
  } catch (error) {
    req.flash("error", "Terjadi kesalahan saat memuat data.");
    res.redirect("/");
  }
});


// Mengubah rute '/create' menjadi '/tambah'
// Route untuk menampilkan form tambah admin dengan data bidang
router.get("/inputadmin", async (req, res) => {
  try {
    const bidangList = await modelBidang.getAll(); // Memanggil semua data bidang dari modelBidang
    res.render("adminkabid/inputadmin", {
      nama_adminkabid: "",
      nip_adminkabid: "",
      id_bidang: "",
      jabatan_adminkabid: "",
      alamat_adminkabid: "",
      no_telp_adminkabid: "",
      email_adminkabid: "",
      username_adminkabid: "",
      bidangList // Mengirim bidangList ke view
    });
  } catch (error) {
    req.flash("error", "Gagal memuat data bidang.");
    res.redirect("/adminkabid");
  }
});


// Mengubah rute '/store' menjadi '/tambah'
router.post("/tambah", upload.single("foto_profil_adminkabid"), async (req, res) => {
  try {
    const { nama_adminkabid, nip_adminkabid, id_bidang, jabatan_adminkabid, alamat_adminkabid, no_telp_adminkabid, email_adminkabid, username_adminkabid, password_adminkabid } = req.body;
    const data = {
      nama_adminkabid,
      nip_adminkabid,
      id_bidang,
      jabatan_adminkabid,
      alamat_adminkabid,
      no_telp_adminkabid,
      email_adminkabid,
      username_adminkabid,
      password_adminkabid,
      foto_profil_adminkabid: req.file ? req.file.filename : null,
    };
    await AdminKabidModel.tambah(data);
    req.flash("success", "Data admin berhasil disimpan.");
    res.redirect("/adminkabid");
  } catch (error) {
    req.flash("error", "Gagal menyimpan data admin.");
    res.redirect("/adminkabid/tambah");
  }
});


// Mengedit data admin_kabid berdasarkan ID
router.get("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await AdminKabidModel.getById(id);
    if (data.length === 0) {
      req.flash("error", "Data tidak ditemukan.");
      return res.redirect("/adminkabid");
    }
    res.render("admin/edit", data[0]);
  } catch (error) {
    req.flash("error", "Terjadi kesalahan saat memuat data.");
    res.redirect("/adminkabid");
  }
});

// Memperbarui data admin_kabid
router.post("/update/:id", upload.single("foto_profil_adminkabid"), async (req, res) => {
  try {
    const id = req.params.id;
    const { nama_adminkabid, nip_adminkabid, id_bidang, jabatan_adminkabid, alamat_adminkabid, no_telp_adminkabid, email_adminkabid, username_adminkabid, password_adminkabid } = req.body;

    // Buat objek data tanpa foto terlebih dahulu
    const data = {
      nama_adminkabid,
      nip_adminkabid,
      id_bidang,
      jabatan_adminkabid,
      alamat_adminkabid,
      no_telp_adminkabid,
      email_adminkabid,
      username_adminkabid,
      password_adminkabid,
    };

    // Cek apakah ada file yang diunggah, jika ada tambahkan ke objek data
    if (req.file) {
      console.log("File uploaded:", req.file.filename);
      data.foto_profil_adminkabid = req.file.filename;
    }

    console.log("Data to update:", data);    

    // Lanjutkan update data di database
    await AdminKabidModel.update(id, data);
    req.flash("success", "Data admin berhasil diperbarui.");
    res.redirect("/adminkabid");
  } catch (error) {
    req.flash("error", "Gagal memperbarui data admin.");
    res.redirect(`/adminkabid/edit/${id}`);
  }
});



// Menghapus data admin_kabid berdasarkan ID
router.get("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await AdminKabidModel.delete(id);
    req.flash("success", "Data admin berhasil dihapus.");
  } catch (error) {
    req.flash("error", "Gagal menghapus data admin.");
  }
  res.redirect("/adminkabid");
});

module.exports = router;