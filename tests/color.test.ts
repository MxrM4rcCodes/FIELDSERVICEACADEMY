import { describe, it, expect } from "vitest";

describe("Color Science & Delta E Algorithms", () => {
  it("should calculate exact Delta E 76 Euclidean distance", () => {
    const L1 = 50.0, a1 = 60.0, b1 = 40.0;
    const L2 = 53.0, a2 = 64.0, b2 = 40.0;
    // dL = 3, da = 4, db = 0 => sqrt(9 + 16 + 0) = 5.0
    const dL = L2 - L1;
    const da = a2 - a1;
    const db = b2 - b1;
    const deltaE76 = Math.sqrt(dL * dL + da * da + db * db);
    expect(deltaE76).toBe(5.0);
  });

  it("should evaluate Delta E within commercial tolerance thresholds", () => {
    const evaluateTolerance = (de: number) => {
      if (de <= 1.0) return "imperceptible";
      if (de <= 2.0) return "commercial_pass";
      if (de <= 3.5) return "marginal";
      return "unacceptable";
    };

    expect(evaluateTolerance(0.65)).toBe("imperceptible");
    expect(evaluateTolerance(1.42)).toBe("commercial_pass");
    expect(evaluateTolerance(2.80)).toBe("marginal");
    expect(evaluateTolerance(6.20)).toBe("unacceptable");
  });
});
