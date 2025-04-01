"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/badge"
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  CalendarDays, 
  DollarSign, 
  Clock,
  Globe,
  CheckCircle2,
  XCircle
} from "lucide-react"
import { JobStatus } from "@/components/job-card"

interface JobDetails {
  id: string
  title: string
  company: string
  location?: string
  jobType?: string
  salary?: string
  description?: string
  requirements?: string[]
  responsibilities?: string[]
  applicationUrl?: string
  postedDate?: string
  applicationDeadline?: string
  status?: JobStatus
  companyWebsite?: string
  remote?: boolean
  logo?: string
}

interface JobDialogProps {
  job: JobDetails
  open: boolean
  onOpenChange: (open: boolean) => void
  onApply?: () => void
  onSave?: () => void
  onStatusChange?: (status: JobStatus) => void
}

export function JobDialog({
  job,
  open,
  onOpenChange,
  onApply,
  onSave,
  onStatusChange
}: JobDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-start gap-4">
            {job.logo && (
              <div className="w-12 h-12 rounded-md border border-gray-200 flex items-center justify-center bg-white p-2 shrink-0">
                <img src={job.logo} alt={job.company} className="w-full h-full object-contain" />
              </div>
            )}
            <div className="flex-1">
              <DialogTitle className="text-xl">{job.title}</DialogTitle>
              <DialogDescription className="text-base mt-1 flex items-center gap-1">
                <Building2 className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">{job.company}</span>
              </DialogDescription>
              <div className="flex flex-wrap gap-2 mt-2">
                {job.location && (
                  <div className="inline-flex items-center text-xs text-gray-500 gap-1">
                    <MapPin className="h-3 w-3" /> {job.location}
                  </div>
                )}
                {job.remote && (
                  <div className="inline-flex items-center text-xs text-gray-500 gap-1">
                    <Globe className="h-3 w-3" /> Remote
                  </div>
                )}
                {job.jobType && (
                  <div className="inline-flex items-center text-xs text-gray-500 gap-1">
                    <Briefcase className="h-3 w-3" /> {job.jobType}
                  </div>
                )}
                {job.salary && (
                  <div className="inline-flex items-center text-xs text-gray-500 gap-1">
                    <DollarSign className="h-3 w-3" /> {job.salary}
                  </div>
                )}
                {job.status && (
                  <StatusBadge status={job.status as any} size="sm" />
                )}
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {(job.postedDate || job.applicationDeadline) && (
            <div className="flex items-center justify-between mb-4 text-sm border-b border-gray-100 pb-4">
              {job.postedDate && (
                <div className="flex items-center gap-1 text-gray-500">
                  <CalendarDays className="h-4 w-4" />
                  <span>Posted: {job.postedDate}</span>
                </div>
              )}
              {job.applicationDeadline && (
                <div className="flex items-center gap-1 text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>Apply by: {job.applicationDeadline}</span>
                </div>
              )}
            </div>
          )}
          
          {job.description && (
            <div className="mb-6">
              <h3 className="text-base font-semibold mb-2">Description</h3>
              <p className="text-sm text-gray-700 whitespace-pre-line">{job.description}</p>
            </div>
          )}
          
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="mb-6">
              <h3 className="text-base font-semibold mb-2">Responsibilities</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                {job.responsibilities.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-launchpad-green mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {job.requirements && job.requirements.length > 0 && (
            <div className="mb-2">
              <h3 className="text-base font-semibold mb-2">Requirements</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                {job.requirements.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-launchpad-blue mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <DialogFooter className="p-4 border-t bg-gray-50 gap-2 flex-wrap justify-between sm:justify-end">
          {job.status && onStatusChange && (
            <div className="flex items-center gap-2 mr-auto">
              <span className="text-sm text-gray-500">Status:</span>
              <StatusBadge status={job.status as any} size="sm" />
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs gap-1"
                onClick={() => onStatusChange(job.status === "interested" ? "applied" : "interested")}
              >
                {job.status === "interested" ? (
                  <>
                    <CheckCircle2 className="h-3 w-3" />
                    Mark as Applied
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3" />
                    Reset Status
                  </>
                )}
              </Button>
            </div>
          )}
          
          {onSave && (
            <Button variant="outline" size="sm" onClick={onSave}>
              Save for Later
            </Button>
          )}
          
          {onApply && job.applicationUrl && (
            <Button className="bg-launchpad-blue text-white hover:bg-launchpad-teal" size="sm" onClick={onApply}>
              Apply Now
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 