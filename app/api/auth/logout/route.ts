import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
    
    // Clear session cookie using more effective techniques
    response.cookies.set('session-id', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
      sameSite: 'lax',
      maxAge: 0,
    });
    
    // Add cache-busting headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ 
      error: 'Failed to log out' 
    }, { status: 500 });
  }
} 