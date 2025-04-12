// Type definitions for better-auth

declare module 'better-auth' {
  export interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    isAdmin?: boolean;
  }

  export interface Session {
    user: User;
    expiresAt: number;
  }

  export interface BetterAuthConfig {
    database: {
      type: 'postgresql' | 'mysql';
      pool: any;
      tablePrefix?: string;
    };
    session: {
      secret: string;
      expiresIn: number;
    };
    providers: {
      emailPassword?: {
        enabled: boolean;
        loginFields?: string[];
        verifyEmails?: boolean;
      };
    };
    plugins?: any[];
  }

  export function betterAuth(config: BetterAuthConfig): {
    handler: (request: Request) => Promise<Response>;
    api: any;
  };
} 