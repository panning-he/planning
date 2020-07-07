using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Game.Utils;
using Help;
using Help.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web.Business.Manage;
using Web.Data;
using Web.Models;
using Web.Models.DB;
using Web.Models.Request;

namespace Web.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly PlanningContext _context;
        private readonly JsonData _jsonData = new JsonData();

        public LoginController(PlanningContext context)
        {
            _context = context;
        }

        /// <summary>
        /// 小程序登录
        /// </summary>
        /// <param name="req"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult<JsonData>> MinProgram(ReqMiniProgramLogin req)
        {
            JsonData jsonData = new JsonData();

            // 参数验证
            if (req == null)
            {
                jsonData.Msg = "登录失败，缺少参数";
                return jsonData;
            }

            // 获取会话
            MiniprogarmSessionReturn miniprogarmSessionReturn = MiniprogramManage.GetSeesion(req.code);
            if (miniprogarmSessionReturn == null)
            {
                jsonData.Msg = "连接微信失败";
                return jsonData;
            }
            else if (miniprogarmSessionReturn.errcode != 0)
            {
                jsonData.Msg = miniprogarmSessionReturn.errMsg;
                return jsonData;
            }

            string strEncryptedData = AES.Aes128CbcDecrypt(req.encryptedData, miniprogarmSessionReturn.session_key, req.iv);
            MiniprogramEncryptedData miniprogramEncryptedData = strEncryptedData.DeserializeObject<MiniprogramEncryptedData>();
            if (miniprogramEncryptedData == null)
            {
                jsonData.Msg = "解密数据失败";
                return jsonData;
            }
            else if (miniprogramEncryptedData.watermark["appid"].ToString() != MiniprogramManage.WechatAppID)
            {
                jsonData.Msg = "appid 错误";
                return jsonData;
            }

            // 签名验证
            string checkSignature = Encryption.SHA1(req.rawData.Serialize() + miniprogarmSessionReturn.session_key).ToLower();
            if (req.signature != checkSignature)
            {
                jsonData.Msg = "登录失败，签名异常";
                return jsonData;
            }

            var user = await _context.User.FirstOrDefaultAsync(u => u.OpenID == miniprogramEncryptedData.openId);
            if (user == null)
            {
                user = new User();
                user.OpenID = miniprogramEncryptedData.openId;
                user.Nickname = miniprogramEncryptedData.nickName;
                user.AvatarUrl = miniprogramEncryptedData.avatarUrl;
                user.RegIP = Request.HttpContext.Connection.RemoteIpAddress.ToString();
                user.RegTime = DateTime.Now;
                user.LastLoginTime = DateTime.Now;
                user.Province = miniprogramEncryptedData.province;
                user.City = miniprogramEncryptedData.city;
                user.Country = miniprogramEncryptedData.country;
                user.Gender = miniprogramEncryptedData.gender;
                _context.User.Add(user);
            }

            _context.SaveChanges();
            Dictionary<string, object> dic = new Dictionary<string, object>();
            string token = UserManage.SetToken(user.UserID);
            UserManage.WriteLoginCookie(token);
            dic.Add("Token", token);
            jsonData.Payload = dic;
            jsonData.SetSuccess("登录成功");
            return jsonData;
        }
    }
}