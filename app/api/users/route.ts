import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from "@/lib/auth";

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
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'me' | 'single' | 'all'
    const userId = searchParams.get('userId');

    // Get current user's profile
    if (type === 'me') {
      const session = await auth.getSession(request);
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const user = await prisma.users.findUnique({
        where: { user_id: parseInt(session.user.id) },
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

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user.user_id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          isAdmin: user.is_admin ?? false,
          program: user.program ?? '',
          createdAt: user.created_at,
        }
      });
    }

    // Get specific user by ID
    if (type === 'single' && userId) {
      const user = await prisma.users.findUnique({
        where: { user_id: parseInt(userId) },
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

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user.user_id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          isAdmin: user.is_admin ?? false,
          program: user.program ?? '',
          createdAt: user.created_at,
        }
      });
    }

    // Get all users (default)
    const users = await prisma.users.findMany({
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
      users: users.map((user: User) => ({
        id: user.user_id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        isAdmin: user.is_admin ?? false,
        program: user.program ?? '',
        createdAt: user.created_at,
      }))
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
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