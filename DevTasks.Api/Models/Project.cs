using System.ComponentModel.DataAnnotations;

namespace DevTasks.Api.Models;

/// <summary>
/// Represents a project containing tasks
/// </summary>
public class Project
{
    public int Id { get; set; }

    [Required]
    [StringLength(200)]
    public string Name { get; set; } = string.Empty;

    public int OwnerId { get; set; }

    // Navigation properties
    public User Owner { get; set; } = null!;
    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
}
