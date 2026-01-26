import { storage } from "./storage";

/**
 * Resolves the region value with priority order:
 * 1. Page-specific region (if set)
 * 2. Global default from Site Settings
 * 3. Fallback: "USA, Canada"
 * 
 * @param pageRegion - Optional page-specific region value
 * @returns Resolved region string
 */
export async function resolveRegion(pageRegion?: string | null): Promise<string> {
  // Priority 1: Page-specific region (if set and not empty)
  if (pageRegion && pageRegion.trim()) {
    return pageRegion.trim();
  }

  // Priority 2: Global default from Site Settings
  try {
    const settings = await storage.getSiteSettings();
    if (settings?.targetRegions && settings.targetRegions.trim()) {
      return settings.targetRegions.trim();
    }
  } catch (error) {
    console.error("Error fetching site settings for region resolution:", error);
    // Continue to fallback if there's an error
  }

  // Priority 3: Fallback
  return "USA, Canada";
}

/**
 * Synchronous version that uses provided site settings
 * Useful when site settings are already available
 * 
 * @param pageRegion - Optional page-specific region value
 * @param globalRegion - Optional global region from site settings
 * @returns Resolved region string
 */
export function resolveRegionSync(pageRegion?: string | null, globalRegion?: string | null): string {
  // Priority 1: Page-specific region (if set and not empty)
  if (pageRegion && pageRegion.trim()) {
    return pageRegion.trim();
  }

  // Priority 2: Global default from Site Settings
  if (globalRegion && globalRegion.trim()) {
    return globalRegion.trim();
  }

  // Priority 3: Fallback
  return "USA, Canada";
}
