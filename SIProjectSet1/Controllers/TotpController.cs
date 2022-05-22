using AspNetCore.Totp;
using AspNetCore.Totp.Interface;
using Microsoft.AspNetCore.Mvc;


namespace SIProjectSet1.Controllers
{
    internal struct UserIdentity
    {
        public long Id { get; set; }
        public string AccountSecretKey { get; set; }
    }

    internal static class AuthProvider
    {
        public static UserIdentity GetUserIdentity()
        {
            return new UserIdentity()
            {
                Id = new Random().Next(0, 999),
                AccountSecretKey = Guid.NewGuid().ToString()
            };
        }

        public static UserIdentity SetUserIdentity(long Id, string secret)
        {
            return new UserIdentity()
            {
                Id = Id,
                AccountSecretKey = secret
            };
        }
    }

    [ApiController]
    [Route("[controller]")]
    public class TotpController : ControllerBase
    {
        private readonly ITotpGenerator _totpGenerator;
        private readonly ITotpSetupGenerator _totpQrGenerator;
        private readonly ITotpValidator _totpValidator;
        private readonly UserIdentity _userIdentity;

        public TotpController()
        {
            _totpGenerator = new TotpGenerator();
            _totpValidator = new TotpValidator(_totpGenerator);
            _totpQrGenerator = new TotpSetupGenerator();
            _userIdentity = AuthProvider.GetUserIdentity();
        }

        public TotpController(long Id, string token)
        {
            _totpGenerator = new TotpGenerator();
            _totpValidator = new TotpValidator(_totpGenerator);
            _totpQrGenerator = new TotpSetupGenerator();
            _userIdentity = AuthProvider.SetUserIdentity(Id, token);
        }

        [HttpGet]
        [Route("tfaCode")]
        public int GetCode()
        {
            return _totpGenerator.Generate(_userIdentity.AccountSecretKey);
        }

        [HttpGet]
        [Route("tfaQR-code")]
        public IActionResult GetQr()
        {
            var qrCode = _totpQrGenerator.Generate(
                "SI Set 1",
                _userIdentity.Id.ToString(),
                _userIdentity.AccountSecretKey
            );
            return Ok(qrCode.QrCodeImage);
        }

        [HttpPost]
        [Route("tfaValidate")]
        public bool Validate(int code)
        {
            return _totpValidator.Validate(_userIdentity.AccountSecretKey, code);
        }
    }
}
