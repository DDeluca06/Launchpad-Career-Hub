"use client";

import { PartnerListProps } from './types';
import { Card } from "@/components/ui/basic/card";
import { cn } from "@/lib/utils";
import { MapPin, Calendar, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/basic/badge";
import { extendedPalette } from "@/lib/colors";
import { ExtendedPartner } from './types';

export function PartnerListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="border rounded-lg p-3 animate-pulse">
          <div className="flex gap-3 items-start">
            <div className="w-10 h-10 bg-gray-200 rounded-md"></div>
            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-100 rounded w-1/2"></div>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <div className="h-4 bg-gray-100 rounded w-16"></div>
            <div className="h-4 bg-gray-100 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PartnerList({
  partners,
  selectedPartner,
  onSelectPartner,
  jobsCount,
  isLoading,
  searchQuery,
}: PartnerListProps) {
  if (isLoading) {
    return <PartnerListSkeleton />;
  }

  // Format and highlight search terms in text
  const highlightText = (text: string) => {
    if (!searchQuery || !text) return text;
    
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? <mark key={i} className="bg-yellow-200">{part}</mark> : part
    );
  };

  return (
    <div className="space-y-2">
      {partners.length === 0 ? (
        <div className="text-center py-8 px-4">
          <p className="text-gray-500">No partners found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        partners.map((partner) => (
          <Card
            key={partner.partner_id}
            className={cn("cursor-pointer hover:bg-gray-50 transition-colors p-3", {
              "bg-blue-50 border-blue-200": selectedPartner?.partner_id === partner.partner_id,
            })}
            onClick={() => onSelectPartner(partner)}
          >
            <div className="flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <h3 className="font-medium text-gray-900 line-clamp-2">
                    {highlightText(partner.name)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {highlightText(partner.industry || "Organization")}
                  </p>
                </div>
                {partner.is_archived && (
                  <Badge variant="outline" className="text-xs bg-gray-100">
                    Archived
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap mt-2 gap-x-4 gap-y-1 text-xs text-gray-500">
                {partner.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{highlightText(partner.location)}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Badge 
                    variant="outline" 
                    className="px-1 py-0 text-xs font-normal border-primary/20 bg-primary/5"
                    style={{ 
                      borderColor: `${extendedPalette.primaryBlue}20`,
                      backgroundColor: `${extendedPalette.lightBlue}50`,
                      color: extendedPalette.teal
                    }}
                  >
                    {partner.jobs_available || 0} jobs
                  </Badge>
                </div>
                {partner.partnership_start && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      Since {new Date(partner.partnership_start).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mt-2">
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs py-0 px-1.5">
                    {partner.applicants_hired || 0} hired
                  </Badge>
                </div>
                
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600">
                  {partner.applicants || 0} applicants
                </Badge>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
} 