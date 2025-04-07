"use client";

import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/basic/button";
import { Plus } from "lucide-react";

interface KanbanJob {
  id: string;
  title: string;
  company: string;
  status: string;
  description: string;
  appliedDate: string;
  nextStep: string;
  notes: string;
  logo?: string;
}

interface KanbanBoardProps {
  jobs: KanbanJob[];
  onJobUpdate: (jobId: string, updates: Partial<KanbanJob>) => void;
}

export function KanbanBoard({ jobs, onJobUpdate }: KanbanBoardProps) {
  const [columns, setColumns] = useState<Record<string, KanbanJob[]> & { [key: string]: KanbanJob[] }>({
    'applied': [],
    'interview-scheduled': [],
    'interview-completed': [],
    'offer-received': [],
    'rejected': []
  });

  useEffect(() => {
    const newColumns: Record<string, KanbanJob[]> & { [key: string]: KanbanJob[] } = {
      'applied': [],
      'interview-scheduled': [],
      'interview-completed': [],
      'offer-received': [],
      'rejected': []
    };

    jobs.forEach(job => {
      if (newColumns[job.status]) {
        newColumns[job.status].push(job);
      }
    });

    setColumns(newColumns);
  }, [jobs]);

  const handleJobUpdate = (jobId: string, updates: Partial<KanbanJob>) => {
    onJobUpdate(jobId, updates);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {Object.entries(columns).map(([status, jobs]) => (
        <div key={status} className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">
              {status.replace(/-/g, ' ')}
            </h3>
            <span className="text-sm text-gray-500">
              {jobs.length} jobs
            </span>
          </div>

          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg p-4 border border-gray-200 hover:border-launchpad-blue transition-colors"
              >
                <div className="flex items-center gap-4 mb-4">
                  {job.logo ? (
                    <div className="w-12 h-12 relative">
                      <img
                        src={job.logo}
                        alt={`${job.company} logo`}
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Plus className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-500">{job.company}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" size="sm">{job.status}</Button>
                    <Button variant="secondary" size="sm">Applied: {job.appliedDate}</Button>
                    <Button variant="secondary" size="sm">Next Step: {job.nextStep}</Button>
                  </div>

                  <p className="text-gray-600 line-clamp-3">{job.description}</p>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">{job.notes}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleJobUpdate(job.id, { status: 'rejected' })}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}