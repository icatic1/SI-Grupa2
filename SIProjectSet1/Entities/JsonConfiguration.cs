using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

#nullable disable

namespace SIProjectSet1.Entities
{
    public partial class JsonConfiguration
    {
        [Key]
        public string MacAddress { get; set; }
        public string Configuration { get; set; }

        public JsonConfiguration() { }
    }
}
