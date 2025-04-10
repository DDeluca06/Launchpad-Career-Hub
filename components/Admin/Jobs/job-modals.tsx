"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/overlay/dialog";
import { Label } from "@/components/ui/basic/label";
import { Input } from "@/components/ui/form/input";
import { Textarea } from "@/components/ui/form/textarea";
import { Button } from "@/components/ui/basic/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/form/select";
import { Badge } from "@/components/ui/basic/badge";
import { useState, useEffect } from "react";
import { JobTag, JobType, JOB_TAGS, NewJob } from "./types";
import { ExtendedJob } from "./types";

// Partner interface
interface Partner {
  partner_id: number;
  name: string;
  industry?: string;
  location?: string;
}

interface JobModalsProps {
  // Add Job Modal
  isAddJobModalOpen: boolean;
  setIsAddJobModalOpen: (open: boolean) => void;
  newJob: NewJob;
  setNewJob: React.Dispatch<React.SetStateAction<NewJob>>;
  handleAddJob: () => Promise<void>;
  handleTagChange: (tag: JobTag) => void;
  
  // Edit Job Modal
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
  editingJob: ExtendedJob | null;
  setEditingJob: React.Dispatch<React.SetStateAction<ExtendedJob | null>>;
  handleEditJob: () => Promise<void>;
  handleEditTagChange: (tag: JobTag) => void;
  
  // Archive Job Modal
  isArchiveModalOpen: boolean;
  setIsArchiveModalOpen: (open: boolean) => void;
  selectedJob: ExtendedJob | null;
  handleArchiveJob: () => Promise<void>;
  
  // Import CSV Modal
  isImportModalOpen: boolean;
  setIsImportModalOpen: (open: boolean) => void;
  csvFile: File | null;
  setCsvFile: React.Dispatch<React.SetStateAction<File | null>>;
  handleImportCSV: () => Promise<void>;
  downloadCsvTemplate: () => void;
  
  // Web Scraping Modal
  isScrapingModalOpen: boolean;
  setIsScrapingModalOpen: (open: boolean) => void;
  scrapingUrl: string;
  setScrapingUrl: React.Dispatch<React.SetStateAction<string>>;
  isScrapingInProgress: boolean;
  handleWebScraping: () => Promise<void>;
}

export function JobModals({
  // Add Job Modal
  isAddJobModalOpen,
  setIsAddJobModalOpen,
  newJob,
  setNewJob,
  handleAddJob,
  handleTagChange,
  
  // Edit Job Modal
  isEditModalOpen,
  setIsEditModalOpen,
  editingJob,
  setEditingJob,
  handleEditJob,
  handleEditTagChange,
  
  // Archive Job Modal
  isArchiveModalOpen,
  setIsArchiveModalOpen,
  selectedJob,
  handleArchiveJob,
  
  // Import CSV Modal
  isImportModalOpen,
  setIsImportModalOpen,
  csvFile,
  setCsvFile,
  handleImportCSV,
  downloadCsvTemplate,
  
  // Web Scraping Modal
  isScrapingModalOpen,
  setIsScrapingModalOpen,
  scrapingUrl,
  setScrapingUrl,
  isScrapingInProgress,
  handleWebScraping
}: JobModalsProps) {
  // State for partners
  const [partners, setPartners] = useState<Partner[]>([]);

  // Fetch partners when modals are opened
  useEffect(() => {
    if (isAddJobModalOpen || isEditModalOpen) {
      fetchPartners();
    }
  }, [isAddJobModalOpen, isEditModalOpen]);

  // Function to fetch partners
  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/partners');
      if (!response.ok) {
        throw new Error('Failed to fetch partners');
      }
      const data = await response.json();
      setPartners(data.partners || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
      // Set some default partners if fetch fails
      setPartners([
        { partner_id: 1, name: "TechPhilly", industry: "Technology" },
        { partner_id: 2, name: "HealthPartners Inc.", industry: "Healthcare" }
      ]);
    }
  };

  return (
    <>
      {/* Edit Job Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
            <DialogDescription>
              Update job details and information
            </DialogDescription>
          </DialogHeader>
          
          {editingJob && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-job-title">Job Title</Label>
                  <Input
                    id="edit-job-title"
                    value={editingJob.title}
                    onChange={(e) => setEditingJob({...editingJob, title: e.target.value})}
                    placeholder="e.g. Frontend Developer"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-company">Company</Label>
                  <Input
                    id="edit-company"
                    value={editingJob.company}
                    onChange={(e) => setEditingJob({...editingJob, company: e.target.value})}
                    placeholder="e.g. Acme Inc."
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    value={editingJob.location || ''}
                    onChange={(e) => setEditingJob({...editingJob, location: e.target.value})}
                    placeholder="e.g. Philadelphia, PA (Remote)"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-job-type">Job Type</Label>
                  <Select 
                    value={editingJob.job_type}
                    onValueChange={(value) => setEditingJob({...editingJob, job_type: value as JobType})}
                  >
                    <SelectTrigger id="edit-job-type">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FULL_TIME">Full Time</SelectItem>
                      <SelectItem value="PART_TIME">Part Time</SelectItem>
                      <SelectItem value="CONTRACT">Contract</SelectItem>
                      <SelectItem value="INTERNSHIP">Internship</SelectItem>
                      <SelectItem value="APPRENTICESHIP">Apprenticeship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-website">Website</Label>
                  <Input
                    id="edit-website"
                    value={editingJob.website || ''}
                    onChange={(e) => setEditingJob({...editingJob, website: e.target.value})}
                    placeholder="e.g. https://www.example.com/careers/job123"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-partner">Partner Organization</Label>
                  <Select 
                    value={editingJob.partner_id?.toString() || "null"}
                    onValueChange={(value) => setEditingJob({
                      ...editingJob, 
                      partner_id: value === "null" ? null : parseInt(value)
                    })}
                  >
                    <SelectTrigger id="edit-partner">
                      <SelectValue placeholder="Select partner (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="null">None</SelectItem>
                      {partners.map((partner) => (
                        <SelectItem key={partner.partner_id} value={partner.partner_id.toString()}>
                          {partner.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingJob.description || ''}
                  onChange={(e) => setEditingJob({...editingJob, description: e.target.value})}
                  placeholder="Enter job description..."
                  className="min-h-[200px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 p-2 border rounded-md max-h-[200px] overflow-y-auto">
                  {JOB_TAGS.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant={editingJob.tags?.includes(tag) ? "default" : "outline"}
                      className={`cursor-pointer ${editingJob.tags?.includes(tag) ? "bg-blue-500" : ""}`}
                      onClick={() => handleEditTagChange(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditJob}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Job Modal */}
      <Dialog open={isAddJobModalOpen} onOpenChange={setIsAddJobModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Job</DialogTitle>
            <DialogDescription>
              Create a new job listing for students to apply to
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="job-title">Job Title *</Label>
                <Input
                  id="job-title"
                  value={newJob.title}
                  onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                  placeholder="e.g. Frontend Developer"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  value={newJob.company}
                  onChange={(e) => setNewJob({...newJob, company: e.target.value})}
                  placeholder="e.g. Acme Inc."
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={newJob.location}
                  onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                  placeholder="e.g. Philadelphia, PA (Remote)"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="job-type">Job Type</Label>
                <Select 
                  value={newJob.job_type}
                  onValueChange={(value) => setNewJob({...newJob, job_type: value as JobType})}
                >
                  <SelectTrigger id="job-type">
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL_TIME">Full Time</SelectItem>
                    <SelectItem value="PART_TIME">Part Time</SelectItem>
                    <SelectItem value="CONTRACT">Contract</SelectItem>
                    <SelectItem value="INTERNSHIP">Internship</SelectItem>
                    <SelectItem value="APPRENTICESHIP">Apprenticeship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={newJob.website}
                  onChange={(e) => setNewJob({...newJob, website: e.target.value})}
                  placeholder="e.g. https://www.example.com/careers/job123"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="partner">Partner Organization</Label>
                <Select 
                  value={newJob.partner_id?.toString() || "null"}
                  onValueChange={(value) => setNewJob({
                    ...newJob, 
                    partner_id: value === "null" ? null : parseInt(value)
                  })}
                >
                  <SelectTrigger id="partner">
                    <SelectValue placeholder="Select partner (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">None</SelectItem>
                    {partners.map((partner) => (
                      <SelectItem key={partner.partner_id} value={partner.partner_id.toString()}>
                        {partner.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newJob.description}
                onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                placeholder="Enter job description..."
                className="min-h-[200px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 p-2 border rounded-md max-h-[200px] overflow-y-auto">
                {JOB_TAGS.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant={newJob.tags.includes(tag) ? "default" : "outline"}
                    className={`cursor-pointer ${newJob.tags.includes(tag) ? "bg-blue-500" : ""}`}
                    onClick={() => handleTagChange(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddJobModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddJob}>
              Add Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Job Modal */}
      <Dialog open={isArchiveModalOpen} onOpenChange={setIsArchiveModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedJob?.archived ? 'Restore Job' : 'Archive Job'}
            </DialogTitle>
            <DialogDescription>
              {selectedJob?.archived 
                ? 'This will make the job listing active again.' 
                : 'This will hide the job from active listings.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p>
              {selectedJob?.archived 
                ? `Are you sure you want to restore "${selectedJob?.title}"?` 
                : `Are you sure you want to archive "${selectedJob?.title}"?`}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {selectedJob?.archived 
                ? 'The job will reappear in active job listings and be available for applications.' 
                : 'Archived jobs can be restored later if needed.'}
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsArchiveModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleArchiveJob}
              variant={selectedJob?.archived ? "default" : "danger"}
            >
              {selectedJob?.archived ? 'Restore Job' : 'Archive Job'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import CSV Modal */}
      <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Import Jobs from CSV</DialogTitle>
            <DialogDescription>
              Upload a CSV file with job listings to bulk import
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csv-file">CSV File</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
              />
              <p className="text-xs text-gray-500 mt-1">
                CSV should have headers: Title, Company, Location, Type, Description, Website, Tags, PartnerId
              </p>
            </div>
            
            <div className="text-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={downloadCsvTemplate}
                className="text-xs"
              >
                Download Template
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleImportCSV}
              disabled={!csvFile}
            >
              Import Jobs
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Web Scraping Modal */}
      <Dialog open={isScrapingModalOpen} onOpenChange={setIsScrapingModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Web Scraping Tool</DialogTitle>
            <DialogDescription>
              Extract job listings from external websites
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="website-url">Job Listing URL</Label>
              <Input
                id="website-url"
                type="url"
                placeholder="https://example.com/jobs/web-developer"
                value={scrapingUrl}
                onChange={(e) => setScrapingUrl(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the URL of a job listing page to extract details
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="scraping-partner">Associate with Partner (Optional)</Label>
              <Select 
                value={newJob.partner_id?.toString() || "null"}
                onValueChange={(value) => setNewJob({
                  ...newJob, 
                  partner_id: value === "null" ? null : parseInt(value)
                })}
              >
                <SelectTrigger id="scraping-partner">
                  <SelectValue placeholder="Select partner (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">None</SelectItem>
                  {partners.map((partner) => (
                    <SelectItem key={partner.partner_id} value={partner.partner_id.toString()}>
                      {partner.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800">
              <p><strong>Note:</strong> This is a demonstration feature. In a production environment, this would integrate with a web scraping service API.</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScrapingModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleWebScraping}
              disabled={!scrapingUrl || isScrapingInProgress}
            >
              {isScrapingInProgress ? 'Scraping...' : 'Extract Job'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 