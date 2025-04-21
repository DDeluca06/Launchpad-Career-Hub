import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

// GET: Fetch a specific user by ID
export async function GET(req: NextRequest) {
  try {
    // Get userId from URL params
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'User ID is required' 
      }, { status: 400 });
    }
    
    // Check authentication - either the user is fetching their own data or is an admin
    const session = await auth.getSession(req);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Only allow users to access their own data or admins to access any data
    const requestedUserId = parseInt(userId);
    const currentUserId = parseInt(session.user.id);
    
    if (requestedUserId !== currentUserId && !session.user.isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to access this user's data" },
        { status: 403 }
      );
    }
    
    // Fetch the user data
    const user = await prisma.users.findUnique({
      where: {
        user_id: requestedUserId
      },
      select: {
        user_id: true,
        email: true,
        first_name: true,
        last_name: true,
        program: true,
        created_at: true
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user: {
        user_id: user.user_id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        program: user.program
      }
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}