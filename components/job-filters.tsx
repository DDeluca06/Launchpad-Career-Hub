"use client"

import { useState } from "react"
import { Label } from "@/components/ui/basic/label"
import { Input } from "@/components/ui/form/input"
import { Button } from "@/components/ui/basic/button"
import { Search, Briefcase, MapPin, BadgeDollarSign, GraduationCap } from "lucide-react"

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
  salary: [0, 1000000],
  experienceLevel: "",
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

const EXPERIENCE_LEVELS = [
  { id: "", label: "All Levels" },
  { id: "entry", label: "Entry Level" },
  { id: "mid", label: "Mid Level" },
  { id: "senior", label: "Senior Level" },
  { id: "director", label: "Director Level" },
]

export function JobFilters({ onApply, initialFilters }: JobFiltersProps) {
  const [filters, setFilters] = useState<JobFilter>(initialFilters)

  const handleApply = () => {
    onApply(filters)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="job-type" className="text-sm font-medium text-gray-700">Job Type</Label>
        <select
          multiple
          value={filters.jobTypes}
          onChange={(e) => {
            const options = Array.from(e.target.selectedOptions, option => option.value)
            setFilters(prev => ({ ...prev, jobTypes: options }))
          }}
          className="w-full border-gray-200 focus:border-launchpad-blue"
        >
          {JOB_TYPES.map((jobType) => (
            <option key={jobType.id} value={jobType.id}>{jobType.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location</Label>
        <select
          multiple
          value={filters.locations}
          onChange={(e) => {
            const options = Array.from(e.target.selectedOptions, option => option.value)
            setFilters(prev => ({ ...prev, locations: options }))
          }}
          className="w-full border-gray-200 focus:border-launchpad-blue"
        >
          {LOCATIONS.map((location) => (
            <option key={location.id} value={location.id}>{location.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience-level" className="text-sm font-medium text-gray-700">Experience Level</Label>
        <select
          value={filters.experienceLevel}
          onChange={(e) => setFilters(prev => ({ ...prev, experienceLevel: e.target.value }))}
          className="w-full border-gray-200 focus:border-launchpad-blue"
        >
          {EXPERIENCE_LEVELS.map((level) => (
            <option key={level.id} value={level.id}>{level.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="salary-range" className="text-sm font-medium text-gray-700">Salary Range</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            value={filters.salary[0]}
            onChange={(e) => setFilters(prev => ({ ...prev, salary: [Number(e.target.value), prev.salary[1]] }))}
            className="w-1/2 border-gray-200 focus:border-launchpad-blue"
            placeholder="Min"
          />
          <Input
            type="number"
            value={filters.salary[1]}
            onChange={(e) => setFilters(prev => ({ ...prev, salary: [prev.salary[0], Number(e.target.value)] }))}
            className="w-1/2 border-gray-200 focus:border-launchpad-blue"
            placeholder="Max"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="keywords" className="text-sm font-medium text-gray-700">Keywords</Label>
        <Input
          value={filters.keywords}
          onChange={(e) => setFilters(prev => ({ ...prev, keywords: e.target.value }))}
          className="w-full border-gray-200 focus:border-launchpad-blue"
          placeholder="Enter keywords..."
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => setFilters(DEFAULT_FILTERS)}
        >
          Reset
        </Button>
        <Button
          onClick={handleApply}
          className="bg-launchpad-blue hover:bg-launchpad-teal"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  )
}