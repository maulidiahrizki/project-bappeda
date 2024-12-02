const connection = require("../database/database");

class modelAdmin {
  // Menambahkan admin baru
  static async tambahAdmin(data) {
    return new Promise((resolve, reject) => {
      connection.query("INSERT INTO admin_kabid (nama_adminkabid, nip_adminkabid, jabatan_adminkabid, alamat_adminkabid, no_telp_adminkabid, email_adminkabid, username_adminkabid, password_adminkabid, foto_profil_adminkabid, bidang_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [data.nama_adminkabid, data.nip_adminkabid, data.jabatan_adminkabid, data.alamat_adminkabid, data.no_telp_adminkabid, data.email_adminkabid, data.username_adminkabid, data.password_adminkabid, data.foto_profil_adminkabid, data.bidang_id], 
        function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
    });
  }

  // Mendapatkan semua admin
  static async getAllAdmins() {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM admin_kabid", function (err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Mendapatkan bidang
  static async getAllBidang() {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM bidang", function (err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = modelAdmin;
