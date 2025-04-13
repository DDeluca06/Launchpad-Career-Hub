import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET request handler to fetch resumes
 * Can get a single resume by id or list all resumes for a user
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Check if this is a request for a single resume
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    
    if (id) {
      const resumeId = parseInt(id);
      
      if (isNaN(resumeId)) {
        return NextResponse.json(
          { success: false, error: 'Invalid resume ID' },
          { status: 400 }
        );
      }

      // Fetch the resume
      const resume = await prisma.resumes.findUnique({
        where: { resume_id: resumeId }
      });

      if (!resume) {
        return NextResponse.json(
          { success: false, error: 'Resume not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, resume });
    }
    
    // If userId is provided, get all resumes for that user
    if (userId) {
      const userIdNum = parseInt(userId);
      
      if (isNaN(userIdNum)) {
        return NextResponse.json(
          { success: false, error: 'Invalid user ID' },
          { status: 400 }
        );
      }

      const resumes = await prisma.resumes.findMany({
        where: { user_id: userIdNum },
        orderBy: {
          created_at: 'desc'
        }
      });

      return NextResponse.json({ success: true, resumes });
    }
    
    // If no specific parameters, return error
    return NextResponse.json(
      { success: false, error: 'Missing required parameters' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch resumes' },
      { status: 500 }
    );
  }
}

/**
 * POST request handler to create a new resume
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.user_id || !body.file_path || !body.file_name) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // If this is the first resume or is_default is true, handle default status
    if (body.is_default) {
      // Reset any existing default resumes for this user
      await prisma.resumes.updateMany({
        where: {
          user_id: body.user_id,
          is_default: true
        },
        data: {
          is_default: false
        }
      });
    }

    // Create the resume
    const resume = await prisma.resumes.create({
      data: {
        user_id: body.user_id,
        file_path: body.file_path,
        file_name: body.file_name,
        is_default: body.is_default || false
      }
    });

    return NextResponse.json({ success: true, resume });
  } catch (error) {
    console.error('Error creating resume:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create resume' },
      { status: 500 }
    );
  }
}

/**
 * PUT request handler to update an existing resume
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.resume_id) {
      return NextResponse.json(
        { success: false, error: 'Resume ID is required' },
        { status: 400 }
      );
    }

    // If setting this resume as default, reset other defaults
    if (body.is_default) {
      await prisma.resumes.updateMany({
        where: {
          user_id: body.user_id,
          resume_id: { not: body.resume_id },
          is_default: true
        },
        data: {
          is_default: false
        }
      });
    }

    // Update the resume
    const resume = await prisma.resumes.update({
      where: { resume_id: body.resume_id },
      data: {
        file_path: body.file_path,
        file_name: body.file_name,
        is_default: body.is_default
      }
    });

    return NextResponse.json({ success: true, resume });
  } catch (error) {
    console.error('Error updating resume:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update resume' },
      { status: 500 }
    );
  }
}

/**
 * DELETE request handler to delete a resume
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Resume ID is required' },
        { status: 400 }
      );
    }

    const resumeId = parseInt(id);
    
    if (isNaN(resumeId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid resume ID' },
        { status: 400 }
      );
    }

    // Get the resume to check if it's the default
    const resume = await prisma.resumes.findUnique({
      where: { resume_id: resumeId }
    });

    if (!resume) {
      return NextResponse.json(
        { success: false, error: 'Resume not found' },
        { status: 404 }
      );
    }

    // Delete the resume
    await prisma.resumes.delete({
      where: { resume_id: resumeId }
    });

    // If this was the default resume, set a new default if any resumes remain
    if (resume.is_default) {
      const remainingResumes = await prisma.resumes.findMany({
        where: { user_id: resume.user_id },
        orderBy: { created_at: 'desc' },
        take: 1
      });

      if (remainingResumes.length > 0) {
        await prisma.resumes.update({
          where: { resume_id: remainingResumes[0].resume_id },
          data: { is_default: true }
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Error deleting resume:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete resume' },
      { status: 500 }
    );
  }
}
