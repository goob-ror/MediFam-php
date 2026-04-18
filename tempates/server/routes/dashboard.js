const express = require("express");
const router = express.Router();
const pool = require("../config/database");
const authMiddleware = require("../middleware/auth");

// Get user dashboard data
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user profile with pasangan_kb data
    const [users] = await pool.execute(
      `SELECT 
        u.id, u.username, u.role, u.created_at,
        up.nama_lengkap, up.no_hp, up.jenis_kelamin, up.profile_image,
        pk.id as pasangan_kb_id, pk.nama_pasangan, pk.jumlah_anak_laki, pk.jumlah_anak_perempuan
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      LEFT JOIN pasangan_kb pk ON u.id = pk.user_id
      WHERE u.id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    const user = users[0];

    // Get upcoming routine (next pelayanan_kb)
    let upcomingRoutine = null;
    if (user.pasangan_kb_id) {
      const [routines] = await pool.execute(
        `SELECT 
          tanggal_jadwal_kembali as date,
          'Puskesmas Palaran' as location
        FROM pelayanan_kb
        WHERE pasangan_kb_id = ? 
          AND tanggal_jadwal_kembali >= CURDATE()
        ORDER BY tanggal_jadwal_kembali ASC
        LIMIT 1`,
        [user.pasangan_kb_id]
      );

      if (routines.length > 0) {
        const routine = routines[0];
        const date = new Date(routine.date);
        const days = [
          "Minggu",
          "Senin",
          "Selasa",
          "Rabu",
          "Kamis",
          "Jumat",
          "Sabtu",
        ];
        const months = [
          "Januari",
          "Februari",
          "Maret",
          "April",
          "Mei",
          "Juni",
          "Juli",
          "Agustus",
          "September",
          "Oktober",
          "November",
          "Desember",
        ];

        upcomingRoutine = {
          date: `${days[date.getDay()]}, ${date.getDate()} ${
            months[date.getMonth()]
          } ${date.getFullYear()}`,
          time: "To Be Announced Feature",
          location: routine.location,
        };
      }
    }

    // Format user data
    const userData = {
      id: user.id,
      name: user.nama_lengkap || user.username,
      username: user.username,
      avatar: user.profile_image || `/public/image/userAvatar-Male.png`,
      joinDate: new Date(user.created_at).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      role: user.role,
      phone: user.no_hp,
      gender: user.jenis_kelamin,
      hasPasanganKB: !!user.pasangan_kb_id,
    };

    res.json({
      success: true,
      data: {
        user: userData,
        upcomingRoutine,
      },
    });
  } catch (error) {
    console.error("Get dashboard data error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan",
    });
  }
});

// Get safari schedules
router.get("/safari-schedules", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Resolve the user's pasangan_kb_id once
    const [userRows] = await pool.execute(
      "SELECT pk.id as pasangan_kb_id FROM users u LEFT JOIN pasangan_kb pk ON u.id = pk.user_id WHERE u.id = ?",
      [userId]
    );
    const pasanganKbId = userRows[0]?.pasangan_kb_id ?? null;

    const [schedules] = await pool.execute(
      `SELECT 
        ks.id,
        ks.judul_kegiatan  AS title,
        ks.tanggal_kegiatan AS date,
        ks.waktu_mulai      AS start_time,
        ks.lokasi           AS location,
        ks.status,
        ks.target_peserta,
        ks.peserta_hadir,
        CASE WHEN ps.id IS NOT NULL THEN 1 ELSE 0 END AS is_registered
      FROM kegiatan_safari ks
      LEFT JOIN peserta_safari ps
        ON ps.kegiatan_id = ks.id
        AND ps.pasangan_kb_id = ?
      WHERE ks.status IN ('terjadwal', 'selesai')
      ORDER BY ks.tanggal_kegiatan DESC
      LIMIT 10`,
      [pasanganKbId]
    );

    const formattedSchedules = schedules.map((schedule) => {
      const date = new Date(schedule.date);
      const isAvailable = schedule.status === "terjadwal" && date >= new Date();

      return {
        id: schedule.id,
        title: schedule.title,
        date: date.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        time: schedule.start_time
          ? schedule.start_time.substring(0, 5) + " WITA"
          : "10:30 WITA",
        location: schedule.location,
        status: isAvailable ? "available" : "ended",
        isRegistered: schedule.is_registered === 1,
        targetPeserta: schedule.target_peserta,
        pesertaHadir: schedule.peserta_hadir,
      };
    });

    res.json({
      success: true,
      data: formattedSchedules,
    });
  } catch (error) {
    console.error("Get safari schedules error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan",
    });
  }
});

// Register for safari
router.post("/safari-register/:scheduleId", authMiddleware, async (req, res) => {
  const connection = await pool.getConnection();
  const { scheduleId } = req.params;

  try {
    const userId = req.user.userId;

    if (!scheduleId) {
      return res.status(400).json({
        success: false,
        message: "Schedule ID diperlukan",
      });
    }

    // Get user's pasangan_kb_id
    const [users] = await connection.execute(
      "SELECT pk.id as pasangan_kb_id FROM users u LEFT JOIN pasangan_kb pk ON u.id = pk.user_id WHERE u.id = ?",
      [userId]
    );

    if (users.length === 0 || !users[0].pasangan_kb_id) {
      return res.status(400).json({
        success: false,
        message: "Anda belum memiliki data pasangan KB",
      });
    }

    const pasanganKbId = users[0].pasangan_kb_id;

    // Check if already registered
    const [existing] = await connection.execute(
      "SELECT id FROM peserta_safari WHERE kegiatan_id = ? AND pasangan_kb_id = ?",
      [scheduleId, pasanganKbId]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Anda sudah terdaftar untuk kegiatan ini",
      });
    }

    // Register for safari
    await connection.execute(
      "INSERT INTO peserta_safari (kegiatan_id, pasangan_kb_id, hadir, tanggal_konfirmasi) VALUES (?, ?, 0, NOW())",
      [scheduleId, pasanganKbId]
    );

    res.json({
      success: true,
      message: "Berhasil mendaftar untuk kegiatan SAFARI",
    });
  } catch (error) {
    console.error("Register safari error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mendaftar",
    });
  } finally {
    connection.release();
  }
});

// Cancel safari registration
router.delete("/safari-cancel/:scheduleId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { scheduleId } = req.params;

    // Get user's pasangan_kb_id
    const [users] = await pool.execute(
      "SELECT pk.id as pasangan_kb_id FROM users u LEFT JOIN pasangan_kb pk ON u.id = pk.user_id WHERE u.id = ?",
      [userId]
    );

    if (users.length === 0 || !users[0].pasangan_kb_id) {
      return res.status(400).json({
        success: false,
        message: "Data pasangan KB tidak ditemukan",
      });
    }

    const pasanganKbId = users[0].pasangan_kb_id;

    // Check registration exists and hasn't been marked as attended
    const [existing] = await pool.execute(
      "SELECT id, hadir FROM peserta_safari WHERE kegiatan_id = ? AND pasangan_kb_id = ?",
      [scheduleId, pasanganKbId]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Pendaftaran tidak ditemukan",
      });
    }

    if (existing[0].hadir) {
      return res.status(400).json({
        success: false,
        message: "Tidak dapat membatalkan pendaftaran yang sudah hadir",
      });
    }

    await pool.execute(
      "DELETE FROM peserta_safari WHERE kegiatan_id = ? AND pasangan_kb_id = ?",
      [scheduleId, pasanganKbId]
    );

    res.json({
      success: true,
      message: "Pendaftaran berhasil dibatalkan",
    });
  } catch (error) {
    console.error("Cancel safari error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat membatalkan pendaftaran",
    });
  }
});

// ============================================
// BIDAN DASHBOARD ROUTES
// ============================================

// Get bidan dashboard data
router.get("/bidan", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Check if user is bidan
    const [users] = await pool.execute(
      `SELECT 
        u.id, u.username, u.role, u.created_at,
        up.nama_lengkap, up.no_hp, up.jenis_kelamin, up.profile_image
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE u.id = ? AND u.role = 'bidan'`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak. Hanya untuk bidan.",
      });
    }

    const user = users[0];

    // Format user data
    const userData = {
      id: user.id,
      nama: user.nama_lengkap || user.username,
      username: user.username,
      gender: user.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan",
      created_at: user.created_at,
      role: user.role,
    };

    res.json({
      success: true,
      data: {
        user: userData,
      },
    });
  } catch (error) {
    console.error("Get bidan dashboard data error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan",
    });
  }
});

// Get bidan stats
router.get("/bidan/stats", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Verify bidan role
    const [users] = await pool.execute(
      "SELECT role FROM users WHERE id = ? AND role = 'bidan'",
      [userId]
    );

    if (users.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak",
      });
    }

    // Get today's sessions count
    const [todaySessions] = await pool.execute(
      `SELECT COUNT(*) as count 
       FROM kegiatan_safari 
       WHERE DATE(tanggal_kegiatan) = CURDATE() 
       AND status = 'terjadwal'`
    );

    // Get upcoming sessions count
    const [upcomingSessions] = await pool.execute(
      `SELECT COUNT(*) as count 
       FROM kegiatan_safari 
       WHERE tanggal_kegiatan > CURDATE() 
       AND status = 'terjadwal'`
    );

    // Get registered patients count
    const [registeredPatients] = await pool.execute(
      `SELECT COUNT(DISTINCT pasangan_kb_id) as count 
       FROM peserta_safari
       WHERE YEAR(created_at) = YEAR(CURDATE())`
    );

    res.json({
      success: true,
      data: {
        sesiHariIni: todaySessions[0].count,
        sesiMendatang: upcomingSessions[0].count,
        pasienMendaftar: registeredPatients[0].count,
        waktuSesi: "08:00 - 16:00 WITA",
      },
    });
  } catch (error) {
    console.error("Get bidan stats error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan",
    });
  }
});

// Get today's sessions for bidan
router.get("/bidan/sessions/today", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Verify bidan role
    const [users] = await pool.execute(
      "SELECT role FROM users WHERE id = ? AND role = 'bidan'",
      [userId]
    );

    if (users.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak",
      });
    }

    // Get today's sessions
    const [sessions] = await pool.execute(
      `SELECT 
        ks.id,
        ks.judul_kegiatan,
        ks.tanggal_kegiatan as tanggal,
        ks.waktu_mulai as waktu,
        ks.lokasi,
        COUNT(ps.id) as jumlah_pasien
      FROM kegiatan_safari ks
      LEFT JOIN peserta_safari ps ON ks.id = ps.kegiatan_id
      WHERE DATE(ks.tanggal_kegiatan) = CURDATE()
      AND ks.status = 'terjadwal'
      GROUP BY ks.id
      ORDER BY ks.waktu_mulai ASC`
    );

    const formattedSessions = sessions.map((session) => ({
      id: session.id,
      judul: session.judul_kegiatan,
      tanggal: session.tanggal,
      waktu: session.waktu
        ? session.waktu.substring(0, 5) + " WITA"
        : "10:30 WITA",
      lokasi: session.lokasi,
      jumlah_pasien: session.jumlah_pasien,
    }));

    res.json({
      success: true,
      data: formattedSessions,
    });
  } catch (error) {
    console.error("Get today sessions error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan",
    });
  }
});

// Get patients for bidan
router.get("/bidan/patients", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status, limit } = req.query;

    // Verify bidan role
    const [users] = await pool.execute(
      "SELECT role FROM users WHERE id = ? AND role = 'bidan'",
      [userId]
    );

    if (users.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak",
      });
    }

    // Get patients (from user_profiles via pasangan_kb)
    let query = `
      SELECT 
        pk.id,
        COALESCE(up.nama_lengkap, u.username) as nama,
        'SELESAI' as status,
        u.username
      FROM pasangan_kb pk
      JOIN users u ON pk.user_id = u.id
      LEFT JOIN user_profiles up ON u.id = up.user_id
      ORDER BY pk.id DESC
    `;

    if (limit) {
      query += ` LIMIT ${parseInt(limit)}`;
    }

    const [patients] = await pool.execute(query);

    res.json({
      success: true,
      data: patients,
    });
  } catch (error) {
    console.error("Get patients error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan",
    });
  }
});

// Get upcoming sessions for bidan
router.get("/bidan/sessions/upcoming", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Verify bidan role
    const [users] = await pool.execute(
      "SELECT role FROM users WHERE id = ? AND role = 'bidan'",
      [userId]
    );

    if (users.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak",
      });
    }

    // Get upcoming sessions
    const [sessions] = await pool.execute(
      `SELECT 
        id,
        judul_kegiatan as topik,
        tanggal_kegiatan as tanggal,
        waktu_mulai as waktu,
        lokasi
      FROM kegiatan_safari
      WHERE tanggal_kegiatan > CURDATE()
      AND status = 'terjadwal'
      ORDER BY tanggal_kegiatan ASC
      LIMIT 5`
    );

    const formattedSessions = sessions.map((session) => ({
      id: session.id,
      topik: session.topik,
      tanggal: session.tanggal,
      waktu: session.waktu
        ? session.waktu.substring(0, 5) + " WITA"
        : "10:00 WITA",
      lokasi: session.lokasi,
    }));

    res.json({
      success: true,
      data: formattedSessions,
    });
  } catch (error) {
    console.error("Get upcoming sessions error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan",
    });
  }
});

// Get total rujukan kembali count (all time, between min and max tanggal_jadwal_kembali)
router.get("/bidan/rujukan-kembali", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const [users] = await pool.execute(
      "SELECT role FROM users WHERE id = ? AND role = 'bidan'",
      [userId]
    );
    if (users.length === 0) {
      return res.status(403).json({ success: false, message: "Akses ditolak" });
    }

    const [rows] = await pool.execute(
      `SELECT
        COUNT(*) AS total,
        MIN(tanggal_jadwal_kembali) AS earliest,
        MAX(tanggal_jadwal_kembali) AS latest
       FROM pelayanan_kb
       WHERE tanggal_jadwal_kembali IS NOT NULL`
    );

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Get rujukan kembali error:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan" });
  }
});

// Get pengingat pasien berkala (patients with tanggal_jadwal_kembali, sorted earliest first)
router.get("/bidan/pengingat-pasien", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const [users] = await pool.execute(
      "SELECT role FROM users WHERE id = ? AND role = 'bidan'",
      [userId]
    );
    if (users.length === 0) {
      return res.status(403).json({ success: false, message: "Akses ditolak" });
    }

    const [rows] = await pool.execute(
      `SELECT
        pk.id,
        COALESCE(up.nama_lengkap, u.username) AS nama,
        pl.tanggal_jadwal_kembali,
        pl.kontrasepsi_yang_dipilih
       FROM pelayanan_kb pl
       INNER JOIN pasangan_kb pk ON pl.pasangan_kb_id = pk.id
       INNER JOIN users u ON pk.user_id = u.id
       LEFT JOIN user_profiles up ON u.id = up.user_id
       WHERE pl.tanggal_jadwal_kembali IS NOT NULL
       ORDER BY pl.tanggal_jadwal_kembali ASC`
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const data = rows.map((row) => {
      const jadwal = new Date(row.tanggal_jadwal_kembali);
      jadwal.setHours(0, 0, 0, 0);
      const diffMs = jadwal - today;
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      let waktu;
      if (diffDays < -7) {
        waktu = "Selesai";
      } else if (diffDays < 0) {
        waktu = "Terlewat";
      } else if (diffDays === 0) {
        waktu = "Selesai";
      } else {
        waktu = `${diffDays} Hari`;
      }

      return {
        id: row.id,
        nama: row.nama,
        tanggal_jadwal_kembali: row.tanggal_jadwal_kembali,
        waktu,
      };
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error("Get pengingat pasien error:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan" });
  }
});

module.exports = router;
