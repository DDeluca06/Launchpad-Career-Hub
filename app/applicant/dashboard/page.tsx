"use client";

import { useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { KanbanPage } from "@/components/kanban";
import { Button } from "@/components/ui/basic/button";
import { applicationService } from "@/lib/local-storage";
import { useRouter } from "next/navigation";

export default function ApplicantDashboard() {
  const router = useRouter();

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Load applications from local storage
        applicationService.getAll();
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <DashboardLayout>
      <div className="container py-6 px-4 mx-auto pb-24">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex space-x-2">
              <Button onClick={() => router.push('/applicant/jobs')}>
                Find Jobs
              </Button>
            </div>
          </div>

          {/* Main Dashboard Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          </div>

          {/* Kanban Task Board */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
              </div>
            </div>
            <KanbanPage />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
