require("dotenv").config();
const pool = require("./config/database");

async function testConnection() {
  try {
    console.log("Testing database connection...");
    const [rows] = await pool.execute("SELECT 1 + 1 AS result");
    console.log("✓ Database connection successful!");
    console.log("Test query result:", rows[0].result);

    // Test users table
    const [users] = await pool.execute("SELECT COUNT(*) as count FROM users");
    console.log(`✓ Users table accessible. Total users: ${users[0].count}`);

    process.exit(0);
  } catch (error) {
    console.error("✗ Database connection failed:");
    console.error(error.message);
    process.exit(1);
  }
}

testConnection();
