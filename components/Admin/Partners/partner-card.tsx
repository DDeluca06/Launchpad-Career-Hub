"use client";

import { Badge } from "@/components/ui/basic/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/basic/card";
import { MapPin, Calendar, Building2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/basic/button";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/basic/avatar";
import { formatDistanceToNow } from "date-fns";
import { extendedPalette } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { ExtendedPartner } from "./types";

interface PartnerCardProps {
  partner: ExtendedPartner;
  onSelect: (partner: ExtendedPartner) => void;
  compact?: boolean;
}

export function PartnerCard({ partner, onSelect, compact = false }: PartnerCardProps) {
  // Determine partner color based on partner_id for consistent coloring
  const getPartnerColor = (partner: ExtendedPartner) => {
    const colorIndex = partner.partner_id % 5;
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
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 rounded-md border bg-background">
            {partner.logo_url ? (
              <AvatarImage src={partner.logo_url} alt={partner.name} />
            ) : (
              <AvatarFallback 
                className="rounded-md" 
                style={{ backgroundColor: `${partnerColor}20`, color: partnerColor }}
              >
                {getInitials(partner.name)}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <CardTitle className={cn("text-lg font-medium line-clamp-1", { "text-base": compact })}>
              {partner.name}
            </CardTitle>
            <CardDescription className="line-clamp-1">
              {partner.industry || "Organization"}
            </CardDescription>
          </div>
          {partner.is_archived && (
            <Badge
              variant="outline"
              className="bg-gray-50 text-gray-700 border-gray-200"
            >
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