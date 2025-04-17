"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/form/input';
import { Button } from '@/components/ui/basic/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/basic/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/navigation/tabs';
import { BuildingIcon, PlusIcon, SearchIcon, StarIcon, Building2Icon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/overlay/dialog';
import { Label } from '@/components/ui/basic/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/form/select';
import { Textarea } from '@/components/ui/form/textarea';
import { Checkbox } from '@/components/ui/form/checkbox';
import { Company, NewCompany } from '@/lib/company-service';
import { INDUSTRIES } from '@/components/Admin/Partners/types';
import { Badge } from '@/components/ui/basic/badge';
import { toast } from 'sonner';
import { DashboardLayout } from "@/components/dashboard-layout";

export default function CompaniesPage() {
  // State for companies list
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  // State for company dialog
  const [companyDialogOpen, setCompanyDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [newCompany, setNewCompany] = useState<NewCompany>({
    name: '',
    description: '',
    website: '',
    industry: '',
    location: '',
    is_partner: false
  });
  
  // State for selected company details
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  
  // Load companies from API
  const loadCompanies = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/companies');
      
      if (!response.ok) {
        throw new Error('Failed to fetch companies');
      }
      
      const data = await response.json();
      setCompanies(data.companies);
      setFilteredCompanies(data.companies);
      
      // Select the first company if none is selected
      if (data.companies.length > 0 && !selectedCompany) {
        setSelectedCompany(data.companies[0]);
      }
    } catch (error) {
      console.error('Error loading companies:', error);
      toast.error('Failed to load companies');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCompany, toast]);
  
  // Fetch companies on load
  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);
  
  // Filter companies when search query or tab changes
  useEffect(() => {
    if (companies.length > 0) {
      let filtered = [...companies];
      
      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter(company => 
          company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (company.industry && company.industry.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (company.location && company.location.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      
      // Apply tab filter
      if (activeTab === 'partner') {
        filtered = filtered.filter(company => company.is_partner);
      } else if (activeTab === 'non-partner') {
        filtered = filtered.filter(company => !company.is_partner);
      }
      
      setFilteredCompanies(filtered);
    }
  }, [companies, searchQuery, activeTab]);
  
  // Reset form for new company creation
  const resetCompanyForm = () => {
    setNewCompany({
      name: '',
      description: '',
      website: '',
      industry: '',
      location: '',
      is_partner: false
    });
    setEditingCompany(null);
  };
  
  // Open dialog for creating a new company
  const handleNewCompany = () => {
    resetCompanyForm();
    setCompanyDialogOpen(true);
  };
  
  // Open dialog for editing a company
  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setNewCompany({
      name: company.name,
      description: company.description || '',
      website: company.website || '',
      industry: company.industry || '',
      location: company.location || '',
      is_partner: company.is_partner
    });
    setCompanyDialogOpen(true);
  };
  
  // Handle saving a company (create or update)
  const handleSaveCompany = async () => {
    try {
      // Validate required fields
      if (!newCompany.name) {
        toast.error('Company name is required');
        return;
      }
      
      if (editingCompany) {
        // Update existing company
        const response = await fetch(`/api/companies?id=${editingCompany.company_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCompany),
        });
        
        const result = await response.json();
        
        if (response.ok) {
          toast.success('Company updated successfully');
          
          // Update the local state
          const updatedCompanies = companies.map(company => 
            company.company_id === editingCompany.company_id ? result.company : company
          );
          setCompanies(updatedCompanies);
          
          // Update selected company if it was the one edited
          if (selectedCompany && selectedCompany.company_id === editingCompany.company_id) {
            setSelectedCompany(result.company);
          }
        } else {
          toast.error(result.error || 'Failed to update company');
        }
      } else {
        // Create new company
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
          
          // Add the new company to the list
          setCompanies(prev => [...prev, result.company]);
          
          // Select the new company
          setSelectedCompany(result.company);
        } else {
          toast.error(result.error || 'Failed to create company');
        }
      }
      
      // Close the dialog and reset the form
      setCompanyDialogOpen(false);
      resetCompanyForm();
    } catch (error) {
      console.error('Error saving company:', error);
      toast.error('Failed to save company');
    }
  };
  
  return (
    <DashboardLayout isAdmin>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Companies</h1>
          <Button 
            onClick={handleNewCompany}
            className="flex items-center gap-2"
          >
            <PlusIcon size={16} />
            Add Company
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Company List */}
          <div className="col-span-1">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <div className="flex flex-col gap-4">
                  <CardTitle>Company Directory</CardTitle>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search companies..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="partner">Partner</TabsTrigger>
                      <TabsTrigger value="non-partner">Non-Partner</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent className="h-[calc(100vh-280px)] overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Loading companies...</p>
                  </div>
                ) : filteredCompanies.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <BuildingIcon className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No companies found</p>
                    <Button variant="link" onClick={handleNewCompany}>Add your first company</Button>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {filteredCompanies.map((company) => (
                      <li 
                        key={company.company_id}
                        className={`p-3 rounded-md cursor-pointer flex justify-between items-center hover:bg-gray-100 ${
                          selectedCompany?.company_id === company.company_id ? 'bg-blue-50 border border-blue-200' : ''
                        }`}
                        onClick={() => setSelectedCompany(company)}
                      >
                        <div className="flex items-center gap-3">
                          <BuildingIcon className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="font-medium">{company.name}</p>
                            <p className="text-sm text-muted-foreground">{company.industry || 'No industry'}</p>
                          </div>
                        </div>
                        {company.is_partner && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                            <StarIcon className="h-3 w-3 mr-1" />
                            Partner
                          </Badge>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Company Details */}
          <div className="col-span-1 md:col-span-2">
            <Card className="h-full">
              {selectedCompany ? (
                <>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{selectedCompany.name}</CardTitle>
                        <div className="flex items-center mt-1 text-muted-foreground">
                          {selectedCompany.is_partner ? (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 mr-2">
                              <StarIcon className="h-3 w-3 mr-1" />
                              Partner Company
                            </Badge>
                          ) : (
                            <span className="text-sm mr-2">Non-Partner Company</span>
                          )}
                          {selectedCompany.industry && (
                            <span className="text-sm">• {selectedCompany.industry}</span>
                          )}
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditCompany(selectedCompany)}
                      >
                        Edit
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Location</h3>
                          <p>{selectedCompany.location || 'Not specified'}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Website</h3>
                          {selectedCompany.website ? (
                            <a 
                              href={selectedCompany.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {selectedCompany.website}
                            </a>
                          ) : (
                            <p>Not specified</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                        <p className="whitespace-pre-line">{selectedCompany.description || 'No description provided'}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-md font-semibold mb-3">Related Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-4 rounded-md">
                            <div className="flex items-center gap-2 mb-2">
                              <Building2Icon className="h-5 w-5 text-blue-600" />
                              <h4 className="font-medium">Jobs</h4>
                            </div>
                            <p className="text-muted-foreground text-sm">
                              Job listings will be added here in the future
                            </p>
                          </div>
                          
                          {selectedCompany.is_partner && (
                            <div className="bg-gray-50 p-4 rounded-md">
                              <div className="flex items-center gap-2 mb-2">
                                <StarIcon className="h-5 w-5 text-blue-600" />
                                <h4 className="font-medium">Partnership</h4>
                              </div>
                              <p className="text-muted-foreground text-sm">
                                Partnership details will be shown here
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <BuildingIcon className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No Company Selected</p>
                  <p className="text-muted-foreground mb-4">Select a company from the list to view details</p>
                  <Button onClick={handleNewCompany}>Add New Company</Button>
                </div>
              )}
            </Card>
          </div>
        </div>
        
        {/* Company Form Dialog */}
        <Dialog open={companyDialogOpen} onOpenChange={setCompanyDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingCompany ? 'Edit Company' : 'Add New Company'}</DialogTitle>
              <DialogDescription>
                {editingCompany
                  ? 'Update company information in the system'
                  : 'Create a new company record in the system'
                }
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
                setCompanyDialogOpen(false);
                resetCompanyForm();
              }}>
                Cancel
              </Button>
              <Button onClick={handleSaveCompany}>
                {editingCompany ? 'Update' : 'Create'} Company
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}