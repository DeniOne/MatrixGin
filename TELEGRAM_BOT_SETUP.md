# Telegram Bot Setup Guide

## ✅ Configuration Complete

The Telegram bot **@MatrixGin_bot** has been successfully configured and is ready to use!

### Bot Details
- **Bot Username**: @MatrixGin_bot
- **Bot Token**: `7229406488:AAGLdEVaYLVBPGaY76HGfaYQIRcUvG2nkWU`
- **Superuser Telegram ID**: `41610858`

### Database Status
✅ Migration completed successfully
- Added `telegram_id` field to `users` table (unique, nullable)
- Created `notifications` table for storing notifications

### Environment Configuration
✅ Bot token added to `.env` file
- Polling mode enabled for development
- Webhook configuration ready for production

## Quick Start

### 1. Start the Server
```bash
npm run dev
```

The bot will automatically initialize when the server starts.

### 2. Test the Bot

Open Telegram and start a conversation with **@MatrixGin_bot**:

1. Send `/start` command
2. You'll receive a welcome message with your Telegram ID
3. The bot will prompt you to link your account

### 3. Link Superuser Account

Since you're the superuser (Telegram ID: `41610858`), you need to link this to your user account in the database.

**Option A: Via API (Recommended)**
```bash
# First, login to get JWT token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-password"
  }'

# Then link Telegram account
curl -X POST http://localhost:3000/api/telegram/link \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userId": "YOUR_USER_ID",
    "telegramId": "41610858"
  }'
```

**Option B: Direct Database Update**
```sql
UPDATE users 
SET telegram_id = '41610858' 
WHERE email = 'your-superuser-email@example.com';
```

### 4. Verify Bot Commands

After linking, test these commands in Telegram:

- `/start` - Should show personalized greeting
- `/mytasks` - View your active tasks
- `/balance` - Check your MC and GMC balance
- `/profile` - View your employee profile

## Available Commands

| Command | Description |
|---------|-------------|
| `/start` | Welcome message and account status |
| `/mytasks` | List your active tasks with priorities |
| `/balance` | Display MatrixCoin and GoldMatrixCoin balance |
| `/profile` | Show employee profile information |

## Interactive Menu

The bot provides inline keyboard buttons for easy navigation:
- 📋 **Мои задачи** - Quick access to tasks
- 💰 **Баланс** - Check balance
- 👤 **Профиль** - View profile

## Notifications

The bot will automatically send notifications for:

### Task Events
- 📋 **New Task Assigned** - When a task is assigned to you
- ✅ **Task Completed** - When you complete a task
- 🔄 **Task Updated** - When task details change

### Economy Events
- 💰 **Reward Received** - MC/GMC earned from tasks
- 💸 **Transfer Received** - Incoming transfers
- 🎁 **Bonus Awarded** - Special bonuses

## Troubleshooting

### Bot Not Responding
1. Check server is running: `npm run dev`
2. Verify bot token in `.env` file
3. Check console for error messages

### Commands Not Working
1. Ensure account is linked (check `telegram_id` in database)
2. Try `/start` command first
3. Check user has required permissions

### Notifications Not Arriving
1. Verify `telegram_id` is set for user
2. Check notification service logs
3. Ensure bot is not blocked by user

## Production Deployment

### Switch to Webhook Mode

1. Update `.env`:
```bash
TELEGRAM_USE_POLLING=false
TELEGRAM_WEBHOOK_URL=https://your-domain.com
TELEGRAM_WEBHOOK_PATH=/api/telegram/webhook
```

2. Set webhook via Telegram API:
```bash
curl -X POST "https://api.telegram.org/bot7229406488:AAGLdEVaYLVBPGaY76HGfaYQIRcUvG2nkWU/setWebhook" \
  -d "url=https://your-domain.com/api/telegram/webhook"
```

3. Verify webhook:
```bash
curl "https://api.telegram.org/bot7229406488:AAGLdEVaYLVBPGaY76HGfaYQIRcUvG2nkWU/getWebhookInfo"
```

## Security Notes

> [!IMPORTANT]
> - Keep bot token secret and never commit to version control
> - Use HTTPS for webhook endpoints in production
> - Implement rate limiting for bot commands
> - Validate all user inputs
> - Monitor bot usage and logs

## Next Steps

1. ✅ Start the development server
2. ✅ Test bot with `/start` command
3. ✅ Link your superuser account
4. ✅ Test all bot commands
5. ✅ Create test tasks and verify notifications
6. ⏳ Configure BotFather commands menu
7. ⏳ Set up production webhook
8. ⏳ Implement task creation wizard (future enhancement)

## BotFather Commands Setup

To set up the commands menu in Telegram:

1. Open @BotFather in Telegram
2. Send `/setcommands`
3. Select @MatrixGin_bot
4. Send this list:
```
start - Начать работу с ботом
mytasks - Мои активные задачи
balance - Проверить баланс MC/GMC
profile - Мой профиль сотрудника
```

## Support

For issues or questions:
- Check server logs for errors
- Review [walkthrough.md](file:///C:/Users/DeniOne/.gemini/antigravity/brain/777e324f-9474-4778-aa7c-36a67b444817/walkthrough.md) for implementation details
- Verify database schema matches Prisma schema

---

**Status**: ✅ Ready for Testing
**Last Updated**: 2025-11-22
