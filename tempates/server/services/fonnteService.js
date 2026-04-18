const https = require("https");
const querystring = require("querystring");
const logger = require("../utils/logger");

const FONNTE_TOKEN = process.env.FONNTE_API;
const FONNTE_HOST = "api.fonnte.com";

/**
 * Send a WhatsApp message via Fonnte API
 * @param {string} target - Phone number (e.g. "08123456789")
 * @param {string} message - Message text
 * @returns {Promise<object>}
 */
function sendMessage(target, message) {
  return new Promise((resolve, reject) => {
    const formData = querystring.stringify({ target, message });

    const options = {
      hostname: FONNTE_HOST,
      path: "/send",
      method: "POST",
      headers: {
        Authorization: FONNTE_TOKEN,
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(formData),
      },
    };

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(body);
          resolve(parsed);
        } catch {
          resolve({ raw: body });
        }
      });
    });

    req.on("error", (err) => {
      logger.error("Fonnte request error", { error: err.message, target });
      reject(err);
    });

    req.write(formData);
    req.end();
  });
}

module.exports = { sendMessage };
