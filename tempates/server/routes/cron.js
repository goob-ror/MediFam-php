const express = require("express");
const router = express.Router();
const sessionStatusUpdater = require("../jobs/sessionStatusUpdater");
const sessionReminderJob = require("../jobs/sessionReminderJob");
const sessionService = require("../services/sessionService");
const authMiddleware = require("../middleware/auth");

// Get cron job status
router.get("/status", authMiddleware, async (req, res) => {
  try {
    // Only allow bidan to check status
    if (req.user.role !== "bidan") {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak. Hanya bidan yang dapat mengakses endpoint ini.",
      });
    }

    const status = sessionStatusUpdater.getStatus();

    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    console.error("Get cron status error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil status cron job",
    });
  }
});

// Manually trigger session status update
router.post("/trigger-update", authMiddleware, async (req, res) => {
  try {
    // Only allow bidan to trigger updates
    if (req.user.role !== "bidan") {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak. Hanya bidan yang dapat memicu update manual.",
      });
    }

    const result = await sessionStatusUpdater.runNow();

    res.json({
      success: true,
      message: "Update status sesi berhasil dijalankan",
      data: result,
    });
  } catch (error) {
    console.error("Manual trigger error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menjalankan update manual",
    });
  }
});

// Get reminder job status
router.get("/reminder-status", authMiddleware, async (req, res) => {
  if (req.user.role !== "bidan") {
    return res.status(403).json({ success: false, message: "Akses ditolak." });
  }
  res.json({ success: true, data: sessionReminderJob.getStatus() });
});

// Manually trigger reminder job (for testing)
router.post("/trigger-reminder", authMiddleware, async (req, res) => {
  if (req.user.role !== "bidan") {
    return res.status(403).json({ success: false, message: "Akses ditolak." });
  }
  try {
    const result = await sessionReminderJob.runNow();
    res.json({ success: true, message: "Reminder job berhasil dijalankan", data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal menjalankan reminder job", error: error.message });
  }
});

// Preview sessions that need updates (for testing)
router.get("/preview-updates", authMiddleware, async (req, res) => {
  try {
    // Only allow bidan to preview
    if (req.user.role !== "bidan") {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak. Hanya bidan yang dapat melihat preview.",
      });
    }

    const sessions = await sessionService.getSessionsNeedingUpdate();

    res.json({
      success: true,
      data: {
        sessions,
        count: sessions.length,
      },
    });
  } catch (error) {
    console.error("Preview updates error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil preview",
    });
  }
});

module.exports = router;
