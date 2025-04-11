"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/basic/card";
import { Button } from "@/components/ui/basic/button";
import { Input } from "@/components/ui/form/input";
import { useEffect, useState, useCallback } from "react";
import { Search, Filter, Download, Users, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs";
import { extendedPalette } from "@/lib/colors";
import { toast } from "@/components/ui/feedback/use-toast";

// Import our components
import { StatCard } from "@/components/Admin/Applicants/StatCard";
import { ApplicantCard } from "@/components/Admin/Applicants/ApplicantCard";
import { CreateUserModal } from "@/components/Admin/Applicants/CreateUserModal";
import { BulkUploadModal } from "@/components/Admin/Applicants/BulkUploadModal";
import { ApplicantProfileModal } from "@/components/Admin/Applicants/ApplicantProfileModal";
import { FilterModal } from "@/components/Admin/Applicants/FilterModal";

// Import types
import { 
  ApplicantWithDetails, 
  JobApplication, 
  NewUserData, 
  ApplicantStats,
  FilterOptions 
} from "@/components/Admin/Applicants/types";

/**
 * Renders the applicant management dashboard.
 *
 * This component fetches user and application data using API endpoints to compile 
 * a detailed list of applicants. It displays overall statistics, supports search 
 * and filter functionality, and provides modals for creating a new user or performing
 * a bulk CSV upload.
 *
 * @returns The applicant management page rendered as JSX.
 */
export default function ApplicantsPage() {
  // State for applicants data
  const [, setApplicants] = useState<ApplicantWithDetails[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<ApplicantWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [stats, setStats] = useState<ApplicantStats>({
    total: 0,
    unapplied: 0,
    interview: 0,
    placed: 0,
    archived: 0,
  });
  
  // State for modals
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);
  const [bulkUploadModalOpen, setBulkUploadModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<NewUserData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    program: "101", // Default value
  });
  
  // State for file upload
  const [csvFile, setCsvFile] = useState<File | null>(null);
  
  // State for filter modal
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    status: [],
    program: [],
    date: "all",
    sort: "newest",
    sortDir: "desc",
    minApplications: 0,
    keywords: "",
    showInactive: false,
    showArchived: false,
  });
  
  // State for applicant profile view
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantWithDetails | null>(null);
  const [viewProfileModalOpen, setViewProfileModalOpen] = useState(false);
  const [applicantJobs, setApplicantJobs] = useState<JobApplication[]>([]);
  const [loadingApplicantJobs, setLoadingApplicantJobs] = useState(false);

  // Function to load applicants from the API
  const loadApplicants = useCallback(async () => {
    try {
      setLoading(true);
      
      // Build the query string for filters
      const queryParams = new URLSearchParams();
      
      if (searchQuery) {
        queryParams.append('search', searchQuery);
      }
      
      if (filters.status.length > 0) {
        queryParams.append('status', filters.status.join(','));
      }
      
      if (filters.program.length > 0) {
        queryParams.append('program', filters.program.join(','));
      }
      
      if (filters.date !== 'all') {
        queryParams.append('date', filters.date);
      }
      
      // Add new filter parameters with proper type checks
      if (filters.sort) {
        queryParams.append('sort', filters.sort);
        queryParams.append('sortDir', filters.sortDir || 'desc');
      }
      
      if (filters.minApplications && filters.minApplications > 0) {
        queryParams.append('minApplications', filters.minApplications.toString());
      }
      
      if (filters.keywords && filters.keywords.trim() !== '') {
        queryParams.append('keywords', filters.keywords);
      }
      
      queryParams.append('showInactive', (filters.showInactive === true).toString());
      queryParams.append('showArchived', (filters.showArchived === true).toString());
      
      // Fetch data from the API
      const response = await fetch(`/api/applicants?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch applicants');
      }
      
      const data = await response.json();
      
      // Apply active tab filter (since this happens client-side)
      let filtered = data.applicants;
      if (activeTab !== "all") {
        filtered = filtered.filter((applicant: ApplicantWithDetails) => 
          applicant.status === activeTab
        );
      }
      
      setApplicants(data.applicants);
      setFilteredApplicants(filtered);
      setStats(data.stats);
    } catch (error) {
      console.error("Error loading applicants:", error);
      toast({
        title: "Error",
        description: "Failed to load applicants. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, activeTab, filters]);

  // Load applicants on initial render and when filters change
  useEffect(() => {
    loadApplicants();
  }, [loadApplicants]);

  // Handle creating a new user
  const handleCreateUser = async () => {
    if (!newUser.firstName || !newUser.lastName || !newUser.password) {
      toast({
        title: "Error",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Call the API to create a new user
      const response = await fetch('/api/applicants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
      
      setCreateUserModalOpen(false);
      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        program: "101",
      });
      
      // Reload applicants to show the new user
      await loadApplicants();
      
      toast({
        title: "Success",
        description: "New applicant was created successfully.",
      });
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: "Failed to create new applicant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle CSV file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
    }
  };

  // Handle bulk user upload
  const handleBulkUpload = async () => {
    if (!csvFile) {
      toast({
        title: "Error",
        description: "Please select a CSV file to upload.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Read the CSV file
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n');
          
          // Parse headers
          const headers = lines[0].split(',');
          
          // Validate required headers
          const requiredHeaders = ['First Name', 'Last Name', 'Email', 'Program'];
          const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
          
          if (missingHeaders.length > 0) {
            toast({
              title: "Error",
              description: `Missing required headers: ${missingHeaders.join(', ')}`,
              variant: "destructive",
            });
            setLoading(false);
            return;
          }
          
          // Process rows (skip header)
          const users = [];
          
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue; // Skip empty lines
            
            const values = lines[i].split(',');
            
            // Map values to user object
            const firstName = values[headers.indexOf('First Name')]?.trim();
            const lastName = values[headers.indexOf('Last Name')]?.trim();
            const email = values[headers.indexOf('Email')]?.trim();
            const program = values[headers.indexOf('Program')]?.trim();
            const password = values[headers.indexOf('Password')]?.trim() || 'password123'; // Default password
            
            // Basic validation
            if (!firstName || !lastName || !email || !program) {
              continue;
            }
            
            users.push({
              firstName,
              lastName,
              email,
              program,
              password,
            });
          }
          
          // Call API to bulk create users
          const response = await fetch('/api/applicants/bulk', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ users }),
          });
          
          if (!response.ok) {
            throw new Error('Failed to process bulk upload');
          }
          
          const result = await response.json();
          
          // Reset and close modal
          setCsvFile(null);
          setBulkUploadModalOpen(false);
          
          // Show feedback
          toast({
            title: "Success",
            description: `Successfully imported ${result.usersCreated} users${
              result.errors?.length ? ` (${result.errors.length} errors)` : ''
            }`,
          });
          
          // Reload applicants
          await loadApplicants();
        } catch (error) {
          console.error("Error processing CSV:", error);
          toast({
            title: "Error",
            description: "Error processing CSV file. Please check the format and try again.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };
      
      reader.onerror = () => {
        setLoading(false);
        toast({
          title: "Error",
          description: "Error reading the file",
          variant: "destructive",
        });
      };
      
      reader.readAsText(csvFile);
    } catch (error) {
      console.error("Error processing CSV file:", error);
      toast({
        title: "Error",
        description: "Error processing CSV file. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  // Handle CSV export
  const handleExport = () => {
    try {
      // Define CSV headers
      const headers = [
        'User ID',
        'Name',
        'Email',
        'Program',
        'Status',
        'Join Date',
        'Applications'
      ];
      
      // Convert applicants to CSV rows
      const rows = filteredApplicants.map(applicant => [
        applicant.userId,
        applicant.firstName + ' ' + applicant.lastName,
        applicant.email,
        applicant.program,
        applicant.status || 'Active',
        new Date(applicant.createdAt).toLocaleDateString(),
        applicant.applications || 0,
      ]);
      
      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      // Create a blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Set up download
      link.setAttribute('href', url);
      link.setAttribute('download', `applicants_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Show feedback
      toast({
        title: "Export Successful",
        description: `${rows.length} applicants exported to CSV.`,
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data.",
        variant: "destructive",
      });
    }
  };

  // Handle viewing an applicant's profile
  const handleViewProfile = async (applicant: ApplicantWithDetails) => {
    setSelectedApplicant(applicant);
    setViewProfileModalOpen(true);
    await loadApplicantJobs(applicant.id);
  };

  // Load applicant's job applications
  const loadApplicantJobs = async (applicantId: number) => {
    setLoadingApplicantJobs(true);
    try {
      // Call the API to get applicant details including job applications
      const response = await fetch(`/api/applicants/${applicantId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch applicant details');
      }
      
      const data = await response.json();
      setApplicantJobs(data.jobApplications);
    } catch (error) {
      console.error("Error loading applicant jobs:", error);
      toast({
        title: "Error",
        description: "Failed to load applicant's job applications.",
        variant: "destructive",
      });
    } finally {
      setLoadingApplicantJobs(false);
    }
  };

  // Handle applying filters
  const applyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setFilterModalOpen(false);
  };

  // Handle resetting filters
  const resetFilters = () => {
    setFilters({
      status: [],
      program: [],
      date: "all",
      sort: "newest",
      sortDir: "desc",
      minApplications: 0,
      keywords: "",
      showInactive: false,
      showArchived: false,
    });
    setFilterModalOpen(false);
  };

  return (
    <DashboardLayout isAdmin>
      <div className="container py-6 px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: extendedPalette.primaryBlue }}
            >
              Applicant Management
            </h1>
            <p className="text-gray-500 mt-1">
              View and manage student applicants in Philadelphia tech programs
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
              onClick={() => setCreateUserModalOpen(true)}
              style={{ backgroundColor: extendedPalette.primaryGreen, borderColor: extendedPalette.primaryGreen }}
            >
              <Users className="h-4 w-4" /> Create User
            </Button>
            <Button
              variant="default"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setBulkUploadModalOpen(true)}
              style={{ backgroundColor: extendedPalette.primaryBlue, borderColor: extendedPalette.primaryBlue }}
            >
              <FileText className="h-4 w-4" /> Bulk Upload
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleExport}
            >
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <StatCard
            title="Total Applicants"
            value={stats.total}
            icon={
              <Users
                className="h-5 w-5"
                style={{ color: extendedPalette.primaryBlue }}
              />
            }
            isLoading={loading}
          />
          <StatCard
            title="Unapplied"
            value={stats.unapplied}
            icon={
              <Users
                className="h-5 w-5"
                style={{ color: extendedPalette.primaryGreen }}
              />
            }
            isLoading={loading}
          />
          <StatCard
            title="In Interview Process"
            value={stats.interview}
            icon={
              <Users
                className="h-5 w-5"
                style={{ color: extendedPalette.teal }}
              />
            }
            isLoading={loading}
          />
          <StatCard
            title="Successfully Placed"
            value={stats.placed}
            icon={
              <Users
                className="h-5 w-5"
                style={{ color: extendedPalette.primaryOrange }}
              />
            }
            isLoading={loading}
          />
          <StatCard
            title="Archived"
            value={stats.archived}
            icon={
              <Users
                className="h-5 w-5"
                style={{ color: extendedPalette.darkGray }}
              />
            }
            isLoading={loading}
          />
        </div>

        {/* Search and Filter */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by name, ID or email..."
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
              Filter {(filters.status.length > 0 || filters.program.length > 0 || filters.date !== "all") && (
                <span className="ml-1 bg-blue-100 text-blue-800 rounded-full text-xs py-1 px-2">
                  {filters.status.length + filters.program.length + (filters.date !== "all" ? 1 : 0)}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" onValueChange={setActiveTab} className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Applicants</TabsTrigger>
            <TabsTrigger value="unapplied">Unapplied</TabsTrigger>
            <TabsTrigger value="interview">In Interview</TabsTrigger>
            <TabsTrigger value="placed">Placed</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Applicant List</CardTitle>
                    <CardDescription>
                      {filteredApplicants.length}{" "}
                      {filteredApplicants.length === 1
                        ? "applicant"
                        : "applicants"}{" "}
                      found
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="animate-pulse space-y-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-20 bg-gray-100 rounded-lg" />
                      ))}
                    </div>
                  ) : filteredApplicants.length > 0 ? (
                    filteredApplicants.map((applicant) => (
                      <ApplicantCard
                        key={applicant.id}
                        applicant={applicant}
                        onViewProfile={handleViewProfile}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <h3 className="text-lg font-medium mb-2">
                        No Applicants Found
                      </h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        No applicants match your current search criteria. Try
                        adjusting your filters or search terms.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Filter Modal */}
        <FilterModal
          open={filterModalOpen}
          onOpenChange={setFilterModalOpen}
          filters={filters}
          onApplyFilters={applyFilters}
          onResetFilters={resetFilters}
        />

        {/* Create User Modal */}
        <CreateUserModal
          open={createUserModalOpen}
          onOpenChange={setCreateUserModalOpen}
          newUser={newUser}
          setNewUser={setNewUser}
          onCreateUser={handleCreateUser}
        />

        {/* Bulk Upload Modal */}
        <BulkUploadModal
          open={bulkUploadModalOpen}
          onOpenChange={setBulkUploadModalOpen}
          csvFile={csvFile}
          onFileChange={handleFileChange}
          onBulkUpload={handleBulkUpload}
        />

        {/* Applicant Profile Modal */}
        <ApplicantProfileModal
          open={viewProfileModalOpen}
          onOpenChange={setViewProfileModalOpen}
          applicant={selectedApplicant}
          jobApplications={applicantJobs}
          loadingApplications={loadingApplicantJobs}
          onRefresh={loadApplicants}
        />
      </div>
    </DashboardLayout>
  );
}