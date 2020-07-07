using CSRedis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Business.Manage
{
    public class RedisManage
    {
        public CSRedisClient Client { get; set; }

        public RedisManage(string connection)
        {
            Client = new CSRedisClient(connection);
        }
    }
}
