using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIProjectSet1.Entities
{
    public class User
    {

        [Required]
        public long Id { get; set; }

        [Required]
        [Column(TypeName ="varchar(250)")]
        public string Email { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Surname { get; set; }

        [Required]
        public string Password { get; set; }


        [Required]
        public bool DeletedStatus { get; set; }

        [Required]
        public IEnumerable<UserRole> Roles { get; set; }

    }
}
