// Script to link Telegram account for superuser
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function linkTelegramAccount() {
    try {
        const result = await prisma.user.updateMany({
            where: {
                email: 'denisgovako@gmail.com'
            },
            data: {
                telegram_id: '441610858'
            }
        });

        console.log(`✅ Updated ${result.count} user(s)`);

        // Verify the update
        const user = await prisma.user.findUnique({
            where: {
                email: 'denisgovako@gmail.com'
            },
            select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                telegram_id: true,
                role: true
            }
        });

        console.log('\n📋 User details:');
        console.log(JSON.stringify(user, null, 2));

        if (user?.telegram_id === '441610858') {
            console.log('\n✅ Telegram account successfully linked!');
            console.log('You can now use the bot with full functionality.');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

linkTelegramAccount();
