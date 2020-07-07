using Game.Utils;
using Help;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Business.Manage
{
    public class UserManage
    {
        /// <summary>
        /// 写入Cookie
        /// </summary>
        public static void WriteLoginCookie(string token)
        {
            CookiesCache.Set("token", token, 60 * 60 * 24 * 30);
        }

        /// <summary>
        /// 验证登录状态
        /// </summary>
        /// <returns></returns>
        public static bool CheckLoginState()
        {
            if (GetLoginUserID() == -1)
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        /// <summary>
        /// 验证Token，返回登录用户UserID
        /// </summary>
        public static int GetLoginUserID()
        {
            string token = GetToken();
            if (string.IsNullOrEmpty(token))
                return -1;
            var payload = JwtHelp.DecryptJWT(token);
            if (payload == null)
                return -1;
            if (payload.Where(p => p.Key == "UserID").Count() == 0)
                return -1;
            return Convert.ToInt32(payload.FirstOrDefault(p => p.Key == "UserID").Value);
        }

        /// <summary>
        /// 从Token获取用户UserID
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        public static int GetLoginUserID(string token)
        {
            if (string.IsNullOrEmpty(token))
                return 0;
            var payload = JwtHelp.DecryptJWT(token);
            if (payload == null)
                return 0;
            if (payload.Where(p => p.Key == "Key").Count() == 0)
                return 0;
            return Convert.ToInt32(payload.FirstOrDefault(p => p.Key == "UserID").Value);
        }

        /// <summary>
        /// 设置Token
        /// </summary>
        /// <param name="userID"></param>
        /// <returns></returns>
        public static string SetToken(int userID)
        {
            Dictionary<string, string> dic = new Dictionary<string, string>();
            dic.Add("UserID", userID.ToString());
            dic.Add("Role", "CommonUser");
            return JwtHelp.CreateJWT(dic, 120);
        }

        /// <summary>
        /// 获取Token
        /// </summary>
        /// <returns></returns>
        public static string GetToken()
        {
            // 从Head里面取Token
            foreach (string item in HttpContext.Current.Request.Headers.Keys)
            {
                if (item == "Authorization")
                {
                    return HttpContext.Current.Request.Headers["Authorization"];
                }
            }
            // 从Cookie里面取Token
            return CookiesCache.GetString("token");
        }
    }
}
