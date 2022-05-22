using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;
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
        private static Dictionary<String, Dictionary<int,bool>> streaming = new Dictionary<String, Dictionary<int, bool>>();
        static Dictionary<string, bool> fileSync = new Dictionary<string, bool>();
        private static Dictionary<String, String> userPathMap = new Dictionary<string, string>();

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
                    var a = fileName.Split('\\')[0];
                    var userPath = await _filesService.GetPathForUser(a);
                    Directory.CreateDirectory(Path.Combine(Path.Combine(userPath), fileName));
                    var saveToPath = Path.Combine(Path.Combine(userPath), fileName, contentDisposition.FileName.Value);

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

        [HttpPost]
        [Route("StreamBase64")]
        public async Task<IActionResult> StreamBase64File([FromQuery] string MACAddress, [FromBody] JsonElement imageBase64ByteArray)
        {
            // add new MAC address to dictionary and create a new queue for livestream
            if (!dictionary.ContainsKey(MACAddress))
            {
                Queue<byte[]> q = new Queue<byte[]>();
                dictionary.Add(MACAddress, q);
            }
            try
            {
                // get all 30 images embedded in the request
                string[]? base64 = (string[])imageBase64ByteArray.Deserialize(typeof(string[]));
                
                // put all image frames into the queue
                if (base64 != null)
                foreach (var image in base64)
                    dictionary[MACAddress].Enqueue(Convert.FromBase64String(image));
                
                // if the queue is overloaded, empty the earliest frames
                while (dictionary[MACAddress].Count >= 1000)
                    dictionary[MACAddress].Dequeue();
                
                _logger.LogInformation("Ok");
                return Ok();
            }
            catch
            {
                return BadRequest(false);
            }
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
                _logger.LogInformation("UnsupportedMediaTypeResult");
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
                    _logger.LogInformation("Ok");
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
            _logger.LogInformation("BadRequest");
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
            var userPath = await _filesService.GetPathForUser(MacAddress);
            string path = Path.Combine(Path.Combine(userPath), MacAddress);
            Directory.CreateDirectory(path);
            string[] entries = Directory.GetFileSystemEntries(Path.Combine(Path.Combine(userPath), MacAddress), "*", SearchOption.AllDirectories);
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
        [Route("ChangeStreamState/{MACAddress}/{state}/{camno}")]
        public async Task<IActionResult> ChangeStreamState(string MACAddress, int state, int camno)
        {
            if (state != 0 && state != 1) return BadRequest("State not valid!");

            // change the stream state
            streaming[MACAddress][camno] = state == 1;

            // empty the queue when ending the stream (if possible)
            if (state == 0)
                if (dictionary.ContainsKey(MACAddress))
                    dictionary[MACAddress].Clear();
            return Ok();
        }

        [HttpGet]
        [Route("GetStreamState/{MACAddress}")]
        public async Task<IActionResult> GetStreamState(string MACAddress)
        {
            Dictionary<int,bool> streamingState;
            if(!streaming.TryGetValue(MACAddress, out streamingState)) {
                streaming[MACAddress] = new Dictionary<int, bool>();
                streaming[MACAddress].Add(0, false);
                streaming[MACAddress].Add(1, false);
                streaming[MACAddress].Add(2, false);
            }

            bool fileState;
            if (!fileSync.TryGetValue(MACAddress, out fileState))
            {
                fileSync[MACAddress] = false;
            }
            var returns = "{ " +
                "\"streaming\" : [" +
                "{ \"camno\" : 1, \"state\" : " + streaming[MACAddress][0].ToString().ToLower() + "}, " +
                "{ \"camno\" : 2, \"state\" : " + streaming[MACAddress][1].ToString().ToLower() + "}, " +
                "{ \"camno\" : 3, \"state\" : " + streaming[MACAddress][2].ToString().ToLower() + "}" +
                "], " +
                "\"filestate\" : " + fileSync[MACAddress].ToString().ToLower() +
                "}";
            return Ok(returns);
        }

        [HttpGet]
        [Route("ChangeFileSyncState/{MACAddress}/{state}")]
        public IActionResult ChangeFileSyncState(string MACAddress, int state)
        {
            if (state != 0 && state != 1) return BadRequest("State not valid!");

            // change the file sync state
            fileSync[MACAddress] = (state == 1);

            return Ok();
        }

        [HttpGet]
        [Route("GetFileSyncState/{MACAddress}")]
        public IActionResult GetFileSyncState(string MACAddress)
        {
            bool state;
            if (!fileSync.TryGetValue(MACAddress, out state))
            {
                fileSync[MACAddress] = false;
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
        public async Task<IActionResult> GetFilesByPathSortedNew(String path, String MacAddress)
        {

            var a = await _filesService.GetPathsSortedNew(path, MacAddress);
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
        public async Task<IActionResult> DownloadFiles([FromQuery] String MacAddress, [FromBody] JsonElement files)
        {

            Console.WriteLine(files);

            List<String> filesList = new List<String>();
            files.GetProperty("files").EnumerateArray().ToList().ForEach(f => filesList.Add(f.ToString()));

            var userPath = await _filesService.GetPathForUser(MacAddress);
            var fajlovi = new List<String>();
            var folderi = new List<String>();
            foreach (var file in filesList)
            {

                var temp = Path.Combine(Path.Combine(userPath), file);
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
                var newFile = file.Replace(Path.Combine(userPath), "");
                newFile = Regex.Replace(newFile, @"^\\[a-zA-Z0-9]{1,}\\[a-zA-Z0-9]{1,}\\", "");
                var fileReturn = archive.CreateEntry(newFile, CompressionLevel.Optimal);
                 using (var writer = fileReturn.Open())
                {
                    using (StreamReader reader = new StreamReader(file))
                    {
                        await reader.BaseStream.CopyToAsync(writer);
                    }
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


        [HttpGet]
        [Route("GetStaticContent")]
        public async Task<IActionResult> GetStaticContent(String path, String MacAddress)
        {
            var a = path.Split("\\");
            var userPath = await _filesService.GetPathForUser(MacAddress);
            if (userPath == null) return BadRequest();
            var sadas = Path.Combine(Path.Combine(userPath), Path.Combine(a));
            Console.WriteLine(sadas);
            try
            {
                var memory = new MemoryStream();
                using (var stream = new FileStream(sadas, FileMode.Open))
                {
                    await stream.CopyToAsync(memory);
                }
                memory.Position = 0;
                //Response.Headers.Add("Content-Disposition", "inline");
                //return new FileStreamResult(memory, GetContentType(path));
                return File(memory, GetContentType(path), Path.GetFileName(path));
            }
            catch (Exception ex)
            {
                return BadRequest("There is not a file present for the provided device. ");
            }

        }

        // Get content type
        private string GetContentType(string path)
        {
            var ext = Path.GetExtension(path).ToLowerInvariant();
            return MimeTypes.GetMimeType(ext);
        }




        [HttpGet]
        [Route("GetPathForUser/{MACAddress}")]
        public async Task<IActionResult> GetPathForUser(String MACAddress)
        {
            var path = await _filesService.GetPathForUser(MACAddress);
            return path != null ? Ok(path) : NotFound();

        }

        [HttpPost]
        [Route("SetPathForUser/{MACAddress}")]
        public async Task<IActionResult> SetPathForUser(String MACAddress, [FromBody] String path)
        {
            try
            {
                var userPath = await _filesService.SetPathForUser(MACAddress, path);
                if (userPath == null) throw new Exception();
                return Ok(path);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }



    }


}
