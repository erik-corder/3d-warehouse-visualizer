# Engineering Standards Sources

## Frontend Standards

1. TypeScript coding guidelines  
https://digital400.atlassian.net/wiki/spaces/IAPD/pages/373751928/Coding+Guidelines+-+TypeScript+CGTS

2. Frontend architecture guidelines  
https://digital400.atlassian.net/wiki/spaces/IAPD/pages/1225687041/Front+End+Code+Architecture+Diagram+Improvements

Note:
This project is Electron + React + TypeScript, not Next.js. Apply the frontend architecture principles that fit Electron/React. Do not apply Next.js-specific rules.

3. Linters and code formatters  
https://digital400.atlassian.net/wiki/spaces/TD/pages/102924295/Linters+Code+Formatters

## Backend Standards

1. C#/.NET coding guidelines  
https://digital400.atlassian.net/wiki/spaces/IAPD/pages/373751943/Coding+Guidelines+-+C+.NET

## Mandatory Project Engineering Rules

Frontend must use:
- Electron + React + TypeScript
- strict TypeScript
- ESLint
- Prettier
- design system approach
- atomic/component structure where useful
- professional UI patterns
- clear naming conventions
- no Next.js-specific architecture

Backend must use:
- .NET 10
- Entity Framework Core code-first
- controllers
- DTOs
- business/service layer
- repository/data access layer where approved by architecture
- AutoMapper or approved mapping approach
- database-level pagination/filtering/search
- centralized exception handling
- dependency injection
- strong OOP principles
- human-readable code
- clear flow architecture
- performance-aware queries
- tenant isolation