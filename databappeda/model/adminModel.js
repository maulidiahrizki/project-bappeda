const connection = require("../database/database");

class modelAdmin {
  // Menambahkan admin baru
  static async tambahAdmin(data) {
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO admin_kabid (nama_adminkabid, nip_adminkabid, jabatan_adminkabid, alamat_adminkabid, no_telp_adminkabid, email_adminkabid, username_adminkabid, password_adminkabid, foto_profil_adminkabid, bidang_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          data.nama_adminkabid,
          data.nip_adminkabid,
          data.jabatan_adminkabid,
          data.alamat_adminkabid,
          data.no_telp_adminkabid,
          data.email_adminkabid,
          data.username_adminkabid,
          data.password_adminkabid,
          data.foto_profil_adminkabid,
          data.bidang_id,
        ],
        function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  // Mendapatkan semua admin dengan data bidang terkait
  static async getAllAdmins() {
    return new Promise((resolve, reject) => {
      connection.query(
        `
        SELECT admin_kabid.*, bidang.nama_bidang 
        FROM admin_kabid 
        LEFT JOIN bidang ON admin_kabid.bidang_id = bidang.id_bidang
      `,
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
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

  // Update Admin
  static async updateAdmin(adminId, updatedData) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE admin_kabid SET
          nama_adminkabid = ?, 
          nip_adminkabid = ?, 
          jabatan_adminkabid = ?, 
          alamat_adminkabid = ?, 
          no_telp_adminkabid = ?, 
          email_adminkabid = ?, 
          username_adminkabid = ?, 
          password_adminkabid = ?, 
          foto_profil_adminkabid = ?, 
          bidang_id = ?
        WHERE id_adminkabid = ?`;

      connection.query(
        query,
        [
          updatedData.nama_adminkabid,
          updatedData.nip_adminkabid,
          updatedData.jabatan_adminkabid,
          updatedData.alamat_adminkabid,
          updatedData.no_telp_adminkabid,
          updatedData.email_adminkabid,
          updatedData.username_adminkabid,
          updatedData.password_adminkabid || updatedData.password_adminkabid,  // Cek password (jika ada)
          updatedData.foto_profil_adminkabid || updatedData.foto_profil_adminkabid,  // Cek foto
          updatedData.bidang_id,
          adminId,
        ],
        function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  // Hapus Admin
  static async deleteAdmin(adminId) {
    return new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM admin_kabid WHERE id_adminkabid = ?",
        [adminId],
        function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }
}

module.exports = modelAdmin;
