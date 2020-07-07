using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Models.Request
{
    public class ReqJobModify
    {
        public int JobID { get; set; }

        [Required(ErrorMessage = "请描述你的计划哦")]
        public string Describe { get; set; }

        [Required(ErrorMessage = "请选择时间哦")]
        public DateTime Time { get; set; }
    }
}
