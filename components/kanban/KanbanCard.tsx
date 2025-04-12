/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { Task } from '@/types';
import { Draggable } from 'react-beautiful-dnd';
import { Card, CardContent } from '@/components/ui/basic/card';
import { Button } from '@/components/ui/basic/button';
import { Edit, Archive } from 'lucide-react';
import { Checkbox } from '@/components/ui/form/checkbox';

interface KanbanCardProps {
  job: Task;
  index: number;
  onUpdateJob: (jobId: string, updates: Partial<Task>) => void;
  onArchiveJob: (jobId: string) => void;
  onEditJob: (job: Task) => void;
}

export function KanbanCard({
  job,
  index,
  onUpdateJob,
  onArchiveJob,
  onEditJob,
}: KanbanCardProps) {
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
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      checked={job.status === 'offer' || job.status === 'rejected'}
                      onCheckedChange={(checked) => {
                        onUpdateJob(job.id, {
                          status: checked ? 'offer' : 'interested',
                        });
                      }}
                      className="mt-1"
                    />
                    <div>
                      <h3 className={`font-medium ${job.status === 'offer' || job.status === 'rejected' ? 'line-through text-muted-foreground' : ''}`}>
                        {job.title}
                      </h3>
                      {job.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {job.description.length > 100
                            ? `${job.description.substring(0, 100)}...`
                            : job.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {job.tags && job.tags.length > 0 && job.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-0.5 text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onEditJob(job)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onArchiveJob(job.id)}
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
