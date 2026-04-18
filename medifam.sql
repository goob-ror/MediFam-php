-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 29, 2026 at 07:43 AM
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

--
-- Dumping data for table `asuransi`
--

INSERT INTO `asuransi` (`id`, `pasangan_kb_id`, `jenis_asuransi`, `no_bpjs`, `jenis_kepesertaan`, `faskes_tk1`, `aktif`, `created_at`, `updated_at`) VALUES
(1, 1, 'BPJS', '0001234567890', 'PBI', 'Puskesmas Palaran', 1, '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(2, 2, 'BPJS', '0002345678901', 'Non PBI', 'Puskesmas Palaran', 1, '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(3, 3, 'BPJS', '0003456789012', 'PBI', 'Puskesmas Palaran', 1, '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(4, 4, 'BPJS', '0004567890123', 'PBPU', 'Puskesmas Palaran', 1, '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(5, 5, 'BPJS', '0005678901234', 'PBI', 'Puskesmas Palaran', 1, '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(6, 6, 'BPJS', '0006789012345', 'Non PBI', 'Puskesmas Palaran', 1, '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(7, 7, 'BPJS', '0007890123456', 'PBI', 'Puskesmas Palaran', 1, '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(8, 8, 'BPJS', '0008901234567', 'PBPU', 'Puskesmas Palaran', 1, '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(9, 9, 'BPJS', '0009012345678', 'PBI', 'Puskesmas Palaran', 1, '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(10, 10, 'BPJS', '0010123456789', 'Non PBI', 'Puskesmas Palaran', 1, '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(11, 11, 'BPJS', '00112233445566', 'PBI', 'Melati Putih', 1, '2025-11-23 15:14:07', '2026-03-27 09:39:12');

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

--
-- Dumping data for table `kegiatan_safari`
--

INSERT INTO `kegiatan_safari` (`id`, `judul_kegiatan`, `tanggal_kegiatan`, `waktu_mulai`, `waktu_selesai`, `lokasi`, `lokasi_koordinat`, `kecamatan`, `target_peserta`, `peserta_hadir`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Safari KB Simpang Pasir', '2025-10-15', '09:00:00', '12:00:00', 'Balai RW 03 Simpang Pasir', NULL, 'Simpang Pasir', 50, 42, 'selesai', '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(2, 'Safari KB Handil Bakti', '2025-10-22', '14:00:00', '17:00:00', 'Masjid Al-Hidayah Handil Bakti', NULL, 'Handil Bakti', 60, 55, 'selesai', '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(3, 'Safari KB Rawa Makmur', '2025-11-05', '09:00:00', '12:00:00', 'Posyandu Melati Rawa Makmur', NULL, 'Rawa Makmur', 45, 40, 'selesai', '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(4, 'Safari KB Bukuan', '2025-11-12', '13:00:00', '16:00:00', 'Aula Kelurahan Bukuan', NULL, 'Bukuan', 55, 48, 'selesai', '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(5, 'Safari KB Bantuas', '2025-11-19', '09:00:00', '12:00:00', 'Lapangan Bantuas', NULL, 'Bantuas', 70, 65, 'selesai', '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(6, 'Safari KB Simpang Pasir November', '2025-12-10', '09:00:00', '12:00:00', 'RW 05 Simpang Pasir', NULL, 'Simpang Pasir', 50, 0, 'selesai', '2025-11-23 06:58:16', '2026-03-05 16:00:00'),
(7, 'Safari KB Handil Bakti Desember', '2025-12-17', '14:00:00', '17:00:00', 'Posyandu Handil Bakti', NULL, 'Handil Bakti', 60, 0, 'selesai', '2025-11-23 06:58:16', '2026-03-05 16:00:00'),
(8, 'Safari KB Rawa Makmur', '2026-01-08', '09:00:00', '12:00:00', 'Balai Pertemuan Rawa Makmur', NULL, 'Rawa Makmur', 50, 0, 'selesai', '2025-11-23 06:58:16', '2026-03-05 16:00:00'),
(9, 'Safari KB Bukuan', '2026-01-15', '13:00:00', '16:00:00', 'Kelurahan Bukuan', NULL, 'Bukuan', 55, 0, 'selesai', '2025-11-23 06:58:16', '2026-03-05 16:00:00'),
(10, 'Safari KB Bantuas', '2026-01-22', '09:00:00', '12:00:00', 'Masjid Bantuas', NULL, 'Bantuas', 65, 0, 'selesai', '2025-11-23 06:58:16', '2026-03-05 16:00:00'),
(11, 'Kegiatan Tes Tes', '2026-03-06', '10:00:00', '17:00:00', 'Di mana aja', NULL, 'Rawa Makmur', 15, 0, 'selesai', '2026-03-05 13:27:10', '2026-03-14 12:00:00'),
(12, 'Acara Makan Makan', '2026-03-16', '10:00:00', '15:00:00', 'Di mana aja', NULL, 'Rawa Makmur', 15, 0, 'selesai', '2026-03-14 12:02:04', '2026-03-16 15:15:00'),
(13, 'Acara Nonton Bareng', '2026-03-18', '10:00:00', '15:00:00', 'Politeknik Negeri Samarinda', NULL, NULL, 2, 0, 'selesai', '2026-03-16 19:21:54', '2026-03-23 10:15:00'),
(14, 'Kembali Sekolah', '2026-03-27', '12:00:00', '20:00:00', 'Politeknik Negeri Samarinda', NULL, 'Simpang Pasir', 30, 1, 'selesai', '2026-03-25 18:20:04', '2026-03-28 10:15:00');

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

--
-- Dumping data for table `master_kontrasepsi`
--

INSERT INTO `master_kontrasepsi` (`id`, `kode`, `nama`, `jenis`, `masa_berlaku_bulan`, `is_active`, `keterangan`, `created_at`) VALUES
(1, 'PIL', 'Pil KB', 'hormonal', 1, 1, 'Harus diminum setiap hari', '2025-11-23 06:58:02'),
(2, 'S3B', 'Suntik 3 Bulan', 'hormonal', 3, 1, 'DMPA', '2025-11-23 06:58:02'),
(3, 'S1B', 'Suntik 1 Bulan', 'hormonal', 1, 1, 'Kombinasi', '2025-11-23 06:58:02'),
(4, 'IUD', 'IUD', 'alat', 120, 1, '10 tahun', '2025-11-23 06:58:02'),
(5, 'IMP', 'Implant', 'hormonal', 36, 1, '3 tahun', '2025-11-23 06:58:02'),
(6, 'MOW', 'MOW (Tubektomi)', 'permanent', 0, 1, 'Sterilisasi wanita', '2025-11-23 06:58:02'),
(7, 'MOP', 'MOP (Vasektomi)', 'permanent', 0, 1, 'Sterilisasi pria', '2025-11-23 06:58:02'),
(8, 'KDM', 'Kondom', 'non_hormonal', 0, 1, 'Barrier method', '2025-11-23 06:58:02');

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

--
-- Dumping data for table `pasangan_kb`
--

INSERT INTO `pasangan_kb` (`id`, `user_id`, `nama_pasangan`, `nik_pasangan`, `jenis_kelamin`, `no_hp_pasangan`, `alamat_sama`, `alamat_pasangan`, `kecamatan_pasangan`, `tempat_lahir_pasangan`, `tanggal_lahir_pasangan`, `pekerjaan`, `pendidikan`, `jumlah_anak_laki`, `jumlah_anak_perempuan`, `usia_anak_terakhir`, `tahapan_kb`, `status_pernikahan`, `created_at`, `updated_at`) VALUES
(1, 2, 'Ahmad Fauzi', '6472010101881234', 'L', '081987654321', 1, NULL, 'Palaran', 'Samarinda', '1988-01-01', 'Wiraswasta', 'SMA', 1, 1, 4, 'sedang_kb', 'menikah', '2025-11-23 06:58:02', '2025-11-23 06:58:02'),
(2, 3, 'Budi Santoso', '6472010202892345', 'L', '081987654322', 1, NULL, 'Palaran', 'Samarinda', '1987-02-02', 'Karyawan Swasta', 'S1', 0, 2, 2, 'sedang_kb', 'menikah', '2025-11-23 06:58:02', '2025-11-23 06:58:02'),
(3, 4, 'Candra Wijaya', '6472010303903456', 'L', '081987654323', 1, NULL, 'Palaran', 'Samarinda', '1990-03-03', 'PNS', 'S1', 2, 0, 5, 'sedang_kb', 'menikah', '2025-11-23 06:58:02', '2025-11-23 06:58:02'),
(4, 5, 'Dedi Kurniawan', '6472010404914567', 'L', '081987654324', 1, NULL, 'Palaran', 'Balikpapan', '1985-04-04', 'TNI', 'SMA', 1, 1, 6, 'pra_kb', 'menikah', '2025-11-23 06:58:02', '2025-11-23 06:58:02'),
(5, 6, 'Eko Prasetyo', '6472010505925678', 'L', '081987654325', 1, NULL, 'Palaran', 'Samarinda', '1992-05-05', 'Pedagang', 'SMP', 0, 1, 1, 'sedang_kb', 'menikah', '2025-11-23 06:58:02', '2025-11-23 06:58:02'),
(6, 7, 'Fajar Nugroho', '6472010606936789', 'L', '081987654326', 1, NULL, 'Palaran', 'Samarinda', '1989-06-06', 'Sopir', 'SMA', 2, 1, 3, 'sedang_kb', 'menikah', '2025-11-23 06:58:02', '2025-11-23 06:58:02'),
(7, 8, 'Guntur Pratama', '6472010707947890', 'L', '081987654327', 1, NULL, 'Palaran', 'Samarinda', '1991-07-07', 'Buruh', 'SD', 1, 0, 7, 'pasca_kb', 'menikah', '2025-11-23 06:58:02', '2025-11-23 06:58:02'),
(8, 9, 'Hadi Susanto', '6472010808958901', 'L', '081987654328', 1, NULL, 'Palaran', 'Samarinda', '1986-08-08', 'Petani', 'SMP', 3, 2, 8, 'sedang_kb', 'menikah', '2025-11-23 06:58:02', '2025-11-23 06:58:02'),
(9, 10, 'Indra Gunawan', '6472010909969012', 'L', '081987654329', 1, NULL, 'Palaran', 'Samarinda', '1994-09-09', 'Karyawan', 'S1', 0, 0, NULL, 'pra_kb', 'menikah', '2025-11-23 06:58:02', '2025-11-23 06:58:02'),
(10, 11, 'Joko Widodo', '6472011010970123', 'L', '081987654330', 1, NULL, 'Palaran', 'Samarinda', '1993-10-10', 'Wiraswasta', 'SMA', 1, 0, 2, 'sedang_kb', 'menikah', '2025-11-23 06:58:02', '2025-11-23 06:58:02'),
(11, 12, 'Admin Cantik', '647202110900922', 'P', NULL, 1, NULL, NULL, NULL, NULL, 'Pegawai', 'S1', 0, 0, NULL, 'sedang_kb', 'menikah', '2025-11-23 14:58:59', '2026-03-27 09:39:12'),
(12, 17, 'riasep', '647202110900923', 'P', NULL, 1, NULL, NULL, NULL, NULL, 'Wiraswasta', 'SMP', 0, 0, NULL, NULL, 'menikah', '2026-03-15 14:05:52', '2026-03-15 14:05:52');

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

--
-- Dumping data for table `password_reset_otp`
--

INSERT INTO `password_reset_otp` (`id`, `no_hp`, `otp_code`, `expires_at`, `used`, `created_at`) VALUES
(1, '62895360022327', '963119', '2026-03-28 15:25:33', 1, '2026-03-28 15:15:32'),
(2, '62895360022327', '440354', '2026-03-28 15:49:36', 1, '2026-03-28 15:46:35'),
(3, '62895360022327', '889828', '2026-03-28 16:00:28', 0, '2026-03-28 15:57:27');

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

--
-- Dumping data for table `pelayanan_kb`
--

INSERT INTO `pelayanan_kb` (`id`, `pasangan_kb_id`, `pemeriksaan_id`, `tanggal_datang`, `tanggal_pelayanan`, `kontrasepsi_yang_dipilih`, `tanggal_pasang`, `tanggal_jadwal_kembali`, `tanggal_pencabutan`, `alasan_pencabutan`, `hasil_rujukan`, `status_pelayanan`, `keterangan`, `created_by`, `created_at`, `updated_at`, `jenis_kunjungan`, `follow_up_dari_id`) VALUES
(1, 1, 1, '2025-11-01 09:00:00', '2025-11-01 09:30:00', '2', '2025-11-01', '2026-02-01', NULL, NULL, NULL, 'ulangan', 'Suntik ulang 3 bulan', 1, '2025-11-23 06:58:16', '2025-11-23 06:58:16', 'baru', NULL),
(2, 2, 2, '2025-11-02 10:15:00', '2025-11-02 10:45:00', '1', '2025-11-02', '2025-12-02', NULL, NULL, NULL, 'ulangan', 'Pil rutin', 1, '2025-11-23 06:58:16', '2025-11-23 06:58:16', 'baru', NULL),
(3, 3, 3, '2025-11-03 08:30:00', '2025-11-03 09:00:00', '2', '2025-11-03', '2026-02-03', NULL, NULL, NULL, 'ganti', 'Ganti dari pil ke suntik 3 bulan', 1, '2025-11-23 06:58:16', '2025-11-23 06:58:16', 'baru', NULL),
(4, 4, 4, '2025-11-05 10:45:00', '2025-11-05 11:15:00', '5', '2025-11-05', '2028-11-05', NULL, NULL, NULL, 'baru', 'Pasang implant 3 tahun', 1, '2025-11-23 06:58:16', '2025-11-23 06:58:16', 'baru', NULL),
(5, 5, 5, '2025-11-06 09:00:00', '2025-11-06 09:30:00', '2', '2025-11-06', '2026-02-06', NULL, NULL, NULL, 'ulangan', NULL, 1, '2025-11-23 06:58:16', '2025-11-23 06:58:16', 'baru', NULL),
(6, 6, 6, '2025-11-08 14:00:00', '2025-11-08 14:30:00', '3', '2025-11-08', '2025-12-08', NULL, NULL, NULL, 'ulangan', 'Suntik 1 bulan', 1, '2025-11-23 06:58:16', '2025-11-23 06:58:16', 'baru', NULL),
(7, 7, 7, '2025-11-10 09:45:00', '2025-11-10 10:15:00', '1', '2025-11-10', '2025-12-10', NULL, NULL, NULL, 'ulangan', 'Keluhan pusing ringan tetap lanjut', 1, '2025-11-23 06:58:16', '2025-11-23 06:58:16', 'baru', NULL),
(8, 8, 8, '2025-11-12 08:15:00', '2025-11-12 08:45:00', '4', '2025-11-12', '2035-11-12', NULL, NULL, NULL, 'baru', 'Pasang IUD', 1, '2025-11-23 06:58:16', '2025-11-23 06:58:16', 'baru', NULL),
(9, 9, 9, '2025-11-15 13:30:00', '2025-11-15 14:00:00', '2', '2025-11-15', '2026-02-15', NULL, NULL, NULL, 'baru', 'Pemakai baru suntik 3 bulan', 1, '2025-11-23 06:58:16', '2025-11-23 06:58:16', 'baru', NULL),
(10, 10, 10, '2025-11-18 09:00:00', '2025-11-18 09:30:00', '1', '2025-11-18', '2025-12-18', NULL, NULL, NULL, 'konseling', 'Konseling dulu, bulan depan pasang', 1, '2025-11-23 06:58:16', '2025-11-23 06:58:16', 'baru', NULL),
(11, 11, 13, '2026-03-27 00:00:00', '2026-03-27 00:00:00', '1', NULL, '2026-04-05', NULL, NULL, 'tidak_dirujuk', 'konseling', 'datang kembali nanti untuk pengecekan ulang dan pencatatan dampak penggunaan', 1, '2026-03-27 15:04:39', '2026-03-27 15:04:39', 'baru', NULL),
(12, 12, 14, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'tidak_dirujuk', 'konseling', NULL, 1, '2026-03-27 15:23:21', '2026-03-27 15:23:21', 'baru', NULL);

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

--
-- Dumping data for table `pemeriksaan`
--

INSERT INTO `pemeriksaan` (`id`, `pasangan_kb_id`, `tanggal_pemeriksaan`, `tekanan_darah_sistolik`, `tekanan_darah_diastolik`, `detak_nadi`, `respirasi`, `suhu`, `tinggi_badan`, `berat_badan`, `imt`, `lingkar_perut`, `hamil`, `diduga_hamil`, `menyusui`, `tanda_radang`, `tumor_keganasan`, `tanda_diabetes`, `kelainan_pembekuan`, `orchitis_epididymitis`, `posisi_rahim`, `efek_samping_kb_sebelumnya`, `tanggal_haid_terakhir`, `siklus_haid`, `status_umum`, `perlu_rujuk`, `catatan_dokter`, `rekomendasi_kontrasepsi`, `created_at`, `updated_at`) VALUES
(1, 1, '2025-11-01 09:15:00', 110, 70, 78, 18, 36.6, 158, 55.00, 22.00, 78, 0, 0, 1, 0, 0, 0, 0, 0, 'tidak_diperiksa', NULL, '2025-10-15', 'teratur', 'baik', 0, 'Pasien rutin suntik KB', NULL, '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(2, 2, '2025-11-02 10:30:00', 120, 80, 82, 20, 36.7, 160, 62.00, 24.20, 82, 0, 0, 0, 0, 0, 0, 0, 0, 'tidak_diperiksa', NULL, '2025-10-20', 'teratur', 'baik', 0, NULL, NULL, '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(3, 3, '2025-11-03 08:45:00', 115, 75, 76, 18, 36.5, 155, 58.00, 24.10, 80, 0, 0, 0, 0, 0, 0, 0, 0, 'tidak_diperiksa', NULL, '2025-10-18', 'teratur', 'baik', 0, 'Ganti dari pil ke suntik', NULL, '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(4, 4, '2025-11-05 11:00:00', 130, 85, 88, 22, 36.8, 162, 68.00, 25.90, 88, 0, 0, 0, 0, 0, 0, 0, 0, 'tidak_diperiksa', NULL, '2025-10-22', 'teratur', 'risiko_rendah', 0, 'Berat badan naik', NULL, '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(5, 5, '2025-11-06 09:20:00', 105, 65, 72, 18, 36.6, 157, 52.00, 21.10, 74, 0, 0, 1, 0, 0, 0, 0, 0, 'tidak_diperiksa', NULL, '2025-10-25', 'teratur', 'baik', 0, NULL, NULL, '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(6, 6, '2025-11-08 14:15:00', 118, 78, 80, 20, 36.7, 159, 60.00, 23.70, 81, 0, 0, 0, 0, 0, 0, 0, 0, 'tidak_diperiksa', NULL, '2025-10-28', 'teratur', 'baik', 0, NULL, NULL, '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(7, 7, '2025-11-10 10:00:00', 125, 80, 84, 19, 36.6, 161, 65.00, 25.10, 86, 0, 0, 0, 0, 0, 0, 0, 0, 'tidak_diperiksa', NULL, '2025-10-19', 'teratur', 'risiko_rendah', 0, 'Keluhan pusing ringan', NULL, '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(8, 8, '2025-11-12 08:30:00', 112, 72, 76, 18, 36.5, 156, 57.00, 23.40, 79, 0, 0, 1, 0, 0, 0, 0, 0, 'tidak_diperiksa', NULL, '2025-10-30', 'teratur', 'baik', 0, NULL, NULL, '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(9, 9, '2025-11-15 13:45:00', 108, 70, 74, 18, 36.6, 160, 54.00, 21.10, 76, 0, 0, 0, 0, 0, 0, 0, 0, 'tidak_diperiksa', NULL, '2025-11-01', 'teratur', 'baik', 0, 'Baru daftar KB', NULL, '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(10, 10, '2025-11-18 09:10:00', 122, 82, 86, 20, 36.7, 163, 70.00, 26.30, 90, 0, 0, 0, 0, 0, 0, 0, 0, 'tidak_diperiksa', NULL, '2025-10-26', 'teratur', 'risiko_rendah', 0, 'IMT tinggi', NULL, '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(13, 11, '2026-03-27 15:04:39', 130, 94, 96, 35, 36.0, 165, 65.00, 23.88, 55, 0, 0, 0, 0, 0, 1, 0, 0, 'antefleksi', NULL, '2026-03-12', 'teratur', 'baik', 0, NULL, NULL, '2026-03-27 15:04:39', '2026-03-27 15:04:39'),
(14, 12, '2026-03-27 15:23:21', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 'antefleksi', '<script>alert(1)</script>', NULL, 'teratur', 'baik', 0, NULL, NULL, '2026-03-27 15:23:21', '2026-03-27 15:23:21');

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

--
-- Dumping data for table `peserta_safari`
--

INSERT INTO `peserta_safari` (`id`, `kegiatan_id`, `pasangan_kb_id`, `hadir`, `received_reminder`, `tanggal_konfirmasi`, `catatan`, `created_at`) VALUES
(1, 1, 1, 1, 0, '2025-10-14 10:00:00', NULL, '2025-11-23 06:58:16'),
(2, 1, 2, 1, 0, '2025-10-14 11:15:00', NULL, '2025-11-23 06:58:16'),
(3, 1, 3, 1, 0, '2025-10-14 14:20:00', NULL, '2025-11-23 06:58:16'),
(4, 1, 4, 0, 0, NULL, NULL, '2025-11-23 06:58:16'),
(5, 1, 5, 1, 0, '2025-10-15 08:00:00', NULL, '2025-11-23 06:58:16'),
(6, 1, 6, 1, 0, '2025-10-13 16:30:00', NULL, '2025-11-23 06:58:16'),
(7, 1, 7, 1, 0, '2025-10-14 09:45:00', NULL, '2025-11-23 06:58:16'),
(8, 1, 8, 1, 0, '2025-10-15 07:30:00', NULL, '2025-11-23 06:58:16'),
(9, 1, 9, 1, 0, '2025-10-14 12:00:00', NULL, '2025-11-23 06:58:16'),
(10, 1, 10, 1, 0, '2025-10-15 08:45:00', NULL, '2025-11-23 06:58:16'),
(11, 12, 11, 0, 1, '2026-03-14 12:02:56', NULL, '2026-03-14 12:02:56'),
(12, 12, 12, 0, 1, '2026-03-15 14:05:57', NULL, '2026-03-15 14:05:57'),
(13, 14, 12, 0, 1, '2026-03-27 15:23:39', NULL, '2026-03-26 06:11:40'),
(19, 14, 11, 1, 1, '2026-03-27 15:04:39', NULL, '2026-03-26 07:41:23');

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

--
-- Dumping data for table `riwayat_reproduksi`
--

INSERT INTO `riwayat_reproduksi` (`id`, `pasangan_kb_id`, `gravida`, `partus`, `abortus`, `hidup`, `penyakit_kuning`, `keputihan`, `tumor_ginekologi`, `pms`, `riwayat_operasi`, `alergi_obat`, `keterangan`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 2, 0, 2, 0, 0, 0, 0, NULL, NULL, NULL, '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(2, 2, 3, 2, 1, 2, 0, 1, 0, 0, NULL, NULL, 'Pernah keguguran 2022', '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(3, 3, 2, 2, 0, 2, 0, 0, 0, 0, NULL, NULL, NULL, '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(4, 4, 4, 3, 1, 3, 0, 0, 0, 0, NULL, NULL, NULL, '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(5, 5, 1, 1, 0, 1, 0, 0, 0, 0, NULL, NULL, NULL, '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(6, 6, 3, 3, 0, 3, 0, 1, 0, 0, NULL, NULL, 'Keputihan berulang', '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(7, 7, 2, 1, 1, 1, 0, 0, 0, 0, NULL, NULL, NULL, '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(8, 8, 5, 5, 0, 5, 0, 0, 0, 0, NULL, NULL, NULL, '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(9, 9, 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, 'Belum pernah hamil', '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(10, 10, 2, 2, 0, 2, 0, 0, 0, 0, NULL, NULL, NULL, '2025-11-23 06:58:16', '2025-11-23 06:58:16'),
(11, 11, 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, '2025-11-23 14:58:59', '2026-03-27 15:04:39'),
(12, 12, 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, '2026-03-15 14:05:52', '2026-03-27 15:23:21');

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

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `role`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'bidan_palaran', '$2y$10$zJbqW8f3xK8z8z8z8z8z8u8z8z8z8z8z8z8z8z8z8z8z8z8z8z8z8z8', 'bidan', 1, '2025-11-23 06:58:02', '2025-11-23 06:58:02'),
(2, 'siti123', '$2y$10$zJbqW8f3xK8z8z8z8z8z8u8z8z8z8z8z8z8z8z8z8z8z8z8z8z8z8z8', 'pengguna', 1, '2025-11-23 06:58:02', '2025-11-23 06:58:02'),
(3, 'ani456', '$2y$10$zJbqW8f3xK8z8z8z8z8z8u8z8z8z8z8z8z8z8z8z8z8z8z8z8z8z8z8', 'pengguna', 1, '2025-11-23 06:58:02', '2025-11-23 06:58:02'),
(4, 'rina789', '$2y$10$zJbqW8f3xK8z8z8z8z8z8u8z8z8z8z8z8z8z8z8z8z8z8z8z8z8z8z8', 'pengguna', 1, '2025-11-23 06:58:02', '2025-11-23 06:58:02'),
(5, 'dewi321', '$2y$10$zJbqW8f3xK8z8z8z8z8z8u8z8z8z8z8z8z8z8z8z8z8z8z8z8z8z8z8', 'pengguna', 1, '2025-11-23 06:58:02', '2025-11-23 06:58:02'),
(6, 'lina654', '$2y$10$zJbqW8f3xK8z8z8z8z8z8u8z8z8z8z8z8z8z8z8z8z8z8z8z8z8z8z8', 'pengguna', 1, '2025-11-23 06:58:02', '2025-11-23 06:58:02'),
(7, 'yuli987', '$2y$10$zJbqW8f3xK8z8z8z8z8z8u8z8z8z8z8z8z8z8z8z8z8z8z8z8z8z8z8', 'pengguna', 1, '2025-11-23 06:58:02', '2025-11-23 06:58:02'),
(8, 'nina147', '$2y$10$zJbqW8f3xK8z8z8z8z8z8u8z8z8z8z8z8z8z8z8z8z8z8z8z8z8z8z8', 'pengguna', 1, '2025-11-23 06:58:02', '2025-11-23 06:58:02'),
(9, 'eka258', '$2y$10$zJbqW8f3xK8z8z8z8z8z8u8z8z8z8z8z8z8z8z8z8z8z8z8z8z8z8z8', 'pengguna', 1, '2025-11-23 06:58:02', '2025-11-23 06:58:02'),
(10, 'tia369', '$2y$10$zJbqW8f3xK8z8z8z8z8z8u8z8z8z8z8z8z8z8z8z8z8z8z8z8z8z8z8', 'pengguna', 1, '2025-11-23 06:58:02', '2025-11-23 06:58:02'),
(11, 'mira741', '$2y$10$zJbqW8f3xK8z8z8z8z8z8u8z8z8z8z8z8z8z8z8z8z8z8z8z8z8z8z8', 'pengguna', 1, '2025-11-23 06:58:02', '2025-11-23 06:58:02'),
(12, 'Admin Ganteng', '$2b$10$K5vlkgaqrwPee4ot9UQAI.WHvX/dWL86lZwca0eDCpWljVaWuEtda', 'pengguna', 1, '2025-11-23 08:33:46', '2025-11-23 08:33:46'),
(16, 'bidanAsli', '$2b$10$6qlgxv0u7mrJUfC8Z36BUOH1dwWJJHcQo7SzN.uTlIZ0YMCyea.oG', 'bidan', 1, '2025-11-23 22:18:44', '2025-11-23 22:18:44'),
(17, 'riosep', '$2b$10$dPZsIgKk3ug5Cy7CsqcRLe3X.0Y2SgigOMZ1.y2uQKBRFcmpcwwdC', 'pengguna', 1, '2026-03-15 14:01:54', '2026-03-15 14:01:54');

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
-- Dumping data for table `user_profiles`
--

INSERT INTO `user_profiles` (`user_id`, `nik`, `nama_lengkap`, `jenis_kelamin`, `no_hp`, `alamat`, `kecamatan`, `tempat_lahir`, `tanggal_lahir`, `no_kk`, `kontrasepsi_yang_diinginkan`, `jenis_akseptor`, `profile_image`, `receive_autoreminder`, `created_at`, `updated_at`) VALUES
(1, '6472036512345678', 'Bidan Siti Aminah', 'P', '081154321098', 'Jl. Puskesmas Palaran', 'Palaran', 'Samarinda', '1985-03-15', '6472031503850001', NULL, 'Baru', NULL, 1, '2025-11-23 06:58:02', '2025-11-23 06:58:02'),
(2, '6472035501234567', 'Siti Nurhaliza', 'P', '081234567890', 'Jl. Mawar No.12', 'Simpang Pasir', 'Samarinda', '1992-05-12', '6472031205920002', NULL, 'Baru', NULL, 1, '2025-11-23 06:58:02', '2025-11-23 06:58:02'),
(3, '6472035602345678', 'Ani Lestari', 'P', '081234567891', 'Jl. Melati Gg. 5', 'Handil Bakti', 'Samarinda', '1990-08-20', '6472032008900003', NULL, 'Baru', NULL, 1, '2025-11-23 06:58:02', '2025-11-23 06:58:02'),
(4, '6472035703456789', 'Rina Wati', 'P', '081234567892', 'Jl. Anggrek Rt.15', 'Rawa Makmur', 'Samarinda', '1994-11-03', '6472030311940004', NULL, 'Baru', NULL, 1, '2025-11-23 06:58:02', '2025-11-23 06:58:02'),
(5, '6472035804567890', 'Dewi Sartika', 'P', '081234567893', 'Jl. Kenanga No.8', 'Bukuan', 'Balikpapan', '1988-02-28', '6472032802880005', NULL, 'Baru', NULL, 1, '2025-11-23 06:58:02', '2025-11-23 06:58:02'),
(6, '6472035905678901', 'Lina Marlina', 'P', '081234567894', 'Jl. Flamboyan Rt.22', 'Bantuas', 'Samarinda', '1995-07-17', '6472031707950006', NULL, 'Baru', NULL, 1, '2025-11-23 06:58:02', '2025-11-23 06:58:02'),
(7, '6472036006789012', 'Yuli Astuti', 'P', '081234567895', 'Jl. Cempaka No.30', 'Simpang Pasir', 'Samarinda', '1991-09-09', '6472030909910007', NULL, 'Baru', NULL, 1, '2025-11-23 06:58:02', '2025-11-23 06:58:02'),
(8, '6472036107890123', 'Nina Kurnia', 'P', '081234567896', 'Jl. Dahlia Rt.10', 'Handil Bakti', 'Samarinda', '1993-12-25', '6472032512930008', NULL, 'Baru', NULL, 1, '2025-11-23 06:58:02', '2025-11-23 06:58:02'),
(9, '6472036208901234', 'Eka Putri', 'P', '081234567897', 'Jl. Teratai Gg.3', 'Rawa Makmur', 'Samarinda', '1989-04-14', '6472031404890009', NULL, 'Baru', NULL, 1, '2025-11-23 06:58:02', '2025-11-23 06:58:02'),
(10, '6472036309012345', 'Tia Rahayu', 'P', '081234567898', 'Jl. Seroja No.45', 'Bukuan', 'Samarinda', '1996-01-30', '6472033001960010', NULL, 'Baru', NULL, 1, '2025-11-23 06:58:02', '2025-11-23 06:58:02'),
(11, '6472036410123456', 'Mira Santika', 'P', '081234567899', 'Jl. Kamboja Rt.18', 'Bantuas', 'Samarinda', '1997-06-22', '6472032206970011', NULL, 'Baru', NULL, 1, '2025-11-23 06:58:02', '2025-11-23 06:58:02'),
(12, '6472021109050', 'Admin Ganteng', 'L', '089507323044', 'Jalan Daeng Mangkona, Citra 3', 'Simpang Pasir', 'Samarinda', '2005-09-11', '6472021109055', '1, 2, 5, 4, 8', 'Aktif', NULL, 1, '2025-11-23 08:33:46', '2026-03-27 09:39:12'),
(16, NULL, 'bidanAsli', NULL, '12332131221', NULL, NULL, NULL, NULL, NULL, NULL, 'Baru', NULL, 1, '2025-11-23 22:18:44', '2025-11-23 22:18:44'),
(17, '6472021109067', 'riosep', 'L', '0895360022327', NULL, 'Simpang Pasir', 'Samarinda', '2005-09-11', NULL, NULL, 'Baru', NULL, 1, '2026-03-15 14:01:54', '2026-03-15 14:05:52');

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
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `kegiatan_safari`
--
ALTER TABLE `kegiatan_safari`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `master_kontrasepsi`
--
ALTER TABLE `master_kontrasepsi`
  MODIFY `id` smallint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `pasangan_kb`
--
ALTER TABLE `pasangan_kb`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `password_reset_otp`
--
ALTER TABLE `password_reset_otp`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `pelayanan_kb`
--
ALTER TABLE `pelayanan_kb`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `pemeriksaan`
--
ALTER TABLE `pemeriksaan`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `peserta_safari`
--
ALTER TABLE `peserta_safari`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `riwayat_reproduksi`
--
ALTER TABLE `riwayat_reproduksi`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

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
