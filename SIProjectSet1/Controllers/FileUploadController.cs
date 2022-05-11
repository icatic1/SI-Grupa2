using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
using Microsoft.Net.Http.Headers;
using SIProjectSet1.FilesService;
using SIProjectSet1.ViewModels;
using System.IO;
using System.IO.Compression;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
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
        private readonly IFilesService _filesService;
        private static byte[]? imageBase64ByteArray;
        private static Queue<byte[]> queue = new Queue<byte[]>();
        private static Dictionary<String, Queue<byte[]>> dictionary = new Dictionary<String, Queue<byte[]>>();
        private static Dictionary<String, bool> streaming = new Dictionary<String, bool>();

        public FileUploadController(ILogger<FileUploadController> logger, IFilesService filesService)
        {
            _logger = logger;
            _filesService = filesService;
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
                    //////////

                    String[] chars = saveToPath.Split('\\');
                    var croppedPath = "";
                    var previewPath = "";

                    for (var i = 0; i < chars.Length; i++)
                    {
                        if (chars[i] == "wwwroot")
                        {
                            for (var j = i + 1; j < chars.Length; j++)
                            {
                                previewPath = previewPath + "\\" + chars[j];
                            }
                            break;
                        }
                    };

                    for (var i = 0; i < chars.Length; i++)
                    {
                        if (chars[i] == "UserContent")
                        {
                            for (var j = i + 1; j < chars.Length; j++)
                            {
                                croppedPath = croppedPath + "%5C" + chars[j];
                            }
                            break;
                        }
                    }
                    var nameOfFile = chars[chars.Length - 1].Split('.');
                    //var obj = { path: image, name: nameOfFile[0], extension: nameOfFile[1], cropped: croppedPath, previewPath: previewPath };

                    //////////
                    var returnFile = new FileViewModel();
                    returnFile.Name = nameOfFile[0];
                    returnFile.Path = saveToPath;
                    returnFile.CroppedPath = croppedPath;
                    returnFile.PreviewPath = previewPath;
                    returnFile.Type = nameOfFile[1];
                    returnFile.Date = DateTime.Now;
                    returnFile.Size = new System.IO.FileInfo(saveToPath).Length;

                    return await _filesService.AddFileDB(returnFile) ? Ok("Uspjeh") : BadRequest("Neuspjeh");
                }

                section = await reader.ReadNextSectionAsync();
            }

            // If the code runs to this location, it means that no files have been saved
            return BadRequest("No files data in the request.");
        }


        /// <summary>
        /// Action for live streaming large files
        /// </summary>
        /// <remarks>
        /// Request to this action will not trigger any model binding or model validation,
        /// because this is a no-argument action
        /// </remarks>
        /// <returns></returns>
        [HttpPost]
        [Route("StreamLargeFile")]
        public async Task<IActionResult> LiveStreamLargeFile()
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
                    //Directory.CreateDirectory(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UserContent", fileName));
                    //var saveToPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UserContent", fileName, contentDisposition.FileName.Value);

                    //using (var targetStream = System.IO.File.Create(saveToPath))
                    //{
                    //    await section.Body.CopyToAsync(targetStream);
                    //}
                    //////////
                    ///


                    //await section.Body.ReadAsync(imageBase64ByteArray, 0, (int)section.Body.Length);
                    MemoryStream ms = new MemoryStream();
                    await section.Body.CopyToAsync(ms);
                    imageBase64ByteArray = ms.ToArray();
                    dictionary[fileName].Enqueue(imageBase64ByteArray);
                    while(dictionary[fileName].Count >= 150)
                    {
                        dictionary[fileName].Dequeue();
                    }
                    return Ok();

                    //if (imageBase64ByteArray != null)
                    //{
                    //    var data = Encoding.UTF8.GetString(imageBase64ByteArray);
                    //    data = data.Replace("data:image/png;base64,", "");
                    //    byte[] imageData = Convert.FromBase64String(data);
                    //    return Ok();
                    //}
                    //return BadRequest("Neki error bio");


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
            Directory.CreateDirectory(path);
            string[] entries = Directory.GetFileSystemEntries(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UserContent", MacAddress), "*", SearchOption.AllDirectories);
            //var files = Directory.GetFiles(Path.GetDirectoryName(Path.GetFullPath(FileName)));
            return Ok(entries);
        }


        [HttpGet]
        [Route("GetLiveFile/{MACAddress}")]
        public async Task<IActionResult> GetLiveFile(String MACAddress)
        {
            String? data = "";
            //if (imageBase64ByteArray != null)
            //{
                //data = Encoding.UTF8.GetString(imageBase64ByteArray);
                //data = data.Replace("data:image/png;base64,", "");
                //byte[] imageData = Convert.FromBase64String(data);
                return Ok(Convert.ToBase64String(dictionary[MACAddress].Dequeue()));
            //}
            //else return BadRequest("Errorcina");
        }
        

        [HttpGet]
        [Route("ChangeStreamState/{MACAddress}/{state}")]
        public async Task<IActionResult> ChangeStreamState(string MACAddress, int state)
        {
            if (state != 0 && state != 1) return BadRequest("State not valid!");

            streaming[MACAddress] = (state == 1);
            return Ok();
        }

        [HttpGet]
        [Route("GetStreamState/{MACAddress}")]
        public async Task<IActionResult> GetStreamState(string MACAddress)
        {
            bool state;
            if(!streaming.TryGetValue(MACAddress, out state)) {
                streaming[MACAddress] = false;
            }
            return Ok(state);
        }


        [HttpGet]
        [Route("GetFilesByPathSorted/{path}")]
        public async Task<IActionResult> GetFilesByPathSorted(String path)
        {

            var a = await _filesService.GetPathsSorted(path);
            return Ok(a);
        }


        [HttpGet]
        [Route("GetFilesByPathSortedNew/{path}")]
        public async Task<IActionResult> GetFilesByPathSortedNew(String path)
        {

            var a = await _filesService.GetPathsSortedNew(path);
            if (a != null) return Ok(a);
            return BadRequest(a);
        }

        #region TestRoute
        [HttpGet]
        [Route("Tester")]
        public async Task<IActionResult> Tester()
        {

            string dirPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UserContent", "Test");
            if (!Directory.Exists(dirPath)) return null;
            List<byte[]> lista = new List<byte[]>();
            var imagesDir = Directory.GetFiles(dirPath);
            foreach (var image in imagesDir)
            {
                try
                {
                    var memory = new MemoryStream();
                    using (var stream = new FileStream(image, FileMode.Open))
                    {
                        await stream.CopyToAsync(memory);

                    }
                    byte[] array = memory.ToArray();
                    lista.Add(array);
                    memory.Position = 0;

                }
                catch (Exception ex)
                {
                    return BadRequest("There is not a config file present for the provided device. ");
                }
            }

            for (int i = 0; i < 2; i++)
            {
                for (int j = 0; j < lista.Count; j++)
                {
                    Queue<byte[]> queue;
                    if(dictionary.TryGetValue("Test", out queue))
                    {
                        queue.Enqueue(lista[j]);
                    } else
                    {
                        dictionary["Test"] = new Queue<byte[]>();
                    }
                }
            }
            while (dictionary["Test"].Count >= 150)
            {
                dictionary["Test"].Dequeue();
            }
            return Ok();

        }
        #endregion



        [HttpPost]
        [Route("DownloadFiles")]
        // Download file from the server
        public async Task<IActionResult> DownloadFiles([FromBody] JsonElement files)
        {



            List<String> filesList = new List<String>();
            files.GetProperty("files").EnumerateArray().ToList().ForEach(f => filesList.Add(f.ToString()));

            var fajlovi = new List<String>();
            var folderi = new List<String>();
            foreach (var file in filesList)
            {
                var temp = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UserContent", file);
                if (Directory.Exists(temp))
                {
                    folderi.Add(temp);
                    var subfolders = Directory.GetDirectories(temp);
                    if (subfolders != null && subfolders.Length > 0) folderi.AddRange(subfolders);
                    foreach (var f in subfolders)
                    {
                        fajlovi.AddRange(Directory.GetFiles(f));
                    }
                    fajlovi.AddRange(Directory.GetFiles(temp));
                }
                else if (System.IO.File.Exists(temp)) fajlovi.Add(temp);

            }

            if (System.IO.File.Exists("archive.zip"))
                System.IO.File.Delete("archive.zip");

            var archiveName = @"archive-" + DateTime.Now.Year + DateTime.Now.Month + DateTime.Now.Day + "-" + DateTime.Now.Hour + DateTime.Now.Minute + DateTime.Now.Second + ".zip";
            using var archive =
                ZipFile
                .Open(archiveName, ZipArchiveMode.Create);

            //foreach (var file in fajlovi)
            //{
            //    var entry =
            //        archive.CreateEntryFromFile(
            //            file,
            //            Path.GetFileName(file),
            //            CompressionLevel.Optimal
            //        );

            //    Console.WriteLine($"{entry.FullName} was compressed.");
            //}

            foreach (var file in fajlovi)
            {
                var newFile = file.Replace(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UserContent"), "");
                newFile = Regex.Replace(newFile, @"^\\[a-zA-Z0-9]{1,}\\[a-zA-Z0-9]{1,}\\", "");
                var fileReturn = archive.CreateEntry(newFile, CompressionLevel.Optimal);
                using (StreamWriter writer = new StreamWriter(fileReturn.Open()))
                using (StreamReader reader = new StreamReader(file))
                {
                    writer.Write(reader.ReadToEnd());
                }
            }


            archive.Dispose();

            try
            {
                var memory = new MemoryStream();
                using (var stream = new FileStream(archiveName, FileMode.Open))
                {
                    await stream.CopyToAsync(memory);
                }
                memory.Position = 0;
                return File(memory, "application/zip", Path.GetFileName(archiveName.ToString()));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


    }

}
