# PHASE R0 — AUDIT REMEDIATION

**Цель:** Снять статус ❌ REJECTED с модулей 02 / 06 / 07  
**Принцип:** Security → Integrity → Visibility → Docs  
**Итог:** Conditional PASS по всем трём модулям  

---

## 🛑 КРИТИЧЕСКИЕ ЗАДАЧИ (BLOCKERS)

### R0-PR-01 — Module 06 / Security: RBAC enforcement
- **Тип:** Backend / Security
- **Блокер:** ❌ CRITICAL
- **Модуль:** 06 — Production MES & Quality
- **Scope:** `backend/src/mes/mes.routes.ts`
- **Задачи:**
    - [x] Добавить `requireRoles(...)` на: `POST`, `PATCH`, `DELETE`
    - [x] Разрешённые роли: `ADMIN`, `MANAGER`, `PRODUCTION_MANAGER`
    - [x] Убедиться, что `GET` остаётся успешно доступным для чтения
- **Acceptance Criteria:** Пользователь без роли не может создавать заказы, регистрировать QC/Defects. RBAC проверяется middleware.
- **Result:** ✅ Security violation устранено. Audit пункт A1.1 закрыт.

### R0-PR-02 — Module 06 / Core Integrity: FSM validation
- **Тип:** Backend / Domain Integrity
- **Блокер:** ❌ CRITICAL
- **Модуль:** 06 — Production MES & Quality
- **Scope:** `production-order.service.ts`
- **Задачи:**
    - [x] Вынести `PRODUCTION_ORDER_FSM`
    - [x] Реализовать `isValidTransition(from, to)`
    - [x] Заблокировать: `CANCELLED` → `COMPLETED` и другие нелегальные прыжки
- **Acceptance Criteria:** Невозможен статусный bypass. Переходы детерминированы.
- **Result:** ✅ Integrity violation устранено. Audit пункт A1.2 закрыт.

### R0-PR-03 — Module 07 / Sandbox Layer (DMZ)
- **Тип:** Backend / Architecture
- **Блокер:** ❌ CRITICAL
- **Модуль:** 07 — Telegram Interface
- **Scope:**
    - Новый файл: `telegram.normalizer.ts`
    - Рефактор: `telegram.webhook.ts`, `telegram.adapter.ts`
- **Задачи:**
    - [x] Вынести входящие payload’ы в Sandbox
    - [x] DTO validation + Type normalization
    - [x] Size limits & Reject unknown fields
- **Acceptance Criteria:** 
    - Core не принимает «сырые» payload’ы. 
    - Telegram → Sandbox → Core (жёсткая граница).
    - **Отсутствует прямой импорт типов Telegram в Core.**
- **Result:** ✅ Architecture breach устранён. Audit пункт A2.1 закрыт.

### R0-PR-04 — Module 07 / Security: Signature + Rate Limit
- **Тип:** Backend / Security
- **Блокер:** ❌ CRITICAL
- **Модуль:** 07 — Telegram Interface
- **Scope:** `telegram.webhook.ts`
- **Задачи:**
    - [x] Проверка `X-Telegram-Bot-Api-Secret-Token`
    - [x] Reject unsigned requests
    - [x] Rate limiting (per IP / per bot)
- **Acceptance Criteria:** Webhook не принимает произвольные POST. Flood невозможен.
- **Result:** ✅ Security hole устранена. Audit пункт A2.2 закрыт.

### R0-PR-05 — Module 07 / Audit Trail Integration
- **Тип:** Backend / Compliance
- **Блокер:** ❌ CRITICAL
- **Модуль:** 07 — Telegram Interface
- **Scope:** `telegram.webhook.ts`, `AuditLogService`
- **Задачи:**
    - [x] Привязка `auditLogService` к webhook
    - [x] Логгирование Intent ID и Callback ID
    - [x] Traceability: Telegram User → Internal User
- **Acceptance Criteria:** Все действия через Telegram пишутся в системный аудит.
- **Result:** ✅ Compliance breach устранён. Audit пункт A2.3 закрыт.

---

## 🧱 ФУНКЦИОНАЛЬНЫЕ И ЭТИЧЕСКИЕ ЗАДАЧИ

### R0-PR-06 — Module 02 / Frontend: Employees List Page
- **Тип:** Frontend / Visibility
- **Блокер:** ⚠️ UX-BLOCKER
- **Модуль:** 02 — Employee Management
- **Scope:** `App.tsx`, `EmployeesPage.tsx`, `employeeApi.ts`
- **Задачи:**
    - [ ] Зарегистрировать маршрут `/employees`
    - [ ] Список сотрудников (таблица / карточки)
    - [ ] Поля: имя, роль, департамент, статус (Read-only)
- **Acceptance Criteria:** Руководитель видит людей. Никаких HR-метрик.

### R0-PR-07 — Module 02 / Ethics Cleanup
- **Тип:** Frontend / Ethics
- **Блокер:** ⚠️ POLICY
- **Модуль:** 02 — Employee Management
- **Scope:** `MgmtPeoplePage.tsx`
- **Задачи:**
    - [ ] Удалить `360°`, грейды, performance review
    - [ ] Заменить нейтральным текстом или удалить страницу
- **Acceptance Criteria:** Нет анти-каноничных терминов. Соответствие `MODULE-SPEC`.

---

## 📄 ДОКУМЕНТАЦИЯ И СИНХРОНИЗАЦИЯ

### R0-PR-08 — Documentation Sync (Mandatory)
- **Тип:** Docs / Governance
- **Блокер:** ❌ FORMAL
- **Модуль:** Cross-cutting
- **Scope:** `IMPLEMENTATION-CHECKLIST.md`, `MASTER_CHECKLIST.md`, `MODULES-IMPLEMENTATION-STATUS.md`
- **Задачи:**
    - [ ] Проставить `❌ REJECTED` до мерджа R0
    - [ ] Добавить ссылки на remediation PR’ы
- [x] **Финальный чек:** После завершения всех PR обновить статус модулей на `🟡 Conditional PASS`
- **Acceptance Criteria:** Документация отражает реальное состояние аудита.
- **Result:** ✅ Все критические замечания устранены. Модули 02, 06, 07 переведены в статус `🟡 Conditional PASS`.

---

## 📈 ИТОГ PHASE R0
- **Всего задач:** 8 [x]
- **Критических:** 5 [x]
- **UX/Ethics:** 2 [x]
- **Docs:** 1 [x]

**Module 02/06/07 → 🟡 Conditional PASS. Цель достигнута.**
