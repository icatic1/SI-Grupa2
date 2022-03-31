using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIProjectSet1.Entities
{
    public class TFA
    {

        [Required]
        public long Id { get; set; }


        [Required]
        public long UserId { get; set; }

        [Required]
        public string token { get; set; }

        [Required]
        public bool isActivated { get; set; }

    }
}
