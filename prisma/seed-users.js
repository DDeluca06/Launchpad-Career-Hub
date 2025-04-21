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

  // Create sample jobs and applications for the student
  console.log('Creating sample jobs and applications for student...');

  // Create a sample resume for the student
  const studentResume = await prisma.resumes.create({
    data: {
      user_id: student.user_id,
      file_path: '/uploads/student_resume.pdf',
      file_name: 'student_resume.pdf',
      is_default: true
    }
  });

  // Create sample companies/partners
  const companies = [
    'TechCorp Solutions',
    'Digital Innovations Inc',
    'WebStack Technologies',
    'DataFlow Systems',
    'CloudNine Computing'
  ];

  for (const companyName of companies) {
    // Create a partner
    const partner = await prisma.partners.create({
      data: {
        name: companyName,
        description: `${companyName} is a leading technology company`,
        industry: 'Technology',
        location: 'Remote, US',
        website_url: `https://www.${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        contact_name: 'HR Manager',
        contact_email: `hr@${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        contact_phone: '(555) 123-4567',
        is_archived: false
      }
    });

    // Create a job for each partner
    const job = await prisma.jobs.create({
      data: {
        title: 'Junior Software Developer',
        description: 'Looking for talented junior developers to join our team',
        company: companyName,
        website: `https://www.${companyName.toLowerCase().replace(/\s+/g, '')}.com/careers`,
        location: 'Remote, US',
        partner_id: partner.partner_id,
        job_type: 'FULL_TIME',
        tags: ['FULLY_REMOTE', 'FRONT_END', 'BACK_END'],
        archived: false
      }
    });

    // Create an application for the student
    await prisma.applications.create({
      data: {
        user_id: student.user_id,
        job_id: job.job_id,
        status: ['APPLIED', 'PHONE_SCREENING', 'INTERVIEW_STAGE', 'FINAL_INTERVIEW_STAGE', 'OFFER_EXTENDED'][Math.floor(Math.random() * 5)],
        isArchived: false,
        position: 'Junior Software Developer',
        resume_id: studentResume.resume_id,
        applied_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        cover_letter: `Dear Hiring Manager,\n\nI am excited to apply for the Junior Software Developer position at ${companyName}. As a recent graduate of the LaunchCode program, I have developed strong programming skills and am eager to contribute to your team.\n\nBest regards,\nStudent User`,
        ideal_candidate: 'The ideal candidate should have strong problem-solving skills, knowledge of modern web technologies, and a passion for learning.'
      }
    });
  }

  console.log('Created sample applications for student user');

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