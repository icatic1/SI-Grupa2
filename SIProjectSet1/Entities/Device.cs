using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIProjectSet1.Entities
{
    public partial class Device
    {
        [Key]
        public string MacAddress { get; set; }

        public string TerminalID { get; set; }


        public Device() { }
    }
}
