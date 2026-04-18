const cron = require("node-cron");
const sessionService = require("../services/sessionService");
const logger = require("../utils/logger");

/**
 * Cron job to automatically update session statuses
 * Runs every hour at minute 0
 * 
 * Schedule: '0 * * * *'
 * - 0: At minute 0
 * - *: Every hour
 * - *: Every day of month
 * - *: Every month
 * - *: Every day of week
 */
class SessionStatusUpdater {
  constructor() {
    this.job = null;
    this.isRunning = false;
  }

  /**
   * Start the cron job
   */
  start() {
    // Run every 15 minutes
    this.job = cron.schedule("*/15 * * * *", async () => {
      if (this.isRunning) {
        logger.warn("Session status update job is already running, skipping this execution");
        return;
      }

      this.isRunning = true;

      try {
        logger.info("=== Session Status Update Job Started ===");
        await sessionService.updateSessionStatuses();
        logger.info("=== Session Status Update Job Completed ===");
      } catch (error) {
        logger.error("Session status update job failed", { error: error.message });
      } finally {
        this.isRunning = false;
      }
    });

    logger.info("Session status updater cron job scheduled (runs every 15 mins");
  }

  /**
   * Stop the cron job
   */
  stop() {
    if (this.job) {
      this.job.stop();
      logger.info("Session status updater cron job stopped");
    }
  }

  /**
   * Run the job manually (for testing)
   */
  async runNow() {
    if (this.isRunning) {
      logger.warn("Job is already running");
      return { success: false, message: "Job is already running" };
    }

    this.isRunning = true;

    try {
      logger.info("=== Manual Session Status Update Started ===");
      const result = await sessionService.updateSessionStatuses();
      logger.info("=== Manual Session Status Update Completed ===");
      return result;
    } catch (error) {
      logger.error("Manual session status update failed", { error: error.message });
      throw error;
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Get job status
   */
  getStatus() {
    return {
      isScheduled: this.job !== null,
      isRunning: this.isRunning,
      schedule: "*/15 * * * * (Every 15 minutes)",
    };
  }
}

module.exports = new SessionStatusUpdater();
