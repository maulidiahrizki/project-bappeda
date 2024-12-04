const express = require("express");
const router = express.Router();
const modelAdmin = require("../model/adminModel");
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcrypt");

// Setup multer untuk upload gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });


// Halaman Dashboard Admin
router.get("/dashboard", async (req, res) => {
  try {
    const result = await modelAdmin.getAllAdmins(); // Ambil data admin
    res.render("adminkabid/dashboard", { admins: result }); // Kirim data admins ke view
  } catch (error) {
    console.error("Error getting admin data:", error);
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
});


// Halaman input admin baru
router.get("/input", async (req, res) => {
  try {
    const bidang = await modelAdmin.getAllBidang(); // Ambil data bidang
    res.render("adminkabid/inputadmin", { bidang });
  } catch (error) {
    console.error("Error fetching bidang data:", error);
    res.status(500).json({ message: "Gagal mengambil data bidang", error });
  }
});

// Tambah admin baru
// Halaman input admin baru
router.post("/input", upload.single("foto_profil_adminkabid"), async (req, res) => {
  const {
    nama_adminkabid,
    nip_adminkabid,
    jabatan_adminkabid,
    alamat_adminkabid,
    no_telp_adminkabid,
    email_adminkabid,
    username_adminkabid,
    password_adminkabid,
    bidang_id
  } = req.body;

  try {
    // Hash password menggunakan bcrypt
    const hashedPassword = await bcrypt.hash(password_adminkabid, 10);

    // Siapkan data untuk ditambahkan ke database
    const data = {
      nama_adminkabid,
      nip_adminkabid,
      jabatan_adminkabid,
      alamat_adminkabid,
      no_telp_adminkabid,
      email_adminkabid,
      username_adminkabid,
      password_adminkabid: hashedPassword,
      foto_profil_adminkabid: req.file ? req.file.filename : null, // Simpan nama file gambar
      bidang_id
    };

    // Panggil model untuk tambah admin
    const result = await modelAdmin.tambahAdmin(data);
    
    // Ambil ID admin yang baru saja ditambahkan
    const adminId = result.insertId;  // ID yang baru dimasukkan

    // Kirim respons sukses ke frontend
    res.json({
      success: true,
      message: 'Data berhasil disimpan!',
      adminId: adminId
    });

  } catch (error) {
    console.error("Error adding admin:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menambah admin",
      error: error
    });
  }
});

// Halaman hasil input admin
// Menampilkan hasil input admin (semua data admin)
router.get("/hasilinput", async (req, res) => {
  try {
    // Ambil semua data admin dari database
    const admins = await modelAdmin.getAllAdmins(); // Ambil semua data admin

    // Render halaman hasilinput dengan data admin
    res.render("adminkabid/hasilinput", { admins: admins, message: "Daftar Semua Admin" });
  } catch (error) {
    console.error("Error fetching admin data:", error);
    res.status(500).json({ message: "Gagal mengambil data admin", error });
  }
});

// Menampilkan halaman Edit Admin berdasarkan ID
// Menampilkan halaman Edit Admin berdasarkan ID
// Menampilkan data Admin yang ingin diedit (AJAX)
router.get("/edit/:id", async (req, res) => {
  const adminId = req.params.id;
  try {
    const admins = await modelAdmin.getAllAdmins();
    const adminToEdit = admins.find(admin => admin.id_adminkabid === parseInt(adminId));

    if (!adminToEdit) {
      return res.status(404).json({ success: false, message: "Admin tidak ditemukan" });
    }

    res.json({ success: true, admin: adminToEdit });
  } catch (error) {
    console.error("Error fetching admin for edit:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan", error });
  }
});


// Update Admin
// Update Admin (di backend)
router.post("/edit/:id", upload.single("foto_profil_adminkabid"), async (req, res) => {
  const adminId = req.params.id;
  const {
    nama_adminkabid,
    nip_adminkabid,
    jabatan_adminkabid,
    alamat_adminkabid,
    no_telp_adminkabid,
    email_adminkabid,
    username_adminkabid,  // username tidak perlu diupdate
    password_adminkabid,
    bidang_id
  } = req.body;

  try {
    let updatedData = {
      nama_adminkabid,
      nip_adminkabid,
      jabatan_adminkabid,
      alamat_adminkabid,
      no_telp_adminkabid,
      email_adminkabid,
      username_adminkabid, // tidak perlu update username
      bidang_id,
    };

    // Cek apakah password diubah
    if (password_adminkabid) {
      updatedData.password_adminkabid = await bcrypt.hash(password_adminkabid, 10); 
    }

    // Update foto profil jika ada
    if (req.file) {
      updatedData.foto_profil_adminkabid = req.file.filename; 
    }

    await modelAdmin.updateAdmin(adminId, updatedData);
    res.json({ success: true, message: "Data berhasil diupdate" });

  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ success: false, message: "Gagal mengupdate data admin", error });
  }
});


// Hapus Admin
router.get("/delete/:id", async (req, res) => {
  const adminId = req.params.id;
  
  try {
    await modelAdmin.deleteAdmin(adminId);
    res.redirect("/adminkabid/dashboard"); 
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({ message: "Gagal menghapus admin", error });
  }
});

module.exports = router;
