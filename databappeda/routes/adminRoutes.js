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
    const result = await modelAdmin.getAllAdmins();
    res.render("adminkabid/dashboard", { admins: result });
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

  // Hash password
  bcrypt.hash(password_adminkabid, 10, async (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: "Error hashing password", error: err });
    }

    // Siapkan data untuk ditambahkan ke database
    const data = {
      nama_adminkabid,
      nip_adminkabid,
      jabatan_adminkabid,
      alamat_adminkabid,
      no_telp_adminkabid,
      email_adminkabid,
      username_adminkabid,
      password_adminkabid: hashedPassword, // Gunakan password yang sudah di-hash
      foto_profil_adminkabid: req.file ? req.file.filename : null, // Menyimpan nama file gambar
      bidang_id
    };

    try {
      // Panggil model untuk tambah admin
      const result = await modelAdmin.tambahAdmin(data);
      res.status(200).json({ message: "Admin berhasil ditambahkan", result });
    } catch (error) {
      console.error("Error adding admin:", error);
      res.status(500).json({ message: "Gagal menambah admin", error });
    }
  });
});

module.exports = router;
