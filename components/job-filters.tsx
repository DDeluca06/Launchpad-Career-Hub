"use client"

import { useState } from "react"
import { Label } from "@/components/ui/basic/label"
import { Checkbox } from "@/components/ui/form/checkbox"
import { Input } from "@/components/ui/form/input"
import { Slider } from "@/components/ui/basic/slider"
import { Switch } from "@/components/ui/basic/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/form/radio-group"
import { ScrollArea } from "@/components/ui/layout/scroll-area"
import { Separator } from "@/components/ui/basic/separator"
import { Search, Briefcase, MapPin, BadgeDollarSign, GraduationCap } from "lucide-react"

interface JobFiltersProps {
  onApplyFilters: (filters: JobFilters) => void
  initialFilters?: JobFilters
}

interface JobFilters {
  jobTypes: string[]
  locations: string[]
  remoteOnly: boolean
  salary: [number, number]
  experienceLevel: string
  keywords: string
}

const DEFAULT_FILTERS: JobFilters = {
  jobTypes: [],
  locations: [],
  remoteOnly: false,
  salary: [0, 200],
  experienceLevel: "any",
  keywords: ""
}

const JOB_TYPES = [
  { id: "full_time", label: "Full Time" },
  { id: "part_time", label: "Part Time" },
  { id: "contract", label: "Contract" },
  { id: "internship", label: "Internship" },
  { id: "temporary", label: "Temporary" }
]

const LOCATIONS = [
  { id: "remote", label: "Remote" },
  { id: "philadelphia_pa", label: "Philadelphia, PA" },
  { id: "new_york_ny", label: "New York, NY" },
  { id: "boston_ma", label: "Boston, MA" },
  { id: "san_francisco_ca", label: "San Francisco, CA" },
  { id: "seattle_wa", label: "Seattle, WA" }
]

const EXPERIENCE_LEVELS = [
  { id: "any", label: "Any Experience" },
  { id: "entry", label: "Entry Level" },
  { id: "mid", label: "Mid Level" },
  { id: "senior", label: "Senior Level" },
  { id: "lead", label: "Lead/Manager" }
]

export function JobFilters({ onApplyFilters, initialFilters = DEFAULT_FILTERS }: JobFiltersProps) {
  const [filters, setFilters] = useState<JobFilters>(initialFilters)
  
  // Handle job type selection
  const handleJobTypeChange = (jobTypeId: string, checked: boolean) => {
    if (checked) {
      setFilters(prev => ({
        ...prev,
        jobTypes: [...prev.jobTypes, jobTypeId]
      }))
    } else {
      setFilters(prev => ({
        ...prev,
        jobTypes: prev.jobTypes.filter(id => id !== jobTypeId)
      }))
    }
  }
  
  // Handle location selection
  const handleLocationChange = (locationId: string, checked: boolean) => {
    if (checked) {
      setFilters(prev => ({
        ...prev,
        locations: [...prev.locations, locationId]
      }))
    } else {
      setFilters(prev => ({
        ...prev,
        locations: prev.locations.filter(id => id !== locationId)
      }))
    }
  }
  
  // Handle remote only toggle
  const handleRemoteOnlyChange = (checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      remoteOnly: checked
    }))
  }
  
  // Handle salary range change
  const handleSalaryChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      salary: [value[0], value[1]]
    }))
  }
  
  // Handle experience level change
  const handleExperienceLevelChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      experienceLevel: value
    }))
  }
  
  // Handle keywords change
  const handleKeywordsChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      keywords: value
    }))
  }
  
  // Reset filters to default
  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS)
  }
  
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Keywords Section */}
      <div className="bg-white rounded-lg p-4 border border-gray-100">
        <Label htmlFor="keywords" className="text-base font-medium flex items-center gap-2 text-gray-800">
          <Search className="h-4 w-4 text-launchpad-blue" />
          Keywords
        </Label>
        <div className="mt-2">
          <Input
            id="keywords"
            placeholder="Search job titles, skills, or companies"
            value={filters.keywords}
            onChange={(e) => handleKeywordsChange(e.target.value)}
            className="border-gray-200 focus:border-launchpad-blue"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Type Section */}
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <h3 className="text-base font-medium mb-3 flex items-center gap-2 text-gray-800">
            <Briefcase className="h-4 w-4 text-launchpad-blue" />
            Job Type
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {JOB_TYPES.map((jobType) => (
              <div key={jobType.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`jobType-${jobType.id}`}
                  checked={filters.jobTypes.includes(jobType.id)}
                  onCheckedChange={(checked) => 
                    handleJobTypeChange(jobType.id, checked === true)
                  }
                  className="text-launchpad-blue data-[state=checked]:bg-launchpad-blue data-[state=checked]:border-launchpad-blue"
                />
                <Label 
                  htmlFor={`jobType-${jobType.id}`}
                  className="text-sm font-normal cursor-pointer text-gray-700"
                >
                  {jobType.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      
        {/* Location Section */}
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-medium flex items-center gap-2 text-gray-800">
              <MapPin className="h-4 w-4 text-launchpad-blue" />
              Location
            </h3>
            <div className="flex items-center space-x-2">
              <Switch
                id="remote-only"
                checked={filters.remoteOnly}
                onCheckedChange={handleRemoteOnlyChange}
                className="data-[state=checked]:bg-launchpad-blue"
              />
              <Label htmlFor="remote-only" className="text-sm cursor-pointer text-gray-700">Remote Only</Label>
            </div>
          </div>
          
          <ScrollArea className="h-[150px] pr-4">
            <div className="grid grid-cols-1 gap-2">
              {LOCATIONS.map((location) => (
                <div key={location.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`location-${location.id}`}
                    checked={filters.locations.includes(location.id)}
                    onCheckedChange={(checked) => 
                      handleLocationChange(location.id, checked === true)
                    }
                    disabled={filters.remoteOnly && location.id !== "remote"}
                    className="text-launchpad-blue data-[state=checked]:bg-launchpad-blue data-[state=checked]:border-launchpad-blue"
                  />
                  <Label 
                    htmlFor={`location-${location.id}`}
                    className="text-sm font-normal cursor-pointer text-gray-700"
                  >
                    {location.label}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
      
      {/* Salary Range Section */}
      <div className="bg-white rounded-lg p-4 border border-gray-100">
        <h3 className="text-base font-medium mb-3 flex items-center gap-2 text-gray-800">
          <BadgeDollarSign className="h-4 w-4 text-launchpad-blue" />
          Salary Range (in $1,000s)
        </h3>
        <div className="px-2 pt-2">
          <Slider
            defaultValue={[filters.salary[0], filters.salary[1]]}
            max={200}
            step={5}
            value={[filters.salary[0], filters.salary[1]]}
            onValueChange={handleSalaryChange}
            className="mt-2"
          />
          <div className="flex justify-between mt-3 text-sm text-gray-500">
            <div>${filters.salary[0]}k</div>
            <div>${filters.salary[1]}k{filters.salary[1] === 200 ? "+" : ""}</div>
          </div>
        </div>
      </div>
      
      {/* Experience Level Section */}
      <div className="bg-white rounded-lg p-4 border border-gray-100">
        <h3 className="text-base font-medium mb-3 flex items-center gap-2 text-gray-800">
          <GraduationCap className="h-4 w-4 text-launchpad-blue" />
          Experience Level
        </h3>
        <RadioGroup
          value={filters.experienceLevel}
          onValueChange={handleExperienceLevelChange}
          className="grid grid-cols-1 gap-2"
        >
          {EXPERIENCE_LEVELS.map((level) => (
            <div key={level.id} className="flex items-center space-x-2">
              <RadioGroupItem 
                value={level.id} 
                id={`experience-${level.id}`}
                className="text-launchpad-blue"
              />
              <Label 
                htmlFor={`experience-${level.id}`}
                className="text-sm font-normal cursor-pointer text-gray-700"
              >
                {level.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      <Separator className="my-4" />
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={resetFilters}
          className="text-sm text-launchpad-blue hover:text-launchpad-teal hover:underline mr-auto"
        >
          Reset Filters
        </button>
      </div>
    </div>
  )
} 