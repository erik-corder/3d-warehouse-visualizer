# File Impact Map: 3DW-STORY-001A

Companion to `low-level-design.md`. This is a map for future implementation; no implementation files are created by this LLD.

## Expected files to create

**Backend (10):**
- `backend/WarehouseVisualizer.sln`
- `backend/src/WarehouseVisualizer.Api/WarehouseVisualizer.Api.csproj`
- `backend/src/WarehouseVisualizer.Api/Program.cs`
- `backend/src/WarehouseVisualizer.Api/appsettings.json`
- `backend/src/WarehouseVisualizer.Api/appsettings.Development.json`
- `backend/src/WarehouseVisualizer.Api/Controllers/HealthController.cs`
- `backend/src/WarehouseVisualizer.Api/Services/IHealthService.cs`
- `backend/src/WarehouseVisualizer.Api/Services/HealthService.cs`
- `backend/src/WarehouseVisualizer.Api/Dtos/HealthStatusDto.cs`
- `backend/src/WarehouseVisualizer.Api/Data/ApplicationDbContext.cs`

**Backend tests (2):**
- `backend/tests/WarehouseVisualizer.Api.Tests/HealthControllerTests.cs`
- `backend/tests/WarehouseVisualizer.Api.Tests/HealthServiceTests.cs`

**Total new files: 12**

## Expected files to modify

None. This story creates only new, isolated files under `backend/`. (`.env.example` and `README.md` updates belong to `3DW-STORY-001D`, not this story — avoiding duplicate ownership of those two files across children.)

## Files explicitly not to touch

`frontend/**` (out of scope — `3DW-STORY-001B`/`001C`), `docker-compose.yml` (out of scope — `3DW-STORY-001D`), `.env.example`, `README.md` (owned by `3DW-STORY-001D`), `.skillbase/**`, `docs/adr/**`, `CLAUDE.md`, `.claude/**`, `.gitignore` (existing patterns already cover `bin/`/`obj/`).

## Expected backend impact

New, isolated `backend/` directory. No existing backend code exists to modify (first backend story).

## Expected frontend impact

None — out of scope.

## Expected database impact

None. `ApplicationDbContext` is registered but has no `DbSet`s; nothing queries a real database in this story.

## Migration expectation

**No.** No entities exist yet.

## Docker expectation

**No** — Docker Compose is `3DW-STORY-001D`'s scope, not this story's. This story's code runs standalone (`dotnet run`) for its own manual verification.

## Test files expected

2: `HealthControllerTests.cs` (integration), `HealthServiceTests.cs` (unit). Included in the total above.

## PR size estimate

**Total changed files: 12 (10 create + 2 test).**

**Size: M** (11-15 files, per the skill's guardrail table). Within guardrails — not "Too large."

## Split recommendation

None needed. 12 files is within the M guardrail as a single PR; no further split is warranted for this child story.
