import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from "@/lib/auth";

// POST: Update user admin status
export async function POST(request: Request) {
  try {
    // Verify the current user is an admin
    const session = await auth.getSession(request);
    if (!session?.user?.id || !session?.user?.isAdmin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized - Admin access required' 
      }, { status: 401 });
    }

    // Get the request body
    const body = await request.json();
    const { userId, isAdmin } = body;
    
    // Validate required fields
    if (userId === undefined || isAdmin === undefined) {
      return NextResponse.json({
        success: false,
        error: 'UserId and isAdmin status are required'
      }, { status: 400 });
    }

    // Don't allow users to revoke their own admin access
    if (parseInt(session.user.id) === userId && !isAdmin) {
      return NextResponse.json({
        success: false,
        error: 'You cannot revoke your own admin access'
      }, { status: 400 });
    }

    // Update the user's admin status
    const updatedUser = await prisma.users.update({
      where: { user_id: userId },
      data: { is_admin: isAdmin },
      select: {
        user_id: true,
        email: true,
        first_name: true,
        last_name: true,
        is_admin: true,
        program: true,
      },
    });

    // Return success response
    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.user_id,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        isAdmin: updatedUser.is_admin || false,
        program: updatedUser.program || '',
      }
    });
  } catch (error) {
    console.error('Error updating admin status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update admin status' },
      { status: 500 }
    );
  }
} 