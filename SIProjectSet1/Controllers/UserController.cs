using Microsoft.AspNetCore.Mvc;
using SIProjectSet1.Entities;
using SIProjectSet1.Infrastructure;
using SIProjectSet1.UserService;
using SIProjectSet1.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using SIProjectSet1.Models;
using Microsoft.Net.Http.Headers;
using System.Net.Http.Headers;

namespace SIProjectSet1.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly SIProjectSet1Context _context;
        private readonly IUserService _userService;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IConfiguration _configuration;
        private TotpController _totpController = null;


        public UserController(ILogger<UserController> logger, SIProjectSet1Context context, IUserService userService,
            UserManager<IdentityUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration)
        {
            _logger = logger;
            _context = context;
            _userService = userService;
            _userManager = userManager;
            _configuration = configuration;
            _totpController = new TotpController();
        }

        public UserController(ILogger<UserController> logger, SIProjectSet1Context context, IUserService userService)
        {
            _logger = logger;
            _context = context;
            _userService = userService;
            _totpController = new TotpController();
        }

        //[Authorize(Roles = "Administrator")]
        [HttpPost]
        [Route("AddUser")]
        public async Task<ActionResult<UserViewModel>> AddUser(UserViewModel user)
        {

            try
            {
                Console.Write(ModelState);
                if (!ModelState.IsValid) return BadRequest();

                var userAlreadyExists = await _userService.GetUserID(user);

                var userCheck = await _userService.GetUserByID(userAlreadyExists);


                if (userAlreadyExists != -1000 && userCheck.DeletedStatus == false) return BadRequest("User with the given email already exists");
                Console.Write("User exists: " + userAlreadyExists);
                if (userAlreadyExists != -1000)
                {

                    await _userService.RestoreUser(userAlreadyExists);
                    var id = await _userService.GetUserID(user);
                    user.Id = id;
                    await _userService.UpdateUserInfo(user);

                    _logger.LogWarning("Dodan novi korisnik s id: " + id);
                    await _userService.AddRole(id, user.RoleId);
                    return Created(new Uri("/User/AddUser", UriKind.Relative), new { id = id, email = user.Email, name = user.Name, surname = user.Surname, password = user.Password, deletedStatus = user.DeletedStatus, roleId = user.RoleId });
                }
                else
                {

                    var successfulAdd = await _userService.AddUser(user);
                    if (!successfulAdd) return new StatusCodeResult(StatusCodes.Status500InternalServerError);


                 
                    var id = await _userService.GetUserID(user);
                    _logger.LogWarning("Dodan novi korisnik s id: " + id);
                    await _userService.AddRole(id, user.RoleId);
                    return Created(new Uri("/User/AddUser", UriKind.Relative), new { id = id, email = user.Email, name = user.Name, surname = user.Surname, password = user.Password, deletedStatus = user.DeletedStatus, roleId = user.RoleId });

                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }

        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login(string email, string password)
        {
            var role = await _userService.GetUserRole(email);

            var token = GetToken(email, role.Name);
            var tok = new JwtSecurityTokenHandler().WriteToken(token); var exp = token.ValidTo.ToString();

            try
            {
                var user = await _userService.LogInUser(email, password, tok, exp);
                if (!user) return Unauthorized();
                _logger.LogWarning("Korisnik sa email " + email + " je logovan.");
                return Ok(tok);
            }
            catch (Exception ex)
            {
                return Ok("");
            }

        }

        [Authorize(Roles = "Administrator")]
        [HttpPut]
        [Route("UpdateUserInfo")]
        public async Task<ActionResult<User>> UpdateUserInfo(UserViewModel user)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest();
                await _userService.UpdateUserInfo(user);
                _logger.LogWarning("Korisnik s id: " + user.Id + " je izmijenjen.");
                return Ok(user);

            }
            catch (Exception ex)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }


        [Authorize(Roles = "Administrator")]
        [HttpPut]
        [Route("DeleteUser")]
        public async Task<ActionResult<User>> DeleteUser(UserViewModel user)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest();
                await _userService.DeleteUser(user.Id);
                _logger.LogWarning("Korisnik s id: " + user.Id + " je obrisan.");
                return NoContent();
            }
            catch (Exception ex)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        [Authorize(Roles = "Administrator")]
        [HttpGet]
        [Route("GetAllUsers")]
        public async Task<ActionResult<List<UserViewModel>>> GetAllUsers()
        {
            try
            {

                var users = await _userService.GetAllUsers();
                return Ok(users);

            }
            catch (Exception ex)
            {
                return new List<UserViewModel>();
            }
        }
        [HttpPut]
        [Route("ChangeUserPassword")]
        public async Task<ActionResult<User>> ChangeUserPassword(string email, string password)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest();
                await _userService.ChangeUserPassword(email, password);
                _logger.LogWarning("Korisnik s email: " + email + " je promijenio lozinku.");
                return NoContent();
            }
            catch (Exception ex)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        private JwtSecurityToken GetToken(string mail, string role)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));



            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddMinutes(30),
                //claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );

            token.Payload["Roles"] = role;
            token.Payload["email"] = mail;

            return token;
        }


        [HttpGet]
        [Route("GetPassToken")]
        public async Task<ActionResult<User>> GetPassToken(string emailToken)
        {
            try
            {
                String existsMail = null;
                if (!ModelState.IsValid) return BadRequest();
                existsMail = await _userService.getToken(emailToken);
                if (existsMail == null) throw new Exception();
                //treba vratiti usera sada za email

                var ret = await _userService.getOneUser(existsMail);

                return Ok(ret);
            }
            catch (Exception ex)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }


        [HttpGet]
        [Route("GetAllTokens")]
        public async Task<ActionResult<List<String>>> GetAllTokens()
        {
            try
            {
                var toks = await _userService.GetAllTokens();
                return Ok(toks);

            }
            catch (Exception ex)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpPost]
        [Route("PostToken")]
        public async Task<ActionResult<PasswordRequest>> PostToken(string targetEmail)
        {
            try
            {
                PasswordRequest newT = null;
                if (!ModelState.IsValid) return BadRequest();
                newT = await _userService.setToken(targetEmail);
                if (newT == null) throw new Exception();

                return Ok(newT);
            }
            catch (Exception ex)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpGet]
        [Route("GetAllRoles")]
        public async Task<ActionResult<List<RoleViewModel>>> GetAllRoles()
        {
            try
            {
                var roles = await _userService.GetRoles();
                return roles;
            }
            catch
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        [Authorize]
        [HttpGet]
        [Route("GetUser")]
        public async Task<ActionResult<User>> GetUser(string email)
        {
            try
            {
                var authorization = Request.Headers[HeaderNames.Authorization];

                if (AuthenticationHeaderValue.TryParse(authorization, out var headerValue))
                {
                    var scheme = headerValue.Scheme;
                    var token = headerValue.Parameter;
                    var handler = new JwtSecurityTokenHandler();
                    var jwtSecurityToken = handler.ReadJwtToken(token);

                    if (email != (string)jwtSecurityToken.Payload["email"])
                        return Unauthorized();


                }
                else
                {
                    return Unauthorized();
                }

               
                var user = await _userService.getOneUser(email);

      
                if (user == null) return BadRequest();

                
                return Ok(user);

            }
            catch (Exception ex)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }


        [Authorize]
        [HttpPut]
        [Route("EditProfile")]
        public async Task<ActionResult<User>> EditProfile(UserViewModel user)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest();
                await _userService.UpdateUserInfo(user);


                _logger.LogWarning("Korisnik s id: " + user.Id + " je izmijenjen.");
                return Ok(user);

            }
            catch (Exception ex)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }



        #region SecurityQuestion
        [Authorize]
        [HttpPut]
        [Route("UpdateSecurityQuestion")]
        public async Task<ActionResult<SecurityQuestion>> UpdateSecurityQuestion(SecurityQuestion securityQuestion)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest();

                securityQuestion.Answer = BCrypt.Net.BCrypt.HashPassword(securityQuestion.Answer);
                var res = await _userService.AddSecurityQuestion(securityQuestion);

                if (res == null) return BadRequest();

                _logger.LogWarning("Korisnik s id: " + securityQuestion.UserId + " je promijenio sigurnosno pitanje.");

                return Ok();

            }
            catch (Exception ex)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }



        [HttpGet]
        [Route("GetSecurityQuestion")]
        public async Task<ActionResult<SecurityQuestion>> GetSecurityQuestion(string email)
        {
            try
            {
                var user = await _userService.getOneUser(email);

                if (user == null) return BadRequest();

                var securityQuestion = await _userService.GetSecurityQuestion(user.Id);

                if(securityQuestion == null) return new StatusCodeResult(StatusCodes.Status500InternalServerError);

                return Ok(securityQuestion);
            } catch(Exception ex)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }


        }

        [HttpGet]
        [Route("VerifySecurityQuestion")]
        public async Task<ActionResult<SecurityQuestion>> VerifySecurityQuestion(string email,string answer)
        {
            try
            {
                var user = await _userService.getOneUser(email);

                if (user == null) return BadRequest();

                var securityQuestion = await _userService.GetSecurityQuestion(user.Id);

                if (securityQuestion == null) return new StatusCodeResult(StatusCodes.Status500InternalServerError);

                if (!BCrypt.Net.BCrypt.Verify(answer, securityQuestion.Answer)) return BadRequest("Incorrect answer") ;
                return Ok(securityQuestion);
            }
            catch (Exception ex)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }


        }



        #endregion

        #region TFA

        [HttpPost]
        [Route("tfalogin")]
        public async Task<IActionResult> TFALogin(string email)
        {


            try
            {
                Console.WriteLine(email);
                var users = await _userService.GetAllUsers();
                var user = users.Find((u) => email == u.Email);
                if (user != null)
                {
                    long userID = user.Id;
                    //long userID = await _userService.GetIDByEmail(email);
                    //if (userID > 0)
                    //{

                    String tfaToken = await _userService.getTFAToken(userID);
                    bool tfastatus = await _userService.getTFAStatus(userID);
                    if (tfaToken != null)
                    {
                        _totpController = new TotpController(userID, tfaToken);
                        Console.WriteLine("Okej je");
                        if (tfastatus)
                        {  
                            return Ok("true");
                        } else
                        {
                            return _totpController.GetQr();
                        }
                        
                    }
                    else
                    {
                        Console.WriteLine("Nije okej");
                        String uniqueUserKey = Guid.NewGuid().ToString();
                        _totpController = new TotpController(userID, uniqueUserKey);
                        await _userService.InsertTwoFactorToken(userID, uniqueUserKey);

                        return _totpController.GetQr();
                    }
                }
                Console.WriteLine("Potpuni promasaj");
                return Ok("");
            }
            catch (Exception ex)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }

        }




        [HttpPost]
        [Route("tfasendcode")]
        public async Task<IActionResult> TFASendCode(int code, String email)
        {

            try
            {
                Console.WriteLine("Code: " + code);
                long userID = await _userService.GetUserID(email);
                String tfaToken = await _userService.getTFAToken(userID);
                TotpController totpController2 = new TotpController(userID, tfaToken);
                bool uspjeh = totpController2.Validate(code);
                if (uspjeh)
                {
                    Boolean tfaStatus = await _userService.getTFAStatus(userID);
                    if (tfaStatus)
                    {
                        return Ok(uspjeh);
                    }
                    else
                    {
                        return Ok(await _userService.ActivateTwoFactorToken(userID));
                        //return await _userService.InsertTwoFactorToken(userID)
                    }
                }
                return BadRequest("Nije uspjesno");

            }
            catch (Exception ex)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }



        #endregion


    }
}
