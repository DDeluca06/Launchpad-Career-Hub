import React from 'react';
import { Button } from "@/components/ui/basic/button";
import { MultiPurposeModal } from "@/components/ui/overlay/multi-purpose-modal";
import { Input } from "@/components/ui/form/input";
import { Label } from "@/components/ui/basic/label";
import { FileText } from "lucide-react";

interface BulkUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  csvFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBulkUpload: () => void;
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
  const handleDownloadTemplate = () => {
    // Create template CSV
    const template = "firstName,lastName,email,program\nJohn,Doe,john.doe@example.com,101\nJane,Smith,jane.smith@example.com,LIFTOFF";
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'applicants_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <MultiPurposeModal
      open={open}
      onOpenChange={onOpenChange}
      title="Bulk Upload Applicants"
      size="md"
      showFooter={true}
      primaryActionText="Upload"
      onPrimaryAction={onBulkUpload}
      secondaryActionText="Cancel"
      onSecondaryAction={() => onOpenChange(false)}
    >
      <div className="space-y-6 py-4">
        <p className="text-sm text-muted-foreground">
          Upload a CSV file containing multiple applicant records.
        </p>

        <div className="space-y-2">
          <Label htmlFor="csvFile">CSV File</Label>
          <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-[#0faec9] transition-colors">
            <Input
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={onFileChange}
              className="hidden"
            />
            <label
              htmlFor="csvFile"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <FileText className="h-8 w-8 text-[#0faec9]" />
              <div className="text-sm font-medium">
                {csvFile ? csvFile.name : "Choose File"}
              </div>
              <div className="text-xs text-muted-foreground">
                {csvFile ? `${(csvFile.size / 1024).toFixed(2)} KB` : "No file chosen"}
              </div>
            </label>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            CSV should have headers: firstName, lastName, email, program
          </p>
        </div>

        <Button
          variant="link"
          size="sm"
          className="text-[#0faec9] hover:text-[#0a8196] p-0 h-auto font-normal"
          onClick={handleDownloadTemplate}
        >
          Download Template
        </Button>

        <div className="space-y-2 text-sm text-muted-foreground bg-slate-50 p-4 rounded-lg">
          <h4 className="font-medium text-foreground">CSV Format Requirements:</h4>
          <ul className="list-disc pl-4 space-y-1">
            <li>First row must contain column headers</li>
            <li>Required columns: firstName, lastName, email, program</li>
            <li>Program values: FOUNDATION, 101, LIFTOFF, ALUMNI</li>
            <li>Passwords will be auto-generated if not provided</li>
          </ul>
        </div>
      </div>
    </MultiPurposeModal>
  );
} 