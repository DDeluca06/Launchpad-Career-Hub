# Launchpad Career Hub - Internal Documentation

## Project Overview
Launchpad Career Hub is a modern web application built with Next.js 15, TypeScript, and Tailwind CSS. The application serves as a career management platform with separate interfaces for administrators and applicants.

## Tech Stack
- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React Hooks
- **Package Manager**: pnpm
- **Development Tools**: TypeScript, ESLint, PostCSS

## Project Structure
```
├── app/                    # Next.js app directory (App Router)
│   ├── admin/             # Admin dashboard routes
│   ├── applicant/         # Applicant interface routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and shared logic
├── public/               # Static assets
└── styles/               # Additional styling files
```

## Getting Started

### Prerequisites
- Node.js (Latest LTS version recommended)
- pnpm package manager
- Git

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm dev
   ```

### Available Scripts
- `pnpm dev`: Start development server
- `pnpm build`: Build for production
- `pnpm start`: Start production server
- `pnpm lint`: Run ESLint

## Development Guidelines

### Code Style
- Use TypeScript for all new files
- Follow ESLint rules
- Use functional components with hooks
- Implement proper type definitions
- Use ES6+ features and modern JavaScript practices

### Component Structure
- Place reusable components in the `components` directory
- Follow atomic design principles
- Use Radix UI components as base building blocks
- Implement proper prop types and documentation

### State Management
- Use React hooks for local state
- Implement custom hooks for shared logic
- Keep state as close as possible to where it's used

### Styling
- Use Tailwind CSS for styling
- Follow the project's design system
- Use CSS modules for component-specific styles
- Maintain responsive design principles

### Performance
- Implement proper code splitting
- Use Next.js Image component for images
- Optimize bundle size
- Implement proper caching strategies

## Best Practices
1. Write clean, maintainable code
2. Add proper comments and documentation
3. Follow Git commit conventions
4. Write unit tests for critical functionality
5. Keep dependencies up to date
6. Regular security audits
7. Rebase instead of merge

## Deployment

### Server Information
- **Host**: DigitalOcean Droplet
- **OS**: Ubuntu 24.10 x86_64
- **Kernel**: 6.11.0-21-generic
- **Memory**: 960MiB
- **CPU**: 1 Core @ 2.294GHz

### Deployment Process
The application is deployed using GitHub Actions with the following workflow:
1. Build the Next.js application
2. Upload build artifacts
3. Deploy to production server
4. Restart the application using PM2

### Required GitHub Secrets
The following secrets need to be configured in GitHub repository settings:
- `SSH_PRIVATE_KEY`: SSH key for server access
- `SERVER_USER`: Server username 
- `SERVER_HOST`: Server IP 
- `SERVER_PATH`: Application path on server

### PM2 Configuration
The application runs using PM2 with the following configuration:
```javascript
{
  name: 'next-app',
  script: 'npm',
  args: 'start',
  env: {
    NODE_ENV: 'production',
    PORT: 3000
  },
  instances: 1,
  autorestart: true,
  watch: false,
  max_memory_restart: '1G'
}
```

### Deployment Commands
The deployment process includes:
1. Creating necessary directories
2. Copying build files and dependencies
3. Installing production dependencies
4. Restarting the PM2 process

## Troubleshooting
- Check the Next.js documentation for common issues
- Review the console for error messages
- Ensure all dependencies are properly installed
- Clear `.next` cache if experiencing build issues
- Check PM2 logs for runtime issues
- Verify server connectivity and permissions

## Support
For internal support:
1. Check existing documentation
2. Review GitHub issues
3. Contact the development team
4. Create detailed bug reports with steps to reproduce

## Security
- Keep dependencies updated
- Follow security best practices
- Implement proper authentication and authorization
- Regular security audits
- Protect sensitive information
- Never commit credentials or secrets
- Use environment variables for sensitive data

## Maintenance
- Regular dependency updates
- Performance monitoring
- Error tracking
- User feedback collection
- Regular code reviews
- Server resource monitoring
- PM2 process management

## Future Improvements
- Implement comprehensive testing
- Add performance monitoring
- Enhance documentation
- Improve accessibility
- Add internationalization support
- Set up automated backups
- Implement CI/CD pipeline improvements
