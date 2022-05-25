using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SIProjectSet1.Infrastructure;
using SIProjectSet1.Entities;
using System.Collections.Generic;
using SIProjectSet1.LicenceService;
using SIProjectSet1.ViewModels;

namespace SnapshotServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    
    public class LicenceController : Controller
    {
        private readonly SIProjectSet1Context _context;
        private readonly ILicenceService _licenceService;
        private readonly IConfiguration _configuration;
        private static Dictionary<String, String> activationKeys = new Dictionary<String, String>();

        public LicenceController(SIProjectSet1Context context, ILicenceService licenceService, IConfiguration configuration)
        {
            _context = context;
            _licenceService = licenceService;
            _configuration = configuration;
        }

        [HttpGet]
        [Route("ConnectionCheck")]
        public IActionResult ConnectionCheck()
        {
            return Ok();
        }

        [HttpGet]
        [Route("GetTerminalAndDebugLog")]
        public async Task<IActionResult> GetTerminalIDAndDebugLog(string MacAddress)
        {
            var licence = await _licenceService.GetTerminalAndDebug(MacAddress);
            
            return !(licence == null) ? Ok(licence) : BadRequest("Invalid");
        }

        [HttpGet]
        [Route("GetDeviceByMAC")]
        public async Task<IActionResult> GetDeviceByMAC(string MacAddress)
        {
            var device = await _licenceService.GetDevice(MacAddress);

            return !(device == null) ? Ok(device) : BadRequest("Invalid");
        }

        [HttpPost]
        [Route("InitialAddDevice")]
        public async Task<IActionResult> InitialAddDevice(string MacAddress, string TerminalID, Boolean DebugLog = false)
        {
            var terminal = await _licenceService.InitialAddDevice(MacAddress, TerminalID, DebugLog);
            return Ok(terminal);
        }

        [HttpPost]

        [Route("AddDevice")]
        public async Task<IActionResult> AddDevice(string MacAddress, string TerminalID)
        {
            var terminal = await _licenceService.InitialAddDevice(MacAddress, TerminalID);
            return Ok(terminal);
        }

        [HttpPost]
        [Route("UpdateTerminalAndDebugLog")]
        public async Task<IActionResult> UpdateTerminalAndDebugLog(string MacAddress, string TerminalID, Boolean DebugLog)
        {
            var terminal = await _licenceService.UpdateTerminalDebug(MacAddress, TerminalID, DebugLog);
            return Ok(terminal);
        }

        // GET: Licence/ABCDEFGHIJKL
        [HttpGet("{MacAddress}")]
        public async Task<ActionResult<bool>> CheckLicence(string MacAddress)
        {
            var licence = await _licenceService.CheckLicence(MacAddress);
            if (!(licence == null) && licence.Licenced)
                return Ok(licence.Licenced);
            return BadRequest(licence);
        }

        // GET: GetAllLicences/ABCDEFGHIJKL
        [HttpGet("GetAllLicences")]
        public async Task<ActionResult<List<Licence>>> GetAllLicences()
        {
            var licence = await _licenceService.GetAllLicences();
            return licence == null ? new List<Licence>() : licence;
        }

        // GET: GetAllLicences/ABCDEFGHIJKL
        [HttpGet("GetAllDevices")]
        public async Task<ActionResult<List<DeviceViewModel>>> GetAllDevices()
        {
            var device = await _licenceService.GetAllDevices();
            return device == null ? new List<DeviceViewModel>() : device;
        }

        #region Activation Tokens
        [HttpGet("ActivateDevice/{MACAddress}")]
        public async Task<IActionResult> ActivateDevice(String MACAddress, String activationKey)
        {
            string activation;
            if (!activationKeys.TryGetValue(MACAddress, out activation))
            {
                return BadRequest("The provided MAC Address has no activation keys associated with it.");
            }

            if (activation == activationKey)
            {
                var response = await _licenceService.GenerateToken(MACAddress, _configuration);
                return response != null ? Ok(response) : BadRequest("Error occurred!");
            }
            else return BadRequest("Invalid activation key!");

        }

        [HttpGet("DeactivateDevice/{MACAddress}")]
        public async Task<IActionResult> DeactivateDevice(string MACAddress)
        {
            var response = await _licenceService.DeleteToken(MACAddress);
            return response != null ? Ok(response) : BadRequest("Error occurred!");
        }

        [HttpGet("GenerateActivationKey/{MACAddress}")]
        public async Task<IActionResult> GenerateActivationKey(String MACAddress)
        {
            Random rand = new Random();

            var actiCode = await Task.Run(() =>
            {
                var temp = "";
                for (int i = 0; i < 12; i++)
                {
                    temp += rand.Next(10);
                }
                return temp;
            });
            activationKeys[MACAddress] = actiCode;

            return Ok(actiCode);
        }

        [HttpGet("GetActivationStatus/{MACAddress}")]
        public async Task<IActionResult> GetActivationStatus(String MACAddress)
        {
            var response = await _licenceService.GetDeviceToken(MACAddress);
            return Ok(response != null);
        }

        #endregion

    }
}
