using System.ComponentModel.DataAnnotations;

namespace DevTasks.Api.Models;

/// <summary>
/// Represents a task item in a project
/// </summary>
public class TaskItem
{
    public int Id { get; set; }

    [Required]
    [StringLength(300)]
    public string Title { get; set; } = string.Empty;

    [StringLength(2000)]
    public string? Description { get; set; }

    [Required]
    [StringLength(50)]
    public string Status { get; set; } = "ToDo";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int ProjectId { get; set; }

    public int? AssignedToUserId { get; set; }

    // Navigation properties
    public Project Project { get; set; } = null!;
    public User? AssignedToUser { get; set; }
}
