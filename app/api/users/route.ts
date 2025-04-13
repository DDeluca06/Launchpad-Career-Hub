import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from "@/lib/auth";
import bcrypt from 'bcryptjs';
import { NextRequest } from "next/server";

// Define the User interface for type safety
interface User {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_admin: boolean | null;
  program: string | null;
  created_at: Date | null;
}

// GET: Fetch users (all users, current user, or specific user)
export async function GET(req: NextRequest) {
  try {
    // Check if the request is from an admin
    const session = await auth.getSession(req);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Fetch all users with their basic data
    const users = await prisma.users.findMany({
      select: {
        user_id: true,
        email: true,
        first_name: true,
        last_name: true,
        is_admin: true,
        program: true,
        applications: {
          select: {
            application_id: true,
            job_id: true,
            status: true,
            position: true,
            jobs: {
              select: {
                title: true,
                company: true
              }
            }
          }
        }
      },
      orderBy: {
        first_name: 'asc'
      }
    });
    
    // Transform data for UI
    const transformedUsers = users.map(user => ({
      id: user.user_id,
      email: user.email,
      firstName: user.first_name || "",
      lastName: user.last_name || "",
      isAdmin: user.is_admin ?? false,
      program: user.program || "",
      applications: user.applications.map(app => ({
        id: app.application_id,
        jobId: app.job_id,
        jobTitle: app.jobs.title,
        company: app.jobs.company,
        status: app.status,
        notes: "Notes not available - Prisma client may need to be regenerated"
      }))
    }));
    
    return NextResponse.json({
      success: true,
      users: transformedUsers
    });
    
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// PUT: Update user profile
export async function PUT(request: Request) {
  try {
    const session = await auth.getSession(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const userId = parseInt(session.user.id);

    // Validate required fields
    if (!body.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await prisma.users.update({
      where: { user_id: userId },
      data: {
        email: body.email,
        first_name: body.firstName,
        last_name: body.lastName,
        program: body.program,
      },
      select: {
        user_id: true,
        email: true,
        first_name: true,
        last_name: true,
        is_admin: true,
        program: true,
        created_at: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.user_id,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        isAdmin: updatedUser.is_admin ?? false,
        program: updatedUser.program ?? '',
        createdAt: updatedUser.created_at,
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// POST: Create a new user (admin only)
export async function POST(request: Request) {
  try {
    // Verify that the current user is an admin
    const session = await auth.getSession(request);
    if (!session?.user?.id || !session?.user?.isAdmin) {
      return NextResponse.json({ 
        success: false, 
        error: "Unauthorized. Only admins can create new users."
      }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email) {
      return NextResponse.json(
        { success: false, error: 'Required fields: firstName, lastName, and email' },
        { status: 400 }
      );
    }

    // Use default password if none provided
    const password = body.password || 'Changeme';

    // Check if email already exists
    const existingUser = await prisma.users.findUnique({
      where: { email: body.email }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'A user with this email already exists' },
        { status: 409 }
      );
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    const newUser = await prisma.users.create({
      data: {
        email: body.email,
        first_name: body.firstName,
        last_name: body.lastName,
        password_hash: hashedPassword,
        program: body.program === "101" ? "ONE_ZERO_ONE" : body.program,
        is_admin: false, // New users are not admins by default
        lp_id: 0, // Default lp_id, adjust if needed
      },
      select: {
        user_id: true,
        email: true,
        first_name: true,
        last_name: true,
        is_admin: true,
        program: true,
        created_at: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.user_id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        isAdmin: newUser.is_admin ?? false,
        program: newUser.program,
        createdAt: newUser.created_at,
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user. Please try again.' },
      { status: 500 }
    );
  }
} 