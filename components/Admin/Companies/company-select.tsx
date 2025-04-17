"use client";

import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/basic/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/overlay/popover';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/overlay/dialog';
import { Input } from '@/components/ui/form/input';
import { Label } from '@/components/ui/basic/label';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/form/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/form/select';
import { Checkbox } from '@/components/ui/form/checkbox';
import { NewCompany, Company } from '@/lib/company-service';
import { INDUSTRIES } from '../Partners/types';
import { toast } from 'sonner';

interface CompanySelectProps {
  value?: number;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function CompanySelect({ value, onChange, placeholder = "Select company", disabled = false }: CompanySelectProps) {
  // UI state
  const [open, setOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [useFallback, setUseFallback] = useState(false);
  
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
      setError(null);
      
      const response = await fetch('/api/companies');
      if (!response.ok) {
        throw new Error(`Failed to fetch companies: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.companies || !Array.isArray(data.companies)) {
        throw new Error('Invalid response format');
      }
      
      setCompanies(data.companies);
      setUseFallback(false);
    } catch (error) {
      console.error('Error loading companies:', error);
      setError('Failed to load companies');
      setUseFallback(true);
      
      // Add some fallback dummy companies if API fails
      setCompanies([
        { company_id: 1, name: "Example Company 1", is_partner: false },
        { company_id: 2, name: "Example Company 2", is_partner: true },
        { company_id: 3, name: "Example Company 3", is_partner: false }
      ]);
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
      
      // For fallback mode, create a mock company
      if (useFallback) {
        const newId = Math.max(...companies.map(c => c.company_id)) + 1;
        const createdCompany = {
          company_id: newId,
          name: newCompany.name,
          is_partner: newCompany.is_partner
        };
        
        setCompanies([...companies, createdCompany]);
        onChange(createdCompany.company_id);
        setNewCompanyOpen(false);
        resetNewCompanyForm();
        toast.success('Company created (locally)');
        return;
      }
      
      // Submit to the API
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCompany),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast.success('Company created successfully');
        await loadCompanies();
        onChange(result.company.company_id);
        setNewCompanyOpen(false);
        resetNewCompanyForm();
      } else {
        toast.error(result.error || 'Failed to create company');
        // If company already exists, select it
        if (response.status === 409 && result.company) {
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
  
  // Simple select fallback for mobile or when fancy UI is problematic
  if (useFallback) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Select value={value?.toString()} onValueChange={(val) => onChange(val ? parseInt(val) : undefined)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.company_id} value={company.company_id.toString()}>
                  {company.name} {company.is_partner && "(Partner)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            type="button"
            variant="outline"
            size="icon"
            className="flex-shrink-0"
            onClick={() => setNewCompanyOpen(true)}
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        
        {error && <p className="text-xs text-red-500">{error}</p>}
        
        {/* New Company Dialog */}
        <Dialog open={newCompanyOpen} onOpenChange={setNewCompanyOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Company</DialogTitle>
              <DialogDescription>
                Create a new company record.
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
      </div>
    );
  }
  
  // Rich UI version
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
        <PopoverContent className="w-[95vw] sm:w-[400px] p-0">
          <div className="p-2">
            <div className="flex items-center border-b px-3 mb-2">
              <Input 
                className="h-9 border-none shadow-none focus-visible:ring-0 flex-1 px-0 py-2"
                placeholder="Search companies..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="max-h-[50vh] sm:max-h-[300px] overflow-y-auto">
              {filteredCompanies.length === 0 ? (
                <div className="py-6 text-center text-sm">
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
                </div>
              ) : (
                <div className="p-1">
                  {filteredCompanies.map((company) => (
                    <button
                      key={company.company_id}
                      className={cn(
                        "w-full text-left flex items-center justify-between px-3 py-3 rounded-md text-sm",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus:bg-accent focus:text-accent-foreground focus:outline-none",
                        "active:bg-accent/90 active:text-accent-foreground",
                        "touch-manipulation",
                        "transition-colors duration-200",
                        value === company.company_id ? "bg-accent/50" : ""
                      )}
                      onClick={() => {
                        onChange(company.company_id);
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-center flex-1">
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4 flex-shrink-0",
                            value === company.company_id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span>{company.name}</span>
                      </div>
                      {company.is_partner && (
                        <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 ml-2 flex-shrink-0">
                          Partner
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="border-t mt-2 pt-2">
              <button
                className="w-full text-left flex items-center gap-2 px-3 py-3 rounded-md text-sm
                           hover:bg-accent hover:text-accent-foreground 
                           focus:bg-accent focus:text-accent-foreground focus:outline-none
                           active:bg-accent/90 active:text-accent-foreground
                           touch-manipulation
                           transition-colors duration-200"
                onClick={() => {
                  setNewCompanyOpen(true);
                  setOpen(false);
                }}
              >
                <PlusCircle className="h-4 w-4 flex-shrink-0" />
                Create Company
              </button>
            </div>
          </div>
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