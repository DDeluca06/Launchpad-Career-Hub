"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/basic/card";
import { Button } from "@/components/ui/basic/button";
import { Input } from "@/components/ui/form/input";
import { applicationService, userService, jobService } from "@/lib/local-storage";
import { useEffect, useState, useRef } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/basic/avatar";
import { Badge } from "@/components/ui/basic/badge";
import {
  Search,
  Filter,
  Download,
  Users,
  Mail,
  User as UserIcon,
  Clock,
  FileText,
  Upload,
  UserPlus,
  FileSpreadsheet,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/navigation/tabs";
import { extendedPalette } from "@/lib/colors";
import { Skeleton } from "@/components/ui/feedback/skeleton";
import { cn } from "@/lib/utils";
import { MultiPurposeModal } from "@/components/ui/overlay/multi-purpose-modal";
import { Label } from "@/components/ui/basic/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/form/select";
import { toast } from "@/components/ui/feedback/use-toast";

// Define User interface to match actual structure
interface User {
  user_id: number;
  username: string;
  name: string;
  email: string;
  password: string;
  role: string;
  isAdmin: boolean;
  program: string;
  created_at: string;
}

interface Application {
  id: string;
  user_id: number;
  status: string;
}

// New interface for job application details
interface JobApplication {
  id: number;
  jobId: number;
  jobTitle: string;
  company: string;
  status: string;
  appliedDate: string;
}

// Fix the ApplicantWithDetails interface to match the mapping below
interface ApplicantWithDetails {
  id: number;
  userId: string; // Changed to string for lp prefix format
  firstName: string; // Changed from name to firstName
  lastName: string; // Added lastName
  email: string;
  role: string;
  applications: number;
  status: string;
  createdAt: string;
  program: string; // Added program field
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  isLoading: boolean;
  className?: string;
}

/**
 * Renders a statistic card that displays a title, value, and icon.
 *
 * When the data is loading, a skeleton placeholder is shown instead of the statistic value.
 *
 * @param title - The label for the statistic.
 * @param value - The statistic value to display.
 * @param icon - The icon associated with the statistic.
 * @param isLoading - Indicates whether the statistic value is currently loading.
 * @param className - Optional CSS class names to customize the card's styling.
 */
function StatCard({ title, value, icon, isLoading, className }: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            {isLoading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <p className="text-2xl font-bold mt-1">{value}</p>
            )}
          </div>
          <div className="rounded-full p-3 bg-gray-50">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Renders the applicant management dashboard.
 *
 * This component fetches user and application data to compile a detailed list of applicants,
 * complete with mock status values for demonstration purposes. It displays overall statistics,
 * supports search and filter functionality, and provides modals for creating a new user or performing
 * a bulk CSV upload. Applicant data and UI states are managed using React hooks, and errors encountered
 * during data operations are logged to the console.
 *
 * @returns The applicant management page rendered as JSX.
 */
export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<ApplicantWithDetails[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<
    ApplicantWithDetails[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    interview: 0,
    placed: 0,
  });
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);
  const [bulkUploadModalOpen, setBulkUploadModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    firstName: "", // Changed from name to firstName
    lastName: "", // Added lastName
    email: "",
    password: "",
    role: "applicant",
    isAdmin: false,
    program: "101", // Default value set to 101
  });
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [lastUserId, setLastUserId] = useState(3); // Start with 3 to generate lp0004 as next ID
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: [] as string[],
    program: [] as string[],
    date: "all",
  });
  const [showImportModal, setShowImportModal] = useState(false);
  const [csvFileRef, setCsvFileRef] = useState<React.RefObject<HTMLInputElement> | null>(null);
  
  // State for applicant profile view
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantWithDetails | null>(null);
  const [viewProfileModalOpen, setViewProfileModalOpen] = useState(false);
  const [applicantJobs, setApplicantJobs] = useState<JobApplication[]>([]);
  const [loadingApplicantJobs, setLoadingApplicantJobs] = useState(false);

  // Define loadApplicants as a component function
  const loadApplicants = async () => {
    try {
      const users = (await userService.getAll()) as unknown as User[];
      const applications =
        (await applicationService.getAll()) as unknown as Application[];

      // Create mock statuses for demo purposes
      const statuses = ["active", "interview", "placed", "inactive"];
      
      // Find the highest user ID number
      const userIdPattern = /lp(\d+)/;
      let highestIdNum = 0;
      
      users.forEach(user => {
        if (typeof user.username === 'string') {
          const match = user.username.match(userIdPattern);
          if (match && match[1]) {
            const idNum = parseInt(match[1], 10);
            if (idNum > highestIdNum) {
              highestIdNum = idNum;
            }
          }
        }
      });
      
      setLastUserId(highestIdNum || 3); // Default to 3 if no IDs found

      // For demo purposes, assume user structure and create mock data
      const applicantDetails = users
        .filter((user) => user.role === "applicant")
        .map((user) => {
          const userApplications = applications.filter(
            (app) => app.user_id === user.user_id,
          );
          // Randomly assign a status for demo purposes
          const randomStatus =
            statuses[Math.floor(Math.random() * statuses.length)];
            
          // Split name into first and last (if available)
          const nameParts = (user.name || "").split(' ');
          const firstName = nameParts[0] || "Student";
          const lastName = nameParts.slice(1).join(' ') || "";
          
          // Format user ID with lp prefix
          const userId = user.username.startsWith('lp') 
            ? user.username 
            : `lp${user.user_id.toString().padStart(4, '0')}`;

          return {
            id: user.user_id,
            userId: userId,
            firstName: firstName,
            lastName: lastName, 
            email: user.email || `${user.username}@example.com`, // Fallback if email not available
            role: user.role,
            applications: userApplications.length,
            status: randomStatus,
            createdAt: user.created_at || new Date().toISOString(),
            program: user.program || "101" // Default to 101 if not specified
          } as ApplicantWithDetails;
        });

      // Calculate stats
      const statsData = {
        total: applicantDetails.length,
        active: applicantDetails.filter((a) => a.status === "active").length,
        interview: applicantDetails.filter((a) => a.status === "interview")
          .length,
        placed: applicantDetails.filter((a) => a.status === "placed").length,
      };

      setApplicants(applicantDetails);
      setFilteredApplicants(applicantDetails);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading applicants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplicants();
  }, []);

  // Add a new filter function
  const applyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setFilterModalOpen(false);
    
    // Apply filtering logic
    let result = [...applicants];

    // Apply status filter
    if (newFilters.status.length > 0) {
      result = result.filter(applicant => 
        newFilters.status.includes(applicant.status)
      );
    }

    // Apply program filter
    if (newFilters.program.length > 0) {
      result = result.filter(applicant => 
        newFilters.program.includes(applicant.program)
      );
    }

    // Apply date filter
    if (newFilters.date !== "all") {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (newFilters.date) {
        case "last7days":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "last30days":
          cutoffDate.setDate(now.getDate() - 30);
          break;
        case "last90days":
          cutoffDate.setDate(now.getDate() - 90);
          break;
      }
      
      result = result.filter(applicant => 
        new Date(applicant.createdAt) >= cutoffDate
      );
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (applicant) =>
          applicant.firstName.toLowerCase().includes(query) ||
          applicant.lastName.toLowerCase().includes(query) ||
          applicant.email.toLowerCase().includes(query) ||
          applicant.userId.toLowerCase().includes(query),
      );
    }

    setFilteredApplicants(result);
  };

  // Update useEffect for filtering
  useEffect(() => {
    let result = [...applicants];

    // Apply active filters
    if (filters.status.length > 0) {
      result = result.filter(applicant => 
        filters.status.includes(applicant.status)
      );
    }

    if (filters.program.length > 0) {
      result = result.filter(applicant => 
        filters.program.includes(applicant.program)
      );
    }

    if (filters.date !== "all") {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (filters.date) {
        case "last7days":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "last30days":
          cutoffDate.setDate(now.getDate() - 30);
          break;
        case "last90days":
          cutoffDate.setDate(now.getDate() - 90);
          break;
      }
      
      result = result.filter(applicant => 
        new Date(applicant.createdAt) >= cutoffDate
      );
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (applicant) =>
          applicant.firstName.toLowerCase().includes(query) ||
          applicant.lastName.toLowerCase().includes(query) ||
          applicant.email.toLowerCase().includes(query) ||
          applicant.userId.toLowerCase().includes(query),
      );
    }

    // Apply tab filter
    if (activeTab !== "all") {
      result = result.filter((applicant) => applicant.status === activeTab);
    }

    setFilteredApplicants(result);
  }, [searchQuery, activeTab, applicants, filters]);

  function getStatusBadge(status: string) {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Active
          </Badge>
        );
      case "interview":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            In Interview
          </Badge>
        );
      case "placed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Placed
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Inactive
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            {status}
          </Badge>
        );
    }
  }

  // Update the handler
  const handleCreateUser = async () => {
    if (!newUser.username || !newUser.email || !newUser.password) return;

    try {
      // Generate the next user ID with lp prefix
      const nextUserId: number = lastUserId + 1;
      const userIdWithPrefix: string = `lp${nextUserId.toString().padStart(4, '0')}`;
      
      // In a real app, this would call your API
      const newUserData = {
        ...newUser,
        username: userIdWithPrefix, // Use formatted ID as username
        name: `${newUser.firstName} ${newUser.lastName}`, // Combine first and last name
        user_id: nextUserId,
        created_at: new Date().toISOString(),
        status: "active" // Add required status property
      };

      await userService.create(newUserData);
      setCreateUserModalOpen(false);
      setLastUserId(nextUserId);
      setNewUser({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "applicant",
        isAdmin: false,
        program: "101",
      });

      // Reload applicants
      await loadApplicants();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  // Handle CSV file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleBulkUpload = async () => {
    if (!csvFile) return;

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
            alert(`Missing required headers: ${missingHeaders.join(', ')}`);
            setLoading(false);
            return;
          }
          
          // Process rows (skip header)
          const newUsers = [];
          let errorCount = 0;
          
          for (let i = 1; i < Math.min(lines.length, 101); i++) {
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
              errorCount++;
              continue;
            }
            
            // Validate program
            if (program !== '101' && program !== 'LIFTOFF') {
              errorCount++;
              continue;
            }
            
            // Create user
            const nextUserId: number = lastUserId + newUsers.length + 1;
            const userIdWithPrefix: string = `lp${nextUserId.toString().padStart(4, '0')}`;
            
            newUsers.push({
              username: userIdWithPrefix,
              name: `${firstName} ${lastName}`,
              firstName,
              lastName,
              email,
              password,
              role: 'applicant',
              isAdmin: false,
              program,
              user_id: nextUserId,
              created_at: new Date().toISOString(),
              status: 'active'  // Add the status property
            });
          }
          
          // Save users to local storage
          for (const user of newUsers) {
            await userService.create(user);
          }
          
          // Update lastUserId
          setLastUserId(lastUserId + newUsers.length);
          
          // Reset and close modal
          setCsvFile(null);
          setBulkUploadModalOpen(false);
          
          // Show feedback
          alert(`Successfully imported ${newUsers.length} users${errorCount > 0 ? ` (${errorCount} errors)` : ''}`);
          
          // Reload applicants
          await loadApplicants();
        } catch (error) {
          console.error("Error processing CSV:", error);
          alert("Error processing CSV file. Please check the format and try again.");
        } finally {
          setLoading(false);
        }
      };
      
      reader.onerror = () => {
        setLoading(false);
        alert("Error reading the file");
      };
      
      reader.readAsText(csvFile);
    } catch (error) {
      console.error("Error processing CSV file:", error);
      alert("Error processing CSV file. Please try again.");
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
        'Interview Count',
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
        applicant.applications || 0
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
      // In a real app, this would call your API
      // For demo, generate mock data
      const allJobs = await jobService.getAll();
      const mockApplications: JobApplication[] = [];
      
      // Application statuses based on the diagram
      const statuses = [
        "interested", 
        "applied", 
        "phoneScreening", 
        "interviewStage", 
        "finalInterviewStage",
        "offerExtended", 
        "negotiation", 
        "offerAccepted", 
        "rejected"
      ];
      
      // Create 1-4 mock applications based on applicant ID
      const appCount = Math.min((applicantId % 4) + 1, allJobs.length);
      
      for (let i = 0; i < appCount; i++) {
        const job = allJobs[i % allJobs.length];
        mockApplications.push({
          id: i + 1,
          jobId: job.job_id,
          jobTitle: job.title,
          company: job.company,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          appliedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        });
      }
      
      setApplicantJobs(mockApplications);
    } catch (error) {
      console.error("Error loading applicant jobs:", error);
    } finally {
      setLoadingApplicantJobs(false);
    }
  };

  // Function to get badge for application status
  const getApplicationStatusBadge = (status: string) => {
    switch (status) {
      case "interested":
        return <Badge className="bg-blue-100 text-blue-800">Interested</Badge>;
      case "applied":
        return <Badge className="bg-purple-100 text-purple-800">Applied</Badge>;
      case "phoneScreening":
        return <Badge className="bg-indigo-100 text-indigo-800">Phone Screening</Badge>;
      case "interviewStage":
        return <Badge className="bg-cyan-100 text-cyan-800">Interview Stage</Badge>;
      case "finalInterviewStage":
        return <Badge className="bg-teal-100 text-teal-800">Final Interview</Badge>;
      case "offerExtended":
        return <Badge className="bg-yellow-100 text-yellow-800">Offer Extended</Badge>;
      case "negotiation":
        return <Badge className="bg-orange-100 text-orange-800">Negotiation</Badge>;
      case "offerAccepted":
        return <Badge className="bg-green-100 text-green-800">Offer Accepted</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
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
              <UserPlus className="h-4 w-4" /> Create User
            </Button>
            <Button
              variant="default"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setBulkUploadModalOpen(true)}
              style={{ backgroundColor: extendedPalette.primaryBlue, borderColor: extendedPalette.primaryBlue }}
            >
              <FileSpreadsheet className="h-4 w-4" /> Bulk Upload
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
            title="Active Applicants"
            value={stats.active}
            icon={
              <UserIcon
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
              <Clock
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
              <FileText
                className="h-5 w-5"
                style={{ color: extendedPalette.primaryOrange }}
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
                <Badge className="ml-1 bg-blue-100 text-blue-800 hover:bg-blue-100">
                  {filters.status.length + filters.program.length + (filters.date !== "all" ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" onValueChange={setActiveTab} className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Applicants</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="interview">In Interview</TabsTrigger>
            <TabsTrigger value="placed">Placed</TabsTrigger>
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
                      <Card
                        key={applicant.id}
                        className="overflow-hidden hover:shadow-md transition-all cursor-pointer"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${applicant.firstName} ${applicant.lastName}`}
                                alt={`${applicant.firstName} ${applicant.lastName}`}
                              />
                              <AvatarFallback>
                                {applicant.firstName.charAt(0)}{applicant.lastName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">
                                  {applicant.firstName} {applicant.lastName}
                                </h3>
                                {getStatusBadge(applicant.status)}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">
                                  {applicant.userId}
                                </span>
                                <span className="text-sm text-gray-500">
                                  • {applicant.email}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-gray-500">
                                  {applicant.applications}{" "}
                                  {applicant.applications === 1
                                    ? "application"
                                    : "applications"}
                                </span>
                                <span className="text-xs text-gray-500">
                                  Program: {applicant.program}
                                </span>
                                <span className="text-xs text-gray-500">
                                  Joined{" "}
                                  {new Date(
                                    applicant.createdAt,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              className="shrink-0"
                              onClick={() => handleViewProfile(applicant)}
                            >
                              View Profile
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
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
        <MultiPurposeModal
          open={filterModalOpen}
          onOpenChange={setFilterModalOpen}
          title="Filter Applicants"
          size="md"
          showFooter={true}
          primaryActionText="Apply Filters"
          onPrimaryAction={() => applyFilters(filters)}
          secondaryActionText="Reset Filters"
          onSecondaryAction={() => {
            setFilters({
              status: [],
              program: [],
              date: "all",
            });
            applyFilters({
              status: [],
              program: [],
              date: "all",
            });
          }}
        >
          <div className="py-4 space-y-6">
            <div>
              <Label className="text-base font-medium mb-2 block">Status</Label>
              <div className="flex flex-wrap gap-2">
                {["active", "interview", "placed", "inactive"].map((status) => (
                  <Badge
                    key={status}
                    variant={filters.status.includes(status) ? "default" : "outline"}
                    className={`cursor-pointer capitalize ${
                      filters.status.includes(status)
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      const newStatus = filters.status.includes(status)
                        ? filters.status.filter(s => s !== status)
                        : [...filters.status, status];
                      setFilters({ ...filters, status: newStatus });
                    }}
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
                    variant={filters.program.includes(program) ? "default" : "outline"}
                    className={`cursor-pointer ${
                      filters.program.includes(program)
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      const newProgram = filters.program.includes(program)
                        ? filters.program.filter(p => p !== program)
                        : [...filters.program, program];
                      setFilters({ ...filters, program: newProgram });
                    }}
                  >
                    {program}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium mb-2 block">Join Date</Label>
              <Select
                value={filters.date}
                onValueChange={(value) => setFilters({ ...filters, date: value })}
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

            {/* Filter summary */}
            {(filters.status.length > 0 || filters.program.length > 0 || filters.date !== "all") && (
              <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-blue-700">Active filters</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-blue-600"
                    onClick={() => {
                      setFilters({
                        status: [],
                        program: [],
                        date: "all",
                      });
                    }}
                  >
                    Clear all
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {filters.status.map(status => (
                    <Badge key={status} className="bg-blue-100 text-blue-800 capitalize">
                      {status}
                    </Badge>
                  ))}
                  {filters.program.map(program => (
                    <Badge key={program} className="bg-blue-100 text-blue-800">
                      Program: {program}
                    </Badge>
                  ))}
                  {filters.date !== "all" && (
                    <Badge className="bg-blue-100 text-blue-800">
                      {filters.date === "last7days" && "Last 7 days"}
                      {filters.date === "last30days" && "Last 30 days"}
                      {filters.date === "last90days" && "Last 90 days"}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </MultiPurposeModal>

        {/* Create User Modal - Improved version */}
        <MultiPurposeModal
          open={createUserModalOpen}
          onOpenChange={setCreateUserModalOpen}
          title="Create New User"
          size="md"
          showFooter={true}
          primaryActionText="Create User"
          onPrimaryAction={handleCreateUser}
          secondaryActionText="Cancel"
          onSecondaryAction={() => setCreateUserModalOpen(false)}
        >
          <div className="py-4 space-y-4">
            <p className="text-sm text-gray-500 mb-4">Add a new applicant user to the system</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={newUser.firstName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, firstName: e.target.value })
                  }
                  placeholder="First Name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={newUser.lastName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, lastName: e.target.value })
                  }
                  placeholder="Last Name"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                placeholder="Email"
                type="email"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                placeholder="Password"
                type="password"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="program">Program</Label>
              <Select
                value={newUser.program}
                onValueChange={(value: string) => setNewUser({ ...newUser, program: value })}
              >
                <SelectTrigger id="program">
                  <SelectValue placeholder="Select a program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="101">101</SelectItem>
                  <SelectItem value="LIFTOFF">LIFTOFF</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </MultiPurposeModal>

        {/* Bulk Upload Modal - Improved version */}
        <MultiPurposeModal
          open={bulkUploadModalOpen}
          onOpenChange={setBulkUploadModalOpen}
          title="Bulk Upload Users"
          size="md"
          showFooter={true}
          primaryActionText="Upload and Process"
          onPrimaryAction={handleBulkUpload}
          secondaryActionText="Cancel"
          onSecondaryAction={() => {
            setCsvFile(null);
            setBulkUploadModalOpen(false);
          }}
        >
          <div className="py-4 space-y-4">
            <p className="text-sm text-gray-500 mb-2">
              Upload a CSV file with user data. The file should include columns for first name, last name, email, and program.
            </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="cursor-pointer block">
                <Upload className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                <div className="font-medium mb-1">
                  {csvFile ? csvFile.name : "Drop your CSV file here"}
                </div>
                <p className="text-sm text-gray-500 mb-3">
                  or click to browse
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('csv-upload')?.click();
                  }}
                >
                  Browse Files
                </Button>
              </label>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">CSV Format Requirements</h4>
              <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                <li>First row must contain column headers</li>
                <li>Required columns: First Name, Last Name, Email, Program</li>
                <li>Program must be one of: 101, LIFTOFF</li>
                <li>Passwords will be auto-generated if not provided</li>
                <li>Maximum 100 users per upload</li>
              </ul>
            </div>
            
            <div className="text-center">
              <Button 
                variant="link" 
                size="sm" 
                className="text-xs"
                onClick={() => {
                  // Create template CSV
                  const template = "First Name,Last Name,Email,Program\nJohn,Doe,john.doe@example.com,101\nJane,Smith,jane.smith@example.com,LIFTOFF";
                  const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', 'applicants_template.csv');
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                Download Template
              </Button>
            </div>
          </div>
        </MultiPurposeModal>

        {/* Import CSV Modal */}
        <MultiPurposeModal
          open={showImportModal}
          onOpenChange={setShowImportModal}
          title="Import Applicants"
          description="Upload multiple applicant profiles at once."
          primaryActionText="Import"
          onPrimaryAction={handleBulkUpload}
          secondaryActionText="Cancel"
          onSecondaryAction={() => setShowImportModal(false)}
          size="md"
        >
          <div className="my-4 space-y-4">
            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
              <h3 className="font-medium text-yellow-800 mb-2">CSV Format Requirements:</h3>
              <ul className="list-disc pl-5 text-sm text-yellow-700 space-y-1">
                <li>File must be in CSV format</li>
                <li>Required columns: First Name, Last Name, Email, Program</li>
                <li>Program values should be either "101" or "LIFTOFF"</li>
                <li>First row must contain headers</li>
                <li>Maximum 100 users per import</li>
              </ul>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Label htmlFor="csv-file">Select CSV File</Label>
              <Input 
                id="csv-file" 
                type="file" 
                accept=".csv" 
                ref={csvFileRef}
                onChange={(e) => setCsvFile(e.target.files ? e.target.files[0] : null)}
                className="cursor-pointer"
              />
            </div>
            
            {csvFile && (
              <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                <p className="text-sm text-blue-700">
                  Selected file: <span className="font-medium">{csvFile.name}</span> ({(csvFile.size / 1024).toFixed(2)} KB)
                </p>
              </div>
            )}
          </div>
        </MultiPurposeModal>

        {/* Add Profile Modal after the other modals */}
        <MultiPurposeModal
          open={viewProfileModalOpen}
          onOpenChange={setViewProfileModalOpen}
          title={selectedApplicant ? `${selectedApplicant.firstName} ${selectedApplicant.lastName}` : "Applicant Profile"}
          size="lg"
          showFooter={true}
          primaryActionText="Close"
          onPrimaryAction={() => setViewProfileModalOpen(false)}
          secondaryActionText=""
          onSecondaryAction={() => {}}
        >
          {selectedApplicant && (
            <div className="py-4 space-y-6">
              {/* Applicant Overview */}
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedApplicant.firstName} ${selectedApplicant.lastName}`}
                    alt={`${selectedApplicant.firstName} ${selectedApplicant.lastName}`}
                  />
                  <AvatarFallback>
                    {selectedApplicant.firstName.charAt(0)}{selectedApplicant.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">{selectedApplicant.firstName} {selectedApplicant.lastName}</h2>
                    {getStatusBadge(selectedApplicant.status)}
                  </div>
                  <div className="text-sm text-muted-foreground">{selectedApplicant.userId}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedApplicant.email}</span>
                  </div>
                </div>
              </div>
              
              {/* Applicant Status & Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium">Program</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p>{selectedApplicant.program}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium">Status</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(selectedApplicant.status)}
                      <span className="text-sm">
                        {selectedApplicant.status === "active" && "Working, searching, interviewing process"}
                        {selectedApplicant.status === "interview" && "Currently in interview process"}
                        {selectedApplicant.status === "placed" && "Successfully placed in a job"}
                        {selectedApplicant.status === "inactive" && "Not currently active in the program"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium">Joined</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p>{new Date(selectedApplicant.createdAt).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Applications Section */}
              <div>
                <h3 className="text-lg font-medium mb-3">Job Applications</h3>
                {loadingApplicantJobs ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : applicantJobs.length > 0 ? (
                  <div className="space-y-3">
                    {applicantJobs.map((job) => (
                      <Card key={job.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <h4 className="font-medium">{job.jobTitle}</h4>
                              <p className="text-sm text-muted-foreground">{job.company}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                              {getApplicationStatusBadge(job.status)}
                              <span className="text-xs text-muted-foreground">
                                Applied {new Date(job.appliedDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <h4 className="font-medium mb-1">No Applications</h4>
                      <p className="text-sm text-muted-foreground">
                        This applicant hasn't applied to any jobs yet.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </MultiPurposeModal>
      </div>
    </DashboardLayout>
  );
}
