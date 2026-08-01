import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { getMockStats } from '@/lib/mockStore';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
    const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

    if (!url || !key) {
      return NextResponse.json(getMockStats());
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
      return NextResponse.json(getMockStats());
    }

    const uid = user.id;
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [totalRes, criticalRes, openRes, thisWeekRes, allIncidentsRes] = await Promise.all([
      supabase.from('incidents').select('*', { count: 'exact', head: true }).eq('user_id', uid),
      supabase.from('incidents').select('*', { count: 'exact', head: true }).eq('user_id', uid).eq('severity', 'Critical'),
      supabase.from('incidents').select('*', { count: 'exact', head: true }).eq('user_id', uid).eq('status', 'Open'),
      supabase.from('incidents').select('*', { count: 'exact', head: true }).eq('user_id', uid).gte('uploaded_at', sevenDaysAgo),
      supabase.from('incidents').select('crime_type, severity').eq('user_id', uid),
    ]);

    const allIncidents: { crime_type: string; severity: string }[] = allIncidentsRes.data ?? [];

    if (allIncidents.length === 0 && (totalRes.count ?? 0) === 0) {
      return NextResponse.json(getMockStats());
    }

    const crimeMap: Record<string, number> = {};
    for (const inc of allIncidents) {
      crimeMap[inc.crime_type] = (crimeMap[inc.crime_type] ?? 0) + 1;
    }
    const by_crime = Object.entries(crimeMap).map(([crime_type, count]) => ({ crime_type, count }));

    const severityMap: Record<string, number> = {};
    for (const inc of allIncidents) {
      severityMap[inc.severity] = (severityMap[inc.severity] ?? 0) + 1;
    }
    const by_severity = Object.entries(severityMap).map(([severity, count]) => ({ severity, count }));

    return NextResponse.json({
      total: totalRes.count ?? 0,
      critical: criticalRes.count ?? 0,
      open: openRes.count ?? 0,
      this_week: thisWeekRes.count ?? 0,
      by_crime,
      by_severity,
    });
  } catch (err) {
    console.error('Stats route error:', err);
    return NextResponse.json(getMockStats());
  }
}
