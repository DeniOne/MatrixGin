// Script to check existing users in database
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUsers() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                role: true,
                telegram_id: true
            }
        });

        console.log(`\n📋 Found ${users.length} user(s) in database:\n`);
        
        if (users.length === 0) {
            console.log('❌ No users found in database.');
            console.log('\n💡 You need to create a user account first.');
            console.log('   Run the seed script or create a user via API.');
        } else {
            users.forEach((user, index) => {
                console.log(`${index + 1}. ${user.email}`);
                console.log(`   Name: ${user.first_name} ${user.last_name}`);
                console.log(`   Role: ${user.role}`);
                console.log(`   Telegram ID: ${user.telegram_id || 'Not linked'}`);
                console.log('');
            });
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUsers();
