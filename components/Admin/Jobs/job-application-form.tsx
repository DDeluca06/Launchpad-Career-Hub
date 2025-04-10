"use client";

import { useState } from "react";
import { Button } from "@/components/ui/basic/button";

interface Job {
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
}

interface JobApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resume: File | null;
  coverLetter: File | null;
  linkedin: string;
  github: string;
  portfolio: string;
  additionalInfo: string;
}

interface JobApplicationFormProps {
  job: Job;
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

export function JobApplicationForm({ onSubmit }: JobApplicationFormProps) {
  const [formData, setFormData] = useState<JobApplicationData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    resume: null,
    coverLetter: null,
    linkedin: "",
    github: "",
    portfolio: "",
    additionalInfo: "",
  });

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
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setFormData((prev) => ({ ...prev, resume: file }));
            }
          }}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-launchpad-blue file:text-white hover:file:bg-launchpad-teal"
        />
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
        placeholder="Tell us why you're a great fit for this role..."
      />

      <Button
        type="submit"
        className="w-full bg-launchpad-blue hover:bg-launchpad-teal text-white"
      >
        Submit Application
      </Button>
    </form>
  );
}