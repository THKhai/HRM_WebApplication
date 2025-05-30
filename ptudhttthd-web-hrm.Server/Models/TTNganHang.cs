using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ptudhttthd_web_hrm.Server.Models
{
    [PrimaryKey(nameof(STKNganHang), nameof(TenNganHang), nameof(ChiNhanh))]
    public class TTNganHang
    {
        [Required]
        public string STKNganHang { get; set; }

        [Required]
        public string TenNganHang { get; set; }

        [Required]
        public string ChiNhanh { get; set; }

        public bool Active { get; set; } = false;

        public string NhanVienID { get; set; }

        public NhanVien NhanVienSoHuu { get; set; }
    }
}
