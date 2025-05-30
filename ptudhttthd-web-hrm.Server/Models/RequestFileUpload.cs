namespace ptudhttthd_web_hrm.Server.Models
{
    public class RequestFileUpload
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string FileType { get; set; } 
        public long FileSize { get; set; }
        public DateTime UploadDate { get; set; }
        public int YeuCauNhanVienId { get; set; } 
        public YeuCauNhanVien YeuCauNhanVien { get; set; }
    }
}
