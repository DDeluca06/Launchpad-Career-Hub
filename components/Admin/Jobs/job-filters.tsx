"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Label } from "@/components/ui/basic/label";
import { Input } from "@/components/ui/form/input";
import { Button } from "@/components/ui/basic/button";
import { Search, Briefcase, MapPin, Tag } from "lucide-react";
import { Badge } from "@/components/ui/basic/badge";
import { JobFilterInterface } from "./types";

interface JobFiltersProps {
  onApply: (filters: JobFilterInterface) => void;
  initialFilters: JobFilterInterface;
  availableTags?: string[];
}

// Export the ref interface for parent components
export interface JobFiltersRef {
  getCurrentFilters: () => JobFilterInterface;
  applyFilters: () => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: JobFilterInterface = {
  jobTypes: [],
  keywords: "",
  tags: [],
  partnerOnly: false,
};

const JOB_TYPES = [
  { id: "FULL_TIME", label: "Full Time" },
  { id: "PART_TIME", label: "Part Time" },
  { id: "CONTRACT", label: "Contract" },
  { id: "INTERNSHIP", label: "Internship" },
  { id: "APPRENTICESHIP", label: "Apprenticeship" },
];

/**
 * Renders UI controls for filtering job listings.
 *
 * This component presents interactive options to select job types, choose locations, toggle a remote-only filter, and enter keywords. It manages its own filter state initialized with the provided initial filters and notifies the parent component of state changes via the onApply callback when filters are applied or reset.
 *
 * @param onApply - Callback function invoked with the current filters when the user applies or resets the filters.
 * @param initialFilters - The initial filter configuration for the component.
 * @param availableTags - Optional array of tags that can be filtered on
 */
export const JobFilters = forwardRef<JobFiltersRef, JobFiltersProps>(
  ({ onApply, initialFilters, availableTags = [] }, ref) => {
    const [filters, setFilters] = useState<JobFilterInterface>({
      ...initialFilters,
      tags: initialFilters.tags || [],
    });

    // Force update filters whenever initialFilters change
    useEffect(() => {
      setFilters({
        ...initialFilters,
        tags: initialFilters.tags || [],
      });
    }, [initialFilters]);

    // Expose methods to the parent component through the ref
    useImperativeHandle(ref, () => ({
      getCurrentFilters: () => filters,
      applyFilters: () => {
        const queryParams = new URLSearchParams();
        
        // Add job types
        filters.jobTypes.forEach(type => {
          queryParams.append('jobTypes[]', type);
        });
        
        // Add keywords
        if (filters.keywords) {
          queryParams.append('search', filters.keywords);
        }
        
        // Add tags
        filters.tags.forEach(tag => {
          queryParams.append('tags[]', tag);
        });
        
        onApply(filters);
      },
      resetFilters: () => {
        const resetFilters = DEFAULT_FILTERS;
        setFilters(resetFilters);
        onApply(resetFilters);
      }
    }));

    const toggleJobType = (typeId: string) => {
      const newTypes = filters.jobTypes.includes(typeId)
        ? filters.jobTypes.filter((type) => type !== typeId)
        : [...filters.jobTypes, typeId];
      setFilters((prev) => ({ ...prev, jobTypes: newTypes }));
    };

    const toggleTag = (tag: string) => {
      const newTags = filters.tags.includes(tag)
        ? filters.tags.filter((t) => t !== tag)
        : [...filters.tags, tag];
      setFilters((prev) => ({ ...prev, tags: newTags }));
    };

    return (
      <div className="space-y-6 py-2">
        {/* Job Type Filter */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-gray-600" />
            <Label className="text-base font-medium text-gray-800">
              Job Type
            </Label>
          </div>
          <div className="flex flex-wrap gap-2">
            {JOB_TYPES.map((jobType) => (
              <Button
                key={jobType.id}
                variant={
                  filters.jobTypes.includes(jobType.id) ? "default" : "outline"
                }
                size="sm"
                onClick={() => toggleJobType(jobType.id)}
                className={`rounded-full ${filters.jobTypes.includes(jobType.id) ? "bg-blue-500 text-white hover:bg-blue-600" : "hover:bg-gray-100"}`}
              >
                {jobType.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Tags Filter */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-gray-600" />
            <Label className="text-base font-medium text-gray-800">
              Tags
            </Label>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <Badge
                key={tag}
                variant={filters.tags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Keywords Filter */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-gray-600" />
            <Label className="text-base font-medium text-gray-800">
              Keywords
            </Label>
          </div>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              value={filters.keywords}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, keywords: e.target.value }))
              }
              className="pl-10 border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Skills, job titles, companies..."
            />
          </div>
        </div>
      </div>
    );
  }
);

// Add display name
JobFilters.displayName = "JobFilters";