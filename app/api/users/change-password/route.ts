import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from "@/lib/auth";
import bcrypt from 'bcryptjs';

/**
 * API endpoint for users to change their own password
 * Requires current password verification for security
 */
export async function POST(request: Request) {
  try {
    // Get the current user from session
    const session = await auth.getSession(request);
    if (!session?.user?.id) {
      return NextResponse.json({ 
        success: false, 
        error: "Unauthorized. Please log in to change your password."
      }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.currentPassword || !body.newPassword) {
      return NextResponse.json(
        { success: false, error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    // Find user
    const userId = parseInt(session.user.id);
    const user = await prisma.users.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        password_hash: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(body.currentPassword, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.newPassword, salt);

    // Update user's password
    await prisma.users.update({
      where: { user_id: userId },
      data: {
        password_hash: hashedPassword
      },
    });

    return NextResponse.json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to change password. Please try again.' },
      { status: 500 }
    );
  }
} 