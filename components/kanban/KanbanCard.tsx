/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { Task } from '@/types';
import { Draggable } from 'react-beautiful-dnd';
import { Card, CardContent } from '@/components/ui/basic/card';
import { Button } from '@/components/ui/basic/button';
import { Clock, Edit, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/form/checkbox';

interface KanbanCardProps {
  task: Task;
  index: number;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onStartTimer: (task: Task) => void;
}

export function KanbanCard({
  task,
  index,
  onUpdateTask,
  onDeleteTask,
  onEditTask,
  onStartTimer,
}: KanbanCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
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
                      checked={task.status === 'offer' || task.status === 'rejected'}
                      onCheckedChange={(checked) => {
                        onUpdateTask(task.id, {
                          status: checked ? 'offer' : 'interested',
                        });
                      }}
                      className="mt-1"
                    />
                    <div>
                      <h3 className={`font-medium ${task.status === 'offer' || task.status === 'rejected' ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {task.description.length > 100
                            ? `${task.description.substring(0, 100)}...`
                            : task.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {task.tags && task.tags.length > 0 && task.tags.map((tag, index) => (
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
                      onClick={() => onStartTimer(task)}
                    >
                      <Clock className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onEditTask(task)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onDeleteTask(task.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
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
