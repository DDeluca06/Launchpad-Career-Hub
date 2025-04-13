import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { prisma } from '@/lib/prisma';


// Handler for signup (registration)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, program } = body;
    
    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({
        error: 'All fields are required'
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email }
    });
    if (existingUser) {
      return NextResponse.json({
        error: 'User with this email already exists'
      }, { status: 409 });
    }

    // Hash password
    const passwordHash = await hash(password, 10);
    // Create user
    const user = await prisma.users.create({
      data: {
        email,
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
        program: program || null,
        is_admin: false,
        is_active: true,
        lp_id: 0,
      }
    });
    
    // Create a session token for the new user
    const sessionData = {
      id: user.user_id,
      isAdmin: false
    };

    // Convert to JSON string and then base64 encode
    const sessionJson = JSON.stringify(sessionData);
    const sessionId = Buffer.from(sessionJson).toString('base64');

    // Create response with session cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.user_id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      }
    }, { status: 201 });
    
    // Set cookie directly on the response
    response.cookies.set('session-id', sessionId, {
      httpOnly: true, 
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
      sameSite: 'lax',
    });
    
    return response;
  } catch (error: unknown) {
    console.error('Error during user registration:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
} 