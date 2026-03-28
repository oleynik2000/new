import type { Translations } from "@/lib/i18n/types";
import { ZODIAC_ICONS, type ZodiacSign } from "@/lib/gamification";

// ==========================================
// Category constants
// ==========================================
export const CATEGORY_COLORS: Record<string, string> = {
  person: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  company: "bg-green-500/15 text-green-400 border border-green-500/20",
  thing: "bg-orange-500/15 text-orange-400 border border-orange-500/20",
  other: "bg-purple-500/15 text-purple-400 border border-purple-500/20",
};

export function getCategoryLabels(t: Translations): Record<string, string> {
  return {
    person: t.home.person,
    company: t.home.company,
    thing: t.home.product,
    other: t.home.other,
  };
}

// ==========================================
// Rank constants (shared across client components)
// ==========================================
export const RANK_COLORS: Record<string, string> = {
  novice: "text-gray-400",
  active: "text-blue-400",
  expert: "text-purple-400",
  legend: "text-yellow-400",
};

export const RANK_BG: Record<string, string> = {
  novice: "bg-gray-500/10 border-gray-500/20",
  active: "bg-blue-500/10 border-blue-500/20",
  expert: "bg-purple-500/10 border-purple-500/20",
  legend: "bg-yellow-500/10 border-yellow-500/20",
};

export const RANK_ICONS: Record<string, string> = {
  novice: "\u{1F331}",
  active: "\u26A1",
  expert: "\u{1F48E}",
  legend: "\u{1F451}",
};

export const RANK_NAMES: Record<string, Record<string, string>> = {
  novice: { uk: "\u041D\u043E\u0432\u0430\u0447\u043E\u043A", en: "Novice", ru: "\u041D\u043E\u0432\u0438\u0447\u043E\u043A", es: "Novato" },
  active: { uk: "\u0410\u043A\u0442\u0438\u0432\u043D\u0438\u0439", en: "Active", ru: "\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0439", es: "Activo" },
  expert: { uk: "\u0415\u043A\u0441\u043F\u0435\u0440\u0442", en: "Expert", ru: "\u042D\u043A\u0441\u043F\u0435\u0440\u0442", es: "Experto" },
  legend: { uk: "\u041B\u0435\u0433\u0435\u043D\u0434\u0430", en: "Legend", ru: "\u041B\u0435\u0433\u0435\u043D\u0434\u0430", es: "Leyenda" },
};

export function getRankName(rank: string, locale: string): string {
  return RANK_NAMES[rank]?.[locale] || rank;
}

// ==========================================
// Horoscope constants
// ==========================================
export const HOROSCOPE_GRADIENT =
  "bg-gradient-to-br from-indigo-500/15 via-purple-500/15 to-pink-500/15 border-indigo-500/20";

export function getZodiacIcon(sign: string | null): string | null {
  if (!sign) return null;
  return ZODIAC_ICONS[sign as ZodiacSign] || null;
}
