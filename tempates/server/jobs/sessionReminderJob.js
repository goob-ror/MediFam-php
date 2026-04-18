const cron = require("node-cron");
const db = require("../config/database");
const { sendMessage } = require("../services/fonnteService");
const logger = require("../utils/logger");

/**
 * Build the reminder message using session and user data.
 * Variables: {nama}, {judul_kegiatan}, {tanggal}, {waktu_mulai}, {lokasi}, {kecamatan}
 */
function buildReminderMessage({ nama, judul_kegiatan, tanggal, waktu_mulai, lokasi, kecamatan }) {
  const tanggalFormatted = new Date(tanggal).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const waktu = waktu_mulai ? waktu_mulai.slice(0, 5) : "lihat jadwal";

  return (
    `Halo *${nama}*! 👋\n\n` +
    `Ini adalah pengingat otomatis dari *MediFam*.\n\n` +
    `Anda terdaftar sebagai peserta kegiatan:\n` +
    `📋 *${judul_kegiatan}*\n` +
    `📅 ${tanggalFormatted}\n` +
    `⏰ Pukul ${waktu} WITA\n` +
    `📍 ${lokasi}${kecamatan ? `, ${kecamatan}` : ""}\n\n` +
    `Kegiatan ini akan berlangsung *besok*. Harap hadir tepat waktu.\n\n` +
    `Terima kasih, salam sehat! 💚`
  );
}

/**
 * Fetch all participants registered for sessions happening tomorrow
 * who have receive_autoreminder = 1, have a phone number,
 * and have NOT yet received a reminder (received_reminder = 0).
 */
async function getParticipantsForTomorrow() {
  const query = `
    SELECT
      ps.id             AS peserta_id,
      up.nama_lengkap   AS nama,
      up.no_hp          AS no_hp,
      ks.judul_kegiatan,
      ks.tanggal_kegiatan AS tanggal,
      ks.waktu_mulai,
      ks.lokasi,
      ks.kecamatan
    FROM peserta_safari ps
    JOIN kegiatan_safari ks  ON ks.id = ps.kegiatan_id
    JOIN pasangan_kb pkb     ON pkb.id = ps.pasangan_kb_id
    JOIN users u             ON u.id = pkb.user_id
    JOIN user_profiles up    ON up.user_id = u.id
    WHERE
      ks.tanggal_kegiatan = DATE_ADD(CURDATE(), INTERVAL 1 DAY)
      AND ks.status IN ('terjadwal', 'draft')
      AND ps.received_reminder = 0
      AND up.receive_autoreminder = 1
      AND up.no_hp IS NOT NULL
      AND up.no_hp != ''
  `;

  const [rows] = await db.query(query);
  return rows;
}

/**
 * Mark a peserta_safari row as having received the reminder.
 */
async function markReminderSent(pesertaId) {
  await db.query(
    `UPDATE peserta_safari SET received_reminder = 1 WHERE id = ?`,
    [pesertaId]
  );
}

class SessionReminderJob {
  constructor() {
    this.job = null;
    this.isRunning = false;
  }

  start() {
    // Run every day at 08:00 AM
    this.job = cron.schedule("0 8 * * *", async () => {
      await this._run();
    });

    logger.info("Session reminder cron job scheduled (runs daily at 08:00)");
  }

  stop() {
    if (this.job) {
      this.job.stop();
      logger.info("Session reminder cron job stopped");
    }
  }

  async runNow() {
    return this._run();
  }

  async _run() {
    if (this.isRunning) {
      logger.warn("Session reminder job already running, skipping");
      return { success: false, message: "Already running" };
    }

    this.isRunning = true;
    logger.info("=== Session Reminder Job Started ===");

    let sent = 0;
    let failed = 0;

    try {
      const participants = await getParticipantsForTomorrow();
      logger.info(`Found ${participants.length} participant(s) to remind`);

      for (const p of participants) {
        const message = buildReminderMessage(p);
        try {
          const result = await sendMessage(p.no_hp, message);
          await markReminderSent(p.peserta_id);
          logger.info(`Reminder sent to ${p.no_hp} (${p.nama})`, { result });
          sent++;
        } catch (err) {
          logger.error(`Failed to send reminder to ${p.no_hp} (${p.nama})`, {
            error: err.message,
          });
          failed++;
        }
      }

      logger.info(`=== Session Reminder Job Completed: ${sent} sent, ${failed} failed ===`);
      return { success: true, sent, failed, total: participants.length };
    } catch (err) {
      logger.error("Session reminder job encountered an error", { error: err.message });
      throw err;
    } finally {
      this.isRunning = false;
    }
  }

  getStatus() {
    return {
      isScheduled: this.job !== null,
      isRunning: this.isRunning,
      schedule: "0 8 * * * (Every day at 08:00)",
    };
  }
}

module.exports = new SessionReminderJob();
