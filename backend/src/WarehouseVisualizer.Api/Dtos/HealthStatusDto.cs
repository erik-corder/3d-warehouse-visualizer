namespace WarehouseVisualizer.Api.Dtos;

/// <summary>
/// Represents the outcome of a health check.
/// </summary>
/// <param name="Status">A short, human-readable status string (e.g. "ok").</param>
public record HealthStatusDto(string Status);
