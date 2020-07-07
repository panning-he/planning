using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Models.DB
{
    public class MonthTarget
    {
        [Key]
        public int TargetID { get; set; }

        public int MonthID { get; set; }

        public int UserID { get; set; }

        [StringLength(140)]
        public string Describe { get; set; }

        public byte CompletionStatus { get; set; }

        public byte DeleteStatus { get; set; }

        public DateTime CollectTime { get; set; }
    }
}
