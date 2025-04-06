"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { 
  Search, 
  Download, 
  SlidersHorizontal, 
  Mail, 
  MapPin, 
  UserPlus,
  FileSpreadsheet
} from "lucide-react"
import { userService, applicationService, jobService, User, Application, Job } from "@/lib/local-storage"
import { extendedPalette } from "@/lib/colors"

// Enum values as defined in database schema
export const USER_STATUS = {
  DEFAULT: 'default',
  SEARCHING: 'searching',
  INTERVIEW: 'interview',
  HIRED: 'hired'
}

export const PROGRAM_STAGE = {
  FOUNDATION: 'foundation',
  ONE_O_ONE: '101',
  LIFTOFF: 'liftoff',
  ALUMNI: 'alumni'
}

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<User[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  
  const ITEMS_PER_PAGE = 15

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      
      // Get data from localStorage
      const users = userService.getAll().filter(user => !user.isAdmin)
      const allApplications = applicationService.getAll()
      const allJobs = jobService.getAll()

      setApplicants(users)
      setApplications(allApplications)
      setJobs(allJobs)
      setIsLoading(false)
    }
    
    loadData()
  }, [])

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filterStatus])

  // Filter applicants based on search query and status filter
  const filteredApplicants = applicants.filter(applicant => {
    // Split username into first and last name for searching
    const fullName = applicant.username.toLowerCase()
    
    const matchesSearch = searchQuery 
      ? fullName.includes(searchQuery.toLowerCase()) 
      : true
    
    if (filterStatus === "all") return matchesSearch
    
    // Find all applications for this applicant
    const applicantApplications = applications.filter(app => app.user_id === applicant.user_id)
    
    // Check if any application has the selected status
    const hasMatchingStatus = applicantApplications.some(app => app.status === filterStatus)
    
    return matchesSearch && hasMatchingStatus
  })

  // Paginate applicants
  const paginatedApplicants = filteredApplicants.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )
  
  const totalPages = Math.ceil(filteredApplicants.length / ITEMS_PER_PAGE)

  // Status counts for summary
  const getStatusCounts = () => {
    const counts = {
      total: applicants.length,
      active: 0,
      interviewing: 0,
      offered: 0,
      hired: 0
    }

    applicants.forEach(applicant => {
      const applicantApplications = applications.filter(app => app.user_id === applicant.user_id)
      
      // Active means they have at least one application
      if (applicantApplications.length > 0) {
        counts.active++
      }
      
      // Check for interview stages
      if (applicantApplications.some(app => 
        app.status === "phoneScreening" || 
        app.status === "interviewStage" || 
        app.status === "finalInterviewStage"
      )) {
        counts.interviewing++
      }
      
      // Check for offers
      if (applicantApplications.some(app => 
        app.status === "offerExtended" || 
        app.status === "negotiation"
      )) {
        counts.offered++
      }
      
      // Check for hired
      if (applicantApplications.some(app => app.status === "offerAccepted")) {
        counts.hired++
      }
    })

    return counts
  }

  const statusCounts = getStatusCounts()

  // Create new user
  const handleCreateUser = () => {
    // This would be handled by a modal component in a real app
    // For now, we'll just open a placeholder for the modal
    setIsCreateModalOpen(true)
  }

  return (
    <DashboardLayout isAdmin>
      <div className="container py-6 px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Applicant Management</h1>
            <p className="text-gray-500 mt-1">Track and manage program participants and job seekers</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by name..."
                className="pl-8 w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleCreateUser} 
              size="sm" 
              style={{ backgroundColor: extendedPalette.primaryGreen }}
              className="flex items-center gap-1"
            >
              <UserPlus className="h-4 w-4" /> Add User
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            title="Total Applicants"
            value={statusCounts.total}
            color={extendedPalette.primaryBlue}
            isLoading={isLoading}
          />
          <StatCard
            title="Active Applicants"
            value={statusCounts.active}
            color={extendedPalette.primaryGreen}
            isLoading={isLoading}
          />
          <StatCard
            title="In Interview Process"
            value={statusCounts.interviewing}
            color={extendedPalette.teal}
            isLoading={isLoading}
          />
          <StatCard
            title="Offers Extended"
            value={statusCounts.offered}
            color={extendedPalette.primaryOrange}
            isLoading={isLoading}
          />
          <StatCard
            title="Hired"
            value={statusCounts.hired}
            color={extendedPalette.brown}
            isLoading={isLoading}
          />
        </div>
        
        {/* Applicant Management Tabs */}
        <Tabs defaultValue="all" className="mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <TabsList>
              <TabsTrigger 
                value="all" 
                onClick={() => setFilterStatus("all")}
              >
                All Applicants
              </TabsTrigger>
              <TabsTrigger 
                value="applied" 
                onClick={() => setFilterStatus("applied")}
              >
                Applied
              </TabsTrigger>
              <TabsTrigger 
                value="interviewing" 
                onClick={() => setFilterStatus("interviewStage")}
              >
                Interviewing
              </TabsTrigger>
              <TabsTrigger 
                value="offered" 
                onClick={() => setFilterStatus("offerExtended")}
              >
                Offered
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </Button>
            </div>
          </div>
          
          <TabsContent value="all" className="mt-0">
            <ApplicantTable 
              applicants={paginatedApplicants}
              applications={applications}
              jobs={jobs}
              isLoading={isLoading}
            />
            
            {/* Pagination */}
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    // Create a simple pagination that shows at most 5 pages
                    let pageNumber;
                    
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }
                    
                    if (pageNumber > 0 && pageNumber <= totalPages) {
                      return (
                        <PaginationItem key={i}>
                          <PaginationLink 
                            isActive={currentPage === pageNumber} 
                            onClick={() => setCurrentPage(pageNumber)}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </TabsContent>
          
          <TabsContent value="applied" className="mt-0">
            <ApplicantTable 
              applicants={paginatedApplicants}
              applications={applications}
              jobs={jobs}
              isLoading={isLoading}
            />
            
            {/* Pagination for other tabs follows same pattern */}
            <div className="mt-4">
              {/* Same pagination component */}
            </div>
          </TabsContent>
          
          <TabsContent value="interviewing" className="mt-0">
            <ApplicantTable 
              applicants={paginatedApplicants}
              applications={applications}
              jobs={jobs}
              isLoading={isLoading}
            />
            
            <div className="mt-4">
              {/* Same pagination component */}
            </div>
          </TabsContent>
          
          <TabsContent value="offered" className="mt-0">
            <ApplicantTable 
              applicants={paginatedApplicants}
              applications={applications}
              jobs={jobs}
              isLoading={isLoading}
            />
            
            <div className="mt-4">
              {/* Same pagination component */}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Create User Modal would go here in a real implementation */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Add New User</CardTitle>
                <CardDescription>Create a new applicant account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">First Name</label>
                      <Input placeholder="First Name" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Last Name</label>
                      <Input placeholder="Last Name" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" placeholder="Email" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Program Stage</label>
                    <select className="w-full border rounded p-2">
                      <option value={PROGRAM_STAGE.FOUNDATION}>Foundation</option>
                      <option value={PROGRAM_STAGE.ONE_O_ONE}>101</option>
                      <option value={PROGRAM_STAGE.LIFTOFF}>Liftoff</option>
                      <option value={PROGRAM_STAGE.ALUMNI}>Alumni</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <select className="w-full border rounded p-2">
                      <option value={USER_STATUS.DEFAULT}>Default</option>
                      <option value={USER_STATUS.SEARCHING}>Searching</option>
                      <option value={USER_STATUS.INTERVIEW}>Interview</option>
                      <option value={USER_STATUS.HIRED}>Hired</option>
                    </select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    // Create user logic would go here
                    setIsCreateModalOpen(false)
                  }}
                  style={{ backgroundColor: extendedPalette.primaryBlue }}
                >
                  Create User
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

function StatCard({ title, value, color, isLoading }: { 
  title: string; 
  value: number; 
  color: string;
  isLoading: boolean 
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          {isLoading ? (
            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function ApplicantTable({ applicants, applications, jobs, isLoading }: { 
  applicants: User[];
  applications: Application[];
  jobs: Job[];
  isLoading: boolean;
}) {
  // Helper function to get the status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "interested":
        return { bg: `${extendedPalette.lightBlue}40`, text: extendedPalette.primaryBlue };
      case "applied":
        return { bg: `${extendedPalette.primaryBlue}40`, text: extendedPalette.primaryBlue };
      case "phoneScreening":
        return { bg: `${extendedPalette.primaryGreen}40`, text: extendedPalette.primaryGreen };
      case "interviewStage":
        return { bg: `${extendedPalette.teal}40`, text: extendedPalette.teal };
      case "finalInterviewStage":
        return { bg: `${extendedPalette.darkGreen}40`, text: extendedPalette.darkGreen };
      case "offerExtended":
        return { bg: `${extendedPalette.primaryOrange}40`, text: extendedPalette.primaryOrange };
      case "negotiation":
        return { bg: `${extendedPalette.brown}40`, text: extendedPalette.brown };
      case "offerAccepted":
        return { bg: `${extendedPalette.darkGreen}40`, text: extendedPalette.darkGreen };
      case "rejected":
        return { bg: '#f1f1f1', text: extendedPalette.darkGray };
      default:
        return { bg: '#f1f1f1', text: extendedPalette.darkGray };
    }
  };

  // Helper function to get formatted status name
  const getStatusName = (status: string) => {
    switch (status) {
      case "interested": return "Interested";
      case "applied": return "Applied";
      case "phoneScreening": return "Phone Screening";
      case "interviewStage": return "Interviewing";
      case "finalInterviewStage": return "Final Interview";
      case "offerExtended": return "Offer Extended";
      case "negotiation": return "In Negotiation";
      case "offerAccepted": return "Offer Accepted";
      case "rejected": return "Rejected";
      default: return status;
    }
  };

  // Helper function to get program stage name
  const getProgramStageName = (program: string) => {
    switch (program) {
      case PROGRAM_STAGE.FOUNDATION: return "Foundation";
      case PROGRAM_STAGE.ONE_O_ONE: return "101";
      case PROGRAM_STAGE.LIFTOFF: return "Liftoff";
      case PROGRAM_STAGE.ALUMNI: return "Alumni";
      default: return program || "Not Assigned";
    }
  };

  // Helper function to get applicant's latest application status
  const getLatestStatus = (applicantId: number) => {
    const applicantApplications = applications.filter(app => app.user_id === applicantId);
    
    if (applicantApplications.length === 0) {
      return null;
    }
    
    // Sort applications by status_updated_at (most recent first)
    const sortedApplications = [...applicantApplications].sort((a, b) => 
      new Date(b.status_updated_at).getTime() - new Date(a.status_updated_at).getTime()
    );
    
    return sortedApplications[0].status;
  };

  // Helper to get the total application count for an applicant
  const getApplicationCount = (applicantId: number) => {
    return applications.filter(app => app.user_id === applicantId).length;
  };

  // Helper to get the latest job applied for by an applicant
  const getLatestJob = (applicantId: number) => {
    const applicantApplications = applications.filter(app => app.user_id === applicantId);
    
    if (applicantApplications.length === 0) {
      return null;
    }
    
    // Sort applications by applied_at (most recent first)
    const sortedApplications = [...applicantApplications].sort((a, b) => 
      new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime()
    );
    
    const latestApp = sortedApplications[0];
    return jobs.find(job => job.job_id === latestApp.job_id);
  };

  // Helper to split username into first and last name
  const splitName = (username: string) => {
    const parts = username.split(' ');
    if (parts.length >= 2) {
      return {
        firstName: parts[0],
        lastName: parts.slice(1).join(' ')
      };
    }
    return {
      firstName: username,
      lastName: ''
    };
  };

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Applicant</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Program</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Latest Application</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Apps</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                      <div className="space-y-1">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-6 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : applicants.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No applicants found
                </td>
              </tr>
            ) : (
              applicants.map(applicant => {
                const status = getLatestStatus(applicant.user_id);
                const statusStyle = status ? getStatusColor(status) : { bg: '#f1f1f1', text: '#9ca3af' };
                const latestJob = getLatestJob(applicant.user_id);
                const appCount = getApplicationCount(applicant.user_id);
                const { firstName, lastName } = splitName(applicant.username);
                
                // Generate initials for avatar
                const initials = `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ''}`.toUpperCase();
                
                return (
                  <tr key={applicant.user_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{initials}</AvatarFallback>
                          <AvatarImage src="/placeholder-user.jpg" alt={applicant.username} />
                        </Avatar>
                        <div>
                          <div className="font-medium">{firstName} {lastName}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {applicant.username.toLowerCase().replace(/\s+/g, '.') + '@example.com'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant="outline" className="font-normal">
                        {getProgramStageName(applicant.program)}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      {latestJob ? (
                        <div>
                          <div className="font-medium text-sm">{latestJob.title}</div>
                          <div className="text-xs text-gray-500 flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {latestJob.company}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No applications yet</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {status ? (
                        <Badge style={{ 
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.text
                        }}>
                          {getStatusName(status)}
                        </Badge>
                      ) : (
                        <Badge variant="outline">No Status</Badge>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-sm font-medium">{appCount}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">Profile</Button>
                        <Button size="sm" style={{ backgroundColor: extendedPalette.primaryBlue }}>
                          <FileSpreadsheet className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <CardFooter className="flex justify-between items-center border-t border-gray-100 py-4 px-6">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{applicants.length}</span> applicants
        </div>
      </CardFooter>
    </Card>
  )
} 