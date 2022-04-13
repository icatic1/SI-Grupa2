using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SIProjectSet1.Infrastructure;
using SIProjectSet1.Entities;
using System.Collections.Generic;

namespace SnapshotServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    
    public class LicenceController : Controller
    {
        private readonly SIProjectSet1Context _context;

        public LicenceController(SIProjectSet1Context context)
        {
            _context = context;
        }

        // GET: Licence/ABCDEFGHIJKL
        [HttpGet("{MacAddress}")]
        public bool CheckLicence(string MacAddress)
        {
            var licence = _context.Licences.FirstOrDefaultAsync(licence => licence.MacAddress == MacAddress);
            return !(licence.Result == null) && licence.Result.Licenced;
        }
    }
}
