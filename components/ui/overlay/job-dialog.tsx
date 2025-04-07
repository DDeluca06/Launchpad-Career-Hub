"use client"

import * as React from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from "@/components/ui/overlay/dialog"
import { Button } from "@/components/ui/basic/button"
import { 
  Briefcase, 
  MapPin, 
  BadgeDollarSign
} from "lucide-react"

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  salary: string;
  requirements: string[];
  postedDate: string;
  logo?: string;
}

interface JobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job;
  onApply: () => void;
}

export function JobDialog({ open, onOpenChange, job, onApply }: JobDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{job.title}</DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span>{job.company}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <BadgeDollarSign className="h-4 w-4" />
                <span>{job.salary}</span>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Job Description</h3>
            <p className="text-gray-600">{job.description}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Requirements</h3>
            <ul className="list-disc list-inside text-gray-600">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">Posted {job.postedDate}</p>
            <Button
              onClick={onApply}
              className="bg-launchpad-blue hover:bg-launchpad-teal text-white"
            >
              Apply Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}