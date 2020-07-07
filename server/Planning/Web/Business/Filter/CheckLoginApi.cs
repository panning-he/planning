using Help.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Web.Business.Filter
{
    public class CheckLoginApi : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var claims = filterContext.HttpContext.User.Claims;
            string token = string.Empty;
            bool isHaveToken = false;
            foreach (var item in claims)
            {
                if (item.Type == "token")
                {
                    // 进入token验证
                    isHaveToken = true;
                }
            }

            if (!isHaveToken)
            {
                filterContext.Result = ReturnNoLogon();
            }

            //this.OnActionExecuting(filterContext);
        }

        public ContentResult ReturnNoLogon()
        {
            JsonData jsonData = new JsonData();
            jsonData.Code = -1;
            jsonData.Msg = "请登录！";

            return new ContentResult()
            {
                ContentType = "application/json",
                Content = System.Text.Json.JsonSerializer.Serialize(jsonData),
                StatusCode = 200
            };
        }
    }
}