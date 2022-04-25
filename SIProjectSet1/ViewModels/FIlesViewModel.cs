using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIProjectSet1.ViewModels
{
    public class FilesViewModel
    {
        public IEnumerable<string> images { get; set; }
        public IEnumerable<string> files { get; set; }
        public IEnumerable<string> videos { get; set; }
        public IEnumerable<string> folders { get; set; }
    }
}