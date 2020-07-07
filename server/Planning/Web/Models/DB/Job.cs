using System;
using System.ComponentModel.DataAnnotations;

namespace Web.Models.DB
{
    public class Job
    {
        [Key]
        public int JobID { get; set; }

        public int UserID { get; set; }

        public DateTime Time { get; set; }

        [StringLength(200)]
        public string Describe { get; set; }

        public byte CompletionState { get; set; }

        public byte DeleteState { get; set; }

        public DateTime CollectTime { get; set; }
    }
}