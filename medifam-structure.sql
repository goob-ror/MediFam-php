-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 29, 2026 at 07:44 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `medifamv2`
--

-- --------------------------------------------------------

--
-- Table structure for table `asuransi`
--

CREATE TABLE `asuransi` (
  `id` bigint NOT NULL,
  `pasangan_kb_id` bigint NOT NULL,
  `jenis_asuransi` enum('BPJS','Umum','Lainnya') DEFAULT 'BPJS',
  `no_bpjs` varchar(20) DEFAULT NULL,
  `jenis_kepesertaan` enum('PBI','Non PBI','PBPU','PPU') DEFAULT NULL,
  `faskes_tk1` varchar(100) DEFAULT NULL,
  `aktif` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kegiatan_safari`
--

CREATE TABLE `kegiatan_safari` (
  `id` bigint NOT NULL,
  `judul_kegiatan` varchar(150) NOT NULL,
  `tanggal_kegiatan` date NOT NULL,
  `waktu_mulai` time DEFAULT NULL,
  `waktu_selesai` time DEFAULT NULL,
  `lokasi` varchar(150) DEFAULT NULL,
  `lokasi_koordinat` text,
  `kecamatan` varchar(50) DEFAULT NULL,
  `target_peserta` int DEFAULT '0',
  `peserta_hadir` int DEFAULT '0',
  `status` enum('draft','terjadwal','berlangsung','selesai','dibatalkan') DEFAULT 'draft',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `master_kontrasepsi`
--

CREATE TABLE `master_kontrasepsi` (
  `id` smallint NOT NULL,
  `kode` varchar(10) NOT NULL,
  `nama` varchar(50) NOT NULL,
  `jenis` enum('hormonal','non_hormonal','alat','permanent') DEFAULT NULL,
  `masa_berlaku_bulan` smallint DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `keterangan` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pasangan_kb`
--

CREATE TABLE `pasangan_kb` (
  `id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `nama_pasangan` varchar(100) NOT NULL,
  `nik_pasangan` char(16) DEFAULT NULL,
  `jenis_kelamin` enum('L','P') DEFAULT NULL,
  `no_hp_pasangan` varchar(15) DEFAULT NULL,
  `alamat_sama` tinyint(1) DEFAULT '1',
  `alamat_pasangan` text,
  `kecamatan_pasangan` varchar(50) DEFAULT NULL,
  `tempat_lahir_pasangan` varchar(50) DEFAULT NULL,
  `tanggal_lahir_pasangan` date DEFAULT NULL,
  `pekerjaan` varchar(50) DEFAULT NULL,
  `pendidikan` enum('SD','SMP','SMA','D3','S1','S2','S3') DEFAULT NULL,
  `jumlah_anak_laki` tinyint DEFAULT '0',
  `jumlah_anak_perempuan` tinyint DEFAULT '0',
  `usia_anak_terakhir` tinyint DEFAULT NULL,
  `tahapan_kb` enum('pra_kb','sedang_kb','pasca_kb') DEFAULT 'pra_kb',
  `status_pernikahan` enum('menikah','janda_duda','cerai') DEFAULT 'menikah',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_otp`
--

CREATE TABLE `password_reset_otp` (
  `id` int NOT NULL,
  `no_hp` varchar(20) NOT NULL,
  `otp_code` varchar(6) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pelayanan_kb`
--

CREATE TABLE `pelayanan_kb` (
  `id` bigint NOT NULL,
  `pasangan_kb_id` bigint NOT NULL,
  `pemeriksaan_id` bigint DEFAULT NULL,
  `tanggal_datang` datetime DEFAULT NULL,
  `tanggal_pelayanan` datetime DEFAULT NULL,
  `kontrasepsi_yang_dipilih` text,
  `tanggal_pasang` date DEFAULT NULL,
  `tanggal_jadwal_kembali` date DEFAULT NULL,
  `tanggal_pencabutan` date DEFAULT NULL,
  `alasan_pencabutan` text,
  `hasil_rujukan` enum('tidak_dirujuk','dirujuk_dokter','dirujuk_rs','selesai_dirujuk') DEFAULT NULL,
  `status_pelayanan` enum('baru','ulangan','cabut','ganti','konseling') DEFAULT 'konseling',
  `keterangan` text,
  `created_by` bigint NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `jenis_kunjungan` enum('baru','follow_up') DEFAULT 'baru',
  `follow_up_dari_id` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pemeriksaan`
--

CREATE TABLE `pemeriksaan` (
  `id` bigint NOT NULL,
  `pasangan_kb_id` bigint NOT NULL,
  `tanggal_pemeriksaan` datetime NOT NULL,
  `tekanan_darah_sistolik` smallint DEFAULT NULL,
  `tekanan_darah_diastolik` smallint DEFAULT NULL,
  `detak_nadi` tinyint DEFAULT NULL,
  `respirasi` tinyint DEFAULT NULL,
  `suhu` decimal(3,1) DEFAULT NULL,
  `tinggi_badan` smallint DEFAULT NULL,
  `berat_badan` decimal(5,2) DEFAULT NULL,
  `imt` decimal(4,2) DEFAULT NULL,
  `lingkar_perut` smallint DEFAULT NULL,
  `hamil` tinyint(1) DEFAULT '0',
  `diduga_hamil` tinyint(1) DEFAULT '0',
  `menyusui` tinyint(1) DEFAULT '0',
  `tanda_radang` tinyint(1) DEFAULT '0',
  `tumor_keganasan` tinyint(1) DEFAULT '0',
  `tanda_diabetes` tinyint(1) DEFAULT '0',
  `kelainan_pembekuan` tinyint(1) DEFAULT '0',
  `orchitis_epididymitis` tinyint(1) DEFAULT '0',
  `posisi_rahim` enum('antefleksi','retrofleksi','lainnya','tidak_diperiksa') DEFAULT 'tidak_diperiksa',
  `efek_samping_kb_sebelumnya` text,
  `tanggal_haid_terakhir` date DEFAULT NULL,
  `siklus_haid` enum('teratur','tidak_teratur','menopause') DEFAULT 'teratur',
  `status_umum` enum('baik','risiko_rendah','risiko_tinggi') DEFAULT 'baik',
  `perlu_rujuk` tinyint(1) DEFAULT '0',
  `catatan_dokter` text,
  `rekomendasi_kontrasepsi` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `peserta_safari`
--

CREATE TABLE `peserta_safari` (
  `id` bigint NOT NULL,
  `kegiatan_id` bigint NOT NULL,
  `pasangan_kb_id` bigint NOT NULL,
  `hadir` tinyint(1) DEFAULT '0',
  `received_reminder` tinyint NOT NULL DEFAULT '0',
  `tanggal_konfirmasi` datetime DEFAULT NULL,
  `catatan` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `riwayat_reproduksi`
--

CREATE TABLE `riwayat_reproduksi` (
  `id` bigint NOT NULL,
  `pasangan_kb_id` bigint NOT NULL,
  `gravida` tinyint DEFAULT '0',
  `partus` tinyint DEFAULT '0',
  `abortus` tinyint DEFAULT '0',
  `hidup` tinyint DEFAULT '0',
  `penyakit_kuning` tinyint(1) DEFAULT '0',
  `keputihan` tinyint(1) DEFAULT '0',
  `tumor_ginekologi` tinyint(1) DEFAULT '0',
  `pms` tinyint(1) DEFAULT '0',
  `riwayat_operasi` text,
  `alergi_obat` text,
  `keterangan` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint NOT NULL,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('bidan','pengguna') DEFAULT 'pengguna',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_profiles`
--

CREATE TABLE `user_profiles` (
  `user_id` bigint NOT NULL,
  `nik` char(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `jenis_kelamin` enum('L','P') DEFAULT NULL,
  `no_hp` varchar(15) DEFAULT NULL,
  `alamat` text,
  `kecamatan` varchar(50) DEFAULT NULL,
  `tempat_lahir` varchar(50) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `no_kk` char(16) DEFAULT NULL,
  `kontrasepsi_yang_diinginkan` text,
  `jenis_akseptor` enum('Baru','Aktif') NOT NULL DEFAULT 'Baru',
  `profile_image` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `receive_autoreminder` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `asuransi`
--
ALTER TABLE `asuransi`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `no_bpjs` (`no_bpjs`),
  ADD KEY `idx_pasangan_kb_id` (`pasangan_kb_id`),
  ADD KEY `idx_aktif` (`aktif`);

--
-- Indexes for table `kegiatan_safari`
--
ALTER TABLE `kegiatan_safari`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tanggal` (`tanggal_kegiatan`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `master_kontrasepsi`
--
ALTER TABLE `master_kontrasepsi`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode` (`kode`);

--
-- Indexes for table `pasangan_kb`
--
ALTER TABLE `pasangan_kb`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nik_pasangan` (`nik_pasangan`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_tahapan_kb` (`tahapan_kb`);

--
-- Indexes for table `password_reset_otp`
--
ALTER TABLE `password_reset_otp`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_no_hp` (`no_hp`);

--
-- Indexes for table `pelayanan_kb`
--
ALTER TABLE `pelayanan_kb`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pemeriksaan_id` (`pemeriksaan_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_pasangan_kb_id` (`pasangan_kb_id`),
  ADD KEY `idx_tanggal_pelayanan` (`tanggal_pelayanan`),
  ADD KEY `idx_status` (`status_pelayanan`),
  ADD KEY `idx_jadwal_kembali` (`tanggal_jadwal_kembali`);

--
-- Indexes for table `pemeriksaan`
--
ALTER TABLE `pemeriksaan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_pasangan_kb_id` (`pasangan_kb_id`),
  ADD KEY `idx_tanggal` (`tanggal_pemeriksaan`);

--
-- Indexes for table `peserta_safari`
--
ALTER TABLE `peserta_safari`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_kegiatan_id` (`kegiatan_id`),
  ADD KEY `idx_pasangan_kb_id` (`pasangan_kb_id`);

--
-- Indexes for table `riwayat_reproduksi`
--
ALTER TABLE `riwayat_reproduksi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_pasangan_kb_id` (`pasangan_kb_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `nik` (`nik`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `asuransi`
--
ALTER TABLE `asuransi`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kegiatan_safari`
--
ALTER TABLE `kegiatan_safari`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `master_kontrasepsi`
--
ALTER TABLE `master_kontrasepsi`
  MODIFY `id` smallint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pasangan_kb`
--
ALTER TABLE `pasangan_kb`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `password_reset_otp`
--
ALTER TABLE `password_reset_otp`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pelayanan_kb`
--
ALTER TABLE `pelayanan_kb`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pemeriksaan`
--
ALTER TABLE `pemeriksaan`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `peserta_safari`
--
ALTER TABLE `peserta_safari`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `riwayat_reproduksi`
--
ALTER TABLE `riwayat_reproduksi`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `asuransi`
--
ALTER TABLE `asuransi`
  ADD CONSTRAINT `asuransi_ibfk_1` FOREIGN KEY (`pasangan_kb_id`) REFERENCES `pasangan_kb` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pasangan_kb`
--
ALTER TABLE `pasangan_kb`
  ADD CONSTRAINT `pasangan_kb_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pelayanan_kb`
--
ALTER TABLE `pelayanan_kb`
  ADD CONSTRAINT `pelayanan_kb_ibfk_1` FOREIGN KEY (`pasangan_kb_id`) REFERENCES `pasangan_kb` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pelayanan_kb_ibfk_2` FOREIGN KEY (`pemeriksaan_id`) REFERENCES `pemeriksaan` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `pelayanan_kb_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `pemeriksaan`
--
ALTER TABLE `pemeriksaan`
  ADD CONSTRAINT `pemeriksaan_ibfk_1` FOREIGN KEY (`pasangan_kb_id`) REFERENCES `pasangan_kb` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `peserta_safari`
--
ALTER TABLE `peserta_safari`
  ADD CONSTRAINT `peserta_safari_ibfk_1` FOREIGN KEY (`kegiatan_id`) REFERENCES `kegiatan_safari` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `peserta_safari_ibfk_2` FOREIGN KEY (`pasangan_kb_id`) REFERENCES `pasangan_kb` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `riwayat_reproduksi`
--
ALTER TABLE `riwayat_reproduksi`
  ADD CONSTRAINT `riwayat_reproduksi_ibfk_1` FOREIGN KEY (`pasangan_kb_id`) REFERENCES `pasangan_kb` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD CONSTRAINT `user_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
