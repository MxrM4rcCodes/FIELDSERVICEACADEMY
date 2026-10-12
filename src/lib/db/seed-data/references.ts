export interface SeedReference {
  id: string;
  lessonId?: string;
  title: string;
  citation: string;
  confidenceLevel: string; // 'confirmed_spec', 'industry_standard', 'conceptual_model'
  notes: string;
}

export const seedReferences: SeedReference[] = [
  {
    id: "ref_01",
    title: "CGS ORIS Americas Field Service Specification",
    citation: "CGS ORIS Americas Operations Manual, Plymouth MN Facility (2024-2026)",
    confidenceLevel: "confirmed_spec",
    notes: "Defines Plymouth MN demonstration center, pre-shipment bench testing, staging, and technical dispatch role.",
  },
  {
    id: "ref_02",
    title: "OSHA 29 CFR 1910.147 Control of Hazardous Energy (Lockout/Tagout)",
    citation: "United States Department of Labor, Occupational Safety and Health Administration",
    confidenceLevel: "industry_standard",
    notes: "Mandatory zero-energy isolation procedures, distinction between E-Stops and physical disconnect padlocks.",
  },
  {
    id: "ref_03",
    title: "ISO 13655:2017 Spectral Measurement and Colorimetric Computation",
    citation: "International Organization for Standardization (ISO) Graphic Technology Standards",
    confidenceLevel: "industry_standard",
    notes: "Defines M0, M1 (D50 with UV), M2 (UV-Cut), and M3 (Polarized) measurement standards for spectrophotometry.",
  },
  {
    id: "ref_04",
    title: "Industrial UV-LED Inkjet Subsystem Architecture",
    citation: "Platinum Technologies Technical Training Guidelines & Subsystem Schematics",
    confidenceLevel: "conceptual_model",
    notes: "Conceptual educational model covering 13 subsystems, negative pressure hydraulics (-3.2 kPa), and linear optical encoders.",
  },
  {
    id: "ref_05",
    title: "METIS Systems Surface Digitizing & Photometric Stereo Manual",
    citation: "METIS Systems s.r.l. (Rome, Italy) PM3D & DRS Technical Documentation",
    confidenceLevel: "confirmed_spec",
    notes: "SynchroLight directional LED illumination, photometric stereo relief/normal map generation, and shading calibration.",
  },
  {
    id: "ref_06",
    title: "CGS ORIS Software Suite Technical Specifications",
    citation: "CGS Publishing Technologies International GmbH (Color Tuner, Press Matcher, X Gamut)",
    confidenceLevel: "confirmed_spec",
    notes: "DeviceLink profiling, 7-color extended gamut separation (ECG), CxF spectral exchange format, and Certified proof verification.",
  },
  {
    id: "ref_07",
    title: "ASTM D3359 Standard Test Methods for Rating Adhesion by Tape Test",
    citation: "ASTM International Technical Standard for Coating and Ink Adhesion",
    confidenceLevel: "industry_standard",
    notes: "Cross-hatch lattice cut method for verifying UV ink polymerization and substrate dyne bonding.",
  },
];
