"use client";

import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/basic/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/overlay/popover';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/overlay/dialog';
import { Input } from '@/components/ui/form/input';
import { Label } from '@/components/ui/basic/label';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/form/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/form/select';
import { Checkbox } from '@/components/ui/form/checkbox';
import { fetchCompanies, createCompany, NewCompany, Company } from '@/lib/company-service';
import { INDUSTRIES } from '../Partners/types';
import { toast } from 'sonner';

interface CompanySelectProps {
  value?: number;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function CompanySelect({ value, onChange, placeholder = "Select company", disabled = false }: CompanySelectProps) {
  const [open, setOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // New company dialog
  const [newCompanyOpen, setNewCompanyOpen] = useState(false);
  const [newCompany, setNewCompany] = useState<NewCompany>({
    name: '',
    description: '',
    website: '',
    industry: '',
    location: '',
    is_partner: false
  });
  
  // Get the selected company name
  const selectedCompany = companies.find(company => company.company_id === value);
  
  // Fetch companies
  useEffect(() => {
    loadCompanies();
  }, []);
  
  // Function to load companies
  const loadCompanies = async () => {
    try {
      setLoading(true);
      const data = await fetchCompanies();
      setCompanies(data);
    } catch (error) {
      console.error('Error loading companies:', error);
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };
  
  // Reset new company form
  const resetNewCompanyForm = () => {
    setNewCompany({
      name: '',
      description: '',
      website: '',
      industry: '',
      location: '',
      is_partner: false
    });
  };
  
  // Handle creating a new company
  const handleCreateCompany = async () => {
    try {
      if (!newCompany.name) {
        toast.error('Company name is required');
        return;
      }
      
      // Submit the form
      const result = await createCompany(newCompany);
      
      if (result.success) {
        toast.success('Company created successfully');
        await loadCompanies(); // Reload companies
        
        // Select the newly created company
        onChange(result.company.company_id);
        
        // Close the dialog
        setNewCompanyOpen(false);
        resetNewCompanyForm();
      } else {
        toast.error(result.message);
        // If company already exists, select it
        if (result.company) {
          onChange(result.company.company_id);
          setNewCompanyOpen(false);
        }
      }
    } catch (error) {
      console.error('Error creating company:', error);
      toast.error('Failed to create company');
    }
  };
  
  // Filter companies based on search term
  const filteredCompanies = search 
    ? companies.filter(company => 
        company.name.toLowerCase().includes(search.toLowerCase()))
    : companies;
  
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            {loading ? (
              <span className="text-muted-foreground">Loading companies...</span>
            ) : selectedCompany ? (
              selectedCompany.name
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command>
            <CommandInput 
              placeholder="Search companies..." 
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>
                No company found. 
                <Button
                  variant="link"
                  className="pl-1 pr-1 h-auto"
                  onClick={() => {
                    setNewCompanyOpen(true);
                    setOpen(false);
                    // Pre-fill the company name with the search term
                    if (search) {
                      setNewCompany({...newCompany, name: search});
                    }
                  }}
                >
                  Create a new company
                </Button>
              </CommandEmpty>
              <CommandGroup>
                {filteredCompanies.map((company) => (
                  <CommandItem
                    key={company.company_id}
                    value={company.name}
                    onSelect={() => {
                      onChange(company.company_id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === company.company_id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="flex-1">{company.name}</span>
                    {company.is_partner && (
                      <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 ml-2">
                        Partner
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setNewCompanyOpen(true);
                  setOpen(false);
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Company
              </CommandItem>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      
      {/* New Company Dialog */}
      <Dialog open={newCompanyOpen} onOpenChange={setNewCompanyOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Company</DialogTitle>
            <DialogDescription>
              Create a new company record. Companies can be partnered or non-partnered organizations.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="company-name" className="required">Company Name</Label>
              <Input
                id="company-name"
                placeholder="Enter company name"
                value={newCompany.name}
                onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-industry">Industry</Label>
                <Select
                  value={newCompany.industry || ''}
                  onValueChange={(value) => setNewCompany({...newCompany, industry: value})}
                >
                  <SelectTrigger id="company-industry">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company-location">Location</Label>
                <Input
                  id="company-location"
                  placeholder="City, State or Remote"
                  value={newCompany.location || ''}
                  onChange={(e) => setNewCompany({...newCompany, location: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company-website">Website</Label>
              <Input
                id="company-website"
                placeholder="https://example.com"
                value={newCompany.website || ''}
                onChange={(e) => setNewCompany({...newCompany, website: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company-description">Description</Label>
              <Textarea
                id="company-description"
                placeholder="Brief description of the company"
                value={newCompany.description || ''}
                onChange={(e) => setNewCompany({...newCompany, description: e.target.value})}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="company-partner"
                checked={newCompany.is_partner}
                onCheckedChange={(checked) => setNewCompany({...newCompany, is_partner: checked as boolean})}
              />
              <Label htmlFor="company-partner" className="cursor-pointer">
                This is a partner company
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setNewCompanyOpen(false);
              resetNewCompanyForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleCreateCompany}>
              Create Company
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 