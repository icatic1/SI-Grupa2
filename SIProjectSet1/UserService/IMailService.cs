using Microsoft.Extensions.Options;
using System.Web;

using MimeKit;
using MailKit.Security;
using MailKit.Net.Smtp;
using SIProjectSet1.Models;
using SIProjectSet1.Settings;
using System.Net;

namespace SIProjectSet1.UserService
{
    public interface IMailService
    {
        Task SendWelcomeEmailAsync(PasswordRequest request);
    }

    public class MailService : IMailService
    {
        private readonly MailSettings _mailSettings;
        public MailService(IOptions<MailSettings> mailSettings)
        {
            _mailSettings = mailSettings.Value;
        }

        public async Task SendWelcomeEmailAsync(PasswordRequest request)
        {
            string FilePath = Directory.GetCurrentDirectory() + "\\MailAddOn\\front.html";
            StreamReader str = new StreamReader(FilePath);
            string MailText = str.ReadToEnd();
            str.Close();

            string currentURL = Dns.GetHostName();
            
            //MailText = MailText.Replace("[username]", request.UserName).Replace("[email]", request.ToEmail).Replace("[token]", "https://localhost:3000/ChangePass/" + request.Token);
            MailText = MailText.Replace("[username]", request.UserName).Replace("[email]", request.ToEmail).Replace("[token]", currentURL+"/ChangePass/" + request.Token);
            var email = new MimeMessage();
            
            email.Sender = MailboxAddress.Parse(_mailSettings.Mail);
            
            
            email.To.Add(MailboxAddress.Parse(request.ToEmail));
            email.Subject = $"Welcome {request.UserName}";
            var builder = new BodyBuilder();
            builder.HtmlBody = MailText;
            email.Body = builder.ToMessageBody();
            using var smtp = new SmtpClient();
            smtp.Connect(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
            smtp.Authenticate(_mailSettings.Mail, _mailSettings.Password);
            await smtp.SendAsync(email);
            smtp.Disconnect(true);
        }
    }

}