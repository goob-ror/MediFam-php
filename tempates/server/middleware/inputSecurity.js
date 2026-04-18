/**
 * inputSecurity.js — input validation middleware
 * Uses allowlist from regex.js to block anything outside A-Za-z0-9 space , .
 * Password fields are exempt from the allowlist check.
 */

const { SAFE_INPUT, SKIP_FIELDS, FIELD_RULES } = require("./regex");

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Check a single field value.
 * Returns an error string or null.
 */
function validateField(field, value) {
  if (value === undefined || value === null || value === "") return null;

  // Booleans and numbers don't need string validation
  if (typeof value === "boolean" || typeof value === "number") return null;

  value = String(value).trim();
  if (value === "") return null;

  const rule = FIELD_RULES[field] || {};

  // Length checks
  if (rule.minLength && value.length < rule.minLength)
    return `${field} minimal ${rule.minLength} karakter`;
  if (rule.maxLength && value.length > rule.maxLength)
    return `${field} maksimal ${rule.maxLength} karakter`;

  // Fields with an explicit pattern
  if (rule.pattern) {
    if (!rule.pattern.test(value))
      return `${field} mengandung karakter yang tidak diizinkan`;
    return null;
  }

  // Skip allowlist for exempt fields
  if (SKIP_FIELDS.has(field)) return null;

  // Allowlist check
  if (!SAFE_INPUT.test(value))
    return `${field} hanya boleh berisi huruf, angka, spasi, koma, dan titik`;

  return null;
}

// ── Middleware ────────────────────────────────────────────────────────────────

/**
 * validateFields
 * Applied per-route on write endpoints (POST / PUT).
 * Rejects the request with 400 on the first invalid field found.
 */
const validateFields = (req, res, next) => {
  for (const [field, value] of Object.entries(req.body || {})) {
    const error = validateField(field, value);
    if (error) return res.status(400).json({ success: false, message: error });
  }
  next();
};

module.exports = { validateFields };
