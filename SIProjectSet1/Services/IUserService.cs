using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SIProjectSet1.Entities;
using SIProjectSet1.Infrastructure;
using SIProjectSet1.Models;
using SIProjectSet1.ViewModels;

namespace SIProjectSet1.UserService
{
    public interface IUserService
    {
        Task<bool> AddUser(UserViewModel user);
        Task<UserViewModel> UpdateUserInfo(UserViewModel user);
        Task<bool> DeleteUser(long Id);

        Task<bool> RestoreUser(long Id);

        Task<UserViewModel> GetUserByID(long id);

        Task<List<UserViewModel>> GetAllUsers();

        Task<bool> ChangeUserPassword(string email, string password);

        Task<bool> LogInUser(string email, string pass, string jwt, string expiration);


        Task<long> GetUserID(UserViewModel user);

        Task<long> GetUserID(string email);

        Task<Role> GetUserRole(string email);

        Task<String> getToken(string emailToken);

        Task<User> getOneUser(string email);

        Task<PasswordRequest> setToken(string email);

        Task<List<String>> GetAllTokens();

        Task<String> getTFAToken(long userID);
        Task<bool> InsertTwoFactorToken(long userID, string token);
        Task<bool> ActivateTwoFactorToken(long userID);
        Task<Boolean> getTFAStatus(long userID);
        Task<SecurityQuestion> GetSecurityQuestion(long userID);
        Task<SecurityQuestion> AddSecurityQuestion(SecurityQuestion newSecurityQuestion);
        Task<bool> AddRole(long id, long roleId);

        Task<List<RoleViewModel>> GetRoles();

    }

    public class UserService : IUserService
    {
        private readonly ILogger<UserService> _logger;
        private readonly SIProjectSet1Context _context;

        public UserService(ILogger<UserService> logger, SIProjectSet1Context context)
        {
            _logger = logger;
            _context = context;
        }
        public async Task<bool> AddUser(UserViewModel user)
        {
            try
            {
                var newUser = new Entities.User();
                newUser.Email = user.Email;
                newUser.Surname = user.Surname;
                newUser.Name = user.Name;
                newUser.Password = BCrypt.Net.BCrypt.HashPassword(user.Password); ;
                newUser.RoleId = 1;
                var addedUser = await _context.Users.AddAsync(newUser);
                await _context.SaveChangesAsync();
                if (addedUser == null) return false;
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<bool> ChangeUserPassword(string email, string password)
        {
            try
            {
                var tempUser = await _context.Users.Where(o => o.Email == email).SingleOrDefaultAsync();
                if (tempUser == null) return false;

                tempUser.Password = BCrypt.Net.BCrypt.HashPassword(password); ;
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<bool> DeleteUser(long Id)
        {
            try
            {
                var tempUser = await _context.Users.Where(o => o.Id == Id).SingleOrDefaultAsync();
                if (tempUser == null) return false;

                tempUser.DeletedStatus = true;
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }



        public async Task<bool> RestoreUser(long Id)
        {
            try
            {
                var tempUser = await _context.Users.Where(o => o.Id == Id).SingleOrDefaultAsync();
                if (tempUser == null) return false;

                tempUser.DeletedStatus = false;
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }


        public async Task<UserViewModel> GetUserByID(long id)
        {
            try
            {
                var user = await _context.Users.Where(o => o.Id == id).SingleOrDefaultAsync();

                if (user == null) return null;

                var returnUser = new UserViewModel();
                returnUser.Id = user.Id;
                returnUser.RoleId = user.RoleId;
                returnUser.Name = user.Name;
                returnUser.Surname = user.Surname;
                returnUser.Email = user.Email;
                returnUser.Password = user.Password;
                returnUser.DeletedStatus = user.DeletedStatus;
                return returnUser;
            }
            catch (Exception ex)
            {
                return null;
            }

        }



        public async Task<List<UserViewModel>> GetAllUsers()
        {
            try
            {
                var userList = await _context.Users.Where(o => o.DeletedStatus == false).ToListAsync();

                var listModels = new List<UserViewModel>();

                foreach (var user in userList)
                {
                    var model = new UserViewModel();
                    model.DeletedStatus = user.DeletedStatus;
                    model.Surname = user.Surname;
                    model.Name = user.Name;
                    model.Id = user.Id;
                    model.Email = user.Email;
                    model.Password = user.Password;
                    model.RoleId = user.RoleId;
                    listModels.Add(model);
                }
                return listModels;
            }
            catch (Exception ex)
            {
                return new List<UserViewModel>();
            }
        }

        public async Task<UserViewModel> UpdateUserInfo(UserViewModel user)
        {
            try
            {
                var tempUser = await _context.Users.Where(o => o.Id == user.Id).SingleOrDefaultAsync();
                if (tempUser == null) return null;
                tempUser.Surname = user.Surname;
                tempUser.Name = user.Name;
                if(tempUser.Password != user.Password)
                    tempUser.Password =  BCrypt.Net.BCrypt.HashPassword( user.Password);
                tempUser.Email = user.Email;
                tempUser.RoleId = user.RoleId;
                await _context.SaveChangesAsync();
                return user;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<bool> LogInUser(string email, string pass, string jwt, string expiration)
        {
            try
            {
              
                var tempUser = await _context.Users.Where(o => o.Email == email).SingleOrDefaultAsync(); 
                if (tempUser == null) return false;
                if (!BCrypt.Net.BCrypt.Verify(pass, tempUser.Password)) return false;
                var userToken = new UserToken();
                userToken.UserId = tempUser.Id;
                userToken.JwtToken = jwt;
                userToken.TokenExpiration = expiration;
                await _context.SaveChangesAsync();
                return true;

            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<long> GetUserID(UserViewModel user)
        {
            try
            {
                var userFound = await _context.Users.Where(o => o.Email == user.Email).SingleOrDefaultAsync();
                Console.WriteLine("userFound vratio:  " + userFound);
                if (userFound == null) return -1000;

                return userFound.Id;
            }
            catch (Exception ex)
            {
                return -1000;
            }
        }

        public async Task<long> GetUserID(string email)
        {
            try
            {
                var userFound = await _context.Users.Where(o => o.Email == email).SingleOrDefaultAsync();
                if (userFound == null) return -1000;

                await _context.SaveChangesAsync();
                return userFound.Id;
            }
            catch (Exception ex)
            {
                return -1000;
            }
        }

        public async Task<bool> AddRole(long id, long roleId)
        {
            try
            {

                var role = await _context.Roles.Where(o => o.Id == roleId).FirstOrDefaultAsync();
                if (role == null) return false;

                var user = await _context.Users.Where(o => o.Id == id).FirstOrDefaultAsync();
                if (user == null) return false;

                user.RoleId = role.Id;
                await _context.SaveChangesAsync();

                return true;

            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<Role> GetUserRole(string email)
        {
            try
            {
                var user = await _context.Users.Where(o => o.Email == email).FirstOrDefaultAsync();
                if (user == null) return null;
                var role = await _context.Roles.Where(o => o.Id == user.RoleId).FirstOrDefaultAsync();
                if (role == null) return null;
                return role;
            }
            catch (Exception ex)
            {
                return null;
            }
        }



        public async Task<String> getToken(string emailToken)
        {
            try
            {
                String emailFound = null;
                var deletedToken = await _context.PassTokens.Where(o => o.ResetToken == emailToken).SingleOrDefaultAsync();
                if (deletedToken == null) return null;
                emailFound = deletedToken.Email;
                _context.PassTokens.Remove(deletedToken); 


                //var obrisan = await _context.PassTokens.Where(o => o.ResetToken == emailToken).SingleOrDefaultAsync();
                await _context.SaveChangesAsync();
                return emailFound;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<User> getOneUser(string email)
        {
            try
            {

                var user = await _context.Users.Where(o => o.Email == email).SingleOrDefaultAsync();

                if (user == null) return null;
                await _context.SaveChangesAsync();

                return user;
            }
            catch (Exception ex)
            {
                return null;
            }
        }


        public async Task<PasswordRequest> setToken(string email)
        {
            try
            {

                var newToken = new Entities.PassToken();
                newToken.Email = email;
                const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

                var stringChars = new char[10];
                var random = new Random();

                for (int i = 0; i < stringChars.Length; i++)
                {
                    stringChars[i] = chars[random.Next(chars.Length)];
                }

                String t = new String(stringChars);

                PasswordRequest request = new PasswordRequest();
                request.UserName = email;
                request.ToEmail = email;
                request.Token = t;


                newToken.ResetToken = t;
                var addedToken = await _context.PassTokens.AddAsync(newToken);
                await _context.SaveChangesAsync();

                return request;
            }
            catch (Exception ex)
            {
                return null;
            }
        }


        public async Task<List<String>> GetAllTokens()
        {
            try
            {
                var tokList = await _context.PassTokens.ToListAsync();

                var listToks = new List<String>();

                foreach (var t in tokList)
                {
                    var model = t.ResetToken + " " + t.Email;
                    listToks.Add(model);
                }
                return listToks;
            }
            catch (Exception ex)
            {
                return new List<String>();
            }
        }


        public async Task<bool> InsertTwoFactorToken(long userID, string token)
        {
            try
            {
                var newToken = new Entities.TFA();
                newToken.UserId = userID;
                newToken.token = token;
                newToken.isActivated = false;
                var addedToken = await _context.FTAs.AddAsync(newToken);
                await _context.SaveChangesAsync();
                if (addedToken == null) return false;
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }



        public async Task<String> getTFAToken(long userID)
        {
            try
            {
                var tokenList = await _context.FTAs.Where(o => o.UserId == userID).ToListAsync();
                if (tokenList == null || tokenList.Count() == 0) return null;
                var token = tokenList.FirstOrDefault().token;

                return token;
            }
            catch (Exception ex)
            {
                return "";
            }
        }

        public async Task<Boolean> getTFAStatus(long userID)
        {
            try
            {
                var tokenList = await _context.FTAs.Where(o => o.UserId == userID).ToListAsync();
                if (tokenList == null || tokenList.Count() == 0) return false;
                var activated = tokenList.FirstOrDefault().isActivated;

                return activated;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<bool> ActivateTwoFactorToken(long userID)
        {
            try
            {
                var tokenList = await _context.FTAs.Where(o => o.UserId == userID).ToListAsync();
                if (tokenList == null || tokenList.Count() == 0) return false;
                tokenList.FirstOrDefault().isActivated = true;
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<SecurityQuestion> GetSecurityQuestion(long userID)
        {
            try
            {
                var securityQuestion = await _context.SecurityQuestions.Where(o => o.UserId == userID).SingleOrDefaultAsync();

                if (securityQuestion == null) return null;
                return securityQuestion;

            } catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<SecurityQuestion> AddSecurityQuestion(SecurityQuestion newSecurityQuestion)
        {
            try
            {
                var securityQuestion = await _context.SecurityQuestions.Where(o => o.UserId == newSecurityQuestion.UserId).SingleOrDefaultAsync();

                if (securityQuestion == null)
                {
                    newSecurityQuestion.Answer = BCrypt.Net.BCrypt.HashPassword(newSecurityQuestion.Answer);
                    var addedQuestion = await _context.SecurityQuestions.AddAsync(newSecurityQuestion);
                    await _context.SaveChangesAsync();
                    if (addedQuestion == null) return null;
                   
                } else
                {
                    if (securityQuestion.Question == newSecurityQuestion.Question && newSecurityQuestion.Answer == securityQuestion.Answer)
                        return newSecurityQuestion;
                    securityQuestion.Question = newSecurityQuestion.Question;
                    securityQuestion.Answer = BCrypt.Net.BCrypt.HashPassword(newSecurityQuestion.Answer);
                    await _context.SaveChangesAsync();
                }
                return newSecurityQuestion;

            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<List<RoleViewModel>> GetRoles()
        {

            try
            {
                var roleList = await _context.Roles.ToListAsync();

                var returnList = new List<RoleViewModel>();

                foreach (var role in roleList)
                {
                    var model = new RoleViewModel();
                    model.Id = role.Id;
                    model.Name = role.Name;
                    returnList.Add(model);
                }

                return returnList;
            }
            catch (Exception ex)
            {
                return new List<RoleViewModel>();
            }
        }
    }

}