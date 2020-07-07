using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Help.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Web.Business.Manage;
using Web.Models;
using System.Security.Claims;
using Web.Business.Filter;
using System.Net;
using Help;

namespace Web.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class LogonBakController : ControllerBase
    {
        private readonly IOptions<MyConfig> config;
        private JsonData jsonData = new JsonData();
        public IAuthenticationSchemeProvider authenticationSchemeProvider;

        public LogonBakController(IOptions<MyConfig> _config, IAuthenticationSchemeProvider _authenticationSchemeProvider)
        {
            config = _config;
            authenticationSchemeProvider = _authenticationSchemeProvider;
        }

        [HttpPost]
        public ActionResult<JsonData> WechatMiniP()
        {
            return jsonData;
        }

        [HttpGet]
        public async Task<ActionResult<JsonData>> WriteCookie()
        {
            RedisManage redisManage = new RedisManage(config.Value.RedisConnection);
            redisManage.Client.Set("first_key", "test_str");
            var first = redisManage.Client.Get("first_key");

            LogonUser logonUser = new LogonUser { UserName = "何涛", Email = "hetaoz@163.com" };

            var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, "何涛"),
                    new Claim("Email", "hetaoz@163.com"),
                    new Claim(ClaimTypes.Role, "Administrator"),
                    new Claim("token", "VVVVVVVVVVV")
                };

            var claimsIdentity = new ClaimsIdentity(
                claims, CookieAuthenticationDefaults.AuthenticationScheme);

            var authProperties = new AuthenticationProperties
            {
                AllowRefresh = true,
                // Refreshing the authentication session should be allowed.

                //ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(10),
                // The time at which the authentication ticket expires. A 
                // value set here overrides the ExpireTimeSpan option of 
                // CookieAuthenticationOptions set with AddCookie.

                IsPersistent = true
                // Whether the authentication session is persisted across 
                // multiple requests. When used with cookies, controls
                // whether the cookie's lifetime is absolute (matching the
                // lifetime of the authentication ticket) or session-based.

                //IssuedUtc = <DateTimeOffset>
                // The time at which the authentication ticket was issued.

                //RedirectUri = <string>
                // The full path or absolute URI to be used as an http 
                // redirect response value.
            };

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity),
                authProperties);

            //await HttpContext.SignInAsync(
            //   "User",
            //   new ClaimsPrincipal(claimsIdentity),
            //   authProperties);

            return jsonData;
        }

        [CheckLoginApi]
        public async Task<ActionResult<JsonData>> ReadCookie()
        {
            var cookie = await authenticationSchemeProvider.GetAllSchemesAsync();
            HttpContext.Response.Cookies.Append("", "");

            return jsonData;
        }

        [CheckLoginApi]
        public ActionResult<JsonData> Check()
        {
            jsonData.SetSuccess();
            return jsonData;
        }

        public ActionResult<JsonData> GetIP()
        {
            IPAddress ip = HttpContext.Connection.RemoteIpAddress;
            jsonData.AddDataItem("IP_str_3", ip.ToString());
            byte[] y = ip.GetAddressBytes();
            jsonData.AddDataItem("IP_str_2", y.ToCutsomString('.'));
            jsonData.SetSuccess();
            return jsonData;
        }
    }

    public class LogonUser
    {
        public string UserName { get; set; }

        public string Email { get; set; }
    }
}