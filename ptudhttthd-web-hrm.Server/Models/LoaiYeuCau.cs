using ptudhttthd_web_hrm.Server.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
public class LoaiYeuCau
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]   
    public int id {  get; set; } 
    public string Ten { get; set; }
}

