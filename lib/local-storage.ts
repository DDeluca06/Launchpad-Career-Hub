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

export enum JobType {
  FULL_TIME = 'Full-time',
  PART_TIME = 'Part-time',
  CONTRACT = 'Contract',
  INTERNSHIP = 'Internship',
  REMOTE = 'Remote'
}

export interface Job {
  job_id: number;
  title: string;
  company: string;
  location?: string;
  job_type?: JobType;
  description?: string;
  companyLogo?: string;
  tags?: string[];
  salary?: string;
  created_at?: string;
  partner_id?: number;
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
      (job.location?.toLowerCase().includes(lowercaseQuery) || false) ||
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
    if (index >= 0) {
      jobs[index] = job;
      setItem(STORAGE_KEYS.JOBS, jobs);
      return job;
    } else {
      // Generate a new ID if none exists
      if (!job.job_id) {
        job.job_id = Math.max(0, ...jobs.map(j => j.job_id)) + 1;
      }
      jobs.push(job);
      setItem(STORAGE_KEYS.JOBS, jobs);
      return job;
    }
  },

  // Delete a job
  delete: (id: number): void => {
    const jobs = getItem<Job[]>(STORAGE_KEYS.JOBS, []);
    const filtered = jobs.filter(job => job.job_id !== id);
    setItem(STORAGE_KEYS.JOBS, filtered);
  },

  // Initialize with mock data for demonstration
  initMockData: (): void => {
    const mockJobs: Job[] = [
      {
        job_id: 1,
        title: "Frontend Developer",
        company: "TechCorp",
        location: "Philadelphia, PA (Remote)",
        job_type: JobType.FULL_TIME,
        description: "Building modern web applications using React and Next.js",
        tags: ["FRONT_END", "FULLY_REMOTE"],
        salary: "$80,000 - $100,000",
        created_at: new Date().toISOString()
      },
      {
        job_id: 2,
        title: "UX Designer",
        company: "Design Studio",
        location: "Boston, MA (On-site)",
        job_type: JobType.FULL_TIME,
        description: "Design user interfaces and experiences for web and mobile applications",
        tags: ["UX_UI_DESIGN", "IN_PERSON"],
        salary: "$75,000 - $95,000",
        created_at: new Date().toISOString()
      },
      {
        job_id: 3,
        title: "Backend Engineer",
        company: "Data Inc.",
        location: "New York, NY (Hybrid)",
        job_type: JobType.FULL_TIME,
        description: "Develop and maintain server-side applications and databases",
        tags: ["BACK_END", "HYBRID"],
        salary: "$90,000 - $120,000",
        created_at: new Date().toISOString()
      },
      {
        job_id: 4,
        title: "Product Manager",
        company: "Web Solutions",
        location: "Philadelphia, PA (On-site)",
        job_type: JobType.FULL_TIME,
        description: "Lead product development and roadmap planning",
        tags: ["PRODUCT_MANAGEMENT", "IN_PERSON"],
        salary: "$95,000 - $115,000",
        created_at: new Date().toISOString()
      }
    ];

    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(mockJobs));
  }
};

// Application operations
export const applicationService = {
  getAll: () => getItem<Application[]>(STORAGE_KEYS.APPLICATIONS, []),
  getById: (id: number) => getItem<Application[]>(STORAGE_KEYS.APPLICATIONS, []).find(app => app.application_id === id),
  getByUserId: (userId: number) => getItem<Application[]>(STORAGE_KEYS.APPLICATIONS, []).filter(app => app.user_id === userId),
  getByJobId: (jobId: number) => getItem<Application[]>(STORAGE_KEYS.APPLICATIONS, []).filter(app => app.job_id === jobId),
  create: (application: Omit<Application, 'application_id' | 'applied_at' | 'status_updated_at'>) => {
    const applications = getItem<Application[]>(STORAGE_KEYS.APPLICATIONS, []);
    const newApplication: Application = {
      ...application,
      application_id: applications.length > 0 ? Math.max(...applications.map(a => a.application_id)) + 1 : 1,
      applied_at: new Date().toISOString(),
      status_updated_at: new Date().toISOString()
    };
    applications.push(newApplication);
    setItem(STORAGE_KEYS.APPLICATIONS, applications);
    return newApplication;
  },
  update: (application: Application) => {
    const applications = getItem<Application[]>(STORAGE_KEYS.APPLICATIONS, []);
    const index = applications.findIndex(a => a.application_id === application.application_id);
    if (index >= 0) {
      applications[index] = {
        ...application,
        status_updated_at: new Date().toISOString()
      };
      setItem(STORAGE_KEYS.APPLICATIONS, applications);
      return applications[index];
    }
    return null;
  },
  delete: (id: number): void => {
    const applications = getItem<Application[]>(STORAGE_KEYS.APPLICATIONS, []);
    const filtered = applications.filter(app => app.application_id !== id);
    setItem(STORAGE_KEYS.APPLICATIONS, filtered);
  },
  updateStatus: (id: number, status: string) => {
    const applications = getItem<Application[]>(STORAGE_KEYS.APPLICATIONS, []);
    const index = applications.findIndex(a => a.application_id === id);
    if (index >= 0) {
      applications[index] = {
        ...applications[index],
        status,
        status_updated_at: new Date().toISOString()
      };
      setItem(STORAGE_KEYS.APPLICATIONS, applications);
      return applications[index];
    }
    return null;
  }
};