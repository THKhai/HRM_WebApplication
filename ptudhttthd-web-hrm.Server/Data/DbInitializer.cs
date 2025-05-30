using Microsoft.AspNetCore.Identity;
using ptudhttthd_web_hrm.Server.Models;
using System.Net.WebSockets;

namespace ptudhttthd_web_hrm.Server.Data
{
    public class DbInitializer
    {
        public static async Task Initialize(NhanVienContext context, UserManager<IdentityUser> userManager, ILogger<DbInitializer> logger)
        {
            try
            {
                context.Database.EnsureCreated();

                if (context.NhanViens.Any())
                {
                    logger.LogInformation("Bảng nhân viên đã có dữ liệu");
                    return;
                }

                // Tạo quản lý 
                var manager = new NhanVien
                {
                    TenDangNhap = "user1",
                    Email = "user1@example.com",
                    VaiTro = new[] { "QuanLy" },
                    TenNhanVien = "Nguyễn Văn A",
                    GioiTinh = "Nam",
                    NgaySinh = new DateTime(2003, 9, 12),
                    DiaChiThuongTru = "227 Nguyễn Văn Cừ, Phường 4, Quận 5, Thành phố Hồ Chí Minh",
                    NoiOHienTai = "227 Nguyễn Văn Cừ, Phường 4, Quận 5, Thành phố Hồ Chí Minh",
                    SDT = "0123456789",
                    SDTNguoiThan = "0987654321",
                    NgayBatDauLamViec = new DateTime(2020, 01, 01),
                    CCCD = "012345678910",
                    NgayHetHanCCCD = new DateTime(2025, 05, 31),
                    TienPhat = 100000,
                    MaSoThue = "0123456789",
                    SoNgayNghiCoPhepConLai = 12,
                    SoNgayNghiKhongPhep = 0,
                    LuongCoBan = 10000000,
                    DiemThuong = 100,
                };

                var identityUserManager = new IdentityUser
                {
                    UserName = manager.TenDangNhap,
                    Email = manager.Email,
                };

                var createUserResultManager = await userManager.CreateAsync(identityUserManager, "123456");
                if (createUserResultManager.Succeeded)
                {
                    logger.LogInformation($"User {identityUserManager.UserName} tạo thành công.");

                    var addRoleResult = await userManager.AddToRolesAsync(identityUserManager, manager.VaiTro);
                    if (addRoleResult.Succeeded)
                    {
                        manager.NhanVienID = identityUserManager.Id;
                        await context.NhanViens.AddAsync(manager);

                        // Thông tin ngân hàng 1
                        var ttnhManager1 = new TTNganHang
                        {
                            NhanVienID = manager.NhanVienID,
                            STKNganHang = "12123456789",
                            TenNganHang = "MBBank",
                            ChiNhanh = "PGD Hàm Nghi",
                            Active = true,
                        };

                        // Thông tin ngân hàng 2
                        var ttnhManager2 = new TTNganHang
                        {
                            NhanVienID = manager.NhanVienID,
                            STKNganHang = "12123456788",
                            TenNganHang = "Vietcombank",
                            ChiNhanh = "PGD Tân Định",
                            Active = false,
                        };

                        // Bằng cấp 1
                        var bangCapManager1 = new BangCap
                        {
                            NhanVienID = manager.NhanVienID,
                            MaBang = "CNFIT12A58",
                            TenBang = "Cử nhân Trường Đại học Khoa học Tự nhiên",
                            NgayCap = new DateTime(2020, 12, 08),
                            DonViCap = "Phòng đào tạo",
                            HocVi = "Cử nhân",
                            GPA = 3.2f,
                            DTB = 8.0f,
                        };

                        // Bằng cấp 2
                        var bangCapManager2 = new BangCap
                        {
                            NhanVienID = manager.NhanVienID,
                            MaBang = "THSIT13B59",
                            TenBang = "Thạc sĩ Công nghệ thông tin",
                            NgayCap = new DateTime(2022, 05, 15),
                            DonViCap = "Phòng đào tạo Sau đại học",
                            HocVi = "Thạc sĩ",
                            GPA = 3.7f,
                            DTB = 9.0f,
                        };

                        // Kinh nghiệm làm việc 1
                        var kinhNghiemManager1 = new KinhNghiemLamViec
                        {
                            NhanVienID = manager.NhanVienID,
                            ViTri = "Software Engineer tại công ty ABC Corp",
                            NgayBatDau = new DateTime(2020, 01, 01),
                            NgayKetThuc = new DateTime(2020, 06, 01),
                            ThoiGianLamViec = 6,
                            MoTaCongViec = "Phát triển ứng dụng Web"
                        };

                        // Kinh nghiệm làm việc 2
                        var kinhNghiemManager2 = new KinhNghiemLamViec
                        {
                            NhanVienID = manager.NhanVienID,
                            ViTri = "Senior Developer tại công ty DEF Ltd",
                            NgayBatDau = new DateTime(2020, 07, 01),
                            NgayKetThuc = new DateTime(2021, 12, 31),
                            ThoiGianLamViec = 18,
                            MoTaCongViec = "Dẫn dắt nhóm phát triển phần mềm"
                        };
                        await context.TTNganHangs.AddRangeAsync(ttnhManager1, ttnhManager2);
                        await context.BangCaps.AddRangeAsync(bangCapManager1, bangCapManager2);
                        await context.KinhNghiemLamViecs.AddRangeAsync(kinhNghiemManager1, kinhNghiemManager2);
                    }
                    else
                    {
                        logger.LogWarning($"Lỗi khi thêm vai trò cho user {identityUserManager.UserName}.");
                        foreach (var error in addRoleResult.Errors)
                        {
                            logger.LogError($"Lỗi: {error.Code} - {error.Description}");
                        }
                    }
                }
                else
                {
                    logger.LogWarning($"Lỗi khi tạo user {identityUserManager.UserName}.");
                    foreach (var error in createUserResultManager.Errors)
                    {
                        logger.LogError($"Lỗi: {error.Code} - {error.Description}");
                    }
                }

                // Tạo nhân viên được quản lý 
                var employee = new NhanVien
                {
                    TenDangNhap = "user2",
                    Email = "user2@example.com",
                    VaiTro = new[] { "Thuong" },
                    TenNhanVien = "Nguyễn Văn B",
                    GioiTinh = "Nam",
                    NgaySinh = new DateTime(2003, 9, 13),
                    DiaChiThuongTru = "228 Nguyễn Văn Cừ, Phường 4, Quận 5, Thành phố Hồ Chí Minh",
                    NoiOHienTai = "228 Nguyễn Văn Cừ, Phường 4, Quận 5, Thành phố Hồ Chí Minh",
                    SDT = "0123456790",
                    SDTNguoiThan = "0987654322",
                    NgayBatDauLamViec = new DateTime(2020, 02, 01),
                    CCCD = "012345678911",
                    NgayHetHanCCCD = new DateTime(2025, 06, 30),
                    TienPhat = 100000,
                    MaSoThue = "0123456790",
                    SoNgayNghiCoPhepConLai = 12,
                    SoNgayNghiKhongPhep = 0,
                    LuongCoBan = 10000000,
                    DiemThuong = 100,
                    QuanLyID = manager.NhanVienID,
                };

                var identityUserEmployee = new IdentityUser
                {
                    UserName = employee.TenDangNhap,
                    Email = employee.Email,
                };

                var createUserResultEmployee = await userManager.CreateAsync(identityUserEmployee, "123456");
                if (createUserResultEmployee.Succeeded)
                {
                    logger.LogInformation($"User {identityUserEmployee.UserName} tạo thành công.");

                    var addRoleResult = await userManager.AddToRolesAsync(identityUserEmployee, employee.VaiTro);
                    if (addRoleResult.Succeeded)
                    {
                        employee.NhanVienID = identityUserEmployee.Id;
                        await context.NhanViens.AddAsync(employee);

                        var ttnhEmployee = new TTNganHang
                        {
                            NhanVienID = employee.NhanVienID,
                            STKNganHang = "12123456790",
                            TenNganHang = "Vietcombank",
                            ChiNhanh = "PGD Nguyễn Huệ",
                            Active = true,
                        };

                        var bangCapEmployee = new BangCap
                        {
                            NhanVienID = employee.NhanVienID,
                            MaBang = "CNFIT12A59",
                            TenBang = "Cử nhân Trường Đại học Bách Khoa",
                            NgayCap = new DateTime(2020, 12, 09),
                            DonViCap = "Phòng đào tạo",
                            HocVi = "Kỹ sư",
                            GPA = 3.5f,
                            DTB = 8.5f,
                        };

                        var kinhNghiemEmployee = new KinhNghiemLamViec
                        {
                            NhanVienID = employee.NhanVienID,
                            ViTri = "Intern tại công ty XYZ Ltd",
                            NgayBatDau = new DateTime(2020, 07, 01),
                            NgayKetThuc = new DateTime(2020, 12, 01),
                            ThoiGianLamViec = 6,
                            MoTaCongViec = "Hỗ trợ phát triển ứng dụng di động"
                        };
                        var YeuCauNhanVien = new List<YeuCauNhanVien>
                        {
                            new YeuCauNhanVien
                            {

                                NgayGui = DateTime.Now,
                                NgayBD = DateTime.Now.AddDays(1),
                                NgayKT = DateTime.Now.AddDays(2),
                                SoNgayYeuCau = 1,
                                LyDo = "Lý do số 1",
                                TinhTrang = "pending",
                                MaLoaiYC = 1,
                                NhanVienID = employee.NhanVienID,
                                NhanVienQuanly = manager.NhanVienID
                            },
                            new YeuCauNhanVien
                            {
                                NgayGui = DateTime.Now.AddDays(-2),
                                NgayBD = DateTime.Now.AddDays(2),
                                NgayKT = DateTime.Now.AddDays(3),
                                SoNgayYeuCau = 2,
                                LyDo = "Lý do số 2",
                                TinhTrang = "deny",
                                LyDoTuChoi = "Lý do từ chối 1",
                                MaLoaiYC = 3,
                                NhanVienID = employee.NhanVienID,
                                NhanVienQuanly = manager.NhanVienID
                            },
                             new YeuCauNhanVien
                            {
                                NgayGui = DateTime.Now.AddDays(-10),
                                NgayBD = DateTime.Now.AddDays(2),
                                NgayKT = DateTime.Now.AddDays(3),
                                SoNgayYeuCau = 2,
                                LyDo = "Lý do số 3",
                                TinhTrang = "approve",
                                MaLoaiYC = 2,
                                NhanVienID = employee.NhanVienID,
                                NhanVienQuanly = manager.NhanVienID
                            }

                        };
                        await context.YeuCauNhanViens.AddRangeAsync(YeuCauNhanVien);
                        await context.TTNganHangs.AddAsync(ttnhEmployee);
                        await context.BangCaps.AddAsync(bangCapEmployee);
                        await context.KinhNghiemLamViecs.AddAsync(kinhNghiemEmployee);
                    }
                    else
                    {
                        logger.LogWarning($"Lỗi khi thêm vai trò cho user {identityUserEmployee.UserName}.");
                        foreach (var error in addRoleResult.Errors)
                        {
                            logger.LogError($"Lỗi: {error.Code} - {error.Description}");
                        }
                    }
                }
                else
                {
                    logger.LogWarning($"Lỗi khi tạo user {identityUserEmployee.UserName}.");
                    foreach (var error in createUserResultEmployee.Errors)
                    {
                        logger.LogError($"Lỗi: {error.Code} - {error.Description}");
                    }
                }
                // Tạo nhân viên không được quản lý 
                var employee_KQL = new NhanVien
                {
                    TenDangNhap = "user3",
                    Email = "user3@example.com",
                    VaiTro = new[] { "Thuong" },
                    TenNhanVien = "Nguyễn Văn C",
                    GioiTinh = "Nữ",
                    NgaySinh = new DateTime(2003, 9, 15),
                    DiaChiThuongTru = "230 Nguyễn Văn Cừ, Phường 4, Quận 5, Thành phố Hồ Chí Minh",
                    NoiOHienTai = "230 Nguyễn Văn Cừ, Phường 4, Quận 5, Thành phố Hồ Chí Minh",
                    SDT = "098765431",
                    SDTNguoiThan = "098732132",
                    NgayBatDauLamViec = new DateTime(2020, 02, 10),
                    CCCD = "012345678911",
                    NgayHetHanCCCD = new DateTime(2025, 06, 20),
                    TienPhat = 100000,
                    MaSoThue = "0123456731",
                    SoNgayNghiCoPhepConLai = 2,
                    SoNgayNghiKhongPhep = 1,
                    LuongCoBan = 15000000,
                    DiemThuong = 120,
                    QuanLyID = manager.NhanVienID,
                };

                var identityUserEmployee_KQL = new IdentityUser
                {
                    UserName = employee_KQL.TenDangNhap,
                    Email = employee_KQL.Email,
                };

                var createUserResultEmployee_KQL = await userManager.CreateAsync(identityUserEmployee_KQL, "123456");
                if (createUserResultEmployee_KQL.Succeeded)
                {
                    logger.LogInformation($"User {identityUserEmployee_KQL.UserName} tạo thành công.");

                    var addRoleResult_KQL = await userManager.AddToRolesAsync(identityUserEmployee_KQL, employee_KQL.VaiTro);
                    if (addRoleResult_KQL.Succeeded)
                    {
                        employee_KQL.NhanVienID = identityUserEmployee_KQL.Id;
                        await context.NhanViens.AddAsync(employee_KQL);

                        var ttnhEmployee_KQL = new TTNganHang
                        {
                            NhanVienID = employee_KQL.NhanVienID,
                            STKNganHang = "121212121212",
                            TenNganHang = "BIDV",
                            ChiNhanh = "PGD Thành Thái",
                            Active = true,
                        };

                        var bangCapEmployee_KQL = new BangCap
                        {
                            NhanVienID = employee_KQL.NhanVienID,
                            MaBang = "CNFIT64562",
                            TenBang = "Thạc Sĩ Trường Đại học Bách Khoa",
                            NgayCap = new DateTime(2020, 12, 10),
                            DonViCap = "Phòng đào tạo",
                            HocVi = "Kỹ sư dữ liệu",
                            GPA = 3.8f,
                            DTB = 9f,
                        };

                        var kinhNghiemEmployee_KQL = new KinhNghiemLamViec
                        {
                            NhanVienID = employee_KQL.NhanVienID,
                            ViTri = "Công ty XYZ Ltd",
                            NgayBatDau = new DateTime(2020, 07, 01),
                            NgayKetThuc = new DateTime(2020, 12, 01),
                            ThoiGianLamViec = 6,
                            MoTaCongViec = "Phát triển ứng dụng di động"
                        };
                        var YeuCauNhanVien = new List<YeuCauNhanVien>
                        {
                            new YeuCauNhanVien
                            {

                                NgayGui = DateTime.Now,
                                NgayBD = DateTime.Now.AddDays(1),
                                NgayKT = DateTime.Now.AddDays(2),
                                SoNgayYeuCau = 1,
                                LyDo = "Lý do số 5",
                                TinhTrang = "pending",
                                MaLoaiYC = 1,
                                NhanVienID = employee_KQL.NhanVienID,
                                NhanVienQuanly = manager.NhanVienID
                            },
                            new YeuCauNhanVien
                            {
                                NgayGui = DateTime.Now.AddDays(-1),
                                NgayBD = DateTime.Now.AddDays(2),
                                NgayKT = DateTime.Now.AddDays(3),
                                SoNgayYeuCau = 2,
                                LyDo = "Lý do số 6",
                                TinhTrang = "deny",
                                LyDoTuChoi = "Lý do từ chối 2",
                                MaLoaiYC = 3,
                                NhanVienID = employee_KQL.NhanVienID,
                                NhanVienQuanly = manager.NhanVienID
                            },
                             new YeuCauNhanVien
                            {
                                NgayGui = DateTime.Now.AddDays(-1),
                                NgayBD = DateTime.Now.AddDays(2),
                                NgayKT = DateTime.Now.AddDays(3),
                                SoNgayYeuCau = 2,
                                LyDo = "Lý do số 7",
                                TinhTrang = "approve",
                                MaLoaiYC = 2,
                                NhanVienID = employee_KQL.NhanVienID,
                                NhanVienQuanly = manager.NhanVienID
                            }

                        };
                        await context.YeuCauNhanViens.AddRangeAsync(YeuCauNhanVien);
                        await context.TTNganHangs.AddAsync(ttnhEmployee_KQL);
                        await context.BangCaps.AddAsync(bangCapEmployee_KQL);
                        await context.KinhNghiemLamViecs.AddAsync(kinhNghiemEmployee_KQL);
                    }
                    else
                    {
                        logger.LogWarning($"Lỗi khi thêm vai trò cho user {identityUserEmployee_KQL.UserName}.");
                        foreach (var error in addRoleResult_KQL.Errors)
                        {
                            logger.LogError($"Lỗi: {error.Code} - {error.Description}");
                        }
                    }
                }
                else
                {
                    logger.LogWarning($"Lỗi khi tạo user {identityUserEmployee_KQL.UserName}.");
                    foreach (var error in createUserResultEmployee_KQL.Errors)
                    {
                        logger.LogError($"Lỗi: {error.Code} - {error.Description}");
                    }
                }

                var loaiYeuCaus = new List<LoaiYeuCau>
                {
                    new LoaiYeuCau { Ten = "Nghỉ phép" },
                    new LoaiYeuCau { Ten = "WFH" },
                    new LoaiYeuCau { Ten = "Check-in" },
                    new LoaiYeuCau { Ten = "Check-out" },
                    new LoaiYeuCau { Ten = "Cập nhật bảng chấm công" },
                    new LoaiYeuCau { Ten = "Khác" }
                };
                
                // Thêm dữ liệu vào bảng LoaiYeuCaus
                await context.LoaiYeuCaus.AddRangeAsync(loaiYeuCaus);
                await context.SaveChangesAsync();

                logger.LogInformation("Khởi tạo dữ liệu thành công");
            }
            catch (Exception ex)
            {
                logger.LogError($"Lỗi xảy ra trong quá trình khởi tạo dữ liệu: {ex.Message}");
                if (ex.InnerException != null)
                {
                    logger.LogError($"Inner exception: {ex.InnerException.Message}");
                }
            }
        }
    }
}
