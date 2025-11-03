namespace DevTasks.Api.Contracts;

public record RegisterRequest(string Name, string Email, string Password);
public record LoginRequest(string Email, string Password);
public record AuthResponse(string Token, int UserId, string Name, string Email);
public record ProjectCreateRequest(string Name);
public record ProjectDto(int Id, string Name, int OwnerId);
public record TaskDto(int Id, string Title, string? Description, string Status, int ProjectId, int? AssignedToUserId);
public record TaskCreateRequest(string Title, string? Description, int ProjectId, int? AssignedToUserId, string? Status);
public record TaskUpdateRequest(string? Title, string? Description, string? Status, int? AssignedToUserId);
