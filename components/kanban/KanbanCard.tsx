"use client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { JobApplication } from '@/types/application-stages';
import { Draggable } from 'react-beautiful-dnd';
import { Card, CardContent } from '@/components/ui/basic/card';
import { Button } from '@/components/ui/basic/button';
import { Edit, Archive } from 'lucide-react';

interface KanbanCardProps {
  job: JobApplication;
  index: number;
  onArchiveJob?: (jobId: string) => void;
  onEditJob?: (job: JobApplication) => void;
}

export function KanbanCard({
  job,
  index,
  onArchiveJob,
  onEditJob,
}: KanbanCardProps) {
  const getSubStageClassName = (subStage: string) => {
    if (subStage === 'rejected') {
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
    } else if (subStage === 'accepted') {
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
    } else {
      return 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300';
    }
  };

  return (
    <Draggable draggableId={job.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`${snapshot.isDragging ? 'opacity-75' : ''}`}
        >
          <Card className="bg-white dark:bg-gray-700 shadow-sm hover:shadow transition-shadow">
            <CardContent className="p-3">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`font-medium ${job.subStage === 'rejected' ? 'line-through text-muted-foreground' : ''}`}>
                      {job.title}
                    </h3>
                    {job.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {job.description.length > 100
                          ? `${job.description.substring(0, 100)}...`
                          : job.description}
                      </p>
                    )}
                    {job.subStage && (
                      <div className="mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getSubStageClassName(job.subStage)}`}>
                          {job.subStage.replace(/_/g, ' ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {job.tags && job.tags.length > 0 && job.tags.map((tag) => (
                      <span key={`${job.id}-${tag}`} className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-0.5 text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onEditJob?.(job)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onArchiveJob?.(job.id)}
                    >
                      <Archive className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
}
