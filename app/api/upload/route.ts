import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { classifyIncident } from '@/lib/classifier';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // ── Parse FormData ──
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are accepted' }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File exceeds 10 MB limit' }, { status: 400 });
    }

    // ── Supabase server client (service role for storage + inserts) ──
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: () => {},
        },
      }
    );

    // ── Authenticate user (using anon key client for session) ──
    const anonClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: () => {},
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await anonClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── Extract text from PDF ──
    const buffer = Buffer.from(await file.arrayBuffer());
    
    let extractedText = '';
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require('pdf-parse') as (buffer: Buffer) => Promise<{ text: string }>;
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text?.trim() ?? '';
    } catch (pdfErr) {
      console.error('PDF parse error:', pdfErr);
      extractedText = '';
    }

    if (!extractedText) {
      return NextResponse.json({ error: 'No readable text found' }, { status: 400 });
    }

    // ── Classify ──
    const classification = classifyIncident(extractedText);

    // ── Upload to Storage ──
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${user.id}/${timestamp}-${safeName}`;

    const { error: storageError } = await supabase.storage
      .from('incident-files')
      .upload(storagePath, buffer, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (storageError) {
      console.error('Storage error:', storageError);
      // Continue even if storage fails
    }

    // ── Insert incident ──
    const { data: incident, error: incidentError } = await supabase
      .from('incidents')
      .insert({
        user_id: user.id,
        original_filename: file.name,
        storage_path: storageError ? null : storagePath,
        extracted_text: extractedText,
        crime_type: classification.crime_type,
        severity: classification.severity,
        location_text: classification.location_text,
        incident_date: classification.incident_date,
        confidence_score: classification.confidence_score,
        status: 'Open',
      })
      .select('id')
      .single();

    if (incidentError || !incident) {
      console.error('Incident insert error:', incidentError);
      return NextResponse.json({ error: 'Failed to save incident' }, { status: 500 });
    }

    const incidentId = incident.id;

    // ── Batch insert entities + tags in parallel ──
    await Promise.all([
      classification.entities.length > 0
        ? supabase.from('entities').insert(
            classification.entities.map((e) => ({
              incident_id: incidentId,
              entity_type: e.entity_type,
              entity_value: e.entity_value,
            }))
          )
        : Promise.resolve(),

      classification.tags.length > 0
        ? supabase.from('tags').insert(
            classification.tags.map((tag) => ({
              incident_id: incidentId,
              tag,
            }))
          )
        : Promise.resolve(),
    ]);

    // ── Audit log ──
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'upload',
      metadata: {
        incident_id: incidentId,
        filename: file.name,
        crime_type: classification.crime_type,
        severity: classification.severity,
        confidence_score: classification.confidence_score,
      },
    });

    return NextResponse.json({
      success: true,
      incidentId,
      category: classification.crime_type,
      severity: classification.severity,
    });
  } catch (err) {
    console.error('Upload route error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
