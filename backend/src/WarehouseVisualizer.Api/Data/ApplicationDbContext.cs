using Microsoft.EntityFrameworkCore;

namespace WarehouseVisualizer.Api.Data;

/// <summary>
/// The application's EF Core code-first database context.
/// </summary>
/// <remarks>
/// Intentionally empty for 3DW-STORY-001A: no <see cref="DbSet{TEntity}"/> members
/// exist yet, and no query or connection is opened by this story. This establishes
/// the EF Core code-first direction (see high-level-design.md, api-and-data-design.md)
/// without speculative schema. The first real entity (WarehouseObject) is introduced
/// by a later story.
/// </remarks>
public sealed class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : DbContext(options)
{
}
