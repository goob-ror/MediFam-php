const express = require("express");
const router = express.Router();
const db = require("../config/database");
const { authenticateToken, requireBidan } = require("../middleware/auth");
const { validateFields } = require("../middleware/inputSecurity");

// Get all sessions with filters
router.get("/", authenticateToken, requireBidan, async (req, res) => {
  try {
    const {
      search,
      status,
      page = 1,
      limit = 10,
      sortBy = "tanggal_kegiatan",
      sortOrder = "DESC",
    } = req.query;

    const params = [];
    let whereClause = `WHERE 1=1`;

    // Search filter
    if (search) {
      whereClause += ` AND (ks.judul_kegiatan LIKE ? OR ks.lokasi LIKE ? OR ks.kecamatan LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Status filter
    if (status) {
      whereClause += ` AND ks.status = ?`;
      params.push(status);
    }

    // Count total records
    const countQuery = `SELECT COUNT(*) as total FROM kegiatan_safari ks ${whereClause}`;
    const [countResult] = await db.query(countQuery, params);
    const totalRecords = countResult[0].total;

    let query = `
      SELECT 
        ks.id,
        ks.judul_kegiatan,
        ks.tanggal_kegiatan,
        ks.waktu_mulai,
        ks.waktu_selesai,
        ks.lokasi,
        ks.lokasi_koordinat,
        ks.kecamatan,
        ks.target_peserta,
        ks.peserta_hadir,
        ks.status,
        ks.created_at,
        ks.updated_at,
        (SELECT COUNT(*) FROM peserta_safari ps WHERE ps.kegiatan_id = ks.id) AS peserta_terdaftar
      FROM kegiatan_safari ks
      ${whereClause}
    `;

    // Add sorting
    const validSortColumns = [
      "tanggal_kegiatan",
      "judul_kegiatan",
      "lokasi",
      "status",
      "created_at",
    ];
    const sortColumn = validSortColumns.includes(sortBy)
      ? sortBy
      : "tanggal_kegiatan";
    const sortDirection = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";
    query += ` ORDER BY ${sortColumn} ${sortDirection}`;

    // Add pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    // Execute query
    const [sessions] = await db.query(query, params);

    res.json({
      success: true,
      data: {
        sessions,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalRecords / parseInt(limit)),
          totalRecords,
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get sessions error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal memuat data sesi",
      error: error.message,
    });
  }
});

// Get session detail
router.get("/:id", authenticateToken, requireBidan, async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        id,
        judul_kegiatan,
        tanggal_kegiatan,
        waktu_mulai,
        waktu_selesai,
        lokasi,
        lokasi_koordinat,
        kecamatan,
        target_peserta,
        peserta_hadir,
        status,
        created_at,
        updated_at
      FROM kegiatan_safari
      WHERE id = ?
    `;

    const [sessions] = await db.query(query, [id]);

    if (sessions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Sesi tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: {
        session: sessions[0],
      },
    });
  } catch (error) {
    console.error("Get session detail error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal memuat detail sesi",
      error: error.message,
    });
  }
});

// Create new session
router.post("/", authenticateToken, requireBidan, validateFields, async (req, res) => {
  try {
    const {
      judul_kegiatan,
      tanggal_kegiatan,
      waktu_mulai,
      waktu_selesai,
      lokasi,
      lokasi_koordinat,
      kecamatan,
      target_peserta,
      status = "terjadwal",
    } = req.body;

    // Validation
    if (!judul_kegiatan || !tanggal_kegiatan || !lokasi) {
      return res.status(400).json({
        success: false,
        message: "Judul kegiatan, tanggal, dan lokasi harus diisi",
      });
    }

    const query = `
      INSERT INTO kegiatan_safari (
        judul_kegiatan,
        tanggal_kegiatan,
        waktu_mulai,
        waktu_selesai,
        lokasi,
        lokasi_koordinat,
        kecamatan,
        target_peserta,
        peserta_hadir,
        status,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, NOW(), NOW())
    `;

    const [result] = await db.query(query, [
      judul_kegiatan,
      tanggal_kegiatan,
      waktu_mulai || null,
      waktu_selesai || null,
      lokasi,
      lokasi_koordinat || null,
      kecamatan || null,
      target_peserta || 0,
      status,
    ]);

    res.status(201).json({
      success: true,
      message: "Sesi berhasil ditambahkan",
      data: {
        id: result.insertId,
      },
    });
  } catch (error) {
    console.error("Create session error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menambahkan sesi",
      error: error.message,
    });
  }
});

// Update session
router.put("/:id", authenticateToken, requireBidan, validateFields, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      judul_kegiatan,
      tanggal_kegiatan,
      waktu_mulai,
      waktu_selesai,
      lokasi,
      lokasi_koordinat,
      kecamatan,
      target_peserta,
      status,
    } = req.body;

    // Check if session exists
    const [existing] = await db.query(
      "SELECT id FROM kegiatan_safari WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Sesi tidak ditemukan",
      });
    }

    // Validation
    if (!judul_kegiatan || !tanggal_kegiatan || !lokasi) {
      return res.status(400).json({
        success: false,
        message: "Judul kegiatan, tanggal, dan lokasi harus diisi",
      });
    }

    const query = `
      UPDATE kegiatan_safari 
      SET 
        judul_kegiatan = ?,
        tanggal_kegiatan = ?,
        waktu_mulai = ?,
        waktu_selesai = ?,
        lokasi = ?,
        lokasi_koordinat = ?,
        kecamatan = ?,
        target_peserta = ?,
        status = ?,
        updated_at = NOW()
      WHERE id = ?
    `;

    await db.query(query, [
      judul_kegiatan,
      tanggal_kegiatan,
      waktu_mulai || null,
      waktu_selesai || null,
      lokasi,
      lokasi_koordinat || null,
      kecamatan || null,
      target_peserta || 0,
      status || "terjadwal",
      id,
    ]);

    res.json({
      success: true,
      message: "Sesi berhasil diupdate",
    });
  } catch (error) {
    console.error("Update session error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengupdate sesi",
      error: error.message,
    });
  }
});

// Delete session
router.delete("/:id", authenticateToken, requireBidan, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if session exists
    const [existing] = await db.query(
      "SELECT id FROM kegiatan_safari WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Sesi tidak ditemukan",
      });
    }

    // Check if there are registrants
    const [registrants] = await db.query(
      "SELECT COUNT(*) as count FROM peserta_safari WHERE kegiatan_id = ?",
      [id]
    );

    if (registrants[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: "Tidak dapat menghapus sesi yang sudah memiliki pendaftar",
      });
    }

    await db.query("DELETE FROM kegiatan_safari WHERE id = ?", [id]);

    res.json({
      success: true,
      message: "Sesi berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete session error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menghapus sesi",
      error: error.message,
    });
  }
});

module.exports = router;
