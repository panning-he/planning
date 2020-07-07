using Help.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Business.Filter
{
    public class ApiExceptionFilterAttribute : ExceptionFilterAttribute
    {
        public override void OnException(ExceptionContext context)
        {
            context.Result = BuildExceptionResult(context.Exception);
            base.OnException(context);
        }

        /// <summary>
        /// 包装处理异常格式
        /// </summary>
        /// <param name="ex"></param>
        /// <returns></returns>
        private JsonResult BuildExceptionResult(Exception ex)
        {
            JsonData jsonData = new JsonData();
            jsonData.Code = (int)EnumList.RequestStateCode.SystemError;
            jsonData.Msg = "很抱歉，系统错误";
            jsonData.AddDataItem("ErrorMessage", ex.Message);
            return new JsonResult(jsonData);
        }
    }
}
