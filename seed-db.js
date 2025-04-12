// Simple script to seed the database
const { execSync } = require('child_process');
const path = require('path');

console.log('Starting database seed process...');

try {
  // Run the seed-users.js script
  console.log('Seeding users...');
  execSync('node prisma/seed-users.js', { stdio: 'inherit' });
  
  console.log('\nDatabase seeding completed successfully!');
  console.log('\nTest credentials:');
  console.log('- Admin: admin@example.com / admin123');
  console.log('- Student: student@example.com / student123');
} catch (error) {
  console.error('Error seeding database:', error.message);
  process.exit(1);
} 