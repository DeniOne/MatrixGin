import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    const count = await prisma.employeeRegistrationRequest.count();
    const all = await prisma.employeeRegistrationRequest.findMany();
    console.log('--- REGISTRATION REQUESTS ---');
    console.log('Count:', count);
    console.log('Data:', JSON.stringify(all, null, 2));

    const employees = await prisma.employee.findMany({
        include: {
            user: { select: { email: true, first_name: true, last_name: true } }
        }
    });
    console.log('--- EMPLOYEES ---');
    console.log(JSON.stringify(employees, null, 2));
}

check()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
