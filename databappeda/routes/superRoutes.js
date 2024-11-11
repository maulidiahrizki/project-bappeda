const express = require("express");
const bcrypt = require("bcrypt");
const modelSuperAdmin = require("../model/superModel"); // Sesuaikan dengan path ke superModel.js
const verifyToken = require('../middleware/verifyToken');
const jwt = require("jsonwebtoken"); // Untuk token autentikasi
const router = express.Router();

// Register Super Admin
router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  
  // Menghash password sebelum menyimpannya di database
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hashing password

    // Menyiapkan data untuk disimpan
    const data = { 
      username_superadmin: username, 
      password_superadmin: hashedPassword, 
      email_superadmin: email // Meskipun tidak digunakan dalam login, tetap disimpan di database
    };

    // Menyimpan data ke database
    await modelSuperAdmin.register(data);
    res.status(201).json({ message: "Super Admin berhasil didaftarkan" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat pendaftaran", error });
  }
});

// Login Super Admin dengan Username dan Password
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Mencari super admin berdasarkan username
    const result = await modelSuperAdmin.getByUsername(username);
    
    if (result.length > 0) {
      const user = result[0];  // Mendapatkan data super admin

      // Memverifikasi password yang dimasukkan dengan yang ada di database
      const isPasswordValid = await modelSuperAdmin.verifyPassword(user.password_superadmin, password);

      if (isPasswordValid) {
        // Membuat token untuk autentikasi
        const token = jwt.sign({ userId: user.id_superadmin }, 'your_jwt_secret_key', { expiresIn: '1h' });

        res.status(200).json({ message: 'Login berhasil', userId: user.id_superadmin, token: token });
      } else {
        res.status(400).json({ message: "Password salah" });
      }
    } else {
      res.status(404).json({ message: "Username tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat login", error });
  }
});

router.get('/admin/dashboard', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Selamat datang di dashboard admin!', user: req.user });
});

router.get('/login', (req, res) => {
  res.render('superadmin/login'); // Pastikan path ini sesuai dengan letak file login.ejs
});

module.exports = router;
