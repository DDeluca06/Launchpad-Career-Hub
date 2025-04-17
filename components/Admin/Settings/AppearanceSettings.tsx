import { Card, CardContent } from "@/components/ui/basic/card";
import { ThemeSwitcher } from "./ThemeSwitcher";

// Remove the import and define the interface directly
interface AppearanceSettingsProps {
  isLoading?: boolean;
}

/**
 * Component for managing appearance settings like theme
 */
export function AppearanceSettings({ isLoading }: AppearanceSettingsProps) {
  if (isLoading) {
    return (
      <Card className="border-none shadow-sm bg-white/80 dark:bg-gray-800/80">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-5 w-1/4 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-1">Appearance</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Customize how the Launchpad Career Hub looks and feels.
        </p>
      </div>
      
      <ThemeSwitcher />
    </div>
  );
} 