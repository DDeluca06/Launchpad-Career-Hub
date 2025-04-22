import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
    
    // Get the domain from the request URL for production environments
    const requestUrl = new URL(request.url);
    const domain = process.env.NODE_ENV === 'production' 
      ? requestUrl.hostname 
      : undefined;
    
    console.log('Clearing cookie with domain:', domain);
    
    // Clear session cookie using more effective techniques
    response.cookies.set('session-id', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
      sameSite: 'lax',
      maxAge: 0,
      domain: domain,
      secure: process.env.NODE_ENV === 'production',
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