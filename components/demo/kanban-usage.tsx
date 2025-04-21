"use client";

import { useState, useEffect } from 'react';
import { KanbanPage } from '../kanban/KanbanPage';
import { JobApplication, Stage, SubStage } from '@/types/application-stages';

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
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    job: {
      title: 'Backend Developer',
      company: 'ServerStack'
    },
    status: 'offer',
    updatedAt: new Date().toISOString()
  }
];

// Transform the mock applications to match JobApplication interface
const transformApplications = (apps: typeof MOCK_APPLICATIONS): JobApplication[] => {
  return apps.map(app => ({
    id: app.id,
    title: app.job.title,
    company: app.job.company,
    description: 'Mock job description',
    stage: app.status as Stage,
    status: app.status as Stage,
    subStage: null as SubStage,
    date: app.updatedAt,
    tags: [],
    archived: false,
    logo: 'https://placehold.co/150',
    location: 'Remote',
    salary: 'Competitive',
    url: '',
    notes: ''
  }));
};

export default function KanbanDemo() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data from an API
    const loadData = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Transform mock data to match JobApplication interface
      const transformedApps = transformApplications(MOCK_APPLICATIONS);
      setApplications(transformedApps);
      
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  // Handle status change
  const handleStatusChange = async (applicationId: string, newStatus: string, subStage?: string) => {
    console.log(`Updating application ${applicationId} to status ${newStatus} ${subStage ? `with substage ${subStage}` : ''}`);
    
    // Update local state
    setApplications(prevApps => 
      prevApps.map(app => 
        app.id === applicationId 
          ? { 
              ...app, 
              status: newStatus as Stage, 
              stage: newStatus as Stage,
              subStage: (subStage || null) as SubStage 
            } 
          : app
      )
    );
    
    // In a real app, you would call your API here
    // await fetch(`/api/applications/${applicationId}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ status: newStatus, subStage })
    // })
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Application Pipeline</h1>
      
      <KanbanPage 
        applications={applications}
        isLoading={isLoading}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}