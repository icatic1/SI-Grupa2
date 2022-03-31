using Microsoft.AspNetCore.Mvc;
using SIProjectSet1.Models;
using SIProjectSet1.UserService;

namespace SIProjectSet1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MailController : ControllerBase
    {
        private readonly IMailService mailService;
        public MailController(IMailService mailService)
        {
            this.mailService = mailService;
        }

        [HttpPost("pass")]
        public async Task<IActionResult> SendWelcomeMail(PasswordRequest request)
        {
            try
            {
                await mailService.SendWelcomeEmailAsync(request);
                return Ok();
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}

