# Launchpad Career Hub - Project Planning

## Project Overview
Launchpad Career Hub is a job portal platform designed specifically for a Philadelphia-based non-profit organization that helps local youth secure tech jobs without requiring a college degree. The platform connects young job seekers with tech employment opportunities and provides administrators with tools to manage the hiring process.

Unlike general job boards like Indeed or Glassdoor, Launchpad Career Hub is tailored to the specific needs of underrepresented youth entering the tech industry, with a focus on skills-based matching rather than traditional credentials.

## Target Users

### Applicants (Youth/Students)
- High school graduates from Philadelphia
- Young adults seeking tech careers without college degrees
- Participants in the non-profit's training programs
- Individuals with varying levels of tech skills and experience

### Administrators (Staff)
- Program managers overseeing job placement
- Career counselors and mentors
- Employer relationship managers
- Data analysts tracking program outcomes

## Project Goals
1. Create a user-friendly platform that simplifies the job application process
2. Provide administrators with tools to track applicants' progress
3. Match applicants with appropriate job opportunities based on skills and interests
4. Collect meaningful data on program outcomes and success rates
5. Build a scalable platform that can grow with the organization

## Feature Requirements

### Applicant Features
1. **User Authentication**
   - Registration and login
   - Profile creation and management
   - Password recovery

2. **Profile Management**
   - Personal information
   - Skills inventory
   - Resume upload and management
   - Portfolio/project showcase

3. **Job Search and Discovery**
   - Browse job listings
   - Search and filter by skills, location, company
   - Save favorite jobs
   - Job recommendations based on profile

4. **Application Management**
   - Apply to jobs
   - Track application status
   - View application history
   - Receive notifications on status changes

5. **Event Calendar**
   - View upcoming workshops and networking events
   - Register for events
   - Receive reminders

6. **Resources**
   - Access learning materials
   - Interview preparation guides
   - Career development resources

### Admin Features
1. **User Management**
   - View and manage applicant accounts
   - Track applicant progress
   - Communication with applicants

2. **Job Management**
   - Create and edit job listings
   - Manage partner/employer relationships
   - Track job posting performance

3. **Application Tracking**
   - Kanban board for application stages
   - Notes and feedback on applications
   - Status updates and history

4. **Analytics Dashboard**
   - Program performance metrics
   - Placement rates and statistics
   - User engagement data

5. **Event Management**
   - Create and schedule events
   - Track attendance and participation
   - Collect feedback

## Technical Architecture

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **UI Components**: React components with Tailwind CSS and Radix UI
- **State Management**: React hooks with Context API
- **Forms**: React Hook Form with Zod validation

### Data Storage (Phase 1 - Local Storage)
- Utilize browser's localStorage for data persistence
- Implement data models matching future database schema
- Create service layer to abstract storage implementation

### Data Storage (Phase 2 - Backend Integration)
- SQL database following the provided schema
- RESTful API endpoints matching current service layer
- Authentication and authorization

### Deployment
- Vercel for frontend hosting
- Database and backend services TBD

## Design System

### Colors
Use the organization's established color palette:
- Primary colors: Blue (#0faec9), Orange (#f27e34), Green (#8eb651)
- Secondary colors: Teal (#0a8196), Brown (#b45e23), Dark Green (#658639)
- Neutral colors: Light Blue (#c3ebf1), Peach (#fcdfcc), Light Green (#e3edd3), Off White (#f7f7f7), Dark Gray (#67686a)

### Components
Maintain consistency with these UI components:
- Typography: Clear hierarchy with sans-serif fonts
- Buttons: Primary, secondary, and tertiary styles
- Cards: For job listings, events, and profile information
- Forms: Consistent input styling with clear validation
- Navigation: Intuitive menus and breadcrumbs

## Implementation Roadmap

### Phase 1: Setup and Core Structure (Week 1)
- [x] Initialize Next.js project with TypeScript
- [x] Set up Tailwind CSS and component library
- [x] Create basic page layouts and navigation
- [x] Implement local storage service layer
- [x] Create login page as main landing page (with development navigation)
- [ ] Complete authentication workflow (localStorage-based)

### Phase 2: Applicant Features (Weeks 2-3)
- [ ] Build profile management system
- [ ] Create job listing and search functionality
- [ ] Develop application submission and tracking
- [ ] Design and implement dashboard
- [ ] Implement job application workflow

### Phase 3: Admin Features (Weeks 4-5)
- [x] Build admin dashboard
- [x] Create admin settings page with user management
- [x] Implement CSV data import functionality for users and jobs
- [x] Create applicant tracking system with filtering and pagination
- [x] Develop analytics dashboard with actionable insights
- [x] Implement partners management page
- [x] Design event calendar system
- [ ] Develop job posting management (in progress)

### Phase 4: Polish and Enhancements (Week 6)
- [ ] Remove development navigation
- [ ] Improve UI/UX based on testing
- [ ] Add notifications system
- [ ] Implement resources section
- [ ] Create demo data for presentation
- [ ] Optimize performance

### Phase 5: Future Backend Integration (Post-MVP)
- [ ] Define API endpoints based on current service layer
- [ ] Create database schema and migrations
- [ ] Implement authentication with JWT
- [ ] Connect frontend to new API endpoints
- [ ] Migrate data from localStorage to database

## Testing Strategy
- Component testing with React Testing Library
- End-to-end testing with Cypress
- User testing with admin and applicant personas
- Performance testing for core user journeys

## Development Guidelines

### Code Organization
- Follow feature-based organization within App Router structure
- Maintain separation of concerns between UI and business logic
- Reuse components where possible
- Document complex functionality with comments

### State Management
- Use React Context for global state (auth, preferences)
- Prefer local component state for UI-specific state
- Implement proper error handling and loading states

### Performance Optimization
- Implement proper code splitting
- Optimize images and assets
- Minimize third-party dependencies
- Use proper caching strategies

## Getting Started for Developers

1. Clone the repository
2. Install dependencies with `pnpm install`
3. Start the development server with `pnpm dev`
4. Access the application at `http://localhost:3000`

## Current Status and Next Steps

The project has made significant progress with the admin section of the application:

### Completed Features
- Admin dashboard with program performance metrics
- Applicant management system with search, filtering, and pagination
- Analytics dashboard with actionable insights on program performance
- Settings page with user admin access management
- CSV import functionality for users
- Partners management page
- Calendar and events system
- Application tracking with status visualization

### Future Implementation Plans 
- **Report Generation**: Plans to implement PDF and Excel report generation from analytics data using jsPDF and xlsx libraries
- **Job Management System**: Enhance job posting, management, and tracking features
- **Email Notifications**: Add email notification system for status changes and updates
- **Enhanced Search**: Implement more advanced search and filtering options

### Current Focus
- Developing the applicant side of the platform with consistent styling and UX
- Ensuring data models and workflows align between admin and applicant interfaces
- Implementing authentication and profile management
- Creating job search and application functionality for applicants

## Conclusion

This planning document outlines the development roadmap for Launchpad Career Hub, a specialized job portal for Philadelphia youth entering the tech industry. By following this plan, we can create a platform that effectively connects young job seekers with tech opportunities, helping them launch successful careers without traditional four-year degrees. 