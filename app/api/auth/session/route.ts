import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Handler for session requests
export async function GET(request: Request) {
  try {
    console.error("Session API called");
    const session = await auth.getSession(request);
    console.error("Auth session result:", session);
    
    if (!session?.user?.id) {
      console.error("No user ID in session");
      return NextResponse.json({ user: null });
    }
    
    // Get user details from database
    const userId = parseInt(session.user.id);
    
    if (isNaN(userId)) {
      console.error("Invalid user ID format:", session.user.id);
      return NextResponse.json({ user: null });
    }
    
    console.error("Looking up user with ID:", userId);
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
      console.error("User not found in database");
      return NextResponse.json({ user: null });
    }
    
    console.error("User found:", user.email);
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