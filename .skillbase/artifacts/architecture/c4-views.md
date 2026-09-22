# C4 Views: 3D Warehouse Visualizer

Companion to `high-level-design.md`. Diagrams kept compact; detail lives in the HLD text.

## System Context

```mermaid
C4Context
    Person(user, "Warehouse Manager / Planner / Operations / Business User", "Views layout, inspects objects, monitors status")
    System(app, "3D Warehouse Visualizer", "Electron desktop app + .NET backend")
    System_Ext(wms, "WMS", "Read-only source of truth for item/location/order data")
    System_Ext(files, "Layout Files", "CSV/XLSX supplied by the tenant")

    Rel(user, app, "Views 3D/2D warehouse, searches, inspects")
    Rel(app, wms, "Reads (never writes)")
    Rel(app, files, "Imports")
```

## Container

```mermaid
C4Container
    Person(user, "User", "Tenant-scoped")
    Container(electron, "Electron Client", "Electron + React + TypeScript", "3D/2D views, search/filter, dashboard")
    Container(api, "Backend API", ".NET 10 / ASP.NET Core", "Modular monolith: Import, Sync, Warehouse Objects, Tenancy, Dashboard")
    Container(worker, "Sync/Import Worker", ".NET Hosted Service", "Scheduled WMS sync, async file import processing")
    ContainerDb(db, "Azure SQL", "EF Core 10 code-first", "Warehouse objects, tenants, app state")
    System_Ext(wms, "WMS", "Read-only")

    Rel(user, electron, "Uses")
    Rel(electron, api, "HTTPS / JSON API")
    Rel(api, db, "EF Core")
    Rel(worker, db, "EF Core")
    Rel(worker, wms, "Read-only polling")
    Rel(api, worker, "Triggers/monitors (in-process)")
```

## Key Component (Backend API)

```mermaid
C4Component
    Container_Boundary(api, "Backend API (modular monolith)") {
        Component(import, "Import Module", "Parses/validates CSV/XLSX, row-level errors")
        Component(sync, "Sync Module", "Maps WMS data to internal model, upserts")
        Component(objects, "Warehouse Objects Module", "Query/filter API for 3D/2D/dashboard")
        Component(tenancy, "Tenancy Module", "Resolves tenant context, fail-closed enforcement")
        Component(dashboard, "Dashboard Module", "Aggregate/summary queries")
    }
    ComponentDb(db, "Azure SQL", "EF Core 10")

    Rel(import, tenancy, "Uses for tenant-scoped writes")
    Rel(sync, tenancy, "Uses for tenant-scoped writes")
    Rel(objects, tenancy, "Uses for tenant-scoped reads")
    Rel(dashboard, objects, "Queries")
    Rel(import, db, "Writes")
    Rel(sync, db, "Writes")
    Rel(objects, db, "Reads")
```

## Deployment / Local Development

```mermaid
flowchart LR
    subgraph Dev["Local Dev (Docker Compose)"]
        API["Backend API container"]
        Worker["Sync/Import Worker container"]
        SQL["Containerized SQL Server / Azure SQL Edge"]
        API --> SQL
        Worker --> SQL
    end
    Electron["Electron Client (native, not containerized)"] -->|HTTPS localhost| API
    subgraph Cloud["Target Deployment"]
        API2["Backend API"]
        Worker2["Sync/Import Worker"]
        AzureSQL["Azure SQL"]
        API2 --> AzureSQL
        Worker2 --> AzureSQL
    end
```

## Data Flow (import/sync to render)

```mermaid
flowchart LR
    File["CSV/XLSX file"] -->|import| ImportMod["Import Module"]
    WMS["WMS (read-only)"] -->|scheduled sync| SyncMod["Sync Module"]
    ImportMod --> Model["Internal Warehouse Object Model"]
    SyncMod --> Model
    Model --> DB[("Azure SQL")]
    DB --> ObjectsAPI["Warehouse Objects API"]
    ObjectsAPI --> View3D["3D View (R3F/Three.js)"]
    ObjectsAPI --> View2D["2D Fallback (table/map)"]
    ObjectsAPI --> Dash["Dashboard"]
```
