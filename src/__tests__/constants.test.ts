import {
  CATEGORY_COLORS,
  getCategoryLabels,
  RANK_COLORS,
  RANK_BG,
  RANK_ICONS,
  RANK_NAMES,
  getRankName,
  HOROSCOPE_GRADIENT,
  getZodiacIcon,
} from "@/lib/constants";

describe("constants", () => {
  describe("CATEGORY_COLORS", () => {
    it("should have all four categories", () => {
      expect(CATEGORY_COLORS).toHaveProperty("person");
      expect(CATEGORY_COLORS).toHaveProperty("company");
      expect(CATEGORY_COLORS).toHaveProperty("thing");
      expect(CATEGORY_COLORS).toHaveProperty("other");
    });

    it("should have non-empty string values", () => {
      Object.values(CATEGORY_COLORS).forEach((v) => {
        expect(typeof v).toBe("string");
        expect(v.length).toBeGreaterThan(0);
      });
    });
  });

  describe("getCategoryLabels", () => {
    it("should return labels from translations", () => {
      const mockT = {
        home: { person: "Person", company: "Company", product: "Product", other: "Other" },
      } as any;
      const labels = getCategoryLabels(mockT);
      expect(labels.person).toBe("Person");
      expect(labels.company).toBe("Company");
      expect(labels.thing).toBe("Product");
      expect(labels.other).toBe("Other");
    });
  });

  describe("RANK_COLORS", () => {
    it("should have all four ranks", () => {
      expect(Object.keys(RANK_COLORS)).toEqual(["novice", "active", "expert", "legend"]);
    });
  });

  describe("RANK_BG", () => {
    it("should have all four ranks", () => {
      expect(Object.keys(RANK_BG)).toEqual(["novice", "active", "expert", "legend"]);
    });
  });

  describe("RANK_ICONS", () => {
    it("should have all four ranks with emoji icons", () => {
      expect(Object.keys(RANK_ICONS)).toEqual(["novice", "active", "expert", "legend"]);
      Object.values(RANK_ICONS).forEach((v) => {
        expect(typeof v).toBe("string");
        expect(v.length).toBeGreaterThan(0);
      });
    });
  });

  describe("getRankName", () => {
    it("should return localized rank name for known rank and locale", () => {
      expect(getRankName("novice", "en")).toBe("Novice");
      expect(getRankName("expert", "en")).toBe("Expert");
      expect(getRankName("legend", "es")).toBe("Leyenda");
    });

    it("should return rank key for unknown locale", () => {
      expect(getRankName("novice", "fr")).toBe("novice");
    });

    it("should return rank key for unknown rank", () => {
      expect(getRankName("unknown", "en")).toBe("unknown");
    });
  });

  describe("RANK_NAMES", () => {
    it("should have translations for all four supported locales", () => {
      const locales = ["uk", "en", "ru", "es"];
      Object.values(RANK_NAMES).forEach((translations) => {
        locales.forEach((loc) => {
          expect(translations).toHaveProperty(loc);
          expect(typeof translations[loc]).toBe("string");
        });
      });
    });
  });

  describe("HOROSCOPE_GRADIENT", () => {
    it("should be a non-empty string", () => {
      expect(typeof HOROSCOPE_GRADIENT).toBe("string");
      expect(HOROSCOPE_GRADIENT.length).toBeGreaterThan(0);
    });
  });

  describe("getZodiacIcon", () => {
    it("should return null for null input", () => {
      expect(getZodiacIcon(null)).toBeNull();
    });

    it("should return an icon string for a valid zodiac sign", () => {
      const icon = getZodiacIcon("aries");
      expect(typeof icon).toBe("string");
      expect(icon!.length).toBeGreaterThan(0);
    });

    it("should return null for an unknown sign", () => {
      expect(getZodiacIcon("notasign")).toBeNull();
    });
  });
});
