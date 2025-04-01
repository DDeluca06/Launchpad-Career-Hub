"use client"

import { useState, useRef, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Search, Filter, Calendar, Briefcase, PlusCircle, TrendingUp, Flag, Users } from "lucide-react"
import { extendedPalette } from "@/lib/colors"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { LaunchpadImage } from "@/components/launchpad-image"

// Define job status types based on schema
type JobStatus = "interested" | "applied" | "interview" | "rejected" | "offer" | "accepted";

// Define job interface that combines backend schema with UI needs
interface JobApplication {
  applicationId: number;
  jobId: number;
  userId: number;
  status: JobStatus;
  appliedAt: string;
  statusUpdatedAt: string;
  resumeId?: number;
  position: string;
  // UI-specific properties
  job: {
    title: string;
    company: string;
    location?: string;
    jobType?: string;
    logo?: string;
  };
  priority?: "high" | "medium" | "low";
}

// Sample data - this would come from local storage in real implementation
const initialApplications: JobApplication[] = [
  { 
    applicationId: 1,
    jobId: 1,
    userId: 2,
    status: "applied",
    appliedAt: "2023-04-05T12:00:00Z",
    statusUpdatedAt: "2023-04-05T12:00:00Z",
    position: "1",
    job: {
      title: "Frontend Developer",
      company: "Tech Co",
      location: "Remote",
      jobType: "Full-time",
      logo: "/placeholder-logo.png"
    },
    priority: "high"
  },
  { 
    applicationId: 2,
    jobId: 2,
    userId: 2,
    status: "interested",
    appliedAt: "",
    statusUpdatedAt: "2023-04-01T10:00:00Z",
    position: "1",
    job: {
      title: "Backend Engineer",
      company: "Software Inc",
      location: "Philadelphia, PA",
      jobType: "Full-time",
      logo: "/placeholder-logo.png"
    },
    priority: "medium"
  },
  { 
    applicationId: 3,
    jobId: 3,
    userId: 2,
    status: "applied",
    appliedAt: "2023-03-29T15:00:00Z",
    statusUpdatedAt: "2023-03-29T15:00:00Z",
    position: "2",
    job: {
      title: "Full Stack Developer",
      company: "Web Solutions",
      location: "Remote",
      jobType: "Contract",
      logo: "/placeholder-logo.png"
    }
  },
  { 
    applicationId: 4,
    jobId: 4,
    userId: 2,
    status: "interested",
    appliedAt: "",
    statusUpdatedAt: "2023-03-25T09:00:00Z",
    position: "2",
    job: {
      title: "UI/UX Designer",
      company: "Design Studio",
      location: "New York, NY",
      jobType: "Part-time",
      logo: "/placeholder-logo.png"
    }
  },
  { 
    applicationId: 5,
    jobId: 5,
    userId: 2,
    status: "rejected",
    appliedAt: "2023-03-10T11:00:00Z",
    statusUpdatedAt: "2023-03-15T14:00:00Z",
    position: "1",
    job: {
      title: "DevOps Engineer",
      company: "Cloud Systems",
      location: "Boston, MA",
      jobType: "Full-time",
      logo: "/placeholder-logo.png"
    }
  },
  { 
    applicationId: 6,
    jobId: 6,
    userId: 2,
    status: "interested",
    appliedAt: "",
    statusUpdatedAt: "2023-03-20T16:00:00Z",
    position: "3",
    job: {
      title: "Product Manager",
      company: "Product Co",
      location: "Philadelphia, PA",
      jobType: "Full-time",
      logo: "/placeholder-logo.png"
    }
  },
]

// Define status columns for the kanban board
const statusColumns = [
  {
    id: "interested",
    title: "Interested",
    icon: <Flag className="h-4 w-4" />,
    color: extendedPalette.lightBlue
  },
  {
    id: "applied",
    title: "Applied",
    icon: <Briefcase className="h-4 w-4" />,
    color: extendedPalette.primaryBlue
  },
  {
    id: "rejected",
    title: "Rejected",
    icon: <TrendingUp className="h-4 w-4 rotate-180" />,
    color: extendedPalette.darkGray
  }
];

export default function ApplicantDashboard() {
  const [applications, setApplications] = useState<JobApplication[]>(initialApplications);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [draggingJob, setDraggingJob] = useState<number | null>(null);
  const [jobStats, setJobStats] = useState({
    total: initialApplications.length,
    applied: initialApplications.filter(app => app.status === "applied").length,
    interested: initialApplications.filter(app => app.status === "interested").length,
    rejected: initialApplications.filter(app => app.status === "rejected").length,
  });

  // Refs for columns to handle drop zones
  const columnRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Update stats when jobs change
  useEffect(() => {
    setJobStats({
      total: applications.length,
      applied: applications.filter(app => app.status === "applied").length,
      interested: applications.filter(app => app.status === "interested").length,
      rejected: applications.filter(app => app.status === "rejected").length,
    });
  }, [applications]);

  // Filter applications by search query
  const filteredApplications = applications.filter(app => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      app.job.title.toLowerCase().includes(query) ||
      app.job.company.toLowerCase().includes(query) ||
      app.job.location?.toLowerCase().includes(query) ||
      app.job.jobType?.toLowerCase().includes(query)
    );
  });

  // Get applications by status
  const getApplicationsByStatus = (status: JobStatus) => {
    return filteredApplications.filter(app => app.status === status);
  };

  // Start dragging a job
  const handleDragStart = (applicationId: number) => {
    setDraggingJob(applicationId);
  };

  // Update job status on drop
  const handleStatusChange = (applicationId: number, newStatus: JobStatus) => {
    setApplications(prev => 
      prev.map(app => 
        app.applicationId === applicationId 
          ? { 
              ...app, 
              status: newStatus, 
              statusUpdatedAt: new Date().toISOString() 
            } 
          : app
      )
    );
  };

  return (
    <DashboardLayout>
      <div className="container p-6 mx-auto">
        {/* Dashboard Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Job Dashboard</h1>
              <p className="text-gray-500 dark:text-gray-400">Track and manage your job applications</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                Schedule Interview
              </Button>
              <Button className="gap-2 bg-launchpad-blue hover:bg-launchpad-teal text-white">
                <PlusCircle className="h-4 w-4" />
                Add Job
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatsCard 
              title="Total Jobs"
              value={jobStats.total}
              icon={<Briefcase className="h-5 w-5" />}
              color="bg-launchpad-blue"
            />
            <StatsCard 
              title="Applications Sent"
              value={jobStats.applied}
              icon={<TrendingUp className="h-5 w-5" />}
              color="bg-launchpad-green"
            />
            <StatsCard 
              title="Interested"
              value={jobStats.interested}
              icon={<Flag className="h-5 w-5" />}
              color="bg-launchpad-lightBlue"
            />
            <StatsCard 
              title="Rejected"
              value={jobStats.rejected}
              icon={<TrendingUp className="h-5 w-5 rotate-180" />}
              color="bg-launchpad-darkGray"
            />
          </div>
          
          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search jobs..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                All Jobs
              </Button>
              <Button variant="outline" size="sm">
                This Week
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="board" className="space-y-4">
          <TabsList>
            <TabsTrigger value="board" className="gap-2">
              <Briefcase className="h-4 w-4" />
              Board View
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              List View
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="board" className="space-y-4">
            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {statusColumns.map(column => (
                <motion.div
                  key={column.id}
                  ref={(el) => {
                    columnRefs.current[column.id] = el;
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col"
                  onMouseEnter={() => setActiveColumn(column.id)}
                  onMouseLeave={() => setActiveColumn(null)}
                >
                  <Card className={`h-full border-t-4`} style={{ borderTopColor: column.color }}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="rounded-md p-1.5" style={{ backgroundColor: column.color }}>
                            <div className="text-white">{column.icon}</div>
                          </div>
                          <CardTitle className="text-base font-semibold">{column.title}</CardTitle>
                        </div>
                        <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                          {getApplicationsByStatus(column.id as JobStatus).length}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="overflow-y-auto max-h-[60vh] pt-0 px-3 pb-3 space-y-3 scroll-smooth">
                      <AnimatePresence mode="popLayout">
                        {getApplicationsByStatus(column.id as JobStatus).map(application => (
                          <DraggableJobCard 
                            key={application.applicationId} 
                            application={application}
                            onDragStart={handleDragStart}
                            onStatusChange={handleStatusChange}
                            isColumnActive={activeColumn === column.id}
                          />
                        ))}
                        {getApplicationsByStatus(column.id as JobStatus).length === 0 && (
                          <div className="h-24 border-2 border-dashed rounded-md flex items-center justify-center">
                            <p className="text-sm text-gray-400">Drop jobs here</p>
                          </div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="list">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {filteredApplications.map(application => (
                    <motion.div
                      key={application.applicationId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 border rounded-lg flex items-center gap-4"
                    >
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        <LaunchpadImage 
                          src={application.job.logo || "/placeholder-logo.png"} 
                          alt={application.job.company} 
                          width={32} 
                          height={32} 
                          className="object-contain" 
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{application.job.title}</h3>
                        <p className="text-sm text-gray-500">{application.job.company} • {application.job.location}</p>
                      </div>
                      <div>
                        <Badge 
                          variant="outline" 
                          className="mr-2"
                        >
                          {application.job.jobType}
                        </Badge>
                        <Badge 
                          className={
                            application.status === "applied" ? "bg-launchpad-blue text-white" :
                            application.status === "interested" ? "bg-launchpad-lightBlue text-launchpad-blue" :
                            "bg-launchpad-darkGray text-white"
                          }
                        >
                          {application.status === "applied" ? "Applied" : 
                            application.status === "interested" ? "Interested" : "Rejected"}
                        </Badge>
                      </div>
                      <Button size="sm" variant="outline">View</Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Upcoming Events & Recommendations */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-launchpad-blue" />
                  <span>Upcoming Events</span>
                </CardTitle>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <EventCard
                  title="Tech Co Interview"
                  date="April 5, 2025"
                  time="10:00 AM"
                  type="interview"
                  company="Tech Co"
                />
                
                <EventCard
                  title="Software Inc Technical Test"
                  date="April 8, 2025"
                  time="2:00 PM"
                  type="assessment"
                  company="Software Inc"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-launchpad-green" />
                  <span>Recommendations</span>
                </CardTitle>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <RecommendedJobCard
                  id={7}
                  title="Senior Frontend Developer"
                  company="Enterprise Solutions"
                  logo="/placeholder-logo.png"
                  match="95%"
                  location="Remote"
                />
                
                <RecommendedJobCard
                  id={8}
                  title="React Developer"
                  company="App Factory"
                  logo="/placeholder-logo.png"
                  match="82%"
                  location="Philadelphia, PA"
                />
                
                <div className="pt-2">
                  <Button variant="outline" className="w-full">
                    View More
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Draggable Job Card Component with simplified animation
interface DraggableJobCardProps {
  application: JobApplication;
  onDragStart: (id: number) => void;
  onStatusChange: (id: number, status: JobStatus) => void;
  isColumnActive: boolean;
}

function DraggableJobCard({ application, onDragStart, onStatusChange, isColumnActive }: DraggableJobCardProps) {
  const statuses: JobStatus[] = ["interested", "applied", "rejected"];
  
  // Get relative date from ISO string
  const getRelativeDate = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };
  
  // Calculate applied date or due date text
  const getDateText = () => {
    if (application.appliedAt) {
      return `Applied ${getRelativeDate(application.appliedAt)}`;
    }
    return '';
  };
  
  return (
    <motion.div
      drag
      dragSnapToOrigin
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragStart={() => onDragStart(application.applicationId)}
      onDragEnd={(event, info) => {
        // Calculate which column we're closest to based on drag direction
        if (Math.abs(info.offset.x) > 100) {
          const direction = info.offset.x > 0 ? 1 : -1;
          const currentIndex = statuses.indexOf(application.status);
          let newIndex = currentIndex + direction;
          
          // Ensure the index is within bounds
          if (newIndex >= 0 && newIndex < statuses.length) {
            onStatusChange(application.applicationId, statuses[newIndex]);
          }
        }
      }}
      whileDrag={{ 
        scale: 1.03, 
        boxShadow: "0 8px 20px -5px rgba(0, 0, 0, 0.1)",
        zIndex: 20
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ 
        type: "spring", 
        damping: 25, 
        stiffness: 300 
      }}
      className={`cursor-grab active:cursor-grabbing ${isColumnActive ? 'z-10' : ''}`}
    >
      <Card className="border shadow-sm hover:shadow-md transition-all duration-200">
        <CardContent className="p-3">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                <LaunchpadImage 
                  src={application.job.logo || "/placeholder-logo.png"} 
                  alt={application.job.company} 
                  width={24} 
                  height={24} 
                  className="object-contain" 
                />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{application.job.title}</h3>
                <p className="text-xs text-gray-500">{application.job.company}</p>
              </div>
            </div>
            {application.priority && (
              <Badge 
                className={cn(
                  "text-xs font-medium",
                  application.priority === "high" ? "bg-red-100 text-red-600" : 
                  application.priority === "medium" ? "bg-amber-100 text-amber-600" :
                  "bg-green-100 text-green-600"
                )}
              >
                {application.priority}
              </Badge>
            )}
          </div>
          
          <div className="flex flex-col gap-1 mt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">{application.job.location}</span>
              <span className="text-gray-500">{application.job.jobType}</span>
            </div>
            <div className="flex justify-between items-center text-xs mt-1">
              <span className="text-gray-500">
                {getDateText()}
              </span>
              <Badge variant="outline" className="text-xs bg-gray-50">
                ID: {application.applicationId}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Stats Card Component
function StatsCard({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div className={`${color} p-3 rounded-lg text-white`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Event Card Component
function EventCard({ title, date, time, type, company }: { 
  title: string, 
  date: string, 
  time: string, 
  type: "interview" | "assessment" | "meeting", 
  company: string 
}) {
  return (
    <motion.div 
      className="flex justify-between items-center p-4 bg-white border rounded-lg shadow-sm"
      whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center",
          type === "interview" ? "bg-launchpad-blue text-white" : 
          type === "assessment" ? "bg-launchpad-green text-white" : 
          "bg-launchpad-orange text-white")}
        >
          {type === "interview" ? 
            <Users className="h-5 w-5" /> :
            type === "assessment" ? 
            <TrendingUp className="h-5 w-5" /> :
            <Calendar className="h-5 w-5" />
          }
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-xs text-gray-500">{company} • {date} • {time}</p>
        </div>
      </div>
      <Button size="sm">
        {type === "interview" ? "Prepare" :
          type === "assessment" ? "Start" :
          "Join"}
      </Button>
    </motion.div>
  );
}

// Recommended Job Card Component
function RecommendedJobCard({ id, title, company, logo, match, location }: { 
  id: number, 
  title: string, 
  company: string, 
  logo: string, 
  match: string,
  location: string
}) {
  return (
    <motion.div 
      className="p-4 bg-white border rounded-lg shadow-sm flex items-center gap-3"
      whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
        <LaunchpadImage
          src={logo}
          alt={company}
          width={24}
          height={24}
          className="object-contain"
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-sm">{title}</h3>
            <p className="text-xs text-gray-500">{company} • {location}</p>
          </div>
          <Badge className="bg-green-100 text-green-600">
            {match}
          </Badge>
        </div>
      </div>
    </motion.div>
  );
}

