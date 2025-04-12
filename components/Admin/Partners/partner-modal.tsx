"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/overlay/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form/form";
import { Input } from "@/components/ui/form/input";
import { Textarea } from "@/components/ui/form/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/form/select";
import { Button } from "@/components/ui/basic/button";
import { Separator } from "@/components/ui/basic/separator";
import { toast } from "sonner";
import { Partner, NewPartner, INDUSTRIES } from "./types";
import { createPartner, updatePartner } from "./partner-service";

// Define form validation schema for Partner 
const partnerFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
  website_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  contact_email: z.string().email("Must be a valid email").optional().or(z.literal("")),
  contact_phone: z.string().optional(),
  contact_name: z.string().optional(),
});

type PartnerFormValues = z.infer<typeof partnerFormSchema>;

interface PartnerModalProps {
  partner?: Partner;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (partner: Partner) => void;
}

/**
 * Modal for adding or editing partner information
 * @param partner Optional partner data for editing mode
 * @param open Whether the modal is open
 * @param onOpenChange Callback for when the open state changes
 * @param onSuccess Callback for when a partner is successfully created or updated
 */
export function PartnerModal({
  partner,
  open,
  onOpenChange,
  onSuccess,
}: PartnerModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!partner;

  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      name: "",
      description: "",
      industry: "",
      location: "",
      website_url: "",
      contact_email: "",
      contact_phone: "",
      contact_name: "",
    },
  });

  // Reset form with partner data when editing
  useEffect(() => {
    if (partner && open) {
      form.reset({
        name: partner.name || "",
        description: partner.description || "",
        industry: partner.industry || "",
        location: partner.location || "",
        website_url: partner.website_url || "",
        contact_email: partner.contact_email || "",
        contact_phone: partner.contact_phone || "",
        contact_name: partner.contact_name || "",
      });
    } else if (!partner && open) {
      form.reset({
        name: "",
        description: "",
        industry: "",
        location: "",
        website_url: "",
        contact_email: "",
        contact_phone: "",
        contact_name: "",
      });
    }
  }, [partner, open, form]);

  const onSubmit = async (values: PartnerFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (isEditMode && partner) {
        // Update existing partner
        const updatedPartner = await updatePartner(partner.partner_id, {
          name: values.name,
          description: values.description,
          industry: values.industry,
          location: values.location,
          website_url: values.website_url,
          contact_name: values.contact_name,
          contact_email: values.contact_email,
          contact_phone: values.contact_phone,
        });
        
        toast.success("Partner updated successfully");
        
        if (onSuccess) {
          onSuccess(updatedPartner);
        }
      } else {
        // Create new partner
        const newPartnerData: NewPartner = {
          name: values.name,
          description: values.description,
          industry: values.industry,
          location: values.location,
          website_url: values.website_url,
          contact_name: values.contact_name,
          contact_email: values.contact_email,
          contact_phone: values.contact_phone,
        };
        
        const createdPartner = await createPartner(newPartnerData);
        
        toast.success("Partner created successfully");
        
        if (onSuccess) {
          onSuccess(createdPartner);
        }
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting partner form:", error);
      toast.error("Failed to save partner. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Partner" : "Add New Partner"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the partner organization's information."
              : "Add a new partner organization to the platform."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              {/* Organization Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Partner organization name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Industry */}
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Technology, Healthcare, Finance" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the partner organization"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Philadelphia, PA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Website URL */}
              <FormField
                control={form.control}
                name="website_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Separator />
            
            {/* Contact Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              
              {/* Contact Name */}
              <FormField
                control={form.control}
                name="contact_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name of contact person" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Contact Email */}
              <FormField
                control={form.control}
                name="contact_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input placeholder="contact@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Contact Phone */}
              <FormField
                control={form.control}
                name="contact_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="(123) 456-7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Footer actions */}
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Saving..."
                ) : isEditMode ? (
                  "Save Changes"
                ) : (
                  "Create Partner"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 