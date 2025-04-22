import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
    
    // Simple cookie options that work on both localhost and IP addresses
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
      sameSite: 'lax' as const,
      maxAge: 0,
    };
    
    console.log('Clearing cookie with simple options:', JSON.stringify(cookieOptions));
    
    // Clear session cookie with simplified settings
    response.cookies.set('session-id', '', cookieOptions);
    
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