import React from 'react';
import { Badge } from "@/components/ui/basic/badge";
import { Button } from "@/components/ui/basic/button";
import { Label } from "@/components/ui/basic/label";
import { Input } from "@/components/ui/form/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/form/select";
import { MultiPurposeModal } from "@/components/ui/overlay/multi-purpose-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs";
import { Checkbox } from "@/components/ui/form/checkbox";

interface FilterOptions {
  status: string[];
  program: string[];
  date: string;
  sort?: string;
  sortDir?: 'asc' | 'desc';
  minApplications?: number;
  keywords?: string;
  showInactive?: boolean;
  showArchived?: boolean;
}

interface FilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterOptions;
  onApplyFilters: (filters: FilterOptions) => void;
  onResetFilters: () => void;
}

/**
 * Enhanced modal component for filtering applicants with more options
 */
export function FilterModal({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
  onResetFilters,
}: FilterModalProps) {
  // Use a local state to track changes before applying
  const [localFilters, setLocalFilters] = React.useState<FilterOptions>(filters);
  const [activeTab, setActiveTab] = React.useState("basic");
  
  // Update local filters when the main filters change
  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);
  
  // Toggle a status filter
  const toggleStatus = (status: string) => {
    setLocalFilters(prev => {
      const statusArray = prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status];
      return { ...prev, status: statusArray };
    });
  };
  
  // Toggle a program filter
  const toggleProgram = (program: string) => {
    setLocalFilters(prev => {
      const programArray = prev.program.includes(program)
        ? prev.program.filter(p => p !== program)
        : [...prev.program, program];
      return { ...prev, program: programArray };
    });
  };
  
  // Update date filter
  const setDateFilter = (date: string) => {
    setLocalFilters(prev => ({ ...prev, date }));
  };

  // Update sort options
  const setSortOption = (sort: string) => {
    setLocalFilters(prev => ({ ...prev, sort }));
  };

  // Toggle sort direction
  const toggleSortDirection = () => {
    setLocalFilters(prev => ({ 
      ...prev, 
      sortDir: prev.sortDir === 'asc' ? 'desc' : 'asc' 
    }));
  };

  // Set minimum applications
  const setMinApplications = (value: number[]) => {
    setLocalFilters(prev => ({ ...prev, minApplications: value[0] }));
  };

  // Set keywords
  const setKeywords = (keywords: string) => {
    setLocalFilters(prev => ({ ...prev, keywords }));
  };

  // Toggle showing inactive users
  const toggleShowInactive = () => {
    setLocalFilters(prev => ({ 
      ...prev, 
      showInactive: !prev.showInactive 
    }));
  };

  // Toggle showing archived users
  const toggleShowArchived = () => {
    setLocalFilters(prev => ({ 
      ...prev, 
      showArchived: !prev.showArchived 
    }));
  };

  // Calculate the number of active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters.status.length > 0) count += localFilters.status.length;
    if (localFilters.program.length > 0) count += localFilters.program.length;
    if (localFilters.date !== "all") count += 1;
    if (localFilters.sort) count += 1;
    if (localFilters.minApplications && localFilters.minApplications > 0) count += 1;
    if (localFilters.keywords && localFilters.keywords.trim() !== '') count += 1;
    if (localFilters.showInactive) count += 1;
    if (localFilters.showArchived) count += 1;
    return count;
  };
  
  return (
    <MultiPurposeModal
      open={open}
      onOpenChange={onOpenChange}
      title="Filter Applicants"
      size="md"
      showFooter={true}
      primaryActionText={`Apply Filters${getActiveFilterCount() > 0 ? ` (${getActiveFilterCount()})` : ''}`}
      onPrimaryAction={() => onApplyFilters(localFilters)}
      secondaryActionText="Reset Filters"
      onSecondaryAction={() => {
        const resetFilters: FilterOptions = { 
          status: [], 
          program: [], 
          date: "all",
          sort: undefined,
          sortDir: 'asc' as 'asc',
          minApplications: 0,
          keywords: '',
          showInactive: false,
          showArchived: false
        };
        setLocalFilters(resetFilters);
        onResetFilters();
      }}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="basic">Basic Filters</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Filters</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6 py-4">
          <div>
            <Label className="text-base font-medium mb-2 block">Status</Label>
            <div className="flex flex-wrap gap-2">
              {["active", "interview", "placed", "inactive"].map((status) => (
                <Badge
                  key={status}
                  variant={localFilters.status.includes(status) ? "default" : "outline"}
                  className={`cursor-pointer capitalize ${
                    localFilters.status.includes(status)
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => toggleStatus(status)}
                >
                  {status}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-medium mb-2 block">Program</Label>
            <div className="flex flex-wrap gap-2">
              {["101", "LIFTOFF"].map((program) => (
                <Badge
                  key={program}
                  variant={localFilters.program.includes(program) ? "default" : "outline"}
                  className={`cursor-pointer ${
                    localFilters.program.includes(program)
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => toggleProgram(program)}
                >
                  {program}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-medium mb-2 block">Join Date</Label>
            <Select
              value={localFilters.date}
              onValueChange={setDateFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="last7days">Last 7 days</SelectItem>
                <SelectItem value="last30days">Last 30 days</SelectItem>
                <SelectItem value="last90days">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6 py-4">
          <div>
            <Label className="text-base font-medium mb-2 block">Sort By</Label>
            <div className="flex items-center gap-2">
              <Select
                value={localFilters.sort || 'newest'}
                onValueChange={setSortOption}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select sorting option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Join Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="applications">Applications Count</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleSortDirection}
                className="min-w-[80px]"
              >
                {localFilters.sortDir === 'asc' ? '↑ Asc' : '↓ Desc'}
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-base font-medium mb-2 flex justify-between">
              <span>Min. Applications</span>
              <span className="text-sm text-gray-500">{localFilters.minApplications || 0}</span>
            </Label>
            <Input
              type="number"
              min={0}
              max={10}
              value={localFilters.minApplications || 0}
              onChange={(e) => setMinApplications([parseInt(e.target.value) || 0])}
            />
          </div>

          <div>
            <Label className="text-base font-medium mb-2 block">Keywords</Label>
            <Input
              placeholder="Search in names, email, etc."
              value={localFilters.keywords || ''}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="showInactive" 
                checked={localFilters.showInactive} 
                onCheckedChange={toggleShowInactive}
              />
              <Label htmlFor="showInactive" className="cursor-pointer">Show inactive applicants</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="showArchived" 
                checked={localFilters.showArchived} 
                onCheckedChange={toggleShowArchived}
              />
              <Label htmlFor="showArchived" className="cursor-pointer">Show archived applicants</Label>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Filter summary */}
      {getActiveFilterCount() > 0 && (
        <div className="bg-blue-50 p-3 rounded-md border border-blue-100 mt-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-blue-700">Active filters</h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-blue-600"
              onClick={() => {
                setLocalFilters({
                  status: [],
                  program: [],
                  date: "all",
                  sort: undefined,
                  sortDir: 'asc',
                  minApplications: 0,
                  keywords: '',
                  showInactive: false,
                  showArchived: false
                });
              }}
            >
              Clear all
            </Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {localFilters.status.map(status => (
              <Badge key={status} className="bg-blue-100 text-blue-800 capitalize">
                {status}
              </Badge>
            ))}
            {localFilters.program.map(program => (
              <Badge key={program} className="bg-blue-100 text-blue-800">
                Program: {program}
              </Badge>
            ))}
            {localFilters.date !== "all" && (
              <Badge className="bg-blue-100 text-blue-800">
                {localFilters.date === "last7days" && "Last 7 days"}
                {localFilters.date === "last30days" && "Last 30 days"}
                {localFilters.date === "last90days" && "Last 90 days"}
              </Badge>
            )}
            {localFilters.sort && (
              <Badge className="bg-blue-100 text-blue-800">
                Sort: {localFilters.sort} ({localFilters.sortDir === 'asc' ? 'Asc' : 'Desc'})
              </Badge>
            )}
            {localFilters.minApplications && localFilters.minApplications > 0 && (
              <Badge className="bg-blue-100 text-blue-800">
                Min Applications: {localFilters.minApplications}
              </Badge>
            )}
            {localFilters.keywords && localFilters.keywords.trim() !== '' && (
              <Badge className="bg-blue-100 text-blue-800">
                Keywords: {localFilters.keywords}
              </Badge>
            )}
            {localFilters.showInactive && (
              <Badge className="bg-blue-100 text-blue-800">
                Including inactive
              </Badge>
            )}
            {localFilters.showArchived && (
              <Badge className="bg-blue-100 text-blue-800">
                Including archived
              </Badge>
            )}
          </div>
        </div>
      )}
    </MultiPurposeModal>
  );
} 