using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SIProjectSet1.Infrastructure;
using SIProjectSet1.Entities;
using System.Collections.Generic;
using SIProjectSet1.LicenceService;

namespace SnapshotServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    
    public class LicenceController : Controller
    {
        private readonly SIProjectSet1Context _context;
        private readonly ILicenceService _licenceService;

        public LicenceController(SIProjectSet1Context context, ILicenceService licenceService)
        {
            _context = context;
            _licenceService = licenceService;
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
            return BadRequest(licence.Licenced);
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
        public async Task<ActionResult<List<Device>>> GetAllDevices()
        {
            var device = await _licenceService.GetAllDevices();
            return device == null ? new List<Device>() : device;
        }
    }
}
