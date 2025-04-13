import { auth } from './auth';

// Get the client session
export const getClientSession = async () => {
  try {
    // Better Auth's client API for getting the current session
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    // Check if response is ok
    if (!response.ok) {
      return null;
    }
    
    // Parse response
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};

// Log out the current user
export const logoutUser = async () => {
  try {
    // Clear any cached user data from localStorage/sessionStorage
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    
    // Call the logout API
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (!response.ok) {
      console.error('Logout API call failed:', response.status);
    }
    
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    
    // Force a complete page reload to clear all browser state
    window.location.href = `/?t=${timestamp}`;
  } catch (error) {
    console.error('Error logging out:', error);
    window.location.href = '/'; // Fallback to basic redirect
  }
}; 