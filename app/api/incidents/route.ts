import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { getMockIncidents } from '@/lib/mockStore';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const crime_type = searchParams.get('crime_type');
  const severity = searchParams.get('severity');
  const status = searchParams.get('status');
  const search = searchParams.get('search')?.toLowerCase();

  const filterMockIncidents = () => {
    let list = getMockIncidents();
    if (crime_type) list = list.filter((i) => i.crime_type === crime_type);
    if (severity) list = list.filter((i) => i.severity === severity);
    if (status) list = list.filter((i) => i.status === status);
    if (search) {
      list = list.filter(
        (i) =>
          (i.extracted_text && i.extracted_text.toLowerCase().includes(search)) ||
          (i.original_filename && i.original_filename.toLowerCase().includes(search)) ||
          (i.location_text && i.location_text.toLowerCase().includes(search))
      );
    }
    return NextResponse.json({
      incidents: list,
      total: list.length,
      page: 1,
      hasMore: false,
    });
  };

  try {
    const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
    const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

    if (!url || !key) {
      return filterMockIncidents();
    }

    const supabase = createServerClient(url, key, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: () => {},
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return filterMockIncidents();
    }

    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

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

    if (incError || !incidents || incidents.length === 0) {
      return filterMockIncidents();
    }

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
    return filterMockIncidents();
  }
}
