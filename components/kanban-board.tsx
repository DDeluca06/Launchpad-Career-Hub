"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/basic/card";
import { Button } from "@/components/ui/basic/button";
import { Badge } from "@/components/ui/basic/badge";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/basic/avatar";
import { MapPin, DollarSign } from "lucide-react";

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
  location: string;
  salary: string;
  recruiter: string;
  companyLogo: string;
}

interface KanbanBoardProps {
  jobs: KanbanJob[];
  onJobUpdate: (jobId: string, updates: Partial<KanbanJob>) => void;
}

/**
 * Renders a kanban board displaying job applications organized by status.
 *
 * The component organizes job entries into predefined status columns and displays each job as a card.
 * It updates the board dynamically when the job list changes and invokes a callback when a job's status is updated.
 *
 * @param jobs - An array of job entries to display on the board.
 * @param onJobUpdate - Callback function invoked with a job ID and update payload when a job's status is modified.
 * @returns A JSX element representing the kanban board layout.
 */
export function KanbanBoard({ jobs, onJobUpdate }: KanbanBoardProps) {
  const columns = {
    interested: jobs.filter((job) => job.status === "interested"),
    applied: jobs.filter((job) => job.status === "applied"),
    interview: jobs.filter((job) => job.status === "interview"),
    offer: jobs.filter((job) => job.status === "offer"),
    rejected: jobs.filter((job) => job.status === "rejected"),
  };

  return (
    <div className="flex gap-4 overflow-x-auto p-4">
      {Object.entries(columns).map(([status, jobs]) => (
        <div
          key={status}
          className="flex flex-col w-80 min-w-[20rem] bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm"
        >
          <div className="p-4 border-b dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
              {status}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
            </p>
          </div>
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {jobs.map((job) => (
              <Card
                key={job.id}
                className="hover:shadow-md transition-shadow duration-200 dark:border-gray-700 dark:bg-gray-800"
              >
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {job.title}
                      </CardTitle>
                      <CardDescription className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {job.company}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={status === "applied" ? "default" : "outline"}
                      className="ml-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                    >
                      {status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="h-4 w-4 mr-2" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <DollarSign className="h-4 w-4 mr-2" />
                      {job.salary}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center border-t dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={job.companyLogo} alt={job.company} />
                      <AvatarFallback>{job.company.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {job.recruiter}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Recruiter
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                    onClick={() => onJobUpdate(job.id, { status: "viewed" })}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
