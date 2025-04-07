"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/basic/badge"
import { Card, CardContent } from "@/components/ui/basic/card"
import { cn } from "@/lib/utils"
import { Briefcase } from "lucide-react"
import { Image as LocalImage } from "@/components/ui/basic/image"
import { Button } from "@/components/ui/basic/button"

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
}

interface JobCardProps {
  job: Job;
  onApply: () => void;
}

export function JobCard({ job, onApply }: JobCardProps) {
  const [isApplied, setIsApplied] = useState(false);

  const handleApply = () => {
    setIsApplied(true);
    onApply();
  };

  return (
    <Card className="border border-gray-200 hover:border-launchpad-blue transition-colors">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          {job.logo ? (
            <div className="w-12 h-12 relative">
              <LocalImage
                src={job.logo}
                alt={`${job.company} logo`}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-gray-400" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
            <p className="text-sm text-gray-500">{job.company}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{job.type}</Badge>
            <Badge variant="secondary">{job.location}</Badge>
            <Badge variant="secondary">{job.salary}</Badge>
          </div>

          <p className="text-gray-600 line-clamp-3">{job.description}</p>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Posted {job.postedDate}</p>
            <Button
              onClick={handleApply}
              className="bg-launchpad-blue hover:bg-launchpad-teal text-white"
              disabled={isApplied}
            >
              {isApplied ? 'Applied' : 'Apply Now'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
