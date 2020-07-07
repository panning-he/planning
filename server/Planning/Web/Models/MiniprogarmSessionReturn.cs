using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Web.Models
{
    public class MiniprogarmSessionReturn
    {
        public string openid { get; set; }

        public string session_key { get; set; }

        public string unionid { get; set; }

        public int errcode { get; set; } = 0;

        public string errMsg { get; set; }
    }
}
