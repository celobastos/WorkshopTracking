using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;

namespace WorkshopTracking.Services
{
    public class JwtService
    {
        private SymmetricSecurityKey? _signingKey;

        public JwtService()
        {
            ResetKey();
        }

        public SymmetricSecurityKey GetSigningKey()
        {
            if (_signingKey == null)
            {
                throw new InvalidOperationException("Signing key has not been initialized.");
            }
            return _signingKey;
        }

        public void ResetKey()
        {
            var randomKey = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomKey);
            }
            _signingKey = new SymmetricSecurityKey(randomKey);
        }
    }
}
