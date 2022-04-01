using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SIProjectSet1.Entities
{
    public class SecurityQuestion
    {
        [Required]
        public long Id { get; set; }

        [Required]
        public long UserId { get; set; }

        [Required]
        [Column(TypeName = "varchar(250)")]
        public string Question { get; set; }

        [Required]
        [Column(TypeName = "varchar(250)")]
        public string Answer { get; set; }


    }
}
