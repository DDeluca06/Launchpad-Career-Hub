'use client'

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/basic/card"
import { Button } from "@/components/ui/basic/button"
import { Input } from "@/components/ui/form/input"
import { applicationService, userService } from "@/lib/local-storage"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/basic/avatar"
import { Badge } from "@/components/ui/basic/badge"
import { Search, Filter, Download, Users, Mail, User, Clock, FileText, Upload, UserPlus, FileSpreadsheet } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs"
import { extendedPalette } from "@/lib/colors"
import { Skeleton } from "@/components/ui/feedback/skeleton"
import { cn } from "@/lib/utils"
import { MultiPurposeModal } from "@/components/ui/overlay/multi-purpose-modal"
import { Label } from "@/components/ui/basic/label"

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

// Fix the ApplicantWithDetails interface to match the mapping below
interface ApplicantWithDetails {
  id: number;
  name: string;
  email: string;
  role: string;
  applications: number;
  status: string;
  createdAt: string;
}

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  isLoading: boolean
  className?: string
}

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
          <div className="rounded-full p-3 bg-gray-50">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<ApplicantWithDetails[]>([])
  const [filteredApplicants, setFilteredApplicants] = useState<ApplicantWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    interview: 0,
    placed: 0
  })
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false)
  const [bulkUploadModalOpen, setBulkUploadModalOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    role: 'applicant',
    isAdmin: false,
    program: ''
  })
  const [csvFile, setCsvFile] = useState<File | null>(null)

  // Define loadApplicants as a component function
  const loadApplicants = async () => {
    try {
      const users = await userService.getAll() as unknown as User[];
      const applications = await applicationService.getAll() as unknown as Application[];

      // Create mock statuses for demo purposes
      const statuses = ['active', 'interview', 'placed', 'inactive'];
      
      // For demo purposes, assume user structure and create mock data
      const applicantDetails = users
        .filter(user => user.role === 'applicant')
        .map(user => {
          const userApplications = applications.filter(app => app.user_id === user.user_id);
          // Randomly assign a status for demo purposes
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
          
          return {
            id: user.user_id,
            name: user.username || 'Student', // Fallback if name not available
            email: user.email || `${user.username}@example.com`, // Fallback if email not available
            role: user.role,
            applications: userApplications.length,
            status: randomStatus,
            createdAt: user.created_at || new Date().toISOString()
          } as ApplicantWithDetails;
        });

      // Calculate stats
      const statsData = {
        total: applicantDetails.length,
        active: applicantDetails.filter(a => a.status === 'active').length,
        interview: applicantDetails.filter(a => a.status === 'interview').length,
        placed: applicantDetails.filter(a => a.status === 'placed').length
      }

      setApplicants(applicantDetails)
      setFilteredApplicants(applicantDetails)
      setStats(statsData)
    } catch (error) {
      console.error('Error loading applicants:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadApplicants()
  }, [])

  // Filter applicants based on search query and active tab
  useEffect(() => {
    let result = [...applicants]
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(applicant => 
        applicant.name.toLowerCase().includes(query) ||
        applicant.email.toLowerCase().includes(query)
      )
    }
    
    // Apply tab filter
    if (activeTab !== 'all') {
      result = result.filter(applicant => applicant.status === activeTab)
    }
    
    setFilteredApplicants(result)
  }, [searchQuery, activeTab, applicants])

  function getStatusBadge(status: string) {
    switch (status) {
      case 'active':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Active</Badge>
      case 'interview':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">In Interview</Badge>
      case 'placed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Placed</Badge>
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>
    }
  }

  // Update the handler
  const handleCreateUser = async () => {
    if (!newUser.username || !newUser.email || !newUser.password) return
    
    try {
      // In a real app, this would call your API
      const userId = Date.now() // Mock ID generation
      const newUserData = {
        ...newUser,
        user_id: userId,
        created_at: new Date().toISOString(),
        status: 'active' // Add required status property
      }
      
      await userService.create(newUserData)
      setCreateUserModalOpen(false)
      setNewUser({
        username: '',
        name: '',
        email: '',
        password: '',
        role: 'applicant',
        isAdmin: false,
        program: ''
      })
      
      // Reload applicants
      await loadApplicants()
    } catch (error) {
      console.error('Error creating user:', error)
    }
  }

  // Handle CSV file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0])
    }
  }

  const handleBulkUpload = async () => {
    if (!csvFile) return
    
    try {
      // Mock implementation - in a real app this would process the CSV
      // and create multiple users
      console.error('Processing CSV file:', csvFile.name)
      
      // Reset the file input and close modal
      setCsvFile(null)
      setBulkUploadModalOpen(false)
      
      // Reload applicants
      await loadApplicants()
    } catch (error) {
      console.error('Error processing CSV file:', error)
    }
  }

  return (
    <DashboardLayout isAdmin>
      <div className="container py-6 px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: extendedPalette.primaryBlue }}>
              Applicant Management
            </h1>
            <p className="text-gray-500 mt-1">View and manage student applicants in Philadelphia tech programs</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
              onClick={() => setCreateUserModalOpen(true)}
            >
              <UserPlus className="h-4 w-4" /> Create User
            </Button>
            <Button
              variant="default"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setBulkUploadModalOpen(true)}
            >
              <FileSpreadsheet className="h-4 w-4" /> Bulk Upload
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Applicants"
            value={stats.total}
            icon={<Users className="h-5 w-5" style={{ color: extendedPalette.primaryBlue }} />}
            isLoading={loading}
          />
          <StatCard
            title="Active Applicants"
            value={stats.active}
            icon={<User className="h-5 w-5" style={{ color: extendedPalette.primaryGreen }} />}
            isLoading={loading}
          />
          <StatCard
            title="In Interview Process"
            value={stats.interview}
            icon={<Clock className="h-5 w-5" style={{ color: extendedPalette.teal }} />}
            isLoading={loading}
          />
          <StatCard
            title="Successfully Placed"
            value={stats.placed}
            icon={<FileText className="h-5 w-5" style={{ color: extendedPalette.primaryOrange }} />}
            isLoading={loading}
          />
        </div>

        {/* Search and Filter */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by name or email..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-1">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button className="gap-1 bg-blue-500 hover:bg-blue-600 text-white">
              <Mail className="h-4 w-4" />
              Contact
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
                      {filteredApplicants.length} {filteredApplicants.length === 1 ? 'applicant' : 'applicants'} found
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="animate-pulse space-y-4">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-20 bg-gray-100 rounded-lg" />
                      ))}
                    </div>
                  ) : filteredApplicants.length > 0 ? (
                    filteredApplicants.map(applicant => (
                      <Card key={applicant.id} className="overflow-hidden hover:shadow-md transition-all cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${applicant.name}`} alt={applicant.name} />
                              <AvatarFallback>{applicant.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{applicant.name}</h3>
                                {getStatusBadge(applicant.status)}
                              </div>
                              <p className="text-sm text-gray-500">{applicant.email}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-gray-500">
                                  {applicant.applications} {applicant.applications === 1 ? 'application' : 'applications'}
                                </span>
                                <span className="text-xs text-gray-500">
                                  Joined {new Date(applicant.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            
                            <Button variant="outline" size="sm" className="shrink-0">
                              View Profile
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <h3 className="text-lg font-medium mb-2">No Applicants Found</h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        No applicants match your current search criteria. Try adjusting your filters or search terms.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create User Modal */}
        <MultiPurposeModal
          open={createUserModalOpen}
          onOpenChange={setCreateUserModalOpen}
          title="Create New User"
        >
          <div className="space-y-3">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={newUser.username}
                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                placeholder="Username"
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                placeholder="Full Name"
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                placeholder="Email"
                className="w-full"
                type="email"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                placeholder="Password"
                className="w-full"
                type="password"
              />
            </div>
            <div>
              <Label htmlFor="program">Program</Label>
              <Input
                id="program"
                value={newUser.program}
                onChange={(e) => setNewUser({...newUser, program: e.target.value})}
                placeholder="Program (optional)"
                className="w-full"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setCreateUserModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateUser}>Create User</Button>
          </div>
        </MultiPurposeModal>

        {/* Bulk Upload Modal */}
        <MultiPurposeModal
          open={bulkUploadModalOpen}
          onOpenChange={setBulkUploadModalOpen}
          title="Bulk Upload Users"
        >
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Upload a CSV file with user data. The file should include columns for username, name, email, password, and program.
            </p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-upload"
              />
              <label 
                htmlFor="csv-upload" 
                className="cursor-pointer block"
              >
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <span className="text-sm font-medium">
                  {csvFile ? csvFile.name : 'Click to upload CSV file'}
                </span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setCsvFile(null)
                setBulkUploadModalOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleBulkUpload}
              disabled={!csvFile}
            >
              Upload and Process
            </Button>
          </div>
        </MultiPurposeModal>
      </div>
    </DashboardLayout>
  )
}
