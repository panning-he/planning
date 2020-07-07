using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web.Data;
using Web.Models;
using Web.Business.Filter;
using Help.Models;
using Web.Models.Request;
using Web.Models.DB;

namespace Web.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [CheckLoginApi]
    public class JobsController : LoggedController
    {
        private readonly PlanningContext _context;
        private readonly JsonData _jsonData = new JsonData();

        public JobsController(PlanningContext context)
        {
            _context = context;
        }

        /// <summary>
        /// 获取月任务的数据
        /// </summary>
        /// <param name="dt"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<JsonData>> GetMonthConcise(DateTime dt)
        {
            var startDate = new DateTime(dt.Year, dt.Month, 1);
            var endDate = startDate.AddMonths(1);
            var jobs = await _context.Job.Where(j => j.Time >= startDate && j.Time < endDate).GroupBy(j => j.Time).Select(j => new { Time = j.Key, Count = j.Count() }).ToListAsync();
            _jsonData.Payload = jobs;
            _jsonData.SetSuccess();
            return _jsonData;
        }

        /// <summary>
        /// 添加任务
        /// </summary>
        /// <param name="reqJobAdd"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult<JsonData>> Add(ReqJobAdd reqJobAdd)
        {
            var job = new Job();
            job.UserID = LoginUserID;
            job.CollectTime = DateTime.Now;
            job.Describe = reqJobAdd.Describe;
            job.Time = reqJobAdd.Time.Date;
            await _context.Job.AddAsync(job);
            await _context.SaveChangesAsync();
            return _jsonData;
        }

        /// <summary>
        /// 删除任务
        /// </summary>
        /// <param name="jobID">任务ID</param>
        /// <returns></returns>\
        [HttpPost]
        public async Task<ActionResult<JsonData>> Delete(int jobID)
        {
            var job = await _context.Job.FindAsync(jobID);
            _context.Job.Remove(job);
            await _context.SaveChangesAsync();
            _jsonData.SetSuccess();
            return _jsonData;
        }

        /// <summary>
        /// 修改任务
        /// </summary>
        /// <param name="req"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult<JsonData>> Modify(ReqJobModify req)
        {
            var job = await _context.Job.FindAsync(req.JobID);
            job.Describe = req.Describe;
            job.Time = req.Time.Date;
            await _context.SaveChangesAsync();
            _jsonData.SetSuccess();
            return _jsonData;
        }
    }
}
