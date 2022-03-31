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

        Task<List<UserViewModel>> GetAllUsers();

        Task<bool> ChangeUserPassword(string email, string password);

        Task<bool> LogInUser(string email, string pass, string jwt, string expiration);

        Task<bool> MakeAdmin(long id);

        Task<bool> MakeUser(long id);

        Task<long> GetUserID(UserViewModel user);

        Task<long> GetUserID(string email);

        Task<string> GetUserRole(string email);

        Task<String> getToken(string emailToken);

        Task<User> getOneUser(string email);

        Task<PasswordRequest> setToken(string email);

        Task<List<String>> GetAllTokens();

        Task<String> getTFAToken(long userID);
        Task<bool> InsertTwoFactorToken(long userID, string token);
        Task<bool> ActivateTwoFactorToken(long userID);
        Task<Boolean> getTFAStatus(long userID);

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
                newUser.Password = user.Password;
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

                tempUser.Password = password;
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
                tempUser.Password = user.Password;
                tempUser.Email = user.Email;
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
                var tempUser = await _context.Users.Where(o => o.Email == email && o.Password == pass).SingleOrDefaultAsync();
                var userToken = new UserToken();
                if (tempUser == null) return false;
                userToken.UserId = tempUser.Id;
                userToken.JwtToken = jwt;
                userToken.TokenExpiration = expiration;
                //var addedToken = await _context.UserTokens.AddAsync(userToken);
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
                if (userFound == null) return -1000;

                await _context.SaveChangesAsync();
                return userFound.Id;
            }
            catch (Exception ex)
            {
                return -1000;
            }
        }

        public async Task<bool> MakeAdmin(long id)
        {
            try
            {
                var roleObject = new Entities.UserRole();
                roleObject.UserId = id;

                var role = await _context.Roles.Where(o => o.Name == "Administrator").FirstOrDefaultAsync();
                if (role == null) return false;
                roleObject.RoleId = role.Id;



                await _context.UserRoles.AddAsync(roleObject);
                await _context.SaveChangesAsync();

                return true;

            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<bool> MakeUser(long id)
        {
            try
            {
                var roleObject = new Entities.UserRole();
                roleObject.UserId = id;

                var role = await _context.Roles.Where(o => o.Name == "User").FirstOrDefaultAsync();
                if (role == null) return false;
                roleObject.RoleId = role.Id;


                await _context.UserRoles.AddAsync(roleObject);
                await _context.SaveChangesAsync();

                return true;

            }
            catch (Exception e)
            {
                return false;
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

        public async Task<string> GetUserRole(string email)
        {
            try
            {
                var id = await GetUserID(email);
                var role = await _context.UserRoles.Where(o => o.UserId == id).FirstOrDefaultAsync();
                var roleob = await _context.Roles.Where(o => o.Id == role.RoleId).FirstOrDefaultAsync();

                return roleob.Name;
            }
            catch (Exception ex)
            {
                return "";
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

                //obrisat ovaj token !!!!! da se ne bi mogao iskoristiti isti link
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

    }
}