import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/basic/card";
import Link from "next/link";
import { Building, ChevronRight, Users, Plus, List } from "lucide-react";
import { extendedPalette } from "@/lib/colors";

/**
 * Renders a Quick Actions card with common admin tasks as clickable links in a grid layout.
 * 
 * This component displays a card with links to frequently used admin functions,
 * each with an appropriate icon, title, and description, organized in a responsive grid.
 * 
 * @returns A React component displaying the quick actions card
 */
export function QuickActions() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="px-6 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/jobs/create" className="block">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 h-full">
              <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ backgroundColor: `${extendedPalette.lightBlue}` }}>
                <Plus className="h-5 w-5" style={{ color: extendedPalette.primaryBlue }} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Create New Job</p>
                <p className="text-sm text-gray-500">Post a new job opportunity</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </Link>
          <Link href="/admin/jobs" className="block">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 h-full">
              <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ backgroundColor: `${extendedPalette.lightGreen}` }}>
                <List className="h-5 w-5" style={{ color: extendedPalette.primaryGreen }} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Manage Jobs</p>
                <p className="text-sm text-gray-500">View and edit all job listings</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </Link>
          <Link href="/admin/companies" className="block">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 h-full">
              <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ backgroundColor: `${extendedPalette.peach}` }}>
                <Building className="h-5 w-5" style={{ color: extendedPalette.primaryOrange }} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Manage Companies</p>
                <p className="text-sm text-gray-500">View and edit company profiles</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </Link>
          <Link href="/admin/applicants" className="block">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 h-full">
              <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ backgroundColor: `${extendedPalette.lightBlue}` }}>
                <Users className="h-5 w-5" style={{ color: extendedPalette.teal }} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Manage Applicants</p>
                <p className="text-sm text-gray-500">View and process applications</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
} 