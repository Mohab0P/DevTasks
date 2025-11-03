using Microsoft.EntityFrameworkCore;
using DevTasks.Api.Data;
using DevTasks.Api.Contracts;
using DevTasks.Api.Models;
using System.Security.Claims;

namespace DevTasks.Api.Endpoints;

public static class ProjectEndpoints
{
    public static void MapProjectEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/projects").WithTags("Projects").RequireAuthorization();

        group.MapGet("/", async (ClaimsPrincipal user, AppDbContext db) =>
        {
            var userId = int.Parse(user.FindFirstValue("uid")!);
            var projects = await db.Projects.Where(p => p.OwnerId == userId)
                .Select(p => new ProjectDto(p.Id, p.Name, p.OwnerId)).ToListAsync();
            return Results.Ok(projects);
        });

        group.MapPost("/", async (ProjectCreateRequest request, ClaimsPrincipal user, AppDbContext db) =>
        {
            var userId = int.Parse(user.FindFirstValue("uid")!);
            var project = new Project { Name = request.Name, OwnerId = userId };
            db.Projects.Add(project);
            await db.SaveChangesAsync();
            return Results.Created($"/api/projects/{project.Id}", new ProjectDto(project.Id, project.Name, project.OwnerId));
        });

        group.MapGet("/{id:int}", async (int id, ClaimsPrincipal user, AppDbContext db) =>
        {
            var userId = int.Parse(user.FindFirstValue("uid")!);
            var project = await db.Projects.FirstOrDefaultAsync(p => p.Id == id);
            if (project == null) return Results.NotFound();
            if (project.OwnerId != userId) return Results.Forbid();

            return Results.Ok(new ProjectDto(project.Id, project.Name, project.OwnerId));
        });

        group.MapPut("/{id:int}", async (int id, ProjectCreateRequest request, ClaimsPrincipal user, AppDbContext db) =>
        {
            var userId = int.Parse(user.FindFirstValue("uid")!);
            var project = await db.Projects.FirstOrDefaultAsync(p => p.Id == id);
            if (project == null) return Results.NotFound();
            if (project.OwnerId != userId) return Results.Forbid();

            project.Name = request.Name;
            await db.SaveChangesAsync();

            return Results.Ok(new ProjectDto(project.Id, project.Name, project.OwnerId));
        });

        group.MapDelete("/{id:int}", async (int id, ClaimsPrincipal user, AppDbContext db) =>
        {
            var userId = int.Parse(user.FindFirstValue("uid")!);
            var project = await db.Projects.Include(p => p.Tasks).FirstOrDefaultAsync(p => p.Id == id);
            if (project == null) return Results.NotFound();
            if (project.OwnerId != userId) return Results.Forbid();

            db.Projects.Remove(project);
            await db.SaveChangesAsync();

            return Results.NoContent();
        });

        group.MapGet("/{id:int}/tasks", async (int id, ClaimsPrincipal user, AppDbContext db) =>
        {
            var userId = int.Parse(user.FindFirstValue("uid")!);
            var project = await db.Projects.Include(p => p.Tasks).FirstOrDefaultAsync(p => p.Id == id);
            if (project == null) return Results.NotFound();
            if (project.OwnerId != userId && !project.Tasks.Any(t => t.AssignedToUserId == userId))
                return Results.Forbid();

            var tasks = project.Tasks.Select(t => new TaskDto(t.Id, t.Title, t.Description, t.Status, t.ProjectId, t.AssignedToUserId)).ToList();
            return Results.Ok(tasks);
        });
    }
}
