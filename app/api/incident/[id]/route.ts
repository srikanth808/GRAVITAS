import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { getMockIncidents } from '@/lib/mockStore';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const mockMatch = getMockIncidents().find((i) => i.id === id);

    try {
      const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
      const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

      if (url && key) {
        const supabase = createServerClient(url, key, {
          cookies: { getAll: () => request.cookies.getAll(), setAll: () => {} },
        });
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const [incidentRes, entitiesRes, tagsRes] = await Promise.all([
            supabase.from('incidents').select('*').eq('id', id).eq('user_id', user.id).single(),
            supabase.from('entities').select('*').eq('incident_id', id),
            supabase.from('tags').select('*').eq('incident_id', id),
          ]);
          if (incidentRes.data) {
            return NextResponse.json({
              incident: {
                ...incidentRes.data,
                entities: entitiesRes.data ?? [],
                tags: tagsRes.data ?? [],
              },
            });
          }
        }
      }
    } catch {}

    if (mockMatch) {
      return NextResponse.json({ incident: mockMatch });
    }

    return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
  } catch (err) {
    console.error('GET incident error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const mockMatch = getMockIncidents().find((i) => i.id === id);
    if (mockMatch) {
      mockMatch.status = 'Closed';
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE incident error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
