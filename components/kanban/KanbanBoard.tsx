"use client";

import React from 'react';
import { Task } from '@/types';
import { KanbanColumn } from './KanbanColumn';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

interface ApplicationPipelineProps {
  readonly jobs: Task[];
  readonly onUpdateJob: (jobId: string, updates: Partial<Task>) => void;
  readonly onArchiveJob: (jobId: string) => void;
  readonly onEditJob: (job: Task) => void;
}

export function ApplicationPipeline({
  jobs,
  onUpdateJob,
  onArchiveJob,
  onEditJob,
}: Readonly<ApplicationPipelineProps>) {
  // Group jobs by status
  const columns = {
    interested: jobs.filter(job => job.status === 'interested'),
    applied: jobs.filter(job => job.status === 'applied'),
    interview: jobs.filter(job => job.status === 'interview'),
    offer: jobs.filter(job => job.status === 'offer'),
    rejected: jobs.filter(job => job.status === 'rejected'),
  };

  // Handle drag and drop
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or the item was dropped back in its original position
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    // Find the job that was dragged
    const job = jobs.find(j => j.id === draggableId);
    if (!job) return;

    // Update the job status based on the destination column
    onUpdateJob(job.id, {
      status: destination.droppableId as 'interested' | 'applied' | 'interview' | 'offer' | 'rejected'
    });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <KanbanColumn 
          title="Interested" 
          jobs={columns.interested} 
          status="interested"
          onUpdateJob={onUpdateJob}
          onArchiveJob={onArchiveJob}
          onEditJob={onEditJob}
        />
        <KanbanColumn 
          title="Applied" 
          jobs={columns.applied} 
          status="applied"
          onUpdateJob={onUpdateJob}
          onArchiveJob={onArchiveJob}
          onEditJob={onEditJob}
        />
        <KanbanColumn 
          title="Interview" 
          jobs={columns.interview} 
          status="interview"
          onUpdateJob={onUpdateJob}
          onArchiveJob={onArchiveJob}
          onEditJob={onEditJob}
        />
        <KanbanColumn 
          title="Offer" 
          jobs={columns.offer} 
          status="offer"
          onUpdateJob={onUpdateJob}
          onArchiveJob={onArchiveJob}
          onEditJob={onEditJob}
        />
        <KanbanColumn 
          title="Rejected" 
          jobs={columns.rejected} 
          status="rejected"
          onUpdateJob={onUpdateJob}
          onArchiveJob={onArchiveJob}
          onEditJob={onEditJob}
        />
      </div>
    </DragDropContext>
  );
}
