'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getJobApplications,
  saveJobApplications,
  JobApplication
} from '@/utils/localStorage';
import { Mail, Calendar, User } from 'lucide-react';

export default function Dashboard() {
  // State for job applications
  const [applications, setApplications] = useState<JobApplication[]>([]);
  // State for job being dragged
  const [draggedJob, setDraggedJob] = useState<JobApplication | null>(null);

  // Load applications from localStorage on component mount
  useEffect(() => {
    const apps = getJobApplications();
    setApplications(apps);
  }, []);

  // Save applications to localStorage whenever they change
  useEffect(() => {
    saveJobApplications(applications);
  }, [applications]);

  // Filter applications by stage
  const getApplicationsByStage = (stage: 'interested' | 'applied' | 'interview') => {
    return applications.filter(app => app.stage === stage);
  }

  // Handle drag start
  const handleDragStart = (job: JobApplication) => {
    setDraggedJob(job);
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent, targetStage: 'interested' | 'applied' | 'interview') => {
    e.preventDefault();
    
    if (draggedJob) {
      // Update the job's stage
      const updatedApplications = applications.map(app => 
        app.id === draggedJob.id 
          ? { ...app, stage: targetStage } 
          : app
      );
      
      setApplications(updatedApplications);
      setDraggedJob(null);
    }
  }

  // Handle manual move using select function
  const handleMoveJob = (jobId: string, targetStage: 'interested' | 'applied' | 'interview') => {
    const updatedApplications = applications.map(app => 
      app.id === jobId 
        ? { ...app, stage: targetStage } 
        : app
    );
    
    setApplications(updatedApplications);
  }

  // Stage labels for select dropdown
  const stageLabels = {
    interested: "Interested",
    applied: "Applied",
    interview: "Interview Stage"
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-2xl font-bold">LP</div>
            <nav className="ml-8">
              <ul className="flex space-x-6">
                <li className="font-medium">
                  <Link href="/dashboard" className="text-primary">Dashboard</Link>
                </li>
                <li className="font-medium">
                  <Link href="/jobs" className="text-foreground hover:text-primary transition-colors">Jobs</Link>
                </li>
                <li className="font-medium">
                  <Link href="/community" className="text-foreground hover:text-primary transition-colors">Community</Link>
                </li>
              </ul>
            </nav>
          </div>
          <div>
            <Link href="/messages" className="mr-4">
              <span className="sr-only">Messages</span>
              <Mail className="h-6 w-6 text-foreground hover:text-primary transition-colors" />
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Applicant Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Applied Section */}
          <Card 
            className="section-card"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'applied')}
          >
            <CardHeader className="pb-3">
              <CardTitle>Applied</CardTitle>
              <CardDescription>Jobs you've applied for</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {getApplicationsByStage('applied').map(job => (
                <Card 
                  key={job.id}
                  className="job-card cursor-move"
                  draggable
                  onDragStart={() => handleDragStart(job)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-medium">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                    <p className="text-xs text-muted-foreground">{job.location}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-xs font-medium px-2 py-1 bg-secondary text-secondary-foreground rounded-full">{job.status}</span>
                    </div>
                    <div className="mt-3">
                      <Select 
                        defaultValue={job.stage}
                        onValueChange={(value) => handleMoveJob(job.id, value as 'interested' | 'applied' | 'interview')}
                      >
                        <SelectTrigger className="w-full text-xs h-8">
                          <SelectValue placeholder="Move to..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="interested">Move to Interested</SelectItem>
                          <SelectItem value="applied">Keep in Applied</SelectItem>
                          <SelectItem value="interview">Move to Interview</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {getApplicationsByStage('applied').length === 0 && (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No jobs in this category yet.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Interested Section */}
          <Card 
            className="section-card"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'interested')}
          >
            <CardHeader className="pb-3">
              <CardTitle>Interested</CardTitle>
              <CardDescription>Jobs you're interested in</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {getApplicationsByStage('interested').map(job => (
                <Card 
                  key={job.id}
                  className="job-card cursor-move"
                  draggable
                  onDragStart={() => handleDragStart(job)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-medium">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                    <p className="text-xs text-muted-foreground">{job.location}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-xs font-medium px-2 py-1 bg-secondary text-secondary-foreground rounded-full">{job.status}</span>
                    </div>
                    <div className="mt-3">
                      <Select 
                        defaultValue={job.stage}
                        onValueChange={(value) => handleMoveJob(job.id, value as 'interested' | 'applied' | 'interview')}
                      >
                        <SelectTrigger className="w-full text-xs h-8">
                          <SelectValue placeholder="Move to..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="interested">Keep in Interested</SelectItem>
                          <SelectItem value="applied">Move to Applied</SelectItem>
                          <SelectItem value="interview">Move to Interview</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {getApplicationsByStage('interested').length === 0 && (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No jobs in this category yet.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Interview Stage Section */}
          <Card 
            className="section-card"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'interview')}
          >
            <CardHeader className="pb-3">
              <CardTitle>Interview Stage</CardTitle>
              <CardDescription>Jobs you're interviewing for</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {getApplicationsByStage('interview').map(job => (
                <Card 
                  key={job.id}
                  className="job-card cursor-move"
                  draggable
                  onDragStart={() => handleDragStart(job)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-medium">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                    <p className="text-xs text-muted-foreground">{job.location}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-xs font-medium px-2 py-1 bg-secondary text-secondary-foreground rounded-full">{job.status}</span>
                    </div>
                    <div className="mt-3">
                      <Select 
                        defaultValue={job.stage}
                        onValueChange={(value) => handleMoveJob(job.id, value as 'interested' | 'applied' | 'interview')}
                      >
                        <SelectTrigger className="w-full text-xs h-8">
                          <SelectValue placeholder="Move to..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="interested">Move to Interested</SelectItem>
                          <SelectItem value="applied">Move to Applied</SelectItem>
                          <SelectItem value="interview">Keep in Interview</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {getApplicationsByStage('interview').length === 0 && (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No jobs in this category yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Calendar Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Calendar
              </CardTitle>
              <CardDescription>Upcoming interviews and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-40 flex items-center justify-center bg-muted/20 rounded">
                <p className="text-muted-foreground">Calendar view will be implemented here</p>
              </div>
            </CardContent>
          </Card>

          {/* Events Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Events
              </CardTitle>
              <CardDescription>Networking and career events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-40 flex items-center justify-center bg-muted/20 rounded">
                <p className="text-muted-foreground">Events will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
              <CardDescription>Jobs that match your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="job-card">
                  <CardContent className="p-4">
                    <h3 className="font-medium">Software Engineer</h3>
                    <p className="text-sm text-muted-foreground">Tech Innovations</p>
                    <p className="text-xs text-muted-foreground">Philadelphia, PA</p>
                    <div className="mt-3">
                      <Button variant="outline" size="sm" className="text-xs w-full">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className="job-card">
                  <CardContent className="p-4">
                    <h3 className="font-medium">Product Manager</h3>
                    <p className="text-sm text-muted-foreground">Digital Solutions</p>
                    <p className="text-xs text-muted-foreground">Remote</p>
                    <div className="mt-3">
                      <Button variant="outline" size="sm" className="text-xs w-full">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className="job-card">
                  <CardContent className="p-4">
                    <h3 className="font-medium">Data Analyst</h3>
                    <p className="text-sm text-muted-foreground">Analytics Pro</p>
                    <p className="text-xs text-muted-foreground">Philadelphia, PA</p>
                    <div className="mt-3">
                      <Button variant="outline" size="sm" className="text-xs w-full">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}