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

        [Authorize(Roles = "Administrator")]
        [HttpPost]
        [Route("AddUser")]
        public async Task<ActionResult<UserViewModel>> AddUser(UserViewModel user)
        {

            try
            {
                if (!ModelState.IsValid) return BadRequest();

                var userAalreadyExists = await _userService.GetUserID(user);
                if (userAalreadyExists != -1000) return BadRequest();

                var successfulAdd = await _userService.AddUser(user);
                if (!successfulAdd) return new StatusCodeResult(StatusCodes.Status500InternalServerError);

                var id = await _userService.GetUserID(user);
                await _userService.MakeUser(id);
                _logger.LogWarning("Dodan novi korisnik s id: " + id);
                return Created(new Uri("/User/AddUser", UriKind.Relative), new {  email = user.Email, name = user.Name, surname = user.Surname, password = user.Password, deletedStatus = user.DeletedStatus });

            }
            catch (Exception ex)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }

        }

        [Authorize(Roles = "Administrator")]
        [HttpPost]
        [Route("AddUserAdmin")]
        public async Task<ActionResult<UserViewModel>> AddUserAdmin(UserViewModel user)
        {

            try
            {
                if (!ModelState.IsValid) return BadRequest();

                var userAalreadyExists = await _userService.GetUserID(user);
                if (userAalreadyExists != -1000) return BadRequest();

                var successfulAdd = await _userService.AddUser(user);
                if (!successfulAdd) return new StatusCodeResult(StatusCodes.Status500InternalServerError);

                var id = await _userService.GetUserID(user);
                await _userService.MakeAdmin(id);
                _logger.LogWarning("Dodan novi admin korisnik s id: " + id);
                return Created(new Uri("/User/AddUser", UriKind.Relative), new {  email = user.Email, name = user.Name, surname = user.Surname, password = user.Password, deletedStatus = user.DeletedStatus });

            }
            catch (Exception ex)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }

        }





        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login(string email, string password)
        {
            var role = await _userService.GetUserRole(email);

            var token = GetToken(email, role);
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
                return NoContent();
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
                    if (tfaToken != null)
                    {
                        _totpController = new TotpController(userID, tfaToken);
                        Console.WriteLine("Okej je");
                        return Ok("true");
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
