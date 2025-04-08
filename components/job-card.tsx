"use client"

import { Badge } from "@/components/ui/basic/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/basic/card"
import { MapPin, DollarSign, Calendar } from "lucide-react"
import { Button } from "@/components/ui/basic/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/basic/avatar"
import { formatDistanceToNow } from "date-fns"

interface Job {
  id: string;
  job_id: number;
  job_type: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  website: string;
  partner_id: number;
  created_at: string;
  postedDate: string;
  salary: string;
  tags: string[];
  logo?: string;
  status: string;
  appliedDate: string;
  recruiter: string;
  companyLogo: string;
}

interface JobCardProps {
  job: Job;
  onSelect: (job: Job) => void;
}

export function JobCard({ job, onSelect }: JobCardProps) {
  return (
    <Card 
      className="hover:shadow-md transition-shadow duration-200 dark:border-gray-700 dark:bg-gray-800"
      onClick={() => onSelect(job)}
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
            variant={job.status === 'applied' ? 'default' : 'outline'} 
            className="ml-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          >
            {job.status}
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
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="h-4 w-4 mr-2" />
            Applied {formatDistanceToNow(new Date(job.appliedDate), { addSuffix: true })}
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
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{job.recruiter}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Recruiter</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(job);
          }}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
