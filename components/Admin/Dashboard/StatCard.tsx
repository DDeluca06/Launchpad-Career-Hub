import { Card, CardContent } from "@/components/ui/basic/card";
import { extendedPalette } from "@/lib/colors";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  isLoading: boolean;
  color: string;
}

/**
 * Renders a card displaying a statistic with a title, numeric value, and an associated icon.
 *
 * This component presents a statistic in a visually appealing card layout with a colored
 * top border. It accepts a descriptive title, the statistic's numeric value, an icon to 
 * provide visual context, and handles loading states.
 *
 * @param title - The label for the statistic.
 * @param value - The numeric value of the statistic.
 * @param icon - A React element representing the statistic's icon.
 * @param isLoading - A boolean indicating whether the data is still loading.
 * @param color - The accent color used for the top border.
 */
export function StatCard({ 
  title, 
  value, 
  icon, 
  isLoading,
  color
}: StatCardProps) {
  // Determine background color based on the main color
  const getBgColor = () => {
    if (color === extendedPalette.primaryBlue) return extendedPalette.lightBlue;
    if (color === extendedPalette.primaryGreen) return extendedPalette.lightGreen;
    if (color === extendedPalette.primaryOrange) return extendedPalette.peach;
    if (color === extendedPalette.teal) return extendedPalette.lightBlue;
    return extendedPalette.offWhite;
  };

  return (
    <Card className="overflow-hidden">
      <div className="h-1" style={{ backgroundColor: color }}></div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            {isLoading ? (
              <div className="h-7 w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
            ) : (
              <p className="text-2xl font-bold mt-1">{value.toLocaleString()}</p>
            )}
          </div>
          <div className="p-2 rounded-full" style={{ backgroundColor: getBgColor() }}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 