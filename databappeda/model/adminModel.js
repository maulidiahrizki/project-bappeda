const connection = require("../database/database");
const bcrypt = require("bcrypt");

class AdminKabidModel {
  // Mendapatkan semua data admin_kabid
  static async getAll() {
    return new Promise((resolve, reject) => {
      connection.query("SELECT admin_kabid.*, bidang.nama_bidang FROM admin_kabid JOIN bidang ON admin_kabid.bidang_id = bidang.id_bidang", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Menyimpan data admin_kabid baru
  static async tambah(data) {
    return new Promise(async (resolve, reject) => {
      try {
        if (data.password_adminkabid) {
          data.password_adminkabid = await bcrypt.hash(data.password_adminkabid, 10);
        }
        connection.query("INSERT INTO admin_kabid SET ?", data, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Mendapatkan data admin_kabid berdasarkan ID
  static async getById(id) {
    return new Promise((resolve, reject) => {
      connection.query("SELECT admin_kabid.*, bidang.nama_bidang FROM admin_kabid JOIN bidang ON admin_kabid.bidang_id = bidang.id_bidang WHERE admin_kabid.id_adminkabid = ?", id, (err, rows) => {
        if (err) reject(err);
        else resolve(rows[0]); // returning a single object
      });
    });
  }

  // Mengupdate data admin_kabid berdasarkan ID
  static async update(id, data) {
    return new Promise(async (resolve, reject) => {
      try {
        if (data.password_adminkabid) {
          data.password_adminkabid = await bcrypt.hash(data.password_adminkabid, 10);
        }
        connection.query("UPDATE admin_kabid SET ? WHERE id_adminkabid = ?", [data, id], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Menghapus data admin_kabid berdasarkan ID
  static async delete(id) {
    return new Promise((resolve, reject) => {
      connection.query("DELETE FROM admin_kabid WHERE id_adminkabid = ?", id, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
}


module.exports = AdminKabidModel;
