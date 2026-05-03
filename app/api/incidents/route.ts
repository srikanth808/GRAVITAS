import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient(
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
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── Query params ──
    const { searchParams } = new URL(request.url);
    const crime_type = searchParams.get('crime_type');
    const severity = searchParams.get('severity');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // ── Build query ──
    let query = supabase
      .from('incidents')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('uploaded_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (crime_type) query = query.eq('crime_type', crime_type);
    if (severity) query = query.eq('severity', severity);
    if (status) query = query.eq('status', status);
    if (search) query = query.ilike('extracted_text', `%${search}%`);

    const { data: incidents, error: incError, count } = await query;

    if (incError) {
      console.error('Incidents query error:', incError);
      return NextResponse.json({ error: 'Failed to fetch incidents' }, { status: 500 });
    }

    // ── Fetch tags for fetched incidents ──
    const incidentIds = (incidents ?? []).map((i: { id: string }) => i.id);
    let tagsMap: Record<string, { id: string; incident_id: string; tag: string }[]> = {};

    if (incidentIds.length > 0) {
      const { data: tags } = await supabase
        .from('tags')
        .select('*')
        .in('incident_id', incidentIds);

      if (tags) {
        tagsMap = tags.reduce((acc: Record<string, typeof tags>, tag) => {
          if (!acc[tag.incident_id]) acc[tag.incident_id] = [];
          acc[tag.incident_id].push(tag);
          return acc;
        }, {});
      }
    }

    // ── Merge tags into incidents ──
    const enriched = (incidents ?? []).map((inc: { id: string }) => ({
      ...inc,
      tags: tagsMap[inc.id] ?? [],
    }));

    const total = count ?? 0;
    const page = Math.floor(offset / limit) + 1;

    return NextResponse.json({
      incidents: enriched,
      total,
      page,
      hasMore: offset + limit < total,
    });
  } catch (err) {
    console.error('Incidents route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
