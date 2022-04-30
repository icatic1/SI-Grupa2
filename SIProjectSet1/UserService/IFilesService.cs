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

        public async Task<FilesViewModel> GetPathsSorted(String path)
        {

                string dirPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UserContent", path);
                if (!Directory.Exists(dirPath)) return null;

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

            return a;
        }
    }
}
