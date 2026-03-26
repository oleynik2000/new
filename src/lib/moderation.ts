const TOXIC_WORDS = [
  "spam",
  "scam",
  "fraud",
  "kill",
  "murder",
  "terroris",
  "nazi",
  "porn",
  "xxx",
];

export function containsToxicContent(text: string): boolean {
  const lower = text.toLowerCase();
  return TOXIC_WORDS.some((word) => lower.includes(word));
}

export function sanitizeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export const REPORT_THRESHOLD = 5;
