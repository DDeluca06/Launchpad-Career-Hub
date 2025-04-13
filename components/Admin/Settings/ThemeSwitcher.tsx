"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/basic/button";
import { Sun, Moon } from "lucide-react";
import { extendedPalette } from "@/lib/colors";
import { Card, CardContent } from "@/components/ui/basic/card";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  
  return (
    <Card className="border-none shadow-sm bg-white/80 dark:bg-gray-800/80">
      <CardContent className="p-6">
        <h3 className="text-sm font-medium mb-4 text-gray-800 dark:text-gray-200">
          Theme Preference
        </h3>
        <div className="grid grid-cols-2 gap-4 max-w-xs">
          <Button
            variant={theme === "light" ? "default" : "outline"}
            className={`
              justify-start w-full shadow-sm hover:shadow-md transition-all
              ${theme === "light" ? `bg-${extendedPalette.primaryBlue} text-white` : ""}
            `}
            style={
              theme === "light" 
                ? { backgroundColor: extendedPalette.primaryBlue, borderColor: extendedPalette.primaryBlue }
                : { borderColor: extendedPalette.darkGray, color: extendedPalette.darkGray }
            }
            onClick={() => setTheme("light")}
          >
            <Sun className="h-4 w-4 mr-2" />
            Light
          </Button>
          <Button
            variant={theme === "dark" ? "default" : "outline"}
            className={`
              justify-start w-full shadow-sm hover:shadow-md transition-all
              ${theme === "dark" ? `bg-${extendedPalette.teal} text-white` : ""}
            `}
            style={
              theme === "dark" 
                ? { backgroundColor: extendedPalette.teal, borderColor: extendedPalette.teal }
                : { borderColor: extendedPalette.darkGray, color: extendedPalette.darkGray }
            }
            onClick={() => setTheme("dark")}
          >
            <Moon className="h-4 w-4 mr-2" />
            Dark
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 