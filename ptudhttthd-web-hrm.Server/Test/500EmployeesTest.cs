using NUnit.Framework;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

[TestFixture]
public class BulkEmployeeTests
{
    private readonly string baseUrl = "http://localhost:5160/api";
    private HttpClient _client;

    [SetUp]
    public void Setup()
    {
        _client = new HttpClient();
    }

    [Test]
    public async Task RegisterAndSend_500Employees()
    {
        var tasks = Enumerable.Range(4, 1000).Select(async i =>
        {
            using var client = new HttpClient(); // Create isolated client
            var email = $"user{i}@example.com";
            var signupPayload = new
            {
                UserName = $"user{i}",
                Email = email,
                Password = "Test@1234",
                Roles = new[] { "Thuong" }
            };

            // Register
            var signupResp = await client.PostAsJsonAsync($"{baseUrl}/Auth/signup", signupPayload);

            // Login
            var loginPayload = new { Email = email, Password = "Test@1234" };
            var loginResp = await client.PostAsJsonAsync($"{baseUrl}/Auth/login", loginPayload);
            if (!loginResp.IsSuccessStatusCode) return;

            var loginData = await loginResp.Content.ReadFromJsonAsync<LoginResponseDTO>();
            client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", loginData.Token);

            // Send leave request
            // var leavePayload = new
            // {
            //     fromDate = "2025-06-01",
            //     toDate = "2025-06-03",
            //     reason = "Test leave"
            // };
            // var leaveResp = await client.PostAsJsonAsync($"{baseUrl}/leave-request", leavePayload);
            //
            // Assert.IsTrue(leaveResp.IsSuccessStatusCode);
        });

        await Task.WhenAll(tasks); // Wait for all
    }

    [Test]
    public async Task LeaveRequest_50Employees()
    {
        var tasks = Enumerable.Range(4, 50).Select(async i =>
        {
            using var client = new HttpClient();
            var email = $"user{i}@example.com";
            
            // 2. Đăng nhập
            var loginPayload = new { Email = email, Password = "Test@1234" };
            var loginResp = await client.PostAsJsonAsync($"{baseUrl}/Auth/login", loginPayload);
            if (!loginResp.IsSuccessStatusCode)
            {
                Assert.Fail($"Login failed for user {i}");
                return;
            }
    
            var loginData = await loginResp.Content.ReadFromJsonAsync<LoginResponseDTO>();
            client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", loginData.Token);
    
            // // 3. Gửi yêu cầu nghỉ phép
            // var leavePayload = new
            // {
            //     fromDate = "2025-06-01",
            //     toDate = "2025-06-03",
            //     reason = "Test leave"
            // };
            //
            // var leaveResp = await client.PostAsJsonAsync($"{baseUrl}/leave-request", leavePayload);
            // Assert.IsTrue(leaveResp.IsSuccessStatusCode, $"Leave request failed for user {i}");
        });
    
        await Task.WhenAll(tasks);
    }
    public class LoginResponseDTO
    {
        public string Token { get; set; }
    }
}