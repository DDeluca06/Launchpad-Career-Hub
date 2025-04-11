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
      is_admin: boolean;
      program: string;
      created_at: string;
    }) => ({
      user_id: user.user_id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      isAdmin: user.is_admin, // Map is_admin to isAdmin
      program: user.program,
      created_at: user.created_at,
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