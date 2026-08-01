import type { Incident, StatsResponse, ClassificationResult } from './types';

export const INITIAL_MOCK_INCIDENTS: Incident[] = [
  {
    id: 'inc-1001',
    user_id: 'demo-user',
    original_filename: 'FIR_2026_0728_THEFT_TNAGAR.pdf',
    storage_path: null,
    extracted_text: 'FIRST INFORMATION REPORT. On 28 July 2026, complainant Meena Sundaram reported theft of gold jewelry worth Rs 2,50,000 and cash from her residence at Usman Road, T. Nagar. Suspect Rajesh Kumar was observed fleeing on vehicle TN 09 BK 4521. Case registered under IPC 379.',
    crime_type: 'Theft',
    severity: 'Medium',
    location_text: 'Usman Road, T. Nagar',
    incident_date: '2026-07-28',
    status: 'Open',
    confidence_score: 92.5,
    uploaded_at: '2026-07-28T14:30:00Z',
    tags: [
      { id: 't1', incident_id: 'inc-1001', tag: 'theft' },
      { id: 't2', incident_id: 'inc-1001', tag: 'vehicle' },
      { id: 't3', incident_id: 'inc-1001', tag: 'day' }
    ],
    entities: [
      { id: 'e1', incident_id: 'inc-1001', entity_type: 'victim', entity_value: 'Meena Sundaram' },
      { id: 'e2', incident_id: 'inc-1001', entity_type: 'suspect', entity_value: 'Rajesh Kumar' },
      { id: 'e3', incident_id: 'inc-1001', entity_type: 'location', entity_value: 'Usman Road, T. Nagar' },
      { id: 'e4', incident_id: 'inc-1001', entity_type: 'vehicle', entity_value: 'TN 09 BK 4521' }
    ]
  },
  {
    id: 'inc-1002',
    user_id: 'demo-user',
    original_filename: 'FIR_2026_0729_ARMED_ROBBERY.pdf',
    storage_path: null,
    extracted_text: 'FIRST INFORMATION REPORT. Armed assault and robbery at Anna Salai Commercial Bank. Three masked individuals entered with handguns, injured Officer Suresh, and stole cash boxes. Suspects fled towards Mount Road. Critical incident code 109.',
    crime_type: 'Assault',
    severity: 'Critical',
    location_text: 'Anna Salai Commercial Bank',
    incident_date: '2026-07-29',
    status: 'Under Investigation',
    confidence_score: 96.0,
    uploaded_at: '2026-07-29T10:15:00Z',
    tags: [
      { id: 't4', incident_id: 'inc-1002', tag: 'armed' },
      { id: 't5', incident_id: 'inc-1002', tag: 'weapon' },
      { id: 't6', incident_id: 'inc-1002', tag: 'masked' }
    ],
    entities: [
      { id: 'e5', incident_id: 'inc-1002', entity_type: 'victim', entity_value: 'Officer Suresh' },
      { id: 'e6', incident_id: 'inc-1002', entity_type: 'location', entity_value: 'Anna Salai Commercial Bank' },
      { id: 'e7', incident_id: 'inc-1002', entity_type: 'weapon', entity_value: 'Handgun' }
    ]
  },
  {
    id: 'inc-1003',
    user_id: 'demo-user',
    original_filename: 'FIR_2026_0730_CYBER_PHISHING.pdf',
    storage_path: null,
    extracted_text: 'COMPLAINT REPORT. Cyber fraud incident reported by Anand Ram at Velachery Main Road. Victims received phishing SMS impersonating bank officials, leading to unauthorized transfer of Rs 1,80,000 via spoofed payment portal.',
    crime_type: 'Cybercrime',
    severity: 'High',
    location_text: 'Velachery Main Road',
    incident_date: '2026-07-30',
    status: 'Open',
    confidence_score: 88.0,
    uploaded_at: '2026-07-30T18:45:00Z',
    tags: [
      { id: 't7', incident_id: 'inc-1003', tag: 'phishing' },
      { id: 't8', incident_id: 'inc-1003', tag: 'cyber' },
      { id: 't9', incident_id: 'inc-1003', tag: 'fraud' }
    ],
    entities: [
      { id: 'e8', incident_id: 'inc-1003', entity_type: 'victim', entity_value: 'Anand Ram' },
      { id: 'e9', incident_id: 'inc-1003', entity_type: 'location', entity_value: 'Velachery Main Road' }
    ]
  },
  {
    id: 'inc-1004',
    user_id: 'demo-user',
    original_filename: 'FIR_2026_0725_DRUG_SEIZURE.pdf',
    storage_path: null,
    extracted_text: 'SPECIAL REPORT. Narcotics taskforce intercepted contraband smuggling near ECR Toll Plaza. Suspect Vikram Sethi detained with 2.5kg illegal narcotics in trunk of vehicle TN 07 CD 8899.',
    crime_type: 'Drug Offense',
    severity: 'High',
    location_text: 'ECR Toll Plaza, Mahabalipuram',
    incident_date: '2026-07-25',
    status: 'Under Investigation',
    confidence_score: 91.0,
    uploaded_at: '2026-07-25T08:20:00Z',
    tags: [
      { id: 't10', incident_id: 'inc-1004', tag: 'drugs' },
      { id: 't11', incident_id: 'inc-1004', tag: 'contraband' }
    ],
    entities: [
      { id: 'e10', incident_id: 'inc-1004', entity_type: 'suspect', entity_value: 'Vikram Sethi' },
      { id: 'e11', incident_id: 'inc-1004', entity_type: 'location', entity_value: 'ECR Toll Plaza' },
      { id: 'e12', incident_id: 'inc-1004', entity_type: 'vehicle', entity_value: 'TN 07 CD 8899' }
    ]
  },
  {
    id: 'inc-1005',
    user_id: 'demo-user',
    original_filename: 'FIR_2026_0731_MISSING_PERSON.pdf',
    storage_path: null,
    extracted_text: 'MISSING PERSON REPORT. Complainant reported 16-year-old daughter Priya Shankar missing from Adyar Bus Depot since 18:00 hrs. Last seen wearing blue denim jacket and carrying black backpack.',
    crime_type: 'Missing Person',
    severity: 'Medium',
    location_text: 'Adyar Bus Depot',
    incident_date: '2026-07-31',
    status: 'Open',
    confidence_score: 89.4,
    uploaded_at: '2026-07-31T21:00:00Z',
    tags: [
      { id: 't12', incident_id: 'inc-1005', tag: 'missing' },
      { id: 't13', incident_id: 'inc-1005', tag: 'last seen' }
    ],
    entities: [
      { id: 'e13', incident_id: 'inc-1005', entity_type: 'victim', entity_value: 'Priya Shankar' },
      { id: 'e14', incident_id: 'inc-1005', entity_type: 'location', entity_value: 'Adyar Bus Depot' }
    ]
  },
  {
    id: 'inc-1006',
    user_id: 'demo-user',
    original_filename: 'FIR_2026_0720_CORPORATE_FRAUD.pdf',
    storage_path: null,
    extracted_text: 'FINANCIAL CRIME INVESTIGATION. Corporate forgery and embezzlement complaint filed against Ramesh Patel at OMR IT Corridor office. Audit revealed altered ledger documents totaling Rs 45,00,000.',
    crime_type: 'Fraud',
    severity: 'Medium',
    location_text: 'OMR IT Corridor, Guindy',
    incident_date: '2026-07-20',
    status: 'Closed',
    confidence_score: 85.0,
    uploaded_at: '2026-07-20T11:00:00Z',
    tags: [
      { id: 't14', incident_id: 'inc-1006', tag: 'forgery' },
      { id: 't15', incident_id: 'inc-1006', tag: 'fraud' }
    ],
    entities: [
      { id: 'e15', incident_id: 'inc-1006', entity_type: 'suspect', entity_value: 'Ramesh Patel' },
      { id: 'e16', incident_id: 'inc-1006', entity_type: 'location', entity_value: 'OMR IT Corridor' }
    ]
  },
  {
    id: 'inc-1007',
    user_id: 'demo-user',
    original_filename: 'FIR_2026_0722_VANDALISM_MARINA.pdf',
    storage_path: null,
    extracted_text: 'INCIDENT REPORT. Public property defacement and graffiti vandalism at Marina Beach Promenade near Light House. Municipal CCTV captured three unidentified suspects damaging public benches.',
    crime_type: 'Vandalism',
    severity: 'Low',
    location_text: 'Marina Beach Light House',
    incident_date: '2026-07-22',
    status: 'Closed',
    confidence_score: 94.0,
    uploaded_at: '2026-07-22T16:30:00Z',
    tags: [
      { id: 't16', incident_id: 'inc-1007', tag: 'vandalism' },
      { id: 't17', incident_id: 'inc-1007', tag: 'graffiti' }
    ],
    entities: [
      { id: 'e17', incident_id: 'inc-1007', entity_type: 'location', entity_value: 'Marina Beach Light House' }
    ]
  },
  {
    id: 'inc-1008',
    user_id: 'demo-user',
    original_filename: 'FIR_2026_0801_RANSOMWARE_AMBATTUR.pdf',
    storage_path: null,
    extracted_text: 'CRITICAL CYBER INCIDENT. Ransomware attack encrypted server infrastructure at Ambattur Industrial Estate logistics hub. Perpetrators under name BlackHat Group demanding cryptocurrency. Operations paralyzed.',
    crime_type: 'Cybercrime',
    severity: 'Critical',
    location_text: 'Ambattur Industrial Estate',
    incident_date: '2026-08-01',
    status: 'Under Investigation',
    confidence_score: 97.5,
    uploaded_at: '2026-08-01T09:00:00Z',
    tags: [
      { id: 't18', incident_id: 'inc-1008', tag: 'ransomware' },
      { id: 't19', incident_id: 'inc-1008', tag: 'cyber' }
    ],
    entities: [
      { id: 'e18', incident_id: 'inc-1008', entity_type: 'suspect', entity_value: 'BlackHat Group' },
      { id: 'e19', incident_id: 'inc-1008', entity_type: 'location', entity_value: 'Ambattur Industrial Estate' }
    ]
  }
];

// Global in-memory store for server runtime fallback
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalStore = global as any;
if (!globalStore.__MOCK_INCIDENTS__) {
  globalStore.__MOCK_INCIDENTS__ = [...INITIAL_MOCK_INCIDENTS];
}

export function getMockIncidents(): Incident[] {
  return globalStore.__MOCK_INCIDENTS__ as Incident[];
}

export function addMockIncident(incident: Incident) {
  globalStore.__MOCK_INCIDENTS__.unshift(incident);
}

export function getMockStats(): StatsResponse {
  const incidents = getMockIncidents();
  const total = incidents.length;
  const critical = incidents.filter((i) => i.severity === 'Critical').length;
  const open = incidents.filter((i) => i.status === 'Open').length;
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const this_week = incidents.filter((i) => new Date(i.uploaded_at) >= sevenDaysAgo).length;

  const crimeMap: Record<string, number> = {};
  const severityMap: Record<string, number> = {};

  for (const inc of incidents) {
    crimeMap[inc.crime_type] = (crimeMap[inc.crime_type] ?? 0) + 1;
    severityMap[inc.severity] = (severityMap[inc.severity] ?? 0) + 1;
  }

  return {
    total,
    critical,
    open,
    this_week,
    by_crime: Object.entries(crimeMap).map(([crime_type, count]) => ({ crime_type, count })),
    by_severity: Object.entries(severityMap).map(([severity, count]) => ({ severity, count })),
  };
}
