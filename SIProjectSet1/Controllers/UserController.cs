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

namespace SIProjectSet1.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly SIProjectSet1Context _context;
        private readonly IUserService _userService;

        public UserController(ILogger<UserController> logger, SIProjectSet1Context context, IUserService userService)
        {
            _logger = logger;
            _context = context;
            _userService = userService;
        }
        [HttpPost]
        [Route("AddUser")]
        public async Task<ActionResult<UserViewModel>> AddUser(UserViewModel user)
        {

            try
            {
                if (!ModelState.IsValid) return BadRequest();
                var successfulAdd = await _userService.AddUser(user);
                if (!successfulAdd) return new StatusCodeResult(StatusCodes.Status500InternalServerError);
                return Ok();

            }
            catch (Exception ex)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }

        }
        [HttpPut]
        [Route("UpdateUserInfo")]
        public async Task<ActionResult<User>> UpdateUserInfo(UserViewModel user) {
            try { 
                if(!ModelState.IsValid) return BadRequest();
                await _userService.UpdateUserInfo(user);
                return NoContent(); 
            }catch (Exception ex) {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpPut]
        [Route("DeleteUser")]
        public async Task<ActionResult<User>> DeleteUser(string email)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest();
                await _userService.DeleteUser(email);
                return NoContent();
            }
            catch (Exception ex)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }
        [HttpGet]
        [Route("GetAllUsers")]
        public async Task<ActionResult<List<UserViewModel>>> GetAllUsers()
        {
            try {

                var users = await _userService.GetAllUsers();
                return Ok(users);

            }
            catch (Exception ex) {
                return new List<UserViewModel>();
            }
        }
        [HttpPut]
        [Route("ChangeUserPassword")]
        public async Task<ActionResult<User>> ChangeUserPassword(string email,string password)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest();
                await _userService.ChangeUserPassword(email,password);
                return NoContent();
            }
            catch (Exception ex)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
