const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding users...');

  // Create admin user
  const adminPassword = 'admin123';
  // Use a lower saltRounds to ensure the hash isn't too long
  const saltRounds = 10;
  const adminHash = await bcrypt.hash(adminPassword, saltRounds);
  
  console.log('Generated admin hash:', adminHash);
  console.log('Hash length:', adminHash.length);
  
  // Verify the hash works
  const verifyAdmin = bcrypt.compareSync(adminPassword, adminHash);
  console.log('Verify admin hash works:', verifyAdmin);
  
  // Delete existing users first
  console.log('Clearing existing users...');
  await prisma.users.deleteMany({
    where: {
      email: {
        in: ['admin@example.com', 'student@example.com']
      }
    }
  });
  
  const admin = await prisma.users.create({
    data: {
      email: 'admin@example.com',
      first_name: 'Admin',
      last_name: 'User',
      password_hash: adminHash,
      is_admin: true,
      is_active: true,
      program: 'ALUMNI',
      lp_id: 0,
    },
  });

  console.log(`Admin user created with ID: ${admin.user_id}`);
  console.log('Admin credentials:');
  console.log('Email: admin@example.com');
  console.log('Password: admin123');

  // Create student user
  const studentPassword = 'student123';
  const studentHash = await bcrypt.hash(studentPassword, saltRounds);
  
  console.log('Generated student hash:', studentHash);
  console.log('Hash length:', studentHash.length);
  
  // Verify the hash works
  const verifyStudent = bcrypt.compareSync(studentPassword, studentHash);
  console.log('Verify student hash works:', verifyStudent);
  
  const student = await prisma.users.create({
    data: {
      email: 'student@example.com',
      first_name: 'Student',
      last_name: 'User',
      password_hash: studentHash,
      is_admin: false,
      is_active: true,
      program: 'FOUNDATIONS',
      lp_id: 0,
    },
  });

  console.log(`Student user created with ID: ${student.user_id}`);
  console.log('Student credentials:');
  console.log('Email: student@example.com');
  console.log('Password: student123');

  console.log('Seeding completed successfully');
}

main()
  .catch((e) => {
    console.error('Error seeding users:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 