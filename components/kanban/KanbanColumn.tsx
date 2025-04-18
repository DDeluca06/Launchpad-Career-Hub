"use client";

import React, { useState } from 'react';
import { JobApplication, Stage, SubStage } from '@/types/application-stages';
import { KanbanCard } from './KanbanCard';
import { Droppable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/basic/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SubStageConfig {
  value: SubStage;
  label: string;
}

interface KanbanColumnProps {
  title: string;
  jobs: JobApplication[];
  status: Stage;
  onUpdateJob: (jobId: string, updates: Partial<JobApplication>) => void;
  onArchiveJob: (jobId: string) => void;
  onEditJob: (job: JobApplication) => void;
}

// Define substages for each column
const columnSubStages: Record<Stage, SubStageConfig[]> = {
  'interview': [
    { value: 'phone_screening', label: 'Phone Screening' },
    { value: 'interview_stage', label: 'Interview Stage' },
    { value: 'final_interview_stage', label: 'Final interview Stage' },
  ],
  'offer': [
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'offer_extended', label: 'Offer Extended' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' },
  ],
  'interested': [],
  'applied': [],
  'referrals': [],
};

export function KanbanColumn({
  title,
  jobs,
  status,
  onArchiveJob,
  onEditJob,
}: KanbanColumnProps) {
  const [expandedSubstages, setExpandedSubstages] = useState<Record<string, boolean>>({});
  
  // Get background color based on status
  const getColumnColor = () => {
    switch (status) {
      case 'interested':
        return 'bg-gray-50 dark:bg-gray-800';
      case 'applied':
        return 'bg-blue-50 dark:bg-blue-900/20';
      case 'interview':
        return 'bg-purple-50 dark:bg-purple-900/20';
      case 'offer':
        return 'bg-green-50 dark:bg-green-900/20';
      case 'referrals':
        return 'bg-yellow-50 dark:bg-yellow-900/20';
      default:
        return 'bg-gray-50 dark:bg-gray-800';
    }
  };

  // Get border color based on status
  const getBorderColor = () => {
    switch (status) {
      case 'interested':
        return 'border-t-gray-500';
      case 'applied':
        return 'border-t-blue-500';
      case 'interview':
        return 'border-t-purple-500';
      case 'offer':
        return 'border-t-green-500';
      case 'referrals':
        return 'border-t-yellow-500';
      default:
        return 'border-t-gray-500';
    }
  };

  // Get substages for this column
  const subStages = columnSubStages[status];
  const hasSubStages = subStages.length > 0;

  // Group jobs by substage if substages exist
  const groupedJobs: Record<string, JobApplication[]> = {};
  
  if (hasSubStages) {
    // Initialize empty arrays for each substage
    subStages.forEach((subStage) => {
      groupedJobs[subStage.value as string] = [];
    });
    
    // Group jobs by substage
    jobs.forEach((job) => {
      if (job.subStage) {
        if (!groupedJobs[job.subStage]) {
          groupedJobs[job.subStage] = [];
        }
        groupedJobs[job.subStage].push(job);
      } else {
        // For jobs without a substage, add them to the first substage group
        if (subStages.length > 0) {
          const firstSubStage = subStages[0].value as string;
          if (!groupedJobs[firstSubStage]) {
            groupedJobs[firstSubStage] = [];
          }
          groupedJobs[firstSubStage].push(job);
        }
      }
    });
  }

  const toggleSubstageExpand = (substage: string) => {
    setExpandedSubstages((prev) => ({
      ...prev,
      [substage]: !prev[substage],
    }));
  };

  return (
    <Card className={`${getColumnColor()} border-t-4 ${getBorderColor()} h-full flex flex-col`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>{title}</span>
          <span className="text-sm font-normal bg-white dark:bg-gray-700 rounded-full px-2 py-1">
            {jobs.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 flex-1 overflow-y-auto">
        <Droppable 
          droppableId={status} 
          isDropDisabled={false} 
          isCombineEnabled={false}
          ignoreContainerClipping={false}
        >
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`min-h-[200px] rounded-md p-2 ${
                snapshot.isDraggingOver ? 'bg-gray-100 dark:bg-gray-700/50' : ''
              }`}
            >
              {hasSubStages ? (
                // Render with substages
                <>
                  {subStages.map((subStage) => {
                    const subStageJobs = groupedJobs[subStage.value as string] || [];
                    const isExpanded = expandedSubstages[subStage.value as string] !== false; // Default to expanded
                    
                    return (
                      <div key={subStage.value as string} className="mb-3">
                        <div 
                          className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded cursor-pointer"
                          onClick={() => toggleSubstageExpand(subStage.value as string)}
                        >
                          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            {subStage.label}
                            <span className="text-xs bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full px-1.5 py-0.5 border">
                              {subStageJobs.length}
                            </span>
                          </div>
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                        
                        {isExpanded && (
                          <div className="mt-2 space-y-2">
                            {subStageJobs.length === 0 ? (
                              <div className="text-center p-2 text-sm text-gray-400 italic bg-gray-50 dark:bg-gray-800/50 rounded">
                                No applications here yet
                              </div>
                            ) : (
                              subStageJobs.map((job, index) => (
                                <KanbanCard
                                  key={job.id}
                                  job={job}
                                  index={index}
                                />
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              ) : (
                // Render without substages
                jobs.length === 0 ? (
                  <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
                    No jobs
                  </div>
                ) : (
                  <div className="space-y-2">
                    {jobs.map((job, index) => (
                      <KanbanCard
                        key={job.id}
                        job={job}
                        index={index}
                        onArchiveJob={onArchiveJob}
                        onEditJob={onEditJob}
                      />
                    ))}
                  </div>
                )
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </CardContent>
    </Card>
  );
}
