# Чеклист разработки: Telegram Bot

**Модуль:** 21-Telegram-Bot  
**Статус:** 🟡 Частично выполнен  
**Прогресс:** 55/100

---

## 📅 ПЛАН РАЗРАБОТКИ

### Неделя 5-6: Bot Development
- **Дни 1-2:** Базовые команды
- **Дни 3-4:** Уведомления + NLP
- **День 5:** TMA интеграция

---

## ✅ ЧЕКЛИСТ BACKEND

### 1. Telegram Bot Setup (3 часа) ✅ ВЫПОЛНЕНО

- [x] **1.1** Получить Bot Token от BotFather ✅
- [x] **1.2** Установить Telegraf библиотеку ✅
  ```bash
  npm install telegraf
  ```
- [x] **1.3** Создать Telegram модуль ✅
- [x] **1.4** Выбрать метод: Webhook (prod) / Polling (dev) ✅
- [x] **1.5** Настроить базовую конфигурацию ✅

**Файлы:**
```
src/telegram/ (создать структуру)
```

**Статус:** 100% завершено ✅

---

### 2. Database Schema (2 часа) ✅ ЧАСТИЧНО ВЫПОЛНЕНО

- [x] **2.1** Расширить `users` table ✅
  ```sql
  - telegram_id BIGINT
  - telegram_username VARCHAR
  - telegram_chat_id BIGINT
  - telegram_notifications_enabled BOOLEAN
  ```

- [ ] **2.2** Создать `telegram_messages` table
  ```sql
  - user_id, chat_id, message_id
  - message_type, content JSONB
  ```

- [x] **2.3** Добавить индексы ✅

**Статус:** 70% завершено

---

### 3. Базовые команды (6 часов) ✅ ЧАСТИЧНО ВЫПОЛНЕНО

- [x] **3.1** `/start` - приветствие ✅
  - Регистрация нового пользователя
  - Проверка существующего
  - TMA кнопка

- [x] **3.2** `/help` - список команд ✅

- [x] **3.3** `/tasks` - список задач ✅
  - Получить задачи пользователя
  - Inline кнопки (Complete, View)
  - Pagination для >10 задач

- [x] **3.4** `/status` - статус и баланс ✅
  - Статус, ранг
  - MC/GMC баланс
  - Progress bar

- [x] **3.5** `/create` - создать задачу ✅
  - NLP парсинг текста
  - Голосовое сообщение (опционально)
  - Inline форма

- [ ] **3.6** `/wallet` - детали кошелька
  - MC available, frozen, expiring
  - GMC balance
  - Link to transactions

- [x] **3.7** `/logout` - выход ✅

**Файлы:**
```
src/telegram/commands/ (создать)
src/telegram/commands/start.command.ts
src/telegram/commands/help.command.ts
src/telegram/commands/tasks.command.ts
src/telegram/commands/status.command.ts
src/telegram/commands/create.command.ts
```

**Статус:** 85% завершено (из мастер-чеклиста Module 6)

---

### 4. Callback Handlers (4 часа) ✅ ЧАСТИЧНО ВЫПОЛНЕНО

- [x] **4.1** `complete_task` callback ✅
  ```typescript
  bot.action(/complete_(.+)/, async (ctx) => {
    const taskId = ctx.match[1];
    await taskService.complete(taskId);
    await ctx.answerCbQuery('✅ Задача выполнена!');
  });
  ```

- [ ] **4.2** `view_task` callback
  - Показать детали задачи
  - Комментарии
  - История

- [ ] **4.3** `activate_safe` callback
  - Форма ввода суммы
  - Подтверждение
  - Активация сейфа

- [ ] **4.4** `buy_item` callback (Store)

**Статус:** 40% завершено

---

### 5. Notification Service (5 часов) ✅ ЧАСТИЧНО ВЫПОЛНЕНО

- [x] **5.1** Создать `TelegramNotificationService` ✅

- [x] **5.2** `sendTaskAssigned(userId, task)` ✅
  ```typescript
  const message = `
🆕 Новая задача!

📝 ${task.title}
⏰ До: ${formatDate(task.deadline)}
💰 Награда: +${task.reward} MC

[✅ Принять]
  `;
  await bot.telegram.sendMessage(chatId, message, buttons);
  ```

- [x] **5.3** `sendTaskCompleted(userId, task, mcEarned)` ✅

- [ ] **5.4** `sendMCExpiring(userId, amount, daysLeft)`
  ```typescript
  ⚠️ Внимание!
  💸 ${amount} MC сгорят через ${daysLeft} дней!
  ```

- [ ] **5.5** `sendStatusUpgraded(userId, newStatus, bonuses)`

- [ ] **5.6** `sendAuctionWon(userId, auction, gmcAwarded)`

- [ ] **5.7** `sendTaskCommented(userId, task, comment)`

**Файл:**
```
src/services/telegram.service.ts ✅ (существует, дополнить)
```

**Статус:** 50% завершено

---

### 6. NLP Integration (4 часа)

- [ ] **6.1** Интеграция с NLP сервисом
  ```typescript
  async handleTextMessage(ctx) {
    const text = ctx.message.text;
    
    // Парсинг через NLP
    const parsed = await nlpService.parseTask(text);
    
    // Создание задачи
    const task = await taskService.createFromNLP(parsed);
    
    // Ответ пользователю
    await ctx.reply(`✅ Задача создана: ${task.title}`);
  }
  ```

- [ ] **6.2** Обработка голосовых сообщений
  ```typescript
  bot.on('voice', async (ctx) => {
    // Speech-to-Text (GigaChat SaluteSpeech)
    const text = await speechToText(ctx.message.voice.file_id);
    
    // NLP парсинг
    const parsed = await nlpService.parseTask(text);
    
    // Создание задачи
    ...
  });
  ```

- [ ] **6.3** Fallback для неудачного парсинга
- [ ] **6.4** Подтверждение распарсенной задачи

**Статус:** 0% завершено

---

### 7. Telegram Mini Apps (TMA) (6 часов)

- [ ] **7.1** Настроить TMA endpoint
  ```typescript
  @BotCommand('webapp')
  async webApp(ctx) {
    await ctx.reply('Запустить приложение:', {
      reply_markup: {
        inline_keyboard: [[
          {
            text: '🚀 Открыть MatrixGin',
            web_app: { url: process.env.TMA_URL }
          }
        ]]
      }
    });
  }
  ```

- [ ] **7.2** Frontend TMA integration
  ```typescript
  // frontend/src/telegram/tma-init.ts
  import { useEffect } from 'react';
  
  export function useTelegramWebApp() {
    useEffect(() => {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      
      // Theme
      tg.setHeaderColor('#1976d2');
      
      // Main Button
      tg.MainButton.setText('Сохранить');
      tg.MainButton.show();
      
      return () => tg.MainButton.hide();
    }, []);
  }
  ```

- [ ] **7.3** TMA Authentication
  ```typescript
  // Verify initData
  function verifyTelegramWebAppData(initData: string): boolean {
    const secret = crypto
      .createHmac('sha256', 'WebAppData')
      .update(BOT_TOKEN)
      .digest();
    
    // Validate hash
    ...
  }
  ```

- [ ] **7.4** Backend endpoint для TMA auth
  ```typescript
  @Post('/api/auth/telegram-webapp')
  async tmaAuth(@Body() data: TMAAuthDto) {
    if (!verifyTelegramWebAppData(data.initData)) {
      throw new UnauthorizedException();
    }
    
    const user = await getUserByTelegramId(data.user.id);
    return await authService.generateTokens(user);
  }
  ```

- [ ] **7.5** Тестирование TMA в Telegram

**Статус:** 0% завершено

---

### 8. Webhook Setup (3 часа)

- [ ] **8.1** Настроить Webhook для production
  ```typescript
  // src/telegram/telegram.module.ts
  const bot = new Telegraf(BOT_TOKEN);
  
  app.use(bot.webhookCallback('/telegram-webhook'));
  
  // Set webhook
  await bot.telegram.setWebhook(`${APP_URL}/telegram-webhook`);
  ```

- [ ] **8.2** Валидация webhook секрета
- [ ] **8.3** Error handling для webhook
- [ ] **8.4** Polling mode для development
  ```typescript
  if (process.env.NODE_ENV === 'development') {
    bot.launch();
  }
  ```

**Статус:** 0% завершено

---

### 9. Middleware (3 часа)

- [ ] **9.1** Auth middleware
  ```typescript
  bot.use(async (ctx, next) => {
    const telegramId = ctx.from?.id;
    const user = await getUserByTelegramId(telegramId);
    
    if (!user && ctx.updateType !== 'message') {
      return ctx.reply('Сначала выполни /start');
    }
    
    ctx.state.user = user;
    await next();
  });
  ```

- [ ] **9.2** Logging middleware
  ```typescript
  bot.use(async (ctx, next) => {
    logger.info(`Telegram: ${ctx.updateType} from ${ctx.from?.id}`);
    await next();
  });
  ```

- [ ] **9.3** Rate limiting
  ```typescript
  const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 1000 // 1 msg per second per user
  });
  ```

**Статус:** 0% завершено

---

### 10. Controllers Integration (2 часа) ✅ ЧАСТИЧНО ВЫПОЛНЕНО

- [x] **10.1** Создать `TelegramController` ✅
- [x] **10.2** Webhook endpoint ✅
- [ ] **10.3** TMA auth endpoint
- [ ] **10.4** Manual notification trigger (Admin only)

**Файл:**
```
src/controllers/telegram.controller.ts ✅ (существует)
```

**Статус:** 50% завершено

---

### 11. Интеграции (4 часа) ✅ ЧАСТИЧНО ВЫПОЛНЕНО

- [x] **11.1** Task Management ✅
  - Notifications при assignment
  - Notifications при completion
  - Task creation через бот

- [ ] **11.2** MatrixCoin Economy
  - Balance queries
  - MC expiration warnings
  - Store purchases

- [ ] **11.3** Gamification
  - Status/Rank display
  - Achievement notifications
  - Leaderboard

- [ ] **11.4** Employee Management
  - Profile viewing
  - Status changes

**Статус:** 40% завершено

---

## ✅ ЧЕКЛИСТ FRONTEND (TMA)

### 12. TMA UI Components (6 часов)

- [ ] **12.1** TMA Layout
  - Header с Telegram стилями
  - Bottom navigation
  - Main content area

- [ ] **12.2** TMA-specific компоненты
  - BackButton integration
  - MainButton integration
  - SettingsButton

- [ ] **12.3** Theme sync с Telegram
  ```typescript
  const tg = window.Telegram.WebApp;
  const isDark = tg.colorScheme === 'dark';
  ```

- [ ] **12.4** Haptic feedback
  ```typescript
  tg.HapticFeedback.impactOccurred('light');
  ```

**Файлы:**
```
frontend/src/telegram/TMALayout.tsx
frontend/src/telegram/useTMA.ts
```

**Статус:** 0% завершено

---

### 13. TMA Pages (4 часа)

- [ ] **13.1** TMA Dashboard
- [ ] **13.2** TMA Tasks
- [ ] **13.3** TMA Wallet
- [ ] **13.4** TMA Profile

**Статус:** 0% завершено

---

## ✅ ТЕСТИРОВАНИЕ

### 14. Backend Tests (5 часов)

- [x] **14.1** Тесты команд ✅ (частично)
  - /start, /help, /tasks
  - Callback handlers

- [ ] **14.2** Тесты уведомлений
  - Форматирование
  - Delivery

- [ ] **14.3** Тесты NLP integration
- [ ] **14.4** Тесты TMA auth
- [ ] **14.5** Webhook тесты

**Статус:** 30% завершено

---

### 15. Integration Tests (3 часа)

- [ ] **15.1** E2E: /start → /tasks → complete task
- [ ] **15.2** E2E: /create → NLP → task created
- [ ] **15.3** E2E: TMA auth → navigate → action
- [ ] **15.4** Notification delivery test

**Статус:** 0% завершено

---

### 16. Manual Testing (2 часа)

- [ ] **16.1** Тестирование всех команд в реальном Telegram
- [ ] **16.2** Тестирование TMA на iOS
- [ ] **16.3** Тестирование TMA на Android
- [ ] **16.4** Тестирование уведомлений

**Статус:** 0% завершено

---

## ✅ ДОКУМЕНТАЦИЯ

### 17. Bot Documentation (2 часа)

- [ ] **17.1** Список всех команд
- [ ] **17.2** Примеры использования
- [ ] **17.3** TMA setup guide
- [ ] **17.4** Webhook configuration

**Статус:** 0% завершено

---

## ✅ ДЕПЛОЙ

### 18. Environment Setup (2 часа)

- [x] **18.1** Bot Token ✅
  ```bash
  TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
  ```

- [ ] **18.2** TMA URL
  ```bash
  TMA_URL=https://matrixgin.ru/tma
  ```

- [ ] **18.3** Webhook URL
  ```bash
  TELEGRAM_WEBHOOK_URL=https://api.matrixgin.ru/telegram-webhook
  ```

- [ ] **18.4** Webhook Secret
  ```bash
  TELEGRAM_WEBHOOK_SECRET=your-secret-key
  ```

**Статус:** 25% завершено

---

### 19. Мониторинг (2 часа)

- [ ] **19.1** Метрики:
  - Количество активных пользователей бота
  - Команды в день
  - Notification delivery rate
  - Webhook uptime
  - TMA sessions

- [ ] **19.2** Алерты:
  - Webhook down
  - Notification failed
  - High error rate

**Статус:** 0% завершено

---

## 📊 DEFINITION OF DONE

- [x] ✅ Базовые команды работают (85%)
- [ ] ✅ Уведомления доставляются real-time
- [ ] ✅ NLP парсинг работает >85% точности
- [ ] ✅ TMA загружается и работает
- [ ] ✅ TMA аутентификация secure
- [ ] ✅ Webhook stable в production
- [ ] ✅ Unit tests coverage >80%
- [ ] ✅ Работает на iOS и Android
- [ ] ✅ Product Owner принял модуль

---

## 📈 ПРОГРЕСС ПО СЕКЦИЯМ

| Секция | Прогресс | Статус |
|--------|----------|--------|
| Bot Setup | 100% | ✅ |
| Базовые команды | 85% | 🟡 |
| Callbacks | 40% | 🔴 |
| Notifications | 50% | 🟡 |
| NLP Integration | 0% | 🔴 |
| TMA Backend | 0% | 🔴 |
| TMA Frontend | 0% | 🔴 |
| Webhook | 0% | 🔴 |
| Testing | 20% | 🔴 |
| **ОБЩИЙ ПРОГРЕСС** | **55%** | 🟡 |

---

**Последнее обновление:** 2025-11-22  
**Ответственный:** Backend Team Lead + Mobile Developer  
**Основано на:** Мастер-чеклист Фаза 1 (Module 6)
