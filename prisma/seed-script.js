// This is a JavaScript version of the seed script
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// No need to destructure types from prisma.$types - they don't exist at runtime
// Just use the string values directly

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
        program: 'ALUMNI'
      }
    });

    const student1 = await prisma.users.create({
      data: {
        username: 'johndoe',
        first_name: 'John',
        last_name: 'Doe',
        password_hash: '$2a$10$YDnlEcylD.SuRnC/cA4Gze4SCH4QtdSTufYQ7X9Ee0ORG0o5gDbF.',  // 'password123'
        is_admin: false,
        program: 'LIFTOFF'
      }
    });

    const student2 = await prisma.users.create({
      data: {
        username: 'janedoe',
        first_name: 'Jane',
        last_name: 'Doe',
        password_hash: '$2a$10$YDnlEcylD.SuRnC/cA4Gze4SCH4QtdSTufYQ7X9Ee0ORG0o5gDbF.',  // 'password123'
        is_admin: false,
        program: 'ONE_ZERO_ONE'
      }
    });

    // Add more students for better analytics
    const student3 = await prisma.users.create({
      data: {
        username: 'mikesmith',
        first_name: 'Mike',
        last_name: 'Smith',
        password_hash: '$2a$10$YDnlEcylD.SuRnC/cA4Gze4SCH4QtdSTufYQ7X9Ee0ORG0o5gDbF.',  // 'password123'
        is_admin: false,
        program: 'FOUNDATIONS'
      }
    });

    const student4 = await prisma.users.create({
      data: {
        username: 'sarahlee',
        first_name: 'Sarah',
        last_name: 'Lee',
        password_hash: '$2a$10$YDnlEcylD.SuRnC/cA4Gze4SCH4QtdSTufYQ7X9Ee0ORG0o5gDbF.',  // 'password123'
        is_admin: false,
        program: 'LIFTOFF'
      }
    });

    const student5 = await prisma.users.create({
      data: {
        username: 'alexwang',
        first_name: 'Alex',
        last_name: 'Wang',
        password_hash: '$2a$10$YDnlEcylD.SuRnC/cA4Gze4SCH4QtdSTufYQ7X9Ee0ORG0o5gDbF.',  // 'password123'
        is_admin: false,
        program: 'ALUMNI'
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

    // Add more partners
    const webSolutions = await prisma.partners.create({
      data: {
        name: 'Web Solutions',
        description: 'Modern web development company',
        industry: 'Web Development',
        location: 'Chicago, IL'
      }
    });

    const aiLabs = await prisma.partners.create({
      data: {
        name: 'AI Labs',
        description: 'Cutting-edge artificial intelligence research',
        industry: 'Artificial Intelligence',
        location: 'Boston, MA'
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
        job_type: 'INTERNSHIP',
        tags: ['FRONT_END', 'HYBRID']
      }
    });

    const backendJob = await prisma.jobs.create({
      data: {
        title: 'Backend Developer',
        description: 'Design and implement RESTful APIs using Node.js',
        company: 'TechCorp', 
        location: 'San Francisco, CA',
        partner_id: techCorp.partner_id,
        job_type: 'INTERNSHIP',
        tags: ['BACK_END', 'FULLY_REMOTE']
      }
    });

    const dataJob = await prisma.jobs.create({
      data: {
        title: 'Data Analyst',
        description: 'Analyze data and create visualizations',
        company: 'Data Inc.',
        location: 'New York, NY',
        partner_id: dataInc.partner_id,
        job_type: 'INTERNSHIP',
        tags: ['DATA_SCIENCE', 'IN_PERSON']
      }
    });

    // Add more jobs
    const fullstackJob = await prisma.jobs.create({
      data: {
        title: 'Full Stack Developer',
        description: 'Work on both frontend and backend with React and Node.js',
        company: 'Web Solutions',
        location: 'Chicago, IL',
        partner_id: webSolutions.partner_id,
        job_type: 'FULL_TIME',
        tags: ['FULL_STACK', 'HYBRID']
      }
    });

    const mlEngineerJob = await prisma.jobs.create({
      data: {
        title: 'Machine Learning Engineer',
        description: 'Develop and deploy machine learning models',
        company: 'AI Labs',
        location: 'Boston, MA',
        partner_id: aiLabs.partner_id,
        job_type: 'FULL_TIME',
        tags: ['AI_ML', 'FULLY_REMOTE']
      }
    });

    const uxDesignerJob = await prisma.jobs.create({
      data: {
        title: 'UX Designer',
        description: 'Create intuitive user experiences and interfaces',
        company: 'TechCorp',
        location: 'San Francisco, CA',
        partner_id: techCorp.partner_id,
        job_type: 'PART_TIME',
        tags: ['UX_UI_DESIGN', 'HYBRID']
      }
    });

    const devOpsJob = await prisma.jobs.create({
      data: {
        title: 'DevOps Engineer',
        description: 'Manage CI/CD pipelines and cloud infrastructure',
        company: 'Web Solutions',
        location: 'Chicago, IL',
        partner_id: webSolutions.partner_id,
        job_type: 'FULL_TIME',
        tags: ['DEVOPS', 'CLOUD_COMPUTING', 'HYBRID']
      }
    });

    const productManagerJob = await prisma.jobs.create({
      data: {
        title: 'Product Manager',
        description: 'Lead product development and roadmap planning',
        company: 'AI Labs',
        location: 'Boston, MA',
        partner_id: aiLabs.partner_id,
        job_type: 'FULL_TIME',
        tags: ['PRODUCT_MANAGEMENT', 'IN_PERSON']
      }
    });

    // Create applications with various statuses
    await prisma.applications.create({
      data: {
        user_id: student1.user_id,
        job_id: frontendJob.job_id,
        status: 'APPLIED',
        position: 'Frontend Developer Intern',
        applied_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // 90 days ago
      }
    });

    await prisma.applications.create({
      data: {
        user_id: student1.user_id,
        job_id: backendJob.job_id,
        status: 'INTERVIEW_STAGE',
        position: 'Backend Developer Intern',
        applied_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) // 60 days ago
      }
    });

    await prisma.applications.create({
      data: {
        user_id: student2.user_id,
        job_id: dataJob.job_id,
        status: 'PHONE_SCREENING',
        position: 'Data Analyst Intern',
        applied_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000) // 45 days ago
      }
    });

    // Add more applications with various statuses
    await prisma.applications.create({
      data: {
        user_id: student3.user_id,
        job_id: fullstackJob.job_id,
        status: 'FINAL_INTERVIEW_STAGE',
        position: 'Full Stack Developer',
        applied_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
      }
    });

    await prisma.applications.create({
      data: {
        user_id: student4.user_id,
        job_id: mlEngineerJob.job_id,
        status: 'OFFER_EXTENDED',
        position: 'Junior ML Engineer',
        applied_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) // 20 days ago
      }
    });

    await prisma.applications.create({
      data: {
        user_id: student5.user_id,
        job_id: uxDesignerJob.job_id,
        status: 'NEGOTIATION',
        position: 'Junior UX Designer',
        applied_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
      }
    });

    await prisma.applications.create({
      data: {
        user_id: student1.user_id,
        job_id: devOpsJob.job_id,
        status: 'OFFER_ACCEPTED',
        position: 'Junior DevOps Engineer',
        applied_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000) // 120 days ago
      }
    });

    await prisma.applications.create({
      data: {
        user_id: student2.user_id,
        job_id: productManagerJob.job_id,
        status: 'REJECTED',
        position: 'Associate Product Manager',
        applied_at: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000) // 150 days ago
      }
    });

    await prisma.applications.create({
      data: {
        user_id: student3.user_id,
        job_id: mlEngineerJob.job_id,
        status: 'INTERESTED',
        position: 'ML Research Assistant',
        applied_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      }
    });

    await prisma.applications.create({
      data: {
        user_id: student4.user_id,
        job_id: frontendJob.job_id,
        status: 'OFFER_ACCEPTED',
        position: 'Frontend Developer Intern',
        applied_at: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000) // 100 days ago
      }
    });

    await prisma.applications.create({
      data: {
        user_id: student5.user_id,
        job_id: backendJob.job_id,
        status: 'APPLIED',
        position: 'Backend Developer Intern',
        applied_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
      }
    });

    await prisma.applications.create({
      data: {
        user_id: student1.user_id,
        job_id: dataJob.job_id,
        status: 'REJECTED',
        position: 'Data Analyst Intern',
        applied_at: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) // 180 days ago
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