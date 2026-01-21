# Component 7: Final Integration & Testing — Implementation Plan

## PHASE 0: Canonical End-to-End Checklist

### Цель
Гарантировать, что все компоненты 1–6 работают как единая система без скрытых обходов, нарушений инвариантов, неидемпотентных эффектов, и «тихих» ошибок.

> [!CAUTION]
> **Component 7 = System Closure, NOT feature or refactoring**
> 
> Forbidden during Component 7:
> - ❌ Рефакторинг архитектуры
> - ❌ Добавление фич
> - ❌ Изменение инвариантов
> - ❌ Расширение ролей

---

## 1. Канонические E2E сценарии (обязательные)

### 1.1 Happy Path — Course → Qualification → Notification

**Сценарий:**
1. EMPLOYEE проходит курс
2. `COURSE_COMPLETED` создаётся
3. Event обработан (idempotent)
4. Anti-Fraud detector запускается (non-blocking)
5. PhotoCompany metrics поступают
6. `PHOTOCOMPANY_RESULT` → расчёт
7. `QUALIFICATION_PROPOSED` создан
8. Telegram уведомляет пользователя

**Проверки:**
- ✅ Ни один шаг не зависит от UI
- ✅ Повторный polling не дублирует эффекты
- ✅ Уведомление отправлено 1 раз

### 1.2 Edge Path — Anti-Fraud Signals Present

**Сценарий:**
1. EMPLOYEE завершает курс
2. Детектор создаёт HIGH signal
3. Курс считается завершённым
4. Квалификация может быть предложена
5. Сигнал виден Security/Ops
6. Никаких блокировок или откатов

**Проверки:**
- ✅ Signals append-only
- ✅ Qualification flow не прерван
- ✅ Telegram не уведомляется о сигнале

### 1.3 Negative Path — RBAC Violations

**Сценарии:**

**EMPLOYEE пытается:**
- Завершить курс за другого → 403
- Создать курс → 403
- Посмотреть anti-fraud → 403

**TRAINER пытается:**
- Редактировать чужой курс → 403

**MANAGER пытается:**
- Approve qualification → 403 (regulated, not RBAC)

**Ожидание:**
- 403 Forbidden
- Без side-effects
- Без событий

---

## 2. Event Flow Integrity

### 2.1 Idempotency

**Повторный запуск воркера:**
- ✅ Не создаёт дубликатов
- ✅ Не отправляет повторных уведомлений
- ✅ `processed_at` — единственный флаг истины

### 2.2 Event Ordering

- ✅ Notification после handler
- ✅ Anti-Fraud detection после completion
- ✅ Qualification proposal после metrics

---

## 3. Anti-Fraud Guarantees

| Гарантия | Проверка |
|----------|----------|
| No blocking | Completion всегда проходит |
| No punishment | Нет автоматических санкций |
| No AI access | AI не читает signals |
| No Telegram access | Бот не видит signals |

---

## 4. RBAC Guarantees

**Все critical endpoints имеют:**
- ✅ Явную проверку
- ✅ Отрицательный сценарий

**Нет:**
- ❌ Implicit allow
- ❌ Admin bypass

---

## 5. Telegram Bot Guarantees

**Viewer intents:**
- ✅ Read-only
- ✅ Self-only

**Notifier:**
- ✅ System-only
- ✅ No duplicates

**Нет:**
- ❌ Business actions
- ❌ Confirmations
- ❌ Approvals

---

## 6. Observability & Audit

### 6.1 Логи (обязательно)

| Объект | Лог |
|--------|-----|
| Event processing | INFO |
| Anti-Fraud detection | INFO |
| RBAC denial | WARN |
| Notification send | INFO |
| Duplicate skip | DEBUG |

### 6.2 Audit Trail

- Кто
- Когда
- Какое событие
- Какой handler
- Какой результат

---

## 7. Failure Modes (обязательные тесты)

| Failure | Ожидание |
|---------|----------|
| Notification service down | Event обработан |
| Anti-Fraud throws | Completion не блокируется |
| Telegram API timeout | Retry без дублей |
| Worker restart | Idempotent resume |

---

## 8. Definition of Done (Module 13)

Module 13 считается **CLOSED**, если:

1. ✅ Все сценарии 1–7 выполнены
2. ✅ Ни один инвариант не нарушен
3. ✅ Нет обходов RBAC
4. ✅ Нет дублей событий
5. ✅ Нет скрытых side-effects
6. ✅ Документация обновлена

---

## 9. Testing Checklist

### 9.1 Happy Path Tests
- [ ] Complete course as EMPLOYEE
- [ ] Verify COURSE_COMPLETED event created
- [ ] Verify event processed (processed_at set)
- [ ] Verify Anti-Fraud detection ran (non-blocking)
- [ ] Simulate PhotoCompany metrics
- [ ] Verify QUALIFICATION_PROPOSED created
- [ ] Verify Telegram notification sent (once)

### 9.2 Edge Path Tests
- [ ] Complete course with HIGH anti-fraud signal
- [ ] Verify course completion not blocked
- [ ] Verify signal created (append-only)
- [ ] Verify qualification flow continues
- [ ] Verify Telegram not notified about signal

### 9.3 Negative Path Tests
- [ ] EMPLOYEE tries to complete course for another user → 403
- [ ] EMPLOYEE tries to create course → 403
- [ ] EMPLOYEE tries to view anti-fraud signals → 403
- [ ] TRAINER tries to edit another trainer's course → 403
- [ ] Verify no side-effects from denied requests

### 9.4 Idempotency Tests
- [ ] Run worker twice on same events
- [ ] Verify no duplicate notifications
- [ ] Verify processed_at prevents re-processing

### 9.5 Failure Mode Tests
- [ ] Simulate notification service failure
- [ ] Verify event still processed
- [ ] Simulate anti-fraud detector error
- [ ] Verify course completion not blocked

---

## 10. Documentation Updates

- [ ] Update DEVELOPMENT-CHECKLIST.md (mark Module 13 complete)
- [ ] Update memory-bank with final status
- [ ] Create final walkthrough for Module 13
- [ ] Document known limitations
- [ ] Document future enhancements (if any)
