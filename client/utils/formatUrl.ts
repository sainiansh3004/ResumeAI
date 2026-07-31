export function formatUrl(url: string | undefined | null): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^(f|ht)tps?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  if (trimmed.startsWith("mailto:") || trimmed.startsWith("tel:")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}
