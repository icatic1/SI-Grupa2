using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
using Microsoft.Net.Http.Headers;
using SIProjectSet1.ViewModels;
using System.Collections;
using System.IO;
using System.Threading.Tasks;


namespace SIProjectSet1.Controllers
{


    /// <summary>
    /// controller for upload large file
    /// </summary>
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
        [Route("ConnectionCheck")]
        public IActionResult ConnectionCheck()
        {
            return Ok();
        }


        /// <summary>
        /// Action for upload large file
        /// </summary>
        /// <remarks>
        /// Request to this action will not trigger any model binding or model validation,
        /// because this is a no-argument action
        /// </remarks>
        /// <returns></returns>
        [HttpPost]
        [Route("UploadLargeFile")]
        public async Task<IActionResult> UploadLargeFile()
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
                    var fileName = contentDisposition.Name.Value;
                    //var MacAddress = contentDisposition.Name.Value;
                    //var saveToPath = Path.Combine(Path.GetTempPath(), fileName);
                    Directory.CreateDirectory(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UserContent", fileName));
                    var saveToPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UserContent", fileName, contentDisposition.FileName.Value);

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

        /// <summary>
        /// Action for returning all files and folders for a given device
        /// </summary>
        /// <remarks></remarks>
        /// <returns></returns>
        [HttpGet]
        [Route("UploadLargeFile/{MacAddress}")]
        public async Task<IActionResult> ReadLargeFileByMac(String MacAddress)
        {
            string path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UserContent", MacAddress);
            string[] entries = Directory.GetFileSystemEntries(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UserContent", MacAddress), "*", SearchOption.AllDirectories);
            //var files = Directory.GetFiles(Path.GetDirectoryName(Path.GetFullPath(FileName)));
            return Ok(entries);
        }


        [HttpGet]
        [Route("GetFilesByMac/{MacAddress}")]
        public async Task<IActionResult> GetFilesByMac(String MacAddress)
        {
            var files = Directory.GetFiles(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UserContent", MacAddress));
            return Ok(files);
        }

        [HttpGet]
        [Route("GetFilesByPathSorted/{path}")]
        public async Task<IActionResult> GetFilesByPathSorted(String path)
        {

            string dirPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UserContent", path);
            if (!Directory.Exists(dirPath)) return NotFound(dirPath);

            var imagesDir = Directory.GetFiles(dirPath).Where(f => (f.EndsWith(".png") || f.EndsWith(".jpg")));
            var videosDir = Directory.GetFiles(dirPath).Where(f => f.EndsWith(".mp4"));
            var filesDir = Directory.GetFiles(dirPath).Where(f => !(f.EndsWith(".mp4") || f.EndsWith(".png") || f.EndsWith(".jpg"))); ;
            var Dirs = Directory.GetDirectories(dirPath);
            var array = new ArrayList();

            var a = new FilesViewModel()
            {
                images = imagesDir,
                videos = videosDir,
                files = filesDir,
                folders = Dirs
            };
            return Ok(a);
        }

    }
}
