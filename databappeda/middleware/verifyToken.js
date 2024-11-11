const jwt = require('jsonwebtoken');

// Middleware untuk verifikasi token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // Ambil token dari header

  if (!token) {
    return res.status(403).json({ message: 'Token diperlukan untuk akses' });
  }

  // Verifikasi token menggunakan secret key yang sama dengan yang digunakan saat sign token
  jwt.verify(token, 'your_jwt_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token tidak valid' });
    }

    req.user = decoded; // Menyimpan data user yang didecode dari token
    next(); // Lanjutkan ke route berikutnya
  });
};

module.exports = verifyToken;
