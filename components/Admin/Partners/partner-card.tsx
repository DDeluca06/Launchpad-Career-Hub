"use client";

import { Avatar, AvatarFallback } from "@/components/ui/basic/avatar";
import { Badge } from "@/components/ui/basic/badge";
import { Card, CardHeader } from "@/components/ui/basic/card";
import { cn } from "@/lib/utils";
import { MapPin, Briefcase, Calendar } from "lucide-react";
import { ExtendedPartner } from "./types";
import { extendedPalette } from "@/lib/colors";
import { Button } from "@/components/ui/basic/button";
import {
  CardContent,
  CardFooter,
} from "@/components/ui/basic/card";

interface PartnerCardProps {
  partner: ExtendedPartner;
  onSelect: (partner: ExtendedPartner) => void;
  compact?: boolean;
}

export function PartnerCard({ partner, onSelect, compact = false }: PartnerCardProps) {
  // Determine partner color based on partner_id for consistent coloring
  const getPartnerColor = (partner: ExtendedPartner) => {
    const colorIndex = (partner.partner_id || 0) % 5;
    const colors = [
      extendedPalette.primaryBlue,
      extendedPalette.primaryGreen,
      extendedPalette.teal,
      extendedPalette.primaryOrange,
      extendedPalette.brown,
    ];
    return colors[colorIndex];
  };

  // Generate initials for the avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const partnerColor = getPartnerColor(partner);

  return (
    <Card
      className={cn(
        "hover:shadow-md transition-shadow duration-200 border-l-4 overflow-hidden",
        {
          "cursor-pointer": !compact,
        }
      )}
      style={{ borderLeftColor: partnerColor }}
      onClick={() => !compact && onSelect(partner)}
    >
      <CardHeader className={cn("p-4 pb-2", { "p-3 pb-1": compact })}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{getInitials(partner.name)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="font-medium text-gray-900 line-clamp-2">
                {partner.name}
              </h3>
              <p className="text-sm text-gray-600">
                {partner.industry || "Organization"}
              </p>
            </div>
          </div>
          {partner.is_archived && (
            <Badge variant="outline" className="text-xs bg-gray-100">
              Archived
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className={cn("px-4 py-2 space-y-2", { "px-3 py-1": compact })}>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {partner.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground/70" />
              <span>{partner.location}</span>
            </div>
          )}
          {partner.jobs_available !== undefined && (
            <div className="flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5 text-muted-foreground/70" />
              <span>{partner.jobs_available} jobs</span>
            </div>
          )}
          {partner.partnership_start && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground/70" />
              <span>
                Partner since {new Date(partner.partnership_start).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      {!compact && (
        <CardFooter className="px-4 py-2 pt-0 flex justify-between items-center">
          <Badge 
            variant="outline" 
            className="bg-primary/5 border-primary/10"
            style={{ 
              backgroundColor: `${partnerColor}10`,
              borderColor: `${partnerColor}20`,
              color: partnerColor
            }}
          >
            {partner.applicants || 0} applicants
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            style={{ 
              borderColor: extendedPalette.primaryBlue,
              color: extendedPalette.teal
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(partner);
            }}
          >
            View Details
          </Button>
        </CardFooter>
      )}
    </Card>
  );
} 