import { Context, Markup } from 'telegraf';
import telegramService from './telegram.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { prisma } from '../config/prisma';
import emailService from './email.service';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import photoOptimizationService from './photo-optimization.service';

// Registration status types
export enum RegistrationStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    DOCUMENTS_PENDING = 'DOCUMENTS_PENDING',
    REVIEW = 'REVIEW',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

// Registration step types
export enum RegistrationStep {
    PHOTO = 'PHOTO',
    FULL_NAME = 'FULL_NAME',
    BIRTH_DATE = 'BIRTH_DATE',
    REG_ADDRESS = 'REG_ADDRESS',
    RES_ADDRESS = 'RES_ADDRESS',
    PHONE = 'PHONE',
    EMAIL = 'EMAIL',
    POSITION = 'POSITION',
    LOCATION = 'LOCATION',
    PASSPORT_SCAN = 'PASSPORT_SCAN',
    DOCUMENTS = 'DOCUMENTS',
    COMPLETED = 'COMPLETED'
}

interface RegistrationRequest {
    id: string;
    telegram_id: string;
    telegram_username?: string;
    status: RegistrationStatus;
    current_step: RegistrationStep;
    photo_url?: string;
    first_name?: string;
    last_name?: string;
    middle_name?: string;
    birth_date?: Date;
    registration_address?: string;
    residential_address?: string;
    addresses_match?: boolean;
    phone?: string;
    email?: string;
    position?: string;
    location_id?: string;
    department_id?: string;
    passport_scan_url?: string;
    additional_documents?: any[];
    invited_by?: string;
    created_at: Date;
    updated_at: Date;
}

export class EmployeeRegistrationService {
    private static instance: EmployeeRegistrationService;
    private eventEmitter: EventEmitter2;

    private constructor(eventEmitter?: EventEmitter2) {
        this.eventEmitter = eventEmitter || new EventEmitter2();
    }

    public static getInstance(): EmployeeRegistrationService {
        if (!EmployeeRegistrationService.instance) {
            EmployeeRegistrationService.instance = new EmployeeRegistrationService();
        }
        return EmployeeRegistrationService.instance;
    }

    /**
     * Location admin invites employee by sending their Telegram ID to system admin
     * System admin initiates registration invitation
     */
    async sendRegistrationInvitation(
        telegramId: string,
        invitedByUserId: string,
        departmentId?: string,
        locationId?: string
    ): Promise<void> {
        const bot = telegramService.getBot();

        if (!bot) {
            throw new Error('Telegram bot not initialized');
        }

        // Create or get registration request
        let registration = await this.getRegistrationByTelegramId(telegramId);

        if (!registration) {
            // Create new registration request
            const result = await prisma.$queryRaw<any[]>`
                INSERT INTO employee_registration_requests (
                    id,
                    telegram_id, 
                    status, 
                    current_step, 
                    invited_by,
                    department_id,
                    location_id,
                    invitation_sent_at,
                    updated_at
                ) VALUES (
                    ${randomUUID()},
                    ${telegramId}, 
                    'PENDING'::registration_status, 
                    'BASE'::registration_step,
                    ${invitedByUserId},
                    ${departmentId || null},
                    ${locationId || null},
                    NOW(),
                    NOW()
                )
                RETURNING id, telegram_id
            `;

            if (result.length === 0) {
                throw new Error('Failed to create registration request');
            }
        }

        // Send welcome message with registration button
        const welcomeMessage = `🎉 Приветствуем Тебя в системе MatrixGin!\n\n` +
            `Добро пожаловать в нашу команду! Для того чтобы стать частью проекта, ` +
            `тебе необходимо первым делом ознакомиться с нашей Базой — это фундамент, ` +
            `на котором строится вся работа.\n\n` +
            `Пожалуйста, нажми на кнопку ниже, чтобы начать знакомство с Базой.`;

        await bot.telegram.sendMessage(telegramId, welcomeMessage, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🧭 Узнать Базу', callback_data: 'start_registration' }]
                ]
            }
        });
    }

    /**
     * Start registration process
     */
    async startRegistration(ctx: Context): Promise<void> {
        const telegramId = ctx.from?.id.toString();
        // @ts-ignore
        const username = ctx.from?.username;
        if (!telegramId) return;

        // Check/Create registration request
        const existing = await this.getRegistrationByTelegramId(telegramId);

        if (!existing) {
            await prisma.$executeRaw`
                INSERT INTO employee_registration_requests (
                    id,
                    telegram_id, 
                    telegram_username,
                    status, 
                    current_step, 
                    invitation_sent_at,
                    updated_at
                ) VALUES (
                    ${randomUUID()},
                    ${telegramId}, 
                    ${username || null},
                    'IN_PROGRESS'::registration_status, 
                    'BASE'::registration_step,
                    NOW(),
                    NOW()
                )
            `;
        } else {
            // Resume logic
            await prisma.$executeRaw`
                UPDATE employee_registration_requests
                SET status = 'IN_PROGRESS'::registration_status,
                    current_step = 'BASE'::registration_step,
                    updated_at = NOW()
                WHERE telegram_id = ${telegramId}
            `;
        }

        // Send "Learn Base" command trigger
        await ctx.reply(
            `🧭 *Шаг 1: Ознакомление с Базой*\n\n` +
            `База — это обязательные правила и принципы системы.\n` +
            `После ознакомления необходимо принять Базу, иначе доступ к системе не предоставляется.\n\n` +
            `Нажми на кнопку ниже, чтобы начать.`,
            {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🧭 Узнать Базу', callback_data: 'start_foundation' }]
                    ]
                }
            }
        );
    }

    /**
     * Handle registration step based on current step
     */
    async handleRegistrationStep(ctx: Context, registration: any): Promise<void> {
        const currentStep = registration.current_step;

        switch (currentStep) {
            case 'BASE':
                await ctx.reply('🧭 Сначала необходимо ознакомиться с Базой и принять её. Используйте кнопку выше или команду /start. Только после этого мы перейдем к заполнению анкеты.');
                break;
            case 'PHOTO':
                await this.handlePhotoStep(ctx, registration);
                break;
            case 'FULL_NAME':
                await this.handleFullNameStep(ctx, registration);
                break;
            case 'BIRTH_DATE':
                await this.handleBirthDateStep(ctx, registration);
                break;
            case 'REG_ADDRESS':
                await this.handleRegAddressStep(ctx, registration);
                break;
            case 'RES_ADDRESS':
                await this.handleResAddressStep(ctx, registration);
                break;
            case 'PHONE':
                await this.handlePhoneStep(ctx, registration);
                break;
            case 'EMAIL':
                await this.handleEmailStep(ctx, registration);
                break;
            case 'POSITION':
                await this.handlePositionStep(ctx, registration);
                break;
            case 'LOCATION':
                await this.handleLocationStep(ctx, registration);
                break;
            case 'PASSPORT_SCAN':
                await this.handlePassportScanStep(ctx, registration);
                break;
            case 'DOCUMENTS':
                await this.handleDocumentsStep(ctx, registration);
                break;
            default:
                await ctx.reply('Неизвестный шаг регистрации');
        }
    }

    private async handlePhotoStep(ctx: any, registration: any): Promise<void> {
        if (!ctx.message?.photo) {
            await ctx.reply('⚠️ *Пожалуйста, отправь именно фото (как картинку), а не файл.*\n\nЭто нужно для корректной работы профиля.', { parse_mode: 'Markdown' });
            return;
        }

        try {
            const photo = ctx.message.photo[ctx.message.photo.length - 1];
            const fileId = photo.file_id;

            await ctx.reply('⏳ _Обрабатываем фото..._', { parse_mode: 'Markdown' });

            // Optimize and save photo
            const optimizedPath = await photoOptimizationService.processTelegramPhoto(fileId, 'photos');
            const photoUrl = optimizedPath;

            await prisma.$executeRaw`
                UPDATE employee_registration_requests
                SET photo_url = ${photoUrl},
                    current_step = 'FULL_NAME'::registration_step,
                    updated_at = NOW()
                WHERE id = ${registration.id}
            `;

            await this.saveStepHistory(registration.id, 'PHOTO', { photo_url: photoUrl });

            await ctx.reply(
                `✅ Фото сохранено!\n\n` +
                `👤 *Шаг 2/11: ФИО*\n\n` +
                `Введи свои Фамилию, Имя и Отчество в формате:\n` +
                `_Иванов Иван Иванович_`,
                { parse_mode: 'Markdown' }
            );
        } catch (error) {
            console.error('[EmployeeRegistrationService] Error in handlePhotoStep:', error);
            await ctx.reply('❌ Ошибка при обработке фото. Попробуй еще раз или отправь другое фото.');
        }
    }

    private async handleFullNameStep(ctx: any, registration: any): Promise<void> {
        if (!ctx.message?.text) {
            await ctx.reply('Пожалуйста, введи текст');
            return;
        }

        const fullName = ctx.message.text.trim();
        const nameParts = fullName.split(' ').filter((part: string) => part.length > 0);

        if (nameParts.length < 2) {
            await ctx.reply('Пожалуйста, введи минимум Фамилию и Имя');
            return;
        }

        const lastName = nameParts[0];
        const firstName = nameParts[1];
        const middleName = nameParts.length > 2 ? nameParts.slice(2).join(' ') : null;

        await prisma.$executeRaw`
            UPDATE employee_registration_requests
            SET first_name = ${firstName},
                last_name = ${lastName},
                middle_name = ${middleName},
                current_step = 'BIRTH_DATE'::registration_step,
                updated_at = NOW()
            WHERE id = ${registration.id}
        `;

        await this.saveStepHistory(registration.id, 'FULL_NAME', {
            first_name: firstName,
            last_name: lastName,
            middle_name: middleName
        });

        await ctx.reply(
            `✅ ФИО сохранено!\n\n` +
            `📅 *Шаг 3/11: Дата рождения*\n\n` +
            `Введи дату рождения в формате:\n` +
            `_ДД.ММ.ГГГГ (например: 15.03.1990)_`,
            { parse_mode: 'Markdown' }
        );
    }

    private async handleBirthDateStep(ctx: any, registration: any): Promise<void> {
        if (!ctx.message?.text) {
            await ctx.reply('Пожалуйста, введи текст');
            return;
        }

        const dateText = ctx.message.text.trim();
        const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
        const match = dateText.match(dateRegex);

        if (!match) {
            await ctx.reply('Неверный формат даты. Используй формат: ДД.ММ.ГГГГ (например: 15.03.1990)');
            return;
        }

        const [, day, month, year] = match;
        const birthDate = new Date(`${year}-${month}-${day}`);

        if (isNaN(birthDate.getTime())) {
            await ctx.reply('Некорректная дата. Пожалуйста, проверь и введи снова.');
            return;
        }

        // Check if person is at least 18 years old
        const age = this.calculateAge(birthDate);
        if (age < 18) {
            await ctx.reply('Вам должно быть не менее 18 лет для регистрации.');
            return;
        }

        await prisma.$executeRaw`
            UPDATE employee_registration_requests
            SET birth_date = ${birthDate}::date,
                current_step = 'REG_ADDRESS'::registration_step,
                updated_at = NOW()
            WHERE id = ${registration.id}
        `;

        await this.saveStepHistory(registration.id, 'BIRTH_DATE', { birth_date: birthDate.toISOString() });

        await ctx.reply(
            `✅ Дата рождения сохранена!\n\n` +
            `🏠 *Шаг 4/11: Адрес регистрации*\n\n` +
            `Введи адрес регистрации (по паспорту):\n` +
            `_Например: г. Минск, ул. Ленина, д. 10, кв. 5_`,
            { parse_mode: 'Markdown' }
        );
    }

    private async handleRegAddressStep(ctx: any, registration: any): Promise<void> {
        if (!ctx.message?.text) {
            await ctx.reply('Пожалуйста, введи текст');
            return;
        }

        const address = ctx.message.text.trim();

        if (address.length < 10) {
            await ctx.reply('Адрес слишком короткий. Пожалуйста, введи полный адрес.');
            return;
        }

        await prisma.$executeRaw`
            UPDATE employee_registration_requests
            SET registration_address = ${address},
                current_step = 'RES_ADDRESS'::registration_step,
                updated_at = NOW()
            WHERE id = ${registration.id}
        `;

        await this.saveStepHistory(registration.id, 'REG_ADDRESS', { registration_address: address });

        await ctx.reply(
            `✅ Адрес регистрации сохранен!\n\n` +
            `🏡 *Шаг 5/11: Адрес проживания*\n\n` +
            `Совпадает ли адрес проживания с адресом регистрации?`,
            {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '✅ Да, совпадает', callback_data: 'address_same' }],
                        [{ text: '❌ Нет, ввести другой', callback_data: 'address_different' }]
                    ]
                }
            }
        );
    }

    private async handleResAddressStep(ctx: any, registration: any): Promise<void> {
        if (!ctx.message?.text) {
            await ctx.reply('Пожалуйста, введи текст');
            return;
        }

        const address = ctx.message.text.trim();

        if (address.length < 10) {
            await ctx.reply('Адрес слишком короткий. Пожалуйста, введи полный адрес.');
            return;
        }

        await prisma.$executeRaw`
            UPDATE employee_registration_requests
            SET residential_address = ${address},
                addresses_match = false,
                current_step = 'PHONE'::registration_step,
                updated_at = NOW()
            WHERE id = ${registration.id}
        `;

        await this.saveStepHistory(registration.id, 'RES_ADDRESS', {
            residential_address: address,
            addresses_match: false
        });

        await this.promptPhoneStep(ctx);
    }

    async handleAddressMatchCallback(ctx: any, registration: any, match: boolean): Promise<void> {
        if (match) {
            // Use registration address as residential address
            await prisma.$executeRaw`
                UPDATE employee_registration_requests
                SET residential_address = registration_address,
                    addresses_match = true,
                    current_step = 'PHONE'::registration_step,
                    updated_at = NOW()
                WHERE id = ${registration.id}
            `;

            await this.saveStepHistory(registration.id, 'RES_ADDRESS', { addresses_match: true });
            await this.promptPhoneStep(ctx);
        } else {
            await ctx.reply(
                `Введи адрес проживания:\n` +
                `_Например: г. Минск, ул. Победы, д. 25, кв. 12_`,
                { parse_mode: 'Markdown' }
            );
        }
    }

    private async promptPhoneStep(ctx: Context): Promise<void> {
        await ctx.reply(
            `✅ Адрес проживания сохранен!\n\n` +
            `📱 *Шаг 6/11: Номер телефона*\n\n` +
            `Введи номер телефона в международном формате:\n` +
            `_Например: +375291234567_`,
            { parse_mode: 'Markdown' }
        );
    }

    private async handlePhoneStep(ctx: any, registration: any): Promise<void> {
        if (!ctx.message?.text) {
            await ctx.reply('Пожалуйста, введи текст');
            return;
        }

        const phone = ctx.message.text.trim().replace(/[\s\-\(\)]/g, '');
        const phoneRegex = /^\+?[0-9]{10,15}$/;

        if (!phoneRegex.test(phone)) {
            await ctx.reply('Неверный формат номера. Используй формат: +375291234567');
            return;
        }

        await prisma.$executeRaw`
            UPDATE employee_registration_requests
            SET phone = ${phone},
                current_step = 'EMAIL'::registration_step,
                updated_at = NOW()
            WHERE id = ${registration.id}
        `;

        await this.saveStepHistory(registration.id, 'PHONE', { phone });

        await ctx.reply(
            `✅ Телефон сохранен!\n\n` +
            `📧 *Шаг 7/11: Email*\n\n` +
            `Введи адрес электронной почты:\n` +
            `_Например: ivanov@example.com_`,
            { parse_mode: 'Markdown' }
        );
    }

    private async handleEmailStep(ctx: any, registration: any): Promise<void> {
        if (!ctx.message?.text) {
            await ctx.reply('Пожалуйста, введи текст');
            return;
        }

        const email = ctx.message.text.trim().toLowerCase();
        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

        if (!emailRegex.test(email)) {
            await ctx.reply('Неверный формат email. Проверь правильность ввода.');
            return;
        }

        await prisma.$executeRaw`
            UPDATE employee_registration_requests
            SET email = ${email},
                current_step = 'POSITION'::registration_step,
                updated_at = NOW()
            WHERE id = ${registration.id}
        `;

        await this.saveStepHistory(registration.id, 'EMAIL', { email });

        await this.promptPositionStep(ctx);
    }

    private async promptPositionStep(ctx: any): Promise<void> {
        // Fetch active positions
        const positions = await prisma.$queryRaw<any[]>`
            SELECT id, name FROM positions WHERE is_active = true ORDER BY name
        `;

        if (positions.length === 0) {
            // Fallback to text if no positions defined
            await ctx.reply(
                `💼 *Шаг 8/11: Должность*\n\n` +
                `Введи должность, на которую устраиваешься:\n` +
                `_Например: Менеджер по продажам_`,
                { parse_mode: 'Markdown' }
            );
            return;
        }

        const buttons = positions.map(p => [{
            text: p.name,
            callback_data: `position_${p.id}`
        }]);

        await ctx.reply(
            `💼 *Шаг 8/11: Должность*\n\n` +
            `Выбери должность из списка:`,
            {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: buttons
                }
            }
        );
    }

    private async handlePositionStep(ctx: any, registration: any): Promise<void> {
        await ctx.reply('⚠️ Пожалуйста, выбери должность из списка выше, нажав на кнопку.');
    }

    async handlePositionCallback(ctx: any, registration: any, positionId: string): Promise<void> {
        const position = await prisma.$queryRaw<any[]>`
            SELECT name FROM positions WHERE id = ${positionId}
        `;

        if (position.length === 0) {
            await ctx.reply('❌ Ошибка: Должность не найдена.');
            return;
        }

        await prisma.$executeRaw`
            UPDATE employee_registration_requests
            SET position = ${position[0].name},
                current_step = 'LOCATION'::registration_step,
                updated_at = NOW()
            WHERE id = ${registration.id}
        `;

        await this.saveStepHistory(registration.id, 'POSITION', { positionId, positionName: position[0].name });

        await this.promptLocationStep(ctx, registration);
    }

    private async promptLocationStep(ctx: any, registration: any): Promise<void> {
        // Fetch available locations
        const locations = await prisma.$queryRaw<any[]>`
            SELECT id, name, city FROM locations WHERE is_active = true ORDER BY name
        `;

        if (locations.length === 0) {
            // If no locations, skip to passport scan
            await prisma.$executeRaw`
                UPDATE employee_registration_requests
                SET current_step = 'PASSPORT_SCAN'::registration_step,
                    updated_at = NOW()
                WHERE id = ${registration.id}
            `;
            await this.promptPassportScanStep(ctx);
            return;
        }

        // Create inline keyboard with locations
        const locationButtons = locations.map(loc => [{
            text: `${loc.name}${loc.city ? ` (${loc.city})` : ''}`,
            callback_data: `location_${loc.id}`
        }]);

        await ctx.reply(
            `✅ Должность сохранена!\n\n` +
            `📍 *Шаг 9/11: Локация*\n\n` +
            `Выбери локацию, где будешь работать:`,
            {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: locationButtons
                }
            }
        );
    }

    private async handleLocationStep(ctx: any, registration: any): Promise<void> {
        await ctx.reply('⚠️ Пожалуйста, выбери локацию из списка выше, нажав на кнопку.');
    }

    async handleLocationCallback(ctx: any, registration: any, locationId: string): Promise<void> {
        await prisma.$executeRaw`
            UPDATE employee_registration_requests
            SET location_id = ${locationId},
                current_step = 'PASSPORT_SCAN'::registration_step,
                updated_at = NOW()
            WHERE id = ${registration.id}
        `;

        await this.saveStepHistory(registration.id, 'LOCATION', { location_id: locationId });
        await this.promptPassportScanStep(ctx);
    }

    private async promptPassportScanStep(ctx: Context): Promise<void> {
        await ctx.reply(
            `✅ Локация выбрана!\n\n` +
            `🎫 *Шаг 10/11: Скан паспорта*\n\n` +
            `Загрузи скан или фото разворота паспорта с фотографией.\n\n` +
            `_Убедись, что все данные читаемы_`,
            { parse_mode: 'Markdown' }
        );
    }

    private async handlePassportScanStep(ctx: any, registration: any): Promise<void> {
        if (!ctx.message?.photo && !ctx.message?.document) {
            await ctx.reply('⚠️ Пожалуйста, отправь фото или скан документа.');
            return;
        }

        try {
            let fileId: string;
            if (ctx.message.photo) {
                const photo = ctx.message.photo[ctx.message.photo.length - 1];
                fileId = photo.file_id;
            } else {
                fileId = ctx.message.document.file_id;
                // Check mime type if it's a document
                const mime = ctx.message.document.mime_type;
                if (mime && !mime.startsWith('image/') && mime !== 'application/pdf') {
                    await ctx.reply('❌ Неподдерживаемый формат. Пожалуйста, отправь фото (JPG/PNG) или PDF.');
                    return;
                }
            }

            await ctx.reply('⏳ _Сохраняем скан паспорта..._', { parse_mode: 'Markdown' });

            let passportUrl: string;
            // Only optimize if it's an image
            if (ctx.message.photo || (ctx.message.document && ctx.message.document.mime_type?.startsWith('image/'))) {
                passportUrl = await photoOptimizationService.processTelegramPhoto(fileId, 'passports');
            } else {
                // For PDF or other documents, just record the TG file reference for now (or we could download it too)
                passportUrl = `telegram://file/${fileId}`;
            }

            await prisma.$executeRaw`
                UPDATE employee_registration_requests
                SET passport_scan_url = ${passportUrl},
                    current_step = 'DOCUMENTS'::registration_step,
                    updated_at = NOW()
                WHERE id = ${registration.id}
            `;

            await this.saveStepHistory(registration.id, 'PASSPORT_SCAN', { passport_scan_url: passportUrl });

            await ctx.reply(
                `✅ Скан паспорта сохранен!\n\n` +
                `📎 *Шаг 11/11: Дополнительные документы (опционально)*\n\n` +
                `Если есть дополнительные документы (дипломы, сертификаты и т.д.), ` +
                `можешь загрузить их сейчас.\n\n` +
                `Если нет, нажми "Завершить регистрацию"`,
                {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '✅ Завершить регистрацию', callback_data: 'complete_registration' }],
                            [{ text: '📎 Загрузить документы', callback_data: 'upload_more_docs' }]
                        ]
                    }
                }
            );
        } catch (error) {
            console.error('[EmployeeRegistrationService] Error in handlePassportScanStep:', error);
            await ctx.reply('❌ Ошибка при сохранении паспорта. Попробуй еще раз.');
        }
    }

    private async handleDocumentsStep(ctx: any, registration: any): Promise<void> {
        if (!ctx.message?.photo && !ctx.message?.document) {
            await ctx.reply('Пожалуйста, отправь фото или документ');
            return;
        }

        let fileId: string;
        let fileName = 'document';
        let fileType = 'photo';

        if (ctx.message.photo) {
            const photo = ctx.message.photo[ctx.message.photo.length - 1];
            fileId = photo.file_id;
        } else {
            fileId = ctx.message.document.file_id;
            fileName = ctx.message.document.file_name || 'document';
            fileType = ctx.message.document.mime_type || 'application/octet-stream';
        }

        const fileUrl = `telegram://file/${fileId}`;

        // Get current documents
        const current = await prisma.$queryRaw<any[]>`
            SELECT additional_documents FROM employee_registration_requests
            WHERE id = ${registration.id}
        `;

        const documents = current[0]?.additional_documents || [];
        documents.push({
            name: fileName,
            url: fileUrl,
            type: fileType,
            uploaded_at: new Date().toISOString()
        });

        await prisma.$executeRaw`
            UPDATE employee_registration_requests
            SET additional_documents = ${JSON.stringify(documents)}::jsonb,
                updated_at = NOW()
            WHERE id = ${registration.id}
        `;

        await ctx.reply(
            `✅ Документ сохранен!\n\n` +
            `Загружено документов: ${documents.length}\n\n` +
            `Можешь загрузить еще или завершить регистрацию.`,
            {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '✅ Завершить регистрацию', callback_data: 'complete_registration' }]
                    ]
                }
            }
        );
    }

    /**
     * Complete registration and submit for review
     */
    async completeRegistration(ctx: Context, registration: any): Promise<void> {
        await prisma.$executeRaw`
            UPDATE employee_registration_requests
            SET status = 'REVIEW'::registration_status,
                current_step = 'COMPLETED'::registration_step,
                completed_at = NOW()
            WHERE id = ${registration.id}
        `;

        await this.saveStepHistory(registration.id, 'COMPLETED', { completed: true });

        await ctx.reply(
            `🎉 *Поздравляем!*\n\n` +
            `Регистрация успешно завершена!\n\n` +
            `Твои данные отправлены на проверку HR-отделу. ` +
            `Мы свяжемся с тобой в ближайшее время.\n\n` +
            `Спасибо за терпение! 😊`,
            { parse_mode: 'Markdown' }
        );

        // Notify admin/HR about new registration
        await this.notifyAdminsAboutNewRegistration(registration);
    }

    /**
     * Get registration by Telegram ID
     */
    async getRegistrationByTelegramId(telegramId: string): Promise<any> {
        const result = await prisma.$queryRaw<any[]>`
            SELECT * FROM employee_registration_requests
            WHERE telegram_id = ${telegramId}
            ORDER BY created_at DESC
            LIMIT 1
        `;

        return result.length > 0 ? result[0] : null;
    }

    /**
     * Save step completion to history
     */
    private async saveStepHistory(registrationId: string, step: string, data: any): Promise<void> {
        await prisma.$executeRaw`
            INSERT INTO registration_step_history (
                id, registration_id, step, data, completed_at
            ) VALUES (
                ${randomUUID()},
                ${registrationId},
                ${step}::registration_step,
                ${JSON.stringify(data)}::jsonb,
                NOW()
            );
        `;
    }

    /**
     * Calculate age from birth date
     */
    private calculateAge(birthDate: Date): number {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }

    /**
     * Notify admins about new registration
     */
    private async notifyAdminsAboutNewRegistration(registration: any): Promise<void> {
        const admins = await prisma.user.findMany({
            where: {
                role: { in: ['ADMIN', 'HR_MANAGER'] },
                telegram_id: { not: null }
            }
        });

        const bot = telegramService.getBot();

        if (!bot) return;

        const message =
            `📋 *Новая заявка на регистрацию сотрудника*\n\n` +
            `👤 ${registration.last_name} ${registration.first_name} ${registration.middle_name || ''}\n` +
            `📧 ${registration.email}\n` +
            `📱 ${registration.phone}\n` +
            `💼 ${registration.position}\n\n` +
            `Дата подачи: ${new Date(registration.completed_at).toLocaleString('ru-RU')}`;

        for (const admin of admins) {
            if (admin.telegram_id) {
                try {
                    await bot.telegram.sendMessage(admin.telegram_id, message, {
                        parse_mode: 'Markdown'
                    });
                } catch (error) {
                    console.error(`Failed to notify admin ${admin.id}:`, error);
                }
            }
        }
    }

    /**
     * Approve registration and create user account
     * CRITICAL: Emits employee.onboarded event for Module 33 integration
     */
    async approveRegistration(
        registrationId: string,
        reviewedByUserId: string,
        overrides?: { departmentId?: string; locationId?: string }
    ): Promise<void> {
        const registration = await prisma.$queryRaw<any[]>`
            SELECT * FROM employee_registration_requests WHERE id = ${registrationId}
        `;

        if (registration.length === 0) {
            throw new Error('Registration not found');
        }

        const reg = registration[0];

        // Validation for Self-Registration (without invited_by)
        // Self-registration MUST have departmentId and locationId at approval time
        const finalDepartmentId = overrides?.departmentId || reg.department_id;
        const finalLocationId = overrides?.locationId || reg.location_id;

        if (!reg.invited_by && (!finalDepartmentId || !finalLocationId)) {
            throw new Error('departmentId and locationId are required for self-registration approval');
        }

        // Idempotency check: prevent duplicate approval
        if (reg.status === 'APPROVED') {
            console.warn(`[EmployeeRegistrationService] Registration ${registrationId} already approved`);
            throw new Error('Registration already approved');
        }

        // SECURITY: Generate secure token for password setup instead of temp password
        // @ts-ignore
        const resetToken = randomUUID();
        const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Random unguessable password hash
        // @ts-ignore
        const dummyPassword = randomUUID();
        const hashedPassword = await bcrypt.hash(dummyPassword, 12);

        // Create user account
        const user = await prisma.user.create({
            data: {
                email: reg.email,
                password_hash: hashedPassword,
                first_name: reg.first_name,
                last_name: reg.last_name,
                middle_name: reg.middle_name,
                phone_number: reg.phone,
                telegram_id: reg.telegram_id,
                role: 'EMPLOYEE',
                // @ts-ignore
                status: 'ACTIVE',
                // @ts-ignore
                admission_status: 'ADMITTED',
                // @ts-ignore
                foundation_status: 'ACCEPTED',
                department_id: finalDepartmentId,
                // @ts-ignore
                must_reset_password: true,
                // @ts-ignore
                reset_password_token: resetToken,
                // @ts-ignore
                reset_token_expires_at: tokenExpiresAt,
                // @ts-ignore
                foundation_status: 'NOT_STARTED'
            }
        });

        // Send Set Password Link via Email
        await emailService.sendPasswordSetupLink(reg.email, resetToken);

        // Create employee record
        const employee = await prisma.employee.create({
            data: {
                user_id: user.id,
                department_id: finalDepartmentId,
                position: reg.position,
                hire_date: new Date()
            }
        });

        // Update registration status (transactional guard)
        await prisma.$executeRaw`
            UPDATE employee_registration_requests
            SET status = 'APPROVED'::registration_status,
                reviewed_by = ${reviewedByUserId},
                reviewed_at = NOW(),
                updated_at = NOW(),
                department_id = ${finalDepartmentId},
                location_id = ${finalLocationId}
            WHERE id = ${registrationId}
        `;

        // CRITICAL: Emit employee.onboarded event
        this.eventEmitter.emit('employee.onboarded', {
            employeeId: employee.id,
            userId: user.id,
            onboardedAt: new Date(),
            onboardedBy: reviewedByUserId,
            onboardedByRole: 'HR_MANAGER'
        });

        console.log(`[EmployeeRegistrationService] employee.onboarded event emitted for employee ${employee.id}`);

        // Notify employee about approval
        const bot = telegramService.getBot();

        if (bot) {
            await bot.telegram.sendMessage(
                reg.telegram_id,
                `🎉 *Поздравляем!*\n\n` +
                `Твоя регистрация одобрена!\n\n` +
                `Добро пожаловать в команду MatrixGin! 🚀\n\n` +
                `На твой Email (${reg.email}) отправлена ссылка для установки пароля.\n\n` +
                `🧱 *База*\n\n` +
                `База — это обязательные правила и принципы системы.\n` +
                `После ознакомления необходимо принять Базу, иначе доступ к системе предоставлен не будет. По возникшим вопросам обратись к куратору.`,
                {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🧭 Узнай Базу', callback_data: 'start_foundation' }]
                        ]
                    }
                }
            );
        }
    }

    /**
     * Reject registration
     */
    async rejectRegistration(
        registrationId: string,
        reviewedByUserId: string,
        reason: string
    ): Promise<void> {
        const registration = await prisma.$queryRaw<any[]>`
            SELECT telegram_id FROM employee_registration_requests WHERE id = ${registrationId}
        `;

        if (registration.length === 0) {
            throw new Error('Registration not found');
        }

        await prisma.$executeRaw`
            UPDATE employee_registration_requests
            SET status = 'REJECTED'::registration_status,
                reviewed_by = ${reviewedByUserId},
                reviewed_at = NOW(),
                rejection_reason = ${reason},
                updated_at = NOW()
            WHERE id = ${registrationId}
        `;

        // Notify employee about rejection
        const bot = telegramService.getBot();

        if (bot) {
            await bot.telegram.sendMessage(
                registration[0].telegram_id,
                `❌ К сожалению, твоя заявка на регистрацию была отклонена.\n\n` +
                `Причина: ${reason}\n\n` +
                `Если у тебя есть вопросы, пожалуйста, свяжись с HR-отделом.`,
                { parse_mode: 'Markdown' }
            );
        }
    }
}

export default EmployeeRegistrationService.getInstance();

