import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/basic/avatar"
import { extendedPalette } from "@/lib/colors"

interface CompanyLogoProps {
  company: string
  size?: "sm" | "md" | "lg"
  className?: string
}

/**
 * Renders an avatar displaying the company logo.
 *
 * The component attempts to load the company logo from a hypothetical API endpoint using the provided company name.
 * If the logo image fails to load, it falls back to displaying the company's initials on a background color that is
 * consistently generated based on the company name. The avatar's dimensions are determined by the specified size.
 *
 * @param company - The name of the company used to fetch the logo and generate fallback initials.
 * @param size - Optional avatar size ("sm", "md", or "lg"), defaulting to "md".
 * @param className - Optional additional CSS classes for custom styling.
 */
export function CompanyLogo({ company, size = "md", className }: CompanyLogoProps) {
  // Map size to dimensions
  const sizeMap = {
    sm: "h-12 w-12",
    md: "h-16 w-16",
    lg: "h-20 w-20"
  }
  
  // Generate initials for the fallback
  const getInitials = (name: string) => {
    const words = name.split(" ")
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase()
    }
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  
  // Generate a consistent color based on company name
  const getColor = (name: string) => {
    const colors = [
      extendedPalette.primaryBlue,
      extendedPalette.primaryGreen,
      extendedPalette.primaryOrange,
      extendedPalette.teal,
      extendedPalette.brown
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }
  
  const bgColor = getColor(company)
  
  return (
    <Avatar className={`${sizeMap[size]} ${className || ""}`}>
      {/* Try to load from imaginary company logo API */}
      <AvatarImage src={`/api/company-logos/${encodeURIComponent(company.toLowerCase().replace(/\s+/g, "-"))}`} alt={company} />
      {/* Fallback with company initials and a colored background */}
      <AvatarFallback style={{ backgroundColor: bgColor, color: "white" }}>
        {getInitials(company)}
      </AvatarFallback>
    </Avatar>
  )
} 