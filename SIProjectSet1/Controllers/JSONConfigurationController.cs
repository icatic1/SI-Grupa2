using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SIProjectSet1.Infrastructure;
using SIProjectSet1.Entities;
using System.Text.Json;
using Newtonsoft.Json.Linq;

namespace SnapshotServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JSONConfigurationController : Controller
    {
        private readonly SIProjectSet1Context _context;

        public JSONConfigurationController(SIProjectSet1Context context)
        {
            _context = context;
        }

        
        // GET: JSONConfiguration/getJSON/ABCDEFGHIJKL
        [HttpGet]
        [Route("getJSON/{MACAddress}")]
        public string GetJSON(string MacAddress)
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", MacAddress);
            var file = Path.Combine(filePath, "configuration.json");
            var content = System.IO.File.ReadAllText(file);
            return content.Length != 0 ? content : "Empty";
        }

        // POST: JSONConfiguration/setJSON/ABCDEFGHIJKL/JSON
        [HttpPost]
        [Route("setJSON")]
        public async Task<bool> SetJSONAsync([FromQuery]string MACAddress, [FromBody]JsonElement JSON)
        {
            try
            {
                var configuration = _context.JsonConfigurations.FirstOrDefaultAsync(configuration => configuration.MacAddress == MACAddress);
                if (configuration.Result != null)
                {
                    configuration.Result.Configuration = JSON.ToString();
                }
                else
                {   
                    //Napisati u file
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", MACAddress);
                    var file = Path.Combine(filePath, "configuration.json");
                    System.IO.File.WriteAllText(file, JSON.ToString());
                }
                return true;

            }
            catch
            {
                return false;
            }
        }
    }
}
