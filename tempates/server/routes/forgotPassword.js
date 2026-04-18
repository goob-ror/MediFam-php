const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const pool = require("../config/database");
const { sendMessage } = require("../services/fonnteService");

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Returns both 628xx and 08xx variants so DB queries match either format
function phoneVariants(phone) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("62")) return [digits, "0" + digits.slice(2)];
  if (digits.startsWith("08")) return ["62" + digits.slice(1), digits];
  if (digits.startsWith("8"))  return ["62" + digits, "0" + digits];
  return [digits, digits];
}

// POST /api/auth/forgot-password/request
router.post("/request", async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ success: false, message: "Nomor HP harus diisi" });

  try {
    const [fmt62, fmt08] = phoneVariants(phone);

    const [rows] = await pool.execute(
      `SELECT up.no_hp FROM user_profiles up
       WHERE REPLACE(up.no_hp, ' ', '') IN (?, ?)
       AND EXISTS (SELECT 1 FROM users u WHERE u.id = up.user_id AND u.is_active = 1)`,
      [fmt62, fmt08]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Nomor WhatsApp tidak terdaftar" });
    }

    // Invalidate old OTPs for both formats
    await pool.execute(
      "UPDATE password_reset_otp SET used = 1 WHERE no_hp IN (?, ?) AND used = 0",
      [fmt62, fmt08]
    );

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

    // Store using the 628xx format (needed by Fonnte to send)
    await pool.execute(
      "INSERT INTO password_reset_otp (no_hp, otp_code, expires_at) VALUES (?, ?, ?)",
      [fmt62, otp, expiresAt]
    );

    const message =
      `*MediFam - Reset Password*\n\n` +
      `Kode OTP Anda: *${otp}*\n\n` +
      `Kode ini berlaku selama *3 menit*.\n` +
      `Jangan bagikan kode ini kepada siapapun.`;

    await sendMessage(fmt62, message);

    res.json({ success: true, message: "OTP berhasil dikirim ke WhatsApp Anda" });
  } catch (err) {
    console.error("forgot-password/request error:", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
});

// POST /api/auth/forgot-password/verify
router.post("/verify", async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ success: false, message: "Data tidak lengkap" });

  try {
    const [fmt62, fmt08] = phoneVariants(phone);

    const [rows] = await pool.execute(
      `SELECT id FROM password_reset_otp
       WHERE no_hp IN (?, ?) AND otp_code = ? AND used = 0 AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [fmt62, fmt08, otp]
    );

    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: "OTP tidak valid atau sudah kadaluarsa" });
    }

    res.json({ success: true, message: "OTP valid" });
  } catch (err) {
    console.error("forgot-password/verify error:", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
});

// POST /api/auth/forgot-password/reset
router.post("/reset", async (req, res) => {
  const { phone, otp, newPassword } = req.body;
  if (!phone || !otp || !newPassword) {
    return res.status(400).json({ success: false, message: "Data tidak lengkap" });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: "Password minimal 6 karakter" });
  }

  const connection = await pool.getConnection();
  try {
    const [fmt62, fmt08] = phoneVariants(phone);

    // Re-verify OTP
    const [otpRows] = await connection.execute(
      `SELECT id FROM password_reset_otp
       WHERE no_hp IN (?, ?) AND otp_code = ? AND used = 0 AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [fmt62, fmt08, otp]
    );

    if (otpRows.length === 0) {
      return res.status(400).json({ success: false, message: "OTP tidak valid atau sudah kadaluarsa" });
    }

    // Get user by phone (match either format)
    const [userRows] = await connection.execute(
      `SELECT u.id FROM users u JOIN user_profiles up ON u.id = up.user_id
       WHERE REPLACE(up.no_hp, ' ', '') IN (?, ?) AND u.is_active = 1 LIMIT 1`,
      [fmt62, fmt08]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    await connection.beginTransaction();

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await connection.execute("UPDATE users SET password_hash = ? WHERE id = ?", [
      hashedPassword, userRows[0].id,
    ]);

    // Mark OTP as used
    await connection.execute(
      "UPDATE password_reset_otp SET used = 1 WHERE no_hp IN (?, ?) AND otp_code = ?",
      [fmt62, fmt08, otp]
    );

    await connection.commit();
    res.json({ success: true, message: "Password berhasil direset" });
  } catch (err) {
    await connection.rollback();
    console.error("forgot-password/reset error:", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  } finally {
    connection.release();
  }
});

module.exports = router;
