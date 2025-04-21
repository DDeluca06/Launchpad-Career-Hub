// This is a JavaScript version of the seed script
const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient();

const main = async () => {
  try {
    // Clear existing data
    await prisma.app_status_history.deleteMany();
    await prisma.applications.deleteMany();
    await prisma.dashboard_activity.deleteMany();
    await prisma.interviews.deleteMany();
    await prisma.jobs.deleteMany();
    await prisma.partners.deleteMany();
    await prisma.resumes.deleteMany();
    await prisma.users.deleteMany();

    // Create companies
    const companies = [];
    const companyNames = [
      'TechCorp Solutions',
      'Digital Innovations Inc',
      'WebStack Technologies',
      'DataFlow Systems',
      'CloudNine Computing',
      'CodeCraft Studios',
      'ByteBridge Solutions',
      'DevOps Dynamics',
      'AI Nexus Labs',
      'CyberSecure Systems'
    ];

    for (const name of companyNames) {
      const company = await prisma.companies.create({
        data: {
          name: name,
          description: faker.company.catchPhrase(),
          website: `https://www.${name.toLowerCase().replace(/\s+/g, '')}.com`,
          industry: faker.helpers.arrayElement(['Technology', 'Software', 'AI', 'Cybersecurity', 'Cloud Computing']),
          location: `${faker.location.city()}, ${faker.location.state({ abbreviated: true })}`,
          logo_url: faker.image.url(),
          is_partner: faker.datatype.boolean()
        }
      });
      companies.push(company);
    }

    // Create admin user
    const adminUser = await prisma.users.create({
      data: {
        email: 'admin@example.com',
        first_name: 'Admin',
        last_name: 'User',
        password_hash: '$2a$10$YDnlEcylD.SuRnC/cA4Gze4SCH4QtdSTufYQ7X9Ee0o5gDbF.',
        is_admin: true,
        program: 'ONE_ZERO_ONE'
      }
    });

    // Create regular users
    const users = [];
    for (let i = 0; i < 50; i++) {
      const user = await prisma.users.create({
        data: {
          email: faker.internet.email(),
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
          password_hash: '$2a$10$YDnlEcylD.SuRnC/cA4Gze4SCH4QtdSTufYQ7X9Ee0o5gDbF.',
          is_admin: false,
          program: faker.helpers.arrayElement(['ONE_ZERO_ONE', 'LIFTOFF', 'FOUNDATIONS', 'ALUMNI'])
        }
      });
      users.push(user);
    }

    // Create partners
    const partners = [];
    for (let i = 0; i < 10; i++) {
      const partner = await prisma.partners.create({
        data: {
          name: faker.company.name(),
          description: faker.company.catchPhrase(),
          industry: faker.commerce.department(),
          location: `${faker.location.city()}, ${faker.location.state({ abbreviated: true })}`,
          website_url: faker.internet.url(),
          contact_name: faker.person.fullName(),
          contact_email: faker.internet.email(),
          contact_phone: faker.phone.number(),
          jobs_available: faker.number.int({ min: 1, max: 10 }),
          applicants: faker.number.int({ min: 0, max: 50 }),
          applicants_hired: faker.number.int({ min: 0, max: 10 }),
          is_archived: faker.datatype.boolean()
        }
      });
      partners.push(partner);
    }

    // Create jobs for each partner
    const jobs = [];
    for (const partner of partners) {
      const jobCount = faker.number.int({ min: 3, max: 8 });
      for (let i = 0; i < jobCount; i++) {
        const job = await prisma.jobs.create({
          data: {
            title: faker.person.jobTitle(),
            description: faker.lorem.paragraphs(2),
            company: partner.name,
            website: faker.internet.url(),
            location: partner.location,
            partner_id: partner.partner_id,
            job_type: faker.helpers.arrayElement(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'APPRENTICESHIP', 'INTERNSHIP']),
            tags: faker.helpers.arrayElements([
              'FRONT_END', 'BACK_END', 'FULL_STACK',
              'DATA_SCIENCE', 'CYBERSECURITY', 'UX_UI_DESIGN',
              'CLOUD_COMPUTING', 'DEVOPS', 'AI_ML'
            ], { min: 2, max: 4 }),
            archived: false // Set most jobs as active
          }
        });
        jobs.push(job);
      }
    }

    // Create resumes for users
    const resumes = [];
    for (const user of users) {
      const resumeCount = faker.number.int({ min: 1, max: 3 });
      for (let i = 0; i < resumeCount; i++) {
        const resume = await prisma.resumes.create({
          data: {
            user_id: user.user_id,
            file_path: faker.system.filePath(),
            file_name: `${user.first_name}_${user.last_name}_resume.pdf`,
            is_default: i === 0
          }
        });
        resumes.push(resume);
      }
    }

    // Create applications - increased number and better status distribution
    const applications = [];
    const applicationStatuses = [
      'INTERESTED',
      'APPLIED',
      'PHONE_SCREENING',
      'INTERVIEW_STAGE',
      'FINAL_INTERVIEW_STAGE',
      'OFFER_EXTENDED',
      'NEGOTIATION',
      'OFFER_ACCEPTED',
      'REJECTED'
    ];

    // Create 200 applications with a good distribution of statuses
    for (let i = 0; i < 200; i++) {
      const user = faker.helpers.arrayElement(users);
      const job = faker.helpers.arrayElement(jobs);
      const resume = faker.helpers.arrayElement(resumes.filter(r => r.user_id === user.user_id));
      
      // Weight the status distribution to ensure we have enough OFFER_ACCEPTED
      let status;
      if (i < 40) { // 20% OFFER_ACCEPTED
        status = 'OFFER_ACCEPTED';
      } else if (i < 80) { // 20% in progress (INTERVIEW stages)
        status = faker.helpers.arrayElement(['INTERVIEW_STAGE', 'FINAL_INTERVIEW_STAGE', 'NEGOTIATION']);
      } else {
        status = faker.helpers.arrayElement(applicationStatuses);
      }

      const application = await prisma.applications.create({
        data: {
          user_id: user.user_id,
          job_id: job.job_id,
          status: status,
          isArchived: false, // Keep most applications active
          position: job.title,
          resume_id: resume?.resume_id,
          applied_at: faker.date.past({ years: 1 }), // Applications within the last year
          cover_letter: faker.lorem.paragraphs(2), // Add sample cover letter
          ideal_candidate: faker.lorem.paragraphs(1) // Add sample ideal candidate description
        }
      });
      applications.push(application);

      // Create status history for each application
      const statusHistory = [
        'APPLIED',
        'INTERVIEWING',
        'OFFERED',
        'HIRED',
        'REJECTED'
      ];
      
      let lastChangeDate = new Date(application.applied_at);
      for (const status of statusHistory) {
        if (faker.datatype.boolean()) {
          // Ensure status changes are sequential after applied_at
          lastChangeDate = new Date(lastChangeDate.getTime() + faker.number.int({ min: 1, max: 15 }) * 24 * 60 * 60 * 1000);
          
          await prisma.app_status_history.create({
            data: {
              application_id: application.application_id,
              status: status,
              changed_at: lastChangeDate
            }
          });
        }
      }
    }

    // Create interviews
    for (let i = 0; i < 50; i++) {
      const user = faker.helpers.arrayElement(users);
      const startTime = faker.date.future();
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // Add 1 hour to start time
      
      await prisma.interviews.create({
        data: {
          user_id: user.user_id,
          title: faker.person.jobTitle(),
          description: faker.lorem.sentence(),
          start_time: startTime,
          end_time: endTime,
          location: faker.location.city(),
          candidate_name: `${user.first_name} ${user.last_name}`,
          position: faker.person.jobTitle(),
          status: faker.helpers.arrayElement(['SCHEDULED', 'COMPLETED', 'CANCELLED']),
          interview_type: faker.helpers.arrayElement(['PHONE', 'VIDEO', 'IN_PERSON']),
          notes: faker.lorem.paragraphs(2),
          created_at: new Date(),
          updated_at: new Date()
        }
      });
    }

    // Create dashboard activity
    for (let i = 0; i < 50; i++) {
      await prisma.dashboard_activity.create({
        data: {
          admin_id: adminUser.user_id,
          action: faker.helpers.arrayElement([
            'CREATED_PARTNER',
            'UPDATED_PARTNER',
            'ARCHIVED_PARTNER',
            'CREATED_JOB',
            'UPDATED_JOB',
            'ARCHIVED_JOB',
            'VIEWED_APPLICANT',
            'UPDATED_APPLICATION_STATUS'
          ]),
          details: faker.lorem.sentence()
        }
      });
    }

    console.log('Database has been seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
};

main();
