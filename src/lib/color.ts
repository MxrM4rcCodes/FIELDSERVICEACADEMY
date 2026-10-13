export interface LabColor {
  L: number;
  a: number;
  b: number;
}

function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

function hueAngle(a: number, b: number): number {
  if (a === 0 && b === 0) return 0;
  const degrees = radiansToDegrees(Math.atan2(b, a));
  return degrees < 0 ? degrees + 360 : degrees;
}

/** Euclidean CIE 1976 Lab difference. Inputs must use the same Lab reference. */
export function deltaE76(first: LabColor, second: LabColor): number {
  return Math.hypot(second.L - first.L, second.a - first.a, second.b - first.b);
}

/**
 * CIEDE2000 (CIE ΔE00), following the published equations and Sharma et al.'s
 * test pairs. A number is not a pass/fail decision: acceptance depends on the
 * agreed target, measurement condition, instrument, substrate, and tolerance.
 */
export function deltaE00(first: LabColor, second: LabColor): number {
  const { L: L1, a: a1, b: b1 } = first;
  const { L: L2, a: a2, b: b2 } = second;
  const values = [L1, a1, b1, L2, a2, b2];
  if (!values.every(Number.isFinite)) return Number.NaN;

  const C1 = Math.hypot(a1, b1);
  const C2 = Math.hypot(a2, b2);
  const Cbar = (C1 + C2) / 2;
  const Cbar7 = Cbar ** 7;
  const twentyFive7 = 25 ** 7;
  const G = 0.5 * (1 - Math.sqrt(Cbar7 / (Cbar7 + twentyFive7)));
  const a1Prime = (1 + G) * a1;
  const a2Prime = (1 + G) * a2;
  const C1Prime = Math.hypot(a1Prime, b1);
  const C2Prime = Math.hypot(a2Prime, b2);
  const h1Prime = hueAngle(a1Prime, b1);
  const h2Prime = hueAngle(a2Prime, b2);

  const deltaLPrime = L2 - L1;
  const deltaCPrime = C2Prime - C1Prime;
  let deltaHueAngle = 0;
  if (C1Prime * C2Prime !== 0) {
    const hueDifference = h2Prime - h1Prime;
    if (Math.abs(hueDifference) <= 180) deltaHueAngle = hueDifference;
    else if (hueDifference > 180) deltaHueAngle = hueDifference - 360;
    else deltaHueAngle = hueDifference + 360;
  }
  const deltaHPrime = 2 * Math.sqrt(C1Prime * C2Prime)
    * Math.sin(degreesToRadians(deltaHueAngle / 2));

  const LbarPrime = (L1 + L2) / 2;
  const CbarPrime = (C1Prime + C2Prime) / 2;
  let hbarPrime = h1Prime + h2Prime;
  if (C1Prime * C2Prime === 0) {
    hbarPrime = h1Prime + h2Prime;
  } else if (Math.abs(h1Prime - h2Prime) <= 180) {
    hbarPrime = (h1Prime + h2Prime) / 2;
  } else if (h1Prime + h2Prime < 360) {
    hbarPrime = (h1Prime + h2Prime + 360) / 2;
  } else {
    hbarPrime = (h1Prime + h2Prime - 360) / 2;
  }

  const T = 1
    - 0.17 * Math.cos(degreesToRadians(hbarPrime - 30))
    + 0.24 * Math.cos(degreesToRadians(2 * hbarPrime))
    + 0.32 * Math.cos(degreesToRadians(3 * hbarPrime + 6))
    - 0.20 * Math.cos(degreesToRadians(4 * hbarPrime - 63));
  const deltaTheta = 30 * Math.exp(-(((hbarPrime - 275) / 25) ** 2));
  const CbarPrime7 = CbarPrime ** 7;
  const RC = 2 * Math.sqrt(CbarPrime7 / (CbarPrime7 + twentyFive7));
  const LOffset = LbarPrime - 50;
  const SL = 1 + (0.015 * LOffset ** 2) / Math.sqrt(20 + LOffset ** 2);
  const SC = 1 + 0.045 * CbarPrime;
  const SH = 1 + 0.015 * CbarPrime * T;
  const RT = -Math.sin(degreesToRadians(2 * deltaTheta)) * RC;

  const lTerm = deltaLPrime / SL;
  const cTerm = deltaCPrime / SC;
  const hTerm = deltaHPrime / SH;
  const radicand = lTerm ** 2 + cTerm ** 2 + hTerm ** 2 + RT * cTerm * hTerm;
  return Math.sqrt(Math.max(0, radicand));
}
