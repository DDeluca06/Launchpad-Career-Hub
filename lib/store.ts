"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '@/types';
import { format } from 'date-fns';

// Helper function to format dates
export const formatDate = (date: Date): string => {
  return format(date, 'MMM d, yyyy');
};

// Define the store state
interface AppState {
  // Task management
  tasks: Task[];
  addTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  
  // Time tracking
  currentTimer: {
    taskId: string | null;
    taskName: string | null;
    startTime: number | null;
    isRunning: boolean;
  };
  startTimeTracking: (taskName: string, taskId: string) => void;
  stopTimeTracking: () => void;
  
  // Time entries
  timeEntries: {
    id: string;
    taskId: string | null;
    taskName: string;
    startTime: number;
    endTime: number;
    duration: number; // in milliseconds
  }[];
  addTimeEntry: (entry: Omit<AppState['timeEntries'][0], 'id'>) => void;
}

// Create the store
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Task management
      tasks: [],
      addTask: (taskData) => set((state) => ({
        tasks: [
          ...state.tasks,
          {
            id: uuidv4(),
            ...taskData,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      })),
      updateTask: (taskId, updates) => set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId
            ? { ...task, ...updates, updatedAt: new Date() }
            : task
        ),
      })),
      deleteTask: (taskId) => set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId),
      })),
      
      // Time tracking
      currentTimer: {
        taskId: null,
        taskName: null,
        startTime: null,
        isRunning: false,
      },
      startTimeTracking: (taskName, taskId) => set({
        currentTimer: {
          taskId,
          taskName,
          startTime: Date.now(),
          isRunning: true,
        },
      }),
      stopTimeTracking: () => set((state) => {
        if (!state.currentTimer.isRunning || !state.currentTimer.startTime) {
          return { currentTimer: { ...state.currentTimer, isRunning: false } };
        }
        
        const endTime = Date.now();
        const duration = endTime - state.currentTimer.startTime;
        
        // Add time entry
        const newTimeEntry = {
          id: uuidv4(),
          taskId: state.currentTimer.taskId,
          taskName: state.currentTimer.taskName || 'Unnamed Task',
          startTime: state.currentTimer.startTime,
          endTime,
          duration,
        };
        
        return {
          currentTimer: {
            taskId: null,
            taskName: null,
            startTime: null,
            isRunning: false,
          },
          timeEntries: [...state.timeEntries, newTimeEntry],
        };
      }),
      
      // Time entries
      timeEntries: [],
      addTimeEntry: (entry) => set((state) => ({
        timeEntries: [
          ...state.timeEntries,
          {
            id: uuidv4(),
            ...entry,
          },
        ],
      })),
    }),
    {
      name: 'launchpad-store',
    }
  )
);
