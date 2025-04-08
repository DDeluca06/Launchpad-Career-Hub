"use client"

import { useState } from "react"
import { Label } from "@/components/ui/basic/label"
import { Input } from "@/components/ui/form/input"
import { Button } from "@/components/ui/basic/button"
import { Search, Briefcase, MapPin } from "lucide-react"

interface JobFilter {
  jobTypes: string[];
  locations: string[];
  remoteOnly: boolean;
  salary: [number, number];
  experienceLevel: string;
  keywords: string;
}

interface JobFiltersProps {
  onApply: (filters: JobFilter) => void;
  initialFilters: JobFilter;
}

const DEFAULT_FILTERS: JobFilter = {
  jobTypes: [],
  locations: [],
  remoteOnly: false,
  salary: [0, 200],
  experienceLevel: "any",
  keywords: ""
}

const JOB_TYPES = [
  { id: "full-time", label: "Full Time" },
  { id: "part-time", label: "Part Time" },
  { id: "contract", label: "Contract" },
  { id: "internship", label: "Internship" },
]

const LOCATIONS = [
  { id: "remote", label: "Remote" },
  { id: "onsite", label: "On-site" },
  { id: "hybrid", label: "Hybrid" },
]

export function JobFilters({ onApply, initialFilters }: JobFiltersProps) {
  const [filters, setFilters] = useState<JobFilter>(initialFilters)

  const handleApply = () => {
    onApply(filters)
  }

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS)
    onApply(DEFAULT_FILTERS)
  }

  const toggleJobType = (typeId: string) => {
    const newTypes = filters.jobTypes.includes(typeId)
      ? filters.jobTypes.filter(type => type !== typeId)
      : [...filters.jobTypes, typeId];
    setFilters(prev => ({ ...prev, jobTypes: newTypes }))
  }

  const toggleLocation = (locationId: string) => {
    const newLocations = filters.locations.includes(locationId)
      ? filters.locations.filter(loc => loc !== locationId)
      : [...filters.locations, locationId];
    setFilters(prev => ({ ...prev, locations: newLocations }))
  }

  const toggleRemoteOnly = () => {
    setFilters(prev => ({ ...prev, remoteOnly: !prev.remoteOnly }))
  }

  return (
    <div className="space-y-6 py-2">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-gray-600" />
          <Label className="text-base font-medium text-gray-800">Job Type</Label>
        </div>
        <div className="flex flex-wrap gap-2">
          {JOB_TYPES.map((jobType) => (
            <Button
              key={jobType.id}
              variant={filters.jobTypes.includes(jobType.id) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleJobType(jobType.id)}
              className={`rounded-full ${filters.jobTypes.includes(jobType.id) ? 'bg-blue-500 text-white hover:bg-blue-600' : 'hover:bg-gray-100'}`}
            >
              {jobType.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-gray-600" />
          <Label className="text-base font-medium text-gray-800">Location</Label>
        </div>
        <div className="flex flex-wrap gap-2">
          {LOCATIONS.map((location) => (
            <Button
              key={location.id}
              variant={filters.locations.includes(location.id) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleLocation(location.id)}
              className={`rounded-full ${filters.locations.includes(location.id) ? 'bg-blue-500 text-white hover:bg-blue-600' : 'hover:bg-gray-100'}`}
            >
              {location.label}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant={filters.remoteOnly ? "default" : "outline"}
            size="sm"
            onClick={toggleRemoteOnly}
            className={`rounded-full ${filters.remoteOnly ? 'bg-blue-500 text-white hover:bg-blue-600' : 'hover:bg-gray-100'}`}
          >
            Remote Only
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-gray-600" />
          <Label className="text-base font-medium text-gray-800">Keywords</Label>
        </div>
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            value={filters.keywords}
            onChange={(e) => setFilters(prev => ({ ...prev, keywords: e.target.value }))}
            className="pl-10 border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Skills, job titles, companies..."
          />
        </div>
      </div>

      <div className="flex justify-between space-x-4 pt-4 border-t mt-4">
        <Button
          variant="outline"
          onClick={handleReset}
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Reset Filters
        </Button>
        <Button
          onClick={handleApply}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  )
}