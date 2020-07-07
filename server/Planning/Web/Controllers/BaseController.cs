using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Web.Business.Manage;

namespace Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoggedController : ControllerBase
    {
        public int LoginUserID { get; set; }

        public LoggedController()
        {
            LoginUserID = UserManage.GetLoginUserID();
        }
    }
}