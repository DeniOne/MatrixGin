# Event Semantics: employee.onboarded

**Дата:** 2026-01-23  
**Статус:** Canonical  
**Тип:** Domain Event

---

## 📋 Описание

`employee.onboarded` — это **initial activation event**, который эмитится при первичной активации сотрудника в системе.

### Семантика

**employee.onboarded** означает:
- Сотрудник успешно прошел Admission Gate (База + Анкета)
- Статус `admission_status` переведен в `ADMITTED`
- Создан User + Employee
- Начинается процесс onboarding

**НЕ используется для:**
- ❌ Повторный найм (rehire)
- ❌ Перевод (transfer)
- ❌ Восстановление (restoration)
- ❌ Реонбординг (re-onboarding)

---

## 🔧 Технические детали

### Event Payload

```typescript
interface EmployeeOnboardedEvent {
    employeeId: string;      // ID созданного Employee
    userId: string;          // ID созданного User
    onboardedAt: Date;       // Дата/время onboarding
    onboardedBy?: string;    // ID HR-менеджера
    onboardedByRole?: string; // Роль (обычно 'HR_MANAGER')
}
```

### Эмиссия события

**Файл:** `backend/src/services/employee-registration.service.ts`

```typescript
async approveRegistration(registrationId: string, reviewedByUserId: string) {
    // 1. Create User
    const user = await prisma.user.create({ ... });
    
    // 2. Create Employee
    const employee = await prisma.employee.create({ ... });
    
    // 3. Update registration status
    await prisma.$executeRaw`UPDATE ... SET status = 'APPROVED'`;
    
    // 4. Emit employee.onboarded event
    this.eventEmitter.emit('employee.onboarded', {
        employeeId: employee.id,
        userId: user.id,
        onboardedAt: new Date(),
        onboardedBy: reviewedByUserId,
        onboardedByRole: 'HR_MANAGER'
    });
}
```

---

## 🎯 Listeners

### 1. EmployeeOnboardedListener (Module 33)

**Файл:** `backend/src/modules/personnel/listeners/employee-onboarded.listener.ts`

**Цель:** Создание PersonalFile

**Действия:**
1. Проверка существующего PersonalFile (idempotency)
2. Создание PersonalFile с status `ONBOARDING`
3. Генерация fileNumber (PF-2026-00001)
4. Эмиссия HR Domain Event `EMPLOYEE_HIRED`

### 2. UniversityOnboardingListener (Module 13)

**Файл:** `backend/src/services/university-onboarding.listener.ts`

**Цель:** Инициализация learning context

**Действия:**
1. Установка стартовой квалификации (INTERN = Photon)
2. Запись на обязательные курсы
3. Создание learning profile (user_grade)

---

## 🔒 Idempotency

### Защита от дублей

**На уровне service:**
```typescript
// Проверка статуса заявки
if (reg.status === 'APPROVED') {
    throw new Error('Registration already approved');
}
```

**На уровне listeners:**
```typescript
// EmployeeOnboardedListener
const existing = await this.prisma.personalFile.findUnique({
    where: { employeeId: payload.employeeId }
});
if (existing) return; // Already created

// UniversityOnboardingListener
const existing = await prisma.userGrade.findUnique({
    where: { user_id: userId }
});
if (existing) return; // Already created
```

---

## 📊 Flow Diagram

```
EmployeeRegistrationService.approveRegistration()
  ↓
1. Update admission_status → ADMITTED
  ↓
2. Create User (role: EMPLOYEE, status: ACTIVE)
  ↓
3. Create Employee (position, hire_date)
  ↓
4. Update registration status → APPROVED
  ↓
5. Emit employee.onboarded event
  ↓
  ├─→ EmployeeOnboardedListener (Module 33)
  │     ├─ Check idempotency
  │     ├─ Create PersonalFile (status: ONBOARDING)
  │     ├─ Generate fileNumber (PF-2026-00001)
  │     └─ Emit EMPLOYEE_HIRED (HR Domain Event)
  │
  └─→ UniversityOnboardingListener (Module 13)
        ├─ Check idempotency
        ├─ Set qualification → INTERN (Photon)
        ├─ Enroll in mandatory courses
        └─ Create learning profile (user_grade)
```

---

## ✅ Acceptance Criteria

Событие `employee.onboarded` считается корректно обработанным, если:

### HR Layer:
- ✅ User создан (email, role: EMPLOYEE, status: ACTIVE)
- ✅ Employee создан (position, hire_date)
- ✅ PersonalFile создан (status: ONBOARDING, fileNumber)
- ✅ HR Domain Event `EMPLOYEE_HIRED` сохранён

### MVP Layer:
- ✅ Стартовая квалификация = INTERN (Photon)
- ✅ Learning profile создан (user_grade)
- ✅ Обязательные курсы назначены (enrollments)
- ✅ Wallet balance = 0 (mc_balance, gmc_balance)

### Idempotency:
- ✅ Повторная эмиссия не создаёт дубликаты
- ✅ Повторное одобрение выбрасывает ошибку

---

## 🔮 Future Considerations

### Возможные расширения:

1. **Rehire Event:**
   ```typescript
   employee.rehired {
       employeeId: string;
       previousEmploymentId: string;
       rehiredAt: Date;
   }
   ```

2. **Transfer Event:**
   ```typescript
   employee.transferred {
       employeeId: string;
       fromDepartment: string;
       toDepartment: string;
       transferredAt: Date;
   }
   ```

3. **Restoration Event:**
   ```typescript
   employee.restored {
       employeeId: string;
       restoredAt: Date;
       restoredFrom: 'TERMINATED' | 'LEAVE';
   }
   ```

---

## 📚 Related Documentation

- [EMPLOYEE-REGISTRATION-PROCESS.md](../EMPLOYEE-REGISTRATION-PROCESS.md)
- [Module 33: Personnel HR Records](01-modules/33-Personnel-HR-Records/MODULE-SPEC.md)
- [MVP-LEARNING-CONTOUR README](06-MVP-LEARNING-CONTOUR/00-README.md)

---

**Автор:** Antigravity AI  
**Дата:** 2026-01-23  
**Версия:** 1.0
