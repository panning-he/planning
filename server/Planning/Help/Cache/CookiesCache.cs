using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace Game.Utils.Cache
{
    /// <summary>
    /// 实现了数据的Cookies存储方式
    /// </summary>
    public class CookiesCache : ICache
    {
        #region 构造方法、属性和字段
        public CookiesCache()
        {
        }

        private string _cookiespath = "";

        /// <summary>
        /// 设置cookies的domain路径
        /// </summary>
        public string CookiesPath
        {
            set
            {
                this._cookiespath = value;
            }
            get
            {
                return string.IsNullOrEmpty(this._cookiespath) ? "/" : this._cookiespath;
            }
        }

        /// <summary>
        /// cookies的系统自动过期时间
        /// </summary>
        public DateTime CookiesExpire
        {
            get
            {
                int a = 30;
                //if(!int.TryParse(System.Configuration.ConfigurationManager.AppSettings["CookiesExpire"], out a))
                //{
                //    a = 30;
                //}
                return DateTime.Now.AddMinutes(a);
            }
        }
        /// <summary>
        /// Cookies名称
        /// </summary>
        protected string CookiesName
        {
            get
            {
                string tmp = "CookiesName";
                return string.IsNullOrEmpty(tmp) ? "Default" : tmp;
            }
        }

        /// <summary>
        /// cookies加密校验串，将采用16位md5加密的方法加密cookies字符串，并增加cookies键值对，作为校验串。
        /// </summary>
        /// <remarks>
        /// 加密方法：将当前所有cookies内的值拼凑，并加上校验字符串，md5加密为16位长度的字符串
        /// </remarks>
        protected string ValidateKey = "{D20BA3E5-47C9-471f-94E3-5E810B518EB3}";

        protected string ValidateName = "VS";

        public string ExpireTimeStr
        {
            get
            {
                return "_ETS";
            }
        }
        #endregion

        #region Add
        public void Add(Dictionary<string, object> dic)
        {
            Add(dic, null);
        }

        /// <summary>
        /// 保存数据到cookies
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="timeout">设置全站cookies手动过期时间，读取时判断此时间段，若超时则自动清空cookies，以分钟为单位</param>
        public void Add(Dictionary<string, object> dic, int? timeout)
        {
            string ck = Help.HttpContext.Current.Request.Cookies[this.CookiesName];
            if (ck == null)
            {
                ck = new HttpCookie(this.CookiesName);
            }
            ck.Expires = DateTime.Now.AddYears(50); //this.CookiesExpire;
            ck.Domain = _cookiespath;

            foreach (KeyValuePair<string, object> kvp in dic)
            {
                ck.Values[kvp.Key] = HttpUtility.UrlEncode(kvp.Value.ToString());
                ck.Values[kvp.Key + this.ExpireTimeStr] = (timeout == null) ? HttpUtility.UrlEncode(this.CookiesExpire.ToString("yyyy-MM-dd HH:mm:ss")) : HttpUtility.UrlEncode(DateTime.Now.AddMinutes(timeout.Value).ToString("yyyy-MM-dd HH:mm:ss"));
            }

            //增加校验串
            ck.Values[ValidateName] = GetValidateStr(ck);

            HttpContext.Current.Response.Cookies.Add(ck);
        }

        public void Add(string key, object value)
        {
            Add(key, value, null);
        }

        public void Add(string key, object value, int? timeout)
        {
            HttpCookie ck = System.Web.HttpContext.Current.Request.Cookies[this.CookiesName];
            if (ck == null)
            {
                ck = new HttpCookie(this.CookiesName);
            }
            ck.Expires = DateTime.Now.AddYears(50); //this.CookiesExpire;
            ck.Domain = _cookiespath;

            ck.Values[key] = HttpUtility.UrlEncode(value.ToString());

            ck.Values[key + this.ExpireTimeStr] = (timeout == null) ? HttpUtility.UrlEncode(this.CookiesExpire.ToString("yyyy-MM-dd HH:mm:ss")) : HttpUtility.UrlEncode(DateTime.Now.AddMinutes(timeout.Value).ToString("yyyy-MM-dd HH:mm:ss"));

            //增加校验串
            ck.Values[ValidateName] = GetValidateStr(ck);

            HttpContext.Current.Response.Cookies.Add(ck);
        }
        #endregion

        #region 删除Cookies
        /// <summary>
        /// 清空所有Cookies
        /// </summary>
        public void Delete()
        {
            HttpCookie ck = System.Web.HttpContext.Current.Request.Cookies[this.CookiesName];
            ck.Expires = DateTime.Now.AddYears(-1);
            System.Web.HttpContext.Current.Response.Cookies.Add(ck);
        }

        public void Delete(string key)
        {
            HttpCookie ck = System.Web.HttpContext.Current.Request.Cookies[this.CookiesName];
            ck.Expires = DateTime.Now.AddYears(50);
            ck.Domain = _cookiespath;
            ck.Values[key] = "";
            ck.Values[key + this.ExpireTimeStr] = "";
            //更新校验串
            ck.Values[ValidateName] = GetValidateStr(ck);
            System.Web.HttpContext.Current.Response.Cookies.Add(ck);
        }
        #endregion

        #region 更新Cookies
        public void Update(Dictionary<string, object> dic)
        {
            //Add( dic, null );
            //2010-05-27修改：更新时，不应该同时更新对应项的过期时间
            HttpCookie ck = System.Web.HttpContext.Current.Request.Cookies[this.CookiesName];
            if (ck == null)
            {
                ck = new HttpCookie(this.CookiesName);
            }
            ck.Expires = DateTime.Now.AddYears(50); //this.CookiesExpire;
            ck.Domain = _cookiespath;

            foreach (KeyValuePair<string, object> kvp in dic)
            {
                ck.Values[kvp.Key] = HttpUtility.UrlEncode(kvp.Value.ToString());
            }

            //更新校验串
            ck.Values[ValidateName] = GetValidateStr(ck);

            HttpContext.Current.Response.Cookies.Add(ck);
        }

        public void Update(string key, object value)
        {
            //Add( key, value );
            //2010-05-27修改：更新时，不应该同时更新对应项的过期时间
            HttpCookie ck = System.Web.HttpContext.Current.Request.Cookies[this.CookiesName];
            if (ck == null)
            {
                ck = new HttpCookie(this.CookiesName);
            }
            ck.Expires = DateTime.Now.AddYears(50);
            ck.Domain = _cookiespath;

            ck.Values[key] = HttpUtility.UrlEncode(value.ToString());

            //更新校验串
            ck.Values[ValidateName] = GetValidateStr(ck);

            HttpContext.Current.Response.Cookies.Add(ck);
        }

        #endregion

        #region 取得指定的Cookies的值
        /// <summary>
        /// 取得指定的Cookies的值
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public object GetValue(string key)
        {
            if (key == null || key == "")
                return null;
            HttpCookie ck = System.Web.HttpContext.Current.Request.Cookies[this.CookiesName];
            if (ck == null)
                return null;

            ck.Expires = DateTime.Now.AddYears(50);
            ck.Domain = _cookiespath;

            //如果校验串检测失败，则COOKIES已经被改动，清空COOKIES后返回
            if (!ValidateCookies(ck))
            {
                ck.Expires = DateTime.Now.AddYears(-1);
                System.Web.HttpContext.Current.Response.Cookies.Add(ck);
                return null;
            }

            //检查对应项的过期时间
            string exp = ck.Values[key + this.ExpireTimeStr];
            DateTime expt;
            if (string.IsNullOrEmpty(exp) || !DateTime.TryParse(HttpUtility.UrlDecode(exp), out expt))
            {
                //如果没有对应项的过期时间设置，或被改动，则更新校验串后，返回
                ck.Values[key] = "";
                ck.Values[key + this.ExpireTimeStr] = "";
                ck.Values[ValidateName] = GetValidateStr(ck);
                System.Web.HttpContext.Current.Response.Cookies.Add(ck);
                return null;
            }

            DateTime now = DateTime.Now;
            if (expt > now)
                return System.Web.HttpUtility.UrlDecode(ck.Values[key]);

            //如果已经过期，则更新校验串后返回
            ck.Values[key] = "";
            ck.Values[key + this.ExpireTimeStr] = "";
            ck.Values[ValidateName] = GetValidateStr(ck);
            System.Web.HttpContext.Current.Response.Cookies.Add(ck);
            return null;
        }
        #endregion

        /// <summary>
        /// 索引器
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public object this[string key]
        {
            get
            {
                return GetValue(key);
            }
        }

        #region 获取校验串
        /// <summary>
        /// 获取校验串
        /// </summary>
        /// <param name="ck"></param>
        /// <returns></returns>
        private string GetValidateStr(HttpCookie ck)
        {
            StringBuilder str = new StringBuilder();
            foreach (string tmp in ck.Values.AllKeys)
            {
                if (tmp != ValidateName)
                    str.Append(ck.Values[tmp]);
            }
            str.Append(ValidateKey);
            //增加服务器信息以避免COOKIES欺骗
            string localAddr = HttpContext.Current.Request.ServerVariables["LOCAL_ADDR"];
            string INSTANCE_ID = HttpContext.Current.Request.ServerVariables["INSTANCE_ID"];
            str.Append(HttpContext.Current.Request.ServerVariables["LOCAL_ADDR"]);
            str.Append(HttpContext.Current.Request.ServerVariables["INSTANCE_ID"]);
            //str.Append(HttpContext.Current.Request.ServerVariables["HTTP_USER_AGENT"]);
            //return System.Web.Security.FormsAuthentication.HashPasswordForStoringInConfigFile(str.ToString(), "md5").ToLower().Substring(8, 16);
            //return Utility.MD5(str.ToString()).Substring(8, 16).ToLower();
            MD5CryptoServiceProvider provider = new MD5CryptoServiceProvider();
            string encryptStr = BitConverter.ToString(provider.ComputeHash(Encoding.UTF8.GetBytes(str.ToString())));
            return encryptStr.Replace("-", null).Substring(8, 16);
        }
        #endregion

        #region 检查校验串
        /// <summary>
        /// 检查校验串的有效性
        /// </summary>
        /// <param name="ck"></param>
        /// <returns></returns>
        private bool ValidateCookies(HttpCookie ck)
        {
            string vali = ck.Values[this.ValidateName];
            StringBuilder str = new StringBuilder();
            foreach (string tmp in ck.Values.AllKeys)
            {
                if (tmp != this.ValidateName)
                    str.Append(ck.Values[tmp]);
            }
            str.Append(this.ValidateKey);
            //增加服务器信息以避免COOKIES欺骗
            str.Append(HttpContext.Current.Request.ServerVariables["LOCAL_ADDR"]);
            str.Append(HttpContext.Current.Request.ServerVariables["INSTANCE_ID"]);
            //str.Append(HttpContext.Current.Request.ServerVariables["HTTP_USER_AGENT"]);
            //string currentvali = System.Web.Security.FormsAuthentication.HashPasswordForStoringInConfigFile(str.ToString(), "md5").ToLower().Substring(8, 16);
            MD5CryptoServiceProvider provider = new MD5CryptoServiceProvider();
            string currentvali = BitConverter.ToString(provider.ComputeHash(Encoding.UTF8.GetBytes(str.ToString())));
            provider.Clear();
            currentvali = currentvali.Replace("-", null).Substring(8, 16);
            if (vali.Equals(currentvali))
                return true;
            return false;
        }
        #endregion
    }
}
