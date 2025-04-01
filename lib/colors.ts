/**
 * Launchpad Career Hub Color Palette
 * 
 * This file contains the color constants used throughout the application.
 * Use these colors to maintain consistency with the brand identity.
 */

// Logo Colors
export const logoColors = {
  gray: "#b6b7ba",
  orange: "#f27e34",
  green: "#8eb651",
  blue: "#0eaec9",
};

// Extended Color Palette
export const extendedPalette = {
  // Primary colors
  primaryBlue: "#0faec9",
  primaryOrange: "#f27e34", 
  primaryGreen: "#8eb651",
  
  // Secondary colors
  teal: "#0a8196",
  brown: "#b45e23",
  darkGreen: "#658639",
  
  // Accent/Neutral colors
  lightBlue: "#c3ebf1",
  peach: "#fcdfcc",
  lightGreen: "#e3edd3",
  offWhite: "#f7f7f7",
  darkGray: "#67686a",
};

// Status Colors (for Kanban board and status indicators)
export const statusColors = {
  interested: extendedPalette.lightBlue,
  applied: extendedPalette.primaryBlue,
  phoneScreening: extendedPalette.primaryGreen,
  interviewStage: extendedPalette.teal,
  finalInterview: extendedPalette.darkGreen,
  offerExtended: extendedPalette.primaryOrange,
  negotiation: extendedPalette.brown,
  offerAccepted: extendedPalette.darkGreen,
  rejected: extendedPalette.darkGray,
};

// Theme color variables to use with Tailwind
export const tailwindColors = {
  launchpadGray: "b6b7ba",
  launchpadOrange: "f27e34",
  launchpadGreen: "8eb651",
  launchpadBlue: "0eaec9",
  launchpadTeal: "0a8196",
  launchpadBrown: "b45e23",
  launchpadDarkGreen: "658639",
  launchpadLightBlue: "c3ebf1",
  launchpadPeach: "fcdfcc",
  launchpadLightGreen: "e3edd3",
  launchpadOffWhite: "f7f7f7",
  launchpadDarkGray: "67686a",
};

// Helper function to get color with opacity
export const getColorWithOpacity = (hexColor: string, opacity: number): string => {
  // Make sure opacity is between 0 and 1
  const validOpacity = Math.max(0, Math.min(1, opacity));
  
  // Convert hex to RGB
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${validOpacity})`;
}; 