const PREFIXES: Record<string, string> = {
  dr: 'Dr.',
  drs: 'Drs.',
  dra: 'Dra.',
  ir: 'Ir.',
  prof: 'Prof.',
  h: 'H.',
  hj: 'Hj.',
  kh: 'KH.',
  ust: 'Ust.',
};

const DEGREES: Record<string, string> = {
  st: 'S.T.',
  mt: 'M.T.',
  si: 'S.I.',
  psi: 'S.Psi.',
  spsi: 'S.Psi.',
  sh: 'S.H.',
  mh: 'M.H.',
  mm: 'M.M.',
  msi: 'M.Si.',
  mba: 'M.B.A.',
  ms: 'M.S.',
  sds: 'S.Ds.',
  sn: 'S.Sn.',
  mds: 'M.Ds.',
  ss: 'S.S.',
  hum: 'M.Hum.',
  mphil: 'M.Phil.',
  phd: 'Ph.D.',
  ca: 'CA.',
  cpa: 'CPA.',
};

const LOWERCASE_PARTICLES = new Set(['al', 'bin', 'binti', 'da', 'de', 'del', 'der', 'di', 'la', 'le', 'van', 'von']);

function compactToken(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function titleCaseWord(word: string, index: number): string {
  const lower = word.toLowerCase();
  const upper = word.toUpperCase();
  if (/^[a-z]\.?$/i.test(word)) return `${word.charAt(0).toUpperCase()}.`;
  if (index > 0 && LOWERCASE_PARTICLES.has(lower)) return lower;
  if (word !== lower && word !== upper) return word;

  return lower
    .split('-')
    .map((part) => (part ? `${part.charAt(0).toUpperCase()}${part.slice(1)}` : part))
    .join('-');
}

function formatNamePart(value: string): string {
  const words = value.trim().split(/\s+/).filter(Boolean);
  return words
    .map((word, index) => (index === 0 && PREFIXES[compactToken(word)] ? PREFIXES[compactToken(word)] : titleCaseWord(word, index)))
    .join(' ');
}

function formatDegree(value: string): string {
  const trimmed = value.trim();
  return DEGREES[compactToken(trimmed)] || trimmed;
}

/**
 * Merapikan presentasi nama tanpa melakukan koreksi ejaan personal.
 */
export function formatIndonesianName(value: string): string {
  const parts = value.trim().split(/\s*,\s*/).filter(Boolean);
  if (parts.length === 0) return '';

  const [name, ...degrees] = parts;
  return [formatNamePart(name), ...degrees.map(formatDegree)].join(', ');
}
