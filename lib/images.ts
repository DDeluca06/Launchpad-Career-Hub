/**
 * Launchpad Career Hub Image Assets
 * 
 * This file contains constants for all the image assets uploaded to uploadthing.com
 * Use these constants when referencing images to maintain consistent paths throughout the app.
 */

// Main Launchpad Logos
export const LAUNCHPAD_LOGOS = {
  mainColor: {
    url: "https://.ufs.sh/f/rIWyF4chqJyDC4ibTR6cuPh6NOxj7QEf2tRDoIe0ybdCUpS9",
    alt: "Launchpad Main Color Logo",
    key: "rIWyF4chqJyDC4ibTR6cuPh6NOxj7QEf2tRDoIe0ybdCUpS9",
  },
  newLogo: {
    url: "https://w8d9q6vsv9.ufs.sh/f/rIWyF4chqJyDowiaMDgcIujSVTWxXAH8Pg5RlyQEth0YNzs1",
    alt: "Launchpad New Logo",
    key: "rIWyF4chqJyDowiaMDgcIujSVTWxXAH8Pg5RlyQEth0YNzs1",
  },
  white: {
    url: "https://w8d9q6vsv9.ufs.sh/f/rIWyF4chqJyDbmhJaoB1AWNIbGMYB15fyCa3QdKjHiFh2Rzl",
    alt: "Launchpad White Logo",
    key: "rIWyF4chqJyDbmhJaoB1AWNIbGMYB15fyCa3QdKjHiFh2Rzl",
  },
  mainColorStandard: {
    url: "https://w8d9q6vsv9.ufs.sh/f/rIWyF4chqJyD3VmUQdjWLvcsx5AwSyEqd9jZtYOruK4GD8NQ",
    alt: "Launchpad Main Color Logo - Standard",
    key: "rIWyF4chqJyD3VmUQdjWLvcsx5AwSyEqd9jZtYOruK4GD8NQ",
  },
  mainColorJpg: {
    url: "https://w8d9q6vsv9.ufs.sh/f/rIWyF4chqJyDIdym9GKqfDesz0p3Wl4N8GBQFw6YM2CJZvqU",
    alt: "Launchpad Main Color Logo - JPG Format",
    key: "rIWyF4chqJyDIdym9GKqfDesz0p3Wl4N8GBQFw6YM2CJZvqU",
  },
  darkBackground: {
    url: "https://w8d9q6vsv9.ufs.sh/f/rIWyF4chqJyDHzEfrWxmt3KzyUYcXRQxpJodDTHG6g17lk90",
    alt: "Launchpad Color Logo for Dark Backgrounds",
    key: "rIWyF4chqJyDHzEfrWxmt3KzyUYcXRQxpJodDTHG6g17lk90",
  },
};

// Partner Logos
export const PARTNER_LOGOS = {
  building21: {
    url: "https://w8d9q6vsv9.ufs.sh/f/rIWyF4chqJyDZ7YSHQGmUbaJHXKIRxz4reB5FOYwgMPNVjt0",
    alt: "Building 21 Logo",
    key: "rIWyF4chqJyDZ7YSHQGmUbaJHXKIRxz4reB5FOYwgMPNVjt0",
  },
};

// Combined Logos
export const COMBINED_LOGOS = {
  launchpadBuilding21: {
    url: "https://w8d9q6vsv9.ufs.sh/f/rIWyF4chqJyDxQrF8iPyJkBLoQqtZM4jKDSNvFYxml0Ci2A3",
    alt: "Launchpad and Building 21 Logo Lockup",
    key: "rIWyF4chqJyDxQrF8iPyJkBLoQqtZM4jKDSNvFYxml0Ci2A3",
  },
};

// Updated the default placeholder images to use the new main image URL.
const MAIN_IMAGE_URL = "https://i0.wp.com/launchpadphilly.org/wp-content/uploads/2022/07/03-more-transp-launchpad-logo-less-padding-copy-4.png?fit=500%2C443&ssl=1";

export const placeholderLogo = MAIN_IMAGE_URL;
export const placeholderUser = MAIN_IMAGE_URL;
export const placeholderImage = MAIN_IMAGE_URL;

// Complete collection of all available images
type UploadthingImage = {
  src: string;
  name: string;
  key: string;
  url: string;
  size: number;
  uploadedAt: string;
  alt: string;
};

export const ALL_IMAGES: Record<string, UploadthingImage> = {
  // Launchpad Logos
  "launchpad-main-color": {
    src: "https://w8d9q6vsv9.ufs.sh/f/rIWyF4chqJyDC4ibTR6cuPh6NOxj7QEf2tRDoIe0ybdCUpS9",
    name: "01-main-color-launchpad-logo-72ppi.png",
    key: "rIWyF4chqJyDC4ibTR6cuPh6NOxj7QEf2tRDoIe0ybdCUpS9",
    url: "https://w8d9q6vsv9.ufs.sh/f/rIWyF4chqJyDC4ibTR6cuPh6NOxj7QEf2tRDoIe0ybdCUpS9",
    size: 33133,
    uploadedAt: "2025-03-31T21:49:25.000Z",
    alt: "Launchpad Main Color Logo",
  },
  "launchpad-new-logo": {
    src: "https://w8d9q6vsv9.ufs.sh/f/rIWyF4chqJyDowiaMDgcIujSVTWxXAH8Pg5RlyQEth0YNzs1",
    name: "launchpad-new-logo.png",
    key: "rIWyF4chqJyDowiaMDgcIujSVTWxXAH8Pg5RlyQEth0YNzs1",
    url: "https://w8d9q6vsv9.ufs.sh/f/rIWyF4chqJyDowiaMDgcIujSVTWxXAH8Pg5RlyQEth0YNzs1",
    size: 50000, // approximated size
    uploadedAt: "2025-03-31T21:49:25.000Z",
    alt: "Launchpad New Logo",
  },
  "launchpad-white": {
    src: "https://w8d9q6vsv9.ufs.sh/f/rIWyF4chqJyDbmhJaoB1AWNIbGMYB15fyCa3QdKjHiFh2Rzl",
    name: "03-white-launchpad-logo-72ppi.png",
    key: "rIWyF4chqJyDbmhJaoB1AWNIbGMYB15fyCa3QdKjHiFh2Rzl",
    url: "https://w8d9q6vsv9.ufs.sh/f/rIWyF4chqJyDbmhJaoB1AWNIbGMYB15fyCa3QdKjHiFh2Rzl",
    size: 30196,
    uploadedAt: "2025-03-31T21:49:25.000Z",
    alt: "Launchpad White Logo",
  },
  "launchpad-main-standard": {
    src: "https://w8d9q6vsv9.ufs.sh/f/rIWyF4chqJyD3VmUQdjWLvcsx5AwSyEqd9jZtYOruK4GD8NQ",
    name: "01-main-color-launchpad-logo.png",
    key: "rIWyF4chqJyD3VmUQdjWLvcsx5AwSyEqd9jZtYOruK4GD8NQ",
    url: "https://w8d9q6vsv9.ufs.sh/f/rIWyF4chqJyD3VmUQdjWLvcsx5AwSyEqd9jZtYOruK4GD8NQ",
    size: 18787,
    uploadedAt: "2025-03-31T21:49:25.000Z",
    alt: "Launchpad Main Color Logo - Standard",
  },
  "launchpad-main-jpg": {
    src: "https://w8d9q6vsv9.ufs.sh/f/rIWyF4chqJyDIdym9GKqfDesz0p3Wl4N8GBQFw6YM2CJZvqU",
    name: "01-main-color-launchpad-logo-72ppi (1).jpg",
    key: "rIWyF4chqJyDIdym9GKqfDesz0p3Wl4N8GBQFw6YM2CJZvqU",
    url: "https://w8d9q6vsv9.ufs.sh/f/rIWyF4chqJyDIdym9GKqfDesz0p3Wl4N8GBQFw6YM2CJZvqU",
    size: 115495,
    uploadedAt: "2025-03-31T21:49:25.000Z",
    alt: "Launchpad Main Color Logo - JPG Format",
  },
  "launchpad-dark-background": {
    src: "https://w8d9q6vsv9.ufs.sh/f/rIWyF4chqJyDHzEfrWxmt3KzyUYcXRQxpJodDTHG6g17lk90",
    name: "02-color-launchpad-logo-for-dark-bkg-72ppi (1).png",
    key: "rIWyF4chqJyDHzEfrWxmt3KzyUYcXRQxpJodDTHG6g17lk90",
    url: "https://w8d9q6vsv9.ufs.sh/f/rIWyF4chqJyDHzEfrWxmt3KzyUYcXRQxpJodDTHG6g17lk90",
    size: 32194,
    uploadedAt: "2025-03-31T21:49:25.000Z",
    alt: "Launchpad Color Logo for Dark Backgrounds",
  },
  "default-profile-picture": {
    src: "https://w8d9q6vsv9.ufs.sh/f/rIWyF4chqJyDlnmaKAtWwvCXznjUGoAVMQityNP86TmrcRaY",
    name: "default-profile-picture.png",
    key: "default-profile-picture",
    url: "https://w8d9q6vsv9.ufs.sh/f/rIWyF4chqJyDlnmaKAtWwvCXznjUGoAVMQityNP86TmrcRaY",
    size: 10000, // approximated size
    uploadedAt: "2025-03-31T21:49:25.000Z",
    alt: "Default Profile Picture",
  },
  "default-logo": {
    src: "https://w8d9q6vsv9.ufs.sh/f/rIWyF4chqJyDowiaMDgcIujSVTWxXAH8Pg5RlyQEth0YNzs1",
    name: "launchpad-new-logo.png",
    key: "default-logo",
    url: "https://w8d9q6vsv9.ufs.sh/f/rIWyF4chqJyDowiaMDgcIujSVTWxXAH8Pg5RlyQEth0YNzs1",
    size: 50000,
    uploadedAt: "2025-03-31T21:49:25.000Z",
    alt: "Launchpad Logo",
  },
  "newLogo": {
    src: "https://w8d9q6vsv9.ufs.sh/f/rIWyF4chqJyDowiaMDgcIujSVTWxXAH8Pg5RlyQEth0YNzs1",
    name: "launchpad-new-logo.png",
    key: "newLogo",
    url: "https://w8d9q6vsv9.ufs.sh/f/rIWyF4chqJyDowiaMDgcIujSVTWxXAH8Pg5RlyQEth0YNzs1",
    size: 50000,
    uploadedAt: "2025-03-31T21:49:25.000Z",
    alt: "Launchpad New Logo",
  },
  
  // Partner Logos
  "building-21": {
    src: "https://w8d9q6vsv9.ufs.sh/f/rIWyF4chqJyDZ7YSHQGmUbaJHXKIRxz4reB5FOYwgMPNVjt0",
    name: "building 21 logo.jpg",
    key: "rIWyF4chqJyDZ7YSHQGmUbaJHXKIRxz4reB5FOYwgMPNVjt0",
    url: "https://w8d9q6vsv9.ufs.sh/f/rIWyF4chqJyDZ7YSHQGmUbaJHXKIRxz4reB5FOYwgMPNVjt0",
    size: 105061,
    uploadedAt: "2025-03-31T21:49:25.000Z",
    alt: "Building 21 Logo",
  },
  
  // Combined Logos
  "launchpad-building-21-lockup": {
    src: "https://w8d9q6vsv9.ufs.sh/f/rIWyF4chqJyDxQrF8iPyJkBLoQqtZM4jKDSNvFYxml0Ci2A3",
    name: "launchpad_b21_logo_lockup-800 px wide.png",
    key: "rIWyF4chqJyDxQrF8iPyJkBLoQqtZM4jKDSNvFYxml0Ci2A3",
    url: "https://w8d9q6vsv9.ufs.sh/f/rIWyF4chqJyDxQrF8iPyJkBLoQqtZM4jKDSNvFYxml0Ci2A3",
    size: 21106,
    uploadedAt: "2025-03-31T21:49:25.000Z",
    alt: "Launchpad and Building 21 Logo Lockup",
  },
};

// Helper function to get image URL by key
export function getImageUrlByKey(key: string): string | undefined {
  for (const image of Object.values(ALL_IMAGES)) {
    if (image.key === key) {
      return image.url;
    }
  }
  return undefined;
}

// Helper function to get appropriate logo based on theme
export function getThemeAppropriatelogo(isDarkTheme: boolean) {
  return isDarkTheme ? LAUNCHPAD_LOGOS.white : LAUNCHPAD_LOGOS.mainColor;
}