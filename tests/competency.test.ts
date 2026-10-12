import { describe, it, expect } from "vitest";

describe("Competency Model & Weight Calculations", () => {
  const curricularWeights = {
    hardware_safety: 35.0,
    color_oris: 25.0,
    metis_scanning: 15.0,
    customer_docs: 15.0,
    company_interview: 10.0,
  };

  it("should sum curricular weights to exactly 100%", () => {
    const sum = Object.values(curricularWeights).reduce((a, b) => a + b, 0);
    expect(sum).toBe(100.0);
  });

  it("should compute weighted composite readiness score correctly", () => {
    const candidateScores = {
      hardware_safety: 80.0,
      color_oris: 70.0,
      metis_scanning: 60.0,
      customer_docs: 90.0,
      company_interview: 85.0,
    };

    const weightedTotal =
      (candidateScores.hardware_safety * curricularWeights.hardware_safety) / 100 +
      (candidateScores.color_oris * curricularWeights.color_oris) / 100 +
      (candidateScores.metis_scanning * curricularWeights.metis_scanning) / 100 +
      (candidateScores.customer_docs * curricularWeights.customer_docs) / 100 +
      (candidateScores.company_interview * curricularWeights.company_interview) / 100;

    // 80*0.35 + 70*0.25 + 60*0.15 + 90*0.15 + 85*0.10
    // = 28 + 17.5 + 9 + 13.5 + 8.5 = 76.5
    expect(weightedTotal).toBe(76.5);
  });
});
