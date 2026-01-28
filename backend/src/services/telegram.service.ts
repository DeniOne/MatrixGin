import { Telegraf, Context, Markup, Scenes, session } from 'telegraf';
import employeeRegistrationService, { EmployeeRegistrationService } from './employee-registration.service';
import { prisma } from '../config/prisma';
import { foundationService } from './foundation.service';
import { FOUNDATION_BLOCKS } from '../config/foundation.constants';

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

    public getBot(): Telegraf<any> | null {
        return this.bot;
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
                    `🎓 *MVP Learning Contour*\n\n` +
                    `Этот бот — ваш проводник в обучении.\n\n` +
                    `💡 *О MatrixCoin:*\n` +
                    `MatrixCoin — единица признания. В MVP Learning Contour используется только в обучающем контексте и не влияет на доход, статус или власть.\n\n` +
                    `📚 *Обучение:*\n` +
                    `• Добровольное участие\n` +
                    `• Рекомендации на основе реальных метрик PhotoCompany\n` +
                    `• Без давления и санкций\n\n` +
                    `Используйте меню ниже для навигации:`,
                    { parse_mode: 'Markdown', ...this.getMainMenuKeyboard((user as any).foundation_status) }
                );
            } else {
                // SECURITY: Self-Registration with Anti-Fraud check
                const existingRequest = await prisma.$queryRaw<any[]>`
                    SELECT id FROM employee_registration_requests 
                    WHERE telegram_id = ${telegramId} 
                    AND status IN ('PENDING'::registration_status, 'IN_PROGRESS'::registration_status)
                `;

                if (existingRequest.length > 0) {
                    await ctx.reply(
                        `⚠️ *У вас уже есть активная заявка на регистрацию.*\n\n` +
                        `Пожалуйста, завершите её или дождитесь решения администратора.`,
                        { parse_mode: 'Markdown' }
                    );
                } else {
                    await ctx.reply(
                        `👋 Добро пожаловать в MatrixGin!\n\n` +
                        `Вы не найдены в системе.\n` +
                        `Если вы сотрудник, нажмите кнопку ниже для начала регистрации.\n\n` +
                        `Ваш Telegram ID: \`${telegramId}\``,
                        {
                            parse_mode: 'Markdown',
                            reply_markup: {
                                inline_keyboard: [[
                                    { text: '📝 Начать регистрацию', callback_data: 'start_registration' }
                                ]]
                            }
                        }
                    );
                }
            }
        });

        // /newtask command
        this.bot.command('newtask', async (ctx) => {
            if (await this.ensureAdmissionGuard(ctx)) {
                await ctx.scene.enter('task-wizard');
            }
        });

        // /mytasks command
        this.bot.command('mytasks', async (ctx) => {
            if (await this.ensureAdmissionGuard(ctx)) {
                await this.handleMyTasks(ctx);
            }
        });

        // /balance command
        this.bot.command('balance', async (ctx) => {
            if (await this.ensureAdmissionGuard(ctx)) {
                await this.handleBalance(ctx);
            }
        });

        // /profile command
        this.bot.command('profile', async (ctx) => {
            if (await this.ensureAdmissionGuard(ctx)) {
                await this.handleProfile(ctx);
            }
        });

        // MVP Learning Contour Commands

        // /learning command - Show active courses and recommendations
        this.bot.command('learning', async (ctx) => {
            if (await this.ensureAdmissionGuard(ctx)) {
                await this.handleLearning(ctx);
            }
        });

        // /courses command - Browse available courses
        this.bot.command('courses', async (ctx) => {
            if (await this.ensureAdmissionGuard(ctx)) {
                await this.handleCourses(ctx);
            }
        });

        // /mycourses command - Show enrolled courses
        this.bot.command('mycourses', async (ctx) => {
            if (await this.ensureAdmissionGuard(ctx)) {
                await this.handleMyCourses(ctx);
            }
        });

        // /enroll command - Enroll in a course
        this.bot.command('enroll', async (ctx) => {
            if (await this.ensureAdmissionGuard(ctx)) {
                await this.handleEnroll(ctx);
            }
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
                if (await this.ensureAdmissionGuard(ctx)) {
                    await ctx.scene.enter('task-wizard');
                }
                return;
            }

            await ctx.reply(
                'Используйте команды для навигации:\n\n' +
                '/mytasks - Мои задачи\n' +
                '/newtask - Создать задачу\n' +
                '/balance - Мой баланс\n' +
                '/profile - Мой профиль',
                this.getMainMenuKeyboard((user as any).foundation_status)
            );
        });
    }

    private async ensureAdmissionGuard(ctx: Context): Promise<boolean> {
        const telegramId = ctx.from?.id.toString();
        if (!telegramId) return false;

        const user = await this.getUserByTelegramId(telegramId);
        if (!user) {
            await ctx.reply('Аккаунт не привязан. Используйте /start');
            return false;
        }

        // @ts-ignore
        if (user.admission_status !== 'ADMITTED') {
            await ctx.reply(
                `⚠️ *Доступ ограничен*\n\n` +
                `Для использования команд системы необходимо сначала принять Базу и завершить регистрацию.\n\n` +
                `Используйте команду /start для продолжения.`,
                { parse_mode: 'Markdown' }
            );
            return false;
        }

        return true;
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
            // GMC DISABLED in MVP Learning Contour
            // `💎 GoldMatrixCoin: *${wallet.gmc_balance}* GMC\n` +
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
        } else if (data.startsWith('position_')) {
            const positionId = data.replace('position_', '');
            const telegramId = ctx.from?.id.toString();
            const registration = await employeeRegistrationService.getRegistrationByTelegramId(telegramId);
            if (registration) {
                await employeeRegistrationService.handlePositionCallback(ctx, registration, positionId);
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
        } else if (data.startsWith('approve_login_')) {
            const sessionId = data.replace('approve_login_', '');
            await this.handleLoginDecision(ctx, sessionId, 'APPROVED');
            return;
        } else if (data.startsWith('reject_login_')) {
            const sessionId = data.replace('reject_login_', '');
            await this.handleLoginDecision(ctx, sessionId, 'REJECTED');
            return;
        } else if (data === 'upload_more_docs') {
            await ctx.reply('Отправь документ или фото документа.');
            await ctx.answerCbQuery();
            return;
        } else if (data === 'start_foundation') {
            await this.handleFoundation(ctx);
            await ctx.answerCbQuery();
            return;
        } else if (data.startsWith('view_foundation_block_')) {
            const blockId = data.replace('view_foundation_block_', '');
            const telegramId = ctx.from?.id.toString();
            const user = await this.getUserByTelegramId(telegramId);
            if (user) {
                try {
                    await foundationService.registerBlockView(user.id, blockId, 'TELEGRAM_BOT');
                    await this.handleFoundation(ctx);
                } catch (error: any) {
                    await ctx.reply(`❌ ${error.message}`);
                }
            }
            await ctx.answerCbQuery();
            return;
        } else if (data === 'accept_foundation') {
            const telegramId = ctx.from?.id.toString();
            const user = await this.getUserByTelegramId(telegramId);
            if (user) {
                try {
                    const result = await foundationService.submitDecision(user.id, 'ACCEPT', 'TELEGRAM_BOT');
                    if (result.status === 'ACCEPTED') {
                        await ctx.reply(
                            `🎉 *База принята!*\n\n` +
                            `Добро пожаловать в систему MatrixGin в качестве полноправного участника.\n` +
                            `Теперь вам доступны все функции обучения и работы.`,
                            { parse_mode: 'Markdown', ...this.getMainMenuKeyboard('ACCEPTED') }
                        );
                    }
                } catch (error: any) {
                    await ctx.reply(`❌ ${error.message}`);
                }
            }
            await ctx.answerCbQuery();
            return;
        } else if (data === 'decline_foundation') {
            await ctx.reply('⚠️ Без принятия Базы доступ к системе останется ограниченным. Вы можете вернуться к ознакомлению в любое время через меню.');
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

    /**
     * MVP Learning Contour: Handle /learning command
     * Shows active courses and PhotoCompany-based recommendations
     * 
     * Bot Role: viewer (reads, shows, explains)
     */
    private async handleLearning(ctx: Context): Promise<void> {
        const telegramId = ctx.from?.id.toString();
        if (!telegramId) return;

        const user = await this.getUserByTelegramId(telegramId);
        if (!user) {
            await ctx.reply('Аккаунт не привязан. Используйте /start');
            return;
        }

        try {
            const { universityService } = require('./university.service');
            const dashboard = await universityService.getStudentDashboard(user.id);

            let message = `🎓 *Моё обучение*\n\n`;

            // Active courses
            if (dashboard.activeCourses.length > 0) {
                message += `📚 *Активные курсы:*\n`;
                for (const course of dashboard.activeCourses) {
                    message += `• ${course.courseTitle} (${course.progress}%)\n`;
                }
                message += `\n`;
            }

            // Recommendations (PhotoCompany-based)
            if (dashboard.recommendedCourses.length > 0) {
                message += `💡 *Рекомендации (на основе PhotoCompany):*\n`;
                for (const rec of dashboard.recommendedCourses) {
                    message += `• ${rec.title}\n`;
                    message += `  Причина: ${rec.reason}\n`;
                    message += `  MC: ${rec.recognitionMC}\n`;
                }
            } else {
                message += `✅ Все метрики в норме! Рекомендаций нет.`;
            }

            await ctx.reply(message, { parse_mode: 'Markdown' });
        } catch (error) {
            console.error('[Telegram] Error in handleLearning:', error);
            await ctx.reply('❌ Ошибка при загрузке данных обучения');
        }
    }

    /**
     * MVP Learning Contour: Handle /courses command
     * Browse available courses
     * 
     * Bot Role: viewer (reads, shows, explains)
     */
    private async handleCourses(ctx: Context): Promise<void> {
        const telegramId = ctx.from?.id.toString();
        if (!telegramId) return;

        const user = await this.getUserByTelegramId(telegramId);
        if (!user) {
            await ctx.reply('Аккаунт не привязан.');
            return;
        }

        try {
            const { universityService } = require('./university.service');
            const courses = await universityService.getCourses();

            if (courses.length === 0) {
                await ctx.reply('📚 Курсы пока не доступны');
                return;
            }

            let message = `📚 *Доступные курсы:*\n\n`;
            for (const course of courses.slice(0, 10)) {
                message += `*${course.title}*\n`;
                if (course.description) {
                    message += `${course.description.substring(0, 100)}...\n`;
                }
                message += `MC: ${course.recognitionMC}\n`;
                message += `ID: \`${course.id}\`\n\n`;
            }

            message += `Для записи на курс используйте:\n`;
            message += `/enroll <course_id>`;

            await ctx.reply(message, { parse_mode: 'Markdown' });
        } catch (error) {
            console.error('[Telegram] Error in handleCourses:', error);
            await ctx.reply('❌ Ошибка при загрузке курсов');
        }
    }

    /**
     * MVP Learning Contour: Handle /mycourses command
     * Show enrolled courses with progress
     * 
     * Bot Role: viewer (reads, shows, explains)
     */
    private async handleMyCourses(ctx: Context): Promise<void> {
        const telegramId = ctx.from?.id.toString();
        if (!telegramId) return;

        const user = await this.getUserByTelegramId(telegramId);
        if (!user) {
            await ctx.reply('Аккаунт не привязан.');
            return;
        }

        try {
            const { enrollmentService } = require('./enrollment.service');
            const myCourses = await enrollmentService.getMyCourses(user.id);

            let message = `📖 *Мои курсы:*\n\n`;

            if (myCourses.active.length > 0) {
                message += `🔄 *Активные:*\n`;
                for (const course of myCourses.active) {
                    message += `• ${course.courseTitle} (${course.progress}%)\n`;
                }
                message += `\n`;
            }

            if (myCourses.completed.length > 0) {
                message += `✅ *Завершённые:*\n`;
                for (const course of myCourses.completed) {
                    message += `• ${course.courseTitle}\n`;
                }
            }

            if (myCourses.active.length === 0 && myCourses.completed.length === 0) {
                message += `Вы ещё не записаны ни на один курс.\n\n`;
                message += `Используйте /courses для просмотра доступных курсов.`;
            }

            await ctx.reply(message, { parse_mode: 'Markdown' });
        } catch (error) {
            console.error('[Telegram] Error in handleMyCourses:', error);
            await ctx.reply('❌ Ошибка при загрузке ваших курсов');
        }
    }

    /**
     * MVP Learning Contour: Handle /enroll command
     * Enroll user in a course
     * 
     * Bot Role: viewer (facilitates action, no evaluation)
     */
    private async handleEnroll(ctx: any): Promise<void> {
        const telegramId = ctx.from?.id.toString();
        if (!telegramId) return;

        const user = await this.getUserByTelegramId(telegramId);
        if (!user) {
            await ctx.reply('Аккаунт не привязан.');
            return;
        }

        // Extract course ID from command
        const text = ctx.message?.text || '';
        const parts = text.split(' ');

        if (parts.length < 2) {
            await ctx.reply(
                '❌ Укажите ID курса:\n' +
                '/enroll <course_id>\n\n' +
                'Используйте /courses для просмотра доступных курсов.'
            );
            return;
        }

        const courseId = parts[1];

        try {
            const { enrollmentService } = require('./enrollment.service');
            await enrollmentService.enrollInCourse(user.id, courseId);

            await ctx.reply(
                '✅ *Вы успешно записаны на курс!*\n\n' +
                '📚 Используйте /mycourses для просмотра ваших курсов.\n\n' +
                '💡 *Напоминание:*\n' +
                'Обучение добровольное. Проходите курс в удобном темпе.',
                { parse_mode: 'Markdown' }
            );
        } catch (error: any) {
            console.error('[Telegram] Error in handleEnroll:', error);

            if (error.message.includes('Already enrolled')) {
                await ctx.reply('ℹ️ Вы уже записаны на этот курс.');
            } else {
                await ctx.reply('❌ Ошибка при записи на курс. Проверьте ID курса.');
            }
        }
    }

    /**
     * MVP Learning Contour: Send course completion notification
     * 
     * Bot Role: notifier (informs about event)
     * 
     * Called by enrollment.service when course is completed
     */
    public async sendCourseCompletedNotification(
        userId: string,
        courseName: string,
        recognitionMC: number
    ): Promise<boolean> {
        try {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user?.telegram_id || !this.bot) return false;

            const message =
                `🎉 *Поздравляем!*\n\n` +
                `Вы завершили курс:\n` +
                `📚 *${courseName}*\n\n` +
                `💰 *Признание:*\n` +
                `Вам начислено ${recognitionMC} MC\n\n` +
                `💡 *О MatrixCoin:*\n` +
                `MC — единица признания вашего участия в обучении. Это не влияет на доход или статус.\n\n` +
                `📖 *Следующие шаги:*\n` +
                `Используйте /learning для просмотра рекомендаций на основе ваших метрик PhotoCompany.`;

            await this.bot.telegram.sendMessage(user.telegram_id, message, { parse_mode: 'Markdown' });
            return true;
        } catch (error) {
            console.error('[Telegram] Error sending course completion notification:', error);
            return false;
        }
    }

    private getMainMenuKeyboard(foundationStatus: string = 'ACCEPTED') {
        const buttons = [];

        if (foundationStatus !== 'ACCEPTED') {
            buttons.push([Markup.button.callback('🧭 Узнай Базу', 'start_foundation')]);
        }

        buttons.push([
            Markup.button.callback('📋 Мои задачи', 'my_tasks'),
            Markup.button.callback('➕ Новая задача', 'new_task')
        ]);

        buttons.push([
            Markup.button.callback('💰 Баланс', 'my_balance'),
            Markup.button.callback('👤 Профиль', 'my_profile')
        ]);

        return Markup.inlineKeyboard(buttons);
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

    /**
     * Send Login Approval Push to user.
     */
    public async sendLoginPush(sessionId: string, telegramId: string, ip?: string): Promise<boolean> {
        if (!this.bot) return false;

        const message =
            `🔐 *Запрос на вход в MatrixGin*\n\n` +
            `Кто-то пытается войти в систему под вашим именем.\n` +
            (ip ? `📍 IP: \`${ip}\`\n` : '') +
            `Это вы?`;

        const keyboard = Markup.inlineKeyboard([
            [
                Markup.button.callback('✅ Да, это я', `approve_login_${sessionId}`),
                Markup.button.callback('❌ Нет, это не я', `reject_login_${sessionId}`)
            ]
        ]);

        try {
            await this.bot.telegram.sendMessage(telegramId, message, { parse_mode: 'Markdown', ...keyboard });
            return true;
        } catch (error) {
            console.error('Error sending Login Push:', error);
            return false;
        }
    }

    private async handleLoginDecision(ctx: any, sessionId: string, status: 'APPROVED' | 'REJECTED'): Promise<void> {
        try {
            const session = await prisma.authSession.findUnique({ where: { id: sessionId } });
            if (!session || session.status !== 'PENDING') {
                await ctx.editMessageText('⚠️ Срок действия этого запроса истек.');
                return;
            }

            await prisma.authSession.update({
                where: { id: sessionId },
                data: { status: status as any }
            });

            if (status === 'APPROVED') {
                await ctx.editMessageText('✅ Вход разрешен. Вы можете вернуться в браузер.');
            } else {
                await ctx.editMessageText('❌ Вход отклонен.');
            }
        } catch (error) {
            console.error('Error handling login decision:', error);
            await ctx.reply('❌ Ошибка при обработке решения.');
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

    /**
     * Foundation (Base) walkthrough handler
     */
    private async handleFoundation(ctx: any): Promise<void> {
        const telegramId = ctx.from?.id.toString();
        if (!telegramId) return;

        const user = await this.getUserByTelegramId(telegramId);
        if (!user) {
            await ctx.reply('Аккаунт не привязан.');
            return;
        }

        const progress = (user as any).foundation_progress || 0;
        const status = (user as any).foundation_status;

        if (status === 'ACCEPTED') {
            await ctx.reply('✅ Вы уже приняли Базу. Доступ к системе открыт!');
            return;
        }

        if (progress < FOUNDATION_BLOCKS.length) {
            const block = FOUNDATION_BLOCKS[progress];
            const message = `🧱 *База: Блок ${progress + 1} из ${FOUNDATION_BLOCKS.length}*\n\n` +
                `*${block.title}*\n\n` +
                `${block.description}`;

            const keyboard = Markup.inlineKeyboard([
                [Markup.button.callback('✅ Прочитано', `view_foundation_block_${block.id}`)]
            ]);

            await ctx.reply(message, { parse_mode: 'Markdown', ...keyboard });
        } else {
            const message = `📜 *Принятие Базы*\n\n` +
                `Вы ознакомились со всеми принципами Базы MatrixGin.\n\n` +
                `Принятие Базы — это ваше осознанное решение следовать этим правилам. Без этого доступ к системе невозможен.\n\n` +
                `Вы готовы принять Базу?`;

            const keyboard = Markup.inlineKeyboard([
                [Markup.button.callback('📜 Принимаю Базу', 'accept_foundation')],
                [Markup.button.callback('❌ Отказаться', 'decline_foundation')]
            ]);

            await ctx.reply(message, { parse_mode: 'Markdown', ...keyboard });
        }
    }
}

export default TelegramService.getInstance();
