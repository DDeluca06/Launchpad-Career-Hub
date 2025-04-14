"use client";

import { useContext } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { AuthContext } from "@/app/providers";
import Jobs from "@/components/Applicant/Jobs/Jobs";

export default function JobsPage() {
  const { session, loading: isAuthLoading } = useContext(AuthContext);

  return (
    <DashboardLayout>
      <div className="container mx-auto pt-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Career Opportunities</h1>
          <p className="text-gray-500 mt-2">Discover tech opportunities and track your applications</p>
        </div>
        
        <Jobs userId={session?.user?.id ? Number(session.user.id) : undefined} />
      </div>
    </DashboardLayout>
  );
}
