using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SIProjectSet1.Infrastructure;
using SIProjectSet1.Entities;
using System.Text.Json;
using Newtonsoft.Json.Linq;
using Microsoft.Net.Http.Headers;
using Microsoft.AspNetCore.WebUtilities;

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

        [HttpGet]
        [Route("JSONImport/{MacAddress}")]
        // Download file from the server
        public async Task<IActionResult> JSONImport(string MacAddress)
        {
            if (MacAddress == null)
                return BadRequest("Device is not available.");

            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UserContent", MacAddress, "configuration.json");
            try
            {
                var memory = new MemoryStream();
                using (var stream = new FileStream(path, FileMode.Open))
                {
                    await stream.CopyToAsync(memory);
                }
                memory.Position = 0;
                return File(memory, GetContentType(path), Path.GetFileName(path));
            }
            catch (Exception ex)
            {
                return BadRequest("There is not a config file present for the provided device. ");
            }
        }

        // Get content type
        private string GetContentType(string path)
        {
            var types = GetMimeTypes();
            var ext = Path.GetExtension(path).ToLowerInvariant();
            return types[ext];
        }

        // Get mime types
        private Dictionary<string, string> GetMimeTypes()
        {
            return new Dictionary<string, string>
                {
                    {".txt", "text/plain"},
                    {".json", "text/json"}
                };
        }


        [HttpPost]
        [Route("JSONExport")]
        public async Task<IActionResult> JSONExport()
        {
            var request = HttpContext.Request;
            // validation of Content-Type
            // 1. first, it must be a form-data request
            // 2. a boundary should be found in the Content-Type
            if (!request.HasFormContentType ||
                !MediaTypeHeaderValue.TryParse(request.ContentType, out var mediaTypeHeader) ||
                string.IsNullOrEmpty(mediaTypeHeader.Boundary.Value))
            {
                return new UnsupportedMediaTypeResult();
            }
            var reader = new MultipartReader(mediaTypeHeader.Boundary.Value, request.Body);
            var section = await reader.ReadNextSectionAsync();

            // This sample try to get the first file from request and save it
            // Make changes according to your needs in actual use
            while (section != null)
            {
                var hasContentDispositionHeader = ContentDispositionHeaderValue.TryParse(section.ContentDisposition,
                    out var contentDisposition);

                if (hasContentDispositionHeader && contentDisposition.DispositionType.Equals("form-data") &&
                    !string.IsNullOrEmpty(contentDisposition.FileName.Value))
                {
                    // Don't trust any file name, file extension, and file data from the request unless you trust them completely
                    // Otherwise, it is very likely to cause problems such as virus uploading, disk filling, etc
                    // In short, it is necessary to restrict and verify the upload
                    // Here, we just use the temporary folder and a random file name

                    // Get the temporary folder, and combine a random file name with it
                    var fileName = Path.GetRandomFileName();
                    var MacAddress = contentDisposition.Name.Value;
                    //var saveToPath = Path.Combine(Path.GetTempPath(), fileName);
                    Directory.CreateDirectory(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UserContent", MacAddress));
                    var saveToPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UserContent", MacAddress, contentDisposition.FileName.Value);

                    using (var targetStream = System.IO.File.Create(saveToPath))
                    {
                        await section.Body.CopyToAsync(targetStream);
                    }

                    return Ok("Uspjeh");
                }

                section = await reader.ReadNextSectionAsync();
            }

            // If the code runs to this location, it means that no files have been saved
            return BadRequest("No files data in the request.");
        }







        // GET: JSONConfiguration/getJSON/ABCDEFGHIJKL
        [HttpGet]
        [Route("getJSON/{MACAddress}")]
        public string GetJSON(string MACAddress)
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UserContent", MACAddress);
            var file = Path.Combine(filePath, "configuration.json");
            try
            {
                var content = System.IO.File.ReadAllText(file);
                return content.Length != 0 ? content : "{}";
            } catch (Exception e) {
                return "{}";
            }

            
        }

        // POST: JSONConfiguration/setJSON/ABCDEFGHIJKL/JSON
        [HttpPost]
        [Route("setJSON")]
        public async Task<IActionResult> SetJSON([FromQuery] string MACAddress, [FromBody] JsonElement JSON)
        {
            try
            {

                //Napisati u file
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UserContent", MACAddress);
                var file = Path.Combine(filePath, "configuration.json");
                if(!Directory.Exists(filePath))
                    Directory.CreateDirectory(filePath);

                System.IO.File.WriteAllText(file, JSON.ToString());
                

                return Ok(true);

            }
            catch
            {
                return BadRequest(false);
            }
        }
    }
}
