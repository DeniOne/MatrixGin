# Tech Context: MatrixGin

## Technology Stack

### Backend
- **Core**: Node.js (TypeScript)
- **Frameworks**: 
    - Express/NestJS (Main API)
    - Fastify (PSEE Write-Engine)
- **Database**: PostgreSQL (via Prisma ORM)
- **Cache/Session**: Redis
- **Security**: Passport.js (JWT Strategy)

### Frontend
- **Framework**: React (Vite)
- **State Management**: Redux Toolkit (RTK Query)
- **UI Library**: Ant Design (AntD)
- **Styling**: Vanilla CSS (TailwindCSS used where requested)

### Integration
- **Telegram Bot**: Node.js (Telegraf)
- **Registry**: Custom implementation with Prisma projections

## Development Standards
- **Naming**: `snake_case` для БД/DTO, `camelCase` для JS/TS, `PascalCase` для React-компонентов.
- **Audit**: Каждое mutation-действие должно логироваться через `auditLog` или `history`.
- **Typing**: Strict TypeScript. Использование `any` запрещено без веской причины.
- **GMC Compliance**: Все экономические операции должны проходить через `CanonicalGuard`.

## Infrastructure
- **Secure Core**: Локальное развертывание, отсутствие внешних API в критических зонах.
- **Environment**: Настройка через `.env`.

## Module Dependencies
1.  **Auth (01)** -> All
2.  **Employee (02)** -> OFS, Tasks, MES
3.  **Registry** -> Entity Cards, Impact Analysis
4.  **PSEE (24)** -> MES (Read-only)
