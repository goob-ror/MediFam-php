/**
 * outputEscape.js — HTML-escape all string values in JSON responses.
 * Intercepts res.json() globally so no route needs to be touched.
 */

const ESCAPE_MAP = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
};

// Matches ISO 8601 and MySQL datetime strings returned as strings
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}([ T]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/;

const escapeHtml = (str) =>
  str.replace(/[&<>"']/g, (c) => ESCAPE_MAP[c]);

function escapeDeep(value, path = "") {
  // Date objects from mysql2 driver — pass through as-is
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string") {
    if (DATE_PATTERN.test(value)) return value;
    const escaped = escapeHtml(value);
    return escaped;
  }

  if (Array.isArray(value))
    return value.map((v, i) => escapeDeep(v, `${path}[${i}]`));

  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, escapeDeep(v, path ? `${path}.${k}` : k)])
    );

  return value;
}

const escapeOutput = (_req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = (data) => originalJson(escapeDeep(data));
  next();
};

module.exports = { escapeOutput, escapeHtml };
