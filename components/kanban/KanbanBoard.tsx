"use client";

import React from 'react';
import { Task } from '@/types';
import { KanbanColumn } from './KanbanColumn';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

interface ApplicationPipelineProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onStartTimer: (task: Task) => void;
}

export function ApplicationPipeline({
  tasks,
  onUpdateTask,
  onDeleteTask,
  onEditTask,
  onStartTimer,
}: ApplicationPipelineProps) {
  // Group tasks by status
  const columns = {
    interested: tasks.filter(task => task.status === 'interested'),
    applied: tasks.filter(task => task.status === 'applied'),
    interview: tasks.filter(task => task.status === 'interview'),
    offer: tasks.filter(task => task.status === 'offer'),
    rejected: tasks.filter(task => task.status === 'rejected'),
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

    // Find the task that was dragged
    const task = tasks.find(t => t.id === draggableId);
    if (!task) return;

    // Update the task status based on the destination column
    onUpdateTask(task.id, {
      status: destination.droppableId as 'interested' | 'applied' | 'interview' | 'offer' | 'rejected'
    });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <KanbanColumn 
          title="Interested" 
          tasks={columns.interested} 
          status="interested"
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
          onStartTimer={onStartTimer}
        />
        <KanbanColumn 
          title="Applied" 
          tasks={columns.applied} 
          status="applied"
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
          onStartTimer={onStartTimer}
        />
        <KanbanColumn 
          title="Interview" 
          tasks={columns.interview} 
          status="interview"
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
          onStartTimer={onStartTimer}
        />
        <KanbanColumn 
          title="Offer" 
          tasks={columns.offer} 
          status="offer"
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
          onStartTimer={onStartTimer}
        />
        <KanbanColumn 
          title="Rejected" 
          tasks={columns.rejected} 
          status="rejected"
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
          onStartTimer={onStartTimer}
        />
      </div>
    </DragDropContext>
  );
}
