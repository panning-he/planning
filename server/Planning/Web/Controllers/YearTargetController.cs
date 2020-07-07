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
    public class YearTargetController : LoggedController
    {
        private readonly PlanningContext _context;
        private readonly JsonData _jsonData = new JsonData();

        public YearTargetController(PlanningContext context)
        {
            _context = context;
        }
    }
}