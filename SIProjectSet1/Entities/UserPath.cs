using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIProjectSet1.Entities
{
    public class UserPath
    {
        [Required]
        public long Id { get; set; }


        [Required]
        public String MacAddress { get; set; }

        [Required]
        public string Path { get; set; }

    }
}
