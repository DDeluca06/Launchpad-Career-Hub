import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcrypt';

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

    // Return success
    return NextResponse.json({
      success: true,
      user: {
        id: user.user_id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
} 