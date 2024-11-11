const express = require("express");
const modelBidang = require("../model/bidangModel"); // Sesuaikan dengan path ke bidangModel.js
const router = express.Router();

// Menambahkan bidang baru
router.post("/tambah", async (req, res) => {
  const { nama_bidang } = req.body;

  try {
    const data = { nama_bidang };
    await modelBidang.addBidang(data);
    res.status(201).json({ message: "Bidang berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat menambahkan bidang", error });
  }
});

// Mendapatkan semua bidang
router.get("/", async (req, res) => {
  try {
    const result = await modelBidang.getAllBidang();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat mendapatkan data bidang", error });
  }
});

// Mendapatkan bidang berdasarkan ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await modelBidang.getBidangById(id);
    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(404).json({ message: "Bidang tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat mendapatkan data bidang", error });
  }
});

// Mengupdate bidang
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nama_bidang } = req.body;

  try {
    const data = { nama_bidang };
    const result = await modelBidang.updateBidang(id, data);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Bidang berhasil diupdate" });
    } else {
      res.status(404).json({ message: "Bidang tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat mengupdate bidang", error });
  }
});

// Menghapus bidang
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await modelBidang.deleteBidang(id);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Bidang berhasil dihapus" });
    } else {
      res.status(404).json({ message: "Bidang tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat menghapus bidang", error });
  }
});

// Rute untuk halaman dashboard bidang
router.get('/dashboard', (req, res) => {
    res.render('/bidang/dashboard'); // Pastikan path ini sesuai dengan letak file dashboard.ejs
  });

module.exports = router;
