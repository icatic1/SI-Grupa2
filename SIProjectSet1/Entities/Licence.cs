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

        public string TerminalID { get; set; }
        public bool Licenced { get; set; }
        public bool DebugLog { get; set; }

        public Licence() { }
    }
}
