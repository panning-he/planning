using System;
using System.ComponentModel.DataAnnotations;

namespace Web.Models.DB
{
    public class Target
    {
        [Key]
        public int TargetID { get; set; }

        public int Time { get; set; }

        public int UserID { get; set; }

        public byte TargetType { get; set; }

        [StringLength(140)]
        public string Describe { get; set; }

        public byte CompletionStatus { get; set; }

        public byte DeleteStatus { get; set; }

        public DateTime CollectTime { get; set; }
    }
}