"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/basic/card";
import { Button } from "@/components/ui/basic/button";
import { Input } from "@/components/ui/form/input";
import { Badge } from "@/components/ui/basic/badge";
import { partnerService, Partner } from "@/lib/partners-service";
import {
  Building,
  FileText,
  MapPin,
  Plus,
  Search,
  Users,
  Filter,
  Globe,
  Mail,
  Phone,
  Edit,
  Trash2,
  Calendar,
  User,
  Briefcase,
  UserCheck,
  ExternalLink,
  Building2,
  Edit2,
  Separator,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/basic/avatar";
import { extendedPalette } from "@/lib/colors";
import { MultiPurposeModal } from "@/components/ui/overlay/multi-purpose-modal";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs";
import { Label } from "@/components/ui/basic/label";
import { Textarea } from "@/components/ui/form/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/form/select";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/basic/button";

/**
 * Renders a stat card displaying a title, a statistic value, and an icon.
 *
 * When the component is in a loading state, a placeholder skeleton is shown instead of the value.
 *
 * @param title - The label for the stat card, displayed above the statistic.
 * @param value - The statistic to display, which can be a number or a string.
 * @param icon - The icon element rendered within a circular container.
 * @param isLoading - Indicates whether the statistic is loading, triggering the display of a skeleton.
 */
function StatCard({
  title,
  value,
  icon,
  isLoading,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  isLoading: boolean;
}) {
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
          <div className="rounded-full p-3 bg-gray-100">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to get partner color based on ID
function getPartnerColor(partner: Partner): string {
  const colorIndex = partner.partner_id % 5;
  const colors = [
    extendedPalette.primaryBlue,
    extendedPalette.primaryGreen,
    extendedPalette.teal,
    extendedPalette.primaryOrange,
    extendedPalette.brown,
  ];
  return colors[colorIndex];
}

/**
 * Renders a card displaying summary information for a partner organization.
 *
 * The card presents the partner's logo (or generated initials if no logo is provided), name, location,
 * industry, a brief description, and key statistics (jobs available, number of applicants, and success rate).
 * A colored accent is chosen based on the partner's identifier, and the card is visually highlighted when selected.
 *
 * @param partner - The partner details used to populate the card's content.
 * @param onSelect - Callback invoked with the partner object when the card is clicked.
 * @param isSelected - Optional flag indicating whether the card should be visually highlighted as selected.
 *
 * @returns The rendered partner card element.
 */
function PartnerCard({
  partner,
  onSelect,
  isSelected,
}: {
  partner: Partner;
  onSelect: (partner: Partner) => void;
  isSelected?: boolean;
}) {
  const color = getPartnerColor(partner);

  // Generate initials for avatar
  const initials = partner.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Calculate success rate
  const successRate =
    partner.applicants !== undefined && partner.applicants > 0
      ? Math.round(((partner.applicants_hired ?? 0) / partner.applicants) * 100)
      : 0;

  return (
    <Card
      className={cn(
        "cursor-pointer hover:bg-gray-50 transition-colors p-3 mb-3",
        {
          "bg-blue-50 border-blue-200": isSelected,
        }
      )}
      onClick={() => onSelect(partner)}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-12 w-12 rounded-md bg-gray-100">
          {partner.logo_url ? (
            <AvatarImage src={partner.logo_url} alt={partner.name} />
          ) : (
            <AvatarFallback
              className="rounded-md"
              style={{ backgroundColor: `${color}20`, color }}
            >
              {initials}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{partner.name}</h3>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-3 w-3 mr-1" />
            {partner.location}
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {partner.industry && (
              <Badge variant="outline" className="text-xs py-0 px-1.5">
                {partner.industry}
              </Badge>
            )}
            {partner.is_archived && (
              <Badge variant="outline" className="text-xs py-0 px-1.5 bg-gray-100">
                Archived
              </Badge>
            )}
          </div>
          
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <span>{partner.jobs_available || 0} jobs</span>
            <span>{partner.applicants || 0} applicants</span>
            <span>{successRate}% success</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

/**
 * Renders the detailed view for a partner organization.
 *
 * Displays comprehensive information including logo, industry, location, job statistics, and contact details. Also shows upcoming events and provides "Edit" and "Delete" actions via callbacks. If no partner is selected, a placeholder message is shown.
 *
 * @param partner The partner object to display, or null to indicate no selection.
 * @param onEdit Callback invoked when the user clicks the edit button.
 * @param onDelete Callback invoked when the user clicks the delete button.
 */

function PartnerDetails({
  partner,
  onEdit,
  onDelete,
}: {
  partner: Partner | null;
  onEdit: () => void;
  onDelete: () => void;
}) {
  if (!partner) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="rounded-full bg-gray-100 p-4 mb-4">
          <Building className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-medium mb-2">No Partner Selected</h3>
        <p className="text-gray-500 max-w-sm mb-4">
          Please select a partner organization from the list to view details
        </p>
      </div>
    );
  }

  const color = getPartnerColor(partner);

  // Mock upcoming events
  const events = [
    {
      id: 1,
      title: "Recruiting Workshop",
      date: new Date("2023-12-15"),
      type: "recruitment_event",
    },
    {
      id: 2,
      title: "Technical Interview Panel",
      date: new Date("2023-12-22"),
      type: "informational_session",
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header with colored border based on partner type */}
      <div 
        className="relative border-l-4 pl-4 py-2" 
        style={{ borderColor: color }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{partner.name}</h1>
            <div className="flex items-center gap-1 text-muted-foreground mt-1">
              <Building2 className="h-4 w-4" />
              <span className="font-medium">{partner.industry || "Organization"}</span>
              {partner.location && (
                <>
                  <span className="mx-1">•</span>
                  <MapPin className="h-4 w-4" />
                  <span>{partner.location}</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant="outline"
              className="px-2 py-1"
              style={{ 
                backgroundColor: `${color}15`,
                borderColor: `${color}30`,
                color: color 
              }}
            >
              {partner.industry || "Organization"}
            </Badge>
            
            {partner.jobs_available !== undefined && (
              <Badge 
                variant="outline" 
                className="px-2 py-1"
                style={{ 
                  backgroundColor: `${extendedPalette.primaryBlue}10`,
                  borderColor: `${extendedPalette.primaryBlue}20`,
                  color: extendedPalette.primaryBlue
                }}
              >
                <Briefcase className="mr-1 h-3 w-3" />
                {partner.jobs_available} {partner.jobs_available === 1 ? 'job' : 'jobs'}
              </Badge>
            )}
            
            {partner.is_archived && (
              <Badge 
                variant="outline" 
                className="px-2 py-1"
                style={{ 
                  backgroundColor: "#f1f1f1",
                  borderColor: "#e0e0e0",
                  color: "#666666"
                }}
              >
                Archived
              </Badge>
            )}
          </div>
        </div>
        
        {/* Partner Logo and details */}
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <div className="h-16 w-16 shrink-0 rounded-md border border-gray-200 flex items-center justify-center bg-white overflow-hidden">
            <Avatar className="h-full w-full rounded-md">
              {partner.logo_url ? (
                <AvatarImage src={partner.logo_url} alt={partner.name} />
              ) : (
                <AvatarFallback className="rounded-md" style={{ backgroundColor: `${color}20`, color }}>
                  {partner.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
          
          <div className="space-y-2 flex-1">
            {partner.website && (
              <div>
                <a
                  href={partner.website.startsWith("http") ? partner.website : `https://${partner.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5 mr-1" />
                  Visit company website
                </a>
              </div>
            )}
            
            {partner.partnership_start && (
              <div className="text-sm">
                <span className="font-medium">Partner since:</span> {new Date(partner.partnership_start).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 my-6">
        <Button 
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={onEdit}
          style={{ borderColor: color, color }}
        >
          <Edit2 className="h-4 w-4" /> Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" /> Delete
        </Button>
        {partner.website && (
          <a
            href={partner.website.startsWith("http") ? partner.website : `https://${partner.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "flex items-center gap-1"
            )}
            style={{ borderColor: color, color }}
          >
            <ExternalLink className="h-4 w-4" /> Website
          </a>
        )}
      </div>

      <Separator style={{ backgroundColor: `${color}20` }} />

      {/* Partner Description */}
      {partner.description && (
        <div>
          <h2 className="text-lg font-semibold mb-2">About</h2>
          <div className="text-sm text-muted-foreground whitespace-pre-line">
            {partner.description}
          </div>
        </div>
      )}

      {/* Partner Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Available Jobs</p>
              <p className="text-2xl font-bold" style={{ color }}>
                {partner.jobs_available || 0}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Applicants</p>
              <p className="text-2xl font-bold" style={{ color }}>
                {partner.applicants || 0}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Hired</p>
              <p className="text-2xl font-bold" style={{ color }}>
                {partner.applicants_hired || 0}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Contact Information</h2>
        <Card>
          <CardContent className="p-4">
            {partner.contact_name ? (
              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-500 mr-2" />
                  <span>{partner.contact_name}</span>
                </div>
                {partner.contact_email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-500 mr-2" />
                    <a
                      href={`mailto:${partner.contact_email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {partner.contact_email}
                    </a>
                  </div>
                )}
                {partner.contact_phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-500 mr-2" />
                    <span>{partner.contact_phone}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <User className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p>No contact information available</p>
                <Button onClick={onEdit} variant="link" className="mt-1">
                  Add contact
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Upcoming Events</h2>
          <Button size="sm" variant="outline" style={{ borderColor: color, color }}>
            View All
          </Button>
        </div>
        {events.length > 0 ? (
          <div className="space-y-3">
            {events.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <div className="flex items-center mt-1 text-gray-500 text-sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{event.date.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="ml-2"
                      style={{ color, borderColor: color }}
                    >
                      {event.type.replace("_", " ")}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-4 text-center text-gray-500">
              <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-2" />
              <p>No upcoming events</p>
              <Button variant="link" className="mt-1">
                Schedule an event
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

/**
 * Renders the partner management dashboard.
 *
 * This component loads partner data from local storage or uses example data if none exist. It displays overall
 * statistics, a searchable and filterable list of partner organizations, and detailed information for a selected partner.
 * Users can create, edit, and delete partners through integrated modals.
 */
export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [createPartnerModalOpen, setCreatePartnerModalOpen] = useState(false);
  const [editPartnerModalOpen, setEditPartnerModalOpen] = useState(false);
  const [deletePartnerModalOpen, setDeletePartnerModalOpen] = useState(false);

  // New partner state
  const [newPartner, setNewPartner] = useState<Partial<Partner>>({
    name: "",
    description: "",
    industry: "",
    location: "",
    jobs_available: 0,
    applicants: 0,
    applicants_hired: 0,
    status: "active",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    website: "",
  });

  // Industry options for select
  const industryOptions = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Government",
    "Manufacturing",
    "Retail",
    "Transportation",
    "Nonprofit",
  ];

  useEffect(() => {
    const loadPartners = async () => {
      setIsLoading(true);

      // Example partner data if none exists in API
      const examplePartners: Partner[] = [
        {
          partner_id: 1,
          name: "Tech Innovators",
          description:
            "A leading technology company focused on web development and AI solutions. We partner with educational institutions to provide internship opportunities for students interested in software development.",
          industry: "Technology",
          location: "Philadelphia, PA",
          jobs_available: 8,
          applicants: 24,
          applicants_hired: 5,
          contact_name: "Sarah Johnson",
          contact_email: "sjohnson@techinnovators.com",
          contact_phone: "(215) 555-1234",
          website: "techinnovators.com",
          partnership_start: "2021-03-15",
          status: "active",
        },
        {
          partner_id: 2,
          name: "Creative Solutions",
          description:
            "Digital design and creative agency specializing in UX/UI design. Our internship program gives students hands-on experience with real client projects.",
          industry: "Design",
          location: "Philadelphia, PA",
          jobs_available: 4,
          applicants: 16,
          applicants_hired: 3,
          contact_name: "Michael Chen",
          contact_email: "mchen@creativesolutions.com",
          contact_phone: "(215) 555-5678",
          website: "creativesolutions.co",
          partnership_start: "2020-11-01",
          status: "active",
        },
        {
          partner_id: 3,
          name: "DataWorks",
          description:
            "Data analytics and machine learning services for businesses. We offer specialized internships in data science and analysis for advanced students.",
          industry: "Data Science",
          location: "King of Prussia, PA",
          jobs_available: 6,
          applicants: 18,
          applicants_hired: 2,
          contact_name: "Alicia Rodriguez",
          contact_email: "arodriguez@dataworks.io",
          contact_phone: "(610) 555-9876",
          website: "dataworks.io",
          partnership_start: "2022-01-10",
          status: "active",
        },
        {
          partner_id: 4,
          name: "SaaS Solutions",
          description:
            "Cloud-based software solutions for small and medium businesses. Our internship program focuses on cloud infrastructure and DevOps practices.",
          industry: "Software",
          location: "Philadelphia, PA",
          jobs_available: 5,
          applicants: 15,
          applicants_hired: 4,
          website: "saassolutions.net",
          status: "active",
        },
        {
          partner_id: 5,
          name: "Netsoft",
          description:
            "Network security and infrastructure management. We provide specialized training in cybersecurity for interested students.",
          industry: "Cybersecurity",
          location: "Cherry Hill, NJ",
          jobs_available: 3,
          applicants: 9,
          applicants_hired: 1,
          contact_name: "David Williams",
          contact_email: "dwilliams@netsoft.com",
          partnership_start: "2021-08-22",
          status: "archived",
        },
        {
          partner_id: 6,
          name: "Digital Health",
          description:
            "Healthcare technology solutions and medical software development. We focus on improving patient care through innovative tech solutions.",
          industry: "Healthcare IT",
          location: "Philadelphia, PA",
          jobs_available: 7,
          applicants: 12,
          applicants_hired: 2,
          website: "digitalhealth.med",
          status: "active",
        },
        {
          partner_id: 7,
          name: "EdTech Pioneers",
          description:
            "Educational technology and e-learning platform development. We're revolutionizing how students learn through cutting-edge technology.",
          industry: "Education",
          location: "Camden, NJ",
          jobs_available: 4,
          applicants: 10,
          applicants_hired: 2,
          contact_name: "Jennifer Lee",
          contact_email: "jlee@edtechpioneers.edu",
          contact_phone: "(856) 555-1122",
          status: "archived",
        },
        {
          partner_id: 8,
          name: "FinTech Solutions",
          description:
            "Financial technology applications and payment processing systems. We're making finance accessible and understandable for everyone.",
          industry: "Finance",
          location: "Philadelphia, PA",
          jobs_available: 5,
          applicants: 14,
          applicants_hired: 3,
          website: "fintechsolutions.com",
          status: "active",
        },
      ];

      // Try to load partners from API
      try {
        const loadedPartners = await partnerService.getAll();
        
        // If no partners found in API, use example data
        if (loadedPartners.length === 0) {
          // Save example partners to API
          for (const partner of examplePartners) {
            try {
              await partnerService.create({
                name: partner.name,
                description: partner.description,
                industry: partner.industry,
                location: partner.location,
                jobs_available: partner.jobs_available,
                applicants: partner.applicants,
                applicants_hired: partner.applicants_hired,
                status: partner.status,
                contact_name: partner.contact_name,
                contact_email: partner.contact_email,
                contact_phone: partner.contact_phone,
                website: partner.website,
                partnership_start: partner.partnership_start,
              });
            } catch (err) {
              console.error("Error creating example partner:", err);
            }
          }
          
          // Load partners again after creating examples
          const newlyLoadedPartners = await partnerService.getAll();
          setPartners(newlyLoadedPartners);
        } else {
          setPartners(loadedPartners);
        }
        
        // Set the first partner as selected by default if none is selected
        if (loadedPartners.length > 0 && !selectedPartner) {
          setSelectedPartner(loadedPartners[0]);
        }
      } catch (error) {
        console.error("Error loading partners:", error);
        // Use example data as fallback
        setPartners(examplePartners);
        if (examplePartners.length > 0 && !selectedPartner) {
          setSelectedPartner(examplePartners[0]);
        }
      }

      setIsLoading(false);
    };

    loadPartners();
  }, [selectedPartner]);

  // Filter partners based on search query and active tab
  const filteredPartners = partners.filter((partner: Partner) => {
    // Apply tab filter
    if (activeTab !== "all" && activeTab === "archived") {
      return partner.is_archived === true;
    } else if (activeTab !== "all" && activeTab === "active") {
      return partner.is_archived !== true;
    }

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        partner.name.toLowerCase().includes(query) ||
        (partner.industry ? partner.industry.toLowerCase().includes(query) : false) ||
        (partner.location ? partner.location.toLowerCase().includes(query) : false) ||
        (partner.description ? partner.description.toLowerCase().includes(query) : false)
      );
    }

    return true;
  });

  // Create new partner
  const handleCreatePartner = () => {
    // Validate form
    if (!newPartner.name || !newPartner.industry || !newPartner.location || !newPartner.description) {
      // Show error
      return;
    }

    // Create new partner
    const createPartnerAsync = async () => {
      try {
        const createdPartner = await partnerService.create({
          name: newPartner.name || "",
          description: newPartner.description,
          industry: newPartner.industry,
          location: newPartner.location,
          jobs_available: newPartner.jobs_available || 0,
          applicants: newPartner.applicants || 0,
          applicants_hired: newPartner.applicants_hired || 0,
          status: newPartner.status as 'active' | 'archived',
          contact_name: newPartner.contact_name,
          contact_email: newPartner.contact_email,
          contact_phone: newPartner.contact_phone,
          website: newPartner.website,
        });

        if (createdPartner) {
          // Update partners list
          setPartners(prevPartners => [...prevPartners, createdPartner]);
          setSelectedPartner(createdPartner);
          setCreatePartnerModalOpen(false);
          
          // Reset form
          setNewPartner({
            name: "",
            description: "",
            industry: "",
            location: "",
            jobs_available: 0,
            applicants: 0,
            applicants_hired: 0,
            status: "active",
            contact_name: "",
            contact_email: "",
            contact_phone: "",
            website: "",
          });
        }
      } catch (error) {
        console.error("Error creating partner:", error);
      }
    };
    
    createPartnerAsync();
  };

  // Edit partner
  const handleEditPartner = () => {
    // Validate form
    if (!newPartner.name || !newPartner.industry || !newPartner.location || !newPartner.description) {
      // Show error
      return;
    }

    if (!selectedPartner) return;

    // Update partner
    const updatePartnerAsync = async () => {
      try {
        const updatedPartner = await partnerService.update(selectedPartner.partner_id, {
          name: newPartner.name,
          description: newPartner.description,
          industry: newPartner.industry,
          location: newPartner.location,
          jobs_available: newPartner.jobs_available,
          applicants: newPartner.applicants,
          applicants_hired: newPartner.applicants_hired,
          status: newPartner.status as 'active' | 'archived',
          contact_name: newPartner.contact_name,
          contact_email: newPartner.contact_email,
          contact_phone: newPartner.contact_phone,
          website: newPartner.website,
        });

        if (updatedPartner) {
          // Update partners list
          setPartners(prevPartners =>
            prevPartners.map(p =>
              p.partner_id === updatedPartner.partner_id ? updatedPartner : p
            )
          );
          
          // Update selected partner
          setSelectedPartner(updatedPartner);
          setEditPartnerModalOpen(false);
        }
      } catch (error) {
        console.error("Error updating partner:", error);
      }
    };
    
    updatePartnerAsync();
  };

  // Delete partner
  const handleDeletePartner = () => {
    if (!selectedPartner) return;

    // Delete partner
    const deletePartnerAsync = async () => {
      try {
        const success = await partnerService.delete(selectedPartner.partner_id);
        
        if (success) {
          // Remove partner from list
          setPartners(prevPartners =>
            prevPartners.filter(p => p.partner_id !== selectedPartner.partner_id)
          );
          
          // Select a different partner
          const remainingPartner = partners.find(p => p.partner_id !== selectedPartner.partner_id);
          setSelectedPartner(remainingPartner || null);
          setDeletePartnerModalOpen(false);
        }
      } catch (error) {
        console.error("Error deleting partner:", error);
      }
    };
    
    deletePartnerAsync();
  };

  // Open edit modal and initialize form with selected partner data
  const openEditModal = () => {
    if (!selectedPartner) return;

    setNewPartner({
      name: selectedPartner.name,
      description: selectedPartner.description,
      industry: selectedPartner.industry,
      location: selectedPartner.location,
      jobs_available: selectedPartner.jobs_available,
      applicants: selectedPartner.applicants,
      applicants_hired: selectedPartner.applicants_hired,
      status: selectedPartner.status,
      contact_name: selectedPartner.contact_name || "",
      contact_email: selectedPartner.contact_email || "",
      contact_phone: selectedPartner.contact_phone || "",
      website: selectedPartner.website || "",
    });

    setEditPartnerModalOpen(true);
  };

  return (
    <DashboardLayout isAdmin>
      <div className="container py-6 px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: extendedPalette.primaryBlue }}
            >
              Partner Organizations
            </h1>
            <p className="text-gray-500 mt-1">
              Manage Philadelphia tech employer relationships and collaborations
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search partners..."
                className="pl-9 w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => {
                setNewPartner({
                  name: "",
                  description: "",
                  industry: "",
                  location: "",
                  jobs_available: 0,
                  applicants: 0,
                  applicants_hired: 0,
                  status: "active",
                  contact_name: "",
                  contact_email: "",
                  contact_phone: "",
                  website: "",
                });
                setCreatePartnerModalOpen(true);
              }}
              style={{ borderColor: extendedPalette.primaryBlue }}
            >
              <Plus className="h-4 w-4" /> Add Partner
            </Button>
          </div>
        </div>

        {/* Tabs for filtering partners by status */}
        <Tabs defaultValue="all" onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Partner List Column */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="max-h-[calc(100vh-260px)] overflow-hidden flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle>Partner Organizations</CardTitle>
                <CardDescription>
                  {filteredPartners.length} {filteredPartners.length === 1 ? 'partner' : 'partners'} found
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 flex-1 overflow-auto">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="animate-pulse mb-3">
                      <div className="h-1 w-full bg-gray-200"></div>
                      <CardHeader className="pb-2">
                        <div className="flex items-start gap-3">
                          <div className="h-12 w-12 rounded-md bg-gray-200"></div>
                          <div className="space-y-2 flex-1">
                            <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
                            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 w-full bg-gray-200 rounded mb-1"></div>
                        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                      </CardContent>
                      <CardFooter>
                        <div className="grid grid-cols-3 gap-2 w-full">
                          <div className="h-8 bg-gray-200 rounded"></div>
                          <div className="h-8 bg-gray-200 rounded"></div>
                          <div className="h-8 bg-gray-200 rounded"></div>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                ) : filteredPartners.length > 0 ? (
                  filteredPartners.map((partner) => (
                    <PartnerCard
                      key={partner.partner_id}
                      partner={partner}
                      onSelect={setSelectedPartner}
                      isSelected={
                        selectedPartner?.partner_id === partner.partner_id
                      }
                    />
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-12">
                    <Building className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No partners found
                    </h3>
                    <p className="text-gray-500 text-center max-w-md mb-4">
                      {searchQuery
                        ? `No partners matching "${searchQuery}"`
                        : "There are no partner organizations in this category."}
                    </p>
                    <Button
                      className="gap-1"
                      style={{ backgroundColor: extendedPalette.primaryBlue }}
                      onClick={() => setCreatePartnerModalOpen(true)}
                    >
                      <Plus className="h-4 w-4" /> Add Partner
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Partner Details Column */}
          <Card className="lg:col-span-2 max-h-[calc(100vh-260px)] overflow-auto">
            <PartnerDetails
              partner={selectedPartner}
              onEdit={openEditModal}
              onDelete={() => setDeletePartnerModalOpen(true)}
            />
          </Card>
        </div>
      </div>

      {/* Create Partner Modal */}
      <MultiPurposeModal
        open={createPartnerModalOpen}
        onOpenChange={setCreatePartnerModalOpen}
        title="Add New Partner"
        description="Create a new partner organization for job listings and tracking"
        size="lg"
      >
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name *</Label>
              <Input
                id="name"
                placeholder="Enter organization name"
                value={newPartner.name || ""}
                onChange={(e) =>
                  setNewPartner({ ...newPartner, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry *</Label>
              <Select
                value={newPartner.industry || ""}
                onValueChange={(value) =>
                  setNewPartner({ ...newPartner, industry: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industryOptions.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="City, State"
                value={newPartner.location || ""}
                onChange={(e) =>
                  setNewPartner({ ...newPartner, location: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="www.example.com"
                value={newPartner.website || ""}
                onChange={(e) =>
                  setNewPartner({ ...newPartner, website: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the organization and partnership"
              rows={4}
              value={newPartner.description || ""}
              onChange={(e) =>
                setNewPartner({ ...newPartner, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_name">Contact Name</Label>
              <Input
                id="contact_name"
                placeholder="Primary contact"
                value={newPartner.contact_name || ""}
                onChange={(e) =>
                  setNewPartner({ ...newPartner, contact_name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                type="email"
                placeholder="email@example.com"
                value={newPartner.contact_email || ""}
                onChange={(e) =>
                  setNewPartner({
                    ...newPartner,
                    contact_email: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_phone">Contact Phone</Label>
              <Input
                id="contact_phone"
                placeholder="(123) 456-7890"
                value={newPartner.contact_phone || ""}
                onChange={(e) =>
                  setNewPartner({
                    ...newPartner,
                    contact_phone: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobs_available">Open Positions</Label>
              <Input
                id="jobs_available"
                type="number"
                min="0"
                value={newPartner.jobs_available || 0}
                onChange={(e) =>
                  setNewPartner({
                    ...newPartner,
                    jobs_available: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Partnership Status</Label>
              <Select
                value={newPartner.status || "active"}
                onValueChange={(value: "active" | "archived") =>
                  setNewPartner({ ...newPartner, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setCreatePartnerModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreatePartner}
            style={{ backgroundColor: extendedPalette.primaryBlue }}
          >
            Create Partner
          </Button>
        </div>
      </MultiPurposeModal>

      {/* Edit Partner Modal */}
      <MultiPurposeModal
        open={editPartnerModalOpen}
        onOpenChange={setEditPartnerModalOpen}
        title="Edit Partner"
        description="Update partner organization details"
        size="lg"
      >
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Organization Name *</Label>
              <Input
                id="edit-name"
                placeholder="Enter organization name"
                value={newPartner.name || ""}
                onChange={(e) =>
                  setNewPartner({ ...newPartner, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-industry">Industry *</Label>
              <Select
                value={newPartner.industry || ""}
                onValueChange={(value) =>
                  setNewPartner({ ...newPartner, industry: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industryOptions.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location *</Label>
              <Input
                id="edit-location"
                placeholder="City, State"
                value={newPartner.location || ""}
                onChange={(e) =>
                  setNewPartner({ ...newPartner, location: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-website">Website</Label>
              <Input
                id="edit-website"
                placeholder="www.example.com"
                value={newPartner.website || ""}
                onChange={(e) =>
                  setNewPartner({ ...newPartner, website: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description *</Label>
            <Textarea
              id="edit-description"
              placeholder="Describe the organization and partnership"
              rows={4}
              value={newPartner.description || ""}
              onChange={(e) =>
                setNewPartner({ ...newPartner, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-contact_name">Contact Name</Label>
              <Input
                id="edit-contact_name"
                placeholder="Primary contact"
                value={newPartner.contact_name || ""}
                onChange={(e) =>
                  setNewPartner({ ...newPartner, contact_name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-contact_email">Contact Email</Label>
              <Input
                id="edit-contact_email"
                type="email"
                placeholder="email@example.com"
                value={newPartner.contact_email || ""}
                onChange={(e) =>
                  setNewPartner({
                    ...newPartner,
                    contact_email: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-contact_phone">Contact Phone</Label>
              <Input
                id="edit-contact_phone"
                placeholder="(123) 456-7890"
                value={newPartner.contact_phone || ""}
                onChange={(e) =>
                  setNewPartner({
                    ...newPartner,
                    contact_phone: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-jobs_available">Open Positions</Label>
              <Input
                id="edit-jobs_available"
                type="number"
                min="0"
                value={newPartner.jobs_available || 0}
                onChange={(e) =>
                  setNewPartner({
                    ...newPartner,
                    jobs_available: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status">Partnership Status</Label>
              <Select
                value={newPartner.status || "active"}
                onValueChange={(value: "active" | "archived") =>
                  setNewPartner({ ...newPartner, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setEditPartnerModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditPartner}
            style={{ backgroundColor: extendedPalette.primaryBlue }}
          >
            Save Changes
          </Button>
        </div>
      </MultiPurposeModal>

      {/* Delete Confirmation Modal */}
      <MultiPurposeModal
        open={deletePartnerModalOpen}
        onOpenChange={setDeletePartnerModalOpen}
        title="Delete Partner"
        description="Are you sure you want to delete this partner? This action cannot be undone."
        size="sm"
      >
        {selectedPartner && (
          <div className="py-4">
            <p className="mb-4 text-gray-600">
              This will remove <strong>{selectedPartner.name}</strong> and all
              associated data from the system.
            </p>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeletePartnerModalOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeletePartner}>
                Delete Partner
              </Button>
            </div>
          </div>
        )}
      </MultiPurposeModal>
    </DashboardLayout>
  );
}