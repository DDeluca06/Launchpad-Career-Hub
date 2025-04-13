// Simplified auth implementation
export const auth = {
  api: {
    session: {
      async get({ request }: { request: Request }) {
        try {
          // Get session token from cookies
          const cookieHeader = request.headers.get('cookie');
          
          if (!cookieHeader) {
            console.error("No cookie header found");
            return null;
          }
          
          // Parse cookies
          const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
          }, {} as Record<string, string>);
          
          const sessionId = cookies['session-id'];
          if (!sessionId) {
            console.error("No session-id cookie found");
            return null;
          }
          
          console.error("Found session-id cookie");
          
          // Try to parse as JSON
          try {
            // Decode URI component first to handle URL encoding
            const decodedSessionId = decodeURIComponent(sessionId);
            
            // Convert from base64 to string
            const decodedString = Buffer.from(decodedSessionId, 'base64').toString();
            
            // Parse the JSON
            const sessionData = JSON.parse(decodedString);
            
            if (sessionData && typeof sessionData === 'object' && 'id' in sessionData) {
              console.error("Valid session data found:", sessionData.id);
              return {
                user: {
                  id: sessionData.id.toString(),
                  isAdmin: !!sessionData.isAdmin
                }
              };
            } else {
              console.error("Invalid session data format:", sessionData);
              return null;
            }
          } catch (jsonParseError) {
            console.error('Failed to parse session JSON:', jsonParseError);
            return null;
          }
        } catch (sessionError) {
          console.error('Error retrieving session:', sessionError);

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