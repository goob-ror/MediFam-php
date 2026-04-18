const pool = require("../config/database");
const logger = require("../utils/logger");

class SessionService {
  /**
   * Update session statuses based on current date and time
   */
  async updateSessionStatuses() {
    const connection = await pool.getConnection();

    try {
      logger.info("Starting session status update job");

      let totalUpdated = 0;

      // 1. Update Draft → Terjadwal (sessions with future dates)
      const terjadwalResult = await this.updateToTerjadwal(connection);
      totalUpdated += terjadwalResult;

      // 2. Update Terjadwal → Berlangsung (sessions happening now)
      const berlangsungResult = await this.updateToBerlangsung(connection);
      totalUpdated += berlangsungResult;

      // 3. Update Berlangsung → Selesai (sessions that have ended)
      const selesaiResult = await this.updateToSelesai(connection);
      totalUpdated += selesaiResult;

      logger.success(`Session status update completed. Total updated: ${totalUpdated}`);

      return {
        success: true,
        totalUpdated,
        details: {
          terjadwal: terjadwalResult,
          berlangsung: berlangsungResult,
          selesai: selesaiResult,
        },
      };
    } catch (error) {
      logger.error("Error updating session statuses", { error: error.message });
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Update Draft sessions to Terjadwal if date is in the future
   */
  async updateToTerjadwal(connection) {
    try {
      const [result] = await connection.execute(
        `UPDATE kegiatan_safari 
         SET status = 'terjadwal', updated_at = NOW()
         WHERE status = 'draft' 
         AND tanggal_kegiatan > CURDATE()`
      );

      if (result.affectedRows > 0) {
        logger.info(`Updated ${result.affectedRows} sessions to TERJADWAL`);
      }

      return result.affectedRows;
    } catch (error) {
      logger.error("Error updating to Terjadwal", { error: error.message });
      throw error;
    }
  }

  /**
   * Update Terjadwal sessions to Berlangsung if happening now
   */
  async updateToBerlangsung(connection) {
    try {
      // Sessions with waktu_mulai and waktu_selesai
      const [result1] = await connection.execute(
        `UPDATE kegiatan_safari 
         SET status = 'berlangsung', updated_at = NOW()
         WHERE status = 'terjadwal' 
         AND tanggal_kegiatan = CURDATE()
         AND waktu_mulai IS NOT NULL 
         AND waktu_selesai IS NOT NULL
         AND CURTIME() BETWEEN waktu_mulai AND waktu_selesai`
      );

      // Sessions with only waktu_mulai (no end time)
      const [result2] = await connection.execute(
        `UPDATE kegiatan_safari 
         SET status = 'berlangsung', updated_at = NOW()
         WHERE status = 'terjadwal' 
         AND tanggal_kegiatan = CURDATE()
         AND waktu_mulai IS NOT NULL 
         AND waktu_selesai IS NULL
         AND CURTIME() >= waktu_mulai`
      );

      // Sessions with no time specified (start at beginning of day)
      const [result3] = await connection.execute(
        `UPDATE kegiatan_safari 
         SET status = 'berlangsung', updated_at = NOW()
         WHERE status = 'terjadwal' 
         AND tanggal_kegiatan = CURDATE()
         AND waktu_mulai IS NULL`
      );

      const totalAffected = result1.affectedRows + result2.affectedRows + result3.affectedRows;

      if (totalAffected > 0) {
        logger.info(`Updated ${totalAffected} sessions to BERLANGSUNG`);
      }

      return totalAffected;
    } catch (error) {
      logger.error("Error updating to Berlangsung", { error: error.message });
      throw error;
    }
  }

  /**
   * Update Berlangsung sessions to Selesai if time has passed
   * Also update Terjadwal sessions that are in the past directly to Selesai
   */
  async updateToSelesai(connection) {
    try {
      // 1. Sessions in 'berlangsung' status with waktu_selesai that have ended
      const [result1] = await connection.execute(
        `UPDATE kegiatan_safari 
         SET status = 'selesai', updated_at = NOW()
         WHERE status = 'berlangsung' 
         AND waktu_selesai IS NOT NULL
         AND (
           tanggal_kegiatan < CURDATE() 
           OR (tanggal_kegiatan = CURDATE() AND CURTIME() > waktu_selesai)
         )`
      );

      // 2. Sessions in 'berlangsung' status without waktu_selesai - mark as finished the next day
      const [result2] = await connection.execute(
        `UPDATE kegiatan_safari 
         SET status = 'selesai', updated_at = NOW()
         WHERE status = 'berlangsung' 
         AND waktu_selesai IS NULL
         AND tanggal_kegiatan < CURDATE()`
      );

      // 3. Sessions in 'terjadwal' status that are in the past (missed transition)
      const [result3] = await connection.execute(
        `UPDATE kegiatan_safari 
         SET status = 'selesai', updated_at = NOW()
         WHERE status = 'terjadwal' 
         AND tanggal_kegiatan < CURDATE()`
      );

      const totalAffected = result1.affectedRows + result2.affectedRows + result3.affectedRows;

      if (totalAffected > 0) {
        logger.info(`Updated ${totalAffected} sessions to SELESAI (berlangsung: ${result1.affectedRows + result2.affectedRows}, terjadwal: ${result3.affectedRows})`);
      }

      return totalAffected;
    } catch (error) {
      logger.error("Error updating to Selesai", { error: error.message });
      throw error;
    }
  }

  /**
   * Get sessions that need status updates (for testing/preview)
   */
  async getSessionsNeedingUpdate() {
    try {
      const [sessions] = await pool.execute(
        `SELECT id, judul_kegiatan, tanggal_kegiatan, waktu_mulai, waktu_selesai, status
         FROM kegiatan_safari
         WHERE status NOT IN ('selesai', 'dibatalkan')
         ORDER BY tanggal_kegiatan ASC, waktu_mulai ASC`
      );

      return sessions;
    } catch (error) {
      logger.error("Error getting sessions needing update", { error: error.message });
      throw error;
    }
  }
}

module.exports = new SessionService();
