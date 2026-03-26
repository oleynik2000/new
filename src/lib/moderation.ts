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
  "cocaine",
  "heroin",
  "meth",
  "rape",
  "suicide",
  "bomb",
  "exploit",
  "hack",
  "phishing",
  "malware",
  "ransomware",
  "drugs",
  "trafficking",
];

export function containsToxicContent(text: string): boolean {
  const lower = text.toLowerCase();
  return TOXIC_WORDS.some((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "i");
    return regex.test(lower);
  });
}

export function sanitizeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

/**
 * Detect spam links in text.
 * Flags content with excessive URLs or known spam patterns.
 */
export function containsSpamLinks(text: string): boolean {
  const urlPattern = /https?:\/\/[^\s]+/gi;
  const urls = text.match(urlPattern) || [];

  // Flag if more than 3 URLs in a single post/comment
  if (urls.length > 3) return true;

  // Common spam URL patterns
  const spamPatterns = [
    /bit\.ly/i,
    /tinyurl/i,
    /click\s*here/i,
    /free\s*money/i,
    /earn\s*\$\d+/i,
    /buy\s*now/i,
    /limited\s*offer/i,
    /act\s*now/i,
    /casino/i,
    /lottery/i,
    /viagra/i,
    /crypto\s*invest/i,
  ];

  return spamPatterns.some((pattern) => pattern.test(text));
}

/**
 * Check if text is a repeated/duplicate message (all same characters or very short repetition).
 */
export function isRepeatedContent(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < 2) return false;

  // Check if all characters are the same
  if (new Set(trimmed.replace(/\s/g, "")).size <= 2 && trimmed.length > 5) {
    return true;
  }

  // Check for repeated words (e.g., "test test test test")
  const words = trimmed.toLowerCase().split(/\s+/);
  if (words.length >= 4) {
    const uniqueWords = new Set(words);
    if (uniqueWords.size <= 2) return true;
  }

  return false;
}

/**
 * Validate honeypot field - if it has content, it's a bot.
 */
export function isHoneypotTriggered(honeypotValue: string | undefined): boolean {
  return typeof honeypotValue === "string" && honeypotValue.length > 0;
}

export const REPORT_THRESHOLD = 5;
