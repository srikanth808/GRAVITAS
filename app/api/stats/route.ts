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

    const uid = user.id;
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // ── Parallel queries ──
    const [
      totalRes,
      criticalRes,
      openRes,
      thisWeekRes,
      allIncidentsRes,
    ] = await Promise.all([
      supabase
        .from('incidents')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', uid),

      supabase
        .from('incidents')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', uid)
        .eq('severity', 'Critical'),

      supabase
        .from('incidents')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', uid)
        .eq('status', 'Open'),

      supabase
        .from('incidents')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', uid)
        .gte('uploaded_at', sevenDaysAgo),

      supabase
        .from('incidents')
        .select('crime_type, severity')
        .eq('user_id', uid),
    ]);

    const allIncidents: { crime_type: string; severity: string }[] =
      allIncidentsRes.data ?? [];

    // ── Group by crime type ──
    const crimeMap: Record<string, number> = {};
    for (const inc of allIncidents) {
      crimeMap[inc.crime_type] = (crimeMap[inc.crime_type] ?? 0) + 1;
    }
    const by_crime = Object.entries(crimeMap).map(([crime_type, count]) => ({
      crime_type,
      count,
    }));

    // ── Group by severity ──
    const severityMap: Record<string, number> = {};
    for (const inc of allIncidents) {
      severityMap[inc.severity] = (severityMap[inc.severity] ?? 0) + 1;
    }
    const by_severity = Object.entries(severityMap).map(([severity, count]) => ({
      severity,
      count,
    }));

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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
