"use client";

import React from 'react';
import { JobApplication, Stage, SubStage } from '@/types/application-stages';
import { KanbanColumn } from './KanbanColumn';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

interface ApplicationPipelineProps {
  readonly jobs: JobApplication[];
  readonly onUpdateJob: (jobId: string, updates: Partial<JobApplication>) => void;
  readonly onArchiveJob: (jobId: string) => void;
  readonly onEditJob: (job: JobApplication) => void;
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
    referrals: jobs.filter(job => job.status === 'referrals'),
    accepted: jobs.filter(job => job.status === 'accepted'),
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

    // Extract the target stage and substage from the destination droppableId
    // Format could be either "stage" or "stage:substage"
    const [targetStage, targetSubStage] = destination.droppableId.split(':');

    // Update the job status based on the destination column
    const updates: Partial<JobApplication> = {
      status: targetStage as Stage,
      stage: targetStage as Stage
    };

    // If there's a substage in the destination, update that too
    if (targetSubStage) {
      updates.subStage = targetSubStage as SubStage;
    } else if (job.subStage && targetStage !== job.stage) {
      // If moving to a different stage, reset the substage
      updates.subStage = null;
    }

    onUpdateJob(job.id, updates);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <KanbanColumn 
          title="Referrals" 
          jobs={columns.referrals} 
          status="referrals"
          onUpdateJob={onUpdateJob}
          onArchiveJob={onArchiveJob}
          onEditJob={onEditJob}
        />
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
      </div>
    </DragDropContext>
  );
}
