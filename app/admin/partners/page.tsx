"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { partnerService, Partner } from "@/lib/local-storage"
import { Building, FileText, MapPin, Plus, Search, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { extendedPalette } from "@/lib/colors"

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Example partner data if none exists in localStorage
  const examplePartners: Partner[] = [
    {
      partner_id: 1,
      name: "Tech Innovators",
      description: "A leading technology company focused on web development and AI solutions",
      industry: "Technology",
      location: "Philadelphia, PA",
      jobs_available: 8,
      applicants: 24,
      applicants_hired: 5
    },
    {
      partner_id: 2,
      name: "Creative Solutions",
      description: "Digital design and creative agency specializing in UX/UI design",
      industry: "Design",
      location: "Philadelphia, PA",
      jobs_available: 4,
      applicants: 16,
      applicants_hired: 3
    },
    {
      partner_id: 3,
      name: "DataWorks",
      description: "Data analytics and machine learning services for businesses",
      industry: "Data Science",
      location: "King of Prussia, PA",
      jobs_available: 6,
      applicants: 18,
      applicants_hired: 2
    },
    {
      partner_id: 4,
      name: "SaaS Solutions",
      description: "Cloud-based software solutions for small and medium businesses",
      industry: "Software",
      location: "Philadelphia, PA",
      jobs_available: 5,
      applicants: 15,
      applicants_hired: 4
    },
    {
      partner_id: 5,
      name: "Netsoft",
      description: "Network security and infrastructure management",
      industry: "Cybersecurity",
      location: "Cherry Hill, NJ",
      jobs_available: 3,
      applicants: 9,
      applicants_hired: 1
    },
    {
      partner_id: 6,
      name: "Digital Health",
      description: "Healthcare technology solutions and medical software development",
      industry: "Healthcare IT",
      location: "Philadelphia, PA",
      jobs_available: 7,
      applicants: 12,
      applicants_hired: 2
    },
    {
      partner_id: 7,
      name: "EdTech Pioneers",
      description: "Educational technology and e-learning platform development",
      industry: "Education",
      location: "Camden, NJ",
      jobs_available: 4,
      applicants: 10,
      applicants_hired: 2
    },
    {
      partner_id: 8,
      name: "FinTech Solutions",
      description: "Financial technology applications and payment processing systems",
      industry: "Finance",
      location: "Philadelphia, PA",
      jobs_available: 5,
      applicants: 14,
      applicants_hired: 3
    }
  ];

  useEffect(() => {
    const loadPartners = async () => {
      setIsLoading(true);
      
      // Try to load partners from localStorage
      let loadedPartners: Partner[] = [];
      
      if (partnerService) {
        loadedPartners = partnerService.getAll();
      }
      
      // If no partners found in localStorage, use example data
      if (loadedPartners.length === 0) {
        loadedPartners = examplePartners;
        
        // Save example partners to localStorage if partnerService exists
        if (partnerService) {
          examplePartners.forEach(partner => {
            partnerService.create({
              name: partner.name,
              description: partner.description,
              industry: partner.industry,
              location: partner.location,
              jobs_available: partner.jobs_available,
              applicants: partner.applicants,
              applicants_hired: partner.applicants_hired
            });
          });
        }
      }
      
      setPartners(loadedPartners);
      setIsLoading(false);
    };
    
    loadPartners();
  }, []);

  // Filter partners based on search query
  const filteredPartners = searchQuery
    ? partners.filter(
        partner =>
          partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          partner.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
          partner.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          partner.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : partners;

  return (
    <DashboardLayout isAdmin>
      <div className="container py-6 px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Partner Organizations</h1>
            <p className="text-gray-500 mt-1">Manage employer partnerships and collaborations</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search partners..."
                className="pl-8 w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="gap-1" style={{ backgroundColor: extendedPalette.primaryBlue }}>
              <Plus className="h-4 w-4" /> Add Partner
            </Button>
          </div>
        </div>
        
        {/* Partner Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Partners"
            value={partners.length}
            icon={<Building className="h-5 w-5" style={{ color: extendedPalette.primaryBlue }} />}
            isLoading={isLoading}
          />
          <StatCard
            title="Active Jobs"
            value={partners.reduce((sum, partner) => sum + partner.jobs_available, 0)}
            icon={<FileText className="h-5 w-5" style={{ color: extendedPalette.primaryGreen }} />}
            isLoading={isLoading}
          />
          <StatCard
            title="Total Applicants"
            value={partners.reduce((sum, partner) => sum + partner.applicants, 0)}
            icon={<Users className="h-5 w-5" style={{ color: extendedPalette.teal }} />}
            isLoading={isLoading}
          />
          <StatCard
            title="Placements"
            value={partners.reduce((sum, partner) => sum + partner.applicants_hired, 0)}
            icon={<Users className="h-5 w-5" style={{ color: extendedPalette.primaryOrange }} />}
            isLoading={isLoading}
          />
        </div>
        
        {/* Partners List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="border rounded-lg overflow-hidden">
                <div className="h-2 w-full bg-gray-200 animate-pulse"></div>
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-md bg-gray-200 animate-pulse"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                </CardContent>
                <CardFooter>
                  <div className="grid grid-cols-3 gap-2 w-full">
                    <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : filteredPartners.length > 0 ? (
            filteredPartners.map((partner) => (
              <PartnerCard
                key={partner.partner_id}
                partner={partner}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <Building className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">No partners found</h3>
              <p className="text-gray-500 text-center max-w-md mb-4">
                {searchQuery
                  ? `No partners matching "${searchQuery}"`
                  : "There are no partner organizations added yet."}
              </p>
              <Button className="gap-1" style={{ backgroundColor: extendedPalette.primaryBlue }}>
                <Plus className="h-4 w-4" /> Add Partner
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

function StatCard({ title, value, icon, isLoading }: { title: string; value: number; icon: React.ReactNode; isLoading: boolean }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            {isLoading ? (
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
            ) : (
              <p className="text-2xl font-bold mt-1">{value}</p>
            )}
          </div>
          <div className="rounded-full p-2 bg-gray-100">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PartnerCard({ partner }: { partner: Partner }) {
  // Generate color based on partner_id for consistent but varied colors
  const colorIndex = partner.partner_id % 5;
  const colors = [
    extendedPalette.primaryBlue,
    extendedPalette.primaryGreen, 
    extendedPalette.teal,
    extendedPalette.primaryOrange,
    extendedPalette.brown
  ];
  const color = colors[colorIndex];
  
  // Generate initials for avatar
  const initials = partner.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  return (
    <Card className="border rounded-lg overflow-hidden">
      <div className="h-1 w-full" style={{ backgroundColor: color }}></div>
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 rounded-md bg-gray-100">
            <AvatarFallback style={{ backgroundColor: `${color}20`, color }}>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg font-medium">{partner.name}</CardTitle>
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-3 w-3 mr-1" />
              {partner.location}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <Badge className="mb-2" style={{ backgroundColor: `${color}20`, color }}>
          {partner.industry}
        </Badge>
        <p className="text-sm text-gray-500 line-clamp-2">{partner.description}</p>
      </CardContent>
      <CardFooter>
        <div className="grid grid-cols-3 gap-2 w-full text-center">
          <div>
            <p className="text-xs text-gray-500">Jobs</p>
            <p className="font-bold" style={{ color }}>{partner.jobs_available}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Applicants</p>
            <p className="font-bold" style={{ color }}>{partner.applicants}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Hired</p>
            <p className="font-bold" style={{ color }}>{partner.applicants_hired}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
} 