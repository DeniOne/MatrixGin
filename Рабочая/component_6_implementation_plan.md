# Component 6: RBAC Enforcement — Implementation Plan

## PHASE 0: Invariants & Access Matrix

### Цель
Зафиксировать роль RBAC как **Enforcement Layer**, строго отделённого от UI-удобства и бизнес-логики.

> [!CAUTION]
> **RBAC = Enforcement Layer, NOT UI convenience**
> 
> **Formula:** `Actor → Auth → RBAC → Service → Data`
> 
> Если RBAC не дал доступ — код дальше не исполняется.

---

## 1. Архитектурная роль RBAC

### 1.1 Что такое RBAC в MatrixGin

**RBAC — это:**
- ✅ Обязательный слой между Request → Service
- ✅ Enforcement, а не рекомендация
- ✅ Неотключаемый

**RBAC НЕ:**
- ❌ Не UI-фича
- ❌ Не роль в Telegram
- ❌ Не часть AI
- ❌ Не логика сервиса

### 1.2 Формула
```
Actor → Auth → RBAC → Service → Data
```

---

## 2. Канонические роли (не расширяются произвольно)

### 2.1 System Roles

| Role | Назначение |
|------|------------|
| `SYSTEM` | Внутренние воркеры, event handlers |
| `ADMIN` | Технический администратор (без бизнеса) |

### 2.2 Business Roles

| Role | Назначение |
|------|------------|
| `OWNER` | Владелец бизнеса |
| `EXECUTIVE` | Топ-менеджмент |
| `MANAGER` | Руководитель локации / подразделения |
| `EMPLOYEE` | Сотрудник |

### 2.3 Functional Roles (contextual)

| Role | Контекст |
|------|----------|
| `PHOTOGRAPHER` | PhotoCompany |
| `SALES` | Sales |
| `RETOUCHER` | Production |
| `TRAINER` | University |

> [!IMPORTANT]
> Functional roles не дают доступы сами по себе,
> они модифицируют бизнес-доступы.

---

## 3. Жёсткие инварианты RBAC (не обсуждаются)

1. ❌ **Нет «god admin»**
2. ❌ **Нет ролей с `*:*`**
3. ❌ **Нет bypass через сервис**
4. ❌ **Нет RBAC в UI — только в backend**
5. ❌ **Нет динамических ролей из запроса**
6. ❌ **Нет access по "договорённости"**
7. ❌ **SYSTEM ≠ ADMIN**

---

## 4. RBAC Enforcement Points

### 4.1 Где проверяется доступ (обязательно)

| Уровень | Обязателен |
|---------|------------|
| Controller | ✅ |
| Service | ❌ |
| Repository | ❌ |
| Frontend | ❌ |

> [!WARNING]
> Если проверка только в UI — её не существует.

### 4.2 Принцип

- **Controller решает:** можно или нет
- **Service предполагает:** доступ уже разрешён

---

## 5. Access Matrix (ядро)

### 5.1 Employee Domain

| Action | EMPLOYEE | MANAGER | EXECUTIVE | OWNER |
|--------|----------|---------|-----------|-------|
| View self profile | ✅ | ✅ | ✅ | ✅ |
| View others profile | ❌ | 🔶 (location) | ✅ | ✅ |
| Edit self profile | 🔶 (limited) | 🔶 | 🔶 | 🔶 |
| Edit others profile | ❌ | 🔶 (location) | ❌ | ❌ |
| Assign role | ❌ | ❌ | ❌ | ❌ |

### 5.2 Qualification & Status

| Action | EMPLOYEE | MANAGER | EXECUTIVE | OWNER |
|--------|----------|---------|-----------|-------|
| View own qualification | ✅ | ✅ | ✅ | ✅ |
| View others qualification | ❌ | 🔶 (aggregate) | 🔶 | 🔶 |
| Propose qualification | SYSTEM | SYSTEM | SYSTEM | SYSTEM |
| Approve qualification | ❌ | ❌ | ❌ | ❌ |

> [!IMPORTANT]
> Квалификация не утверждается через RBAC вообще — только через регламент.

### 5.3 Anti-Fraud Signals

| Action | EMPLOYEE | MANAGER | EXECUTIVE | OWNER | SECURITY |
|--------|----------|---------|-----------|-------|----------|
| View signals | ❌ | 🔶 (aggregated) | ❌ | ❌ | ✅ |
| Export signals | ❌ | ❌ | ❌ | ❌ | ✅ |

### 5.4 University

| Action | EMPLOYEE | TRAINER | MANAGER | EXECUTIVE |
|--------|----------|---------|---------|-----------|
| Enroll course | ✅ | ❌ | ❌ | ❌ |
| Complete course | SYSTEM | SYSTEM | SYSTEM | SYSTEM |
| View course stats | ❌ | 🔶 (own) | 🔶 | 🔶 |
| Edit course | ❌ | 🔶 (content) | ❌ | ❌ |

### 5.5 Telegram Bot

| Action | All Roles |
|--------|-----------|
| Read own data | ✅ |
| Trigger business action | ❌ |
| View anti-fraud | ❌ |
| View others data | ❌ |

---

## 6. SYSTEM Role (особый режим)

### 6.1 Что может SYSTEM

- ✅ Emit events
- ✅ Process events
- ✅ Write derived data
- ✅ Create proposals

### 6.2 Что SYSTEM НЕ может

- ❌ Read personal data outside scope
- ❌ Bypass RBAC
- ❌ Perform admin actions
- ❌ Impersonate user

---

## 7. Error Semantics

| Case | Response |
|------|----------|
| No auth | 401 |
| Auth, no access | 403 |
| Access denied silently | ❌ (запрещено) |

> [!IMPORTANT]
> Всегда явно. Никогда молча.

---

## 8. Инварианты Component 6

Зафиксировать как **архитектурные законы:**

1. **RBAC enforced server-side only**
2. **Controllers own access decisions**
3. **No wildcard permissions**
4. **No admin override**
5. **SYSTEM role isolated**
6. **Access ≠ visibility**
7. **Explicit deny > implicit allow**

---

## 9. Implementation Plan

### 9.1 Current State Analysis

**Existing RBAC Infrastructure:**
- `middleware/rbac.middleware.ts` — existing RBAC middleware
- Permission checks in controllers
- Role-based access control

**What needs to be added for Module 13:**
- University-specific permission checks
- Trainer role enforcement
- Anti-fraud signal access control

### 9.2 University-Specific Permissions

```typescript
// University permissions
const universityPermissions = {
    // Course management
    'course:read': ['EMPLOYEE', 'TRAINER', 'MANAGER', 'EXECUTIVE'],
    'course:create': ['TRAINER', 'MANAGER'],
    'course:update': ['TRAINER'], // content only
    'course:delete': [], // No one
    
    // Enrollment
    'enrollment:create': ['EMPLOYEE'], // self-enrollment only
    'enrollment:read': ['EMPLOYEE', 'TRAINER', 'MANAGER'], // scoped
    'enrollment:update': [], // SYSTEM only
    
    // Module progress
    'module:read': ['EMPLOYEE', 'TRAINER'],
    'module:update_progress': [], // SYSTEM only
    
    // Qualification
    'qualification:read_own': ['EMPLOYEE', 'MANAGER', 'EXECUTIVE'],
    'qualification:read_others': [], // Aggregated only, no direct access
    'qualification:propose': [], // SYSTEM only
    'qualification:approve': [], // Regulated, not RBAC
    
    // Anti-fraud
    'antifraud:read': ['SECURITY'],
    'antifraud:export': ['SECURITY'],
};
```

### 9.3 Enforcement in Controllers

**Example: UniversityController**

```typescript
class UniversityController {
    // GET /api/university/courses
    async getCourses(req: Request, res: Response) {
        // RBAC check
        if (!hasPermission(req.user, 'course:read')) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        
        // Service assumes access granted
        const courses = await universityService.getCourses();
        res.json(courses);
    }
    
    // POST /api/university/enroll
    async enrollCourse(req: Request, res: Response) {
        const { courseId } = req.body;
        const userId = req.user.id;
        
        // RBAC check: only self-enrollment
        if (!hasPermission(req.user, 'enrollment:create')) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        
        // Additional check: can only enroll self
        if (req.body.userId && req.body.userId !== userId) {
            return res.status(403).json({ error: 'Can only enroll yourself' });
        }
        
        // Service assumes access granted
        const enrollment = await enrollmentService.enrollCourse(userId, courseId);
        res.json(enrollment);
    }
}
```

### 9.4 Trainer Role Enforcement

**Trainer-specific checks:**

```typescript
// Trainer can only view/edit courses they created
async updateCourse(req: Request, res: Response) {
    const { courseId } = req.params;
    
    // RBAC check
    if (!hasPermission(req.user, 'course:update')) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    
    // Trainer-specific check
    if (req.user.role === 'TRAINER') {
        const course = await prisma.course.findUnique({ where: { id: courseId } });
        if (course.created_by !== req.user.id) {
            return res.status(403).json({ error: 'Can only edit own courses' });
        }
    }
    
    // Service assumes access granted
    const updated = await universityService.updateCourse(courseId, req.body);
    res.json(updated);
}
```

---

## 10. Proposed Changes

### 10.1 New Files
- None (using existing RBAC infrastructure)

### 10.2 Modified Files
- `src/controllers/university.controller.ts` — add RBAC checks
- `src/controllers/enrollment.controller.ts` — add RBAC checks
- `src/controllers/qualification.controller.ts` — add RBAC checks
- `src/middleware/rbac.middleware.ts` — add university permissions (if needed)

---

## 11. Verification Plan

### 11.1 Access Control Tests

**Positive Tests:**
- EMPLOYEE can enroll in course
- EMPLOYEE can view own qualification
- TRAINER can edit own course
- MANAGER can view aggregated stats

**Negative Tests:**
- EMPLOYEE cannot view others' qualification
- EMPLOYEE cannot approve qualification
- TRAINER cannot edit others' courses
- EMPLOYEE cannot view anti-fraud signals

### 11.2 Error Response Tests

- No auth → 401
- Auth but no permission → 403
- Never silent denial

---

## 12. Next Steps

1. ✅ **PHASE 0:** Invariants & Access Matrix (this document)
2. ⏳ **PHASE 1:** Audit existing controllers for RBAC compliance
3. ⏳ **PHASE 2:** Add missing RBAC checks to University controllers
4. ⏳ **PHASE 3:** Add Trainer role enforcement
5. ⏳ **PHASE 4:** Testing & Verification
