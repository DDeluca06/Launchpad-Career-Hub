"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/basic/card";
import { Badge } from "@/components/ui/basic/badge";
import { Button } from "@/components/ui/basic/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/overlay/dialog";
import { Textarea } from "@/components/ui/form/textarea";
import { FileText, Clock, Briefcase, CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Application tracking interfaces
export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  companyLogoUrl: string;
  appliedDate: string;
  status: 'submitted' | 'reviewing' | 'interviewing' | 'offered' | 'accepted' | 'rejected';
  notes?: string;
  nextSteps?: string;
  interviewDate?: string;
}

interface ApplicationsTrackerProps {
  applications: Application[];
  onViewJobDetails: (jobId: string) => void;
  currentUserId?: number;
}

export default function ApplicationsTracker({ applications, onViewJobDetails, currentUserId }: ApplicationsTrackerProps) {
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  
  // Status badge with appropriate colors to match Kanban columns
  const getStatusBadge = (status: Application['status']) => {
    switch (status) {
      case 'submitted':
        return <Badge className="bg-blue-100 text-blue-800">Interested/Applied</Badge>;
      case 'reviewing':
        return <Badge className="bg-purple-100 text-purple-800">Under Review</Badge>;
      case 'interviewing':
        return <Badge className="bg-violet-100 text-violet-800">Interviewing</Badge>;
      case 'offered':
        return <Badge className="bg-yellow-100 text-yellow-800">Offer Stage</Badge>;
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800">Accepted</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Not Selected</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  // Status icon for visual indication
  const getStatusIcon = (status: Application['status']) => {
    switch (status) {
      case 'submitted':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'reviewing':
        return <Clock className="h-5 w-5 text-purple-500" />;
      case 'interviewing':
        return <Briefcase className="h-5 w-5 text-violet-500" />;
      case 'offered':
        return <FileText className="h-5 w-5 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Application detail view
  function ApplicationDetail({ application }: { application: Application | null }) {
    const [notesDialogOpen, setNotesDialogOpen] = useState(false);
    const [applicationNotes, setApplicationNotes] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
      if (application) {
        setApplicationNotes(application.notes || "");
      }
    }, [application]);

    const saveNotes = async () => {
      if (!application || !currentUserId) {
        toast.error("User information not available. Please log in again.");
        return;
      }
      
      setIsSaving(true);
      
      try {
        // Update application notes in the database
        const response = await fetch(`/api/applications/${application.id}/notes`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            notes: applicationNotes,
            userId: currentUserId
          }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          console.error("Error response:", data);
          throw new Error(data.error || "Failed to update notes");
        }
        
        toast.success("Notes updated successfully");
        
        // Update the application locally
        application.notes = applicationNotes;
        
        setNotesDialogOpen(false);
      } catch (error) {
        console.error("Error updating notes:", error);
        toast.error(`Failed to update notes: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsSaving(false);
      }
    };

    if (!application) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <div className="rounded-full bg-gray-100 p-4 mb-4">
            <FileText className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium mb-2">No Application Selected</h3>
          <p className="text-gray-500 max-w-sm mb-4">
            Please select an application from the list to view details
          </p>
        </div>
      );
    }

    return (
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">{application.jobTitle}</h2>
            <p className="text-gray-600">{application.company}</p>
            <p className="text-sm text-gray-500 mt-2">Applied on {formatDate(application.appliedDate)}</p>
          </div>
          <div>
            {getStatusBadge(application.status)}
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium mb-2">Application Status</h3>
          <div className="flex items-center gap-2">
            {getStatusIcon(application.status)}
            <span className="font-medium">{application.status.charAt(0).toUpperCase() + application.status.slice(1)}</span>
          </div>
          {application.notes && (
            <div className="mt-2">
              <span className="text-sm text-gray-600">{application.notes}</span>
            </div>
          )}
        </div>
        
        {application.nextSteps && (
          <div className="bg-gray-50 p-4 rounded mt-4">
            <h3 className="font-medium mb-2">Next Steps</h3>
            <span>{application.nextSteps}</span>
            {application.interviewDate && (
              <div className="mt-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Interview scheduled for {formatDate(application.interviewDate)}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex gap-3">
          <Button 
            variant="outline"
            onClick={() => onViewJobDetails(application.jobId)}
          >
            <FileText className="h-4 w-4 mr-2" />
            View Job Details
          </Button>
          <Button 
            variant="outline"
            onClick={() => setNotesDialogOpen(true)}
          >
            <FileText className="h-4 w-4 mr-2" />
            Update Notes
          </Button>
        </div>

        <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Application Notes</DialogTitle>
              <DialogDescription>
                This is where you or launchpad staff can add notes about your application for {application.jobTitle} at {application.company}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Textarea
                placeholder="Add notes about interviews, follow-ups, or any other information about this application..."
                value={applicationNotes}
                onChange={(e) => setApplicationNotes(e.target.value)}
                rows={5}
                className="w-full"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNotesDialogOpen(false)}>Cancel</Button>
              <Button onClick={saveNotes} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Notes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Applications List */}
      <Card className="lg:col-span-1 max-h-[calc(100vh-220px)] overflow-hidden flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle>My Applications</CardTitle>
          <CardDescription>{applications.length} applications submitted</CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-auto p-3">
          <div className="space-y-3">
            {applications.map((application) => (
              <Card 
                key={application.id} 
                className={cn(
                  "cursor-pointer hover:shadow transition-shadow",
                  selectedApplication?.id === application.id && "ring-2 ring-blue-400 border-l-4 border-blue-400"
                )}
                onClick={() => setSelectedApplication(application)}
              >
                <CardContent className="p-3">
                  <div>
                    <h3 className="font-medium text-gray-900 line-clamp-1">{application.jobTitle}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{application.company}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-400">{formatDate(application.appliedDate)}</span>
                      {getStatusBadge(application.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Application Details */}
      <Card className="lg:col-span-2">
        <CardContent>
          <ApplicationDetail application={selectedApplication} />
        </CardContent>
      </Card>
    </div>
  );
} 