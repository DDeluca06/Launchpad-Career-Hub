"use client";

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Task } from '@/types';
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
  DialogTrigger 
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
  PlusCircle, 
  Search, 
  Filter,
  Archive
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

// Job form schema
const jobFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['interested', 'applied', 'interview', 'offer', 'rejected']),
  tags: z.array(z.string()).optional(),
  archived: z.boolean().optional(),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

export function KanbanPage() {
  const { tasks: jobs, addTask: addJob, updateTask: updateJob, deleteTask: archiveJob } = useAppStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('active');

  // Create form
  const createForm = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'interested',
      tags: [],
      archived: false,
    },
  });

  // Edit form
  const editForm = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'interested',
      tags: [],
      archived: false,
    },
  });

  // Handle create job
  const onCreateSubmit = (data: JobFormValues) => {
    addJob({
      title: data.title,
      description: data.description || '',
      status: data.status,
      tags: data.tags || [],
      archived: false,
    });
    
    toast.success('Job created successfully');
    setIsCreateDialogOpen(false);
    createForm.reset();
  };

  // Handle edit job
  const onEditSubmit = (data: JobFormValues) => {
    if (!selectedJob) return;
    
    updateJob(selectedJob.id, {
      title: data.title,
      description: data.description || '',
      status: data.status,
      tags: data.tags || [],
      archived: data.archived,
    });
    
    toast.success('Job updated successfully');
    setIsEditDialogOpen(false);
    setSelectedJob(null);
  };

  // Handle archive job
  const handleArchiveJob = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      updateJob(jobId, { archived: true });
      toast.success('Job archived successfully');
    }
  };

  // Handle restore job
  const handleRestoreJob = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      updateJob(jobId, { archived: false });
      toast.success('Job restored successfully');
    }
  };

  // Handle permanent delete job
  const handleDeleteJob = (jobId: string) => {
    archiveJob(jobId);
    toast.success('Job permanently deleted');
  };

  // Handle edit job button click
  const handleEditJob = (job: Task) => {
    setSelectedJob(job);
    editForm.reset({
      title: job.title,
      description: job.description,
      status: job.status,
      tags: job.tags,
      archived: job.archived || false,
    });
    setIsEditDialogOpen(true);
  };

  // Filter active jobs
  const activeJobs = jobs
    .filter((job: Task) => {
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
  const archivedJobs = jobs
    .filter((job: Task) => {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Application Pipeline</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <PlusCircle className="h-4 w-4" />
              <span>Add Job</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Job</DialogTitle>
              <DialogDescription>
                Add a new job to your board. Fill out the details below.
              </DialogDescription>
            </DialogHeader>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                <FormField
                  control={createForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Job title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Job description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
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
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter tags separated by commas" 
                          value={field.value?.join(', ') || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            const tagsArray = value.split(',').map(tag => tag.trim()).filter(Boolean);
                            field.onChange(tagsArray);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Create Job</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
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
                        {job.tags && job.tags.length > 0 && job.tags.map((tag, index) => (
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
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteJob(job.id)}
                      >
                        Delete
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
            <DialogTitle>Edit Job</DialogTitle>
            <DialogDescription>
              Update the details of your job.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Job title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Job description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter tags separated by commas" 
                        value={field.value?.join(', ') || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          const tagsArray = value.split(',').map(tag => tag.trim()).filter(Boolean);
                          field.onChange(tagsArray);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Update Job</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
