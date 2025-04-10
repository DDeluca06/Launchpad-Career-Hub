import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
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
      program?: { in: string[] };
      OR?: Array<{
        first_name?: { contains: string; mode: 'insensitive' };
        last_name?: { contains: string; mode: 'insensitive' };
        username?: { contains: string; mode: 'insensitive' };
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
        in: programs.map(p => p === '101' ? 'ONE_ZERO_ONE' : p.toUpperCase())
      };
    }
    
    // Add search filter if provided
    if (search) {
      filter.OR = [
        { first_name: { contains: search, mode: 'insensitive' } },
        { last_name: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
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
          applications: true,
        },
        orderBy,
      });
      
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
        
        filteredUsers = users.filter((user: { created_at: Date | null }) => 
          user.created_at && new Date(user.created_at) >= cutoffDate
        );
        
        console.error(`Date filter applied, now ${filteredUsers.length} users remaining`);
      }
      
      // Apply min applications filter in memory if provided
      if (minApplications && parseInt(minApplications) > 0) {
        filteredUsers = filteredUsers.filter((user: { applications: { length: number } }) => 
          user.applications.length >= parseInt(minApplications)
        );
        
        console.error(`Min applications filter applied, now ${filteredUsers.length} users remaining`);
      }
      
      // Transform data to match the frontend expected format
      const applicants = filteredUsers.map((user: {
        user_id: number;
        username: string;
        first_name: string;
        last_name: string;
        is_admin: boolean;
        is_archived: boolean;
        applications: { status: string }[];
        program: string | null;
        created_at: Date | null;
      }) => {
        // Determine status based on applications and archived state
        let status;
        if (user.is_archived) {
          status = "archived";
        } else if (user.applications.length === 0) {
          status = "unapplied";
        } else {
          // Check if any applications are in interview process
          const hasInterviewApplications = user.applications.some(app => 
            ['PHONE_SCREENING', 'INTERVIEW_STAGE', 'FINAL_INTERVIEW_STAGE'].includes(app.status)
          );
          
          // Check if any applications have been accepted
          const hasAcceptedOffer = user.applications.some(app => 
            app.status === 'OFFER_ACCEPTED'
          );
          
          if (hasAcceptedOffer) {
            status = "placed";
          } else if (hasInterviewApplications) {
            status = "interview";
          } else {
            status = "unapplied";
          }
        }
        
        // Format program for display
        const displayProgram = user.program === 'ONE_ZERO_ONE' ? '101' : 
                              user.program?.toString() || 'ALUMNI';
        
        return {
          id: user.user_id,
          userId: user.username,
          firstName: user.first_name,
          lastName: user.last_name,
          email: `${user.username}@example.com`, // In a real app, you'd have the email stored
          role: user.is_admin ? 'admin' : 'applicant',
          applications: user.applications.length,
          status: status,
          createdAt: user.created_at?.toISOString() || new Date().toISOString(),
          program: displayProgram,
          isArchived: user.is_archived
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
      
      // Calculate stats
      const stats = {
        total: applicants.length,
        unapplied: applicants.filter((a: { status: string }) => a.status === 'unapplied').length,
        interview: applicants.filter((a: { status: string }) => a.status === 'interview').length,
        placed: applicants.filter((a: { status: string }) => a.status === 'placed').length,
        archived: applicants.filter((a: { status: string }) => a.status === 'archived').length,
      };
      
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
    const body = await request.json();
    const { firstName, lastName, password, program } = body;
    
    // Validate required fields
    if (!firstName || !lastName || !password) {
      return NextResponse.json(
        { error: 'First name, last name, and password are required' },
        { status: 400 }
      );
    }
    
    // Get the last user to determine the next ID
    const lastUser = await prisma.users.findFirst({
      orderBy: {
        user_id: 'desc',
      },
    });
    
    const nextUserId = (lastUser?.user_id || 0) + 1;
    const userIdWithPrefix = `lp${nextUserId.toString().padStart(4, '0')}`;
    
    // Convert program string to ProgramType enum
    const programType = program === '101' ? 'ONE_ZERO_ONE' : program.toUpperCase();
    
    // Create the new user
    const newUser = await prisma.users.create({
      data: {
        username: userIdWithPrefix,
        first_name: firstName,
        last_name: lastName,
        password_hash: password, // In production, you should hash this password
        is_admin: false,
        is_active: true,
        program: programType as 'ONE_ZERO_ONE' | 'LIFTOFF' | 'FOUNDATIONS' | 'ALUMNI', // Use specific union type
      },
    });
    
    return NextResponse.json({
      id: newUser.user_id,
      userId: newUser.username,
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      program: program,
      createdAt: newUser.created_at?.toISOString(),
    });
  } catch (error) {
    console.error('Error creating applicant:', error);
    return NextResponse.json(
      { error: 'Failed to create applicant' },
      { status: 500 }
    );
  }
} 