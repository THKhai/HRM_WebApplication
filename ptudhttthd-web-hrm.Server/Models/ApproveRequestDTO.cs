namespace ptudhttthd_web_hrm.Server.Models
{
    public class ApproveRequestsDTO
    {
        public List<int> RequestIds { get; set; }
        public string TinhTrang { get; set; } // "approve" hoặc "deny"
        public string LyDoTuChoi { get; set; }  
    }

}
