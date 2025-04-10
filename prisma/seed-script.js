// This is a JavaScript version of the seed script
const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

const { ApplicationStatus, JobType, JobTag, ProgramType } = require('../lib/generated/prisma');

async function main() {
  try {
    // Create some users
    const admin = await prisma.users.create({
      data: {
        username: 'admin',
        first_name: 'Admin',
        last_name: 'User',
        password_hash: '$2a$10$YDnlEcylD.SuRnC/cA4Gze4SCH4QtdSTufYQ7X9Ee0ORG0o5gDbF.',  // 'password123'
        is_admin: true,
        program: ProgramType.ALUMNI
      }
    });

    const student1 = await prisma.users.create({
      data: {
        username: 'johndoe',
        first_name: 'John',
        last_name: 'Doe',
        password_hash: '$2a$10$YDnlEcylD.SuRnC/cA4Gze4SCH4QtdSTufYQ7X9Ee0ORG0o5gDbF.',  // 'password123'
        is_admin: false,
        program: ProgramType.LIFTOFF
      }
    });

    const student2 = await prisma.users.create({
      data: {
        username: 'janedoe',
        first_name: 'Jane',
        last_name: 'Doe',
        password_hash: '$2a$10$YDnlEcylD.SuRnC/cA4Gze4SCH4QtdSTufYQ7X9Ee0ORG0o5gDbF.',  // 'password123'
        is_admin: false,
        program: ProgramType.ONE_ZERO_ONE
      }
    });

    // Create some partners
    const techCorp = await prisma.partners.create({
      data: {
        name: 'TechCorp',
        description: 'Leading technology solutions provider',
        industry: 'Technology',
        location: 'San Francisco, CA'
      }
    });

    const dataInc = await prisma.partners.create({
      data: {
        name: 'Data Inc.',
        description: 'Big data analytics firm',
        industry: 'Data Science',
        location: 'New York, NY'
      }
    });

    // Create some jobs
    const frontendJob = await prisma.jobs.create({
      data: {
        title: 'Frontend Developer',
        description: 'Build modern user interfaces with React and TypeScript',
        company: 'TechCorp',
        location: 'San Francisco, CA',
        partner_id: techCorp.partner_id,
        job_type: JobType.INTERNSHIP,
        tags: [JobTag.FRONT_END, JobTag.HYBRID]
      }
    });

    const backendJob = await prisma.jobs.create({
      data: {
        title: 'Backend Developer',
        description: 'Design and implement RESTful APIs using Node.js',
        company: 'TechCorp', 
        location: 'San Francisco, CA',
        partner_id: techCorp.partner_id,
        job_type: JobType.INTERNSHIP,
        tags: [JobTag.BACK_END, JobTag.FULLY_REMOTE]
      }
    });

    const dataJob = await prisma.jobs.create({
      data: {
        title: 'Data Analyst',
        description: 'Analyze data and create visualizations',
        company: 'Data Inc.',
        location: 'New York, NY',
        partner_id: dataInc.partner_id,
        job_type: JobType.INTERNSHIP,
        tags: [JobTag.DATA_SCIENCE, JobTag.IN_PERSON]
      }
    });

    // Create some applications
    await prisma.applications.create({
      data: {
        user_id: student1.user_id,
        job_id: frontendJob.job_id,
        status: ApplicationStatus.APPLIED,
        position: 'Frontend Developer Intern'
      }
    });

    await prisma.applications.create({
      data: {
        user_id: student1.user_id,
        job_id: backendJob.job_id,
        status: ApplicationStatus.INTERVIEWING,
        position: 'Backend Developer Intern'
      }
    });

    await prisma.applications.create({
      data: {
        user_id: student2.user_id,
        job_id: dataJob.job_id,
        status: ApplicationStatus.INTERVIEWING,
        position: 'Data Analyst Intern'
      }
    });

    console.log('Database has been seeded!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 