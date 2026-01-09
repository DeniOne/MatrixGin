# Модуль: Telegram Bot

**Приоритет:** КРИТИЧНЫЙ (MVP Phase 1)  
**Срок:** Недели 5-6  
**Команда:** 1 Backend разработчик

---

## 📋 ОПИСАНИЕ

Telegram бот - основной интерфейс взаимодействия для мобильных пользователей. Интеграция с Telegram Mini Apps (TMA) для полноценного web-приложения внутри Telegram.

### Основные функции

✅ **Базовые команды:**
- `/start` - приветствие + ссылка на TMA
- `/help` - список команд
- `/tasks` - мои задачи
- `/status` - статус, баланс MC/GMC
- `/create` - создать задачу
- `/logout` - выход

✅ **Уведомления:**
- Новая задача назначена
- Задача выполнена
- Комментарий к задаче
- MC начислены
- MC скоро сгорят
- Изменение статуса/ранга

✅ **Telegram Mini Apps (TMA):**
- Полноценный React UI внутри Telegram
- Аутентификация через Telegram ID
- Доступ ко всем функциям платформы

✅ **Inline кнопки:**
- Быстрые действия (Complete Task, View Details)
- Навигация по задачам
- Подтверждения

---

## 🤖 КОМАНДЫ БОТА

### /start
**Описание:** Приветственное сообщение и регистрация

**Ответ:**
```
Привет, {FirstName}! 👋

Я MatrixGin - твой цифровой ассистент в Фотоматрице.

Что я умею:
✅ Управлять задачами
✅ Показывать твой статус и баланс
✅ Отправлять уведомления
✅ Создавать задачи голосом

Открыть полное приложение:
[🚀 Запустить MatrixGin] (TMA кнопка)

Команды: /help
```

**Backend:**
```typescript
async handleStart(ctx) {
  const telegramId = ctx.from.id;
  const username = ctx.from.username;
  const firstName = ctx.from.first_name;
  
  // Проверить существует ли пользователь
  let user = await prisma.user.findUnique({
    where: { telegram_id: telegramId }
  });
  
  if (!user) {
    // Создать нового пользователя
    user = await prisma.user.create({
      data: {
        telegram_id: telegramId,
        telegram_username: username,
        first_name: firstName,
        role_id: defaultRoleId
      }
    });
  }
  
  await ctx.reply(welcomeMessage, {
    reply_markup: {
      inline_keyboard: [[
        { text: '🚀 Запустить MatrixGin', web_app: { url: TMA_URL } }
      ]]
    }
  });
}
```

---

### /help
**Описание:** Список всех команд

**Ответ:**
```
📋 Доступные команды:

/tasks - Мои задачи
/status - Мой статус и баланс
/create - Создать задачу
/wallet - Кошелек MC/GMC
/logout - Выход из системы

🌐 Полное приложение:
[Открыть MatrixGin] (TMA кнопка)

💬 Поддержка: @support
```

---

### /tasks
**Описание:** Список активных задач пользователя

**Ответ:**
```
📝 Твои задачи (5 активных):

1️⃣ Проверить принтеры на Мира
   📍 Филиал Мира
   ⏰ До: сегодня 18:00
   [✅ Выполнить] [👁 Детали]

2️⃣ Обновить прайс-лист
   📍 Офис
   ⏰ До: завтра 12:00
   [✅ Выполнить] [👁 Детали]

...

[➕ Создать задачу] /create
```

**Backend:**
```typescript
async handleTasks(ctx) {
  const telegramId = ctx.from.id;
  const user = await getUserByTelegramId(telegramId);
  
  if (!user) {
    return ctx.reply('Сначала выполни /start');
  }
  
  const tasks = await prisma.task.findMany({
    where: {
      assignee_id: user.id,
      status: { in: ['pending', 'in_progress'] }
    },
    take: 10,
    orderBy: { deadline: 'asc' }
  });
  
  const message = formatTaskList(tasks);
  const buttons = tasks.map(task => [
    { text: `✅ ${task.title}`, callback_data: `complete_${task.id}` },
    { text: '👁', callback_data: `view_${task.id}` }
  ]);
  
  await ctx.reply(message, {
    reply_markup: { inline_keyboard: buttons }
  });
}
```

---

### /status
**Описание:** Статус сотрудника и баланс

**Ответ:**
```
👤 Иван Иванов
⭐ Статус: Топчик
🏆 Ранг: Коллекционер

💰 Баланс:
• MC: 1,250 (⚠️ 150 сгорят через 7 дней)
• GMC: 50

📊 Статистика:
• Задач выполнено: 45
• KPI: 95.5%
• Стаж: 10 месяцев

📈 До следующего статуса (Кремень):
▓▓▓▓▓▓░░░░ 60%
• Осталось задач: 5
• Осталось MC: 250

[💼 Открыть профиль] (TMA кнопка)
```

---

### /create
**Описание:** Создать задачу через inline форм или голосовое сообщение

**Ответ:**
```
📝 Создание задачи

Способ 1: Текстом
Опиши задачу одним сообщением, например:
"Проверить принтеры на Мира завтра до 18:00"

Способ 2: Голосом 🎤
Запиши голосовое сообщение с описанием задачи

Способ 3: Форма
[📋 Заполнить форму] (inline кнопка)

Отмена: /cancel
```

**Backend (NLP парсинг):**
```typescript
async handleCreateTask(ctx) {
  const text = ctx.message.text;
  
  // NLP парсинг
  const parsed = await nlpService.parseTask(text);
  
  // Создать задачу
  const task = await taskService.create({
    title: parsed.action + ' ' + parsed.object,
    description: text,
    location: parsed.location,
    deadline: parsed.deadline,
    priority: parsed.priority,
    creator_id: user.id
  });
  
  // Автоназначение по МДР
  const assignee = await taskAssignmentService.autoAssign(task);
  
  await ctx.reply(`
✅ Задача создана!

📝 ${task.title}
👤 Назначена: ${assignee.name}
📍 ${task.location}
⏰ До: ${formatDate(task.deadline)}

[👁 Посмотреть] /tasks
  `);
}
```

---

### /wallet
**Описание:** Детали кошелька

**Ответ:**
```
💰 Твой кошелек

MC (MatrixCoin):
• Доступно: 1,100
• В сейфе: 100 (до 22.12.2025)
• Сгорает: 150 (через 7 дней)

GMC (Golden MC):
• Баланс: 50

📊 История транзакций:
[📜 Открыть] (TMA кнопка)

🛒 Магазин:
[🛍 Купить товары] (TMA кнопка)
```

---

## 📬 УВЕДОМЛЕНИЯ

### Типы уведомлений

#### 1. Новая задача
```
🆕 Новая задача!

📝 Проверить принтеры на Мира
📍 Филиал Мира
⏰ До: сегодня 18:00
💰 Награда: +100 MC

[✅ Принять] [👁 Детали]
```

#### 2. Задача выполнена
```
✅ Задача выполнена!

📝 Обновить прайс-лист
💰 +80 MC начислено
🎯 KPI обновлен: 95.5% (+2%)

[📊 Мой статус] /status
```

#### 3. MC сгорают
```
⚠️ Внимание!

💸 150 MC сгорят через 3 дня!

Используй их или активируй Сейф:
[🔒 Активировать Сейф] (callback)
[🛍 Купить в магазине] (TMA)
```

#### 4. Повышение статуса
```
🎉 Поздравляем!

⭐ Новый статус: Кремень!

🎁 Бонусы:
• +500 MC
• Скидка 10% в магазине
• Приоритет в задачах

[🏆 Посмотреть] /status
```

---

## 🌐 TELEGRAM MINI APPS (TMA)

### Настройка

```javascript
// frontend/src/telegram/tma.ts
import { useEffect } from 'react';

export function useTelegramWebApp() {
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    
    // Развернуть приложение
    tg.expand();
    
    // Установить цвета темы
    tg.setHeaderColor('#1976d2');
    tg.setBackgroundColor('#ffffff');
    
    // Включить главную кнопку
    tg.MainButton.setText('Сохранить');
    tg.MainButton.show();
    tg.MainButton.onClick(() => {
      // Действие при клике
    });
    
    // Получить данные пользователя
    const user = tg.initDataUnsafe.user;
    
    return () => {
      tg.MainButton.hide();
    };
  }, []);
}
```

### Аутентификация через TMA

```typescript
// Backend: Verify Telegram data
import crypto from 'crypto';

function verifyTelegramWebAppData(initData: string): boolean {
  const secret = crypto
    .createHmac('sha256', 'WebAppData')
    .update(TELEGRAM_BOT_TOKEN)
    .digest();
    
  const dataCheckString = /* parse initData */;
  
  const hash = crypto
    .createHmac('sha256', secret)
    .update(dataCheckString)
    .digest('hex');
    
  return hash === receivedHash;
}

// Endpoint для TMA auth
@Post('/api/auth/telegram')
async telegramAuth(@Body() data: TelegramAuthDto) {
  if (!verifyTelegramWebAppData(data.initData)) {
    throw new UnauthorizedException();
  }
  
  const user = await getUserByTelegramId(data.user.id);
  const tokens = await authService.generateTokens(user);
  
  return tokens;
}
```

---

## 🔌 WEBHOOK VS POLLING

### Рекомендация: Webhook (production)

```typescript
// src/telegram/telegram.module.ts
import { Telegraf } from 'telegraf';

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

// Webhook setup
app.use(bot.webhookCallback('/telegram-webhook'));

bot.telegram.setWebhook(`${APP_URL}/telegram-webhook`);
```

### Polling (development)

```typescript
// Для локальной разработки
bot.launch();
```

---

## 🗄️ БАЗА ДАННЫХ

### Расширение users table

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS telegram_chat_id BIGINT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS telegram_notifications_enabled BOOLEAN DEFAULT true;

CREATE INDEX idx_users_telegram_chat ON users(telegram_chat_id);
```

### Таблица для отслеживания сообщений

```sql
CREATE TABLE telegram_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    chat_id BIGINT NOT NULL,
    message_id INTEGER NOT NULL,
    message_type VARCHAR(50), -- notification, command_response
    content JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 📊 МЕТРИКИ УСПЕХА

- [ ] 80%+ пользователей используют Telegram бот
- [ ] 50%+ задач создаются через Telegram
- [ ] <2 секунды среднее время ответа
- [ ] 99%+ uptime
- [ ] NLP точность >85%
- [ ] TMA загружается <3 секунд

---

## 🧪 ТЕСТИРОВАНИЕ

### Unit Tests
- ✅ Команды обработки
- ✅ NLP парсинг
- ✅ Уведомления форматирование
- ✅ Callback handlers

### Integration Tests
- ✅ E2E: /start → /tasks → complete task
- ✅ E2E: /create → NLP → task created
- ✅ Webhook delivery
- ✅ TMA authentication

---

## 📝 ЗАВИСИМОСТИ

### От других модулей
- `02-Authentication-Authorization` - user accounts
- `20-Task-Management` - задачи
- `15-MatrixCoin-Economy` - баланс
- `01-Advanced-Gamification` - статусы

### Используется модулями
- Все модули - уведомления
