import { Telegraf, Context, Markup, Scenes, session } from 'telegraf';
import employeeRegistrationService, { EmployeeRegistrationService } from './employee-registration.service';
import { prisma } from '../config/prisma';

// Wizard Scene Definition
const taskWizard = new Scenes.WizardScene(
    'task-wizard',
    async (ctx: any) => {
        await ctx.reply('📝 Создание новой задачи\n\nВведите название задачи:');
        return ctx.wizard.next();
    },
    async (ctx: any) => {
        if (!ctx.message || !ctx.message.text) {
            await ctx.reply('Пожалуйста, введите текст.');
            return;
        }
        ctx.wizard.state.title = ctx.message.text;
        await ctx.reply('Введите описание задачи:');
        return ctx.wizard.next();
    },
    async (ctx: any) => {
        if (!ctx.message || !ctx.message.text) {
            await ctx.reply('Пожалуйста, введите текст.');
            return;
        }
        ctx.wizard.state.description = ctx.message.text;
        await ctx.reply('Выберите приоритет:', Markup.inlineKeyboard([
            [Markup.button.callback('🟢 Low', 'LOW'), Markup.button.callback('🟡 Medium', 'MEDIUM')],
            [Markup.button.callback('🟠 High', 'HIGH'), Markup.button.callback('🔴 Urgent', 'URGENT')]
        ]));
        return ctx.wizard.next();
    },
    async (ctx: any) => {
        if (!ctx.callbackQuery) {
            await ctx.reply('Пожалуйста, выберите приоритет, нажав на кнопку.');
            return;
        }

        const priority = ctx.callbackQuery.data;
        const { title, description } = ctx.wizard.state;
        const telegramId = ctx.from.id.toString();

        try {
            const user = await prisma.user.findFirst({ where: { telegram_id: telegramId } });
            if (!user) {
                await ctx.reply('❌ Ошибка: Пользователь не найден.');
                return ctx.scene.leave();
            }

            const task = await prisma.task.create({
                data: {
                    title,
                    description,
                    priority,
                    creator_id: user.id,
                    assignee_id: user.id, // Auto-assign to self for now
                    status: 'TODO'
                }
            });

            await ctx.reply(
                `✅ *Задача создана!*\n\n` +
                `📌 *${task.title}*\n` +
                `📝 ${task.description}\n` +
                `⚡ Приоритет: ${priority}`,
                { parse_mode: 'Markdown' }
            );
        } catch (error) {
            console.error('Error creating task:', error);
            await ctx.reply('❌ Произошла ошибка при создании задачи.');
        }

        await ctx.answerCbQuery();
        return ctx.scene.leave();
    }
);

class TelegramService {
    private bot: Telegraf<any> | null = null;
    private static instance: TelegramService;

    private constructor() { }

    public static getInstance(): TelegramService {
        if (!TelegramService.instance) {
            TelegramService.instance = new TelegramService();
        }
        return TelegramService.instance;
    }

    public async initializeBot(): Promise<void> {
        const token = process.env.TELEGRAM_BOT_TOKEN;

        if (!token) {
            console.warn('TELEGRAM_BOT_TOKEN not set. Telegram bot will not be initialized.');
            return;
        }

        this.bot = new Telegraf(token);

        // Middleware
        const stage = new Scenes.Stage([taskWizard]);
        this.bot.use(session());
        this.bot.use(stage.middleware());

        // Register command handlers
        this.registerCommands();

        // Start bot
        const usePolling = process.env.TELEGRAM_USE_POLLING === 'true';

        if (usePolling) {
            await this.bot.launch();
            console.log('✅ Telegram bot initialized successfully (polling mode)');
        } else {
            console.log('✅ Telegram bot initialized successfully (webhook mode)');
        }

        // Enable graceful stop
        process.once('SIGINT', () => this.bot?.stop('SIGINT'));
        process.once('SIGTERM', () => this.bot?.stop('SIGTERM'));
    }

    private registerCommands(): void {
        if (!this.bot) return;

        // /start command
        this.bot.command('start', async (ctx) => {
            const telegramId = ctx.from.id.toString();
            const user = await prisma.user.findFirst({ where: { telegram_id: telegramId } });

            if (user) {
                const fullName = `${user.first_name} ${user.last_name}`;
                await ctx.reply(
                    `👋 Добро пожаловать обратно, ${fullName}!\n\n` +
                    `Используйте меню ниже для навигации:`,
                    this.getMainMenuKeyboard()
                );
            } else {
                await ctx.reply(
                    `👋 Добро пожаловать в MatrixGin!\n\n` +
                    `Для начала работы необходимо привязать ваш Telegram аккаунт.\n\n` +
                    `Ваш Telegram ID: \`${telegramId}\``,
                    { parse_mode: 'Markdown' }
                );
            }
        });

        // /newtask command
        this.bot.command('newtask', (ctx) => ctx.scene.enter('task-wizard'));

        // /mytasks command
        this.bot.command('mytasks', async (ctx) => {
            await this.handleMyTasks(ctx);
        });

        // /balance command
        this.bot.command('balance', async (ctx) => {
            await this.handleBalance(ctx);
        });

        // /profile command
        this.bot.command('profile', async (ctx) => {
            await this.handleProfile(ctx);
        });

        // Handle callback queries
        this.bot.on('callback_query', async (ctx) => {
            await this.handleCallbackQuery(ctx);
        });

        // Handle photo uploads (for registration)
        this.bot.on('photo', async (ctx) => {
            await this.handlePhotoUpload(ctx);
        });

        // Handle document uploads (for registration)
        this.bot.on('document', async (ctx) => {
            await this.handleDocumentUpload(ctx);
        });

        // Handle text messages
        this.bot.on('text', async (ctx) => {
            // Ignore if in scene
            if (ctx.scene && ctx.scene.current) return;

            const telegramId = ctx.from.id.toString();

            // Check if user is in registration process
            const registration = await employeeRegistrationService.getRegistrationByTelegramId(telegramId);
            if (registration && registration.status === 'IN_PROGRESS') {
                await employeeRegistrationService.handleRegistrationStep(ctx, registration);
                return;
            }

            const user = await this.getUserByTelegramId(telegramId);

            if (!user) {
                await ctx.reply('Пожалуйста, сначала привяжите ваш аккаунт. Используйте /start для инструкций.');
                return;
            }

            if (ctx.message.text === '➕ Новая задача') {
                await ctx.scene.enter('task-wizard');
                return;
            }

            await ctx.reply(
                'Используйте команды для навигации:\n\n' +
                '/mytasks - Мои задачи\n' +
                '/newtask - Создать задачу\n' +
                '/balance - Мой баланс\n' +
                '/profile - Мой профиль',
                this.getMainMenuKeyboard()
            );
        });
    }

    private async handleMyTasks(ctx: Context): Promise<void> {
        const telegramId = ctx.from?.id.toString();
        if (!telegramId) return;

        const user = await this.getUserByTelegramId(telegramId);
        if (!user) {
            await ctx.reply('Аккаунт не привязан. Используйте /start');
            return;
        }

        const tasks = await prisma.task.findMany({
            where: {
                assignee_id: user.id,
                status: { in: ['IN_PROGRESS', 'TODO'] }
            },
            orderBy: { created_at: 'desc' },
            take: 5
        });

        if (tasks.length === 0) {
            await ctx.reply('📋 У вас нет активных задач');
            return;
        }

        for (const task of tasks) {
            const statusEmoji = task.status === 'IN_PROGRESS' ? '🔄' : '⏳';
            const priorityEmoji = task.priority === 'URGENT' ? '🔴' :
                task.priority === 'HIGH' ? '🟠' :
                    task.priority === 'MEDIUM' ? '🟡' : '🟢';

            const message = `${statusEmoji} ${priorityEmoji} *${task.title}*\n` +
                `ID: \`${task.id}\`\n` +
                `Награда: ${task.mc_reward || 0} MC`;

            const keyboard = Markup.inlineKeyboard([
                task.status === 'TODO'
                    ? Markup.button.callback('▶️ Начать', `start_task_${task.id}`)
                    : Markup.button.callback('✅ Завершить', `complete_task_${task.id}`)
            ]);

            await ctx.reply(message, { parse_mode: 'Markdown', ...keyboard });
        }
    }

    private async handleBalance(ctx: Context): Promise<void> {
        const telegramId = ctx.from?.id.toString();
        if (!telegramId) return;

        const user = await this.getUserByTelegramId(telegramId);
        if (!user) {
            await ctx.reply('Аккаунт не привязан.');
            return;
        }

        const wallet = await prisma.wallet.findUnique({ where: { user_id: user.id } });

        if (!wallet) {
            await ctx.reply('❌ Кошелек не найден');
            return;
        }

        const message =
            `💰 *Ваш баланс:*\n\n` +
            `🪙 MatrixCoin: *${wallet.mc_balance}* MC\n` +
            `💎 GoldMatrixCoin: *${wallet.gmc_balance}* GMC\n` +
            `🔒 Заморожено: ${wallet.mc_frozen} MC`;

        await ctx.reply(message, { parse_mode: 'Markdown' });
    }

    private async handleProfile(ctx: Context): Promise<void> {
        const telegramId = ctx.from?.id.toString();
        if (!telegramId) return;

        const user = await this.getUserByTelegramId(telegramId);
        if (!user) {
            await ctx.reply('Аккаунт не привязан.');
            return;
        }

        const employee = await prisma.employee.findUnique({
            where: { user_id: user.id },
            include: { department: true }
        });

        const fullName = `${user.first_name} ${user.last_name}`;
        const message =
            `👤 *Профиль:*\n\n` +
            `Имя: ${fullName}\n` +
            `Email: ${user.email}\n` +
            `Департамент: ${employee?.department?.name || 'Не указан'}\n` +
            `Должность: ${employee?.position || 'Не указана'}`;

        await ctx.reply(message, { parse_mode: 'Markdown' });
    }

    private async handleCallbackQuery(ctx: any): Promise<void> {
        const data = ctx.callbackQuery.data;

        // Registration flow callbacks
        if (data === 'start_registration') {
            await employeeRegistrationService.startRegistration(ctx);
            await ctx.answerCbQuery();
            return;
        } else if (data === 'address_same' || data === 'address_different') {
            const telegramId = ctx.from?.id.toString();
            const registration = await employeeRegistrationService.getRegistrationByTelegramId(telegramId);
            if (registration) {
                await employeeRegistrationService.handleAddressMatchCallback(ctx, registration, data === 'address_same');
            }
            await ctx.answerCbQuery();
            return;
        } else if (data.startsWith('location_')) {
            const locationId = data.replace('location_', '');
            const telegramId = ctx.from?.id.toString();
            const registration = await employeeRegistrationService.getRegistrationByTelegramId(telegramId);
            if (registration) {
                await employeeRegistrationService.handleLocationCallback(ctx, registration, locationId);
            }
            await ctx.answerCbQuery();
            return;
        } else if (data === 'complete_registration') {
            const telegramId = ctx.from?.id.toString();
            const registration = await employeeRegistrationService.getRegistrationByTelegramId(telegramId);
            if (registration) {
                await employeeRegistrationService.completeRegistration(ctx, registration);
            }
            await ctx.answerCbQuery();
            return;
        } else if (data === 'upload_more_docs') {
            await ctx.reply('Отправь документ или фото документа.');
            await ctx.answerCbQuery();
            return;
        }

        // Regular callbacks
        if (data === 'my_tasks') {
            await this.handleMyTasks(ctx);
        } else if (data === 'my_balance') {
            await this.handleBalance(ctx);
        } else if (data === 'my_profile') {
            await this.handleProfile(ctx);
        } else if (data === 'new_task') {
            await ctx.scene.enter('task-wizard');
        } else if (data.startsWith('start_task_')) {
            const taskId = data.replace('start_task_', '');
            await this.updateTaskStatus(ctx, taskId, 'IN_PROGRESS');
        } else if (data.startsWith('complete_task_')) {
            const taskId = data.replace('complete_task_', '');
            await this.updateTaskStatus(ctx, taskId, 'DONE');
        }

        await ctx.answerCbQuery();
    }

    private async updateTaskStatus(ctx: Context, taskId: string, status: any): Promise<void> {
        try {
            await prisma.task.update({
                where: { id: taskId },
                data: { status }
            });
            await ctx.reply(`✅ Статус задачи обновлен на: ${status}`);
        } catch (error) {
            console.error('Error updating task:', error);
            await ctx.reply('❌ Ошибка при обновлении статуса.');
        }
    }

    private getMainMenuKeyboard() {
        return Markup.inlineKeyboard([
            [
                Markup.button.callback('📋 Мои задачи', 'my_tasks'),
                Markup.button.callback('➕ Новая задача', 'new_task')
            ],
            [
                Markup.button.callback('💰 Баланс', 'my_balance'),
                Markup.button.callback('👤 Профиль', 'my_profile')
            ]
        ]);
    }

    private async getUserByTelegramId(telegramId: string) {
        return await prisma.user.findFirst({
            where: { telegram_id: telegramId }
        });
    }

    public async linkUserAccount(userId: string, telegramId: string): Promise<void> {
        await prisma.user.update({
            where: { id: userId },
            data: { telegram_id: telegramId }
        });
    }

    public async sendNotification(userId: string, message: string): Promise<boolean> {
        try {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user?.telegram_id || !this.bot) return false;

            await this.bot.telegram.sendMessage(user.telegram_id, message, { parse_mode: 'Markdown' });
            return true;
        } catch (error) {
            console.error('Error sending Telegram notification:', error);
            return false;
        }
    }

    public getBot(): Telegraf<any> | null {
        return this.bot;
    }

    /**
     * Handle photo uploads for registration
     */
    private async handlePhotoUpload(ctx: any): Promise<void> {
        // Ignore if in scene
        if (ctx.scene && ctx.scene.current) return;

        const telegramId = ctx.from?.id.toString();
        if (!telegramId) return;

        const registration = await employeeRegistrationService.getRegistrationByTelegramId(telegramId);

        if (registration && registration.status === 'IN_PROGRESS') {
            await employeeRegistrationService.handleRegistrationStep(ctx, registration);
        }
    }

    /**
     * Handle document uploads for registration
     */
    private async handleDocumentUpload(ctx: any): Promise<void> {
        // Ignore if in scene
        if (ctx.scene && ctx.scene.current) return;

        const telegramId = ctx.from?.id.toString();
        if (!telegramId) return;

        const registration = await employeeRegistrationService.getRegistrationByTelegramId(telegramId);

        if (registration && registration.status === 'IN_PROGRESS') {
            await employeeRegistrationService.handleRegistrationStep(ctx, registration);
        }
    }
}

export default TelegramService.getInstance();
