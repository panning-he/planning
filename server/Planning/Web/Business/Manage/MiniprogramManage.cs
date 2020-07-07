using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Web.Models;
using Help;

namespace Web.Business.Manage
{
    public class MiniprogramManage
    {
        private static string code2SessionUrl = "https://api.weixin.qq.com/sns/jscode2session";
        public static string WechatAppID = "wxe38dc0631df78ded";
        public static string WechatAppSecret = "5e27d332f0e3959cfdd4af355a609e65";

        public static MiniprogarmSessionReturn GetSeesion(string code)
        {
            RestClient client = new RestClient(code2SessionUrl);
            var request = new RestRequest(code2SessionUrl, Method.GET);
            string strUsrID = string.Empty;
            request.AddParameter("appid", WechatAppID);
            request.AddParameter("secret", WechatAppSecret);
            request.AddParameter("js_code", code);
            request.AddParameter("grant_type", "authorization_code");
            IRestResponse<MiniprogarmSessionReturn> response = client.Execute<MiniprogarmSessionReturn>(request);
            MiniprogarmSessionReturn model = response.Content.DeserializeObject<MiniprogarmSessionReturn>();
            return model;
        }
    }
}
