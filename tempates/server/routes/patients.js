const express = require("express");
const router = express.Router();
const db = require("../config/database");
const { authenticateToken, requireBidan } = require("../middleware/auth");
const { validateFields } = require("../middleware/inputSecurity");

// Get all patients with filters
router.get("/", authenticateToken, requireBidan, async (req, res) => {
  try {
    const {
      search,
      sortBy = "tanggal_jadwal_kembali",
      sortOrder = "DESC",
    } = req.query;

    let query = `
      SELECT 
        pk.id,
        up.nik,
        up.nama_lengkap as nama,
        up.jenis_kelamin as jenisKelamin,
        up.no_hp,
        up.alamat,
        up.kecamatan,
        pk.tahapan_kb,
        up.jenis_akseptor as akseptor,
        pl.tanggal_jadwal_kembali,
        pl.created_at as pelayanan_created_at
      FROM pasangan_kb pk
      INNER JOIN users u ON pk.user_id = u.id
      INNER JOIN user_profiles up ON u.id = up.user_id
      LEFT JOIN (
        SELECT 
          pasangan_kb_id,
          kontrasepsi_yang_dipilih,
          tanggal_jadwal_kembali,
          created_at,
          ROW_NUMBER() OVER (PARTITION BY pasangan_kb_id ORDER BY created_at DESC) as rn
        FROM pelayanan_kb
      ) pl ON pk.id = pl.pasangan_kb_id AND pl.rn = 1
      WHERE 1=1
    `;

    const params = [];

    // Search filter
    if (search) {
      query += ` AND (up.nama_lengkap LIKE ? OR up.nik LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    // Add sorting with NULL handling
    const validSortColumns = {
      tanggal_jadwal_kembali: "pl.tanggal_jadwal_kembali",
      nama: "up.nama_lengkap",
      nik: "up.nik",
    };

    const sortColumn = validSortColumns[sortBy] || "pl.tanggal_jadwal_kembali";
    const sortDirection = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

    // Handle NULL values in sorting - put them at the end regardless of sort direction
    if (sortColumn === "pl.tanggal_jadwal_kembali") {
      query += ` ORDER BY ${sortColumn} IS NULL, ${sortColumn} ${sortDirection}`;
    } else {
      query += ` ORDER BY ${sortColumn} ${sortDirection}`;
    }

    // Execute query
    const [patients] = await db.query(query, params);

    // Return all patients - let DataTables handle pagination on frontend
    res.json({
      success: true,
      data: {
        patients: patients.map((p) => {
          const jadwal = p.tanggal_jadwal_kembali;
          let tanggalKembali = null;
          let statusKembali = null;

          if (jadwal) {
            const jadwalDate = new Date(jadwal);
            jadwalDate.setHours(0, 0, 0, 0);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const diffDays = Math.round((jadwalDate - today) / (1000 * 60 * 60 * 24));

            tanggalKembali = jadwalDate.toLocaleDateString("id-ID", {
              day: "2-digit", month: "long", year: "numeric",
            });

            // if (diffDays < -7) {
            //   statusKembali = "Selesai";
            // } else if (diffDays < 0) {
            //   statusKembali = "Terlewat";
            // } else if (diffDays === 0) {
            //   statusKembali = "Selesai";
            // } else {
            //   statusKembali = null; // just show the date
            // }
          }

          return {
            ...p,
            tanggalKembali,
            statusKembali,
          };
        }),
        pagination: {
          totalRecords: patients.length,
        },
      },
    });
  } catch (error) {
    console.error("Get patients error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal memuat data pasien",
      error: error.message,
    });
  }
});

// Get patient detail
router.get("/:id", authenticateToken, requireBidan, async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        pk.id,
        pk.user_id,
        up.nik,
        up.nama_lengkap,
        up.jenis_kelamin,
        up.no_hp,
        up.alamat,
        up.kecamatan,
        up.tempat_lahir,
        up.tanggal_lahir,
        up.no_kk,
        pk.nama_pasangan,
        pk.nik_pasangan,
        pk.pekerjaan,
        pk.pendidikan,
        pk.jumlah_anak_laki,
        pk.jumlah_anak_perempuan,
        pk.tahapan_kb,
        pk.status_pernikahan,
        a.jenis_asuransi,
        a.no_bpjs,
        a.jenis_kepesertaan,
        a.faskes_tk1,
        rr.gravida,
        rr.partus,
        rr.abortus,
        rr.hidup
      FROM pasangan_kb pk
      INNER JOIN users u ON pk.user_id = u.id
      INNER JOIN user_profiles up ON u.id = up.user_id
      LEFT JOIN asuransi a ON pk.id = a.pasangan_kb_id
      LEFT JOIN riwayat_reproduksi rr ON pk.id = rr.pasangan_kb_id
      WHERE pk.id = ?
    `;

    const [patients] = await db.query(query, [id]);

    if (patients.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Pasien tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: {
        patient: patients[0],
      },
    });
  } catch (error) {
    console.error("Get patient detail error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal memuat detail pasien",
      error: error.message,
    });
  }
});

// Get patient service history (pelayanan_kb)
router.get("/:id/history", authenticateToken, requireBidan, async (req, res) => {
  try {
    const { id } = req.params;

    const [history] = await db.query(
      `SELECT 
        pl.id,
        pl.tanggal_datang,
        pl.tanggal_pelayanan,
        pl.kontrasepsi_yang_dipilih,
        pl.tanggal_pasang,
        pl.tanggal_jadwal_kembali,
        pl.tanggal_pencabutan,
        pl.alasan_pencabutan,
        pl.hasil_rujukan,
        pl.status_pelayanan,
        pl.keterangan,
        pl.created_at,
        pm.tekanan_darah_sistolik,
        pm.tekanan_darah_diastolik,
        pm.detak_nadi,
        pm.suhu,
        pm.tinggi_badan,
        pm.berat_badan,
        pm.imt,
        pm.lingkar_perut,
        pm.status_umum
      FROM pelayanan_kb pl
      LEFT JOIN pemeriksaan pm ON pl.pemeriksaan_id = pm.id
      WHERE pl.pasangan_kb_id = ?
      ORDER BY pl.created_at DESC`,
      [id]
    );

    // Resolve kontrasepsi names
    const [kontrasepsiList] = await db.query(
      "SELECT id, nama FROM master_kontrasepsi"
    );
    const kontrasepsiMap = Object.fromEntries(
      kontrasepsiList.map((k) => [String(k.id), k.nama])
    );

    const mapped = history.map((h) => {
      const ids = h.kontrasepsi_yang_dipilih
        ? h.kontrasepsi_yang_dipilih.split(",").map((s) => s.trim())
        : [];
      return {
        ...h,
        kontrasepsi_nama: ids.map((i) => kontrasepsiMap[i] || i).join(", ") || "-",
      };
    });

    res.json({ success: true, data: { history: mapped } });
  } catch (error) {
    console.error("Get patient history error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal memuat riwayat pelayanan",
      error: error.message,
    });
  }
});

// Create new patient
router.post("/", authenticateToken, requireBidan, validateFields, async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const {
      nik,
      nama_lengkap,
      jenis_kelamin,
      tempat_lahir,
      tanggal_lahir,
      no_hp,
      alamat,
      kecamatan,
      no_kk,
    } = req.body;

    // Validate required fields
    if (!nik || !nama_lengkap || !jenis_kelamin || !tanggal_lahir || !no_hp) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "Field yang wajib diisi belum lengkap",
      });
    }

    // Check if NIK already exists
    const [existingUser] = await connection.query(
      "SELECT id FROM user_profiles WHERE nik = ?",
      [nik]
    );

    if (existingUser.length > 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "NIK sudah terdaftar",
      });
    }

    // Create user account
    const username = `user_${nik.substring(0, 8)}`;
    const defaultPassword = "$2a$10$defaultHashedPassword"; // In production, hash a default password

    const [userResult] = await connection.query(
      "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)",
      [username, defaultPassword, "pengguna"]
    );

    const userId = userResult.insertId;

    // Create user profile
    await connection.query(
      `INSERT INTO user_profiles 
       (user_id, nik, nama_lengkap, jenis_kelamin, tempat_lahir, tanggal_lahir, no_hp, alamat, kecamatan, no_kk) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        nik,
        nama_lengkap,
        jenis_kelamin,
        tempat_lahir || null,
        tanggal_lahir,
        no_hp,
        alamat || null,
        kecamatan || null,
        no_kk || null,
      ]
    );

    // Create pasangan_kb record (placeholder data)
    await connection.query(
      `INSERT INTO pasangan_kb 
       (user_id, nama_pasangan, tahapan_kb, status_pernikahan) 
       VALUES (?, ?, ?, ?)`,
      [userId, "-", "pra_kb", "menikah"]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Pasien berhasil ditambahkan",
      data: {
        userId,
        username,
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error("Create patient error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menambahkan pasien",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

module.exports = router;
