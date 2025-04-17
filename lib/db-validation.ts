/**
 * Database validation utility for Launchpad Career Hub
 * Provides functions to validate database connectivity and schema structure
 */
import { prisma } from './prisma';

/**
 * Validates database connection by performing a simple query
 */
export async function validateDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { success: true };
  } catch (error) {
    console.error('Database connection validation failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown database connection error' 
    };
  }
}

/**
 * Validates the applicant-related database schema
 * Ensures tables and relationships needed for applicant features exist
 */
export async function validateApplicantSchema() {
  try {
    // Check required tables exist by counting records
    const [
      usersCount,
      applicationsCount,
      jobsCount,
    ] = await Promise.all([
      prisma.users.count(),
      prisma.applications.count(),
      prisma.jobs.count(),
    ]);

    console.log('Schema validation counts:', { usersCount, applicationsCount, jobsCount });

    // Test applicant relationship queries
    const testQuery = await prisma.users.findFirst({
      where: { is_admin: false },
      select: {
        user_id: true,
        email: true,
        first_name: true,
        last_name: true,
        applications: {
          take: 1,
          select: {
            application_id: true,
            status: true,
            jobs: {
              select: {
                job_id: true,
                title: true,
                company: true
              }
            }
          }
        }
      }
    });

    return { 
      success: true,
      tablesExist: true,
      relationshipsValid: !!testQuery,
      testQuery: testQuery ? 'Valid' : 'No applicant data found, but schema is valid'
    };
  } catch (error) {
    console.error('Applicant schema validation failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown schema validation error',
      stack: error instanceof Error ? error.stack : undefined
    };
  }
}

/**
 * Comprehensive validator that checks both connection and schema
 */
export async function validateApplicantDatabase() {
  const connectionStatus = await validateDatabaseConnection();
  
  if (!connectionStatus.success) {
    return {
      ...connectionStatus,
      message: 'Database connection failed. Please check your database connection string and server status.'
    };
  }
  
  const schemaStatus = await validateApplicantSchema();
  
  return {
    success: connectionStatus.success && schemaStatus.success,
    connection: connectionStatus,
    schema: schemaStatus,
    message: schemaStatus.success 
      ? 'Database validation successful. All required tables and relationships are available.'
      : 'Database schema validation failed. Please check if all migrations have been applied.'
  };
} 