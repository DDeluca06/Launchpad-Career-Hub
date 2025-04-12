"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Label } from "@/components/ui/basic/label";
import { Input } from "@/components/ui/form/input";
import { Button } from "@/components/ui/basic/button";
import { Search, Building2, MapPin } from "lucide-react";
import { PartnerFilterInterface, INDUSTRIES } from "./types";

interface PartnerFiltersProps {
  onApply: (filters: PartnerFilterInterface) => void;
  initialFilters: PartnerFilterInterface;
  availableLocations?: string[];
}

// Export the ref interface for parent components
export interface PartnerFiltersRef {
  getCurrentFilters: () => PartnerFilterInterface;
  applyFilters: () => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: PartnerFilterInterface = {
  industries: [],
  locations: [],
  keywords: "",
};

/**
 * Renders UI controls for filtering partner listings.
 *
 * This component presents interactive options to select industries, choose locations, and enter keywords. 
 * It manages its own filter state initialized with the provided initial filters and notifies the parent 
 * component of state changes via the onApply callback when filters are applied or reset.
 */
export const PartnerFilters = forwardRef<PartnerFiltersRef, PartnerFiltersProps>(
  ({ onApply, initialFilters, availableLocations = [] }, ref) => {
    const [filters, setFilters] = useState<PartnerFilterInterface>({
      ...initialFilters,
      industries: initialFilters.industries || [],
      locations: initialFilters.locations || [],
    });

    // Force update filters whenever initialFilters change
    useEffect(() => {
      setFilters({
        ...initialFilters,
        industries: initialFilters.industries || [],
        locations: initialFilters.locations || [],
      });
    }, [initialFilters]);

    // Expose methods to the parent component through the ref
    useImperativeHandle(ref, () => ({
      getCurrentFilters: () => filters,
      applyFilters: () => {
        console.error("PartnerFilters - applying filters:", filters);
        onApply(filters);
      },
      resetFilters: () => {
        console.error("PartnerFilters - resetting filters");
        const resetFilters = DEFAULT_FILTERS;
        setFilters(resetFilters);
        onApply(resetFilters);
      }
    }));

    const toggleIndustry = (industry: string) => {
      const newIndustries = filters.industries.includes(industry)
        ? filters.industries.filter((ind) => ind !== industry)
        : [...filters.industries, industry];
        
      console.error(`PartnerFilters - toggling industry ${industry}, new industries:`, newIndustries);
      setFilters((prev) => ({ ...prev, industries: newIndustries }));
    };

    const toggleLocation = (location: string) => {
      const newLocations = filters.locations.includes(location)
        ? filters.locations.filter((loc) => loc !== location)
        : [...filters.locations, location];
        
      console.error(`PartnerFilters - toggling location ${location}, new locations:`, newLocations);
      setFilters((prev) => ({ ...prev, locations: newLocations }));
    };

    return (
      <div className="space-y-6 py-2">
        {/* Industry Filter */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-gray-600" />
            <Label className="text-base font-medium text-gray-800">
              Industry
            </Label>
          </div>
          <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-md">
            {INDUSTRIES.map((industry) => (
              <Button
                key={industry}
                variant={
                  filters.industries.includes(industry) ? "default" : "outline"
                }
                size="sm"
                onClick={() => toggleIndustry(industry)}
                className={`rounded-full ${filters.industries.includes(industry) ? "bg-blue-500 text-white hover:bg-blue-600" : "hover:bg-gray-100"}`}
              >
                {industry}
              </Button>
            ))}
          </div>
          {filters.industries.length > 0 && (
            <div className="text-sm text-blue-600">
              {filters.industries.length} industry {filters.industries.length > 1 ? 'filters' : 'filter'} selected
            </div>
          )}
        </div>

        {/* Location Filter */}
        {availableLocations.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-600" />
              <Label className="text-base font-medium text-gray-800">
                Location
              </Label>
            </div>
            <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-md">
              {availableLocations.map((location) => (
                <Button
                  key={location}
                  variant={
                    filters.locations.includes(location) ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => toggleLocation(location)}
                  className={`rounded-full ${filters.locations.includes(location) ? "bg-blue-500 text-white hover:bg-blue-600" : "hover:bg-gray-100"}`}
                >
                  {location}
                </Button>
              ))}
            </div>
            {filters.locations.length > 0 && (
              <div className="text-sm text-blue-600">
                {filters.locations.length} location {filters.locations.length > 1 ? 'filters' : 'filter'} selected
              </div>
            )}
          </div>
        )}

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
              placeholder="Organization name, description..."
            />
          </div>
        </div>
      </div>
    );
  }
);

// Add display name
PartnerFilters.displayName = "PartnerFilters"; 