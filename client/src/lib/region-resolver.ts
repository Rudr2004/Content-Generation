/**
 * Resolves the region value with priority order:
 * 1. Page-specific region (if set)
 * 2. Global default from Site Settings
 * 3. Fallback: "USA, Canada"
 * 
 * @param pageRegion - Optional page-specific region value
 * @param globalRegion - Optional global region from site settings
 * @returns Resolved region string
 */
export function resolveRegion(pageRegion?: string | null, globalRegion?: string | null): string {
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
