const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const pool = require("../config/database");
const authMiddleware = require("../middleware/auth");
const { validateFields } = require("../middleware/inputSecurity");

// Update receive_autoreminder setting
router.put("/notification", authMiddleware, async (req, res) => {
  try {
    const { receive_autoreminder } = req.body;
    const userId = req.user.userId;

    if (typeof receive_autoreminder !== "boolean" && receive_autoreminder !== 0 && receive_autoreminder !== 1) {
      return res.status(400).json({ success: false, message: "Nilai tidak valid" });
    }

    await pool.execute(
      "UPDATE user_profiles SET receive_autoreminder = ?, updated_at = NOW() WHERE user_id = ?",
      [receive_autoreminder ? 1 : 0, userId]
    );

    res.json({ success: true, message: "Pengaturan notifikasi berhasil diperbarui" });
  } catch (error) {
    console.error("Update notification setting error:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan" });
  }
});

// Update user account (username and/or password)
router.put("/update", authMiddleware, validateFields, async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { username, password } = req.body;
    const userId = req.user.userId;

    // Validate input
    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username harus diisi",
      });
    }

    // Check if new username already exists (if username is being changed)
    const [currentUser] = await connection.execute(
      "SELECT username FROM users WHERE id = ?",
      [userId]
    );

    if (currentUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    // If username is being changed, check if it's already taken
    if (username !== currentUser[0].username) {
      const [existingUsers] = await connection.execute(
        "SELECT id FROM users WHERE username = ? AND id != ?",
        [username, userId]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Username sudah digunakan",
        });
      }
    }

    // Start transaction
    await connection.beginTransaction();

    // Update username
    await connection.execute("UPDATE users SET username = ? WHERE id = ?", [
      username,
      userId,
    ]);

    // Update password if provided
    if (password) {
      // Validate password length
      if (password.length < 6) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: "Password minimal 6 karakter",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await connection.execute(
        "UPDATE users SET password_hash = ? WHERE id = ?",
        [hashedPassword, userId]
      );
    }

    // Update nama_lengkap in user_profiles to match username
    await connection.execute(
      "UPDATE user_profiles SET nama_lengkap = ? WHERE user_id = ?",
      [username, userId]
    );

    await connection.commit();

    res.json({
      success: true,
      message: "Data berhasil diperbarui",
      data: {
        username,
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error("Update user error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memperbarui data",
    });
  } finally {
    connection.release();
  }
});

module.exports = router;
