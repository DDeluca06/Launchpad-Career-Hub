import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

// Handler for login
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { email, password } = body;
    
    if (!email || !password) {
      return NextResponse.json({
        error: 'Email and password are required'
      }, { status: 400 });
    }

    // Check if any users exist
    const userCount = await prisma.users.count();
    
    if (userCount === 0) {
      return NextResponse.json({
        error: 'No users in database. Database needs to be seeded.'
      }, { status: 500 });
    }

    // Check if the user exists in our database
    const user = await prisma.users.findUnique({
      where: { email },
      select: {
        user_id: true,
        email: true,
        first_name: true,
        last_name: true,
        is_admin: true,
        password_hash: true,
      },
    });
    
    if (!user) {
      return NextResponse.json({
        error: 'Invalid credentials'
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
            
      // Skip loginType check for now to debug password issue
      /*
      // If login type doesn't match user type, return error
      if ((isAdmin && isStudentLogin) || (!isAdmin && !isStudentLogin)) {
        return NextResponse.json(
          { 
            error: isStudentLogin 
              ? 'This account is not a student account' 
              : 'This account is not an admin account'
          }, 
          { status: 403 }
        );
      }
      */
    } catch (authError) {
      console.error('Authentication error:', authError);
      return NextResponse.json({
        error: 'Authentication error'
      }, { status: 500 });
    }
    
    // Create a session token with more details
    const sessionData = {
      id: user.user_id,
      isAdmin: user.is_admin || false
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
        isAdmin: user.is_admin || false,
      }
    });
    
    // Set cookie directly on the response
    response.cookies.set('session-id', sessionId, {
      httpOnly: true, 
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
      sameSite: 'lax', // Changed from 'strict' to allow redirects
    });
    
    return response;
    
  } catch (error) {
    console.error('Login failed:', error);
    return NextResponse.json({ 
      error: 'Login failed. Please check your credentials and try again.' 
    }, { status: 500 });
  }
} 