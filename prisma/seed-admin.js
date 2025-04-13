const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding admin user...');

  // Hash the password - using a simple password for development
  const password = 'admin123';
  const passwordHash = await bcrypt.hash(password, 10);

  // Create admin user
  const admin = await prisma.users.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      first_name: 'Admin',
      last_name: 'User',
      password_hash: passwordHash,
      is_admin: true,
      is_active: true,
      program: 'ALUMNI',
    },
  });

  console.log(`Admin user created with ID: ${admin.user_id}`);
  console.log('Admin credentials:');
  console.log('Email: admin@example.com');
  console.log('Password: admin123');
}

main()
  .catch((e) => {
    console.error('Error seeding admin user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 