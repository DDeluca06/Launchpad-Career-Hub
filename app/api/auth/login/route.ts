import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';


// Handler for login
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, loginType } = body;
    
    if (!email || !password) {
      return NextResponse.json({
        error: 'Email and password are required'
      }, { status: 400 });
    }

    // Determine which table to query based on login type
    const isAdminLogin = loginType === 'admin';
    
    // Use type-safe Prisma query
    const user = await prisma.users.findFirst({
      where: {
        AND: [
          { email: { equals: email } },
          { is_admin: isAdminLogin },
          { is_active: true },
          { is_archived: false }
        ]
      }
    });
    
    if (!user) {
      return NextResponse.json({
        error: isAdminLogin 
          ? 'Invalid admin credentials' 
          : 'Invalid student credentials'
      }, { status: 401 });
    }
    
    // Try password verification
    try {
      // Use async comparison for better security
      const passwordValid = await bcrypt.compare(password, user.password_hash);
      
      if (!passwordValid) {
        return NextResponse.json({
          error: 'Invalid credentials'
        }, { status: 401 });
      }

      // Verify login type matches user type
      if (isAdminLogin !== user.is_admin) {
        return NextResponse.json({ 
          error: isAdminLogin 
            ? 'This account is not an admin account' 
            : 'This account is not a student account'
        }, { status: 403 });
      }
    } catch (authError) {
      console.error('Authentication error:', authError);
      return NextResponse.json({
        error: 'Authentication error'
      }, { status: 500 });
    }
    
    // Create a session token with more details
    const sessionData = {
      id: user.user_id,
      isAdmin: user.is_admin
    };

    // Convert to JSON string and then base64 encode
    const sessionJson = JSON.stringify(sessionData);
    const sessionId = Buffer.from(sessionJson).toString('base64');

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.user_id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        isAdmin: user.is_admin,
        createdAt: user.created_at,
      }
    });
    
    // Set cookie with secure settings
    response.cookies.set('session-id', sessionId, {
      httpOnly: true, 
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production', // Only use HTTPS in production
    });
    
    return response;
    
  } catch (error) {
    console.error('Login failed:', error);
    return NextResponse.json({ 
      error: 'Login failed. Please try again.' 
    }, { status: 500 });
  }
} 