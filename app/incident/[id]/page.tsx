import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Entity, Tag } from '@/lib/types';
import SeverityBadge from '@/components/ui/SeverityBadge';
import BackButton from './BackButton';
import { MapPin, Calendar, FileText, Tag as TagIcon, Users } from 'lucide-react';

const ENTITY_TYPE_COLOR: Record<string, string> = {
  suspect: '#ff4444',
  victim: '#ff8c00',
  witness: '#f6c90e',
  location: '#00d4ff',
  weapon: '#6c63ff',
  vehicle: '#00e676',
};

export default async function IncidentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const [incidentRes, entitiesRes, tagsRes] = await Promise.all([
    supabase.from('incidents').select('*').eq('id', id).eq('user_id', user.id).single(),
    supabase.from('entities').select('*').eq('incident_id', id),
    supabase.from('tags').select('*').eq('incident_id', id),
  ]);

  if (incidentRes.error || !incidentRes.data) notFound();

  const incident = incidentRes.data;
  const entities: Entity[] = entitiesRes.data ?? [];
  const tags: Tag[] = tagsRes.data ?? [];

  const cardStyle: React.CSSProperties = {
    background: '#111318',
    border: '1px solid #1e2330',
    borderRadius: '12px',
    padding: '24px',
  };

  const labelStyle: React.CSSProperties = {
    color: '#4a5568',
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '4px',
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Back button */}
      <BackButton />

      {/* Page title */}
      <div style={{ marginBottom: '24px', marginTop: '16px' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#e2e8f0' }}>
          {incident.original_filename ?? 'Incident Report'}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
          <SeverityBadge severity={incident.severity} />
          <span style={{ color: '#00d4ff', fontWeight: 600, fontSize: '14px' }}>
            {incident.crime_type}
          </span>
          <span style={{ color: '#4a5568', fontSize: '13px' }}>
            Status: <span style={{ color: incident.status === 'Open' ? '#00d4ff' : '#4a5568' }}>{incident.status}</span>
          </span>
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
        {/* Left: Main card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Metadata */}
          <div style={cardStyle}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div>
                <p style={labelStyle}><MapPin size={10} style={{ display: 'inline', marginRight: '4px' }} />Location</p>
                <p style={{ margin: 0, color: '#e2e8f0', fontSize: '14px' }}>{incident.location_text ?? '—'}</p>
              </div>
              <div>
                <p style={labelStyle}><Calendar size={10} style={{ display: 'inline', marginRight: '4px' }} />Incident Date</p>
                <p style={{ margin: 0, color: '#e2e8f0', fontSize: '14px' }}>{incident.incident_date ?? '—'}</p>
              </div>
              <div>
                <p style={labelStyle}>Confidence</p>
                <p style={{ margin: 0, color: '#6c63ff', fontSize: '20px', fontWeight: 700 }}>
                  {incident.confidence_score.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Extracted text */}
          {incident.extracted_text && (
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <FileText size={16} color="#4a5568" />
                <h2 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Extracted Text
                </h2>
              </div>
              <p style={{
                margin: 0,
                color: '#a0aec0',
                fontSize: '13px',
                lineHeight: '1.8',
                whiteSpace: 'pre-wrap',
                maxHeight: '320px',
                overflowY: 'auto',
                padding: '14px',
                background: '#0a0c10',
                borderRadius: '8px',
                border: '1px solid #1e2330',
              }}>
                {incident.extracted_text.slice(0, 2000)}
                {incident.extracted_text.length > 2000 ? '...' : ''}
              </p>
            </div>
          )}
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Entities */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Users size={16} color="#4a5568" />
              <h2 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Extracted Entities
              </h2>
            </div>
            {entities.length === 0 ? (
              <p style={{ margin: 0, color: '#4a5568', fontSize: '13px' }}>No entities extracted.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {entities.map((ent) => (
                  <div
                    key={ent.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      padding: '10px 12px',
                      background: '#0a0c10',
                      borderRadius: '8px',
                      border: '1px solid #1e2330',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: ENTITY_TYPE_COLOR[ent.entity_type] ?? '#6c63ff',
                        flexShrink: 0,
                        paddingTop: '2px',
                        minWidth: '60px',
                      }}
                    >
                      {ent.entity_type}
                    </span>
                    <span style={{ color: '#e2e8f0', fontSize: '13px', wordBreak: 'break-word' }}>
                      {ent.entity_value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <TagIcon size={16} color="#4a5568" />
                <h2 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Tags
                </h2>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {tags.map((t) => (
                  <span
                    key={t.id}
                    style={{
                      padding: '4px 12px',
                      background: 'rgba(108,99,255,0.08)',
                      border: '1px solid rgba(108,99,255,0.25)',
                      borderRadius: '20px',
                      color: '#6c63ff',
                      fontSize: '12px',
                      fontWeight: 500,
                    }}
                  >
                    {t.tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
