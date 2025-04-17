"use client";

import { useState, useEffect } from 'react';
import KanbanBoard from '../kanban-board';

// Example application data
const MOCK_APPLICATIONS = [
  {
    id: '1',
    job: {
      title: 'Frontend Developer',
      company: 'TechCorp'
    },
    status: 'interested',
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    job: {
      title: 'UX Designer',
      company: 'DesignHub'
    },
    status: 'applied',
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    job: {
      title: 'Product Manager',
      company: 'ProductLabs'
    },
    status: 'interview',
    subStage: 'phone_screening',
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    job: {
      title: 'Backend Engineer',
      company: 'ServerTech'
    },
    status: 'interview',
    subStage: 'interview_stage',
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    job: {
      title: 'DevOps Engineer',
      company: 'CloudOps'
    },
    status: 'interview',
    subStage: 'final_interview_stage',
    updatedAt: new Date().toISOString()
  },
  {
    id: '6',
    job: {
      title: 'Full Stack Developer',
      company: 'WebStack'
    },
    status: 'offer',
    subStage: 'negotiation',
    updatedAt: new Date().toISOString()
  },
  {
    id: '7',
    job: {
      title: 'Data Scientist',
      company: 'DataInsights'
    },
    status: 'offer',
    subStage: 'offer_extended',
    updatedAt: new Date().toISOString()
  },
  {
    id: '8',
    job: {
      title: 'Software Engineer',
      company: 'CodeWorks'
    },
    status: 'offer',
    subStage: 'accepted',
    updatedAt: new Date().toISOString()
  },
  {
    id: '9',
    job: {
      title: 'Project Manager',
      company: 'Projectify'
    },
    status: 'offer',
    subStage: 'rejected',
    updatedAt: new Date().toISOString()
  },
  {
    id: '10',
    job: {
      title: 'QA Engineer',
      company: 'QualityTech'
    },
    status: 'referrals',
    updatedAt: new Date().toISOString()
  }
];

// Define correct types for our applications
interface Application {
  id: string;
  job: {
    title: string;
    company: string;
  };
  status: string;
  subStage?: string | null;
  updatedAt: string;
}

export default function KanbanDemo() {
  const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Handle status changes from drag and drop
  const handleStatusChange = (applicationId: string, newStatus: string, subStage?: string) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: newStatus, subStage: subStage || null } 
          : app
      )
    );

    console.log(`Application ${applicationId} moved to ${newStatus}${subStage ? ` (${subStage})` : ''}`);
    
    // Here you would typically call your API to update the status
    // Example:
    // fetch(`/api/applications/${applicationId}/status`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ status: newStatus, subStage })
    // })
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Application Pipeline</h1>
      
      <KanbanBoard 
        applications={applications}
        isLoading={isLoading}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
} 