namespace ptudhttthd_web_hrm.Server.Models
{
    public class SendRequestDTO
    {
        public int? MaLoaiYC { get; set; }
        public DateTime? NgayGui { get; set; }
        public int? SoNgayYeuCau { get; set; }
        public DateTime? NgayBD { get; set; }
        public DateTime? NgayKT { get; set; }
        public string? LyDo { get; set; }
        public string? NhanVienID { get; set; }
        public string? NhanVienQuanly { get; set; }
        public string? TinhTrang { get; set; }
        public List<IFormFile>? Files { get; set; }
    }

}
