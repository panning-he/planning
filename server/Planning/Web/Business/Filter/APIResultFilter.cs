using Help.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Web.Business.Filter
{
    public class APIResultFilter : IResultFilter
    {
        public void OnResultExecuted(ResultExecutedContext context)
        {
        }

        public void OnResultExecuting(ResultExecutingContext context)
        {
            if (context.Result is BadRequestObjectResult)
            {
                BadRequestObjectResult res = (BadRequestObjectResult)context.Result;
                ValidationProblemDetails obj = res.Value as ValidationProblemDetails;
                StringBuilder sb = new StringBuilder();
                foreach (var item in obj.Errors)
                {
                    var vals = item.Value as string[];
                    if (vals != null)
                    {
                        sb.AppendLine(vals[0]);
                    }
                }
                JsonData jsonData = new JsonData();
                jsonData.Code = (int)EnumList.RequestStateCode.OperationFail;
                jsonData.Msg = sb.ToString().Replace("\r\n", "");
                context.Result = new JsonResult(jsonData);
                return;
            }
        }
    }
}
