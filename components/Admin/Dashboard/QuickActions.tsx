import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/basic/card";
import Link from "next/link";
import { BarChart3, Briefcase, Building, ChevronRight, Users } from "lucide-react";
import { extendedPalette } from "@/lib/colors";

/**
 * Renders a Quick Actions card with common admin tasks as clickable links.
 * 
 * This component displays a card with links to frequently used admin functions,
 * each with an appropriate icon, title, and description. The links use a hover
 * effect for better user experience.
 * 
 * @returns A React component displaying the quick actions card
 */
export function QuickActions() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="px-6 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <Link href="/admin/jobs/new" className="block">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: `${extendedPalette.lightBlue}` }}>
                <Briefcase className="h-4 w-4" style={{ color: extendedPalette.primaryBlue }} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Post New Job</p>
                <p className="text-sm text-gray-500">Create job listing</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </Link>
          <Link href="/admin/applicants" className="block">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: `${extendedPalette.lightGreen}` }}>
                <Users className="h-4 w-4" style={{ color: extendedPalette.primaryGreen }} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Review Applicants</p>
                <p className="text-sm text-gray-500">Manage applications</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </Link>
          <Link href="/admin/partners" className="block">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: `${extendedPalette.peach}` }}>
                <Building className="h-4 w-4" style={{ color: extendedPalette.primaryOrange }} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Manage Partners</p>
                <p className="text-sm text-gray-500">View and edit partners</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </Link>
          <Link href="/admin/analytics" className="block">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: `${extendedPalette.lightBlue}` }}>
                <BarChart3 className="h-4 w-4" style={{ color: extendedPalette.teal }} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">View Analytics</p>
                <p className="text-sm text-gray-500">Performance insights</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
} 