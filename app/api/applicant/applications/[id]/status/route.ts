import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get the current session
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the request body
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    // Verify the application belongs to the current user
    const application = await prisma.application.findFirst({
      where: {
        id: params.id,
        applicant: {
          email: session.user.email,
        },
      },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Update the application status
    const updatedApplication = await prisma.application.update({
      where: {
        id: params.id,
      },
      data: {
        status,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error('Update application status error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 