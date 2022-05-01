using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIProjectSet1.Entities
{
    public class File
    {
        [Key]
        [Required]
        public long Id { get; set; }
        [Required]
        public String Name { get; set; }
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public String Type { get; set; }
        [Required]
        public Double Size { get; set; }
        [Required]
        public String Path { get; set; }
    }
}
