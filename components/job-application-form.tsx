"use client"

import { useState } from "react"
import { Button } from "@/components/ui/basic/button"
import { Input } from "@/components/ui/form/input"
import { Textarea } from "@/components/ui/form/textarea"
import { Label } from "@/components/ui/basic/label"
import { Checkbox } from "@/components/ui/form/checkbox"
import { Upload, Link as LinkIcon, Briefcase, FileText } from "lucide-react"
import { Badge } from "@/components/ui/basic/badge"
import { Separator } from "@/components/ui/basic/separator"

interface JobApplicationFormProps {
  job: any
  onSubmit: (formData: any) => void
}

export function JobApplicationForm({ job, onSubmit }: JobApplicationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    coverLetter: "",
    resumeFile: null as File | null,
    coverLetterFile: null as File | null,
    interested: false
  })
  
  const [resumeFileName, setResumeFileName] = useState("")
  const [coverLetterFileName, setCoverLetterFileName] = useState("")
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, interested: checked }))
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'resume' | 'coverLetter') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      if (fileType === 'resume') {
        setFormData(prev => ({ ...prev, resumeFile: file }))
        setResumeFileName(file.name)
      } else {
        setFormData(prev => ({ ...prev, coverLetterFile: file }))
        setCoverLetterFileName(file.name)
      }
    }
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Job Information */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
        <h3 className="font-medium text-gray-900 mb-2">{job.title}</h3>
        <p className="text-sm text-gray-600 mb-3">{job.company} • {job.location}</p>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            <Briefcase className="h-3 w-3 mr-1" />
            {job.type}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {job.salary}
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleInputChange} 
            placeholder="Enter your full name" 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            value={formData.email} 
            onChange={handleInputChange} 
            placeholder="Enter your email address" 
            required 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input 
          id="phone" 
          name="phone" 
          type="tel" 
          value={formData.phone} 
          onChange={handleInputChange} 
          placeholder="Enter your phone number" 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
        <Textarea 
          id="coverLetter" 
          name="coverLetter" 
          value={formData.coverLetter} 
          onChange={handleInputChange} 
          placeholder="Write your cover letter or upload a file below" 
          className="min-h-[150px]" 
        />
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="font-medium">Upload Documents</h3>
        
        <div className="space-y-2">
          <Label htmlFor="resumeFile" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Resume
            <span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => document.getElementById('resumeFile')?.click()}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Resume
            </Button>
            <Input 
              id="resumeFile" 
              type="file" 
              accept=".pdf,.doc,.docx" 
              className="hidden" 
              onChange={(e) => handleFileChange(e, 'resume')} 
              required
            />
            {resumeFileName && (
              <span className="text-sm text-gray-600">{resumeFileName}</span>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="coverLetterFile" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Cover Letter File (Optional)
          </Label>
          <div className="flex items-center gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => document.getElementById('coverLetterFile')?.click()}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Cover Letter
            </Button>
            <Input 
              id="coverLetterFile" 
              type="file" 
              accept=".pdf,.doc,.docx" 
              className="hidden" 
              onChange={(e) => handleFileChange(e, 'coverLetter')} 
            />
            {coverLetterFileName && (
              <span className="text-sm text-gray-600">{coverLetterFileName}</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="interested" 
          checked={formData.interested} 
          onCheckedChange={handleCheckboxChange} 
        />
        <Label htmlFor="interested" className="text-sm font-normal">
          I'm interested in similar positions at this company
        </Label>
      </div>
      
      <div className="flex flex-col space-y-3">
        <Button type="submit" className="bg-launchpad-blue hover:bg-launchpad-teal text-white">
          Submit Application
        </Button>
        
        <div className="flex justify-center gap-4 text-sm text-gray-600">
          <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-launchpad-blue">
            <LinkIcon className="h-3 w-3" />
            LinkedIn Profile
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-launchpad-blue">
            <LinkIcon className="h-3 w-3" />
            Company Website
          </a>
        </div>
      </div>
    </form>
  )
}