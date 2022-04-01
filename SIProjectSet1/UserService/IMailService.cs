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

            /* MailMessage mes = new MailMessage(_mailSettings.Mail,request.ToEmail);
             mes.Subject = "SnapShot - Reset password";
             mes.Body = "This is a sample message using SMTP authentication";


             string FilePath = Directory.GetCurrentDirectory() + "\\MailAddOn\\front.html";
             var msgBody = new StringBuilder(File.ReadAllText(FilePath));
             //string currentURL = Dns.GetHostName();
             string currentURL = "http://sigrupa4-001-site1.ctempurl.com";
             msgBody.Replace("[username]", request.UserName);
             msgBody.Replace("[email]", request.ToEmail);
             msgBody.Replace("[token]", currentURL + "/ChangePass/" + request.Token);

             mes.IsBodyHtml = true;
             mes.Body = msgBody.ToString();
             SmtpClient sc = new SmtpClient();

             sc.Host = _mailSettings.Host;
             sc.Port = 587;
             sc.UseDefaultCredentials = false;
             sc.Credentials = new System.Net.NetworkCredential(_mailSettings.Mail,_mailSettings.Password);
             sc.EnableSsl = true;
             sc.Send(mes);*/
            //string newStuf = "";

            MailMessage Message = new MailMessage("snapshotagent@gmail.com", request.ToEmail);
            
            Message.Subject = "SnapShot - Reset password";
            //Message.Body = "This is a sample message using SMTP authentication";
            //Message.IsBodyHtml = false;
            /* string FilePath = Directory.GetCurrentDirectory() + "\\MailAddOn\\front.html";
             var msgBody = new StringBuilder(File.ReadAllText(FilePath));

             string currentURL = "http://sigrupa4-001-site1.ctempurl.com";
             msgBody.Replace("[username]", request.UserName);
             msgBody.Replace("[email]", request.ToEmail);
             msgBody.Replace("[token]", currentURL + "/ChangePass/" + request.Token);

             Message.IsBodyHtml = true;
             Message.Body = msgBody.ToString();*/
            string currentURL = "http://sigrupa4-001-site1.ctempurl.com";
            Message.Body = "Reset Password link:  " + currentURL + "/ChangePass/" + request.Token;

            SmtpClient smtp = new SmtpClient("smtp.gmail.com");
                
                    // smtp.Host = "smpt.gmail.com";
            smtp.EnableSsl = true;

            NetworkCredential cred = new NetworkCredential("snapshotagent@gmail.com", "123123SI");
            smtp.UseDefaultCredentials = false;
            smtp.Credentials = cred;
            smtp.Port = 587;
            smtp.Send(Message);
                
            

        }
    }

}