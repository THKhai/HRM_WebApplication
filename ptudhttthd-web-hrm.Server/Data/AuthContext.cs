using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ptudhttthd_web_hrm.Server.Models;

namespace ptudhttthd_web_hrm.Server.Data
{
    // Thêm vai trò vào Bảng AspNetRoles
    public class AuthContext : IdentityDbContext
    {
        public AuthContext(DbContextOptions<AuthContext> options) : base(options) 
        { 
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            var readerRoleId = "a312b119-38af-4179-b58d-e459c462a8b1";
            var writerRoleId = "74023a6d-c693-4348-ae4e-62070414bc83";
            var roles = new List<IdentityRole>() {
                new IdentityRole(){
                        Id= readerRoleId,
                        ConcurrencyStamp = readerRoleId,
                        Name = "Thuong",
                        NormalizedName = "Thuong".ToUpper()
                },

                new IdentityRole(){
                        Id= writerRoleId,
                        ConcurrencyStamp = writerRoleId,
                        Name = "QuanLy",
                        NormalizedName = "QuanLy".ToUpper()
                }
            };

            builder.Entity<IdentityRole>().HasData(roles);
        }
    }
}
