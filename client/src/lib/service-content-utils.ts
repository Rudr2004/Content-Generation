/** Extract readable text from service content - handles JSON, HTML, or plain text */
export function getServiceDescription(content: string | undefined, fallback: string): string {
  if (!content || typeof content !== "string") return fallback;
  const trimmed = content.trim();
  if (!trimmed) return fallback;

  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed) as Record<string, unknown>;
      const hero = parsed?.heroSection as Record<string, unknown> | undefined;
      const headline = (hero?.headline ?? parsed?.headline) as string | undefined;
      if (typeof headline === "string" && headline.length > 10)
        return headline.slice(0, 140) + (headline.length > 140 ? "..." : "");
      const subheadline = (hero?.subheadline ?? parsed?.subheadline) as string | undefined;
      if (typeof subheadline === "string" && subheadline.length > 10)
        return subheadline.replace(/<[^>]*>/g, "").slice(0, 140) + "...";
      const overview = (parsed?.project_overview as Record<string, unknown> | undefined)?.problem_statement ?? parsed?.description;
      if (typeof overview === "string" && overview.length > 10)
        return overview.replace(/<[^>]*>/g, "").slice(0, 140) + "...";
    } catch {
      /* ignore */
    }
  }

  const stripped = trimmed.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  if (stripped.length > 10 && !stripped.startsWith("{"))
    return stripped.slice(0, 140) + (stripped.length > 140 ? "..." : "");
  return fallback;
}

/** Check if text looks like raw JSON (should not be shown as description) */
export function isJsonLike(text: string | undefined): boolean {
  if (!text || typeof text !== "string") return false;
  const t = text.trim();
  return t.startsWith("{") || t.includes('"heroSection"') || t.includes('"headline"');
}
