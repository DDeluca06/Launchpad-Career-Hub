import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus, ProgramType } from '@/lib/prisma-enums';
import bcrypt from 'bcrypt';

interface Application {
  status: string;
  application_id: number;
  job_id: number;
  jobs?: {
    title: string;
    company: string;
    website?: string;
    description?: string;
  };
  applied_at?: Date | null;
  notes?: string;
  sub_stage?: string;
}

interface User {
  user_id: number;
  email?: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_archived: boolean;
  is_admin?: boolean;
  program?: ProgramType;
  created_at?: Date | null;
  applications: {
    application_id: number;
    status: ApplicationStatus;
    job_id: number;
    isArchived: boolean;
    applied_at: Date | null;
    status_updated: Date | null;
    resume_id: number | null;
    position: string | null;
    notes?: string;
    sub_stage?: string;
  }[];
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id'); // For single applicant
    const fetchApplications = searchParams.get('applications') === 'true'; // New param for fetching applications
    
    // If ID is provided, fetch a single applicant or their applications
    if (id) {
      const userId = parseInt(id);
      
      if (isNaN(userId)) {
        return NextResponse.json(
          { error: 'Invalid applicant ID' },
          { status: 400 }
        );
      }

      // If fetching applications specifically
      if (fetchApplications) {
        const applications = await prisma.applications.findMany({
          where: { 
            user_id: userId 
          },
          include: {
            jobs: {
              select: {
                title: true,
                company: true,
                website: true,
                description: true
              }
            }
          },
          orderBy: {
            applied_at: 'desc'
          }
        });
        
        const formattedApplications = applications.map((app) => ({
          id: app.application_id,
          jobId: app.job_id,
          jobTitle: app.jobs?.title || '',
          company: app.jobs?.company || '',
          companyLogoUrl: app.jobs?.website || 'https://placehold.co/150',
          status: app.status.toLowerCase(),
          appliedDate: app.applied_at?.toISOString() || new Date().toISOString(),
          notes: app.notes || '',
          nextSteps: app.sub_stage || '',
          interviewDate: undefined
        }));
        
        return NextResponse.json({ applications: formattedApplications });
      }
      
      // Get the user/applicant
      const user = await prisma.users.findUnique({
        where: { user_id: userId },
        include: {
          applications: {
            include: {
              jobs: true,
            },
          },
        },
      }) as User | null;
      
      if (!user) {
        return NextResponse.json(
          { error: 'Applicant not found' },
          { status: 404 }
        );
      }
      
      // Format program for display
      const displayProgram = user.program === 'ONE_ZERO_ONE' ? '101' : 
                            user.program?.toString() || 'ALUMNI';
                            
      // Format the job applications
      const jobApplications = user.applications.map((app: Application) => {
        return {
          id: app.application_id,
          jobId: app.job_id,
          jobTitle: app.jobs?.title || '',
          company: app.jobs?.company || '',
          status: app.status.toLowerCase(),
          appliedDate: app.applied_at?.toISOString() || new Date().toISOString(),
        };
      });
      
      // Create the response object
      const applicant = {
        id: user.user_id,
        userId: user.user_id.toString(),
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.is_admin ? 'admin' : 'applicant',
        applications: user.applications.length,
        program: displayProgram,
        isArchived: user.is_archived,
        applicationStatusCount: {
          interested: user.applications.filter((app: Application) => app.status === 'INTERESTED').length,
          applied: user.applications.filter((app: Application) => app.status === 'APPLIED').length,
          phoneScreening: user.applications.filter((app: Application) => app.status === 'PHONE_SCREENING').length,
          interviewStage: user.applications.filter((app: Application) => app.status === 'INTERVIEW_STAGE').length,
          finalInterview: user.applications.filter((app: Application) => app.status === 'FINAL_INTERVIEW_STAGE').length,
          offerExtended: user.applications.filter((app: Application) => app.status === 'OFFER_EXTENDED').length,
          negotiation: user.applications.filter((app: Application) => app.status === 'NEGOTIATION').length,
          offerAccepted: user.applications.filter((app: Application) => app.status === 'OFFER_ACCEPTED').length,
          rejected: user.applications.filter((app: Application) => app.status === 'REJECTED').length
        }
      };
      
      return NextResponse.json({ applicant, jobApplications });
    }
    
    // For listing all applicants
    const status = searchParams.get('status');
    const program = searchParams.get('program');
    const dateFilter = searchParams.get('date');
    const search = searchParams.get('search');
    
    // Get new filter parameters
    const sort = searchParams.get('sort');
    const sortDir = searchParams.get('sortDir');
    const minApplications = searchParams.get('minApplications');
    const keywords = searchParams.get('keywords');
    const showInactive = searchParams.get('showInactive') === 'true';
    const showArchived = searchParams.get('showArchived') === 'true';
    
    console.error('Received filter params:', { 
      status, program, dateFilter, search,
      sort, sortDir, minApplications, keywords,
      showInactive, showArchived
    });
    
    // Build the filter object for Prisma
    const filter: {
      is_admin: boolean;
      is_active?: boolean;
      is_archived?: boolean;
      program?: { in: ProgramType[] };
      OR?: Array<{
        first_name?: { contains: string; mode: 'insensitive' };
        last_name?: { contains: string; mode: 'insensitive' };
        email?: { contains: string; mode: 'insensitive' };
      }>;
    } = {
      is_admin: false,
    };
    
    // Only include active users unless showInactive is true
    if (!showInactive) {
      filter.is_active = true;
    }
    
    // Only include non-archived users unless showArchived is true
    if (!showArchived) {
      filter.is_archived = false;
    }
    
    console.error('Using Prisma filter:', filter);
    
    // Add status filter if provided
    if (status) {
      // Note: In a real application, you'd store status in the database
      // For now, we'll handle this in memory after fetching
    }
    
    // Add program filter if provided
    if (program) {
      const programs = program.split(',');
      filter.program = {
        in: programs.map(p => {
          if (p === '101') {
            return ProgramType.ONE_ZERO_ONE;
          } else if (p === 'FOUNDATIONS') {
            return ProgramType.FOUNDATIONS;
          } else if (p === 'LIFTOFF') {
            return ProgramType.LIFTOFF;
          } else {
            return ProgramType.ALUMNI;
          }
        })
      };
    }
    
    // Add search filter if provided
    if (search) {
      filter.OR = [
        { first_name: { contains: search, mode: 'insensitive' } },
        { last_name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    // Add keywords search if provided
    if (keywords && keywords.trim() !== '') {
      // Add to existing OR array if it exists
      if (filter.OR) {
        filter.OR.push({ first_name: { contains: keywords, mode: 'insensitive' } });
        filter.OR.push({ last_name: { contains: keywords, mode: 'insensitive' } });
      } else {
        filter.OR = [
          { first_name: { contains: keywords, mode: 'insensitive' } },
          { last_name: { contains: keywords, mode: 'insensitive' } },
        ];
      }
    }
    
    // Determine sort order
    let orderBy: { [key: string]: 'asc' | 'desc' } | Array<{ [key: string]: 'asc' | 'desc' }> = { created_at: 'desc' };
    if (sort) {
      switch (sort) {
        case 'name':
          orderBy = [
            { first_name: (sortDir || 'asc') as 'asc' | 'desc' },
            { last_name: (sortDir || 'asc') as 'asc' | 'desc' }
          ];
          break;
        case 'newest':
          orderBy = { created_at: (sortDir || 'desc') as 'asc' | 'desc' };
          break;
        // For applications count, we'll sort in memory after fetching
      }
    }
    
    // Fetch users (applicants)
    try {
      console.error('Executing Prisma query with filter:', JSON.stringify(filter, null, 2));
      console.error('Order by:', JSON.stringify(orderBy, null, 2));
      
      const users = await prisma.users.findMany({
        where: filter,
        include: {
          applications: true
        },
        orderBy,
      }) as User[];
      
      console.error(`Retrieved ${users.length} users from database`);
      
      // Apply date filter if provided
      let filteredUsers = users;
      if (dateFilter && dateFilter !== 'all') {
        const now = new Date();
        const cutoffDate = new Date();
        
        switch (dateFilter) {
          case 'last7days':
            cutoffDate.setDate(now.getDate() - 7);
            break;
          case 'last30days':
            cutoffDate.setDate(now.getDate() - 30);
            break;
          case 'last90days':
            cutoffDate.setDate(now.getDate() - 90);
            break;
        }
        
        filteredUsers = users.filter((user: User) => 
          user.created_at && new Date(user.created_at) >= cutoffDate
        );
        
        console.error(`Date filter applied, now ${filteredUsers.length} users remaining`);
      }
      
      // Apply min applications filter in memory if provided
      if (minApplications && parseInt(minApplications) > 0) {
        filteredUsers = filteredUsers.filter((user: User) => 
          user.applications.length >= parseInt(minApplications)
        );
        
        console.error(`Min applications filter applied, now ${filteredUsers.length} users remaining`);
      }
      
      // Calculate stats
      const stats = {
        total: filteredUsers.length,
        unapplied: filteredUsers.filter((u: User) => u.applications.length === 0).length,
        interview: filteredUsers.filter((u: User) => u.applications.some((app: Application) => 
          ['PHONE_SCREENING', 'INTERVIEW_STAGE', 'FINAL_INTERVIEW_STAGE'].includes(app.status)
        )).length,
        placed: filteredUsers.filter((u: User) => u.applications.some((app: Application) => app.status === 'OFFER_ACCEPTED')).length,
        archived: filteredUsers.filter((u: User) => u.is_archived).length
      };
      
      // Format the response
      const applicants = filteredUsers.map((user: User) => {
        // Format program for display
        const displayProgram = user.program === 'ONE_ZERO_ONE' ? '101' : 
                              user.program?.toString() || 'ALUMNI';
        
        return {
          id: user.user_id,
          userId: user.user_id.toString(),
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          role: user.is_admin ? 'admin' : 'applicant',
          applications: user.applications.length,
          program: displayProgram,
          isArchived: user.is_archived,
          applicationStatusCount: {
            interested: user.applications.filter((app: Application) => app.status === 'INTERESTED').length,
            applied: user.applications.filter((app: Application) => app.status === 'APPLIED').length,
            phoneScreening: user.applications.filter((app: Application) => app.status === 'PHONE_SCREENING').length,
            interviewStage: user.applications.filter((app: Application) => app.status === 'INTERVIEW_STAGE').length,
            finalInterview: user.applications.filter((app: Application) => app.status === 'FINAL_INTERVIEW_STAGE').length,
            offerExtended: user.applications.filter((app: Application) => app.status === 'OFFER_EXTENDED').length,
            negotiation: user.applications.filter((app: Application) => app.status === 'NEGOTIATION').length,
            offerAccepted: user.applications.filter((app: Application) => app.status === 'OFFER_ACCEPTED').length,
            rejected: user.applications.filter((app: Application) => app.status === 'REJECTED').length
          }
        };
      });
      
      // Sort by applications count if requested
      if (sort === 'applications') {
        applicants.sort((a: { applications: number }, b: { applications: number }) => {
          return sortDir === 'asc' 
            ? a.applications - b.applications
            : b.applications - a.applications;
        });
      }
      
      console.error(`Returning ${applicants.length} applicants with stats`);
      
      return NextResponse.json({ applicants, stats });
    } catch (prismaError) {
      console.error('Prisma specific error:', prismaError);
      throw prismaError; // Re-throw to be caught by the outer try-catch
    }
  } catch (error: unknown) {
    console.error('Error fetching applicants:', error);
    
    // Safer type checking for Prisma errors
    const isPrismaError = 
      error !== null && 
      typeof error === 'object' && 
      'name' in error && 
      error.name === 'PrismaClientKnownRequestError' &&
      'code' in error &&
      'message' in error &&
      'meta' in error;
    
    if (isPrismaError) {
      const prismaError = error as unknown as { 
        code: string; 
        message: string; 
        meta: unknown;
      };
      console.error('Prisma Error Code:', prismaError.code);
      console.error('Prisma Error Message:', prismaError.message);
      console.error('Prisma Error Meta:', prismaError.meta);
    }
    
    // Safe extraction of error message
    const errorMessage = 
      error !== null && 
      typeof error === 'object' && 
      'message' in error && 
      typeof error.message === 'string'
        ? error.message
        : 'Unknown error';
        
    return NextResponse.json(
      { error: 'Failed to fetch applicants', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Log the incoming request
    console.log('Received applicant creation request');
    
    // Safely parse the request body
    let body;
    try {
      body = await request.json();
      console.log('Request body parsed successfully:', body);
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request body', details: 'Could not parse JSON data' },
        { status: 400 }
      );
    }
    
    // Validate required fields
    if (!body.email || !body.firstName || !body.lastName) {
      console.error('Missing required fields in request:', body);
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if email already exists
    const existingUser = await prisma.users.findFirst({
      where: {
        email: body.email
      }
    });
    
    if (existingUser) {
      console.log('Email already exists:', body.email);
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }
    
    // Format program to match the enum
    let program = body.program?.toUpperCase();
    if (program === '101') {
      program = 'ONE_ZERO_ONE';
    }
    
    // Use default password if none provided
    const password = body.password || 'Changeme';
    
    // Hash the password with bcrypt
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Create the user
    const newUser = await prisma.users.create({
      data: {
        email: body.email,
        first_name: body.firstName,
        last_name: body.lastName,
        password_hash: passwordHash,
        is_admin: body.isAdmin || false,
        program: program || 'ALUMNI',
        is_active: true,
        is_archived: false
      }
    });
    
    console.log('New user created successfully:', newUser.user_id);
    
    const responseData = {
      applicant: {
        id: newUser.user_id,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        role: newUser.is_admin ? 'admin' : 'applicant',
        applications: 0,
        status: 'unapplied',
        createdAt: newUser.created_at?.toISOString() || new Date().toISOString(),
        program: newUser.program === 'ONE_ZERO_ONE' ? '101' : newUser.program?.toString() || 'ALUMNI',
        isArchived: newUser.is_archived
      }
    };
    
    return NextResponse.json(responseData);
  } catch (error: unknown) {
    console.error('Error creating applicant:', error);
    
    // Safe extraction of error message
    const errorMessage = 
      error !== null && 
      typeof error === 'object' && 
      'message' in error && 
      typeof error.message === 'string'
        ? error.message
        : 'Unknown error';
        
    return NextResponse.json(
      { error: 'Failed to create applicant', details: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * PUT request handler for applicant archiving
 */
export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const isArchiveOperation = searchParams.get('archive') === 'true';
    
    if (!id) {
      return NextResponse.json(
        { error: 'Applicant ID is required' },
        { status: 400 }
      );
    }
    
    const userId = parseInt(id);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid applicant ID' },
        { status: 400 }
      );
    }
    
    // Get the request body for updates
    const body = await request.json();
    
    // If this is an archive operation, make sure isArchived is provided
    if (isArchiveOperation && typeof body.isArchived !== 'boolean') {
      return NextResponse.json(
        { error: 'isArchived must be a boolean value' },
        { status: 400 }
      );
    }
    
    // Update the user in the database
    const updateData: {
      first_name?: string;
      last_name?: string;
      is_active?: boolean;
      is_archived?: boolean;
      program?: ProgramType;
    } = {};
    
    // For archive operations
    if (isArchiveOperation) {
      updateData.is_archived = body.isArchived;
    } 
    // For general updates
    else {
      if (body.firstName) updateData.first_name = body.firstName;
      if (body.lastName) updateData.last_name = body.lastName;
      if (body.isActive !== undefined) updateData.is_active = body.isActive;
      if (body.program) {
        if (body.program === '101') {
          updateData.program = ProgramType.ONE_ZERO_ONE;
        } else {
          updateData.program = body.program.toUpperCase() as ProgramType;
        }
      }
    }
    
    const updatedUser = await prisma.users.update({
      where: { user_id: userId },
      data: updateData,
      include: {
        applications: true
      }
    });
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update applicant' },
        { status: 500 }
      );
    }
    
    // Format the response
    const responseData = {
      id: updatedUser.user_id,
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      isArchived: updatedUser.is_archived,
      program: updatedUser.program === 'ONE_ZERO_ONE' ? '101' : updatedUser.program?.toString() || 'ALUMNI',
      message: updatedUser.is_archived 
        ? 'Applicant archived successfully' 
        : 'Applicant unarchived successfully'
    };
    
    return NextResponse.json(responseData);
  } catch (error: unknown) {
    console.error('Error updating applicant:', error);
    
    // Safe extraction of error message
    const errorMessage = 
      error !== null && 
      typeof error === 'object' && 
      'message' in error && 
      typeof error.message === 'string'
        ? error.message
        : 'Unknown error';
        
    return NextResponse.json(
      { error: 'Failed to update applicant', details: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * DELETE request handler for removing dummy users or specific users
 * Can be called with ?all=true to remove all non-admin users
 * Or with ?id=123 to remove a specific user
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const removeAllDummy = searchParams.get('all') === 'true';
    const userId = searchParams.get('id');

    if (removeAllDummy) {
      // Remove all non-admin users and their related data
      
      // First, delete all applications from non-admin users
      await prisma.applications.deleteMany({
        where: {
          users: {
            is_admin: false
          }
        }
      });
      
      // Then delete all resumes from non-admin users
      await prisma.resumes.deleteMany({
        where: {
          users: {
            is_admin: false
          }
        }
      });
      
      // Delete all interviews for non-admin users
      await prisma.interviews.deleteMany({
        where: {
          users: {
            is_admin: false
          }
        }
      });
      
      // Finally delete all non-admin users
      const { count } = await prisma.users.deleteMany({
        where: {
          is_admin: false
        }
      });
      
      return NextResponse.json({
        success: true,
        message: `Successfully removed ${count} dummy users and their related data`,
        count
      });
    } else if (userId) {
      // Delete a specific user and their related data
      const id = parseInt(userId);
      
      if (isNaN(id)) {
        return NextResponse.json(
          { error: 'Invalid user ID' },
          { status: 400 }
        );
      }
      
      // Check if this is an admin user
      const user = await prisma.users.findUnique({
        where: { user_id: id }
      });
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      if (user.is_admin) {
        return NextResponse.json(
          { error: 'Cannot delete admin users' },
          { status: 400 }
        );
      }
      
      // Delete all applications from this user
      await prisma.applications.deleteMany({
        where: { user_id: id }
      });
      
      // Delete all resumes from this user
      await prisma.resumes.deleteMany({
        where: { user_id: id }
      });
      
      // Delete all interviews for this user
      await prisma.interviews.deleteMany({
        where: { user_id: id }
      });
      
      // Finally delete the user
      await prisma.users.delete({
        where: { user_id: id }
      });
      
      return NextResponse.json({
        success: true,
        message: `Successfully removed user ${id}`
      });
    } else {
      return NextResponse.json(
        { error: 'Missing required parameters: either "all=true" or "id={userId}"' },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error('Error deleting users:', error);
    
    // Safe extraction of error message
    const errorMessage = 
      error !== null && 
      typeof error === 'object' && 
      'message' in error && 
      typeof error.message === 'string'
        ? error.message
        : 'Unknown error';
        
    return NextResponse.json(
      { error: 'Failed to delete users', details: errorMessage },
      { status: 500 }
    );
  }
} 