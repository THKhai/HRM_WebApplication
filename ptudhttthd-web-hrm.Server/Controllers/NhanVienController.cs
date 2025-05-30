using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ptudhttthd_web_hrm.Server.Data;
using ptudhttthd_web_hrm.Server.Models;
using ptudhttthd_web_hrm.Server.Services;

// Controller nhân viên
namespace ptudhttthd_web_hrm.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)] 
    public class NhanVienController : ControllerBase
    {
        private readonly NhanVienContext _context;

        public NhanVienController(NhanVienContext context)
        {
            _context = context;
        }

        // Cho phép nhân viên quản lý được lấy danh sách nhân viên mà mình quản lý
        // GET: api/NhanVien
        [HttpGet]
        [Authorize(Roles = "QuanLy")]
        public async Task<ActionResult<IEnumerable<NhanVien>>> GetDSNhanVienDuocQuanLy()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var nv = await _context.NhanViens.FindAsync(userIdClaim);
            return nv.DSNhanVienDuocQuanLy.ToList<NhanVien>();
        }

        // Cho phép nhân viên thường xem thông tin của bản thân
        // GET: api/NhanVien/info
        [HttpGet("info")]
        [Authorize(Roles = "Thuong, QuanLy")]
        public async Task<ActionResult<NhanVien>> GetSelfInfo()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var nhanVien = await _context.NhanViens
                .Include(nv => nv.DSBangCap)
                .Include(nv => nv.DSTaiKhoanNganHang)
                .Include(nv => nv.DSKinhNghiemLamViec)
                .FirstOrDefaultAsync(nv => nv.NhanVienID == userIdClaim);

            if (nhanVien == null)
            {
                return NotFound();
            }

            return nhanVien;
        }

        // Cho phép nhân viên quản lý xem thông tin nhân viên mà mình quản lý
        // GET: api/NhanVien/5
        [HttpGet("{id}")]
        [Authorize(Roles = "QuanLy")]
        public async Task<ActionResult<NhanVien>> GetInfoNhanVien(string id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var query_user = await _context.NhanViens.FindAsync(userIdClaim);
            var nv = await _context.NhanViens.FindAsync(id);

            if (nv.QuanLyID != query_user.NhanVienID){
                return Unauthorized("Không được xem thông tin mà mình không quản lý");
            }

            return nv;
        }

        [HttpPut("edit")]
        [Authorize(Roles ="QuanLy, Thuong")]
        public async Task<ActionResult> EditSelfInfo([FromBody] EditInforNhanVienDTO? nhanVienRequest)
        {
            if (nhanVienRequest == null)
            {
                return BadRequest("Yêu cầu không hợp lệ.");
            }

            // Lấy ID nhân viên từ token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Không xác định được thông tin người dùng.");
            }

            // Tìm nhân viên trong database
            var nhanVien = await _context.NhanViens.FindAsync(userIdClaim);
            
            if (nhanVien == null)
            {
                return NotFound("Không tìm thấy thông tin nhân viên.");
            }

            // Cập nhật thông tin
            nhanVien.NgaySinh = nhanVienRequest.NgaySinh ?? nhanVien.NgaySinh;
            nhanVien.GioiTinh = nhanVienRequest.GioiTinh?.Trim() ?? nhanVien.GioiTinh;
            nhanVien.DiaChiThuongTru = nhanVienRequest.DiaChiThuongTru?.Trim() ?? nhanVien.DiaChiThuongTru;
            nhanVien.NoiOHienTai = nhanVienRequest.NoiOHienTai?.Trim() ?? nhanVien.NoiOHienTai;
            nhanVien.SDT = nhanVienRequest.SDT?.Trim() ?? nhanVien.SDT;
            nhanVien.SDTNguoiThan = nhanVienRequest.SDTNguoiThan?.Trim() ?? nhanVien.SDTNguoiThan;
            nhanVien.MaSoThue = nhanVienRequest.MaSoThue?.Trim() ?? nhanVien.MaSoThue;
            nhanVien.CCCD = nhanVienRequest.CCCD?.Trim() ?? nhanVien.CCCD;
            nhanVien.NgayHetHanCCCD = nhanVienRequest.NgayHetHanCCCD ?? nhanVien.NgayHetHanCCCD;
            nhanVien.LinkHinh = nhanVienRequest.LinkHinh?.Trim() ?? nhanVien.LinkHinh;

           
            // Đánh dấu thực thể đã thay đổi
            _context.Entry(nhanVien).State = EntityState.Modified;

            try
            {
                // Lưu thay đổi vào cơ sở dữ liệu
                await _context.SaveChangesAsync();
                return Ok(new { Message = "Thông tin cá nhân đã được cập nhật.", NhanVien = nhanVien });
            }
            catch(DbUpdateException ex)
{
                if (ex.InnerException != null)
                {
                    var innerMessage = ex.InnerException.Message;
                    // Ghi log lỗi chi tiết
                    Console.WriteLine("Inner exception: " + innerMessage);
                    return StatusCode(StatusCodes.Status500InternalServerError, "Lỗi cơ sở dữ liệu: " + innerMessage);
                }
                else
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "Lỗi cơ sở dữ liệu: " + ex.Message);
                }
            }

            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Cập nhật không thành công: " + ex.Message);
            }
        }

        // Cho phép nhân viên tải ảnh đại diện
        // POST: api/NhanVien/uploadAvatar
        [HttpPost("uploadAvatar")]
        [Authorize(Roles = "Thuong, QuanLy")]
        public async Task<ActionResult> UploadAvatar(IFormFile pfpfile)
        {
            // Lấy ID nhân viên từ token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Không xác định được thông tin người dùng.");
            }

            var user = await _context.NhanViens.FindAsync(userIdClaim);

            if (user == null)
            {
                return NotFound();
            }

            // Kiểm tra file ảnh có hợp lệ không
            if (pfpfile == null || pfpfile.Length <= 0)
            {
                return BadRequest("Ảnh không hợp lệ.");
            }

            var baseFileName = $"{user.NhanVienID}";
            var fileExtension = Path.GetExtension(pfpfile.FileName);
            var fileName = baseFileName + fileExtension;
            var filePath = Path.Combine("Uploads", "avatar", fileName);

            // Kiểm tra xem tên file ảnh tồn tại hay chưa
            var existingFilePath = Directory.GetFiles(Path.Combine("Uploads", "avatar"))
                                            .FirstOrDefault(f => Path.GetFileNameWithoutExtension(f) == baseFileName);

            // Nếu tên file ảnh đã tồn tại thì xóa file cũ
            if (existingFilePath != null)
            {
                System.IO.File.Delete(existingFilePath);
            }

            // Lưu file ảnh mới vào thư mục Uploads/avatar
            try
            {
                using (var stream = new FileStream(filePath, FileMode.Create, FileAccess.Write, FileShare.None))
                {
                    await pfpfile.CopyToAsync(stream);
                }
            }
            catch (IOException ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Lỗi khi lưu ảnh mới: " + ex.Message);
            }

            // Cập nhật đường dẫn ảnh mới vào cơ sở dữ liệu của nhân viên
            var uniqueQuery = $"?t={DateTime.UtcNow.Ticks}";
            var imageUrl = $"https://localhost:7050/uploads/avatar/{fileName}{uniqueQuery}";
            user.LinkHinh = imageUrl;
            _context.NhanViens.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { imageUrl });
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Lỗi cơ sở dữ liệu: " + ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Tải ảnh không thành công: " + ex.Message);
            }
        }

        // Cho phép nhân viên gửi yêu cầu tới nhân viên quản lý
        // POST: api/NhanVien/request 
        [HttpPost("request")]
        [Authorize(Roles = "Thuong")]
        public async Task<ActionResult> SendRequest([FromForm] SendRequestDTO request)
        {
            if (request == null)
            {
                return BadRequest("Yêu cầu không hợp lệ.");
            }

            // Lấy ID nhân viên từ token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Không xác định được thông tin người dùng.");
            }

            var user = await _context.NhanViens.FindAsync(userIdClaim);

            if (user == null)
            {
                return NotFound();
            }

            // Kiểm tra thỏa ngày BD < ngày KT
            if (request.NgayBD > request.NgayKT)
            {
                return BadRequest("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.");
            }

            // Tạo yêu cầu nhân viên
            var newRequest = new YeuCauNhanVien
            {
                NhanVienID = userIdClaim,
                NhanVienQuanly = user.QuanLyID,
                MaLoaiYC = request.MaLoaiYC,
                NgayGui = DateTime.Now,
                NgayBD = request.NgayBD,
                NgayKT = request.NgayKT,
                SoNgayYeuCau = request.SoNgayYeuCau,
                LyDo = request.LyDo,
                TinhTrang = "pending"
            };

            // Tạo và lưu yêu cầu vào cơ sở dữ liệu bảng YeuCauNhanViens
            try
            {
                await _context.YeuCauNhanViens.AddAsync(newRequest);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException != null)
                {
                    var innerMessage = ex.InnerException.Message;
                    // Ghi log lỗi chi tiết
                    Console.WriteLine("Inner exception: " + innerMessage);
                    return StatusCode(StatusCodes.Status500InternalServerError, "Lỗi cơ sở dữ liệu: " + innerMessage);
                }
                else
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "Lỗi cơ sở dữ liệu: " + ex.Message);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Không thể gửi yêu cầu: " + ex.Message);
            }

            // Lưu file đính kèm nếu có
            if (request.Files != null && request.Files.Count > 0)
            {
                foreach (var file in request.Files)
                {
                    if (file.Length > 0)
                    {
                        var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
                        var filePath = Path.Combine("Uploads", "request", uniqueFileName);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }

                        // Tạo metadata cho file đính kèm
                        var fileUpload = new RequestFileUpload
                        {
                            FileName = file.FileName,
                            FilePath = filePath,
                            FileType = file.ContentType,
                            FileSize = file.Length,
                            UploadDate = DateTime.Now,
                            YeuCauNhanVienId = newRequest.IDYeuCau, // Mã yêu cầu nhân viên
                        };

                        // Thêm file đính kèm vào cơ sở dữ liệu bảng RequestFileUploads
                        await _context.RequestFileUploads.AddAsync(fileUpload);
                    }
                }
            }

            try
            {
                // Lưu thay đổi cơ sở dữ liệu sau khi thêm file đính kèm
                await _context.SaveChangesAsync();
                return Ok(new { Message = "Yêu cầu đã được gửi đi thành công." });
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException != null)
                {
                    var innerMessage = ex.InnerException.Message;
                    // Ghi log lỗi chi tiết
                    Console.WriteLine("Inner exception: " + innerMessage);
                    return StatusCode(StatusCodes.Status500InternalServerError, "Lỗi cơ sở dữ liệu: " + innerMessage);
                }
                else
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "Lỗi cơ sở dữ liệu: " + ex.Message);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Không thể gửi yêu cầu: " + ex.Message);
            }
        }

        // Lấy danh sách yêu cầu của nhân viên
        // GET: api/NhanVien/requestList
        [HttpGet("requestlist")]
        [Authorize (Roles = "Thuong, QuanLy")]
        public async  Task<ActionResult<YeuCauNhanVien>> GetRequestList()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRoleClaim = User.FindFirst(ClaimTypes.Role)?.Value;


            switch (userRoleClaim)
            {
                case "Thuong":
                    return Ok(await _context.YeuCauNhanViens
                        .Where(yc => yc.NhanVienID == userIdClaim)
                        .Include(yc => yc.IDYC)
                        .Select(yc => new
                        {
                            yc.IDYeuCau,
                            yc.NgayGui,
                            yc.SoNgayYeuCau,
                            yc.NgayBD,
                            yc.NgayKT,
                            yc.LyDo,
                            yc.TinhTrang,
                            yc.MaLoaiYC,
                            yc.LyDoTuChoi,
                            LoaiYeuCau = yc.IDYC.Ten
                        })
                        .OrderByDescending(yc => yc.NgayGui)
                        .ToListAsync());

                case "QuanLy":
                    return Ok(await _context.YeuCauNhanViens
                        .Where(yc => yc.NhanVienQuanly == userIdClaim && yc.TinhTrang == "pending")
                        .Include(yc => yc.IDYC)
                        .Include(yc => yc.NhanVien)
                        .Select(yc => new
                        {
                            yc.IDYeuCau,
                            yc.NgayGui,
                            yc.SoNgayYeuCau,
                            yc.NgayBD,
                            yc.NgayKT,
                            yc.LyDo,
                            yc.TinhTrang,
                            yc.MaLoaiYC,
                            yc.LyDoTuChoi,
                            LoaiYeuCau = yc.IDYC.Ten,
                            NhanVien = yc.NhanVien.TenNhanVien
                        })
                        .OrderByDescending(yc => yc.NgayGui)
                        .ToListAsync());

                default:
                    return NotFound();
            }
        }
    }   
}
