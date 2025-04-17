import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from "@/lib/auth";
import bcrypt from 'bcryptjs';

/**
 * API endpoint for admin users to reset another user's password
 */
export async function POST(request: Request) {
  try {
    // Verify that the current user is an admin
    const session = await auth.getSession(request);
    if (!session?.user?.id || !session?.user?.isAdmin) {
      return NextResponse.json({ 
        success: false, 
        error: "Unauthorized. Only admins can reset passwords."
      }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Use default password if none provided
    const newPassword = body.newPassword || 'Changeme';

    // Find user
    const user = await prisma.users.findUnique({
      where: { user_id: parseInt(body.userId.toString()) },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password
    await prisma.users.update({
      where: { user_id: parseInt(body.userId.toString()) },
      data: {
        password_hash: hashedPassword
      },
    });

    return NextResponse.json({
      success: true,
      message: "Password reset successfully"
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset password. Please try again.' },
      { status: 500 }
    );
  }
} 