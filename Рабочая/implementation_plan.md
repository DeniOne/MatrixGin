# Implementation Plan: Employee Registration 100%

**Цель:** Довести процесс регистрации сотрудника до 100% готовности

**Текущий статус:** 60-70%  
**Целевой статус:** 100%

---

## 🎯 Критические проблемы

### Проблема #1: Событие `employee.hired` не эмитится
- **Критичность:** 🔴 CRITICAL
- **Последствие:** PersonalFile не создаётся автоматически
- **Решение:** Добавить EventEmitter2 и эмиссию события

### Проблема #2: Frontend UI неизвестен
- **Критичность:** 🟡 HIGH
- **Последствие:** HR не может использовать систему
- **Решение:** Проверить наличие, создать если нужно

---

## 📋 План реализации

### **Phase 1: Исправление критической проблемы (MUST)**

#### 1.1. Добавить EventEmitter2 в EmployeeRegistrationService

**Файл:** [backend/src/services/employee-registration.service.ts](file:///f:/Matrix_Gin/backend/src/services/employee-registration.service.ts)

**Изменения:**
1. Импортировать EventEmitter2
2. Добавить в constructor
3. Эмитить событие в [approveRegistration()](file:///f:/Matrix_Gin/backend/src/services/employee-registration.service.ts#773-837)

**Код:**
```typescript
import { EventEmitter2 } from '@nestjs/event-emitter';

export class EmployeeRegistrationService {
  constructor(private eventEmitter: EventEmitter2) {}

  async approveRegistration(registrationId, reviewedByUserId) {
    // ... создание User и Employee ...

    // ✅ ДОБАВИТЬ:
    this.eventEmitter.emit('employee.hired', {
      employeeId: employee.id,
      hireDate: new Date(),
      hiredBy: reviewedByUserId,
      hiredByRole: 'HR_MANAGER'
    });
  }
}
```

#### 1.2. Проверить, что EmployeeHiredListener работает

**Файл:** [backend/src/modules/personnel/listeners/employee-hired.listener.ts](file:///f:/Matrix_Gin/backend/src/modules/personnel/listeners/employee-hired.listener.ts)

**Проверка:**
- ✅ Listener зарегистрирован в PersonnelModule
- ✅ Слушает событие `employee.hired`
- ✅ Создаёт PersonalFile через PersonalFileService

---

### **Phase 2: Проверка/создание Frontend UI (MUST)**

#### 2.1. Проверить наличие admin panel

**Действия:**
1. Найти frontend код для admin panel
2. Проверить наличие страниц:
   - Отправка приглашений
   - Список заявок
   - Детали заявки
   - Кнопки одобрения/отклонения

#### 2.2. Если UI нет — создать минимальный

**Страницы:**
1. **Invite Employee Page**
   - Форма с полями: Telegram ID, Department, Location
   - Кнопка "Send Invitation"

2. **Registration Requests List Page**
   - Таблица заявок
   - Фильтр по статусу
   - Пагинация

3. **Registration Request Detail Page**
   - Все данные кандидата
   - История шагов
   - Кнопки "Approve" / "Reject"

---

### **Phase 3: End-to-end тестирование (MUST)**

#### 3.1. Создать тестовый сценарий

**Сценарий:**
1. HR отправляет приглашение
2. Кандидат проходит 11 шагов
3. HR одобряет заявку
4. Проверить:
   - User создан
   - Employee создан
   - PersonalFile создан
   - HR Domain Event сохранён

#### 3.2. Написать integration test

**Файл:** `backend/src/modules/personnel/__tests__/integration/employee-registration.test.ts`

---

## 🚀 Execution Plan

### **STEP 1: Fix Critical Issue (30 min)**

1. ✅ Modify [employee-registration.service.ts](file:///f:/Matrix_Gin/backend/src/services/employee-registration.service.ts)
2. ✅ Add EventEmitter2 dependency
3. ✅ Emit `employee.hired` event
4. ✅ Test event emission

### **STEP 2: Verify Module 33 Integration (15 min)**

1. ✅ Check EmployeeHiredListener is registered
2. ✅ Test PersonalFile creation
3. ✅ Verify HR Domain Event emission

### **STEP 3: Check Frontend UI (30 min)**

1. ✅ Search for admin panel code
2. ✅ Check if pages exist
3. ✅ If not — create minimal UI

### **STEP 4: End-to-end Test (30 min)**

1. ✅ Manual test: full registration flow
2. ✅ Verify all components work
3. ✅ Write integration test

### **STEP 5: Documentation (15 min)**

1. ✅ Update EMPLOYEE-REGISTRATION-PROCESS.md
2. ✅ Update MVP-LEARNING-CONTOUR README
3. ✅ Commit changes

---

## ✅ Acceptance Criteria

Процесс регистрации считается **100% готовым**, если:

- ✅ Событие `employee.hired` эмитится
- ✅ PersonalFile создаётся автоматически
- ✅ HR Domain Event `EMPLOYEE_HIRED` сохраняется
- ✅ Frontend UI существует (или создан минимальный)
- ✅ End-to-end тест проходит
- ✅ Документация обновлена

---

## 📊 Timeline

| Phase | Время | Статус |
|-------|-------|--------|
| Phase 1: Fix Critical Issue | 30 min | ⏳ TODO |
| Phase 2: Frontend UI | 30 min | ⏳ TODO |
| Phase 3: Testing | 30 min | ⏳ TODO |
| Documentation | 15 min | ⏳ TODO |
| **Total** | **~2 hours** | ⏳ TODO |

---

**Автор:** Antigravity AI  
**Дата:** 2026-01-22  
**Статус:** Ready for Execution
