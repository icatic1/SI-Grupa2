using Microsoft.Extensions.Options;
using System.Web;


using SIProjectSet1.Models;
using SIProjectSet1.Settings;
using System.Net;
using System.Net.Mail;
using System.Text;

namespace SIProjectSet1.UserService
{
    public interface IMailService
    {
        Task SendNewMail(PasswordRequest request);
    }

    public class MailService : IMailService
    {
        private readonly MailSettings _mailSettings;
        public MailService(IOptions<MailSettings> mailSettings)
        {
            _mailSettings = mailSettings.Value;
        }

        public async Task SendNewMail(PasswordRequest request)
        {


            MailMessage Message = new MailMessage("snapshotagent@gmail.com", request.ToEmail);
            
            Message.Subject = "SnapShot - Reset password";
            
            string currentURL = "http://sigrupa4-001-site1.ctempurl.com";
            Message.Body = "Reset Password link:  " + currentURL + "/ChangePass/" + request.Token;

            SmtpClient smtp = new SmtpClient("smtp.gmail.com");
                
            smtp.EnableSsl = true;

            NetworkCredential cred = new NetworkCredential("snapshotagent@gmail.com", "123123SI");
            smtp.UseDefaultCredentials = false;
            smtp.Credentials = cred;
            smtp.Port = 587;
            smtp.Send(Message);
                
            

        }
    }

}