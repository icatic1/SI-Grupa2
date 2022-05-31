using Microsoft.EntityFrameworkCore;
using SIProjectSet1.Infrastructure;
using SIProjectSet1.ViewModels;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIProjectSet1.FilesService
{
    public interface IFilesService
    {
        Task<FilesViewModel> GetPathsSorted(String path);
        Task<bool> AddFileDB(FileViewModel fileViewModel);

        Task<List<FileViewModel>> GetPathsSortedNew(String path, String MacAdress);

        Task<String> GetPathForUser(String MacAddress);
        Task<String> SetPathForUser(String MacAddress, String path);
        Task<bool> DeleteFiles(String MacAddress, int days);
        Task<List<String>> ReadLargeFileByMac(String MacAddress);
    }

    public class FilesService : IFilesService
    {
        private readonly ILogger<FilesService> _logger;
        private readonly SIProjectSet1Context _context;

        public FilesService(ILogger<FilesService> logger, SIProjectSet1Context context)
        {
            _logger = logger;
            _context = context;
        }
        public async Task<bool> AddFileDB(FileViewModel fileViewModel)
        {

            try
            {
                var file = new Entities.File();

                file.Name = fileViewModel.Name;
                file.Path = fileViewModel.Path;
                file.Type = fileViewModel.Type;
                file.Size = fileViewModel.Size;
                file.Date = fileViewModel.Date;

                _context.Files.Add(file);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<FilesViewModel> GetPathsSorted(String path)
        {

            string dirPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UserContent", path);
            if (!Directory.Exists(dirPath)) return null;

            var imagesDir = Directory.GetFiles(dirPath).Where(f => (f.EndsWith(".png") || f.EndsWith(".jpg")));
            var videosDir = Directory.GetFiles(dirPath).Where(f => f.EndsWith(".mp4"));
            var filesDir = Directory.GetFiles(dirPath).Where(f => !(f.EndsWith(".mp4") || f.EndsWith(".png") || f.EndsWith(".jpg")));
            var Dirs = Directory.GetDirectories(dirPath);
            var array = new ArrayList();

            var a = new FilesViewModel()
            {

                images = imagesDir,
                videos = videosDir,
                files = filesDir,
                folders = Dirs
            };

            return a;
        }
        public async Task<List<FileViewModel>> GetPathsSortedNew(String path, String MacAdress)
        {

            var userPath = await GetPathForUser(MacAdress);
            string dirPath = Path.Combine(Path.Combine(userPath), path) + "\\";
            if (!Directory.Exists(dirPath)) return null;
            var files = await _context.Files.Where(f => f.Path.StartsWith(dirPath)).ToListAsync();

            foreach (var file in files)
            {
                if (file.ExpirationTime < DateTime.Now)
                {
                    file.IsDeleted = true;
                    File.Delete(file.Path);
                }
            }
            await _context.SaveChangesAsync();
            var a = path.Split("\\");
            var lastDir = a[a.Length - 1];

            // var files = Directory.GetFiles(dirPath);
            List<FileViewModel> fileModels = new List<FileViewModel>();
            var tempid = 1;
            foreach (var f in files)
            {
                if (f.IsDeleted) continue;


                bool valid = true;
                String[] chars = f.Path.Split('\\');
                var croppedPath = "";
                var previewPath = "";
                var folderPath = "";

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
                    if (chars[i] == lastDir)
                    {
                        for (var j = i + 1; j < chars.Length; j++)
                        {

                            if (j >= i + 2)
                            {
                                valid = false;
                                break;
                            }
                            else
                            {

                            }
                        }
                        break;
                    }
                }

                for (var i = 0; i < chars.Length; i++)
                {
                    if (chars[i].ToLower() == "usercontent")
                    {
                        for (var j = i + 1; j < chars.Length; j++)
                        {
                            if (j == i + 1)
                                croppedPath = croppedPath + chars[j];
                            //croppedPath = croppedPath + "/" + chars[j];

                            else
                                croppedPath = croppedPath + "%5C" + chars[j];
                        }
                        break;
                    }
                }

                if (valid)
                {
                    var nameOfFile = chars[chars.Length - 1].Split('.');
                    //var obj = { path: image, name: nameOfFile[0], extension: nameOfFile[1], cropped: croppedPath, previewPath: previewPath };

                    //////////
                    var returnFile = new FileViewModel();
                    returnFile.Name = nameOfFile[0];
                    returnFile.Path = f.Path;
                    returnFile.CroppedPath = croppedPath;
                    returnFile.PreviewPath = previewPath;
                    returnFile.Type = nameOfFile[1];
                    returnFile.Date = f.Date;
                    returnFile.Size = new System.IO.FileInfo(f.Path).Length;
                    returnFile.tempId = tempid;
                    tempid++;




                    fileModels.Add(returnFile);
                }
            }
            var Dirs = Directory.GetDirectories(dirPath);
            foreach (var f in Dirs)
            {
                bool valid = true;
                String[] chars = f.Split('\\');
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
                }
                for (var i = 0; i < chars.Length; i++)
                {
                    if (chars[i] == "UserContent")
                    {
                        for (var j = i + 1; j < chars.Length; j++)
                        {
                            if (j == i + 1)
                                croppedPath = croppedPath + "/" + chars[j];
                            else
                                croppedPath = croppedPath + "%5C" + chars[j];

                        }
                        break;
                    }
                }

                if (valid)
                {

                    //var obj = { path: image, name: nameOfFile[0], extension: nameOfFile[1], cropped: croppedPath, previewPath: previewPath };

                    //////////
                    ///

                    var returnFile = new FileViewModel();
                    returnFile.Name = chars[chars.Length - 1];
                    returnFile.Path = f;
                    returnFile.CroppedPath = croppedPath;
                    returnFile.PreviewPath = previewPath;
                    returnFile.Type = "File folder";
                    returnFile.Date = Directory.GetCreationTime(f);
                    returnFile.Size = Directory.EnumerateFiles(f, "*", SearchOption.AllDirectories).Sum(fileInfo => new FileInfo(fileInfo).Length);
                    returnFile.tempId = tempid;
                    tempid++;
                    fileModels.Add(returnFile);
                }

            }
            return fileModels;
        }

        private async void DeleteFiles(string dirPath)
        {
            var files = await _context.Files.Where(f => f.Path.StartsWith(dirPath)).ToListAsync();
            
            
            //string[] entries = Directory.GetFileSystemEntries(dirPath, "*", SearchOption.AllDirectories);
        }

        public async Task<String> GetPathForUser(String MacAddress)
        {
            var userPath = await _context.UserPaths.Where(o => o.MacAddress == MacAddress).SingleOrDefaultAsync();
            if (userPath == null) return null;
            return userPath.Path;

        }

        public async Task<String> SetPathForUser(String MacAddress, String path)
        {
            var userPath = await _context.UserPaths.Where(o => o.MacAddress == MacAddress).SingleOrDefaultAsync();
            if (userPath == null)
            {
                userPath = new Entities.UserPath();
                userPath.MacAddress = MacAddress;
                await _context.UserPaths.AddAsync(userPath);
            }
            userPath.Path = path;
            await _context.SaveChangesAsync();

            return userPath.Path;

        }

        public async Task<bool> DeleteFiles(String MacAddress, int days)
        {
            try
            {
                var files = await _context.Files.Where(f => f.Path.Contains(MacAddress) && !f.IsDeleted).ToListAsync();
                foreach (var file in files)
                {
                    file.ExpirationTime = file.Date.AddDays(days);
                }
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }

        }

        public async Task<List<String>> ReadLargeFileByMac(String MacAddress)
        {
            var userPath = await GetPathForUser(MacAddress);
            string path = Path.Combine(Path.Combine(userPath), MacAddress);
            Directory.CreateDirectory(path);
            string[] entries = Directory.GetFileSystemEntries(Path.Combine(Path.Combine(userPath), MacAddress), "*", SearchOption.AllDirectories);
            //HashSet<FileDeletedViewModel> notDeleted = new HashSet<FileDeletedViewModel>(new SetPathComparer());
            var files = await _context.Files.Where(f => f.Path.Contains(MacAddress) && !f.IsDeleted).ToListAsync();
            List<String> notDeleted = new List<string>();

            foreach (var file in files)
            {
                notDeleted.Add(file.Path);
            }

            return notDeleted;
        }

    }
}
