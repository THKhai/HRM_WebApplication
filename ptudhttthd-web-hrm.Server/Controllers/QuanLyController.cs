using System;
using System.Collections.Generic;
using System.IO.Compression;
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

// Controller quản lý
namespace ptudhttthd_web_hrm.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class QuanLyController : ControllerBase
    {
        private readonly NhanVienContext _context;

        public QuanLyController(NhanVienContext context)
        {
            _context = context;
        }

        // Lấy danh sách các nhân viên mà quản lý này phụ trách dựa theo ID của quản lý
        // GET: api/QuanLy/{id}/nhanviens
        [HttpGet("{id}/nhanviens")]
        [Authorize(Roles = "QuanLy")]
        public async Task<ActionResult<IEnumerable<object>>> GetDSNhanVienDuocQuanLy(string id)
        {
            var quanLy = await _context.NhanViens
                .Include(q => q.DSNhanVienDuocQuanLy)
                .FirstOrDefaultAsync(nv => nv.NhanVienID == id);

            if (quanLy == null)
            {
                return NotFound("Không tìm thấy thông tin của quản lý.");
            }

            return quanLy.DSNhanVienDuocQuanLy.Select(nv => new {
                nv.NhanVienID,
                nv.TenNhanVien,
                nv.GioiTinh
            }).ToList();
        }

        // Lấy thông tin của chính quản lý hiện tại
        // GET: api/QuanLy/info
        [HttpGet("info")]
        [Authorize(Roles = "QuanLy")]
        public async Task<ActionResult<object>> GetSelfInfo()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var quanLy = await _context.NhanViens
                .FirstOrDefaultAsync(nv => nv.NhanVienID == userIdClaim);

            if (quanLy == null)
            {
                return NotFound("Không tìm thấy thông tin của quản lý.");
            }

            return new
            {
                quanLy.NhanVienID,
                quanLy.TenNhanVien,
                quanLy.GioiTinh
            };
        }

        // Lấy thông tin chi tiết của một nhân viên được quản lý bởi quản lý hiện tại
        // GET: api/QuanLy/nhanvien/{id}
        [HttpGet("nhanvien/{id}")]
        [Authorize(Roles = "QuanLy")]
        public async Task<ActionResult<object>> GetInfoNhanVien(string id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var quanLy = await _context.NhanViens.FindAsync(userIdClaim);
            var nhanVien = await _context.NhanViens.FindAsync(id);

            if (quanLy == null || nhanVien == null)
            {
                return NotFound("Không tìm thấy thông tin nhân viên hoặc quản lý.");
            }

            if (nhanVien.QuanLyID != quanLy.NhanVienID)
            {
                return Unauthorized("Bạn không có quyền truy cập thông tin của nhân viên này.");
            }

            return new
            {
                nhanVien.NhanVienID,
                nhanVien.TenNhanVien,
                nhanVien.GioiTinh
            };
        }

        // duyệt yêu cầu được gửi tới
        //PUT: api/QuanLy/ApproveRequest
        [HttpPut("approveRequest")]
        [Authorize(Roles = "QuanLy")]
        public async Task<IActionResult> ApproveRequests([FromBody] ApproveRequestsDTO dto)
        {
            if (dto.RequestIds == null || dto.RequestIds.Count == 0)
            {
                return BadRequest("Không có yêu cầu được chọn");
            }

            var requests = await _context.YeuCauNhanViens
                .Where(r => dto.RequestIds.Contains(r.IDYeuCau))
                .ToListAsync();

            if (requests.Count == 0)
            {
                return NotFound("Không tìm thấy yêu cầu");
            }

            foreach (var request in requests)
            {
                request.TinhTrang = dto.TinhTrang;
                request.LyDoTuChoi = dto.LyDoTuChoi;
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật tình trạng yêu cầu thành công" });
        }

        [HttpGet("downloadFilesByRequest/{requestId}")]
        [Authorize(Roles = "QuanLy")]
        public async Task<IActionResult> DownloadFilesByRequest(int requestId)
        {
            // Query file đính kèm dựa trên requestID trong RequestFileUploads
            var files = await _context.RequestFileUploads
                .Where(file => file.YeuCauNhanVienId == requestId)
                .ToListAsync();

            if (files == null || !files.Any())
            {
                return NotFound($"Không tìm thấy tập tin đính kèm cho yêu cầu: {requestId}");
            }

            // Đặt tên file zip và lưu trữ tạm thời
            var zipFileName = $"Request_{requestId}_Files_{DateTime.Now:yyyyMMddHHmmss}.zip";
            var zipFilePath = Path.Combine(Path.GetTempPath(), zipFileName);

            // Nén các file đính kèm của request thành 1 file zip
            try
            {
                // Tạo file zip gồm các file đính kèm
                using (var zipStream = new FileStream(zipFilePath, FileMode.Create, FileAccess.Write))
                {
                    using (var archive = new ZipArchive(zipStream, ZipArchiveMode.Create, true))
                    {
                        foreach (var file in files)
                        {
                            if (System.IO.File.Exists(file.FilePath))
                            {
                                var fileName = Path.GetFileName(file.FilePath);
                                archive.CreateEntryFromFile(file.FilePath, fileName);
                            }
                        }
                    }
                }

                // Cho phép người dùng donwload file zip
                var zipBytes = System.IO.File.ReadAllBytes(zipFilePath);
                return File(zipBytes, "application/zip", zipFileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Có lỗi xảy ra trong quá trình nén tập tin: {ex.Message}");
            }
            finally
            {
                if (System.IO.File.Exists(zipFilePath))
                {
                    System.IO.File.Delete(zipFilePath);
                }
            }
        }
    }
}
