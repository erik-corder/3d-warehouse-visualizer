using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using WarehouseVisualizer.Api.Dtos;
using WarehouseVisualizer.Api.Services;
using Xunit;

namespace WarehouseVisualizer.Api.Tests;

public class HealthControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public HealthControllerTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetHealth_ReturnsOkWithStatus()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/health");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<HealthStatusDto>();
        Assert.NotNull(body);
        Assert.Equal("ok", body!.Status);
    }

    [Fact]
    public async Task GetHealth_WhenServiceThrows_ReturnsProblemDetailsWithoutLeakingDetail()
    {
        var factory = _factory.WithWebHostBuilder(builder =>
            builder.ConfigureServices(services =>
            {
                services.AddScoped<IHealthService, ThrowingHealthService>();
            }));

        var client = factory.CreateClient();

        var response = await client.GetAsync("/health");

        Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);

        var body = await response.Content.ReadAsStringAsync();
        Assert.DoesNotContain("Simulated failure for HealthControllerTests", body);
        Assert.DoesNotContain("at WarehouseVisualizer", body); // no stack trace frame
    }

    private sealed class ThrowingHealthService : IHealthService
    {
        public HealthStatusDto GetStatus() =>
            throw new InvalidOperationException("Simulated failure for HealthControllerTests");
    }
}
