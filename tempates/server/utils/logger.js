const fs = require("fs");
const path = require("path");

class Logger {
  constructor() {
    this.logsDir = path.join(__dirname, "../logs");
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  getLogFileName() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `cron-${year}-${month}-${day}.log`;
  }

  getLogFilePath() {
    return path.join(this.logsDir, this.getLogFileName());
  }

  formatTimestamp() {
    const date = new Date();
    return date.toISOString();
  }

  log(level, message, data = null) {
    const timestamp = this.formatTimestamp();
    let logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    if (data) {
      logMessage += ` | Data: ${JSON.stringify(data)}`;
    }

    logMessage += "\n";

    // Write to file
    fs.appendFileSync(this.getLogFilePath(), logMessage, "utf8");

    // Also log to console
    console.log(logMessage.trim());
  }

  info(message, data = null) {
    this.log("info", message, data);
  }

  error(message, data = null) {
    this.log("error", message, data);
  }

  warn(message, data = null) {
    this.log("warn", message, data);
  }

  success(message, data = null) {
    this.log("success", message, data);
  }
}

module.exports = new Logger();
