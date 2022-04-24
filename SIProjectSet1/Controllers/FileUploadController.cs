using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
using Microsoft.Net.Http.Headers;
using System.IO;
using System.Threading.Tasks;


namespace SIProjectSet1.Controllers
{


   
    [ApiController]
    [Route("api/[controller]")]
    public class FileUploadController : ControllerBase
    {
        private readonly ILogger<FileUploadController> _logger;

        public FileUploadController(ILogger<FileUploadController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        [Route("ReadLargeFile/{FileName}")]
        public async Task<IActionResult> ReadLargeFile(String FileName)
        {
            var files = Directory.GetFiles(Path.GetDirectoryName(Path.GetFullPath(FileName)));
            return Ok(files);
        }

        [HttpGet]
        [Route("GetFilesByMac/{MacAddress}")]
        public async Task<IActionResult> GetFilesByMac(String MacAddress)
        {
            var files = Directory.GetFiles(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", MacAddress));
            return Ok(files);
        }

    }
}