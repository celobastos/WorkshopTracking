using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using WorkshopTracking.Data;
using WorkshopTracking.Models;

namespace WorkshopTracking.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly WorkshopContext _context;
        private readonly IConfiguration _configuration;

        // Dynamically generated signing key for session-based tokens
        private static SymmetricSecurityKey? _dynamicSigningKey;

        public AccountController(WorkshopContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;

            // Generate a random signing key for this session if not already set
            if (_dynamicSigningKey == null)
            {
                var randomKey = new byte[32]; // 256-bit key
                using (var rng = RandomNumberGenerator.Create())
                {
                    rng.GetBytes(randomKey);
                }
                _dynamicSigningKey = new SymmetricSecurityKey(randomKey);
            }
        }

        // Registration endpoint
        [HttpPost("register")]
        public IActionResult Register([FromBody] User user)
        {
            if (_context.Users.Any(u => u.Username == user.Username))
                return BadRequest("Username already exists.");

            // Hash the password before saving
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(new { Message = "User registered successfully." });
        }

        // Login endpoint
        [HttpPost("login")]
        public IActionResult Login([FromBody] User loginRequest)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == loginRequest.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginRequest.PasswordHash, user.PasswordHash))
                return Unauthorized("Invalid username or password.");

            // Generate JWT token
            var token = GenerateJwtToken(user);
            return Ok(new { Token = token });
        }

        private string GenerateJwtToken(User user)
        {
            // Use the dynamically generated signing key
            var securityKey = _dynamicSigningKey ?? throw new InvalidOperationException("Signing key is not initialized.");
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Role, "User") // Assign a default role
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"] ?? "default_issuer",
                audience: _configuration["Jwt:Audience"] ?? "default_audience",
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1), // Token validity
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Endpoint to reset the signing key dynamically (admin-only)
        [HttpPost("reset-key")]
        public IActionResult ResetSigningKey()
        {
            var randomKey = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomKey);
            }
            _dynamicSigningKey = new SymmetricSecurityKey(randomKey);

            return Ok(new { Message = "Signing key has been reset. All existing tokens are invalidated." });
        }
    }
}
