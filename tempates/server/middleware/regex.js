// Allowlist: letters, numbers, spaces, comma, period, common punctuation, underscore
const SAFE_INPUT = /^[\p{L}0-9 .,()'\-/:;_]+$/u;

// Fields that are exempt from the allowlist (passwords, free-text, numerics)
const SKIP_FIELDS = new Set([
  "password", "confirmPassword",
  // Free-text fields that may contain any characters
  "alamat", "alamat_pasangan", "keterangan", "catatan", "alasan_pencabutan",
  "efek_samping_kb_sebelumnya", "rekomendasi_kontrasepsi", "catatan_dokter",
  "kontrasepsi_yang_diinginkan", "kontrasepsi_yang_dipilih", "kontrasepsi_yang_diinginkan",
]);

// Per-field length constraints
const FIELD_RULES = {
  username:             { maxLength: 50 },
  password:             { minLength: 6, maxLength: 128 },
  confirmPassword:      { minLength: 6, maxLength: 128 },
  phone:                { maxLength: 20, pattern: /^[0-9+\-() ]+$/ },
  no_hp:                { maxLength: 20, pattern: /^[0-9+\-() ]+$/ },
  no_hp_pasangan:       { maxLength: 20, pattern: /^[0-9+\-() ]+$/ },
  nik:                  { maxLength: 16, pattern: /^[0-9]+$/ },
  nik_pasangan:         { maxLength: 16, pattern: /^[0-9]+$/ },
  no_kk:                { maxLength: 16, pattern: /^[0-9]+$/ },
  no_bpjs:              { maxLength: 20, pattern: /^[0-9]+$/ },
  nama_lengkap:         { maxLength: 100 },
  nama_pasangan:        { maxLength: 100 },
  alamat:               { maxLength: 500 },
  kecamatan:            { maxLength: 100 },
  tempat_lahir:         { maxLength: 100 },
  tempat_lahir_pasangan:{ maxLength: 100 },
  tanggal_lahir:        { maxLength: 20, pattern: /^[0-9\-/]+$/ },
  tanggal_lahir_pasangan:{ maxLength: 20, pattern: /^[0-9\-/]+$/ },
  judul_kegiatan:       { maxLength: 200 },
  lokasi:               { maxLength: 255 },
  lokasi_koordinat:     { maxLength: 100 },
  faskes_tk1:           { maxLength: 100 },
  pekerjaan:            { maxLength: 50 },
};

module.exports = { SAFE_INPUT, SKIP_FIELDS, FIELD_RULES };
