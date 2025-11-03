using Microsoft.EntityFrameworkCore;
using DevTasks.Api.Data;
using DevTasks.Api.Contracts;
using DevTasks.Api.Models;
using System.Security.Claims;

namespace DevTasks.Api.Endpoints;

public static class TaskEndpoints
{
    public static void MapTaskEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/tasks").WithTags("Tasks").RequireAuthorization();

        group.MapPost("/", async (TaskCreateRequest request, ClaimsPrincipal user, AppDbContext db) =>
        {
            var userId = int.Parse(user.FindFirstValue("uid")!);
            var project = await db.Projects.FindAsync(request.ProjectId);
            if (project == null) return Results.NotFound(new { message = "Project not found" });
            if (project.OwnerId != userId) return Results.Forbid();

            var task = new TaskItem
            {
                Title = request.Title,
                Description = request.Description,
                Status = request.Status ?? "ToDo",
                ProjectId = request.ProjectId,
                AssignedToUserId = request.AssignedToUserId,
                CreatedAt = DateTime.UtcNow
            };

            db.Tasks.Add(task);
            await db.SaveChangesAsync();

            return Results.Created($"/api/tasks/{task.Id}", new TaskDto(task.Id, task.Title, task.Description, task.Status, task.ProjectId, task.AssignedToUserId));
        });

        group.MapGet("/project/{projectId:int}", async (int projectId, ClaimsPrincipal user, AppDbContext db) =>
        {
            var userId = int.Parse(user.FindFirstValue("uid")!);
            var project = await db.Projects.FindAsync(projectId);
            if (project == null) return Results.NotFound();
            if (project.OwnerId != userId) return Results.Forbid();

            var tasks = await db.Tasks
                .Where(t => t.ProjectId == projectId)
                .Select(t => new TaskDto(t.Id, t.Title, t.Description, t.Status, t.ProjectId, t.AssignedToUserId))
                .ToListAsync();

            return Results.Ok(tasks);
        });

        group.MapGet("/{id:int}", async (int id, ClaimsPrincipal user, AppDbContext db) =>
        {
            var userId = int.Parse(user.FindFirstValue("uid")!);
            var task = await db.Tasks.Include(t => t.Project).FirstOrDefaultAsync(t => t.Id == id);
            if (task == null) return Results.NotFound();
            if (task.Project.OwnerId != userId) return Results.Forbid();

            return Results.Ok(new TaskDto(task.Id, task.Title, task.Description, task.Status, task.ProjectId, task.AssignedToUserId));
        });

        group.MapPut("/{id:int}", async (int id, TaskUpdateRequest request, ClaimsPrincipal user, AppDbContext db) =>
        {
            var userId = int.Parse(user.FindFirstValue("uid")!);
            var task = await db.Tasks.Include(t => t.Project).FirstOrDefaultAsync(t => t.Id == id);
            if (task == null) return Results.NotFound();
            if (task.Project.OwnerId != userId) return Results.Forbid();

            if (request.Title != null) task.Title = request.Title;
            if (request.Description != null) task.Description = request.Description;
            if (request.Status != null) task.Status = request.Status;
            if (request.AssignedToUserId.HasValue) task.AssignedToUserId = request.AssignedToUserId;

            await db.SaveChangesAsync();

            return Results.Ok(new TaskDto(task.Id, task.Title, task.Description, task.Status, task.ProjectId, task.AssignedToUserId));
        });

        group.MapDelete("/{id:int}", async (int id, ClaimsPrincipal user, AppDbContext db) =>
        {
            var userId = int.Parse(user.FindFirstValue("uid")!);
            var task = await db.Tasks.Include(t => t.Project).FirstOrDefaultAsync(t => t.Id == id);
            if (task == null) return Results.NotFound();
            if (task.Project.OwnerId != userId) return Results.Forbid();

            db.Tasks.Remove(task);
            await db.SaveChangesAsync();

            return Results.NoContent();
        });
    }
}
