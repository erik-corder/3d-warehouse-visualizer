using WarehouseVisualizer.Api.Services;
using Xunit;

namespace WarehouseVisualizer.Api.Tests;

public class HealthServiceTests
{
    [Fact]
    public void GetStatus_ReturnsOk()
    {
        var service = new HealthService();

        var result = service.GetStatus();

        Assert.Equal("ok", result.Status);
    }
}
