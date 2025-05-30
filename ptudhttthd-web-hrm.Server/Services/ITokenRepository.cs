using Microsoft.AspNetCore.Identity;

namespace ptudhttthd_web_hrm.Server.Services
{
    public interface ITokenRepository
    {
        string CreateJWTToken(IdentityUser user, List<string> roles);
    }
}
