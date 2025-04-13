import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Handler for session requests
export async function GET(request: Request) {
  try {
    const session = await auth.getSession(request);
    console.log('Session from auth.getSession:', session);
    
    if (!session?.user?.id) {
      console.log('No user ID in session');
      return NextResponse.json({ user: null });
    }
    
    // Get user details from database
    const userId = parseInt(session.user.id);
    console.log('Parsed user ID:', userId);
    
    if (isNaN(userId)) {
      console.log('Invalid user ID - not a number');
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
    
    console.log('User from database:', user ? 'found' : 'not found');
    
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
    console.error('Error getting session:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
} 