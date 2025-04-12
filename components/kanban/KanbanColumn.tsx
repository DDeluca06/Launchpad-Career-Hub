"use client";

import React from 'react';
import { Task } from '@/types';
import { KanbanCard } from './KanbanCard';
import { Droppable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/basic/card';

interface KanbanColumnProps {
  title: string;
  jobs: Task[];
  status: 'interested' | 'applied' | 'interview' | 'offer' | 'rejected';
  onUpdateJob: (jobId: string, updates: Partial<Task>) => void;
  onArchiveJob: (jobId: string) => void;
  onEditJob: (job: Task) => void;
}

export function KanbanColumn({
  title,
  jobs,
  status,
  onUpdateJob,
  onArchiveJob,
  onEditJob,
}: KanbanColumnProps) {
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
      case 'rejected':
        return 'bg-red-50 dark:bg-red-900/20';
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
      case 'rejected':
        return 'border-t-red-500';
      default:
        return 'border-t-gray-500';
    }
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
      <CardContent className="p-2">
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
              {jobs.length === 0 ? (
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
                      onUpdateJob={onUpdateJob}
                      onArchiveJob={onArchiveJob}
                      onEditJob={onEditJob}
                    />
                  ))}
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </CardContent>
    </Card>
  );
}
