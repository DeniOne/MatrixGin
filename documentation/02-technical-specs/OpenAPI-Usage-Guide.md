# MatrixGin v2.0 - OpenAPI Specification Guide

> **Как использовать OpenAPI спецификацию для разработки**

---

## 📋 Что создано

### 1. API-Specification-OpenAPI-FULL.yaml
**Статус:** Базовая структура + Authentication + Employees + Tasks + Economy  
**Размер:** ~1,500 строк  
**Покрытие:** ~40 эндпоинтов из 155

**Содержит:**
- ✅ Полная структура OpenAPI 3.1
- ✅ Все базовые схемы (UUID, Email, DateTime, etc.)
- ✅ API Response wrappers
- ✅ Все Enums (UserRole, TaskStatus, Currency, etc.)
- ✅ Authentication endpoints (8)
- ✅ Employee schemas и endpoints (частично)
- ✅ Task schemas и endpoints (частично)
- ✅ Economy schemas (частично)

### 2. API-Endpoints-Catalog.md
**Статус:** Полный каталог всех 155 эндпоинтов  
**Формат:** Markdown таблицы  

**Содержит:**
- ✅ Все 155 эндпоинтов с описаниями
- ✅ HTTP методы
- ✅ RBAC требования
- ✅ Статистика по модулям
- ✅ Список всех permissions

---

## 🚀 Как использовать

### Для Backend разработчиков

#### 1. Просмотр спецификации

```bash
# Установить Swagger UI
npm install -g @scalar/cli

# Запустить локальный сервер
scalar serve API-Specification-OpenAPI-FULL.yaml

# Откроется http://localhost:5000
```

#### 2. Генерация TypeScript типов

```bash
# Установить генератор
npm install -D openapi-typescript

# Сгенерировать типы
npx openapi-typescript API-Specification-OpenAPI-FULL.yaml -o src/types/api.ts
```

**Использование:**

```typescript
import type { paths, components } from './types/api';

// Request type
type LoginRequest = components['schemas']['LoginRequest'];

// Response type
type AuthResponse = components['schemas']['AuthResponse'];

// Endpoint type
type LoginEndpoint = paths['/auth/login']['post'];
```

#### 3. Генерация NestJS контроллеров

```bash
# Установить генератор
npm install -D @openapitools/openapi-generator-cli

# Сгенерировать контроллеры
npx openapi-generator-cli generate \
  -i API-Specification-OpenAPI-FULL.yaml \
  -g typescript-nestjs \
  -o src/generated
```

#### 4. Валидация спецификации

```bash
# Установить валидатор
npm install -D @redocly/cli

# Проверить спецификацию
npx redocly lint API-Specification-OpenAPI-FULL.yaml
```

---

### Для Frontend разработчиков

#### 1. Генерация RTK Query endpoints

```bash
# Установить генератор
npm install -D @rtk-query/codegen-openapi

# Создать конфиг openapi-config.ts
```

**openapi-config.ts:**

```typescript
import type { ConfigFile } from '@rtk-query/codegen-openapi';

const config: ConfigFile = {
  schemaFile: '../backend/API-Specification-OpenAPI-FULL.yaml',
  apiFile: './src/app/api.ts',
  apiImport: 'baseApi',
  outputFile: './src/app/generated-api.ts',
  exportName: 'matrixginApi',
  hooks: true,
};

export default config;
```

**Генерация:**

```bash
npx @rtk-query/codegen-openapi openapi-config.ts
```

**Использование:**

```typescript
import { useLoginMutation, useGetEmployeesQuery } from './app/generated-api';

function LoginForm() {
  const [login, { isLoading }] = useLoginMutation();
  
  const handleSubmit = async (data) => {
    const result = await login(data).unwrap();
    console.log(result.accessToken);
  };
}
```

#### 2. Генерация Axios клиента

```bash
npx openapi-generator-cli generate \
  -i API-Specification-OpenAPI-FULL.yaml \
  -g typescript-axios \
  -o src/api-client
```

**Использование:**

```typescript
import { AuthenticationApi, Configuration } from './api-client';

const config = new Configuration({
  basePath: 'https://api.matrixgin.photomatrix.ru/v1',
  accessToken: localStorage.getItem('token'),
});

const authApi = new AuthenticationApi(config);

// Login
const response = await authApi.login({
  email: 'user@example.com',
  password: 'password',
});
```

---

### Для QA Engineers

#### 1. Импорт в Postman

1. Открыть Postman
2. File → Import
3. Выбрать `API-Specification-OpenAPI-FULL.yaml`
4. Postman автоматически создаст коллекцию

#### 2. Генерация тестов

```bash
# Установить Newman
npm install -g newman

# Экспортировать коллекцию из Postman
# Запустить тесты
newman run matrixgin-collection.json -e production.json
```

#### 3. Использование в Insomnia

1. Открыть Insomnia
2. Create → Import from File
3. Выбрать `API-Specification-OpenAPI-FULL.yaml`

---

## 📝 Дополнение спецификации

### Структура для добавления новых эндпоинтов

```yaml
paths:
  /api/your-endpoint:
    get:
      tags:
        - YourModule
      summary: Краткое описание
      description: |
        Детальное описание эндпоинта.
        Может быть многострочным.
      operationId: yourOperationId
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: page
          in: query
          required: false
          schema:
            type: integer
            minimum: 1
            default: 1
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/YourRequest'
      responses:
        '200':
          description: Успешный ответ
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/ApiResponse'
                  - type: object
                    properties:
                      data:
                        $ref: '#/components/schemas/YourResponse'
        '400':
          description: Ошибка валидации
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ApiError'
        '401':
          description: Не авторизован
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ApiError'
        '403':
          description: Недостаточно прав
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ApiError'
        '404':
          description: Не найдено
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ApiError'
        '500':
          description: Внутренняя ошибка сервера
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ApiError'
```

### Добавление новой схемы

```yaml
components:
  schemas:
    YourRequest:
      type: object
      required:
        - field1
        - field2
      properties:
        field1:
          type: string
          minLength: 3
          maxLength: 100
          example: 'Example value'
        field2:
          type: integer
          minimum: 0
          maximum: 100
          example: 42
        optionalField:
          type: string
          description: Опциональное поле
          
    YourResponse:
      type: object
      required:
        - id
        - createdAt
      properties:
        id:
          $ref: '#/components/schemas/UUID'
        field1:
          type: string
        field2:
          type: integer
        createdAt:
          $ref: '#/components/schemas/ISODateTime'
        updatedAt:
          $ref: '#/components/schemas/ISODateTime'
```

---

## 🎯 Следующие шаги

### Приоритет 1: Завершить MVP эндпоинты

Добавить в `API-Specification-OpenAPI-FULL.yaml`:

- [ ] Все Employee endpoints (15 total)
- [ ] Все Task endpoints (11 total)
- [ ] Все Department endpoints (16 total)
- [ ] Все Economy endpoints (17 total)
- [ ] Все Gamification endpoints (8 total)
- [ ] Все Legal & Compliance endpoints (18 total)
- [ ] Все Feedback endpoints (10 total)
- [ ] Все Emotional Analytics endpoints (4 total)
- [ ] Все Cabinet endpoints (7 total)

**Итого MVP:** 93 эндпоинта

### Приоритет 2: Phase 2 эндпоинты

- [ ] Strategy & Management (10)
- [ ] Learning & Education (8)
- [ ] Self-Learning (5)
- [ ] Executive Dashboard (4)
- [ ] HR Analytics (5)
- [ ] Ethics Manager (4)
- [ ] Knowledge (6)
- [ ] Content (5)
- [ ] Kaizen (9)
- [ ] Social Monitoring (3)

**Итого Phase 2:** 62 эндпоинта

---

## 📚 Полезные ссылки

### Документация

- [OpenAPI 3.1 Specification](https://spec.openapis.org/oas/v3.1.0)
- [Swagger Editor](https://editor.swagger.io/)
- [OpenAPI Generator](https://openapi-generator.tech/)
- [RTK Query Code Generation](https://redux-toolkit.js.org/rtk-query/usage/code-generation)

### Инструменты

- [Scalar API Reference](https://github.com/scalar/scalar) - Современный Swagger UI
- [Redocly CLI](https://redocly.com/docs/cli/) - Валидация и линтинг
- [openapi-typescript](https://github.com/drwpow/openapi-typescript) - Генерация TypeScript типов
- [Postman](https://www.postman.com/) - Тестирование API
- [Insomnia](https://insomnia.rest/) - Альтернатива Postman

---

## ✅ Чеклист качества спецификации

При добавлении новых эндпоинтов проверяйте:

- [ ] Указан правильный HTTP метод (GET/POST/PUT/PATCH/DELETE)
- [ ] Добавлен тег для группировки
- [ ] Написано краткое summary
- [ ] Добавлено детальное description
- [ ] Указан operationId (уникальный)
- [ ] Определены все параметры (path, query, header)
- [ ] Добавлен requestBody (если нужен)
- [ ] Определены все возможные responses (200, 400, 401, 403, 404, 500)
- [ ] Используются $ref для переиспользования схем
- [ ] Добавлены примеры (example)
- [ ] Указаны ограничения (minLength, maxLength, minimum, maximum, pattern)
- [ ] Определены required поля
- [ ] Добавлены descriptions для полей
- [ ] Указан security (если требуется аутентификация)

---

**Дата создания:** 2025-11-21  
**Версия:** 1.0  
**Статус:** Ready for Development
