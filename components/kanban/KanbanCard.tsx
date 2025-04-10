"use client";

import React from 'react';
import { Task } from '@/types';
import { Draggable } from 'react-beautiful-dnd';
import { Card, CardContent } from '@/components/ui/basic/card';
import { Button } from '@/components/ui/basic/button';
import { formatDate } from '@/lib/store';
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
  // Get priority badge color
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

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
                          status: checked ? 'offer' : 'saved',
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
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getPriorityColor()}`}>
                      {task.priority}
                    </span>
                    
                    {task.dueDate && (
                      <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-600 px-2 py-0.5 text-xs font-medium">
                        {formatDate(new Date(task.dueDate))}
                      </span>
                    )}
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
