const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");
const authMiddleware = require("../middleware/auth");
const { validateFields } = require("../middleware/inputSecurity");

// Register
router.post("/register", validateFields, async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { username, phone, password } = req.body;

    // Validate input
    if (!username || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Semua field harus diisi",
      });
    }

    // Check if username already exists
    const [existingUsers] = await connection.execute(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Username sudah terdaftar",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Start transaction
    await connection.beginTransaction();

    // Insert user
    const [userResult] = await connection.execute(
      "INSERT INTO users (username, password_hash, role, is_active) VALUES (?, ?, 'pengguna', 1)",
      [username, hashedPassword]
    );

    const userId = userResult.insertId;

    // Insert user profile with phone
    await connection.execute(
      "INSERT INTO user_profiles (user_id, nama_lengkap, no_hp) VALUES (?, ?, ?)",
      [userId, username, phone]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
      data: {
        userId,
        username,
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat registrasi",
    });
  } finally {
    connection.release();
  }
});

// Login
router.post("/login", validateFields, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username dan password harus diisi",
      });
    }

    // Get user with created_at
    const [users] = await pool.execute(
      "SELECT u.id, u.username, u.password_hash, u.role, u.is_active, u.created_at, up.nama_lengkap, up.no_hp, up.profile_image FROM users u LEFT JOIN user_profiles up ON u.id = up.user_id WHERE u.username = ? AND u.is_active = 1",
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Username atau password salah",
      });
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Username atau password salah",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login berhasil",
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          nama_lengkap: user.nama_lengkap,
          no_hp: user.no_hp,
          avatar: user.profile_image || "/public/image/userAvatar-Male.png",
          created_at: user.created_at,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat login",
    });
  }
});

// Check auth (protected route)
router.get("/check", authMiddleware, async (req, res) => {
  try {
    const [users] = await pool.execute(
      "SELECT u.id, u.username, u.role, u.created_at, up.nama_lengkap, up.no_hp FROM users u LEFT JOIN user_profiles up ON u.id = up.user_id WHERE u.id = ?",
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: {
        user: users[0],
      },
    });
  } catch (error) {
    console.error("Auth check error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan",
    });
  }
});

module.exports = router;
