using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIProjectSet1.Entities
{
    public class UserRole
    {
        [Required]
        public long Id { get; set; }

        [Required]
        [ForeignKey("User")]
        public long UserId { get; set; }
        [Required]
        [ForeignKey("Role")]
        public long RoleId { get; set; }

        public User User { get; set; }
        public Role Role { get; set; }
    }
}
