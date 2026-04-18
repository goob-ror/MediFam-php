const express = require("express");
const router = express.Router();
const pool = require("../config/database");
const authMiddleware = require("../middleware/auth");
const { validateFields } = require("../middleware/inputSecurity");

// Get user profile with all related data
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    // Get user profile
    const [profiles] = await pool.execute(
      `SELECT * FROM user_profiles WHERE user_id = ?`,
      [userId]
    );

    // Get pasangan KB data
    const [pasanganKB] = await pool.execute(
      `SELECT * FROM pasangan_kb WHERE user_id = ?`,
      [userId]
    );

    let asuransiData = null;
    let riwayatReproduksi = null;
    let kontrasepsiAktif = null;

    if (pasanganKB.length > 0) {
      const pasanganKbId = pasanganKB[0].id;

      // Get asuransi data
      try {
        const [asuransi] = await pool.execute(
          `SELECT * FROM asuransi WHERE pasangan_kb_id = ? AND aktif = 1 ORDER BY created_at DESC LIMIT 1`,
          [pasanganKbId]
        );
        asuransiData = asuransi.length > 0 ? asuransi[0] : null;
      } catch (err) {
        console.error('[Profile GET] Error fetching asuransi:', err.message);
      }

      // Get riwayat reproduksi
      try {
        const [riwayat] = await pool.execute(
          `SELECT * FROM riwayat_reproduksi WHERE pasangan_kb_id = ? ORDER BY created_at DESC LIMIT 1`,
          [pasanganKbId]
        );
        riwayatReproduksi = riwayat.length > 0 ? riwayat[0] : null;
      } catch (err) {
        console.error('[Profile GET] Error fetching riwayat:', err.message);
      }

      // Get active kontrasepsi
      try {
        const [pelayanan] = await pool.execute(
          `SELECT 
            p.*, 
            mk.nama as nama_kontrasepsi 
          FROM pelayanan_kb p
          LEFT JOIN master_kontrasepsi mk ON p.kontrasepsi_yang_dipilih = mk.id
          WHERE p.pasangan_kb_id = ? 
            AND p.tanggal_pencabutan IS NULL
          ORDER BY p.tanggal_pelayanan DESC 
          LIMIT 1`,
          [pasanganKbId]
        );
        kontrasepsiAktif = pelayanan.length > 0 ? pelayanan[0] : null;
      } catch (err) {
        console.error('[Profile GET] Error fetching kontrasepsi:', err.message);
      }
    }

    if (profiles.length === 0) {
      // Return empty profile structure
      return res.json({
        success: true,
        data: {
          user_profile: {
            user_id: userId,
            nik: "",
            nama_lengkap: "",
            jenis_kelamin: null,
            no_hp: "",
            alamat: "",
            kecamatan: "",
            tempat_lahir: "",
            tanggal_lahir: null,
            no_kk: "",
            jenis_akseptor: "",
          },
          pasangan_kb: null,
          asuransi: null,
          riwayat_reproduksi: null,
          kontrasepsi_aktif: null,
        },
      });
    }

    res.json({
      success: true,
      data: {
        user_profile: profiles[0],
        pasangan_kb: pasanganKB.length > 0 ? pasanganKB[0] : null,
        asuransi: asuransiData,
        riwayat_reproduksi: riwayatReproduksi,
        kontrasepsi_aktif: kontrasepsiAktif,
      },
    });
  } catch (error) {
    console.error("[Profile GET] Error:", error);
    console.error("[Profile GET] Error message:", error.message);
    console.error("[Profile GET] Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Update user profile with all related data
router.put("/", authMiddleware, validateFields, async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const userId = req.user.userId;
    const {
      // User profile
      nama_lengkap,
      nik,
      no_kk,
      jenis_kelamin,
      tempat_lahir,
      tanggal_lahir,
      no_hp,
      alamat,
      kecamatan,
      jenis_akseptor,
      // Pasangan KB
      nama_pasangan,
      nik_pasangan,
      no_hp_pasangan,
      tempat_lahir_pasangan,
      tanggal_lahir_pasangan,
      pekerjaan,
      pendidikan,
      jumlah_anak_laki,
      jumlah_anak_perempuan,
      usia_anak_terakhir,
      tahapan_kb,
      status_pernikahan,
      // Asuransi
      jenis_asuransi,
      no_bpjs,
      jenis_kepesertaan,
      faskes_tk1,
      // Riwayat Reproduksi
      gravida,
      partus,
      abortus,
      hidup,
      keputihan,
      tumor_ginekologi,
      penyakit_kuning,
      pms,
      // User preference
      kontrasepsi_yang_diinginkan,
    } = req.body;

    // 1. Update or Insert user_profiles
    const [existingProfile] = await connection.execute(
      "SELECT user_id FROM user_profiles WHERE user_id = ?",
      [userId]
    );

    if (existingProfile.length === 0) {
      await connection.execute(
        `INSERT INTO user_profiles 
        (user_id, nik, nama_lengkap, jenis_kelamin, no_hp, alamat, kecamatan, tempat_lahir, tanggal_lahir, no_kk, kontrasepsi_yang_diinginkan, jenis_akseptor) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId, nik || null, nama_lengkap || null, jenis_kelamin || null,
          no_hp || null, alamat || null, kecamatan || null, tempat_lahir || null,
          tanggal_lahir || null, no_kk || null, kontrasepsi_yang_diinginkan || null,
          jenis_akseptor || null
        ]
      );
    } else {
      await connection.execute(
        `UPDATE user_profiles SET 
        nik = ?, nama_lengkap = ?, jenis_kelamin = ?, no_hp = ?, 
        alamat = ?, kecamatan = ?, tempat_lahir = ?, tanggal_lahir = ?, no_kk = ?,
        kontrasepsi_yang_diinginkan = ?, jenis_akseptor = ?, updated_at = NOW()
        WHERE user_id = ?`,
        [
          nik || null, nama_lengkap || null, jenis_kelamin || null, no_hp || null,
          alamat || null, kecamatan || null, tempat_lahir || null, tanggal_lahir || null,
          no_kk || null, kontrasepsi_yang_diinginkan || null, jenis_akseptor || null,  userId,
        ]
      );
    }

    // 2. Update or Insert pasangan_kb (if data provided)
    if (nama_pasangan) {
      const [existingPasangan] = await connection.execute(
        "SELECT id FROM pasangan_kb WHERE user_id = ?",
        [userId]
      );

      let pasanganKbId;

      if (existingPasangan.length === 0) {
        const [result] = await connection.execute(
          `INSERT INTO pasangan_kb 
          (user_id, nama_pasangan, nik_pasangan, jenis_kelamin, no_hp_pasangan, 
          tempat_lahir_pasangan, tanggal_lahir_pasangan, pekerjaan, pendidikan, 
          jumlah_anak_laki, jumlah_anak_perempuan, usia_anak_terakhir, tahapan_kb, status_pernikahan) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            nama_pasangan || null,
            nik_pasangan || null,
            jenis_kelamin === "P" ? "L" : "P", // Opposite gender
            no_hp_pasangan || null,
            tempat_lahir_pasangan || null,
            tanggal_lahir_pasangan || null,
            pekerjaan || null,
            pendidikan || null,
            jumlah_anak_laki || 0,
            jumlah_anak_perempuan || 0,
            usia_anak_terakhir || null,
            tahapan_kb || null,
            status_pernikahan || 'menikah',
          ]
        );
        pasanganKbId = result.insertId;
      } else {
        pasanganKbId = existingPasangan[0].id;
        await connection.execute(
          `UPDATE pasangan_kb SET 
          nama_pasangan = ?, nik_pasangan = ?, no_hp_pasangan = ?, 
          tempat_lahir_pasangan = ?, tanggal_lahir_pasangan = ?, 
          pekerjaan = ?, pendidikan = ?, 
          jumlah_anak_laki = ?, jumlah_anak_perempuan = ?, 
          usia_anak_terakhir = ?, tahapan_kb = ?, status_pernikahan = ?,
          updated_at = NOW()
          WHERE id = ?`,
          [
            nama_pasangan || null,
            nik_pasangan || null,
            no_hp_pasangan || null,
            tempat_lahir_pasangan || null,
            tanggal_lahir_pasangan || null,
            pekerjaan || null,
            pendidikan || null,
            jumlah_anak_laki || 0,
            jumlah_anak_perempuan || 0,
            usia_anak_terakhir || null,
            tahapan_kb || null,
            status_pernikahan || 'menikah',
            pasanganKbId,
          ]
        );
      }

      // 3. Update or Insert asuransi (if data provided)
      if (jenis_asuransi) {
        const [existingAsuransi] = await connection.execute(
          "SELECT id FROM asuransi WHERE pasangan_kb_id = ? AND aktif = 1",
          [pasanganKbId]
        );

        if (existingAsuransi.length === 0) {
          await connection.execute(
            `INSERT INTO asuransi 
            (pasangan_kb_id, jenis_asuransi, no_bpjs, jenis_kepesertaan, faskes_tk1) 
            VALUES (?, ?, ?, ?, ?)`,
            [pasanganKbId, jenis_asuransi || 'BPJS', no_bpjs || null, jenis_kepesertaan || null, faskes_tk1 || null]
          );
        } else {
          await connection.execute(
            `UPDATE asuransi SET 
            jenis_asuransi = ?, no_bpjs = ?, jenis_kepesertaan = ?, faskes_tk1 = ?,
            updated_at = NOW()
            WHERE id = ?`,
            [jenis_asuransi || 'BPJS', no_bpjs || null, jenis_kepesertaan || null, faskes_tk1 || null, existingAsuransi[0].id]
          );
        }
      }

      // 4. Update or Insert riwayat_reproduksi (if data provided)
      if (gravida !== undefined || partus !== undefined) {
        const [existingRiwayat] = await connection.execute(
          "SELECT id FROM riwayat_reproduksi WHERE pasangan_kb_id = ?",
          [pasanganKbId]
        );

        if (existingRiwayat.length === 0) {
          await connection.execute(
            `INSERT INTO riwayat_reproduksi 
            (pasangan_kb_id, gravida, partus, abortus, hidup, keputihan, tumor_ginekologi, penyakit_kuning, pms) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              pasanganKbId,
              gravida || 0,
              partus || 0,
              abortus || 0,
              hidup || 0,
              keputihan ? 1 : 0,
              tumor_ginekologi ? 1 : 0,
              penyakit_kuning ? 1 : 0,
              pms ? 1 : 0,
            ]
          );
        } else {
          await connection.execute(
            `UPDATE riwayat_reproduksi SET 
            gravida = ?, partus = ?, abortus = ?, hidup = ?, 
            keputihan = ?, tumor_ginekologi = ?, penyakit_kuning = ?, pms = ?,
            updated_at = NOW()
            WHERE id = ?`,
            [
              gravida || 0,
              partus || 0,
              abortus || 0,
              hidup || 0,
              keputihan ? 1 : 0,
              tumor_ginekologi ? 1 : 0,
              penyakit_kuning ? 1 : 0,
              pms ? 1 : 0,
              existingRiwayat[0].id,
            ]
          );
        }
      }
    }

    await connection.commit();

    res.json({
      success: true,
      message: "Profil berhasil diperbarui",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Update profile error:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memperbarui profil",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  } finally {
    connection.release();
  }
});

module.exports = router;
