using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.Business;
using Web.Models;
using Web.Models.DB;

namespace Web.Data
{
    public class PlanningContext : DbContext
    {
        public PlanningContext(DbContextOptions<PlanningContext> options) : base(options)
        {
        }

        public PlanningContext()
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer(Setting.ConnectionString);
            }
        }

        public DbSet<User> User { get; set; }
        public DbSet<Target> Target { get; set; }
        public DbSet<Job> Job { get; set; }
        public DbSet<LifelongTarget> LifelongTarget { get; set; }
        public DbSet<YearTarget> YearTarget { get; set; }
        public DbSet<MonthTarget> MonthTarget { get; set; }
        public DbSet<WeekTarget> WeekTarget { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
        }
    }
}
