using Microsoft.AspNetCore.Mvc;
using WarehouseVisualizer.Api.Dtos;
using WarehouseVisualizer.Api.Services;

namespace WarehouseVisualizer.Api.Controllers;

/// <summary>
/// Reports whether the API is up and responding.
/// </summary>
[ApiController]
[Route("health")]
public sealed class HealthController(IHealthService healthService) : ControllerBase
{
    /// <summary>
    /// Returns the current health status.
    /// </summary>
    /// <response code="200">The API is up and responding.</response>
    [HttpGet]
    [ProducesResponseType(typeof(HealthStatusDto), StatusCodes.Status200OK)]
    public ActionResult<HealthStatusDto> Get()
    {
        var status = healthService.GetStatus();
        return Ok(status);
    }
}
