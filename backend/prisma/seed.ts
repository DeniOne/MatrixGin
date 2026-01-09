import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting database seeding...');

    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
        where: { email: 'admin@photomatrix.ru' }
    });

    if (!existingAdmin) {
        // Create Admin user
        const hashedPassword = await bcrypt.hash('Admin123!', 10);

        const adminUser = await prisma.user.create({
            data: {
                email: 'admin@photomatrix.ru',
                password_hash: hashedPassword,
                first_name: 'System',
                last_name: 'Administrator',
                role: 'ADMIN',
                status: 'ACTIVE'
            }
        });

        console.log('✅ Admin user created:', adminUser.email);

        // Create Employee record for Admin
        const adminEmployee = await prisma.employee.create({
            data: {
                user_id: adminUser.id,
                position: 'System Administrator',
                employee_number: 'ADM-001',
                status: 'UNIVERSE',
                rank: 'MAGNATE',
                hired_at: new Date(),
                mc_balance: 10000,
                gmc_balance: 1000
            }
        });

        console.log('✅ Admin employee record created');

        // Create Wallet for Admin
        await prisma.wallet.create({
            data: {
                user_id: adminUser.id,
                mc_balance: 10000,
                gmc_balance: 1000
            }
        });

        console.log('✅ Admin wallet created');
    } else {
        console.log('✅ Admin user already exists');
    }

    // Create 7 Academies for Corporate University (if not exist)
    const existingAcademies = await prisma.academy.count();
    
    if (existingAcademies === 0) {
        const academies = [
            {
                name: 'PhotoCraft Academy',
                description: 'Техника съемки, свет, композиция, обработка'
            },
            {
                name: 'Sales Excellence Academy',
                description: 'Психология продаж, переговоры, кросс-продажи'
            },
            {
                name: 'Service & Customer Care Academy',
                description: 'Сервис, работа с клиентами, решение конфликтов'
            },
            {
                name: 'Values & Culture Academy',
                description: 'Миссия, этика, командная работа'
            },
            {
                name: 'Soft Skills Academy',
                description: 'Эмоциональный интеллект, тайм-менеджмент, коммуникации'
            },
            {
                name: 'Equipment & Tech Academy',
                description: 'Оборудование, ПО, IT-безопасность'
            },
            {
                name: 'Leadership & Management Academy',
                description: 'Управление, финансы, стратегия'
            }
        ];

        for (const academy of academies) {
            await prisma.academy.create({
                data: academy
            });
        }

        console.log('✅ Created 7 academies for Corporate University');
    } else {
        console.log('✅ Academies already exist');
    }

    console.log('\n🎉 Seeding completed successfully!');
    console.log('\nAdmin credentials:');
    console.log('Email: admin@photomatrix.ru');
    console.log('Password: Admin123!');
}

main()
    .catch((e) => {
        console.error('Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
