using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIProjectSet1.Entities
{
    public class DeviceToken
    {
        [Key]
        [Required]
        public string MacAddress { get; set; }

        [Required]
        public string Token { get; set; }

        [Required]
        public string TokenExpiration { get; set; }

        public DeviceToken() { }
    }
}

