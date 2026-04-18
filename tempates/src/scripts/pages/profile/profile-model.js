import API_BASE_URL from "../../services/api-config";
import authService from "../../services/auth-service";

export default class ProfileModel {
  constructor() {
    this.apiUrl = "/api/profile"; // Adjust based on your API endpoint
  }

  async getDashboardData() {
      const token = authService.getToken();
      const response = await fetch(`${API_BASE_URL}/dashboard/user`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          },
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
  }

  async getProfileData() {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.message);

      const data = result.data;
      const userProfile = data.user_profile || {};
      const pasanganKB = data.pasangan_kb || {};
      const asuransi = data.asuransi || {};
      const riwayatReproduksi = data.riwayat_reproduksi || {};
      const kontrasepsiAktif = data.kontrasepsi_aktif || {};

      // Map tahapan KB from database to form values
      const tahapanKBMap = {
        "pra_kb": "Pra-KB",
        "sedang_kb": "Sedang",
        "pasca_kb": "Pasca"
      };

      // Helper function to format date to yyyy-MM-dd
      const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      // Map database fields to form fields
      return {
        // User Profile
        nama_lengkap: userProfile.nama_lengkap || "",
        nik: userProfile.nik || "",
        no_kk: userProfile.no_kk || "",
        jenis_kelamin: userProfile.jenis_kelamin || "",
        tempat_lahir: userProfile.tempat_lahir || "",
        tanggal_lahir: formatDate(userProfile.tanggal_lahir),
        no_hp: userProfile.no_hp || "",
        alamat: userProfile.alamat || "",
        kecamatan: userProfile.kecamatan || "",
        jenis_akseptor: userProfile.jenis_akseptor || "Baru",

        // Asuransi
        asuransi: asuransi.jenis_asuransi || "",
        no_bpjs: asuransi.no_bpjs || "",
        jenis_kepesertaan: asuransi.jenis_kepesertaan || "",
        faskes: asuransi.faskes_tk1 || "",

        // Riwayat Reproduksi
        sakit_kuning: riwayatReproduksi.penyakit_kuning ? "ya" : "tidak",
        keputihan: riwayatReproduksi.keputihan ? "ya" : "tidak",
        tumor: riwayatReproduksi.tumor_ginekologi ? "Ada" : "Tidak Ada",
        penyakit_menular: riwayatReproduksi.pms ? "Ada" : "Tidak Ada",
        gravida: riwayatReproduksi.gravida || 0,
        partus: riwayatReproduksi.partus || 0,
        abortus: riwayatReproduksi.abortus || 0,

        // User preference
        kontrasepsi_yang_diinginkan: userProfile.kontrasepsi_yang_diinginkan || "",
        nama_suami: pasanganKB.nama_pasangan || "",
        nik_pasangan: pasanganKB.nik_pasangan || "",
        no_hp_pasangan: pasanganKB.no_hp_pasangan || "",
        tempat_lahir_pasangan: pasanganKB.tempat_lahir_pasangan || "",
        tanggal_lahir_pasangan: formatDate(pasanganKB.tanggal_lahir_pasangan),
        pendidikan_suami: pasanganKB.pendidikan || "",
        pekerjaan_suami: pasanganKB.pekerjaan || "",
        anak_laki: pasanganKB.jumlah_anak_laki || 0,
        anak_perempuan: pasanganKB.jumlah_anak_perempuan || 0,
        usia_anak_terkecil: pasanganKB.usia_anak_terakhir || "",
        status_pernikahan: pasanganKB.status_pernikahan || "",
        tahapan_kb: tahapanKBMap[pasanganKB.tahapan_kb] || pasanganKB.tahapan_kb || "",
        cara_kb: kontrasepsiAktif.nama_kontrasepsi || "Tidak Ada",
      };
    } catch (error) {      console.error("Get profile data error:", error);
      // Return empty structure on error
      return {
        nama_lengkap: "",
        nik: "",
        no_kk: "",
        jenis_kelamin: "",
        tempat_lahir: "",
        tanggal_lahir: "",
        no_hp: "",
        alamat: "",
        kecamatan: "",
        asuransi: "",
        no_bpjs: "",
        jenis_kepesertaan: "",
        faskes: "",
        sakit_kuning: "tidak",
        keputihan: "tidak",
        tumor: "Tidak Ada",
        penyakit_menular: "Tidak Ada",
        gravida: 0,
        partus: 0,
        abortus: 0,
        nama_suami: "",
        nik_pasangan: "",
        no_hp_pasangan: "",
        tempat_lahir_pasangan: "",
        tanggal_lahir_pasangan: "",
        pendidikan_suami: "",
        pekerjaan_suami: "",
        anak_laki: 0,
        anak_perempuan: 0,
        usia_anak_terkecil: "",
        tahapan_kb: "",
        cara_kb: "Tidak Ada",
        kontrasepsi_yang_diinginkan: "",
        jenis_akseptor: "Baru",
      };
    }
  }

  async getKontrasepsiList() {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_BASE_URL}/safari/form-session/kontrasepsi`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      const result = await response.json();
      return result.success ? result.data.kontrasepsi : [];
    } catch {
      return [];
    }
  }

  async updateProfile(profileData) {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Update profile error:", error);
      return {
        success: false,
        message: "Terjadi kesalahan saat memperbarui profil",
      };
    }
  }
}
