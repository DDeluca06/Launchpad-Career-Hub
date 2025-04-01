"use client";

import React, { useState, useEffect } from "react";
import { JobCard, JobStatus } from "@/components/job-card";
import { DragDropContext, Droppable, Draggable, DroppableProvided, DroppableStateSnapshot, DraggableProvided, DraggableStateSnapshot, DropResult } from "react-beautiful-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/basic/card";
import { Button } from "@/components/ui/basic/button";
import { Input } from "@/components/ui/form/input";
import { Search, Filter, Plus } from "lucide-react";
import { jobService, applicationService, userService, Application, Job, User } from "@/lib/local-storage";
import { motion, AnimatePresence } from "framer-motion";
import { MultiPurposeModal } from "@/components/ui/overlay/multi-purpose-modal";
import { JobFilters } from "@/components/job-filters";

// Update the Job interface to extend the one from local-storage
interface KanbanJob extends Job {
  status: JobStatus;
}

// Define columns for the application status
const COLUMNS: { id: JobStatus; title: string }[] = [
  { id: "interested", title: "Interested" },
  { id: "applied", title: "Applied" },
  { id: "phoneScreening", title: "Phone Screening" },
  { id: "interviewStage", title: "Interview Stage" },
  { id: "finalInterviewStage", title: "Final Interview" },
  { id: "offerExtended", title: "Offer Extended" },
  { id: "negotiation", title: "Negotiation" },
  { id: "offerAccepted", title: "Offer Accepted" },
  { id: "rejected", title: "Rejected" }
];

export function KanbanBoard() {
  const [jobs, setJobs] = useState<KanbanJob[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  // Load jobs and applications from local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoading(true);

      // Get current user
      const user = userService.getCurrentUser();
      setCurrentUser(user);
      
      // Get all jobs from local storage
      const allJobs = jobService.getAll();
      
      // Get applications for the current user
      const userApplications = user 
        ? applicationService.getByUserId(user.user_id)
        : applicationService.getAll(); // If no user, show all applications
      
      // Combine jobs with their application status
      const jobsWithStatus: KanbanJob[] = allJobs.map(job => {
        const application = userApplications.find(app => app.job_id === job.job_id);
        return {
          ...job,
          status: application ? mapApplicationStatusToJobStatus(application.status) : "interested"
        };
      });
      
      setJobs(jobsWithStatus);
      setApplications(userApplications);
      setIsLoading(false);
    }
  }, []);

  // Helper function to map application status string to JobStatus type
  function mapApplicationStatusToJobStatus(status: string): JobStatus {
    const validStatuses: JobStatus[] = [
      "interested", "applied", "phoneScreening", "interviewStage", 
      "finalInterviewStage", "offerExtended", "negotiation", 
      "offerAccepted", "rejected"
    ];
    
    return validStatuses.includes(status as JobStatus) 
      ? (status as JobStatus) 
      : "interested";
  }

  // Handle drag end event
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    // Return if dropped outside a droppable area or to the same position
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    // Find the job that was dragged
    const jobId = parseInt(draggableId.split("-")[1]);
    const newStatus = destination.droppableId as JobStatus;
    
    // Update the job's status in our local state
    const updatedJobs = jobs.map(job => {
      if (job.job_id === jobId) {
        return { ...job, status: newStatus };
      }
      return job;
    });
    setJobs(updatedJobs);
    
    // Update the application status in local storage
    if (currentUser) {
      const application = applications.find(app => app.job_id === jobId);
      
      if (application) {
        // Update existing application
        applicationService.updateStatus(application.application_id, newStatus);
        
        // Update applications in state
        const updatedApplications = applications.map(app => {
          if (app.job_id === jobId) {
            return { ...app, status: newStatus };
          }
          return app;
        });
        setApplications(updatedApplications);
      } else {
        // Create new application if it doesn't exist
        const newApplication = applicationService.create({
          user_id: currentUser.user_id,
          job_id: jobId,
          status: newStatus,
          resume_id: 0, // This would be set by the user when they apply
          position: "", // This would be set when a specific position is selected
        });
        
        // Add the new application to our state
        setApplications(prevApps => [...prevApps, newApplication]);
      }
    }
  };

  // Filter jobs by search query
  const filteredJobs = jobs.filter(job => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.location?.toLowerCase().includes(query) ||
      job.description?.toLowerCase().includes(query)
    );
  });

  // Group jobs by status for the Kanban columns
  const getJobsByStatus = (status: JobStatus) => {
    return filteredJobs.filter(job => job.status === status);
  };

  // Function to get columns with jobs count
  const getColumnsWithCounts = () => {
    return COLUMNS.map(column => ({
      ...column,
      count: getJobsByStatus(column.id).length
    }));
  };

  // Handle applying filters
  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters);
    setFilterModalOpen(false);
    // Here we would actually filter the jobs based on the filters
    // For now, we'll just set the state and close the modal
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center flex-wrap gap-2">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search jobs..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1"
          onClick={() => setFilterModalOpen(true)}
        >
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        <Button variant="default" size="sm" className="gap-1">
          <Plus className="h-4 w-4" />
          Add Job
        </Button>
      </div>

      {/* Filter Modal */}
      <MultiPurposeModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        title="Filter Jobs"
        description="Find the perfect job opportunity"
        size="md"
        showFooter={true}
        primaryActionText="Apply Filters"
        onPrimaryAction={() => handleApplyFilters(activeFilters)}
        secondaryActionText="Cancel"
        onSecondaryAction={() => setFilterModalOpen(false)}
      >
        <JobFilters
          onApplyFilters={handleApplyFilters}
          initialFilters={activeFilters as any}
        />
      </MultiPurposeModal>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
            {getColumnsWithCounts().map((column) => (
              <div key={column.id} className="w-72 flex-shrink-0">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-md flex justify-between items-center">
                      {column.title}
                      <Badge count={column.count} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[calc(100%-60px)] overflow-y-auto scroll-smooth">
                    <Droppable 
                      droppableId={column.id} 
                      mode="standard"
                      isDropDisabled={false}
                      isCombineEnabled={false}
                      ignoreContainerClipping={false}
                    >
                      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`space-y-2 min-h-[200px] transition-colors ${
                            snapshot.isDraggingOver ? "bg-gray-50 dark:bg-gray-800/50 rounded-md" : ""
                          }`}
                        >
                          <AnimatePresence>
                            {isLoading ? (
                              // Show job card skeletons while loading
                              Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="bg-gray-100 h-28 rounded-md animate-pulse mb-2" />
                              ))
                            ) : (
                              getJobsByStatus(column.id).map((job, index) => (
                                <Draggable
                                  key={`job-${job.job_id}`}
                                  draggableId={`job-${job.job_id}`}
                                  index={index}
                                >
                                  {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        ...provided.draggableProps.style,
                                        opacity: snapshot.isDragging ? 0.8 : 1
                                      }}
                                      className={snapshot.isDragging ? "shadow-md" : ""}
                                    >
                                      <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <JobCard
                                          id={job.job_id.toString()}
                                          title={job.title}
                                          company={job.company}
                                          location={job.location}
                                          jobType={job.job_type}
                                          status={job.status}
                                          draggable
                                        />
                                      </motion.div>
                                    </div>
                                  )}
                                </Draggable>
                              ))
                            )}
                          </AnimatePresence>
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}

// Badge for column counts
function Badge({ count }: { count: number }) {
  return (
    <div className="h-5 min-w-5 inline-flex items-center justify-center rounded-full bg-gray-100 px-2 text-xs">
      {count}
    </div>
  );
} 