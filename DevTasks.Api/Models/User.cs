using System.ComponentModel.DataAnnotations;

namespace DevTasks.Api.Models;

/// <summary>
/// Represents a user in the system
/// </summary>
public class User
{
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(200)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    // Navigation properties
    public ICollection<Project> OwnedProjects { get; set; } = new List<Project>();
    public ICollection<TaskItem> TasksAssigned { get; set; } = new List<TaskItem>();
}
