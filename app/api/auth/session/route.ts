import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Handler for session requests
export async function GET(request: Request) {
  try {
    const session = await auth.getSession(request);
    
    if (!session?.user?.id) {
      return NextResponse.json({ user: null });
    }
    
    // Get user details from database
    const userId = parseInt(session.user.id);
    
    if (isNaN(userId)) {
      return NextResponse.json({ user: null });
    }
    
    const user = await prisma.users.findUnique({
      where: { 
        user_id: userId
      },
      select: {
        user_id: true,
        email: true,
        first_name: true,
        last_name: true,
        is_admin: true,
      },
    });
    
    if (!user) {
      return NextResponse.json({ user: null });
    }
    
    // Return user session
    return NextResponse.json({
      user: {
        id: user.user_id.toString(),
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        isAdmin: user.is_admin || false,
      }
    });
  } catch (error) {
    console.error('Error retrieving session:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
} 