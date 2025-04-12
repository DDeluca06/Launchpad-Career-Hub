"use client";

import { PartnerListProps } from './types';
import { Card } from "@/components/ui/basic/card";
import { cn } from "@/lib/utils";
import { MapPin, Calendar, Building2, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/basic/badge";
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

  // Generate a unique key for each partner
  const getPartnerKey = (partner: ExtendedPartner) => {
    return partner.partner_id.toString();
  };
  
  // Check if a partner is selected
  const isPartnerSelected = (partner: ExtendedPartner, selected?: ExtendedPartner | null) => {
    if (!selected) return false;
    return partner.partner_id === selected.partner_id;
  };

  return (
    <div className="space-y-2">
      {partners.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center bg-gray-50 rounded-md border border-gray-100">
          <Building2 className="h-10 w-10 text-gray-300 mb-2" />
          <p className="text-gray-500 font-medium">No partners found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        partners.map((partner) => (
          <Card
            key={getPartnerKey(partner)}
            className={cn("cursor-pointer hover:bg-gray-50 transition-colors p-3", {
              "bg-blue-50 border-blue-200": isPartnerSelected(partner, selectedPartner),
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
                  <Briefcase className="h-3 w-3" />
                  <span>{partner.jobs?.length || 0} jobs</span>
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
            </div>
          </Card>
        ))
      )}
    </div>
  );
} 