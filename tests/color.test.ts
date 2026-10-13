import { describe, expect, it } from "vitest";
import { deltaE00, deltaE76 } from "../src/lib/color";

describe("CIE Lab color-difference calculations", () => {
  it("calculates CIE 1976 Euclidean distance", () => {
    expect(deltaE76({ L: 50, a: 60, b: 40 }, { L: 53, a: 64, b: 40 })).toBe(5);
  });

  it("matches published CIEDE2000 test data", () => {
    // Sharma, Wu & Dalal (2005), supplementary CIEDE2000 test pairs.
    const pairs: Array<[number[], number[], number]> = [
      [[50, 2.6772, -79.7751], [50, 0, -82.7485], 2.0425],
      [[50, 3.1571, -77.2803], [50, 0, -82.7485], 2.8615],
      [[50, 2.8361, -74.0200], [50, 0, -82.7485], 3.4412],
      [[50, -1.3802, -84.2814], [50, 0, -82.7485], 1.0000],
      [[50, -1.1848, -84.8006], [50, 0, -82.7485], 1.0000],
      [[50, -0.9009, -85.5211], [50, 0, -82.7485], 1.0000],
      [[50, 0, 0], [50, -1, 2], 2.3669],
    ];

    for (const [first, second, expected] of pairs) {
      const actual = deltaE00(
        { L: first[0], a: first[1], b: first[2] },
        { L: second[0], a: second[1], b: second[2] },
      );
      expect(actual).toBeCloseTo(expected, 4);
    }
  });

  it("returns no misleading pass/fail rating and rejects non-finite inputs", () => {
    expect(Number.isNaN(deltaE00({ L: Number.NaN, a: 0, b: 0 }, { L: 50, a: 0, b: 0 }))).toBe(true);
  });
});
