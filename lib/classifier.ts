import type { CrimeType, Severity, EntityResult, ClassificationResult } from './types';

// ─── Crime Keywords ───────────────────────────────────────────────────────────

const CRIME_KEYWORDS: Record<CrimeType, string[]> = {
  Theft:           ['stolen', 'theft', 'robbery', 'burglary', 'pickpocket', 'snatched'],
  Assault:         ['assault', 'attack', 'violence', 'beat', 'stabbed', 'injured', 'wounded'],
  Fraud:           ['fraud', 'scam', 'cheated', 'forgery', 'impersonation', 'deceived'],
  Cybercrime:      ['hacked', 'phishing', 'ransomware', 'cyber', 'data breach', 'malware'],
  Vandalism:       ['vandalism', 'damaged', 'graffiti', 'destroyed', 'defaced'],
  'Drug Offense':  ['drugs', 'narcotic', 'cocaine', 'heroin', 'smuggling', 'contraband'],
  'Missing Person':['missing', 'disappeared', 'kidnapped', 'abducted', 'last seen'],
  Other:           [],
};

// ─── Severity Keywords ────────────────────────────────────────────────────────

const SEVERITY_KEYWORDS: Record<Severity, string[]> = {
  Critical: ['murder', 'homicide', 'bomb', 'terrorist', 'hostage', 'armed', 'killed', 'dead'],
  High:     ['assault', 'stabbed', 'weapon', 'gun', 'bleeding', 'unconscious', 'abducted'],
  Medium:   ['robbery', 'fraud', 'threat', 'drugs', 'vandalism', 'missing'],
  Low:      ['theft', 'shoplifting', 'minor', 'lost', 'complaint', 'dispute'],
};

// ─── Extra Tags ───────────────────────────────────────────────────────────────

const EXTRA_TAGS = [
  'night', 'day', 'witness', 'weapon', 'vehicle',
  'repeat offender', 'armed', 'masked',
];

// ─── Month Names (for date parsing) ──────────────────────────────────────────

const MONTHS: Record<string, string> = {
  january: '01', february: '02', march: '03', april: '04',
  may: '05', june: '06', july: '07', august: '08',
  september: '09', october: '10', november: '11', december: '12',
  jan: '01', feb: '02', mar: '03', apr: '04', jun: '06',
  jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function countKeywords(text: string, keywords: string[]): number {
  const lower = text.toLowerCase();
  return keywords.reduce((count, kw) => count + (lower.includes(kw) ? 1 : 0), 0);
}

function extractEntities(text: string): EntityResult[] {
  const entities: EntityResult[] = [];

  // Suspect names
  const suspectRe = /suspect[:\s]+([A-Z][a-z]+ [A-Z][a-z]+)/g;
  let m: RegExpExecArray | null;
  while ((m = suspectRe.exec(text)) !== null) {
    entities.push({ entity_type: 'suspect', entity_value: m[1].trim() });
  }

  // Victim names
  const victimRe = /victim[:\s]+([A-Z][a-z]+ [A-Z][a-z]+)/g;
  while ((m = victimRe.exec(text)) !== null) {
    entities.push({ entity_type: 'victim', entity_value: m[1].trim() });
  }

  // Vehicle plates (e.g., TN 01 AB 1234 or TN-01-AB-1234)
  const vehicleRe = /\b([A-Z]{2}[\s-]\d{2}[\s-][A-Z]{1,2}[\s-]\d{4})\b/g;
  while ((m = vehicleRe.exec(text)) !== null) {
    entities.push({ entity_type: 'vehicle', entity_value: m[1].trim() });
  }

  // Locations — "at/near/in/from" followed by title-case string
  const locationRe = /(?:at|near|in|from)\s+([A-Z][a-zA-Z\s,]{5,30})/g;
  while ((m = locationRe.exec(text)) !== null) {
    const val = m[1].trim().replace(/[,\s]+$/, '');
    if (val.length > 4) {
      entities.push({ entity_type: 'location', entity_value: val });
    }
  }

  return entities;
}

function extractDate(text: string): string | null {
  // DD/MM/YYYY or DD-MM-YYYY
  const numericRe = /\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})\b/;
  const numericMatch = numericRe.exec(text);
  if (numericMatch) {
    const [, dd, mm, yyyy] = numericMatch;
    return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
  }

  // DD Month YYYY
  const textRe = /\b(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\s+(\d{4})\b/i;
  const textMatch = textRe.exec(text);
  if (textMatch) {
    const [, dd, monthName, yyyy] = textMatch;
    const mm = MONTHS[monthName.toLowerCase()];
    return `${yyyy}-${mm}-${dd.padStart(2, '0')}`;
  }

  return null;
}

function extractTags(text: string): string[] {
  const lower = text.toLowerCase();
  const allKeywords = [
    ...Object.values(CRIME_KEYWORDS).flat(),
    ...EXTRA_TAGS,
  ];
  // Deduplicate
  const uniqueKeywords = [...new Set(allKeywords)];
  return uniqueKeywords.filter((kw) => lower.includes(kw));
}

// ─── Main Classifier ──────────────────────────────────────────────────────────

export function classifyIncident(text: string): ClassificationResult {
  // ── Crime Type ──
  let bestCrime: CrimeType = 'Other';
  let bestScore = 0;

  for (const [crimeType, keywords] of Object.entries(CRIME_KEYWORDS) as [CrimeType, string[]][]) {
    if (crimeType === 'Other') continue;
    const score = countKeywords(text, keywords);
    if (score > bestScore) {
      bestScore = score;
      bestCrime = crimeType;
    }
  }

  // ── Confidence Score ──
  const totalKeywords = bestCrime !== 'Other' ? CRIME_KEYWORDS[bestCrime].length : 1;
  const confidence = Math.min(100, (bestScore / totalKeywords) * 100);

  // ── Severity (priority: Critical → High → Medium → Low) ──
  let severity: Severity = 'Low';
  for (const level of ['Critical', 'High', 'Medium', 'Low'] as Severity[]) {
    if (countKeywords(text, SEVERITY_KEYWORDS[level]) > 0) {
      severity = level;
      break;
    }
  }

  // ── Entities ──
  const entities = extractEntities(text);

  // ── Location ──
  const locationEntity = entities.find((e) => e.entity_type === 'location');
  const location_text = locationEntity ? locationEntity.entity_value : 'Unknown';

  // ── Date ──
  const incident_date = extractDate(text);

  // ── Tags ──
  const tags = extractTags(text);

  return {
    crime_type: bestCrime,
    severity,
    entities,
    tags,
    location_text,
    incident_date,
    confidence_score: Math.round(confidence * 10) / 10,
  };
}
