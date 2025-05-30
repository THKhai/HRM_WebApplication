using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ptudhttthd_web_hrm.Server.Models
{
    public class KinhNghiemLamViec
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string? ViTri { get; set; }
        public DateTime? NgayBatDau { get; set; }
        public DateTime? NgayKetThuc { get; set; }
        public int? ThoiGianLamViec { get; set; }
        public string? MoTaCongViec { get; set; }

        [Required]
        public string NhanVienID { get; set; }

        public NhanVien NhanVienSoHuu { get; set; }
    }
}
