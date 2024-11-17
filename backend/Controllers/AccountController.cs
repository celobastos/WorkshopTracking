using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using WorkshopTracking.Data;
using WorkshopTracking.Models;
using WorkshopTracking.Services;

namespace WorkshopTracking.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly WorkshopContext _context;
        private readonly JwtService _jwtService;
        private readonly IConfiguration _configuration;

        public AccountController(WorkshopContext context, JwtService jwtService, IConfiguration configuration)
        {
            _context = context;
            _jwtService = jwtService; // Use the shared dynamic signing key from JwtService
            _configuration = configuration;
        }

        /// <summary>
        /// Register a new user
        /// </summary>
        /// <param name="user">User registration details</param>
        /// <returns>Success or error message</returns>
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

        /// <summary>
        /// Login and generate a JWT token
        /// </summary>
        /// <param name="loginRequest">Login details</param>
        /// <returns>JWT token</returns>
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

        /// <summary>
        /// Generate a JWT token for a user
        /// </summary>
        /// <param name="user">The user for whom the token is generated</param>
        /// <returns>JWT token string</returns>
        private string GenerateJwtToken(User user)
        {
            var credentials = new SigningCredentials(_jwtService.GetSigningKey(), SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Role, "User") // Assign a default role
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1), // Token validity
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        /// <summary>
        /// Reset the signing key dynamically
        /// </summary>
        /// <returns>Message indicating reset status</returns>
            [HttpPost("reset-key")]
        public IActionResult ResetSigningKey()
        {
            _jwtService.ResetKey();
            return Ok(new { Message = "Signing key has been reset. Existing tokens are now invalid." });
        }

    }
}
