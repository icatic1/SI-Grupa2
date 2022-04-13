using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

#nullable disable

namespace SIProjectSet1.Entities
{
    public partial class Licence
    {
        [Key]
        public string MacAddress { get; set; }
        public bool Licenced { get; set; }

        public Licence() { }
    }
}
