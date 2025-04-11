"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Button } from "@/components/ui/basic/button";
import { Input } from "@/components/ui/form/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/basic/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/overlay/dialog";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Suspense } from "react";
import {
  Filter,
  Plus,
  Archive,
  Search,
  Building2,
  Briefcase,
  FileSpreadsheet
} from "lucide-react";

// Import our custom components
import { PartnerList } from "@/components/Admin/Partners/partner-list";
import { PartnerDetails } from "@/components/Admin/Partners/partner-details";
import { PartnerModal } from "@/components/Admin/Partners/partner-modal";
import { PartnerFilters, PartnerFiltersRef } from "@/components/Admin/Partners/partner-filters";

// Import types and services
import { ExtendedPartner, PartnerFilterInterface, INDUSTRIES } from "@/components/Admin/Partners/types";
import { 
  fetchPartnersByArchiveStatus, 
  togglePartnerArchive,
  getJobsCount
} from "@/components/Admin/Partners/partner-service";

export default function PartnersPage() {
  // State Management
  const [partners, setPartners] = useState<ExtendedPartner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<ExtendedPartner | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [jobsCount, setJobsCount] = useState<Record<number, number>>({});
  const [activeTab, setActiveTab] = useState<"active" | "archived">("active");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<ExtendedPartner | null>(null);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);

  // Filter state
  const [activeFilters, setActiveFilters] = useState<PartnerFilterInterface>({
    industries: [],
    locations: [],
    keywords: "",
  });

  // Add ref for partner filters
  const filterRef = useRef<PartnerFiltersRef>(null);

  /**
   * Loads partners from API
   */
  const loadPartners = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch partners based on archived status
      const partnersData = await fetchPartnersByArchiveStatus(activeTab === "archived");
      setPartners(partnersData);
    } catch (error) {
      console.error("Error loading partners:", error);
      alert("Failed to load partners. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  // Load partners on initial render and when activeTab changes
  useEffect(() => {
    loadPartners();
  }, [loadPartners]);

  // Filter partners based on current tab and filters
  const filteredPartners = useMemo(() => {
    // First filter by active/archived tab
    const partnersByStatus = partners.filter(partner => 
      activeTab === "active" ? !partner.is_archived : partner.is_archived
    );
    
    // Check if we have any active filters
    const hasActiveFilters = activeFilters.industries.length > 0 || 
                           activeFilters.locations.length > 0 || 
                           activeFilters.keywords.trim() !== "";
    
    if (!hasActiveFilters && !searchQuery) return partnersByStatus;
    
    // Apply filters to partners
    return partnersByStatus.filter(partner => {
      // First apply the search query as a global filter
      if (searchQuery && !partner.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !partner.description?.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !partner.industry?.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !partner.location?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Then apply specific filters
      if (activeFilters.industries.length > 0 && 
          !activeFilters.industries.some(ind => 
            partner.industry?.toLowerCase() === ind.toLowerCase())) {
        return false;
      }
      
      if (activeFilters.locations.length > 0 && 
          !activeFilters.locations.some(loc => 
            partner.location?.toLowerCase().includes(loc.toLowerCase()))) {
        return false;
      }
      
      if (activeFilters.keywords && 
          !partner.name.toLowerCase().includes(activeFilters.keywords.toLowerCase()) && 
          !partner.description?.toLowerCase().includes(activeFilters.keywords.toLowerCase()) &&
          !partner.industry?.toLowerCase().includes(activeFilters.keywords.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [partners, activeTab, activeFilters, searchQuery]);

  // Apply filters function
  const applyFilters = (filters: PartnerFilterInterface) => {
    setActiveFilters(filters);
    setFilterModalOpen(false);
  };

  // Reset filters function
  const resetFilters = () => {
    const defaultFilters: PartnerFilterInterface = {
      industries: [],
      locations: [],
      keywords: "",
    };
    setActiveFilters(defaultFilters);
    
    if (filterRef.current) {
      filterRef.current.resetFilters();
    }
  };

  /**
   * Handle archiving/unarchiving a partner
   */
  const handleArchivePartner = async () => {
    if (!selectedPartner) return;
    
    try {
      // Toggle the archive status
      const isCurrentlyArchived = !!selectedPartner.is_archived;
      const updatedPartner = await togglePartnerArchive(selectedPartner.id, !isCurrentlyArchived);
      
      // Update the partner in the list
      setPartners(prevPartners => 
        prevPartners.map(p => 
          p.id === selectedPartner.id ? { ...p, is_archived: !isCurrentlyArchived } : p
        )
      );
      
      // Update the selected partner
      setSelectedPartner(prev => prev ? { ...prev, is_archived: !isCurrentlyArchived } : null);
      
      // Close the modal
      setIsArchiveModalOpen(false);
    } catch (error) {
      console.error("Error archiving partner:", error);
      alert(`Failed to ${selectedPartner.is_archived ? 'restore' : 'archive'} partner.`);
    }
  };

  /**
   * Handle editing a partner
   */
  const handleEditPartner = (partner: ExtendedPartner) => {
    setEditingPartner(partner);
    setPartnerModalOpen(true);
  };

  /**
   * Handle successful partner creation or update
   */
  const handlePartnerSuccess = (partner: ExtendedPartner) => {
    // If we were editing, update the existing partner
    if (editingPartner) {
      setPartners(prevPartners => 
        prevPartners.map(p => p.id === partner.id ? { ...p, ...partner } : p)
      );
      
      // If this was the selected partner, update that too
      if (selectedPartner && selectedPartner.id === partner.id) {
        setSelectedPartner({ ...selectedPartner, ...partner });
      }
    } else {
      // Otherwise, add the new partner to the list
      setPartners(prevPartners => [...prevPartners, partner]);
    }
    
    // Reset the editing state
    setEditingPartner(null);
    setPartnerModalOpen(false);
    
    // Refresh the partner list
    loadPartners();
  };

  // Get available locations for the filters
  const availableLocations = useMemo(() => {
    const locations = partners
      .map(p => p.location)
      .filter((value, index, self) => 
        value && self.indexOf(value) === index
      ) as string[];
    return locations;
  }, [partners]);

  return (
    <DashboardLayout isAdmin>
      <div className="container mx-auto px-4 pb-8">
        <div className="mb-3">
          <h1 className="text-2xl font-bold text-gray-900">
            Partner Organizations
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and track partner organizations and their job listings
          </p>
        </div>

        {/* Consolidated Action Bar */}
        <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div>
            <h3 className="font-medium text-base mb-1">Manage Partner Listings</h3>
            <p className="text-sm text-gray-600">
              Create or import partner organizations for students
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              className="text-sm gap-1 bg-teal-500 hover:bg-teal-600 text-white"
              onClick={() => setPartnerModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Add Partner
            </Button>
          </div>
        </div>

        {/* Tab Navigation for Active/Archived */}
        <div className="mb-3 border-b border-gray-200">
          <div className="flex space-x-4">
            <button
              className={`py-1.5 px-1 -mb-px text-sm font-medium ${
                activeTab === "active"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => {
                setActiveTab("active");
                setSelectedPartner(null);
              }}
            >
              Active Partners
            </button>
            <button
              className={`py-1.5 px-1 -mb-px text-sm font-medium flex items-center gap-1 ${
                activeTab === "archived"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => {
                setActiveTab("archived");
                setSelectedPartner(null);
              }}
            >
              <Archive className="h-4 w-4" />
              Archived Partners
            </button>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search partners..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="gap-1"
              onClick={() => setFilterModalOpen(true)}
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {/* Partners Listings Column */}
          <Card className="lg:col-span-1 max-h-[calc(100vh-280px)] overflow-hidden flex flex-col">
            <CardHeader className="py-3">
              <CardTitle>{activeTab === "active" ? "Partners" : "Archived Partners"}</CardTitle>
              <CardDescription>{filteredPartners.length} partners found</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-3">
              <Suspense fallback={<p>Loading...</p>}>
                <PartnerList
                  partners={filteredPartners}
                  selectedPartner={selectedPartner}
                  onSelectPartner={setSelectedPartner}
                  jobsCount={jobsCount}
                  isLoading={isLoading}
                  searchQuery={searchQuery}
                />
              </Suspense>
            </CardContent>
          </Card>

          {/* Partner Details Column */}
          <Card className="lg:col-span-2 max-h-[calc(100vh-280px)] overflow-hidden flex flex-col">
            <CardContent className="p-0 flex-1 overflow-auto">
              {selectedPartner ? (
                <PartnerDetails
                  partner={selectedPartner}
                  jobsCount={jobsCount}
                  isLoading={isLoading}
                  onEdit={handleEditPartner}
                  onArchive={() => setIsArchiveModalOpen(true)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <Building2 className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700">
                    No partner selected
                  </h3>
                  <p className="text-gray-500 max-w-md mt-2">
                    Select a partner from the list to view its details
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Modals */}
        {/* Filters modal */}
        <Dialog open={filterModalOpen} onOpenChange={setFilterModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Filter Partners</DialogTitle>
              <DialogDescription>
                Apply filters to narrow down your partner search
              </DialogDescription>
            </DialogHeader>
            <PartnerFilters
              ref={filterRef}
              onApply={applyFilters}
              initialFilters={activeFilters}
              availableLocations={availableLocations}
            />
            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
              <Button onClick={() => filterRef.current?.applyFilters()}>
                Apply Filters
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Partner modal for add/edit */}
        <PartnerModal
          partner={editingPartner ? {
            id: editingPartner.id,
            name: editingPartner.name,
            description: editingPartner.description || '',
            industry: editingPartner.industry || '',
            location: editingPartner.location || '',
            websiteUrl: editingPartner.websiteUrl || '',
            logoUrl: editingPartner.logoUrl || '',
            contactName: editingPartner.contactName || '',
            contactEmail: editingPartner.contactEmail || '',
            contactPhone: editingPartner.contactPhone || '',
            createdAt: editingPartner.createdAt || '',
            updatedAt: editingPartner.updatedAt || ''
          } : undefined}
          open={partnerModalOpen}
          onOpenChange={setPartnerModalOpen}
          onSuccess={handlePartnerSuccess}
        />
        
        {/* Archive confirmation modal */}
        <Dialog open={isArchiveModalOpen} onOpenChange={setIsArchiveModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {selectedPartner?.is_archived ? "Restore Partner" : "Archive Partner"}
              </DialogTitle>
              <DialogDescription>
                {selectedPartner?.is_archived
                  ? "Are you sure you want to restore this partner? It will become visible again in the active partners list."
                  : "Are you sure you want to archive this partner? It will be moved to the archived list."}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsArchiveModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                variant={selectedPartner?.is_archived ? "default" : "outline"}
                className={!selectedPartner?.is_archived ? "bg-red-100 text-red-600 border-red-200 hover:bg-red-200" : ""}
                onClick={handleArchivePartner}
              >
                {selectedPartner?.is_archived ? "Restore Partner" : "Archive Partner"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}