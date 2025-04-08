import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/basic/avatar"
import { extendedPalette } from "@/lib/colors"

interface CompanyLogoProps {
  company: string
  size?: "sm" | "md" | "lg"
  className?: string
}

/**
 * Renders a company logo as an avatar with a fallback display.
 *
 * The component displays an avatar sized according to the specified "size" prop. It attempts to load the company logo
 * from an API endpoint; if the image fails to load, it falls back to showing the company's initials on a colored background.
 * The background color is deterministically chosen based on the company name.
 *
 * @param company - The name of the company to generate the logo and fallback initials.
 * @param size - Optional size of the logo; valid values are "sm", "md", or "lg". Defaults to "md".
 * @param className - Optional CSS class(es) to apply to the avatar.
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