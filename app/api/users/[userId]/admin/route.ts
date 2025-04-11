import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
): Promise<Response> {
  try {
    const { isAdmin } = await request.json();
    const resolvedParams = await params;
    const userId = parseInt(resolvedParams.userId);

    console.warn('Updating admin status:', { userId, isAdmin });

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // First check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { user_id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const updatedUser = await prisma.users.update({
      where: { user_id: userId },
      data: { is_admin: isAdmin },
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
    const mappedUser = {
      user_id: updatedUser.user_id,
      username: updatedUser.username,
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      isAdmin: updatedUser.is_admin, // Map is_admin to isAdmin
      program: updatedUser.program,
      created_at: updatedUser.created_at,
    };

    console.warn('Successfully updated user:', mappedUser);

    return NextResponse.json(mappedUser);
  } catch (error) {
    console.error('Detailed error updating admin status:', error);
    
    // Check if it's a Prisma error
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to update admin status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 