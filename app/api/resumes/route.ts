// app/api/resumes/route.ts (App Router)
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  console.log("API: Resume endpoint called");
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    console.log("API: userId from params:", userId);
    
    if (!userId) {
      console.log("API: No userId provided");
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }
    
    // Query the database for the user's resumes
    console.log("API: Querying database for resumes with userId:", userId);
    const resumes = await prisma.resumes.findMany({
      where: {
        user_id: parseInt(userId)
      },
      orderBy: {
        created_at: 'desc'
      }
    });
    
    console.log("API: Found resumes:", resumes.length, resumes);
    
    // Return the resumes
    return NextResponse.json({
      success: true,
      resumes
    });
  } catch (error) {
    console.error("API: Error fetching resumes:", error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch resumes: ' + (error.message || error)
    }, { status: 500 });
  }
}