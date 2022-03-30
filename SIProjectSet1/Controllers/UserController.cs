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

namespace SIProjectSet1.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly SIProjectSet1Context _context;
        private readonly IUserService _userService;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IConfiguration _configuration;

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
        }

        public UserController(ILogger<UserController> logger, SIProjectSet1Context context, IUserService userService)
        {
            _logger = logger;
            _context = context;
            _userService = userService;
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
                expires: DateTime.Now.AddMinutes(1),
                //claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );

            token.Payload["Roles"] = role;
            token.Payload["email"] = mail;

            return token;
        }
    }
}
