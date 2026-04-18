const express = require("express");
const router = express.Router();
const db = require("../config/database");
const { authenticateToken, requireBidan } = require("../middleware/auth");

// Get all registrants with filters
router.get("/registrants", authenticateToken, requireBidan, async (req, res) => {
  try {
    const { kegiatan_id, hadir, search, page = 1, limit = 10 } = req.query;
    
    let query = `
      SELECT 
        ps.id,
        ps.kegiatan_id,
        ps.pasangan_kb_id,
        ps.hadir,
        ps.tanggal_konfirmasi,
        ps.catatan,
        ps.created_at,
        up.nama_lengkap,
        up.nik,
        up.no_hp,
        up.alamat,
        up.kecamatan,
        ks.judul_kegiatan,
        ks.tanggal_kegiatan,
        ks.waktu_mulai,
        ks.waktu_selesai,
        ks.lokasi
      FROM peserta_safari ps
      INNER JOIN pasangan_kb pk ON ps.pasangan_kb_id = pk.id
      INNER JOIN users u ON pk.user_id = u.id
      INNER JOIN user_profiles up ON u.id = up.user_id
      INNER JOIN kegiatan_safari ks ON ps.kegiatan_id = ks.id
      WHERE 1=1
    `;
    
    const params = [];
    
    // Filter by kegiatan
    if (kegiatan_id) {
      query += ` AND ps.kegiatan_id = ?`;
      params.push(kegiatan_id);
    }
    
    // Filter by attendance status
    if (hadir !== undefined && hadir !== '') {
      query += ` AND ps.hadir = ?`;
      params.push(hadir === '1' || hadir === 'true' ? 1 : 0);
    }
    
    // Search by name or NIK
    if (search) {
      query += ` AND (up.nama_lengkap LIKE ? OR up.nik LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ` ORDER BY ps.created_at DESC`;
    
    // Execute query
    const [registrants] = await db.query(query, params);
    
    res.json({
      success: true,
      data: {
        registrants,
        pagination: {
          currentPage: parseInt(page),
          totalRecords: registrants.length,
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get registrants error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal memuat data pendaftar",
      error: error.message,
    });
  }
});

// Get safari events
router.get("/events", authenticateToken, requireBidan, async (req, res) => {
  try {
    const query = `
      SELECT 
        id,
        judul_kegiatan,
        tanggal_kegiatan,
        waktu_mulai,
        waktu_selesai,
        lokasi,
        kecamatan,
        target_peserta,
        peserta_hadir,
        status
      FROM kegiatan_safari
      ORDER BY tanggal_kegiatan DESC
    `;
    
    const [events] = await db.query(query);
    
    res.json({
      success: true,
      data: {
        events,
      },
    });
  } catch (error) {
    console.error("Get safari events error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal memuat data kegiatan",
      error: error.message,
    });
  }
});

// Get registrant detail
router.get("/registrants/:id", authenticateToken, requireBidan, async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        ps.id,
        ps.kegiatan_id,
        ps.pasangan_kb_id,
        ps.hadir,
        ps.tanggal_konfirmasi,
        ps.catatan,
        ps.created_at,
        up.nama_lengkap,
        up.nik,
        up.no_hp,
        up.alamat,
        up.kecamatan,
        up.tempat_lahir,
        up.tanggal_lahir,
        ks.judul_kegiatan,
        ks.tanggal_kegiatan,
        ks.waktu_mulai,
        ks.waktu_selesai,
        ks.lokasi AS lokasi_kegiatan,
        pk.nama_pasangan,
        pk.jumlah_anak_laki,
        pk.jumlah_anak_perempuan
      FROM peserta_safari ps
      INNER JOIN pasangan_kb pk ON ps.pasangan_kb_id = pk.id
      INNER JOIN users u ON pk.user_id = u.id
      INNER JOIN user_profiles up ON u.id = up.user_id
      INNER JOIN kegiatan_safari ks ON ps.kegiatan_id = ks.id
      WHERE ps.id = ?
    `;
    
    const [registrants] = await db.query(query, [id]);
    
    if (registrants.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Pendaftar tidak ditemukan",
      });
    }
    
    res.json({
      success: true,
      data: {
        registrant: registrants[0],
      },
    });
  } catch (error) {
    console.error("Get registrant detail error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal memuat detail pendaftar",
      error: error.message,
    });
  }
});

// Mark attendance
router.put("/registrants/:id/attendance", authenticateToken, requireBidan, async (req, res) => {
  try {
    const { id } = req.params;
    const { hadir } = req.body;
    
    const query = `
      UPDATE peserta_safari 
      SET hadir = ?, tanggal_konfirmasi = NOW()
      WHERE id = ?
    `;
    
    await db.query(query, [hadir ? 1 : 0, id]);
    
    // Update peserta_hadir count in kegiatan_safari
    const updateCountQuery = `
      UPDATE kegiatan_safari ks
      SET peserta_hadir = (
        SELECT COUNT(*) 
        FROM peserta_safari ps 
        WHERE ps.kegiatan_id = ks.id AND ps.hadir = 1
      )
      WHERE id = (SELECT kegiatan_id FROM peserta_safari WHERE id = ?)
    `;
    
    await db.query(updateCountQuery, [id]);
    
    res.json({
      success: true,
      message: "Kehadiran berhasil diperbarui",
    });
  } catch (error) {
    console.error("Mark attendance error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal memperbarui kehadiran",
      error: error.message,
    });
  }
});

// Delete registrant
router.delete("/registrants/:id", authenticateToken, requireBidan, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get kegiatan_id before deleting
    const [registrant] = await db.query(
      "SELECT kegiatan_id FROM peserta_safari WHERE id = ?",
      [id]
    );
    
    if (registrant.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Pendaftar tidak ditemukan",
      });
    }
    
    const kegiatanId = registrant[0].kegiatan_id;
    
    // Delete registrant
    await db.query("DELETE FROM peserta_safari WHERE id = ?", [id]);
    
    // Update peserta_hadir count
    const updateCountQuery = `
      UPDATE kegiatan_safari 
      SET peserta_hadir = (
        SELECT COUNT(*) 
        FROM peserta_safari 
        WHERE kegiatan_id = ? AND hadir = 1
      )
      WHERE id = ?
    `;
    
    await db.query(updateCountQuery, [kegiatanId, kegiatanId]);
    
    res.json({
      success: true,
      message: "Pendaftar berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete registrant error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menghapus pendaftar",
      error: error.message,
    });
  }
});

// ── Form Session (Pelayanan KB) endpoints ──────────────────────────────────

// Get patient data for form (by pasangan_kb_id)
router.get("/form-session/patient/:pasanganKbId", authenticateToken, requireBidan, async (req, res) => {
  try {
    const { pasanganKbId } = req.params;

    const [rows] = await db.query(
      `SELECT
        pk.id,
        up.nik, up.nama_lengkap, up.jenis_kelamin, up.no_hp,
        up.alamat, up.kecamatan, up.tempat_lahir, up.tanggal_lahir,
        up.kontrasepsi_yang_diinginkan,
        a.jenis_asuransi, a.jenis_kepesertaan, a.faskes_tk1,
        rr.gravida, rr.partus, rr.abortus,
        up.jenis_akseptor AS akseptor
       FROM pasangan_kb pk
       INNER JOIN users u ON pk.user_id = u.id
       INNER JOIN user_profiles up ON u.id = up.user_id
       LEFT JOIN asuransi a ON pk.id = a.pasangan_kb_id
       LEFT JOIN riwayat_reproduksi rr ON pk.id = rr.pasangan_kb_id
       LEFT JOIN (
         SELECT pasangan_kb_id, kontrasepsi_yang_dipilih
         FROM pelayanan_kb
         ORDER BY created_at DESC LIMIT 1
       ) pl ON pk.id = pl.pasangan_kb_id
       WHERE pk.id = ?`,
      [pasanganKbId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Pasien tidak ditemukan" });
    }

    // Nest sub-objects for cleaner frontend consumption
    const row = rows[0];
    const patient = {
      id: row.id,
      akseptor: row.akseptor,
      kontrasepsi_yang_diinginkan: row.kontrasepsi_yang_diinginkan || null,
      user_profile: {
        nik: row.nik,
        nama_lengkap: row.nama_lengkap,
        jenis_kelamin: row.jenis_kelamin,
        no_hp: row.no_hp,
        alamat: row.alamat,
        kecamatan: row.kecamatan,
        tempat_lahir: row.tempat_lahir,
        tanggal_lahir: row.tanggal_lahir,
      },
      asuransi: {
        jenis_asuransi: row.jenis_asuransi,
        jenis_kepesertaan: row.jenis_kepesertaan,
        faskes_tk1: row.faskes_tk1,
      },
      riwayat_reproduksi: {
        gravida: row.gravida,
        partus: row.partus,
        abortus: row.abortus,
      },
    };

    res.json({ success: true, data: { patient } });
  } catch (error) {
    console.error("Get form-session patient error:", error);
    res.status(500).json({ success: false, message: "Gagal memuat data pasien", error: error.message });
  }
});

// Get kontrasepsi list
router.get("/form-session/kontrasepsi", authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, kode, nama, jenis, keterangan FROM master_kontrasepsi WHERE is_active = 1 ORDER BY id"
    );
    res.json({ success: true, data: { kontrasepsi: rows } });
  } catch (error) {
    console.error("Get kontrasepsi error:", error);
    res.status(500).json({ success: false, message: "Gagal memuat data kontrasepsi", error: error.message });
  }
});

// Get existing session data for a patient (latest pelayanan + pemeriksaan)
router.get("/form-session/existing/:pasanganKbId", authenticateToken, requireBidan, async (req, res) => {
  try {
    const { pasanganKbId } = req.params;

    // Get latest pelayanan_kb
    const [pelRows] = await db.query(
      `SELECT * FROM pelayanan_kb WHERE pasangan_kb_id = ? ORDER BY created_at DESC LIMIT 1`,
      [pasanganKbId]
    );

    if (pelRows.length === 0) {
      return res.json({ success: true, data: { session: null } });
    }

    const pelayanan = pelRows[0];

    // Get linked pemeriksaan
    const [pemRows] = await db.query(
      `SELECT * FROM pemeriksaan WHERE id = ? LIMIT 1`,
      [pelayanan.pemeriksaan_id]
    );

    // Get riwayat_reproduksi
    const [rrRows] = await db.query(
      `SELECT * FROM riwayat_reproduksi WHERE pasangan_kb_id = ? LIMIT 1`,
      [pasanganKbId]
    );

    res.json({
      success: true,
      data: {
        session: {
          pelayanan,
          pemeriksaan: pemRows[0] || null,
          riwayat_reproduksi: rrRows[0] || null,
        },
      },
    });
  } catch (error) {
    console.error("Get existing session error:", error);
    res.status(500).json({ success: false, message: "Gagal memuat data sesi", error: error.message });
  }
});

// Update existing session (latest pelayanan + pemeriksaan)
router.put("/form-session/update/:pasanganKbId", authenticateToken, requireBidan, async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { pasanganKbId } = req.params;
    const { pemeriksaan, riwayat_reproduksi, pelayanan } = req.body;

    // Get latest pelayanan_kb to find pemeriksaan_id
    const [pelRows] = await connection.query(
      `SELECT id, pemeriksaan_id FROM pelayanan_kb WHERE pasangan_kb_id = ? ORDER BY created_at DESC LIMIT 1`,
      [pasanganKbId]
    );

    if (pelRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: "Data sesi tidak ditemukan" });
    }

    const { id: pelayananId, pemeriksaan_id: pemeriksaanId } = pelRows[0];

    // Update pemeriksaan
    if (pemeriksaanId) {
      await connection.query(
        `UPDATE pemeriksaan SET
          tekanan_darah_sistolik = ?, tekanan_darah_diastolik = ?, detak_nadi = ?, respirasi = ?,
          suhu = ?, tinggi_badan = ?, berat_badan = ?, imt = ?, lingkar_perut = ?,
          hamil = ?, diduga_hamil = ?, menyusui = ?, tanda_radang = ?, tumor_keganasan = ?,
          tanda_diabetes = ?, kelainan_pembekuan = ?, orchitis_epididymitis = ?,
          posisi_rahim = ?, efek_samping_kb_sebelumnya = ?, tanggal_haid_terakhir = ?, status_umum = ?
        WHERE id = ?`,
        [
          pemeriksaan.tekanan_darah_sistolik,
          pemeriksaan.tekanan_darah_diastolik,
          pemeriksaan.detak_nadi,
          pemeriksaan.respirasi,
          pemeriksaan.suhu,
          pemeriksaan.tinggi_badan,
          pemeriksaan.berat_badan,
          pemeriksaan.imt,
          pemeriksaan.lingkar_perut,
          pemeriksaan.hamil ? 1 : 0,
          pemeriksaan.diduga_hamil ? 1 : 0,
          pemeriksaan.menyusui ? 1 : 0,
          pemeriksaan.tanda_radang ? 1 : 0,
          pemeriksaan.tumor_keganasan ? 1 : 0,
          pemeriksaan.tanda_diabetes ? 1 : 0,
          pemeriksaan.kelainan_pembekuan ? 1 : 0,
          pemeriksaan.orchitis_epididymitis ? 1 : 0,
          pemeriksaan.posisi_rahim || "tidak_diperiksa",
          pemeriksaan.efek_samping_kb_sebelumnya || null,
          pemeriksaan.tanggal_haid_terakhir || null,
          pemeriksaan.status_umum || "baik",
          pemeriksaanId,
        ]
      );
    }

    // Upsert riwayat_reproduksi
    const [existingRR] = await connection.query(
      "SELECT id FROM riwayat_reproduksi WHERE pasangan_kb_id = ? LIMIT 1",
      [pasanganKbId]
    );

    if (existingRR.length > 0) {
      await connection.query(
        `UPDATE riwayat_reproduksi
         SET gravida = ?, partus = ?, abortus = ?,
             penyakit_kuning = ?, keputihan = ?, tumor_ginekologi = ?, pms = ?,
             updated_at = NOW()
         WHERE pasangan_kb_id = ?`,
        [
          riwayat_reproduksi.gravida || 0,
          riwayat_reproduksi.partus || 0,
          riwayat_reproduksi.abortus || 0,
          riwayat_reproduksi.penyakit_kuning ? 1 : 0,
          riwayat_reproduksi.keputihan ? 1 : 0,
          riwayat_reproduksi.tumor_ginekologi ? 1 : 0,
          riwayat_reproduksi.pms ? 1 : 0,
          pasanganKbId,
        ]
      );
    } else {
      await connection.query(
        `INSERT INTO riwayat_reproduksi
          (pasangan_kb_id, gravida, partus, abortus, penyakit_kuning, keputihan, tumor_ginekologi, pms)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          pasanganKbId,
          riwayat_reproduksi.gravida || 0,
          riwayat_reproduksi.partus || 0,
          riwayat_reproduksi.abortus || 0,
          riwayat_reproduksi.penyakit_kuning ? 1 : 0,
          riwayat_reproduksi.keputihan ? 1 : 0,
          riwayat_reproduksi.tumor_ginekologi ? 1 : 0,
          riwayat_reproduksi.pms ? 1 : 0,
        ]
      );
    }

    // Update pelayanan_kb
    await connection.query(
      `UPDATE pelayanan_kb SET
        tanggal_datang = ?, tanggal_pelayanan = ?,
        kontrasepsi_yang_dipilih = ?, tanggal_jadwal_kembali = ?, tanggal_pencabutan = ?,
        hasil_rujukan = ?, keterangan = ?
      WHERE id = ?`,
      [
        pelayanan.tanggal_datang || null,
        pelayanan.tanggal_pelayanan || null,
        pelayanan.kontrasepsi_yang_dipilih || null,
        pelayanan.tanggal_jadwal_kembali || null,
        pelayanan.tanggal_pencabutan || null,
        pelayanan.hasil_rujukan || "tidak_dirujuk",
        pelayanan.keterangan || null,
        pelayananId,
      ]
    );

    await connection.commit();
    res.json({ success: true, message: "Data pelayanan berhasil diperbarui" });
  } catch (error) {
    await connection.rollback();
    console.error("Update form-session error:", error);
    res.status(500).json({ success: false, message: "Gagal memperbarui data pelayanan", error: error.message });
  } finally {
    connection.release();
  }
});

// Submit form pelayanan (pemeriksaan + riwayat_reproduksi + pelayanan_kb)
router.post("/form-session/submit/:pasanganKbId", authenticateToken, requireBidan, async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { pasanganKbId } = req.params;
    const { pemeriksaan, riwayat_reproduksi, pelayanan } = req.body;
    const bidanId = req.user.id;

    // Insert pemeriksaan
    const [pemResult] = await connection.query(
      `INSERT INTO pemeriksaan
        (pasangan_kb_id, tanggal_pemeriksaan,
         tekanan_darah_sistolik, tekanan_darah_diastolik, detak_nadi, respirasi,
         suhu, tinggi_badan, berat_badan, imt, lingkar_perut,
         hamil, diduga_hamil, menyusui, tanda_radang, tumor_keganasan,
         tanda_diabetes, kelainan_pembekuan, orchitis_epididymitis,
         posisi_rahim, efek_samping_kb_sebelumnya, tanggal_haid_terakhir, status_umum)
       VALUES (?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        pasanganKbId,
        pemeriksaan.tekanan_darah_sistolik,
        pemeriksaan.tekanan_darah_diastolik,
        pemeriksaan.detak_nadi,
        pemeriksaan.respirasi,
        pemeriksaan.suhu,
        pemeriksaan.tinggi_badan,
        pemeriksaan.berat_badan,
        pemeriksaan.imt,
        pemeriksaan.lingkar_perut,
        pemeriksaan.hamil ? 1 : 0,
        pemeriksaan.diduga_hamil ? 1 : 0,
        pemeriksaan.menyusui ? 1 : 0,
        pemeriksaan.tanda_radang ? 1 : 0,
        pemeriksaan.tumor_keganasan ? 1 : 0,
        pemeriksaan.tanda_diabetes ? 1 : 0,
        pemeriksaan.kelainan_pembekuan ? 1 : 0,
        pemeriksaan.orchitis_epididymitis ? 1 : 0,
        pemeriksaan.posisi_rahim || "tidak_diperiksa",
        pemeriksaan.efek_samping_kb_sebelumnya || null,
        pemeriksaan.tanggal_haid_terakhir || null,
        pemeriksaan.status_umum || "baik",
      ]
    );

    const pemeriksaanId = pemResult.insertId;

    // Upsert riwayat_reproduksi (check existing first, then insert or update)
    const [existingRR] = await connection.query(
      "SELECT id FROM riwayat_reproduksi WHERE pasangan_kb_id = ? LIMIT 1",
      [pasanganKbId]
    );

    if (existingRR.length > 0) {
      await connection.query(
        `UPDATE riwayat_reproduksi
         SET gravida = ?, partus = ?, abortus = ?,
             penyakit_kuning = ?, keputihan = ?, tumor_ginekologi = ?, pms = ?,
             updated_at = NOW()
         WHERE pasangan_kb_id = ?`,
        [
          riwayat_reproduksi.gravida || 0,
          riwayat_reproduksi.partus || 0,
          riwayat_reproduksi.abortus || 0,
          riwayat_reproduksi.penyakit_kuning ? 1 : 0,
          riwayat_reproduksi.keputihan ? 1 : 0,
          riwayat_reproduksi.tumor_ginekologi ? 1 : 0,
          riwayat_reproduksi.pms ? 1 : 0,
          pasanganKbId,
        ]
      );
    } else {
      await connection.query(
        `INSERT INTO riwayat_reproduksi
          (pasangan_kb_id, gravida, partus, abortus, penyakit_kuning, keputihan, tumor_ginekologi, pms)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          pasanganKbId,
          riwayat_reproduksi.gravida || 0,
          riwayat_reproduksi.partus || 0,
          riwayat_reproduksi.abortus || 0,
          riwayat_reproduksi.penyakit_kuning ? 1 : 0,
          riwayat_reproduksi.keputihan ? 1 : 0,
          riwayat_reproduksi.tumor_ginekologi ? 1 : 0,
          riwayat_reproduksi.pms ? 1 : 0,
        ]
      );
    }

    // Detect jenis_kunjungan: follow_up if tanggal_datang is after the latest tanggal_jadwal_kembali
    const tanggalDatang = pelayanan.tanggal_datang ? new Date(pelayanan.tanggal_datang) : new Date();
    const [latestPelayanan] = await connection.query(
      `SELECT id, tanggal_jadwal_kembali FROM pelayanan_kb
       WHERE pasangan_kb_id = ? AND tanggal_jadwal_kembali IS NOT NULL
       ORDER BY created_at DESC LIMIT 1`,
      [pasanganKbId]
    );

    let jenisKunjungan = "baru";
    let followUpDariId = null;
    if (latestPelayanan.length > 0 && latestPelayanan[0].tanggal_jadwal_kembali) {
      const jadwalKembali = new Date(latestPelayanan[0].tanggal_jadwal_kembali);
      jadwalKembali.setHours(0, 0, 0, 0);
      tanggalDatang.setHours(0, 0, 0, 0);
      if (tanggalDatang >= jadwalKembali) {
        jenisKunjungan = "follow_up";
        followUpDariId = latestPelayanan[0].id;
      }
    }

    // Insert pelayanan_kb
    await connection.query(
      `INSERT INTO pelayanan_kb
        (pasangan_kb_id, pemeriksaan_id, tanggal_datang, tanggal_pelayanan,
         kontrasepsi_yang_dipilih, tanggal_jadwal_kembali, tanggal_pencabutan,
         hasil_rujukan, keterangan, created_by, jenis_kunjungan, follow_up_dari_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        pasanganKbId,
        pemeriksaanId,
        pelayanan.tanggal_datang || null,
        pelayanan.tanggal_pelayanan || null,
        pelayanan.kontrasepsi_yang_dipilih || null,
        pelayanan.tanggal_jadwal_kembali || null,
        pelayanan.tanggal_pencabutan || null,
        pelayanan.hasil_rujukan || "tidak_dirujuk",
        pelayanan.keterangan || null,
        bidanId,
        jenisKunjungan,
        followUpDariId,
      ]
    );

    await connection.commit();
    res.json({ success: true, message: "Data pelayanan berhasil disimpan" });
  } catch (error) {
    await connection.rollback();
    console.error("Submit form-session error:", error);
    res.status(500).json({ success: false, message: "Gagal menyimpan data pelayanan", error: error.message });
  } finally {
    connection.release();
  }
});

// Get user's pelayanan history (for history page)
router.get("/history", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;

    // Get pasangan_kb_id for this user
    const [pkRows] = await db.query(
      "SELECT id FROM pasangan_kb WHERE user_id = ? LIMIT 1",
      [userId]
    );

    if (pkRows.length === 0) {
      return res.json({ success: true, data: { safari: [], pelayanan: [] } });
    }

    const pasanganKbId = pkRows[0].id;

    // Safari history — sessions the user attended
    const [safari] = await db.query(
      `SELECT
        ks.id,
        ks.judul_kegiatan,
        ks.tanggal_kegiatan,
        ks.waktu_mulai,
        ks.waktu_selesai,
        ks.lokasi,
        ps.hadir,
        ps.tanggal_konfirmasi
       FROM peserta_safari ps
       INNER JOIN kegiatan_safari ks ON ps.kegiatan_id = ks.id
       WHERE ps.pasangan_kb_id = ?
       ORDER BY ks.tanggal_kegiatan DESC`,
      [pasanganKbId]
    );

    // Pelayanan (routine) history
    const [pelayanan] = await db.query(
      `SELECT
        pl.id,
        pl.tanggal_datang,
        pl.tanggal_pelayanan,
        pl.tanggal_jadwal_kembali,
        pl.kontrasepsi_yang_dipilih,
        pl.status_pelayanan,
        pl.jenis_kunjungan,
        pl.keterangan,
        pl.created_at,
        mk.nama AS nama_kontrasepsi
       FROM pelayanan_kb pl
       LEFT JOIN master_kontrasepsi mk ON pl.kontrasepsi_yang_dipilih = mk.id
       WHERE pl.pasangan_kb_id = ?
       ORDER BY pl.created_at DESC`,
      [pasanganKbId]
    );

    res.json({ success: true, data: { safari, pelayanan } });
  } catch (error) {
    console.error("Get user history error:", error);
    res.status(500).json({ success: false, message: "Gagal memuat riwayat", error: error.message });
  }
});

module.exports = router;
