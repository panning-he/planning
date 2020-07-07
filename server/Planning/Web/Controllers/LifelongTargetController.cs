using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Help.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Web.Data;
using Web.Models.DB;

namespace Web.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class LifelongTargetController : LoggedController
    {
        private readonly PlanningContext _context;
        private readonly JsonData _jsonData = new JsonData();

        public LifelongTargetController(PlanningContext context)
        {
            _context = context;
        }

        /// <summary>
        /// 终生目标修改
        /// </summary>
        /// <param name="describe"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult<JsonData>> LifelongModify(string describe)
        {
            LifelongTarget lifelongTarget = await _context.LifelongTarget.FindAsync(LoginUserID);
            if (lifelongTarget == null)
            {
                lifelongTarget = new LifelongTarget();
                _context.LifelongTarget.Add(lifelongTarget);
            }
            lifelongTarget.Describe = describe;
            await _context.SaveChangesAsync();
            return _jsonData;
        }


    }
}