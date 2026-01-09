# Модуль: Authentication & Authorization

**Приоритет:** КРИТИЧНЫЙ (MVP Phase 1)  
**Срок:** Недели 1-2  
**Команда:** 1 Backend + 1 Frontend разработчик

---

## 📋 ОПИСАНИЕ

Система аутентификации и авторизации - фундамент безопасности платформы MatrixGin. Реализует JWT-based аутентификацию и RBAC для управления доступом.

### Основные функции

✅ **Аутентификация:**
- Регистрация пользователей (email + пароль)
- Вход в систему
- Интеграция с Telegram
- Восстановление пароля
- Email верификация

✅ **Управление сессиями:**
- JWT Access Tokens (TTL: 15 минут)
- Refresh Tokens (TTL: 7 дней)
- Автоматическое обновление токенов
- Logout с инвалидацией токенов

✅ **RBAC (Role-Based Access Control):**
- Роли: Admin, Manager, Employee, Guest
- Permissions для детального контроля
- Middleware для проверки прав
- Интеграция с audit log

---

## 🗄️ БАЗА ДАННЫХ

### Таблицы

```sql
-- Пользователи
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    telegram_id BIGINT UNIQUE,
    telegram_username VARCHAR(100),
    role_id UUID REFERENCES roles(id),
    status VARCHAR(50) DEFAULT 'active',
    email_verified BOOLEAN DEFAULT false,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Роли
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    level INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Разрешения
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT
);

-- Связь ролей и разрешений
CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- Refresh токены
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_telegram ON users(telegram_id);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
```

---

## 🔌 API ENDPOINTS

### 1. POST `/api/auth/register`
Регистрация нового пользователя

**Request:**
```json
{
  "email": "ivan@photomatrix.ru",
  "password": "SecurePass123!",
  "firstName": "Иван",
  "lastName": "Иванов"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-123",
      "email": "ivan@photomatrix.ru",
      "firstName": "Иван",
      "lastName": "Иванов",
      "role": "employee"
    },
    "tokens": {
      "accessToken": "eyJhbGci...",
      "refreshToken": "eyJhbGci...",
      "expiresIn": 900
    }
  }
}
```

### 2. POST `/api/auth/login`
Вход в систему

**Request:**
```json
{
  "email": "ivan@photomatrix.ru",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-123",
      "email": "ivan@photomatrix.ru",
      "role": "employee",
      "permissions": ["tasks:read", "tasks:create"]
    },
    "tokens": {
      "accessToken": "eyJhbGci...",
      "refreshToken": "eyJhbGci...",
      "expiresIn": 900
    }
  }
}
```

### 3. POST `/api/auth/refresh`
Обновление access token

**Request:**
```json
{
  "refreshToken": "eyJhbGci..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGci...",
    "expiresIn": 900
  }
}
```

### 4. POST `/api/auth/logout`
Выход из системы

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 5. POST `/api/auth/forgot-password`
Восстановление пароля

**Request:**
```json
{
  "email": "ivan@photomatrix.ru"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

### 6. POST `/api/auth/reset-password`
Сброс пароля

**Request:**
```json
{
  "token": "reset-token-123",
  "newPassword": "NewSecurePass123!"
}
```

### 7. GET `/api/auth/me`
Получение информации о текущем пользователе

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-123",
    "email": "ivan@photomatrix.ru",
    "firstName": "Иван",
    "lastName": "Иванов",
    "role": {
      "id": "role-uuid",
      "name": "employee",
      "permissions": ["tasks:read", "tasks:create"]
    }
  }
}
```

---

## 🛠️ ТЕХНОЛОГИЧЕСКИЙ СТЕК

### Backend
- **Node.js + Express.js** - HTTP сервер
- **Passport.js** - стратегии аутентификации
- **jsonwebtoken** - генерация/валидация JWT
- **bcrypt** - хеширование паролей
- **express-validator** - валидация входных данных
- **Prisma ORM** - работа с БД

### Frontend
- **React 18** - UI компоненты
- **Redux Toolkit** - state management
- **RTK Query** - API запросы
- **React Hook Form** - формы
- **Yup** - валидация форм

---

## 🔐 БЕЗОПАСНОСТЬ

### Требования к паролю
- Минимум 8 символов
- Минимум 1 заглавная буква
- Минимум 1 цифра
- Минимум 1 спецсимвол

### JWT конфигурация
```javascript
{
  accessToken: {
    secret: process.env.JWT_SECRET,
    expiresIn: '15m',
    algorithm: 'HS256'
  },
  refreshToken: {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: '7d',
    algorithm: 'HS256'
  }
}
```

### Rate Limiting
- Login: 5 попыток / 15 минут
- Register: 3 попытки / час
- Password reset: 3 попытки / час

### Audit Log
Все критичные операции логируются:
- Успешный вход
- Неудачные попытки входа
- Изменение пароля
- Создание/удаление пользователя
- Изменение ролей/прав

---

## 📊 МЕТРИКИ УСПЕХА

- [ ] 100% покрытие unit-тестами
- [ ] Response time < 200ms
- [ ] 0 критичных уязвимостей (OWASP Top 10)
- [ ] Успешное прохождение penetration testing
- [ ] Документация OpenAPI актуальна

---

## 🧪 ТЕСТИРОВАНИЕ

### Unit Tests
- ✅ Регистрация пользователя
- ✅ Вход с корректными credentials
- ✅ Вход с некорректными credentials
- ✅ Генерация JWT токенов
- ✅ Валидация JWT токенов
- ✅ Refresh token обновление
- ✅ Password hashing/verification
- ✅ RBAC проверка прав

### Integration Tests
- ✅ E2E регистрация → вход → получение данных
- ✅ Token refresh flow
- ✅ Password reset flow
- ✅ Logout с инвалидацией токена

### Security Tests
- ✅ SQL Injection защита
- ✅ XSS защита
- ✅ CSRF защита
- ✅ Brute-force защита (rate limiting)
- ✅ JWT подделка

---

## 📝 ЗАВИСИМОСТИ

### От других модулей
- Нет (базовый модуль)

### Используется модулями
- ВСЕ модули (обязательная аутентификация)

---

## 🚀 ДЕПЛОЙ

### Environment Variables
```bash
JWT_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_ROUNDS=10
```

### Health Check
```
GET /api/auth/health
```

---

## 📚 ДОКУМЕНТАЦИЯ

- OpenAPI спецификация: `/docs/auth`
- Postman коллекция: `./postman/auth.json`
