/**
 * Local Storage Service
 * 
 * This service handles data persistence using localStorage based on the DB schema.
 * It serves as a temporary solution until we integrate with a backend.
 */

// Database Schema Types (based on the provided DB diagram)
export interface User {
  user_id: number;
  status: string;
  username: string;
  password: string;
  isAdmin: boolean;
  program: string;
  created_at: string;
}

export interface UserProfile {
  profile_id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface Resume {
  resume_id: number;
  user_id: number;
  file_path: string;
  file_name: string;
  isDefault: boolean;
  created_at: string;
}

export interface Job {
  job_id: number;
  job_type: string;
  title: string;
  description: string;
  company: string;
  website: string;
  location: string;
  partner_id: number;
  created_at: string;
  tags: string[];
  companyLogo?: string;
}

export interface Application {
  application_id: number;
  user_id: number;
  job_id: number;
  status: string;
  applied_at: string;
  status_updated_at: string;
  resume_id: number;
  position: string;
}

export interface Partner {
  partner_id: number;
  name: string;
  description: string;
  industry: string;
  location: string;
  jobs_available: number;
  applicants: number;
  applicants_hired: number;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  partnership_start?: string;
  status?: 'active' | 'inactive' | 'pending';
  logo_url?: string;
}

export interface Event {
  event_id: number;
  title: string;
  description: string;
  event_date: string;
  created_at: string;
}

export interface ApplicationStatusHistory {
  app_history_id: number;
  application_id: number;
  status: string;
  changed_at: string;
}

export interface DashboardActivity {
  activity_id: number;
  admin_id: number;
  action: string;
  details: string;
  timestamp: string;
}

// Storage keys
const STORAGE_KEYS = {
  USERS: 'launchpad_users',
  USER_PROFILES: 'launchpad_user_profiles',
  RESUMES: 'launchpad_resumes',
  JOBS: 'launchpad_jobs',
  APPLICATIONS: 'launchpad_applications',
  PARTNERS: 'launchpad_partners',
  EVENTS: 'launchpad_events',
  APP_STATUS_HISTORY: 'launchpad_app_status_history',
  DASHBOARD_ACTIVITY: 'launchpad_dashboard_activity',
  CURRENT_USER: 'launchpad_current_user',
};

// Helper functions for working with localStorage
function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  const stored = localStorage.getItem(key);
  if (!stored) return defaultValue;
  
  try {
    return JSON.parse(stored) as T;
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage:`, error);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

// User operations
export const userService = {
  getAll: () => getItem<User[]>(STORAGE_KEYS.USERS, []),
  getById: (id: number) => getItem<User[]>(STORAGE_KEYS.USERS, []).find(user => user.user_id === id),
  create: (user: Omit<User, 'user_id' | 'created_at'>) => {
    const users = getItem<User[]>(STORAGE_KEYS.USERS, []);
    const newUser: User = {
      ...user,
      user_id: users.length > 0 ? Math.max(...users.map(u => u.user_id)) + 1 : 1,
      created_at: new Date().toISOString(),
    };
    users.push(newUser);
    setItem(STORAGE_KEYS.USERS, users);
    return newUser;
  },
  update: (user: User) => {
    const users = getItem<User[]>(STORAGE_KEYS.USERS, []);
    const index = users.findIndex(u => u.user_id === user.user_id);
    if (index !== -1) {
      users[index] = user;
      setItem(STORAGE_KEYS.USERS, users);
      return user;
    }
    return null;
  },
  delete: (id: number) => {
    const users = getItem<User[]>(STORAGE_KEYS.USERS, []);
    const filtered = users.filter(user => user.user_id !== id);
    setItem(STORAGE_KEYS.USERS, filtered);
  },
  login: (username: string, password: string) => {
    const users = getItem<User[]>(STORAGE_KEYS.USERS, []);
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setItem(STORAGE_KEYS.CURRENT_USER, user);
    }
    return user;
  },
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },
  getCurrentUser: () => getItem<User | null>(STORAGE_KEYS.CURRENT_USER, null),
};

// User Profile operations
export const userProfileService = {
  getAll: () => getItem<UserProfile[]>(STORAGE_KEYS.USER_PROFILES, []),
  getById: (id: number) => getItem<UserProfile[]>(STORAGE_KEYS.USER_PROFILES, []).find(profile => profile.profile_id === id),
  getByUserId: (userId: number) => getItem<UserProfile[]>(STORAGE_KEYS.USER_PROFILES, []).find(profile => profile.user_id === userId),
  create: (profile: Omit<UserProfile, 'profile_id' | 'created_at' | 'updated_at'>) => {
    const profiles = getItem<UserProfile[]>(STORAGE_KEYS.USER_PROFILES, []);
    const now = new Date().toISOString();
    const newProfile: UserProfile = {
      ...profile,
      profile_id: profiles.length > 0 ? Math.max(...profiles.map(p => p.profile_id)) + 1 : 1,
      created_at: now,
      updated_at: now,
    };
    profiles.push(newProfile);
    setItem(STORAGE_KEYS.USER_PROFILES, profiles);
    return newProfile;
  },
  update: (profile: UserProfile) => {
    const profiles = getItem<UserProfile[]>(STORAGE_KEYS.USER_PROFILES, []);
    const index = profiles.findIndex(p => p.profile_id === profile.profile_id);
    if (index !== -1) {
      profiles[index] = {
        ...profile,
        updated_at: new Date().toISOString()
      };
      setItem(STORAGE_KEYS.USER_PROFILES, profiles);
      return profiles[index];
    }
    return null;
  },
  delete: (id: number) => {
    const profiles = getItem<UserProfile[]>(STORAGE_KEYS.USER_PROFILES, []);
    const filtered = profiles.filter(profile => profile.profile_id !== id);
    setItem(STORAGE_KEYS.USER_PROFILES, filtered);
  },
  // Create or update a user profile
  createOrUpdate: (userId: number, data: { first_name: string, last_name: string, email?: string, phone?: string }) => {
    const profiles = getItem<UserProfile[]>(STORAGE_KEYS.USER_PROFILES, []);
    const existingProfile = profiles.find(p => p.user_id === userId);
    
    if (existingProfile) {
      // Update existing profile
      const updatedProfile = {
        ...existingProfile,
        ...data,
        updated_at: new Date().toISOString()
      };
      return userProfileService.update(updatedProfile);
    } else {
      // Create new profile
      return userProfileService.create({
        user_id: userId,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email || '',
        phone: data.phone || '',
      });
    }
  }
};

// Resume operations
export const resumeService = {
  getAll: () => getItem<Resume[]>(STORAGE_KEYS.RESUMES, []),
  getById: (id: number) => getItem<Resume[]>(STORAGE_KEYS.RESUMES, []).find(resume => resume.resume_id === id),
  getByUserId: (userId: number) => getItem<Resume[]>(STORAGE_KEYS.RESUMES, []).filter(resume => resume.user_id === userId),
  getDefaultForUser: (userId: number) => {
    const userResumes = getItem<Resume[]>(STORAGE_KEYS.RESUMES, []).filter(resume => resume.user_id === userId);
    return userResumes.find(resume => resume.isDefault) || userResumes[0] || null;
  },
  create: (resume: Omit<Resume, 'resume_id' | 'created_at'>) => {
    const resumes = getItem<Resume[]>(STORAGE_KEYS.RESUMES, []);
    const newResume: Resume = {
      ...resume,
      resume_id: resumes.length > 0 ? Math.max(...resumes.map(r => r.resume_id)) + 1 : 1,
      created_at: new Date().toISOString(),
    };
    resumes.push(newResume);
    setItem(STORAGE_KEYS.RESUMES, resumes);
    return newResume;
  },
  update: (resume: Resume) => {
    const resumes = getItem<Resume[]>(STORAGE_KEYS.RESUMES, []);
    const index = resumes.findIndex(r => r.resume_id === resume.resume_id);
    if (index !== -1) {
      resumes[index] = resume;
      setItem(STORAGE_KEYS.RESUMES, resumes);
      return resume;
    }
    return null;
  },
  delete: (id: number) => {
    const resumes = getItem<Resume[]>(STORAGE_KEYS.RESUMES, []);
    const filtered = resumes.filter(resume => resume.resume_id !== id);
    setItem(STORAGE_KEYS.RESUMES, filtered);
  },
};

// Job operations
export const jobService = {
  getAll: () => getItem<Job[]>(STORAGE_KEYS.JOBS, []),
  getById: (id: number) => getItem<Job[]>(STORAGE_KEYS.JOBS, []).find(job => job.job_id === id),
  getByPartnerId: (partnerId: number) => getItem<Job[]>(STORAGE_KEYS.JOBS, []).filter(job => job.partner_id === partnerId),
  search: (query: string) => {
    const jobs = getItem<Job[]>(STORAGE_KEYS.JOBS, []);
    const lowercaseQuery = query.toLowerCase();
    return jobs.filter(job => 
      job.title.toLowerCase().includes(lowercaseQuery) ||
      job.company.toLowerCase().includes(lowercaseQuery) ||
      job.location.toLowerCase().includes(lowercaseQuery) ||
      job.description?.toLowerCase().includes(lowercaseQuery) ||
      job.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  },
  create: (job: Omit<Job, 'job_id' | 'created_at'>) => {
    const jobs = getItem<Job[]>(STORAGE_KEYS.JOBS, []);
    const newJob: Job = {
      ...job,
      job_id: jobs.length > 0 ? Math.max(...jobs.map(j => j.job_id)) + 1 : 1,
      created_at: new Date().toISOString(),
    };
    jobs.push(newJob);
    setItem(STORAGE_KEYS.JOBS, jobs);
    return newJob;
  },
  update: (job: Job) => {
    const jobs = getItem<Job[]>(STORAGE_KEYS.JOBS, []);
    const index = jobs.findIndex(j => j.job_id === job.job_id);
    if (index !== -1) {
      jobs[index] = job;
      setItem(STORAGE_KEYS.JOBS, jobs);
      return job;
    }
    return null;
  },
  delete: (id: number) => {
    const jobs = getItem<Job[]>(STORAGE_KEYS.JOBS, []);
    const filtered = jobs.filter(job => job.job_id !== id);
    setItem(STORAGE_KEYS.JOBS, filtered);
  },
};

// Application operations
export const applicationService = {
  getAll: () => getItem<Application[]>(STORAGE_KEYS.APPLICATIONS, []),
  getById: (id: number) => getItem<Application[]>(STORAGE_KEYS.APPLICATIONS, []).find(app => app.application_id === id),
  getByUserId: (userId: number) => getItem<Application[]>(STORAGE_KEYS.APPLICATIONS, []).filter(app => app.user_id === userId),
  getByJobId: (jobId: number) => getItem<Application[]>(STORAGE_KEYS.APPLICATIONS, []).filter(app => app.job_id === jobId),
  create: (application: Omit<Application, 'application_id' | 'applied_at' | 'status_updated_at'>) => {
    const applications = getItem<Application[]>(STORAGE_KEYS.APPLICATIONS, []);
    const now = new Date().toISOString();
    const newApplication: Application = {
      ...application,
      application_id: applications.length > 0 ? Math.max(...applications.map(a => a.application_id)) + 1 : 1,
      applied_at: now,
      status_updated_at: now,
    };
    applications.push(newApplication);
    setItem(STORAGE_KEYS.APPLICATIONS, applications);
    
    // Create initial status history entry
    const statusHistories = getItem<ApplicationStatusHistory[]>(STORAGE_KEYS.APP_STATUS_HISTORY, []);
    const newStatusHistory: ApplicationStatusHistory = {
      app_history_id: statusHistories.length > 0 ? Math.max(...statusHistories.map(h => h.app_history_id)) + 1 : 1,
      application_id: newApplication.application_id,
      status: newApplication.status,
      changed_at: now,
    };
    statusHistories.push(newStatusHistory);
    setItem(STORAGE_KEYS.APP_STATUS_HISTORY, statusHistories);
    
    return newApplication;
  },
  updateStatus: (id: number, newStatus: string) => {
    const applications = getItem<Application[]>(STORAGE_KEYS.APPLICATIONS, []);
    const index = applications.findIndex(app => app.application_id === id);
    if (index !== -1) {
      const now = new Date().toISOString();
      const oldStatus = applications[index].status;
      
      // Don't update if status hasn't changed
      if (oldStatus === newStatus) return applications[index];
      
      // Update application status
      applications[index].status = newStatus;
      applications[index].status_updated_at = now;
      setItem(STORAGE_KEYS.APPLICATIONS, applications);
      
      // Create status history entry
      const statusHistories = getItem<ApplicationStatusHistory[]>(STORAGE_KEYS.APP_STATUS_HISTORY, []);
      const newStatusHistory: ApplicationStatusHistory = {
        app_history_id: statusHistories.length > 0 ? Math.max(...statusHistories.map(h => h.app_history_id)) + 1 : 1,
        application_id: id,
        status: newStatus,
        changed_at: now,
      };
      statusHistories.push(newStatusHistory);
      setItem(STORAGE_KEYS.APP_STATUS_HISTORY, statusHistories);
      
      return applications[index];
    }
    return null;
  },
  update: (application: Application) => {
    const applications = getItem<Application[]>(STORAGE_KEYS.APPLICATIONS, []);
    const index = applications.findIndex(app => app.application_id === application.application_id);
    if (index !== -1) {
      // Check if status changed
      const oldStatus = applications[index].status;
      const newStatus = application.status;
      const now = new Date().toISOString();
      
      // Update application
      applications[index] = {
        ...application,
        status_updated_at: oldStatus !== newStatus ? now : applications[index].status_updated_at
      };
      setItem(STORAGE_KEYS.APPLICATIONS, applications);
      
      // Create status history entry if status changed
      if (oldStatus !== newStatus) {
        const statusHistories = getItem<ApplicationStatusHistory[]>(STORAGE_KEYS.APP_STATUS_HISTORY, []);
        const newStatusHistory: ApplicationStatusHistory = {
          app_history_id: statusHistories.length > 0 ? Math.max(...statusHistories.map(h => h.app_history_id)) + 1 : 1,
          application_id: application.application_id,
          status: newStatus,
          changed_at: now,
        };
        statusHistories.push(newStatusHistory);
        setItem(STORAGE_KEYS.APP_STATUS_HISTORY, statusHistories);
      }
      
      return applications[index];
    }
    return null;
  },
  delete: (id: number) => {
    const applications = getItem<Application[]>(STORAGE_KEYS.APPLICATIONS, []);
    const filtered = applications.filter(app => app.application_id !== id);
    setItem(STORAGE_KEYS.APPLICATIONS, filtered);
    
    // Also delete associated status history
    const statusHistories = getItem<ApplicationStatusHistory[]>(STORAGE_KEYS.APP_STATUS_HISTORY, []);
    const filteredHistories = statusHistories.filter(history => history.application_id !== id);
    setItem(STORAGE_KEYS.APP_STATUS_HISTORY, filteredHistories);
  },
  getStatusHistory: (applicationId: number) => {
    return getItem<ApplicationStatusHistory[]>(STORAGE_KEYS.APP_STATUS_HISTORY, [])
      .filter(history => history.application_id === applicationId)
      .sort((a, b) => new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime());
  },
};

// Partner operations
export const partnerService = {
  getAll: () => getItem<Partner[]>(STORAGE_KEYS.PARTNERS, []),
  getById: (id: number) => getItem<Partner[]>(STORAGE_KEYS.PARTNERS, []).find(partner => partner.partner_id === id),
  create: (partner: Omit<Partner, 'partner_id'>) => {
    const partners = getItem<Partner[]>(STORAGE_KEYS.PARTNERS, []);
    const newPartner: Partner = {
      ...partner,
      partner_id: partners.length > 0 ? Math.max(...partners.map(p => p.partner_id)) + 1 : 1,
    };
    partners.push(newPartner);
    setItem(STORAGE_KEYS.PARTNERS, partners);
    return newPartner;
  },
  update: (partner: Partner) => {
    const partners = getItem<Partner[]>(STORAGE_KEYS.PARTNERS, []);
    const index = partners.findIndex(p => p.partner_id === partner.partner_id);
    if (index !== -1) {
      partners[index] = partner;
      setItem(STORAGE_KEYS.PARTNERS, partners);
      return partner;
    }
    return null;
  },
  delete: (id: number) => {
    const partners = getItem<Partner[]>(STORAGE_KEYS.PARTNERS, []);
    const filtered = partners.filter(partner => partner.partner_id !== id);
    setItem(STORAGE_KEYS.PARTNERS, filtered);
  },
};

// Event operations
export const eventService = {
  getAll: () => getItem<Event[]>(STORAGE_KEYS.EVENTS, []),
  getById: (id: number) => getItem<Event[]>(STORAGE_KEYS.EVENTS, []).find(event => event.event_id === id),
  getUpcoming: () => {
    const events = getItem<Event[]>(STORAGE_KEYS.EVENTS, []);
    const now = new Date();
    return events
      .filter(event => new Date(event.event_date) > now)
      .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
  },
  create: (event: Omit<Event, 'event_id' | 'created_at'>) => {
    const events = getItem<Event[]>(STORAGE_KEYS.EVENTS, []);
    const newEvent: Event = {
      ...event,
      event_id: events.length > 0 ? Math.max(...events.map(e => e.event_id)) + 1 : 1,
      created_at: new Date().toISOString(),
    };
    events.push(newEvent);
    setItem(STORAGE_KEYS.EVENTS, events);
    return newEvent;
  },
  update: (event: Event) => {
    const events = getItem<Event[]>(STORAGE_KEYS.EVENTS, []);
    const index = events.findIndex(e => e.event_id === event.event_id);
    if (index !== -1) {
      events[index] = event;
      setItem(STORAGE_KEYS.EVENTS, events);
      return event;
    }
    return null;
  },
  delete: (id: number) => {
    const events = getItem<Event[]>(STORAGE_KEYS.EVENTS, []);
    const filtered = events.filter(event => event.event_id !== id);
    setItem(STORAGE_KEYS.EVENTS, filtered);
  },
};

// Dashboard activity operations
export const dashboardActivityService = {
  getAll: () => getItem<DashboardActivity[]>(STORAGE_KEYS.DASHBOARD_ACTIVITY, []),
  getByAdminId: (adminId: number) => {
    return getItem<DashboardActivity[]>(STORAGE_KEYS.DASHBOARD_ACTIVITY, [])
      .filter(activity => activity.admin_id === adminId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },
  getRecent: (limit = 10) => {
    return getItem<DashboardActivity[]>(STORAGE_KEYS.DASHBOARD_ACTIVITY, [])
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  },
  create: (activity: Omit<DashboardActivity, 'activity_id' | 'timestamp'>) => {
    const activities = getItem<DashboardActivity[]>(STORAGE_KEYS.DASHBOARD_ACTIVITY, []);
    const newActivity: DashboardActivity = {
      ...activity,
      activity_id: activities.length > 0 ? Math.max(...activities.map(a => a.activity_id)) + 1 : 1,
      timestamp: new Date().toISOString(),
    };
    activities.push(newActivity);
    setItem(STORAGE_KEYS.DASHBOARD_ACTIVITY, activities);
    return newActivity;
  },
};

// Initialize with sample data if needed
export function initializeSampleData() {
  // Check if we already have data
  const hasUsers = getItem<User[]>(STORAGE_KEYS.USERS, []).length > 0;
  if (hasUsers) return;
  
  // Sample users
  const users: User[] = [
    {
      user_id: 1,
      status: "active",
      username: "admin",
      password: "admin123", // In a real app, never store plain text passwords
      isAdmin: true,
      program: "admin",
      created_at: new Date().toISOString(),
    },
    {
      user_id: 2,
      status: "active",
      username: "applicant",
      password: "applicant123", // In a real app, never store plain text passwords
      isAdmin: false,
      program: "web_development",
      created_at: new Date().toISOString(),
    },
  ];
  setItem(STORAGE_KEYS.USERS, users);
  
  // Sample partners
  const partners: Partner[] = [
    {
      partner_id: 1,
      name: "Tech Innovators",
      description: "A leading tech company focused on innovation and growth.",
      industry: "Technology",
      location: "Remote",
      jobs_available: 3,
      applicants: 0,
      applicants_hired: 0,
    },
    {
      partner_id: 2,
      name: "Creative Solutions",
      description: "Design and creative agency with a focus on user experience.",
      industry: "Design",
      location: "Philadelphia, PA",
      jobs_available: 2,
      applicants: 0,
      applicants_hired: 0,
    },
  ];
  setItem(STORAGE_KEYS.PARTNERS, partners);
  
  // Sample jobs
  const jobs: Job[] = [
    {
      job_id: 1,
      job_type: "full_time",
      title: "Frontend Developer",
      description: "We're looking for a skilled frontend developer experienced in React and TypeScript.",
      company: "Tech Innovators",
      website: "https://techinnovators.example.com",
      location: "Remote",
      partner_id: 1,
      created_at: new Date().toISOString(),
      tags: ["React", "TypeScript", "Frontend", "Remote"],
    },
    {
      job_id: 2,
      job_type: "full_time",
      title: "UX Designer",
      description: "Join our design team to create beautiful user experiences.",
      company: "Creative Solutions",
      website: "https://creativesolutions.example.com",
      location: "Philadelphia, PA",
      partner_id: 2,
      created_at: new Date().toISOString(),
      tags: ["UX", "UI", "Design", "Figma"],
    },
    {
      job_id: 3,
      job_type: "part_time",
      title: "Backend Engineer",
      description: "Part-time role helping build our scalable backend infrastructure.",
      company: "Tech Innovators",
      website: "https://techinnovators.example.com",
      location: "Remote",
      partner_id: 1,
      created_at: new Date().toISOString(),
      tags: ["Node.js", "Express", "MongoDB", "Backend", "Remote"],
    },
  ];
  setItem(STORAGE_KEYS.JOBS, jobs);
  
  // Sample events
  const now = new Date();
  const events: Event[] = [
    {
      event_id: 1,
      title: "Resume Workshop",
      description: "Learn how to craft a perfect resume for tech companies.",
      event_date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7).toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      event_id: 2,
      title: "Tech Interview Prep",
      description: "Practice technical interview questions and get feedback.",
      event_date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14).toISOString(),
      created_at: new Date().toISOString(),
    },
  ];
  setItem(STORAGE_KEYS.EVENTS, events);
} 