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

router.get("/hasilinput", async (req, res) => {
  try {
    // Ambil semua data admin dari database
    const admins = await modelAdmin.getAllAdmins(); 

    // Ambil data bidang
    const bidang = await modelAdmin.getAllBidang(); 

    // Render halaman hasilinput dengan data admin dan bidang
    res.render("adminkabid/hasilinput", { admins: admins, bidang: bidang, message: "Daftar Semua Admin" });
  } catch (error) {
    console.error("Error fetching admin data:", error);
    res.status(500).json({ message: "Gagal mengambil data admin", error });
  }
});

// Halaman edit admin berdasarkan ID
router.get("/edit/:id", async (req, res) => {
  const adminId = req.params.id;
  try {
    const admin = await modelAdmin.getAdminById(adminId); // Ambil data admin berdasarkan ID
    const bidang = await modelAdmin.getAllBidang(); // Ambil data bidang
    res.render("adminkabid/editadmin", { admin, bidang });
  } catch (error) {
    console.error("Error fetching admin data:", error);
    res.status(500).json({ message: "Gagal mengambil data admin", error });
  }
});

// Update admin
router.post("/edit/:id", upload.single("foto_profil_adminkabid"), async (req, res) => {
  const adminId = req.params.id;
  const {
    nama_adminkabid,
    nip_adminkabid,
    jabatan_adminkabid,
    alamat_adminkabid,
    no_telp_adminkabid,
    email_adminkabid,
    username_adminkabid,
    password_adminkabid,
    bidang_id,
  } = req.body;

  try {
    let hashedPassword = password_adminkabid;
    if (password_adminkabid) {
      // Jika password baru dimasukkan, hash password-nya
      hashedPassword = await bcrypt.hash(password_adminkabid, 10);
    }

    // Siapkan data untuk diupdate
    const data = {
      nama_adminkabid,
      nip_adminkabid,
      jabatan_adminkabid,
      alamat_adminkabid,
      no_telp_adminkabid,
      email_adminkabid,
      username_adminkabid,
      password_adminkabid: hashedPassword,
      foto_profil_adminkabid: req.file ? req.file.filename : null, // Simpan nama file gambar jika ada
      bidang_id,
    };

    // Panggil model untuk update admin
    await modelAdmin.updateAdmin(adminId, data);

    // Redirect atau respon sukses
    res.json({
      success: true,
      message: 'Data admin berhasil diupdate!',
    });
    res.render("adminkabid/hasilinput", { admin, bidang });

  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengupdate admin",
      error: error,
    });
  }
});


// Hapus admin berdasarkan ID
router.post("/delete/:id", async (req, res) => {
  const adminId = req.params.id;
  try {
    await modelAdmin.deleteAdmin(adminId); // Panggil model untuk menghapus admin
    res.json({
      success: true,
      message: 'Admin berhasil dihapus!',
    });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menghapus admin",
      error: error,
    });
  }
});


module.exports = router;
