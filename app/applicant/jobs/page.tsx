"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent } from "@/components/ui/basic/card";
import { Button } from "@/components/ui/basic/button";
import { Input } from "@/components/ui/form/input";
import { Badge } from "@/components/ui/basic/badge";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle2,
} from "lucide-react";
import { MultiPurposeModal } from "@/components/ui/overlay/multi-purpose-modal";
import { cn } from "@/lib/utils";
import { JobFilters } from "@/components/job-filters";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  postedDate: string;
}

interface JobFilters {
  jobTypes: string[];
  locations: string[];
  remoteOnly: boolean;
  salary: [number, number];
  experienceLevel: string;
  keywords: string;
}

const jobs: Job[] = [
  {
    id: "1",
    title: "Frontend Developer",
    company: "Tech Co",
    location: "Remote",
    type: "Full-time",
    description:
      "We are looking for a skilled Frontend Developer to join our team. You will be responsible for building user interfaces and implementing designs.",
    requirements: [
      "3+ years of experience with React",
      "Strong knowledge of HTML, CSS, and JavaScript",
      "Experience with responsive design",
      "Familiarity with modern frontend tools",
    ],
    postedDate: "2 days ago",
    salary: "$80k - $120k",
  },
  {
    id: "2",
    title: "Backend Engineer",
    company: "Software Inc",
    location: "New York",
    type: "Full-time",
    description:
      "Join our engineering team to build scalable backend systems for our growing platform.",
    requirements: [
      "Experience with Node.js or Python",
      "Knowledge of database systems",
      "Experience with API design",
      "Understanding of cloud infrastructure",
    ],
    postedDate: "1 week ago",
    salary: "$90k - $130k",
  },
  {
    id: "3",
    title: "Full Stack Developer",
    company: "Web Solutions",
    location: "San Francisco",
    type: "Contract",
    description:
      "Looking for a versatile developer who can work on both frontend and backend technologies.",
    requirements: [
      "Experience with modern JavaScript frameworks",
      "Knowledge of backend technologies",
      "Database experience",
      "Good communication skills",
    ],
    postedDate: "3 days ago",
    salary: "$100k - $140k",
  },
  {
    id: "4",
    title: "UI/UX Designer",
    company: "Design Studio",
    location: "Remote",
    type: "Part-time",
    description:
      "Join our creative team to design beautiful and functional user interfaces.",
    requirements: [
      "Portfolio of design work",
      "Experience with Figma or similar tools",
      "Understanding of user-centered design",
      "Ability to collaborate with developers",
    ],
    postedDate: "5 days ago",
    salary: "$70k - $90k",
  },
  {
    id: "5",
    title: "DevOps Engineer",
    company: "Cloud Systems",
    location: "Seattle",
    type: "Full-time",
    description:
      "Help us build and maintain our cloud infrastructure and deployment pipelines.",
    requirements: [
      "Experience with AWS or Azure",
      "Knowledge of CI/CD practices",
      "Containerization experience",
      "Infrastructure as code",
    ],
    postedDate: "2 weeks ago",
    salary: "$95k - $135k",
  },
  {
    id: "6",
    title: "Product Manager",
    company: "Product Co",
    location: "Boston",
    type: "Full-time",
    description:
      "Lead product strategy and development for our growing suite of applications.",
    requirements: [
      "3+ years in product management",
      "Experience with agile methodologies",
      "Strong analytical skills",
      "Excellent communication",
    ],
    postedDate: "1 month ago",
    salary: "$110k - $150k",
  },
];

/**
 * Renders an interactive job listings interface for applicants.
 *
 * This component provides a complete UI for searching, filtering, selecting, and applying to job positions.
 * It displays a list of available jobs with lazy-loading via a "Load More Jobs" button, showcases job details,
 * and manages two modals: one for applying filters and another for submitting job applications.
 *
 * The component maintains internal state for search queries, filter settings, job selection, form inputs,
 * and application submission status.
 *
 * @example
 * <ApplicantJobListings />
 */
export default function ApplicantJobListings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(jobs[0]);
  const [activeFilters, setActiveFilters] = useState<JobFilters>({
    jobTypes: [],
    locations: [],
    remoteOnly: false,
    salary: [0, 200] as [number, number],
    experienceLevel: "any",
    keywords: "",
  });
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [visibleJobCount, setVisibleJobCount] = useState(3); // Number of jobs to display initially

  // Handle applying filters
  const handleApplyFilters = (filters: JobFilters) => {
    // For development only
    if (process.env.NODE_ENV === "development") {
      // console.log('Applying filters:', filters);
    }
    setActiveFilters(filters);
    setFilterModalOpen(false);
  };

  // Function to open the filter modal
  const openFilterModal = () => {
    setFilterModalOpen(true);
  };

  // Function to select a job
  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
  };

  // Function to open application modal
  const openApplicationModal = () => {
    setApplicationModalOpen(true);
    setApplicationSubmitted(false);
  };

  // Function to handle application submission
  const handleApplicationSubmit = () => {
    // For development only
    if (process.env.NODE_ENV === "development") {
      // console.log("Application submitted:", { name, email, phone, coverLetter });
    }
    // Here you would typically send the data to your backend
    setApplicationSubmitted(true);
    // Don't close the modal yet, show success message first
  };

  // Filter jobs by search query and active filters
  const filteredJobs = jobs.filter((job) => {
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesQuery =
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.location?.toLowerCase().includes(query) ||
        job.type?.toLowerCase().includes(query) ||
        job.description?.toLowerCase().includes(query);

      if (!matchesQuery) return false;
    }

    // Filter by job type
    if (activeFilters.jobTypes.length > 0) {
      const jobType = job.type?.toLowerCase().replace("-", "_");
      if (
        !jobType ||
        !activeFilters.jobTypes.some((type) => jobType.includes(type))
      ) {
        return false;
      }
    }

    // Filter by location
    if (activeFilters.locations.length > 0) {
      const jobLocation = job.location?.toLowerCase();

      // Handle remote only filter
      if (activeFilters.remoteOnly && !jobLocation?.includes("remote")) {
        return false;
      }

      // If locations are selected and not remote only, check if job location matches any selected locations
      if (
        !activeFilters.remoteOnly &&
        !activeFilters.locations.some((location) =>
          jobLocation?.includes(location.replace("_", " ")),
        )
      ) {
        return false;
      }
    } else if (activeFilters.remoteOnly) {
      // If only remote is selected
      const jobLocation = job.location?.toLowerCase();
      if (!jobLocation?.includes("remote")) {
        return false;
      }
    }

    return true;
  });

  // Handle loading more jobs
  const handleLoadMore = () => {
    setVisibleJobCount((prev) => prev + 3); // Increase the number of visible jobs
  };

  return (
    <DashboardLayout>
      <div className="container py-6 px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground/90">
              Job Listings
            </h1>
            <p className="text-muted-foreground/80 mt-1">
              Browse and apply for available positions
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 shadow-sm hover:shadow-md transition-shadow"
              onClick={openFilterModal}
            >
              <Filter className="h-4 w-4" />
              Filter Jobs
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
              <Input
                placeholder="Search jobs..."
                className="pl-9 bg-muted/50 border-border/50 shadow-sm focus:shadow-md transition-shadow"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              {filteredJobs.slice(0, visibleJobCount).map((job) => (
                <Card
                  key={job.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    selectedJob?.id === job.id
                      ? "border-primary shadow-md"
                      : "border-border/50",
                  )}
                  onClick={() => handleJobSelect(job)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground/90">
                          {job.title}
                        </h3>
                        <p className="text-muted-foreground/80 mt-1">
                          {job.company}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs shadow-sm">
                        {job.type}
                      </Badge>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <div className="flex items-center text-sm text-muted-foreground/80">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground/80">
                        <DollarSign className="h-4 w-4" />
                        {job.salary}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground/80">
                        <Clock className="h-4 w-4 mr-1" />
                        {job.postedDate}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {visibleJobCount < filteredJobs.length && (
              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  className="shadow-sm hover:shadow-md transition-shadow"
                >
                  Load More Jobs
                </Button>
              </div>
            )}
          </div>

          {/* Job Details */}
          <div className="lg:col-span-1">
            {selectedJob ? (
              <Card className="sticky top-6 border-border/50 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-foreground/90">
                        {selectedJob.title}
                      </h2>
                      <p className="text-muted-foreground/80 mt-1">
                        {selectedJob.company}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs shadow-sm">
                      {selectedJob.type}
                    </Badge>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-foreground/90">
                        Description
                      </h3>
                      <p className="text-muted-foreground/80 mt-2">
                        {selectedJob.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-foreground/90">
                        Requirements
                      </h3>
                      <ul className="mt-2 space-y-2">
                        {selectedJob.requirements.map((req, index) => (
                          <li
                            key={index}
                            className="flex items-start text-muted-foreground/80"
                          >
                            <CheckCircle2 className="h-4 w-4 mt-1 mr-2 text-primary" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4">
                      <Button
                        className="w-full shadow-sm hover:shadow-md transition-shadow"
                        onClick={openApplicationModal}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="sticky top-6 border-border/50 shadow-lg">
                <CardContent className="p-6">
                  <p className="text-muted-foreground/80 text-center">
                    Select a job to view details
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <MultiPurposeModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        title="Find Your Ideal Job"
        description="Customize your search to discover the perfect opportunities"
        size="lg"
        showFooter={true}
        primaryActionText="Apply Filters"
        onPrimaryAction={() => {
          setFilterModalOpen(false);
        }}
        secondaryActionText="Cancel"
        onSecondaryAction={() => setFilterModalOpen(false)}
      >
        <JobFilters
          onApply={handleApplyFilters}
          initialFilters={activeFilters}
        />
      </MultiPurposeModal>

      {/* Job Application Modal */}
      <MultiPurposeModal
        open={applicationModalOpen}
        onOpenChange={setApplicationModalOpen}
        title={
          applicationSubmitted
            ? "Application Submitted!"
            : "Apply for " + selectedJob?.title
        }
        description={
          applicationSubmitted
            ? "Thank you for your interest in this position."
            : "Complete the form below to apply for this position"
        }
        size="lg"
        showFooter={false}
      >
        {applicationSubmitted ? (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Application Successfully Submitted!
            </h3>
            <p className="text-gray-600 mb-6">
              Your application for {selectedJob?.title} at{" "}
              {selectedJob?.company} has been received. We&apos;ll notify you
              when there&apos;s an update.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => setApplicationModalOpen(false)}
              >
                Close
              </Button>
              <Button
                className="bg-launchpad-blue hover:bg-launchpad-teal"
                onClick={() => {
                  setApplicationModalOpen(false);
                  // Navigate to dashboard or another page if needed
                }}
              >
                View My Applications
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-medium mb-3 text-gray-900">
              Application Form
            </h3>
            <p className="text-gray-700">
              Please fill out the form below to apply for this position.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleApplicationSubmit();
              }}
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <Input
                    type="text"
                    className="block w-full border-gray-200 focus:border-launchpad-blue"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    className="block w-full border-gray-200 focus:border-launchpad-blue"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    className="block w-full border-gray-200 focus:border-launchpad-blue"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter
                  </label>
                  <textarea
                    className="block w-full border-gray-200 focus:border-launchpad-blue"
                    rows={5}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <Button
                  variant="outline"
                  onClick={() => setApplicationModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-launchpad-blue hover:bg-launchpad-teal"
                  type="submit"
                >
                  Submit Application
                </Button>
              </div>
            </form>
          </div>
        )}
      </MultiPurposeModal>
    </DashboardLayout>
  );
}
