using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Models.DB
{
    public class YearTarget
    {
        [Key]
        public int TargetID { get; set; }

        public int YearID { get; set; }

        public int UserID { get; set; }

        [StringLength(140)]
        public string Describe { get; set; }

        public byte CompletionState { get; set; }

        public byte DeleteState { get; set; }

        public DateTime CollectTime { get; set; }
    }
}
