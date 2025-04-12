import { prisma } from '@/lib/prisma';

// Simplified auth implementation
export const auth = {
  api: {
    session: {
      async get({ request }: { request: Request }) {
        try {
          // Get session token from cookies
          const cookieHeader = request.headers.get('cookie');
          console.log('Cookie header:', cookieHeader);
          
          if (!cookieHeader) {
            console.log('No cookie header found');
            return null;
          }
          
          // Parse cookies
          const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
          }, {} as Record<string, string>);
          
          console.log('Parsed cookies:', cookies);
          
          const sessionId = cookies['session-id'];
          if (!sessionId) {
            console.log('No session-id cookie found');
            return null;
          }
          
          console.log('Found session ID:', sessionId);
          
          // Try to parse as JSON
          try {
            // Decode URI component first to handle URL encoding
            const decodedSessionId = decodeURIComponent(sessionId);
            console.log('Decoded session ID:', decodedSessionId);
            
            // Convert from base64 to string
            const decodedString = Buffer.from(decodedSessionId, 'base64').toString();
            console.log('Decoded string:', decodedString);
            
            // Parse the JSON
            const sessionData = JSON.parse(decodedString);
            console.log('Parsed session data:', sessionData);
            
            if (sessionData && typeof sessionData === 'object' && 'id' in sessionData) {
              return {
                user: {
                  id: sessionData.id.toString(),
                  isAdmin: !!sessionData.isAdmin
                }
              };
            } else {
              console.log('Invalid session data format:', sessionData);
              return null;
            }
          } catch (jsonError) {
            console.error('Error parsing session:', jsonError);
            return null;
          }
        } catch (error) {
          console.error('Session error:', error);
          return null;
        }
      }
    }
  },
  
  // For the updated API routes
  async getSession(request: Request) {
    return this.api.session.get({ request });
  }
}; 