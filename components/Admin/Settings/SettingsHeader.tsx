import { extendedPalette } from "@/lib/colors";

interface SettingsHeaderProps {
  title: string;
  description: string;
}

export function SettingsHeader({ title, description }: SettingsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div>
        <h1 
          className="text-2xl font-bold" 
          style={{ color: extendedPalette.primaryBlue }}
        >
          {title}
        </h1>
        <p 
          className="mt-1"
          style={{ color: extendedPalette.darkGray }}
        >
          {description}
        </p>
      </div>
    </div>
  );
} 