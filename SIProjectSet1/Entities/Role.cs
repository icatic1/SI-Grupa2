using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIProjectSet1.Entities
{
    public class Role
    {



        [Required]
        public long Id { get; set; }

        [Required]
        public String Name { get; set; }


        //[Required]
        //public User User { get; set; }
        [Required]
        public IEnumerable<UserRole> Users { get; set; }
    }
}
