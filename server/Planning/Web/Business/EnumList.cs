using Help;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Web.Business
{
    public class EnumList
    {
        #region 请求状态码

        /// <summary>
        /// 请求状态码
        /// </summary>
        public enum RequestStateCode
        {
            /// <summary>
            /// 请求成功
            /// </summary>
            [EnumDescription("请求成功")]
            OK = 200,
            /// <summary>
            /// 登录失效
            /// </summary>
            [EnumDescription("登录失效")]
            LoginLose = 401,
            /// <summary>
            /// 操作失败
            /// </summary>
            [EnumDescription("操作失败")]
            OperationFail = 403,
            /// <summary>
            /// 系统错误
            /// </summary>
            [EnumDescription("系统错误")]
            SystemError = 500
        }

        #endregion
    }
}
