import telegramService from './telegram.service';

import { prisma } from '../config/prisma';

export interface CreateNotificationDto {
    userId: string;
    type: string;
    title: string;
    message: string;
    metadata?: any;
}

class NotificationService {
    async createNotification(data: CreateNotificationDto): Promise<any> {
        const notification = await prisma.notification.create({
            data: {
                user_id: data.userId,
                type: data.type,
                title: data.title,
                message: data.message,
                metadata: data.metadata || {},
                read: false
            }
        });

        // Send via Telegram if user has telegram_id
        await telegramService.sendNotification(
            data.userId,
            `*${data.title}*\n\n${data.message}`
        );

        return notification;
    }

    async getUnreadNotifications(userId: string): Promise<any[]> {
        return await prisma.notification.findMany({
            where: {
                user_id: userId,
                read: false
            },
            orderBy: { created_at: 'desc' }
        });
    }

    async markAsRead(notificationId: string): Promise<void> {
        await prisma.notification.update({
            where: { id: notificationId },
            data: {
                read: true,
                read_at: new Date()
            }
        });
    }

    async markAllAsRead(userId: string): Promise<void> {
        await prisma.notification.updateMany({
            where: {
                user_id: userId,
                read: false
            },
            data: {
                read: true,
                read_at: new Date()
            }
        });
    }

    async sendTaskNotification(taskId: string, assigneeId: string, action: string): Promise<void> {
        const task = await prisma.task.findUnique({
            where: { id: taskId },
            include: { creator: true }
        });

        if (!task) return;

        let title = '';
        let message = '';

        switch (action) {
            case 'assigned':
                title = '📋 Новая задача';
                message = `Вам назначена задача: "${task.title}"\n` +
                    `Приоритет: ${task.priority}\n` +
                    `Награда: ${task.mc_reward} MC`;
                break;
            case 'completed':
                title = '✅ Задача выполнена';
                message = `Задача "${task.title}" выполнена!\n` +
                    `Вы получили ${task.mc_reward} MC`;
                break;
            case 'updated':
                title = '🔄 Задача обновлена';
                message = `Задача "${task.title}" была обновлена`;
                break;
        }

        await this.createNotification({
            userId: assigneeId,
            type: 'task',
            title,
            message,
            metadata: { taskId, action }
        });
    }

    async sendTransactionNotification(
        userId: string,
        amount: number,
        currency: string,
        type: string
    ): Promise<void> {
        let title = '';
        let message = '';

        if (type === 'task_reward') {
            title = '💰 Награда получена';
            message = `Вы получили ${amount} ${currency} за выполнение задачи`;
        } else if (type === 'transfer') {
            title = '💸 Перевод получен';
            message = `Вы получили ${amount} ${currency}`;
        } else if (type === 'bonus') {
            title = '🎁 Бонус получен';
            message = `Вы получили бонус ${amount} ${currency}`;
        }

        await this.createNotification({
            userId,
            type: 'transaction',
            title,
            message,
            metadata: { amount, currency, transactionType: type }
        });
    }
}

export default new NotificationService();

