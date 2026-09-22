using WarehouseVisualizer.Api.Dtos;

namespace WarehouseVisualizer.Api.Services;

/// <summary>
/// Default <see cref="IHealthService"/> implementation.
/// </summary>
/// <remarks>
/// Story 3DW-STORY-001A scope only: the status is currently always "ok" once the
/// process is running. This is intentionally trivial; the service layer exists so
/// later modules (Import, Sync, Warehouse Objects, Tenancy, Dashboard) follow the
/// same controller -> service -> DTO shape from day one.
/// </remarks>
public sealed class HealthService : IHealthService
{
    public HealthStatusDto GetStatus() => new("ok");
}
