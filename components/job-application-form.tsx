"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/basic/button";

interface Resume {
  resume_id: number;
  file_name: string;
  file_path: string;
  is_default: boolean | null;
}



interface JobApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resumeId: number | null;
  coverLetter: File | null;
  linkedin: string;
  github: string;
  portfolio: string;
  additionalInfo: string;
}

interface JobApplicationFormProps {
  userId: number; 
  onSubmit: (data: JobApplicationData) => void;
}

interface InputProps {
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
}

interface TextareaProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  type,
  label,
  value,
  onChange,
  required = false,
  className,
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full border-gray-200 focus:border-launchpad-blue ${className}`}
    />
  </div>
);

const Textarea: React.FC<TextareaProps> = ({
  label,
  value,
  onChange,
  placeholder,
  className,
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full border-gray-200 focus:border-launchpad-blue ${className}`}
    />
  </div>
);

export function JobApplicationForm({ userId, onSubmit }: JobApplicationFormProps) {
  const [formData, setFormData] = useState<JobApplicationData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    resumeId: null,
    coverLetter: null,
    linkedin: "",
    github: "",
    portfolio: "",
    additionalInfo: "",
  });
  
  const [userResumes, setUserResumes] = useState<Resume[]>([]);
  const [isLoadingResumes, setIsLoadingResumes] = useState(false);

  useEffect(() => {
    const fetchUserResumes = async () => {
      if (!userId) return;
      
      setIsLoadingResumes(true);
      try {
        const response = await fetch(`/api/resumes?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUserResumes(data);
          
          const defaultResume = data.find((resume: Resume) => resume.is_default);
          if (defaultResume) {
            setFormData(prev => ({ ...prev, resumeId: defaultResume.resume_id }));
          } else if (data.length > 0) {
            setFormData(prev => ({ ...prev, resumeId: data[0].resume_id }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch resumes:", error);
      } finally {
        setIsLoadingResumes(false);
      }
    };

    fetchUserResumes();
  }, [userId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="text"
          label="First Name"
          value={formData.firstName}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, firstName: e.target.value }))
          }
          required
        />
        <Input
          type="text"
          label="Last Name"
          value={formData.lastName}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, lastName: e.target.value }))
          }
          required
        />
      </div>

      <Input
        type="email"
        label="Email"
        value={formData.email}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, email: e.target.value }))
        }
        required
      />

      <Input
        type="tel"
        label="Phone Number"
        value={formData.phone}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, phone: e.target.value }))
        }
      />

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Resume
        </label>
        {isLoadingResumes ? (
          <p className="text-sm text-gray-500">Loading your resumes...</p>
        ) : userResumes.length > 0 ? (
          <select
            value={formData.resumeId || ""}
            onChange={(e) => 
              setFormData((prev) => ({ 
                ...prev, 
                resumeId: e.target.value ? parseInt(e.target.value) : null 
              }))
            }
            className="block w-full border-gray-200 rounded-md shadow-sm focus:border-launchpad-blue focus:ring-launchpad-blue"
            required
          >
            <option value="">Select a resume</option>
            {userResumes.map((resume) => (
              <option key={resume.resume_id} value={resume.resume_id}>
                {resume.file_name} {resume.is_default ? "(Default)" : ""}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-sm text-gray-500">
            No resumes found. Please upload a resume in your profile settings.
          </p>
        )}
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Cover Letter (Optional)
        </label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setFormData((prev) => ({ ...prev, coverLetter: file }));
            }
          }}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-launchpad-blue file:text-white hover:file:bg-launchpad-teal"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="url"
          label="LinkedIn Profile"
          value={formData.linkedin}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, linkedin: e.target.value }))
          }
        />
        <Input
          type="url"
          label="GitHub Profile"
          value={formData.github}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, github: e.target.value }))
          }
        />
      </div>

      <Input
        type="url"
        label="Portfolio Website"
        value={formData.portfolio}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, portfolio: e.target.value }))
        }
      />

      <Textarea
        label="Additional Information"
        value={formData.additionalInfo}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, additionalInfo: e.target.value }))
        }
        placeholder="Tell us anything else you'd like us to know about you"
      />

      <Button type="submit" className="w-full bg-launchpad-blue hover:bg-launchpad-teal text-white">
        Submit Application
      </Button>
    </form>
  );
}
