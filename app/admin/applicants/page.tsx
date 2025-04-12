"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent } from "@/components/ui/basic/card";
import { Button } from "@/components/ui/basic/button";
import { Input } from "@/components/ui/form/input";
import { useEffect, useState, useCallback } from "react";
import { Search, Users, FileText } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs";
import { toast } from "@/components/ui/feedback/use-toast";

// Import our components
import { ApplicantCard } from "@/components/Admin/Applicants/ApplicantCard";
import { CreateUserModal } from "@/components/Admin/Applicants/CreateUserModal";
import { BulkUploadModal } from "@/components/Admin/Applicants/BulkUploadModal";
import { ApplicantProfileModal } from "@/components/Admin/Applicants/ApplicantProfileModal";

// Import types
import { 
  ApplicantWithDetails, 
  JobApplication, 
  NewUserData
} from "@/components/Admin/Applicants/types";

const PROGRAM_TABS = ["ALL", "FOUNDATION", "101", "LIFTOFF", "ALUMNI"] as const;

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
  const [filteredApplicants, setFilteredApplicants] = useState<ApplicantWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for search and program tab
  const [searchQuery, setSearchQuery] = useState("");
  const [activeProgram, setActiveProgram] = useState<typeof PROGRAM_TABS[number]>("ALL");
  
  // State for modals
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);
  const [bulkUploadModalOpen, setBulkUploadModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [newUser, setNewUser] = useState<NewUserData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    program: "101",
  });
  
  // State for file upload
  const [csvFile, setCsvFile] = useState<File | null>(null);
  
  // State for applicant profile view
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantWithDetails | null>(null);
  const [viewProfileModalOpen, setViewProfileModalOpen] = useState(false);
  const [applicantJobs, setApplicantJobs] = useState<JobApplication[]>([]);
  const [loadingApplicantJobs, setLoadingApplicantJobs] = useState(false);

  // Function to load applicants from the API
  const loadApplicants = useCallback(async () => {
    try {
      setLoading(true);
      
      // Build the query string for search only
      const queryParams = new URLSearchParams();
      
      if (searchQuery) {
        queryParams.append('search', searchQuery);
      }
      
      // Fetch data from the API
      const response = await fetch(`/api/applicants?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch applicants');
      }
      
      const data = await response.json();
      
      // Filter by active program if not "ALL"
      const filtered = activeProgram === "ALL" 
        ? data.applicants
        : data.applicants.filter((applicant: ApplicantWithDetails) => 
            applicant.program.toUpperCase() === activeProgram
          );
      
      setFilteredApplicants(filtered);
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
  }, [searchQuery, activeProgram]);

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
      
      // Generate username from first and last name
      const username = `${newUser.firstName.toLowerCase()}.${newUser.lastName.toLowerCase()}`;
      
      const response = await fetch('/api/applicants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newUser,
          username,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create user');
      }
      
      setCreateUserModalOpen(false);
      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        program: "101",
      });
      
      await loadApplicants();
      
      toast({
        title: "Success",
        description: "New applicant was created successfully.",
      });
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create new applicant. Please try again.",
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
      
      const formData = new FormData();
      formData.append('file', csvFile);
      
      const response = await fetch('/api/applicants/bulk', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload users');
      }
      
      setBulkUploadModalOpen(false);
      setCsvFile(null);
      
      await loadApplicants();
      
      toast({
        title: "Success",
        description: "Users were uploaded successfully.",
      });
    } catch (error) {
      console.error("Error uploading users:", error);
      toast({
        title: "Error",
        description: "Failed to upload users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle viewing an applicant's profile
  const handleViewProfile = async (applicant: ApplicantWithDetails) => {
    setSelectedApplicant(applicant);
    setViewProfileModalOpen(true);
    await loadApplicantJobs(applicant.id);
  };

  // Handle editing an applicant
  const handleEditApplicant = (applicant: ApplicantWithDetails) => {
    setNewUser({
      firstName: applicant.firstName,
      lastName: applicant.lastName,
      email: applicant.email,
      password: "",
      program: applicant.program,
    });
    setEditUserId(applicant.id);
    setIsEditMode(true);
    setViewProfileModalOpen(false);
    setCreateUserModalOpen(true);
  };

  // Handle updating a user
  const handleUpdateUser = async () => {
    if (!newUser.firstName || !newUser.lastName || !editUserId) {
      toast({
        title: "Error",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(`/api/applicants?id=${editUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          program: newUser.program,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update user');
      }
      
      setCreateUserModalOpen(false);
      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        program: "101",
      });
      setIsEditMode(false);
      setEditUserId(null);
      
      await loadApplicants();
      
      toast({
        title: "Success",
        description: "Applicant was updated successfully.",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update applicant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load an applicant's job applications
  const loadApplicantJobs = async (applicantId: number) => {
    try {
      setLoadingApplicantJobs(true);
      const response = await fetch(`/api/applicants?id=${applicantId}&applications=true`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch applicant jobs');
      }
      
      const data = await response.json();
      setApplicantJobs(data.applications || []); // Ensure we handle the correct response structure
    } catch (error) {
      console.error("Error loading applicant jobs:", error);
      toast({
        title: "Error",
        description: "Failed to load applicant's job applications. Please try again.",
        variant: "destructive",
      });
      setApplicantJobs([]); // Set empty array on error
    } finally {
      setLoadingApplicantJobs(false);
    }
  };

  return (
    <DashboardLayout isAdmin>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Applicants</h1>
            <p className="text-muted-foreground">
              Manage and track applicant progress
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setBulkUploadModalOpen(true)}
              className="border-[#0faec9] text-[#0faec9] hover:bg-[#c3ebf1] hover:text-[#0a8196]"
            >
              <FileText className="h-4 w-4 mr-2" />
              Bulk Upload
            </Button>
            <Button
              onClick={() => setCreateUserModalOpen(true)}
              className="bg-[#0faec9] text-white hover:bg-[#0a8196]"
            >
              <Users className="h-4 w-4 mr-2" />
              Add Applicant
            </Button>
          </div>
        </div>

        {/* Search and Program Tabs */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search applicants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Tabs 
            value={activeProgram} 
            onValueChange={(value) => setActiveProgram(value as typeof PROGRAM_TABS[number])}
            className="w-full"
          >
            <TabsList className="w-full bg-[#f7f7f7]">
              {PROGRAM_TABS.map((program) => (
                <TabsTrigger
                  key={program}
                  value={program}
                  className="flex-1 data-[state=active]:bg-[#0faec9] data-[state=active]:text-white"
                >
                  {program === "FOUNDATION" ? "Foundations" : program}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Applicants List */}
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="h-24 animate-pulse bg-gray-100" />
                </Card>
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
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <h3 className="font-medium mb-1">No Applicants Found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? "Try adjusting your search query"
                    : activeProgram === "ALL"
                    ? "No applicants in the system yet"
                    : `No applicants in the ${activeProgram === "FOUNDATION" ? "Foundations" : activeProgram} program yet`}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateUserModal
        open={createUserModalOpen}
        onOpenChange={(open) => {
          setCreateUserModalOpen(open);
          if (!open) {
            setIsEditMode(false);
            setEditUserId(null);
            setNewUser({
              firstName: "",
              lastName: "",
              email: "",
              password: "",
              program: "101",
            });
          }
        }}
        newUser={newUser}
        setNewUser={setNewUser}
        onCreateUser={isEditMode ? handleUpdateUser : handleCreateUser}
        isEditMode={isEditMode}
      />
      
      <BulkUploadModal
        open={bulkUploadModalOpen}
        onOpenChange={setBulkUploadModalOpen}
        csvFile={csvFile}
        onFileChange={handleFileChange}
        onBulkUpload={handleBulkUpload}
      />
      
      <ApplicantProfileModal
        open={viewProfileModalOpen}
        onOpenChange={setViewProfileModalOpen}
        applicant={selectedApplicant}
        jobApplications={applicantJobs}
        loadingApplications={loadingApplicantJobs}
        onRefresh={loadApplicants}
        onEdit={handleEditApplicant}
      />
    </DashboardLayout>
  );
}