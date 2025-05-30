using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ptudhttthd_web_hrm.Server.Models
{
    [PrimaryKey(nameof(MaBang), nameof(TenBang))]
    public class BangCap
    {
        [Required]
        public string MaBang { get; set; }

        [Required]
        public string TenBang { get; set; }

        public DateTime? NgayCap { get; set; }
        public string? SDTDonViCap { get; set; }
        public string? DonViCap { get; set; }
        public string? HocVi { get; set; }
        public float? GPA { get; set; }
        public float? DTB { get; set; }

        [Required]
        public string NhanVienID { get; set; }

        public NhanVien NhanVienSoHuu { get; set; }
    }
}
