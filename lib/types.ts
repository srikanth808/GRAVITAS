// ─── Enums / Literals ────────────────────────────────────────────────────────

export type CrimeType =
  | 'Theft'
  | 'Assault'
  | 'Fraud'
  | 'Cybercrime'
  | 'Vandalism'
  | 'Drug Offense'
  | 'Missing Person'
  | 'Other';

export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';

export type IncidentStatus = 'Open' | 'Under Investigation' | 'Closed';

export type EntityType =
  | 'suspect'
  | 'victim'
  | 'witness'
  | 'location'
  | 'weapon'
  | 'vehicle';

// ─── Database Rows ────────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  name: string;
  role: 'analyst' | 'admin';
  created_at: string;
}

export interface Incident {
  id: string;
  user_id: string;
  original_filename: string | null;
  storage_path: string | null;
  extracted_text: string | null;
  crime_type: CrimeType;
  severity: Severity;
  location_text: string | null;
  incident_date: string | null;
  status: IncidentStatus;
  confidence_score: number;
  uploaded_at: string;
  // Joined
  tags?: Tag[];
  entities?: Entity[];
}

export interface Entity {
  id: string;
  incident_id: string;
  entity_type: EntityType;
  entity_value: string;
}

export interface Tag {
  id: string;
  incident_id: string;
  tag: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  metadata: Record<string, unknown>;
  performed_at: string;
}

// ─── Classifier ───────────────────────────────────────────────────────────────

export interface EntityResult {
  entity_type: EntityType;
  entity_value: string;
}

export interface ClassificationResult {
  crime_type: CrimeType;
  severity: Severity;
  entities: EntityResult[];
  tags: string[];
  location_text: string;
  incident_date: string | null;
  confidence_score: number;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface StatsResponse {
  total: number;
  critical: number;
  open: number;
  this_week: number;
  by_crime: { crime_type: string; count: number }[];
  by_severity: { severity: string; count: number }[];
}

export interface IncidentsResponse {
  incidents: Incident[];
  total: number;
  page: number;
  hasMore: boolean;
}
