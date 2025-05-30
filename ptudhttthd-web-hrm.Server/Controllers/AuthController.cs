using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ptudhttthd_web_hrm.Server.Data;
using ptudhttthd_web_hrm.Server.Models;
using ptudhttthd_web_hrm.Server.Services;

namespace ptudhttthd_web_hrm.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        public class SignUpRequestDTO
        {
            public required string UserName { get; set; }
            public required string Email { get; set; }
            public required string Password { get; set; }
            public required string[] Roles { get; set; }
        }

        public class LoginRequestDTO
        {
            public required string Email { get; set; }
            public required string Password { get; set; }
        }

        public class LoginResponseDTO
        {
            public required string Token { get; set; }
        }

        private readonly NhanVienContext _context;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly ITokenRepository _jwtRepository;

        public AuthController(NhanVienContext context, UserManager<IdentityUser> userManager, ITokenRepository jwtRepository)
        {
            _context = context;
            _userManager = userManager;
            _jwtRepository = jwtRepository;
        }

        // POST: api/Auth/signup
        [HttpPost("signup")]
        public async Task<IActionResult> DangKy([FromBody] SignUpRequestDTO signUpRequest)
        {
            var identityUser = new IdentityUser
            {
                Email = signUpRequest.Email,
                UserName = signUpRequest.UserName
            };

            var identityResult = await _userManager.CreateAsync(identityUser, signUpRequest.Password);
            if (identityResult.Succeeded)
            {
                if (signUpRequest.Roles != null && signUpRequest.Roles.Any())
                {
                    identityResult = await _userManager.AddToRolesAsync(identityUser, signUpRequest.Roles);
                    if (identityResult.Succeeded)
                    {
                        NhanVien nv = new NhanVien 
                        { 
                            NhanVienID = identityUser.Id,
                            TenDangNhap = identityUser.UserName,
                            Email = identityUser.Email,
                            VaiTro = (await _userManager.GetRolesAsync(identityUser)).ToArray(),
                        };

                        await _context.NhanViens.AddAsync(nv);
                        await _context.SaveChangesAsync();
                        return Ok("Đăng ký thành công!! Vui lòng đăng nhập");
                    }
                }
            }
            return BadRequest("Có lỗi xảy ra");
        }

        // POST: api/Auth/login
        [HttpPost("login")]
        public async Task<IActionResult> DangNhap([FromBody] LoginRequestDTO loginRequest)
        {
            var user = await _userManager.FindByEmailAsync(loginRequest.Email);
            if (user != null)
            {
                var checkPassword = await _userManager.CheckPasswordAsync(user, loginRequest.Password);
                if (checkPassword)
                {
                    var roles = await _userManager.GetRolesAsync(user);
                    if (roles != null)
                    {
                        var jwtToken = _jwtRepository.CreateJWTToken(user, roles.ToList());
                        return Ok(new LoginResponseDTO() { Token = jwtToken });
                    }
                }
            }
            return BadRequest("Sai email hoặc mật khẩu");
        }
    }
}
