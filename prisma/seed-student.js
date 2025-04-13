const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding student user...');

  // Hash the password - using a simple password for development
  const password = 'student123';
  const passwordHash = await bcrypt.hash(password, 10);

  // Create student user
  const student = await prisma.users.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      first_name: 'Student',
      last_name: 'User',
      password_hash: passwordHash,
      is_admin: false,
      is_active: true,
      program: 'FOUNDATIONS',
    },
  });

  console.log(`Student user created with ID: ${student.user_id}`);
  console.log('Student credentials:');
  console.log('Email: student@example.com');
  console.log('Password: student123');
}

main()
  .catch((e) => {
    console.error('Error seeding student user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 