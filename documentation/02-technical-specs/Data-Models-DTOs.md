# MatrixGin v2.0 - Data Models & DTOs

> **Версия:** 1.0  
> **Язык:** TypeScript  
> **Валидация:** Zod / class-validator  
> **Дата:** 2025-11-21

---

## 📋 Оглавление

1. [Принципы проектирования DTO](#принципы-проектирования-dto)
2. [Общие типы и интерфейсы](#общие-типы-и-интерфейсы)
3. [Authentication DTOs](#authentication-dtos)
4. [Employee DTOs](#employee-dtos)
5. [Task DTOs](#task-dtos)
6. [KPI DTOs](#kpi-dtos)
7. [Economy DTOs](#economy-dtos)
8. [Валидация с Zod](#валидация-с-zod)
9. [Примеры использования](#примеры-использования)

---

## Принципы проектирования DTO

### 1. Разделение Request/Response

```typescript
// ❌ Плохо - один DTO для всего
interface UserDTO {
  id?: string;
  email: string;
  password?: string;
  // ...
}

// ✅ Хорошо - разделение по назначению
interface CreateUserRequest {
  email: string;
  password: string;
  // ...
}

interface UserResponse {
  id: string;
  email: string;
  // password НЕ включается!
}
```

### 2. Иммутабельность

```typescript
// Все DTO должны быть readonly
interface UserResponse {
  readonly id: string;
  readonly email: string;
  readonly createdAt: Date;
}
```

### 3. Строгая типизация

```typescript
// Используем enum вместо string
enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

interface Task {
  status: TaskStatus; // ✅ Строго типизировано
  // status: string; // ❌ Слабая типизация
}
```

---

## Общие типы и интерфейсы

### Base Types

```typescript
/**
 * UUID v4 string
 */
export type UUID = string;

/**
 * ISO 8601 date-time string
 */
export type ISODateTime = string;

/**
 * ISO 8601 date string (YYYY-MM-DD)
 */
export type ISODate = string;

/**
 * Email address
 */
export type Email = string;

/**
 * URL string
 */
export type URL = string;
```

### Common Response Wrapper

```typescript
/**
 * Стандартная обертка для успешных ответов
 */
export interface ApiResponse<T> {
  readonly success: true;
  readonly data: T;
  readonly meta: MetaInfo;
}

/**
 * Стандартная обертка для ошибок
 */
export interface ApiError {
  readonly success: false;
  readonly error: {
    readonly code: ErrorCode;
    readonly message: string;
    readonly details?: ErrorDetail[];
  };
  readonly meta: MetaInfo;
}

/**
 * Метаинформация запроса
 */
export interface MetaInfo {
  readonly timestamp: ISODateTime;
  readonly requestId: UUID;
}

/**
 * Детали ошибки валидации
 */
export interface ErrorDetail {
  readonly field: string;
  readonly message: string;
}

/**
 * Коды ошибок
 */
export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}
```

### Pagination

```typescript
/**
 * Параметры пагинации
 */
export interface PaginationParams {
  readonly page?: number; // default: 1
  readonly limit?: number; // default: 20, max: 100
  readonly sort?: string; // field name
  readonly order?: 'asc' | 'desc'; // default: desc
}

/**
 * Метаданные пагинации
 */
export interface PaginationMeta {
  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly totalPages: number;
}

/**
 * Ответ с пагинацией
 */
export interface PaginatedResponse<T> {
  readonly success: true;
  readonly data: readonly T[];
  readonly pagination: PaginationMeta;
  readonly meta: MetaInfo;
}
```

---

## Authentication DTOs

### Enums

```typescript
export enum UserRole {
  ADMIN = 'admin',
  HR_MANAGER = 'hr_manager',
  DEPARTMENT_HEAD = 'department_head',
  BRANCH_MANAGER = 'branch_manager',
  EMPLOYEE = 'employee',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
}
```

### Request DTOs

```typescript
/**
 * Регистрация нового пользователя
 */
export interface RegisterRequest {
  readonly email: Email;
  readonly password: string; // min 8 chars, must contain uppercase, lowercase, number, special char
  readonly firstName: string; // min 2, max 100
  readonly lastName: string; // min 2, max 100
  readonly middleName?: string;
  readonly departmentId: UUID;
  readonly telegramId?: string;
}

/**
 * Вход в систему
 */
export interface LoginRequest {
  readonly email: Email;
  readonly password: string;
}

/**
 * Обновление access токена
 */
export interface RefreshTokenRequest {
  readonly refreshToken: string;
}

/**
 * Восстановление пароля
 */
export interface ForgotPasswordRequest {
  readonly email: Email;
}

/**
 * Сброс пароля
 */
export interface ResetPasswordRequest {
  readonly token: string;
  readonly newPassword: string;
}
```

### Response DTOs

```typescript
/**
 * Данные пользователя (базовые)
 */
export interface UserResponse {
  readonly id: UUID;
  readonly email: Email;
  readonly firstName: string;
  readonly lastName: string;
  readonly middleName?: string;
  readonly role: UserRole;
  readonly departmentId: UUID;
  readonly telegramId?: string;
  readonly avatarUrl?: URL;
  readonly status: UserStatus;
  readonly emailVerified: boolean;
  readonly createdAt: ISODateTime;
  readonly updatedAt: ISODateTime;
  readonly lastLoginAt?: ISODateTime;
}

/**
 * Ответ при успешной аутентификации
 */
export interface LoginResponse {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn: number; // seconds
  readonly user: UserResponse;
}

/**
 * Данные текущего пользователя с правами
 */
export interface CurrentUserResponse extends UserResponse {
  readonly permissions: readonly string[];
}
```

---

## Employee DTOs

### Enums

```typescript
export enum EmployeeRank {
  TRAINEE = 'trainee',
  JUNIOR = 'junior',
  MIDDLE = 'middle',
  SENIOR = 'senior',
  LEAD = 'lead',
  EXPERT = 'expert',
}

export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACTOR = 'contractor',
  INTERN = 'intern',
}

export enum WorkStatus {
  ACTIVE = 'active',
  ON_VACATION = 'on_vacation',
  SICK_LEAVE = 'sick_leave',
  MATERNITY_LEAVE = 'maternity_leave',
  DISMISSED = 'dismissed',
}
```

### Request DTOs

```typescript
/**
 * Создание нового сотрудника
 */
export interface CreateEmployeeRequest {
  readonly email: Email;
  readonly firstName: string;
  readonly lastName: string;
  readonly middleName?: string;
  readonly departmentId: UUID;
  readonly position: string;
  readonly hireDate: ISODate;
  readonly employmentType?: EmploymentType; // default: FULL_TIME
  readonly telegramId?: string;
}

/**
 * Обновление данных сотрудника (полное)
 */
export interface UpdateEmployeeRequest {
  readonly firstName: string;
  readonly lastName: string;
  readonly middleName?: string;
  readonly departmentId: UUID;
  readonly position: string;
  readonly employmentType: EmploymentType;
}

/**
 * Частичное обновление сотрудника
 */
export interface PatchEmployeeRequest {
  readonly position?: string;
  readonly departmentId?: UUID;
  readonly workStatus?: WorkStatus;
  readonly rank?: EmployeeRank;
  readonly managerId?: UUID;
}

/**
 * Фильтры для списка сотрудников
 */
export interface EmployeeListFilters extends PaginationParams {
  readonly departmentId?: UUID;
  readonly status?: WorkStatus;
  readonly rank?: EmployeeRank;
  readonly search?: string; // поиск по имени/email
}
```

### Response DTOs

```typescript
/**
 * Данные сотрудника (расширенные)
 */
export interface EmployeeResponse extends UserResponse {
  readonly employeeNumber: string;
  readonly position: string;
  readonly hireDate: ISODate;
  readonly terminationDate?: ISODate;
  readonly rank: EmployeeRank;
  readonly employmentType: EmploymentType;
  readonly workStatus: WorkStatus;
  readonly managerId?: UUID;
  readonly mcBalance: number;
  readonly gmcBalance: number;
  readonly emotionalTone?: number; // 0.0 - 4.0
}

/**
 * Список сотрудников с пагинацией
 */
export type EmployeeListResponse = PaginatedResponse<EmployeeResponse>;

/**
 * Аналитика сотрудника
 */
export interface EmployeeAnalyticsResponse {
  readonly employeeId: UUID;
  readonly tenure: {
    readonly years: number;
    readonly months: number;
  };
  readonly kpiAchievement: number; // percentage
  readonly tasksCompleted: number;
  readonly mcEarned: number;
  readonly rank: EmployeeRank;
  readonly nextRankProgress: number; // percentage
}

/**
 * Эмоциональное состояние сотрудника
 */
export interface EmployeeEmotionalResponse {
  readonly employeeId: UUID;
  readonly currentTone: number; // 0.0 - 4.0
  readonly averageTone: number;
  readonly trend: 'improving' | 'stable' | 'declining';
  readonly lastAnalyzedAt: ISODateTime;
  readonly history: readonly {
    readonly date: ISODate;
    readonly tone: number;
  }[];
}

/**
 * Риск выгорания
 */
export interface BurnoutRiskResponse {
  readonly employeeId: UUID;
  readonly riskLevel: 'low' | 'medium' | 'high' | 'critical';
  readonly riskScore: number; // 0-100
  readonly factors: readonly {
    readonly factor: string;
    readonly weight: number;
  }[];
  readonly recommendations: readonly string[];
}
```

---

## Task DTOs

### Enums

```typescript
export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ON_HOLD = 'on_hold',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}
```

### Request DTOs

```typescript
/**
 * Создание задачи
 */
export interface CreateTaskRequest {
  readonly title: string; // min 5, max 255
  readonly description?: string;
  readonly priority: TaskPriority;
  readonly assigneeId?: UUID; // если не указан, назначается автоматически по MDR
  readonly departmentId?: UUID;
  readonly dueDate?: ISODateTime;
  readonly mcReward?: number; // default: 100, min: 0
  readonly tags?: readonly string[];
}

/**
 * Создание задачи из текста (NLP)
 */
export interface NaturalLanguageTaskRequest {
  readonly text: string; // min 10 chars
}

/**
 * Обновление задачи
 */
export interface UpdateTaskRequest {
  readonly title: string;
  readonly description?: string;
  readonly priority: TaskPriority;
  readonly dueDate?: ISODateTime;
  readonly mcReward?: number;
  readonly tags?: readonly string[];
}

/**
 * Назначение задачи
 */
export interface AssignTaskRequest {
  readonly assigneeId: UUID | 'auto'; // 'auto' для автоназначения по MDR
}

/**
 * Завершение задачи
 */
export interface CompleteTaskRequest {
  readonly comment?: string;
}

/**
 * Фильтры для списка задач
 */
export interface TaskListFilters extends PaginationParams {
  readonly status?: TaskStatus;
  readonly assigneeId?: UUID;
  readonly departmentId?: UUID;
  readonly priority?: TaskPriority;
  readonly tags?: readonly string[];
  readonly search?: string;
}
```

### Response DTOs

```typescript
/**
 * Данные задачи
 */
export interface TaskResponse {
  readonly id: UUID;
  readonly title: string;
  readonly description?: string;
  readonly status: TaskStatus;
  readonly priority: TaskPriority;
  readonly createdBy: UUID;
  readonly assigneeId?: UUID;
  readonly departmentId?: UUID;
  readonly dueDate?: ISODateTime;
  readonly mcReward: number;
  readonly tags: readonly string[];
  readonly estimatedHours?: number;
  readonly actualHours?: number;
  readonly createdAt: ISODateTime;
  readonly updatedAt: ISODateTime;
  readonly completedAt?: ISODateTime;
}

/**
 * Список задач с пагинацией
 */
export type TaskListResponse = PaginatedResponse<TaskResponse>;

/**
 * Задача с дополнительными данными (для детального просмотра)
 */
export interface TaskDetailResponse extends TaskResponse {
  readonly creator: {
    readonly id: UUID;
    readonly firstName: string;
    readonly lastName: string;
    readonly avatarUrl?: URL;
  };
  readonly assignee?: {
    readonly id: UUID;
    readonly firstName: string;
    readonly lastName: string;
    readonly avatarUrl?: URL;
  };
  readonly comments: readonly TaskCommentResponse[];
  readonly history: readonly TaskHistoryResponse[];
}

/**
 * Комментарий к задаче
 */
export interface TaskCommentResponse {
  readonly id: UUID;
  readonly taskId: UUID;
  readonly userId: UUID;
  readonly content: string;
  readonly createdAt: ISODateTime;
  readonly updatedAt: ISODateTime;
  readonly author: {
    readonly firstName: string;
    readonly lastName: string;
    readonly avatarUrl?: URL;
  };
}

/**
 * История изменений задачи
 */
export interface TaskHistoryResponse {
  readonly id: UUID;
  readonly taskId: UUID;
  readonly userId: UUID;
  readonly action: 'created' | 'updated' | 'assigned' | 'completed' | 'cancelled' | 'commented';
  readonly fieldName?: string;
  readonly oldValue?: string;
  readonly newValue?: string;
  readonly createdAt: ISODateTime;
  readonly actor: {
    readonly firstName: string;
    readonly lastName: string;
  };
}
```

---

## KPI DTOs

### Enums

```typescript
export enum KPIPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

export enum KPIStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}
```

### Request DTOs

```typescript
/**
 * Создание KPI метрики
 */
export interface CreateKPIRequest {
  readonly employeeId: UUID;
  readonly templateId: UUID;
  readonly periodStart: ISODate;
  readonly periodEnd: ISODate;
  readonly targetValue: number;
}

/**
 * Обновление текущего значения KPI
 */
export interface UpdateKPIValueRequest {
  readonly currentValue: number;
}
```

### Response DTOs

```typescript
/**
 * Шаблон KPI
 */
export interface KPITemplateResponse {
  readonly id: UUID;
  readonly name: string;
  readonly description?: string;
  readonly metricType: string;
  readonly unit?: string;
  readonly calculationPeriod: KPIPeriod;
  readonly defaultTargetValue?: number;
  readonly departmentId?: UUID;
  readonly isActive: boolean;
}

/**
 * KPI метрика сотрудника
 */
export interface KPIMetricResponse {
  readonly id: UUID;
  readonly employeeId: UUID;
  readonly templateId: UUID;
  readonly periodStart: ISODate;
  readonly periodEnd: ISODate;
  readonly targetValue: number;
  readonly currentValue: number;
  readonly achievementPercentage: number;
  readonly status: KPIStatus;
  readonly createdAt: ISODateTime;
  readonly updatedAt: ISODateTime;
  readonly template: {
    readonly name: string;
    readonly unit?: string;
  };
}

/**
 * Дашборд KPI сотрудника
 */
export interface EmployeeKPIDashboardResponse {
  readonly employeeId: UUID;
  readonly period: {
    readonly start: ISODate;
    readonly end: ISODate;
  };
  readonly overallAchievement: number; // percentage
  readonly metrics: readonly KPIMetricResponse[];
  readonly trends: {
    readonly improving: number;
    readonly stable: number;
    readonly declining: number;
  };
}
```

---

## Economy DTOs

### Enums

```typescript
export enum Currency {
  MC = 'MC', // MatrixCoin
  GMC = 'GMC', // Golden MatrixCoin
}

export enum TransactionType {
  TASK_REWARD = 'task_reward',
  TRANSFER = 'transfer',
  PURCHASE = 'purchase',
  BONUS = 'bonus',
  PENALTY = 'penalty',
  REFUND = 'refund',
}
```

### Request DTOs

```typescript
/**
 * Создание транзакции
 */
export interface CreateTransactionRequest {
  readonly toUserId: UUID;
  readonly amount: number; // min: 1
  readonly currency: Currency;
  readonly type: TransactionType;
  readonly description?: string;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Перевод между пользователями
 */
export interface TransferRequest {
  readonly toUserId: UUID;
  readonly amount: number;
  readonly currency: Currency;
  readonly description?: string;
}

/**
 * Активация сейфа (заморозка MC на 30 дней)
 */
export interface ActivateSafeRequest {
  readonly amount: number; // количество MC для заморозки
}
```

### Response DTOs

```typescript
/**
 * Баланс кошелька
 */
export interface WalletBalanceResponse {
  readonly userId: UUID;
  readonly mcBalance: number;
  readonly gmcBalance: number;
  readonly mcFrozen: number;
  readonly safe: {
    readonly active: boolean;
    readonly activatedAt?: ISODateTime;
    readonly unlockAt?: ISODateTime;
  };
}

/**
 * Транзакция
 */
export interface TransactionResponse {
  readonly id: UUID;
  readonly fromUserId?: UUID; // null для системных начислений
  readonly toUserId: UUID;
  readonly amount: number;
  readonly currency: Currency;
  readonly type: TransactionType;
  readonly description?: string;
  readonly relatedEntityType?: string;
  readonly relatedEntityId?: UUID;
  readonly metadata?: Record<string, unknown>;
  readonly createdAt: ISODateTime;
}

/**
 * История транзакций с пагинацией
 */
export type TransactionListResponse = PaginatedResponse<TransactionResponse>;

/**
 * Детальная транзакция с данными участников
 */
export interface TransactionDetailResponse extends TransactionResponse {
  readonly from?: {
    readonly id: UUID;
    readonly firstName: string;
    readonly lastName: string;
    readonly avatarUrl?: URL;
  };
  readonly to: {
    readonly id: UUID;
    readonly firstName: string;
    readonly lastName: string;
    readonly avatarUrl?: URL;
  };
}
```

---

## Валидация с Zod

### Установка

```bash
npm install zod
```

### Базовые схемы

```typescript
import { z } from 'zod';

// UUID validation
export const uuidSchema = z.string().uuid();

// Email validation
export const emailSchema = z.string().email().toLowerCase();

// Password validation
export const passwordSchema = z
  .string()
  .min(8, 'Пароль должен содержать минимум 8 символов')
  .regex(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
  .regex(/[a-z]/, 'Пароль должен содержать хотя бы одну строчную букву')
  .regex(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру')
  .regex(/[^A-Za-z0-9]/, 'Пароль должен содержать хотя бы один специальный символ');

// Date validation
export const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

// Pagination
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
});
```

### Схемы валидации для Authentication

```typescript
// Register
export const registerRequestSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(2).max(100).trim(),
  lastName: z.string().min(2).max(100).trim(),
  middleName: z.string().max(100).trim().optional(),
  departmentId: uuidSchema,
  telegramId: z.string().optional(),
});

// Login
export const loginRequestSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
});

// Refresh token
export const refreshTokenRequestSchema = z.object({
  refreshToken: z.string().min(1),
});
```

### Схемы валидации для Tasks

```typescript
// Create task
export const createTaskRequestSchema = z.object({
  title: z.string().min(5).max(255).trim(),
  description: z.string().optional(),
  priority: z.nativeEnum(TaskPriority),
  assigneeId: uuidSchema.optional(),
  departmentId: uuidSchema.optional(),
  dueDate: z.string().datetime().optional(),
  mcReward: z.number().int().min(0).default(100),
  tags: z.array(z.string()).default([]),
});

// Natural language task
export const naturalLanguageTaskRequestSchema = z.object({
  text: z.string().min(10).max(1000),
});

// Task filters
export const taskListFiltersSchema = paginationSchema.extend({
  status: z.nativeEnum(TaskStatus).optional(),
  assigneeId: uuidSchema.optional(),
  departmentId: uuidSchema.optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().optional(),
});
```

### Схемы валидации для Economy

```typescript
// Create transaction
export const createTransactionRequestSchema = z.object({
  toUserId: uuidSchema,
  amount: z.number().int().min(1),
  currency: z.nativeEnum(Currency),
  type: z.nativeEnum(TransactionType),
  description: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

// Transfer
export const transferRequestSchema = z.object({
  toUserId: uuidSchema,
  amount: z.number().int().min(1),
  currency: z.nativeEnum(Currency),
  description: z.string().max(500).optional(),
});
```

---

## Примеры использования

### В контроллере (NestJS)

```typescript
import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';

@Controller('tasks')
export class TasksController {
  @Post()
  @UsePipes(new ZodValidationPipe(createTaskRequestSchema))
  async createTask(
    @Body() dto: CreateTaskRequest,
  ): Promise<ApiResponse<TaskResponse>> {
    // dto уже валидирован и типизирован
    const task = await this.tasksService.create(dto);
    
    return {
      success: true,
      data: task,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      },
    };
  }
}
```

### ZodValidationPipe

```typescript
import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      throw new BadRequestException({
        success: false,
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message: 'Некорректные данные',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
      });
    }
  }
}
```

### В клиенте (React + RTK Query)

```typescript
import { api } from '@/services/api';
import type { CreateTaskRequest, TaskResponse, ApiResponse } from '@/types';

export const tasksApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createTask: builder.mutation<ApiResponse<TaskResponse>, CreateTaskRequest>({
      query: (body) => ({
        url: '/tasks',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Tasks'],
    }),
    
    getTasks: builder.query<TaskListResponse, TaskListFilters>({
      query: (params) => ({
        url: '/tasks',
        params,
      }),
      providesTags: ['Tasks'],
    }),
  }),
});

export const { useCreateTaskMutation, useGetTasksQuery } = tasksApi;
```

### Использование в компоненте

```typescript
import { useCreateTaskMutation } from '@/services/tasks';
import type { CreateTaskRequest } from '@/types';

function CreateTaskForm() {
  const [createTask, { isLoading }] = useCreateTaskMutation();
  
  const handleSubmit = async (data: CreateTaskRequest) => {
    try {
      const result = await createTask(data).unwrap();
      console.log('Task created:', result.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  // ...
}
```

---

## Резюме

### Статистика

- **DTO интерфейсов:** 50+
- **Enum типов:** 15+
- **Zod схем:** 30+
- **Валидационных правил:** 100+

### Следующие шаги

1. ✅ Сгенерировать TypeScript типы из OpenAPI спецификации
2. ✅ Создать Zod схемы для всех Request DTOs
3. ✅ Настроить автоматическую валидацию в NestJS
4. ✅ Создать React hooks для API вызовов
5. ✅ Добавить unit тесты для валидации

### Инструменты

- **Генерация типов из OpenAPI:** `openapi-typescript`
- **Валидация:** `zod`
- **API клиент:** `@rtk-query/codegen-openapi`
- **Документация:** `@scalar/api-reference`
