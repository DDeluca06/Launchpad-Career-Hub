"use client";

import React, { useState, useEffect, useContext } from 'react';
import { JobApplication, SubStage } from '@/types/application-stages';
import { ApplicationPipeline } from './KanbanBoard';
import { KanbanColumn } from './KanbanColumn';
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
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

// Job form schema
const jobFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['interested', 'applied', 'interview', 'offer', 'referrals', 'accepted', 'rejected']),
  subStage: z.enum(['phone_screening', 'interview_stage', 'final_interview_stage', 'negotiation', 'offer_extended']).nullable(),
  tags: z.array(z.string()).optional(),
  archived: z.boolean().optional(),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

type KanbanPageProps = {
  applications?: JobApplication[];
  isLoading?: boolean;
  onStatusChange?: (applicationId: string, newStatus: string, subStage?: string) => Promise<void>;
  onViewJobDetails?: (applicationId: string, jobId?: string | number) => void;
};

interface Job {
  title: string;
  company: string;
  description: string;
  company_logo_url: string;
  location: string;
  salary: string;
  url: string;
}

interface KanbanApplication {
  application_id: string;
  position: string;
  jobs: Job;
  applied_at: string;
  status: string;
  sub_stage: string;
  tags: string;
  isArchived: boolean;
  notes: string;
}

export function KanbanPage({ 
  applications, 
  isLoading: externalLoading
}: KanbanPageProps = {}) {
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
  
  // Use provided applications if available, otherwise fetch from API
  useEffect(() => {
    const fetchApplications = async () => {
      if (!session?.user?.id) {
        console.log('No user session, skipping fetch');
        setIsLoading(false);
        return;
      }
      
      try {
        console.log('=== FETCHING APPLICATIONS ===');
        setIsLoading(true);
        const userId = session.user.id;
        const timestamp = new Date().getTime();
        const url = `/api/applications?userId=${userId}&t=${timestamp}`;
        
        console.log('Making fetch request:', { url, userId });
        
        const response = await fetch(url, {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        console.log('Fetch response:', {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('=== API RESPONSE ===', {
          success: data.success,
          applicationCount: data.applications?.length,
          applications: data.applications?.map((app: {
            application_id: string | number;
            isArchived: boolean;
            status: string;
            applied_at: string;
          }) => ({
            id: app.application_id,
            isArchived: app.isArchived,
            status: app.status,
            applied_at: app.applied_at
          }))
        });
        
        if (data.success) {
          // Transform applications to match UI format
          const transformedApplications: JobApplication[] = data.applications.map((app: KanbanApplication) => {
            console.log('Processing application:', { 
              id: app.application_id, 
              isArchived: app.isArchived,
              status: app.status,
              applied_at: app.applied_at
            });
            
            const isArchived = app.isArchived ?? false;
            const transformed = {
              id: app.application_id.toString(),
              title: app.jobs.title || "Unknown Position",
              company: app.jobs.company || "Unknown Company",
              description: app.jobs.description || "",
              status: app.status as 'interested' | 'applied' | 'interview' | 'offer' | 'referrals',
              subStage: app.sub_stage as SubStage,
              stage: app.status as 'interested' | 'applied' | 'interview' | 'offer' | 'referrals',
              date: app.applied_at ? new Date(app.applied_at).toISOString() : new Date().toISOString(),
              tags: app.tags ? JSON.parse(app.tags) : [],
              archived: isArchived,
              isArchived: isArchived,
              logo: app.jobs.company_logo_url || "https://placehold.co/150",
              location: app.jobs.location || "",
              salary: app.jobs.salary || "",
              url: app.jobs.url || "",
              notes: app.notes || "",
            };
            console.log('Transformed application:', {
              id: transformed.id,
              isArchived: transformed.isArchived,
              archived: transformed.archived,
              status: transformed.status
            });
            return transformed;
          });
          
          console.log('=== SETTING JOBS STATE ===', {
            total: transformedApplications.length,
            applications: transformedApplications.map(app => ({
              id: app.id,
              isArchived: app.isArchived,
              archived: app.archived,
              status: app.status,
              date: app.date
            }))
          });
          
          setJobs(transformedApplications);
        } else {
          console.error("Error loading applications:", data.error);
          toast.error("Failed to load applications");
        }
      } catch (error) {
        console.error("=== ERROR IN FETCH ===", error);
        toast.error("Failed to load applications");
      } finally {
        setIsLoading(false);
      }
    };
    
    // Always fetch fresh data
    console.log('=== INITIAL FETCH TRIGGER ===', {
      userId: session?.user?.id,
      hasApplications: Boolean(applications?.length),
      isLoading: externalLoading
    });
    fetchApplications();
  }, [session?.user?.id, applications?.length, externalLoading]); // Added missing dependencies

  type RefreshAppData = {
    application_id: string | number;
    position?: string;
    jobs?: {
      title?: string;
      company?: string;
      description?: string;
      company_logo_url?: string;
      location?: string;
      salary?: string;
      url?: string;
    };
    status: string;
    sub_stage?: string | null;
    applied_at?: string;
    tags?: string;
    isArchived?: boolean;
    notes?: string;
  };

  // Helper function to map database status to UI status
  const mapStatusFromDB = (dbStatus: string, app: { sub_stage?: string | null }): 'interested' | 'applied' | 'interview' | 'offer' | 'referrals' => {
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

  // Helper function to handle errors
  const handleError = async (error: unknown) => {
    console.error('Error updating job:', error);
    toast.error('Failed to update application status');
    
    // Refresh the data after error
    if (applications && applications.length > 0) {
      // If we're using external applications, no need to reload
      return;
    }
    
    // Otherwise reload from API
    if (session?.user?.id) {
      const response = await fetch(`/api/applications?userId=${session.user.id}`);
      const data = await response.json();
      
      if (data.success) {
        const transformedApplications = data.applications.map((app: Record<string, unknown>) => ({
          id: String(app.application_id || ""),
          title: String(app.position || (app.jobs as Record<string, unknown>)?.title || "Unknown Position"),
          company: String((app.jobs as Record<string, unknown>)?.company || "Unknown Company"),
          description: String((app.jobs as Record<string, unknown>)?.description || ""),
          status: mapStatusFromDB(String(app.status || "INTERESTED"), {
            sub_stage: app.sub_stage ? String(app.sub_stage) : undefined
          }),
          subStage: app.sub_stage ? String(app.sub_stage) : null,
          stage: mapStatusFromDB(String(app.status || "INTERESTED"), {
            sub_stage: app.sub_stage ? String(app.sub_stage) : undefined
          }),
          date: app.applied_at ? new Date(String(app.applied_at)).toISOString() : new Date().toISOString(),
          tags: app.tags ? JSON.parse(String(app.tags)) : [],
          archived: Boolean(app.archived || false),
          logo: String((app.jobs as Record<string, unknown>)?.company_logo_url || "https://placehold.co/150"),
          location: String((app.jobs as Record<string, unknown>)?.location || ""),
          salary: String((app.jobs as Record<string, unknown>)?.salary || ""),
          url: String((app.jobs as Record<string, unknown>)?.url || ""),
          notes: String(app.notes || ""),
        }));
        
        setJobs(transformedApplications);
      }
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
      const response = await fetch(`/api/applications?applicationId=${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: updates.status?.toUpperCase(),
          subStage: updates.subStage
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update application');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update application');
      }
      
      // Show success toast
      toast.success('Application updated successfully');
      
    } catch (error) {
      handleError(error);
    }
  };

  const handleArchiveJob = async (jobId: string) => {
    try {
      // First update in local state for immediate UI feedback
      setJobs(prevJobs => prevJobs.map(job => 
        job.id === jobId ? { ...job, archived: true } : job
      ));
      
      // Then update in the database
      const response = await fetch(`/api/applications?applicationId=${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          archived: true
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to archive application');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to archive application');
      }
      
      toast.success('Job archived successfully');
    } catch (error) {
      console.error('Error archiving job:', error);
      toast.error('Failed to archive job');
      // Revert the local state change
      setJobs(prevJobs => prevJobs.map(job => 
        job.id === jobId ? { ...job, archived: false } : job
      ));
    }
  };

  // Handle restore job
  const handleRestoreJob = async (jobId: string) => {
    try {
      console.log('=== RESTORING JOB ===', { jobId });
      
      // First update in local state for immediate UI feedback
      setJobs(prevJobs => prevJobs.map(job => 
        job.id === jobId ? { ...job, archived: false, isArchived: false } : job
      ));
      
      // Then update in the database
      const response = await fetch(`/api/applications?applicationId=${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          archived: false
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to restore application');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to restore application');
      }
      
      console.log('=== JOB RESTORED SUCCESSFULLY ===', { jobId });
      toast.success('Job restored successfully');
      
      // Refresh the data to ensure consistency
      if (session?.user?.id) {
        const timestamp = new Date().getTime();
        const url = `/api/applications?userId=${session.user.id}&t=${timestamp}`;
        const refreshResponse = await fetch(url, {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          if (refreshData.success) {
            const transformedApplications = refreshData.applications.map((app: RefreshAppData) => {
              const isArchived = app.isArchived ?? false;
              return {
                id: app.application_id.toString(),
                title: app.position || app.jobs?.title || "Unknown Position",
                company: app.jobs?.company || "Unknown Company",
                description: app.jobs?.description || "",
                status: mapStatusFromDB(app.status, app),
                subStage: app.sub_stage || null,
                stage: mapStatusFromDB(app.status, app),
                date: app.applied_at ? new Date(app.applied_at).toISOString() : new Date().toISOString(),
                tags: app.tags ? JSON.parse(app.tags) : [],
                archived: isArchived,
                isArchived: isArchived,
                logo: app.jobs?.company_logo_url || "https://placehold.co/150",
                location: app.jobs?.location || "",
                salary: app.jobs?.salary || "",
                url: app.jobs?.url || "",
                notes: app.notes || "",
              };
            });
            setJobs(transformedApplications);
          }
        }
      }
    } catch (error) {
      console.error('Error restoring job:', error);
      toast.error('Failed to restore job');
      // Revert the local state change
      setJobs(prevJobs => prevJobs.map(job => 
        job.id === jobId ? { ...job, archived: true, isArchived: true } : job
      ));
    }
  };

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

  // Handle edit job button click
  const handleEditJob = (job: JobApplication) => {
    setSelectedJob(job);
    
    // Convert any legacy 'accepted' or 'rejected' subStage values to null
    // since they're now top-level statuses
    let subStageValue = job.subStage;
    if (subStageValue === 'accepted' || subStageValue === 'rejected') {
      subStageValue = null;
    }
    
    editForm.reset({
      title: job.title,
      description: job.description,
      status: job.status,
      subStage: subStageValue,
      tags: job.tags,
      archived: job.archived || false,
    });
    setIsEditDialogOpen(true);
  };

  // Filter active jobs
  const activeJobs = jobs
    .filter((job: JobApplication) => {
      // Filter out archived jobs
      const isArchived = Boolean(job.archived || job.isArchived);
      console.log('Active filter - Job archive status:', { 
        id: job.id, 
        archived: job.archived, 
        isArchived: job.isArchived, 
        finalStatus: isArchived,
        date: job.date
      });
      if (isArchived) return false;
      
      // Search filter
      const matchesSearch = 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

  // Filter archived jobs
  const archivedJobs = jobs
    .filter((job: JobApplication) => {
      // Only include archived jobs
      const isArchived = Boolean(job.archived || job.isArchived);
      console.log('Archive filter - Checking for archived job:', { 
        id: job.id, 
        archived: job.archived, 
        isArchived: job.isArchived, 
        finalStatus: isArchived,
        date: job.date
      });
      if (!isArchived) return false;
      
      // Search filter
      const matchesSearch = 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

  console.log('Filtered jobs:', {
    total: jobs.length,
    active: activeJobs.length,
    archived: archivedJobs.length,
    allJobs: jobs.map(job => ({
      id: job.id,
      archived: job.archived,
      isArchived: job.isArchived,
      date: job.date
    }))
  });

  // Filter specifically for accepted and rejected jobs
  const acceptedJobs = archivedJobs.filter((job: JobApplication) => 
    job.status === 'accepted' && (
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) && (statusFilter === 'all' || job.status === statusFilter)
  );

  const rejectedJobs = archivedJobs.filter((job: JobApplication) => 
    job.status === 'rejected' && (
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) && (statusFilter === 'all' || job.status === statusFilter)
  );

  // Get the jobs to display based on active tab
  const displayedJobs = activeTab === 'active' ? activeJobs : archivedJobs;

  // Return a loading state or empty div until client-side rendering is ready
  if (!isClient || isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  // Add onDragEnd handler with proper type from react-beautiful-dnd
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    // If dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Update the job status
    updateJob(draggableId, {
      status: destination.droppableId as 'interested' | 'applied' | 'interview' | 'offer' | 'referrals',
      subStage: null // Reset subStage when moving between columns
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col h-full">
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
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active Jobs ({activeJobs.length})</TabsTrigger>
            <TabsTrigger value="archived">Archived Jobs ({archivedJobs.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-4">
            <ApplicationPipeline
              jobs={displayedJobs}
              onUpdateJob={updateJob}
              onArchiveJob={handleArchiveJob}
              onEditJob={handleEditJob}
            />
          </TabsContent>
          
          <TabsContent value="archived" className="mt-4">
            {displayedJobs.length === 0 && acceptedJobs.length === 0 && rejectedJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Archive className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">No Archived Jobs</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  When you archive jobs, they will appear here.
                </p>
              </div>
            ) : (
              <>
                {/* Accepted and Rejected Kanban Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <KanbanColumn 
                    title="Accepted" 
                    jobs={acceptedJobs} 
                    status="accepted"
                    onUpdateJob={updateJob}
                    onArchiveJob={handleArchiveJob}
                    onEditJob={handleEditJob}
                  />
                  <KanbanColumn 
                    title="Rejected" 
                    jobs={rejectedJobs} 
                    status="rejected"
                    onUpdateJob={updateJob}
                    onArchiveJob={handleArchiveJob}
                    onEditJob={handleEditJob}
                  />
                </div>
                
                {/* Other archived jobs */}
                <h3 className="font-medium text-lg mb-4">Other Archived Jobs</h3>
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
                                job.status === 'referrals' ? 'bg-red-100 text-red-800' : 
                                job.status === 'accepted' ? 'bg-green-100 text-green-800' : 
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
              </>
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
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
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
    </DragDropContext>
  );
}