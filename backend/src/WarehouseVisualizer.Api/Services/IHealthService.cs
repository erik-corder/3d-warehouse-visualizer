using WarehouseVisualizer.Api.Dtos;

namespace WarehouseVisualizer.Api.Services;

/// <summary>
/// Reports the application's health status.
/// </summary>
public interface IHealthService
{
    /// <summary>
    /// Gets the current health status.
    /// </summary>
    HealthStatusDto GetStatus();
}
