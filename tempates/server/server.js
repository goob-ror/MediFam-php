require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const profileRoutes = require("./routes/profile");
const safariRoutes = require("./routes/safari");
const patientsRoutes = require("./routes/patients");
const sessionsRoutes = require("./routes/sessions");
const userRoutes = require("./routes/user");
const cronRoutes = require("./routes/cron");
const forgotPasswordRoutes = require("./routes/forgotPassword");
const sessionStatusUpdater = require("./jobs/sessionStatusUpdater");
const sessionReminderJob = require("./jobs/sessionReminderJob");
const logger = require("./utils/logger");
const { escapeOutput } = require("./middleware/outputEscape");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(escapeOutput);

// Serve built frontend from dist/ (only when a production build exists)
const distIndex = path.join(__dirname, "../dist/index.html");
const distExists = require("fs").existsSync(distIndex);

if (distExists) {
  app.use(express.static(path.join(__dirname, "../dist")));
  app.use("/public", express.static(path.join(__dirname, "../src/public")));
} else {
  console.warn("⚠  dist/ not found — run 'npm run build' to enable frontend serving via ngrok");
}

// Routes
app.use("/api/auth/forgot-password", forgotPasswordRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/safari", safariRoutes);
app.use("/api/patients", patientsRoutes);
app.use("/api/sessions", sessionsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cron", cronRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "MediFam API is running",
  });
});

// SPA fallback — serve index.html for all non-API routes (only when build exists)
if (distExists) {
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(distIndex);
  });
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`MediFam API server running on http://localhost:${PORT}`);
  
  // Start cron jobs
  logger.info("Initializing cron jobs...");
  sessionStatusUpdater.start();
  sessionReminderJob.start();
  logger.info("All cron jobs initialized successfully");

  // Start ngrok tunnel
  const { spawn, execSync } = require("child_process");
  const fs = require("fs");
  const ngrok = spawn("ngrok", ["http", String(PORT), "--log=stdout"], {
    stdio: ["ignore", "pipe", "pipe"],
    shell: true,
  });

  const handleTunnelUrl = (publicUrl) => {
    const webhookUrl = `${publicUrl}/api/webhook/fonnte`;
    console.log("\n========================================");
    console.log(`  🌐 Public URL  : ${publicUrl}`);
    console.log(`  🔗 API Base    : ${publicUrl}/api`);
    console.log(`  📱 Fonnte hook : ${webhookUrl}`);
    console.log("========================================\n");
    // Write to file so scripts can read it
    fs.writeFileSync(".ngrok-url", publicUrl, "utf8");
  };

  ngrok.stdout.on("data", (data) => {
    const match = data.toString().match(/url=(https:\/\/[^\s]+)/i);
    if (match) handleTunnelUrl(match[1]);
  });

  // Fallback: poll ngrok local API after 3s
  setTimeout(() => {
    try {
      const result = execSync("curl -s http://127.0.0.1:4040/api/tunnels", { timeout: 3000 }).toString();
      const data = JSON.parse(result);
      const tunnel = data.tunnels?.find((t) => t.proto === "https");
      if (tunnel) handleTunnelUrl(tunnel.public_url);
    } catch {
      // ngrok may not be installed or authtoken not set — skip silently
    }
  }, 3000);

  ngrok.on("close", (code) => {
    if (code !== 0) logger.warn(`ngrok exited with code ${code} — tunnel unavailable`);
  });
});

