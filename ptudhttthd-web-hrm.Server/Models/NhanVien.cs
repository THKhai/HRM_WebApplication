using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ptudhttthd_web_hrm.Server.Models
{
    // Đối tượng nhân viên
    public class NhanVien
    {
        [Key]
        [Required]
        public string NhanVienID { get; set; }

        [Required]
        public string TenDangNhap { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string[] VaiTro { get; set; }

        public string? TenNhanVien { get; set; }
        public DateTime? NgaySinh { get; set; }
        public string? GioiTinh { get; set; }
        public string? DiaChiThuongTru { get; set; }
        public string? NoiOHienTai { get; set; }
        public string? SDT { get; set; }
        public string? SDTNguoiThan { get; set; }
        public DateTime? NgayBatDauLamViec { get; set; }
        public int DiemThuong { get; set; } = 0;
        public string? MaSoThue { get; set; }
        public string? CCCD { get; set; }
        public int? SoNgayNghiCoPhepConLai { get; set; }
        public int? SoNgayNghiKhongPhep { get; set; }
        public int? LuongCoBan { get; set; }
        public DateTime? NgayHetHanCCCD { get; set; }
        public int? TienPhat { get; set; }
        public string? LinkHinh { get; set; }
        public string? QuanLyID { get; set; }

        public ICollection<KinhNghiemLamViec>? DSKinhNghiemLamViec { get; set; }
        public ICollection<BangCap>? DSBangCap { get; set; }
        public ICollection<TTNganHang>? DSTaiKhoanNganHang { get; set; }

        [ForeignKey("QuanLyID")]
        public NhanVien? NhanVienQuanLy { get; set; }
        public ICollection<NhanVien>? DSNhanVienDuocQuanLy { get; set; }
    }
}

