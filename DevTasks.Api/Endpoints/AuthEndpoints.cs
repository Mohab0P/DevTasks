using Microsoft.EntityFrameworkCore;
using DevTasks.Api.Data;
using DevTasks.Api.Contracts;
using DevTasks.Api.Models;
using DevTasks.Api.Services;

namespace DevTasks.Api.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/auth").WithTags("Authentication");

        group.MapPost("/register", async (RegisterRequest request, AppDbContext db) =>
        {
            if (await db.Users.AnyAsync(u => u.Email == request.Email))
                return Results.BadRequest(new { message = "Email already exists" });

            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
            };

            db.Users.Add(user);
            await db.SaveChangesAsync();

            return Results.Ok(new { message = "User registered successfully", userId = user.Id });
        });

        group.MapPost("/login", async (LoginRequest request, AppDbContext db, JwtTokenService jwtService) =>
        {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return Results.Unauthorized();

            var token = jwtService.Generate(user);
            return Results.Ok(new AuthResponse(token, user.Id, user.Name, user.Email));
        });
    }
}
