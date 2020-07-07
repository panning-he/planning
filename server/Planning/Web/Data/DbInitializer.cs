using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Data
{
    public class DbInitializer
    {
        public static void Initialize(PlanningContext context)
        {
            context.Database.EnsureCreated();
        }
    }
}
