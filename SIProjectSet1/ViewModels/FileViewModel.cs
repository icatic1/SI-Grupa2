using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIProjectSet1.ViewModels
{
    public class FileViewModel
    {
    
        public long Id { get; set; }
        public String Name { get; set; }
        public DateTime Date { get; set; }
        public String Type { get; set; }
        public Double Size { get; set; }
        public String Path { get; set; }
        public String CroppedPath { get; set; }
        public String PreviewPath { get; set; }
        public long tempId { get; set; }
    }
}
