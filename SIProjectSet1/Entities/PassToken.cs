using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SIProjectSet1.Entities
{
    public class PassToken
    {

        [Required]
        public long Id { get; set; }

        [Required]
        [Column(TypeName = "varchar(250)")]
        public string Email { get; set; }

        [Required]
        [Column(TypeName = "varchar(250)")]
        public string ResetToken { get; set; }


    }
}
