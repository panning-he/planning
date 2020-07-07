using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Web.Models
{
    public class MiniprogramEncryptedData
    {
        public string openId { get; set; }

        public string nickName { get; set; }

        public byte gender { get; set; }

        public string city { get; set; }

        public string province { get; set; }

        public string country { get; set; }

        public string avatarUrl { get; set; }

        public string unionId { get; set; }

        public Dictionary<string, object> watermark { get; set; }
    }
}
