// This is a JavaScript version of the seed script
const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient();

const main = async () => {
  try {
    // Original seed content here (your full seed data)
    // ... existing user/partner/job/application creation code ...

    // Extra Users
    for (let i = 0; i < 10; i++) {
      await prisma.users.create({
        data: {
          username: faker.internet.username(),
          first_name: faker.person.firstName(), 
          last_name: faker.person.lastName(),
          password_hash: '$2a$10$YDnlEcylD.SuRnC/cA4Gze4SCH4QtdSTufYQ7X9Ee0o5gDbF.',
          is_admin: false,
          program: faker.helpers.arrayElement(['LIFTOFF', 'ALUMNI', 'FOUNDATIONS', 'ONE_ZERO_ONE'])
        }
      });
    }

    // Extra Partners
    for (let i = 0; i < 5; i++) {
      await prisma.partners.create({
        data: {
          name: faker.company.name(),
          description: faker.company.catchPhrase(),
          industry: faker.commerce.department(),
          location: `${faker.location.city()}, ${faker.location.state({ abbreviated: true })}`,
          jobs_available: faker.number.int({ min: 1, max: 5 }),
          applicants: faker.number.int({ min: 0, max: 30 }),
          applicants_hired: faker.number.int({ min: 0, max: 10 }),
          is_archived: faker.datatype.boolean()
        }
      });
    }

    // Fetch new users and partners
    const users = await prisma.users.findMany();
    const partners = await prisma.partners.findMany();

    // Extra Jobs
    for (const partner of partners) {
      const jobCount = faker.number.int({ min: 1, max: 3 });
      for (let i = 0; i < jobCount; i++) {
        await prisma.jobs.create({
          data: {
            title: faker.person.jobTitle(),
            description: faker.lorem.sentences(2),
            company: partner.name,
            location: partner.location,
            partner_id: partner.partner_id,
            job_type: faker.helpers.arrayElement(['INTERNSHIP', 'FULL_TIME', 'PART_TIME']),
            tags: faker.helpers.arrayElements(
              ['FRONT_END', 'BACK_END', 'FULL_STACK', 'DATA_SCIENCE', 'AI_ML', 'DEVOPS', 'UX_UI_DESIGN', 'PRODUCT_MANAGEMENT', 'CLOUD_COMPUTING', 'IN_PERSON', 'HYBRID', 'FULLY_REMOTE'],
              faker.number.int({ min: 1, max: 3 })
            )
          }
        });
      }
    }

    // Fetch new jobs
    const jobs = await prisma.jobs.findMany();

    // Extra Applications
    for (let i = 0; i < 50; i++) {
      const user = faker.helpers.arrayElement(users);
      const job = faker.helpers.arrayElement(jobs);

      await prisma.applications.create({
        data: {
          user_id: user.user_id,
          job_id: job.job_id,
          status: faker.helpers.arrayElement([
            'APPLIED', 'INTERESTED', 'PHONE_SCREENING', 'INTERVIEW_STAGE', 'FINAL_INTERVIEW_STAGE', 'OFFER_EXTENDED', 'OFFER_ACCEPTED', 'REJECTED', 'NEGOTIATION'
          ]),
          position: job.title,
          applied_at: faker.date.recent(180)
        }
      });
    }

    console.log('Database has been seeded with extra data!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
};

main();
