import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.warn('Attempting to fetch users from database...');
    
    const users = await prisma.users.findMany({
      select: {
        user_id: true,
        username: true,
        first_name: true,
        last_name: true,
        is_admin: true,
        program: true,
        created_at: true,
      },
    });

    // Map database fields to frontend fields
    const mappedUsers = users.map((user: {
      user_id: number;
      username: string;
      first_name: string;
      last_name: string;
      is_admin: boolean | null;
      program: string | null;
      created_at: Date | null;
    }) => ({
      user_id: user.user_id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      isAdmin: user.is_admin ?? false, // Map is_admin to isAdmin, defaulting to false if null
      program: user.program ?? '', // Map program, defaulting to empty string if null
      created_at: user.created_at?.toISOString() ?? '', // Convert Date to ISO string, defaulting to empty string if null
    }));

    console.warn(`Found ${mappedUsers.length} users in database`);
    
    if (mappedUsers.length === 0) {
      console.warn('No users found in database');
    }

    return NextResponse.json(mappedUsers);
  } catch (error) {
    console.error('Detailed error fetching users:', error);
    
    // Check if it's a Prisma error
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch users',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 