import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type BulkUploadItem = {
  firstName: string;
  lastName: string;
  email: string;
  program: string;
  password?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { users } = body;
    
    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid user data provided' },
        { status: 400 }
      );
    }
    
    // Get the last user to determine the next ID
    const lastUser = await prisma.users.findFirst({
      orderBy: {
        user_id: 'desc',
      },
    });
    
    let nextUserId = (lastUser?.user_id || 0) + 1;
    const newUsers = [];
    const errors = [];
    
    // Process each user in the array
    for (const user of users as BulkUploadItem[]) {
      try {
        const { firstName, lastName, email, program, password = 'password123' } = user;
        
        // Basic validation
        if (!firstName || !lastName || !program) {
          errors.push(`Missing required fields for user: ${firstName} ${lastName}`);
          continue;
        }
        
        // Validate program
        if (program !== '101' && program !== 'LIFTOFF') {
          errors.push(`Invalid program for user: ${firstName} ${lastName}. Must be 101 or LIFTOFF.`);
          continue;
        }
        
        // Create user ID with prefix
        const userIdWithPrefix = `lp${nextUserId.toString().padStart(4, '0')}`;
        
        // Convert program string to ProgramType enum
        const programType = program === '101' ? 'ONE_ZERO_ONE' : program.toUpperCase();
        
        // Create the new user
        const newUser = await prisma.users.create({
          data: {
            username: userIdWithPrefix,
            first_name: firstName,
            last_name: lastName,
            password_hash: password,
            is_admin: false,
            is_active: true,
            program: programType as any, // Type assertion to handle conversion
          },
        });
        
        newUsers.push({
          id: newUser.user_id,
          userId: newUser.username,
          firstName: newUser.first_name,
          lastName: newUser.last_name,
          program: program,
          createdAt: newUser.created_at?.toISOString(),
        });
        
        nextUserId++;
      } catch (err) {
        errors.push(`Error processing user: ${user.firstName} ${user.lastName}`);
        console.error('Error creating individual user during bulk upload:', err);
      }
    }
    
    return NextResponse.json({
      success: true,
      usersCreated: newUsers.length,
      users: newUsers,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Error in bulk user upload:', error);
    return NextResponse.json(
      { error: 'Failed to process bulk upload' },
      { status: 500 }
    );
  }
} 