using Microsoft.EntityFrameworkCore;

namespace TaskMaster.API.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { 

        }

        public DbSet<Task> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Task>().Property(t => t.CreatedAt).HasDefaultValueSql("NOW()");
        }
    }
}
