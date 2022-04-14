using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SIProjectSet1.Infrastructure;
using SIProjectSet1.Entities;
using System.Text.Json;

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
            var configuration = _context.JsonConfigurations.FirstOrDefaultAsync(configuration => configuration.MacAddress == MacAddress);
            if (configuration.Result == null)
                return "Empty output";

            return configuration.Result.Configuration;
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
                    _context.JsonConfigurations.Add(
                        new JsonConfiguration()
                        {
                            MacAddress = MACAddress,
                            Configuration = JSON.ToString()
                        });

                _context.SaveChanges();
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
