export interface SeedReference {
  id: string;
  lessonId?: string;
  title: string;
  citation: string;
  confidenceLevel: string;
  notes: string;
}

export const seedReferences: SeedReference[] = [
  {
    id: "ref_01",
    title: "CGS ORIS and METIS public product overviews",
    citation: "https://www.cgs-oris.com/en/software/ ; https://www.cgs-oris.com/en/metis-scanner",
    confidenceLevel: "official_public_overview",
    notes: "Supports product-family and product-name orientation only. It does not establish any customer's installed configuration, current version, license, integration, job requirements, or model-specific service procedure.",
  },
  {
    id: "ref_02",
    title: "OSHA 29 CFR 1910.147 — The control of hazardous energy (lockout/tagout)",
    citation: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147",
    confidenceLevel: "primary_regulatory_source",
    notes: "Primary source for the standard's scope and employer energy-control program requirements. Applicability, exceptions, training, authorization, and machine-specific procedures must be determined by the employer and qualified personnel. This academy is not an energy-control procedure.",
  },
  {
    id: "ref_03",
    title: "ISO 13655:2017 — Graphic technology: spectral measurement and colorimetric computation",
    citation: "https://www.iso.org/standard/65430.html",
    confidenceLevel: "primary_standards_source",
    notes: "The official ISO abstract describes measurement procedures and colorimetric computation for graphic-arts images. Use the applicable full standard, instrument documentation, and customer specification for actual work; no single M condition or ΔE tolerance is universal.",
  },
  {
    id: "ref_04",
    title: "Conceptual industrial-printer functional model",
    citation: "Independent educational diagram; no Platinum Technologies service manual, schematic, or model-specific specification is represented.",
    confidenceLevel: "conceptual_model",
    notes: "The map groups possible functions for learning and hypothesis generation. Actual technologies, components, materials, values, options, and procedures vary by exact model and configuration.",
  },
  {
    id: "ref_05",
    title: "METIS scanner family and EDS GAMMA public pages",
    citation: "https://www.cgs-oris.com/en/metis-scanner ; https://www.metis-group.com/product/eds-gamma ; https://www.metis-group.com/cultural-heritage",
    confidenceLevel: "official_public_product_pages",
    notes: "Supports public family context and the official EDS GAMMA description. Do not generalize product-specific features, output, calibration, maintenance, or specifications to other METIS models.",
  },
  {
    id: "ref_06",
    title: "CGS ORIS public software overview",
    citation: "https://www.cgs-oris.com/en/software/",
    confidenceLevel: "official_public_overview",
    notes: "Supports portfolio-name orientation for products listed on the public page. For feature, version, license, format, integration, or service claims, consult current product-specific documentation or authorized support.",
  },
  {
    id: "ref_07",
    title: "Sharma, Wu, and Dalal — The CIEDE2000 Color-Difference Formula",
    citation: "https://doi.org/10.1002/col.20070",
    confidenceLevel: "peer_reviewed_formula_reference",
    notes: "Technical reference for the CIEDE2000 color-difference formula. A formula does not specify a universal acceptance limit; use the applicable target, measurement conditions, and agreed tolerance.",
  },
  {
    id: "ref_08",
    title: "IETF RFC 9293 — Transmission Control Protocol (TCP)",
    citation: "https://www.rfc-editor.org/rfc/rfc9293",
    confidenceLevel: "primary_protocol_standard",
    notes: "Protocol reference for basic network workflow education. It does not specify a customer's print network, RIP, device interface, IP settings, or approved troubleshooting changes.",
  },
];
