using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIProjectSet1.Entities
{
    public class UserToken
    {
        [Required]
        public long Id { get; set; }
        [Required]
        [ForeignKey("User")]
        public long UserId { get; set; }

        [Required]
        public string JwtToken { get; set; }

        [Required]
        public string TokenExpiration { get; set; }

        public User User { get; set; }
    }
}
