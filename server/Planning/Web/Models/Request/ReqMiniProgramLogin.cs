using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Models.Request
{
    public class ReqMiniProgramLogin
    {
        /// <summary>
        /// 微信code
        /// </summary>
        [Required(ErrorMessage = "缺少Code参数")]
        public string code { get; set; }

        /// <summary>
        /// 用户信息
        /// </summary>
        public Dictionary<string, object> rawData { get; set; }

        /// <summary>
        /// 加密数据
        /// </summary>
        [Required(ErrorMessage = "缺少encryptedData参数")]
        public string encryptedData { get; set; }

        /// <summary>
        /// 加密算法的初始向量
        /// </summary>
        [Required(ErrorMessage = "缺少iv参数")]
        public string iv { get; set; }

        /// <summary>
        /// 签名
        /// </summary>
        [Required(ErrorMessage = "缺少signature参数")]
        public string signature { get; set; }
    }
}
