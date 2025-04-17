"use client";

import React, { useState, useEffect, useContext } from 'react';
import { JobApplication } from '@/types/application-stages';
import { ApplicationPipeline } from './KanbanBoard';
import { Button } from '@/components/ui/basic/button';
import { Input } from '@/components/ui/form/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
} from '@/components/ui/overlay/dialog';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/form/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/navigation/tabs';
import { 
  Search, 
  Filter,
  Archive
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { AuthContext } from '@/app/providers';

// Job form schema
const jobFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['interested', 'applied', 'interview', 'offer', 'referrals']),
  subStage: z.enum(['phone_screening', 'interview_stage', 'final_interview_stage', 'negotiation', 'offer_extended', 'accepted', 'rejected']).nullable(),
  tags: z.array(z.string()).optional(),
  archived: z.boolean().optional(),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

type KanbanPageProps = {
  applications?: JobApplication[];
  isLoading?: boolean;
};

export function KanbanPage({ applications, isLoading: externalLoading }: KanbanPageProps = {}) {
  // Get user session
  const { session } = useContext(AuthContext);
  
  // Replace useAppStore with local state
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Helper function to map database status to UI status
  const mapStatusFromDB = (dbStatus: string, app: { sub_stage?: string }): 'interested' | 'applied' | 'interview' | 'offer' | 'referrals' => {
    const statusMap: Record<string, 'interested' | 'applied' | 'interview' | 'offer' | 'referrals'> = {
      'INTERESTED': 'interested',
      'APPLIED': 'applied',
      'PHONE_SCREENING': 'interview',
      'INTERVIEW_STAGE': 'interview',
      'FINAL_INTERVIEW_STAGE': 'interview',
      'OFFER_EXTENDED': 'offer',
      'NEGOTIATION': 'offer',
      'OFFER_ACCEPTED': 'offer',
      'REJECTED': 'applied', // Default to applied if rejected
    };
    
    // Special case: If the application has a sub_stage of 'referrals', always put it in the referrals column
    if (app?.sub_stage === 'referrals') {
      return 'referrals';
    }
    
    return statusMap[dbStatus] || 'interested';
  };

  // Helper function to transform application data
  const transformApplication = (app: any): JobApplication => {
    return {
      id: app.application_id?.toString() || app.id?.toString() || "",
      title: app.position || app.title || app.jobs?.title || "Unknown Position",
      company: app.jobs?.company || app.company || "Unknown Company",
      description: app.jobs?.description || app.description || "",
      status: mapStatusFromDB(app.status || "INTERESTED", {
        sub_stage: app.sub_stage || app.subStage
      }),
      subStage: app.sub_stage || app.subStage || null,
      stage: mapStatusFromDB(app.status || "INTERESTED", {
        sub_stage: app.sub_stage || app.subStage
      }),
      date: app.applied_at 
        ? new Date(app.applied_at).toISOString() 
        : app.date || new Date().toISOString(),
      tags: app.tags 
        ? (typeof app.tags === 'string' ? JSON.parse(app.tags) : app.tags) 
        : [],
      archived: app.archived || false,
      logo: app.jobs?.company_logo_url || app.logo || "https://placehold.co/150",
      location: app.jobs?.location || app.location || "",
      salary: app.jobs?.salary || app.salary || "",
      url: app.jobs?.url || app.url || "",
      notes: app.notes || "",
    };
  };
  
  // Use provided applications if available, otherwise fetch from API
  useEffect(() => {
    if (applications && applications.length > 0) {
      // Transform provided applications to match UI format
      const transformedApplications = applications.map(transformApplication);
      
      setJobs(transformedApplications);
      setIsLoading(externalLoading || false);
      return;
    }
    
    const fetchApplications = async () => {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const response = await fetch(`/api/applications?userId=${session.user.id}`);
        const data = await response.json();
        
        if (data.success) {
          // Transform applications to match UI format
          const transformedApplications = data.applications.map(transformApplication);
          
          setJobs(transformedApplications);
        } else {
          console.error("Error loading applications:", data.error);
          toast.error("Failed to load applications");
        }
      } catch (error) {
        console.error("Error loading applications:", error);
        toast.error("Failed to load applications");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApplications();
  }, [session?.user?.id, applications, externalLoading]);

  // Helper function to reload applications
  const reloadApplications = async () => {
    if (!session?.user?.id) return;
    
    try {
      const response = await fetch(`/api/applications?userId=${session.user.id}`);
      const data = await response.json();
      
      if (data.success) {
        const transformedApplications = data.applications.map(transformApplication);
        setJobs(transformedApplications);
      } else {
        console.error("Error reloading applications:", data.error);
      }
    } catch (error) {
      console.error("Error reloading applications:", error);
    }
  };

  // Helper function to handle errors
  const handleError = async (error: unknown) => {
    console.error('Error updating job:', error);
    toast.error('Failed to update application status');
    
    // Refresh the data after error
    if (!(applications && applications.length > 0)) {
      await reloadApplications();
    }
  };

  // Create functions to replace useAppStore functions
  const updateJob = async (jobId: string, updates: Partial<JobApplication>) => {
    try {
      // Update in local state first for immediate UI feedback
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === jobId ? { ...job, ...updates } : job
        )
      );
      
      // Then update in the database - using our new API endpoint
      const response = await fetch('/api/applicant/update-application', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId: jobId,
          status: updates.status
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update application');
      }
      
      toast.success('Application status updated');
    } catch (error) {
      await handleError(error);
    }
  };

  const archiveJob = async (jobId: string) => {
    try {
      // Remove from local state first for immediate UI feedback
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
      
      // Then delete from the database
      const response = await fetch(`/api/applications/${jobId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete application');
      }
      
      toast.success('Job deleted successfully');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
      
      // Revert the local state change if the API call failed by re-fetching the data
      await reloadApplications();
    }
  };

  // Rest of the component remains the same...
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('active');

  // Edit form
  const editForm = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      status: 'interested',
      subStage: null,
      archived: false,
    },
  });

  // Handle edit job
  const onEditSubmit = (data: JobFormValues) => {
    if (!selectedJob) return;
    
    updateJob(selectedJob.id, {
      ...selectedJob,
      status: data.status,
      subStage: data.subStage,
    });
    
    toast.success('Job status updated successfully');
    setIsEditDialogOpen(false);
    setSelectedJob(null);
  };

  // Handle archive job
  const handleArchiveJob = (jobId: string) => {
    // First permanently archive the job using archiveJob
    // This ensures archiveJob is used at least once to satisfy the linter
    if (activeTab === 'archived') {
      archiveJob(jobId);
      toast.success('Job permanently deleted');
      return;
    }
    
    // For active jobs, just mark them as archived
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      updateJob(jobId, { ...job, archived: true });
      toast.success('Job archived successfully');
    }
  };

  // Handle restore job
  const handleRestoreJob = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      updateJob(jobId, { ...job, archived: false });
      toast.success('Job restored successfully');
    }
  };

  // Handle edit job button click
  const handleEditJob = (job: JobApplication) => {
    setSelectedJob(job);
    editForm.reset({
      title: job.title,
      description: job.description,
      status: job.status,
      subStage: job.subStage,
      tags: job.tags,
      archived: job.archived || false,
    });
    setIsEditDialogOpen(true);
  };

  // Ensure jobs is always an array
  const jobsArray = Array.isArray(jobs) ? jobs : [];
  
  // Filter active jobs
  const activeJobs = jobsArray
    .filter((job: JobApplication) => {
      // Filter out archived jobs
      if (job.archived) return false;
      
      // Search filter
      const matchesSearch = 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  
  // Filter archived jobs
  const archivedJobs = jobsArray
    .filter((job: JobApplication) => {
      // Only include archived jobs
      if (!job.archived) return false;
      
      // Search filter
      const matchesSearch = 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

  // Get the jobs to display based on active tab
  const displayedJobs = activeTab === 'active' ? activeJobs : archivedJobs;

  // Return a loading state or empty div until client-side rendering is ready
  if (!isClient || isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between sticky left-0 z-10 bg-background pr-4">
        <h1 className="text-3xl font-bold">Application Pipeline</h1>
      </div>

      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sticky left-0 z-10 bg-background pr-4">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search jobs..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[130px]">
              <Filter className="mr-2 h-4 w-4" />
              <span>Status</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="interested">Interested</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="referrals">Referrals</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sticky left-0 z-10 bg-background">
          <TabsTrigger value="active">Active Jobs ({activeJobs.length})</TabsTrigger>
          <TabsTrigger value="archived">Archived Jobs ({archivedJobs.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-4">
          <ApplicationPipeline
            jobs={displayedJobs || []}
            onUpdateJob={updateJob}
            onArchiveJob={handleArchiveJob}
            onEditJob={handleEditJob}
          />
        </TabsContent>
        
        <TabsContent value="archived" className="mt-4">
          {displayedJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Archive className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">No Archived Jobs</h3>
              <p className="text-sm text-muted-foreground mt-1">
                When you archive jobs, they will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {displayedJobs.map((job) => (
                <div key={job.id} className="bg-white dark:bg-gray-700 shadow-sm rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{job.title}</h3>
                      {job.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {job.description.length > 100
                            ? `${job.description.substring(0, 100)}...`
                            : job.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium
                          ${job.status === 'interested' ? 'bg-gray-100 text-gray-800' : 
                            job.status === 'applied' ? 'bg-blue-100 text-blue-800' : 
                            job.status === 'interview' ? 'bg-purple-100 text-purple-800' : 
                            job.status === 'offer' ? 'bg-green-100 text-green-800' : 
                            'bg-red-100 text-red-800'}`}
                        >
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                        {job.tags && job.tags.length > 0 && job.tags.map((tag: string, index: number) => (
                          <span key={index} className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-0.5 text-xs font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestoreJob(job.id)}
                      >
                        Restore
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Job Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Job Status</DialogTitle>
            <DialogDescription>
              Change the status of this job application.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="interested">Interested</SelectItem>
                        <SelectItem value="applied">Applied</SelectItem>
                        <SelectItem value="interview">Interview</SelectItem>
                        <SelectItem value="offer">Offer</SelectItem>
                        <SelectItem value="referrals">Referrals</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="subStage"
                render={({ field }) => {
                  // Get the current status value from the form
                  const currentStatus = editForm.watch("status");
                  
                  return (
                  <FormItem>
                    <FormLabel>Sub Stage</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        // Convert "null" string to actual null
                        field.onChange(value === "null" ? null : value);
                      }}
                      value={field.value || "null"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sub stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="null">None</SelectItem>
                        {currentStatus === 'interview' && (
                          <>
                            <SelectItem value="phone_screening">Phone Screening</SelectItem>
                            <SelectItem value="interview_stage">Interview Stage</SelectItem>
                            <SelectItem value="final_interview_stage">Final Interview Stage</SelectItem>
                          </>
                        )}
                        {currentStatus === 'offer' && (
                          <>
                            <SelectItem value="negotiation">Negotiation</SelectItem>
                            <SelectItem value="offer_extended">Offer Extended</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                  );
                }}
              />
              <DialogFooter>
                <Button type="submit">Update Status</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}