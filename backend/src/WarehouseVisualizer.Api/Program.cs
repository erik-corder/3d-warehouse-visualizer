using Microsoft.EntityFrameworkCore;
using WarehouseVisualizer.Api.Data;
using WarehouseVisualizer.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Centralized exception-handling baseline (3DW-STORY-001A): unhandled exceptions are
// returned as a problem-details response. Category-specific behavior (tenant/auth,
// data-quality) is added by later stories; this establishes the baseline shape only.
builder.Services.AddProblemDetails();

// EF Core code-first direction (3DW-STORY-001A): no entities yet. The connection
// string value is supplied by 3DW-STORY-001D's local-dev configuration, not here.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Sql")));

// Dependency injection baseline: Scoped lifetime for request-bound services, matching
// ApplicationDbContext's own Scoped lifetime.
builder.Services.AddScoped<IHealthService, HealthService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

// Exposed for WebApplicationFactory<Program> in integration tests.
public partial class Program;
