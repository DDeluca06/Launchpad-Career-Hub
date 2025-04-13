import { NextResponse } from 'next/server';
import { validateApplicantDatabase } from '@/lib/db-validation';
import { getServerSession } from 'next-auth';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * API endpoint to check the database status
 * Requires admin authentication
 */
export async function GET(request: Request) {
  try {
    // Authenticate - only admins should be able to access this
    let isAdmin = false;
    
    // Try NextAuth first
    const session = await getServerSession();
    if (session?.user?.email) {
      const user = await prisma.users.findFirst({
        where: { 
          email: session.user.email,
          is_admin: true
        }
      });
      
      if (user) {
        isAdmin = true;
      }
    }
    
    // Try custom auth if NextAuth fails
    if (!isAdmin) {
      const customSession = await auth.getSession(request);
      if (customSession?.user?.id && customSession.user.isAdmin) {
        isAdmin = true;
      }
    }
    
    // Only allow admins to check database status
    if (!isAdmin && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Run validation
    const validationResult = await validateApplicantDatabase();
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: {
        ...validationResult,
        // Remove sensitive stack traces in production
        ...(process.env.NODE_ENV === 'production' && validationResult.schema?.stack 
            ? { schema: { ...validationResult.schema, stack: undefined } } 
            : {})
      }
    });
  } catch (error) {
    console.error('Error checking database status:', error);
    return NextResponse.json({ 
      error: 'Failed to check database status',
      message: error instanceof Error ? error.message : 'Unknown error',
      ...(process.env.NODE_ENV !== 'production' ? { 
        stack: error instanceof Error ? error.stack : undefined 
      } : {})
    }, { status: 500 });
  }
} 