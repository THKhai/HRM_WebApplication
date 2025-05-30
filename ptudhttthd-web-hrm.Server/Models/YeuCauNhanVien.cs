using ptudhttthd_web_hrm.Server.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class YeuCauNhanVien
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int IDYeuCau { get; set; }
    public DateTime? NgayGui { get; set; }
    public int? SoNgayYeuCau { get; set; }
    public DateTime? NgayBD { get; set; }
    public DateTime? NgayKT { get; set; }
    public string? LyDo { get; set; }
    public string? TinhTrang { get; set; }
    public string? LyDoTuChoi { get; set; }
    [Required]
    [ForeignKey("MaloaiYC")]
    public int? MaLoaiYC { get; set; }
    public LoaiYeuCau? IDYC { get; set; }
    [Required]
    [ForeignKey("NhanVienID")]
    public string? NhanVienID { get; set; }
    public NhanVien? NhanVien { get; set; }

    [Required]
    [ForeignKey("NhanVienQuanly")]
    public string? NhanVienQuanly { get; set; }
    public NhanVien? QuanLy { get; set; }
}