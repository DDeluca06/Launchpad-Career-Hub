import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid applicant ID' },
        { status: 400 }
      );
    }
    
    // Get the request body
    const body = await request.json();
    const { isArchived } = body;
    
    // Check if isArchived is provided and is a boolean
    if (typeof isArchived !== 'boolean') {
      return NextResponse.json(
        { error: 'isArchived must be a boolean value' },
        { status: 400 }
      );
    }
    
    // Update the user in the database
    const updatedUser = await prisma.users.update({
      where: { user_id: id },
      data: { is_archived: isArchived },
    });
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update applicant' },
        { status: 500 }
      );
    }
    
    // Return the updated user info
    return NextResponse.json({
      id: updatedUser.user_id,
      userId: updatedUser.username,
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      isArchived: updatedUser.is_archived,
      message: isArchived ? 'Applicant archived successfully' : 'Applicant unarchived successfully'
    });
  } catch (error: unknown) {
    console.error('Error archiving applicant:', error);
    
    // Safe extraction of error message
    const errorMessage = 
      error !== null && 
      typeof error === 'object' && 
      'message' in error && 
      typeof error.message === 'string'
        ? error.message
        : 'Unknown error';
        
    return NextResponse.json(
      { error: 'Failed to archive applicant', details: errorMessage },
      { status: 500 }
    );
  }
} 