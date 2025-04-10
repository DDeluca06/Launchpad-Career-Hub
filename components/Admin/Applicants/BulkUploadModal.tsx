import React from 'react';
import { Button } from "@/components/ui/basic/button";
import { Input } from "@/components/ui/form/input";
import { MultiPurposeModal } from "@/components/ui/overlay/multi-purpose-modal";
import { Upload } from "lucide-react";

interface BulkUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  csvFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBulkUpload: () => Promise<void>;
}

/**
 * Modal component for bulk uploading users via CSV file
 */
export function BulkUploadModal({
  open,
  onOpenChange,
  csvFile,
  onFileChange,
  onBulkUpload,
}: BulkUploadModalProps) {
  return (
    <MultiPurposeModal
      open={open}
      onOpenChange={onOpenChange}
      title="Bulk Upload Users"
      size="md"
      showFooter={true}
      primaryActionText="Upload and Process"
      onPrimaryAction={onBulkUpload}
      secondaryActionText="Cancel"
      onSecondaryAction={() => onOpenChange(false)}
    >
      <div className="py-4 space-y-4">
        <p className="text-sm text-gray-500 mb-2">
          Upload a CSV file with user data. The file should include columns for first name, last name, email, and program.
        </p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            accept=".csv"
            onChange={onFileChange}
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
  );
} 