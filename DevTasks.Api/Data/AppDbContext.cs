using Microsoft.EntityFrameworkCore;
using DevTasks.Api.Models;

namespace DevTasks.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<TaskItem> Tasks => Set<TaskItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Email).IsUnique();
            entity.HasMany(u => u.OwnedProjects).WithOne(p => p.Owner).HasForeignKey(p => p.OwnerId).OnDelete(DeleteBehavior.Restrict);
            entity.HasMany(u => u.TasksAssigned).WithOne(t => t.AssignedToUser).HasForeignKey(t => t.AssignedToUserId).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Project>(entity =>
        {
            entity.HasMany(p => p.Tasks).WithOne(t => t.Project).HasForeignKey(t => t.ProjectId).OnDelete(DeleteBehavior.Cascade);
        });

        // Seed data will be added manually after first run
    }
}
