import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import bcrypt from 'bcrypt';

// API endpoint to reset applicant passwords
// Only accessible by admins
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
    const { userId } = body;
    
    // Validate required fields
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.users.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    // Set default password and hash it
    const defaultPassword = 'Changeme';
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(defaultPassword, saltRounds);

    // Update the user's password
    await prisma.users.update({
      where: { user_id: userId },
      data: { password_hash: passwordHash },
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset password' },
      { status: 500 }
    );
  }
} 