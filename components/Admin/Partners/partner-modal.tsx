"use client";

import { useState, useEffect } from "react";
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
} from "@/components/ui/basic/dialog";
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
import { formatDate } from "@/lib/utils";
import { createPartner, updatePartner } from "./partner-service";

// Define form validation schema for Partner 
const partnerFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Organization name must be at least 2 characters" })
    .max(100, { message: "Organization name must be at most 100 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(2000, { message: "Description must be at most 2000 characters" }),
  industry: z
    .string()
    .min(1, { message: "Please select an industry" }),
  location: z
    .string()
    .min(1, { message: "Location must be at least 1 character" })
    .max(100, { message: "Location must be at most 100 characters" }),
  website: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .or(z.literal("")),
  contact_email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .or(z.literal("")),
  contact_phone: z
    .string()
    .max(20, { message: "Phone number must be at most 20 characters" })
    .or(z.literal("")),
  contact_name: z
    .string()
    .max(100, { message: "Contact name must be at most 100 characters" })
    .or(z.literal("")),
  logo_url: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .or(z.literal("")),
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
      website: "",
      contact_email: "",
      contact_phone: "",
      contact_name: "",
      logo_url: "",
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
        website: partner.website || "",
        contact_email: partner.contact_email || "",
        contact_phone: partner.contact_phone || "",
        contact_name: partner.contact_name || "",
        logo_url: partner.logo_url || "",
      });
    } else if (!partner && open) {
      form.reset({
        name: "",
        description: "",
        industry: "",
        location: "",
        website: "",
        contact_email: "",
        contact_phone: "",
        contact_name: "",
        logo_url: "",
      });
    }
  }, [partner, open, form]);

  const onSubmit = async (values: PartnerFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (isEditMode && partner) {
        // Update existing partner
        const updatedPartner = await updatePartner({
          ...partner,
          ...values,
        });
        
        toast.success("Partner updated successfully");
        
        if (onSuccess) {
          onSuccess(updatedPartner);
        }
      } else {
        // Create new partner
        const newPartnerData: NewPartner = {
          ...values,
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
              
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of the organization and partnership"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Industry & Location (side by side) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry *</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {INDUSTRIES.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location *</FormLabel>
                      <FormControl>
                        <Input placeholder="City, State/Province, Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Website */}
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Logo URL */}
              <FormField
                control={form.control}
                name="logo_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
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
                    <FormLabel>Contact Person</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name of primary contact" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Contact Email & Phone (side by side) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                
                <FormField
                  control={form.control}
                  name="contact_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (123) 456-7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                {isSubmitting ? "Saving..." : isEditMode ? "Update Partner" : "Add Partner"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 