// Type definitions
export interface JobApplication {
    id: string;
    title: string;
    company: string;
    location: string;
    status: string;
    stage: 'interested' | 'applied' | 'interview';
  }
  
  export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
  }
  
  // Sample data
  const sampleApplications: JobApplication[] = [
    {
      id: '1',
      title: 'Frontend Developer',
      company: 'Tech Solutions Inc',
      location: 'Philadelphia, PA',
      status: 'Submitted',
      stage: 'applied'
    },
    {
      id: '2',
      title: 'UX Designer',
      company: 'Creative Minds',
      location: 'Remote',
      status: 'Pending',
      stage: 'interested'
    },
    {
      id: '3',
      title: 'Full Stack Engineer',
      company: 'Startup Hub',
      location: 'Philadelphia, PA',
      status: 'Interview Scheduled',
      stage: 'interview'
    }
  ];
  
  const sampleJobs: Job[] = [
    {
      id: '1',
      title: 'Frontend Developer',
      company: 'Tech Solutions Inc',
      location: 'Philadelphia, PA',
      description: 'We are looking for an experienced Frontend Developer to join our team. You will be responsible for building user interfaces and implementing features for our web application.'
    },
    {
      id: '2',
      title: 'UX Designer',
      company: 'Creative Minds',
      location: 'Remote',
      description: 'Creative Minds is seeking a talented UX Designer to create exceptional user experiences. You will work closely with product managers and engineers to design intuitive interfaces.'
    },
    {
      id: '3',
      title: 'Full Stack Engineer',
      company: 'Startup Hub',
      location: 'Philadelphia, PA',
      description: 'Join our growing startup as a Full Stack Engineer. You will be developing and maintaining both front-end and back-end components of our platform.'
    },
    {
      id: '4',
      title: 'Data Analyst',
      company: 'Analytics Pro',
      location: 'Philadelphia, PA',
      description: 'We are looking for a Data Analyst to help us interpret data and turn it into information which can drive company strategy and decision making.'
    }
  ];
  
  // Safe localStorage access
  const isClient = typeof window !== 'undefined';

  // Job Applications functions
  export const getJobApplications = (): JobApplication[] => {
    if (!isClient) {
      return [];
    }
    
    try {
      const savedApplications = localStorage.getItem('jobApplications');
      if (savedApplications) {
        return JSON.parse(savedApplications);
      } else {
        // Initialize with sample data
        localStorage.setItem('jobApplications', JSON.stringify(sampleApplications));
        return sampleApplications;
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return [];
    }
  };
  
  export const saveJobApplications = (applications: JobApplication[]): void => {
    if (!isClient) {
      return;
    }
    
    try {
      localStorage.setItem('jobApplications', JSON.stringify(applications));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };
  
  export const addJobApplication = (application: JobApplication): void => {
    if (!isClient) {
      return;
    }
    
    try {
      const applications = getJobApplications();
      // Check if the job already exists
      const exists = applications.some(app => app.id === application.id);
      
      if (!exists) {
        applications.push(application);
        saveJobApplications(applications);
      }
    } catch (error) {
      console.error('Error adding job application:', error);
    }
  };
  
  export const updateJobApplication = (application: JobApplication): void => {
    if (!isClient) {
      return;
    }
    
    try {
      const applications = getJobApplications();
      const updatedApplications = applications.map(app => 
        app.id === application.id ? application : app
      );
      
      saveJobApplications(updatedApplications);
    } catch (error) {
      console.error('Error updating job application:', error);
    }
  };
  
  export const removeJobApplication = (id: string): void => {
    if (!isClient) {
      return;
    }
    
    try {
      const applications = getJobApplications();
      const filteredApplications = applications.filter(app => app.id !== id);
      
      saveJobApplications(filteredApplications);
    } catch (error) {
      console.error('Error removing job application:', error);
    }
  };
  
  // Jobs functions
  export const getJobs = (): Job[] => {
    if (!isClient) {
      return [];
    }
    
    try {
      const savedJobs = localStorage.getItem('jobListings');
      if (savedJobs) {
        return JSON.parse(savedJobs);
      } else {
        // Initialize with sample data
        localStorage.setItem('jobListings', JSON.stringify(sampleJobs));
        return sampleJobs;
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return [];
    }
  };
  
  export const saveJobs = (jobs: Job[]): void => {
    if (!isClient) {
      return;
    }
    
    try {
      localStorage.setItem('jobListings', JSON.stringify(jobs));
    } catch (error) {
      console.error('Error saving jobs to localStorage:', error);
    }
  };
  
  export const addJob = (job: Job): void => {
    if (!isClient) {
      return;
    }
    
    try {
      const jobs = getJobs();
      // Check if the job already exists
      const exists = jobs.some(j => j.id === job.id);
      
      if (!exists) {
        jobs.push(job);
        saveJobs(jobs);
      }
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };
  
  // Helper function to generate a unique ID
  export const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };