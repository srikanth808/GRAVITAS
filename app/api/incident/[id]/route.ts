import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // ── Fetch incident + entities + tags in parallel ──
    const [incidentRes, entitiesRes, tagsRes] = await Promise.all([
      supabase
        .from('incidents')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single(),

      supabase.from('entities').select('*').eq('incident_id', id),

      supabase.from('tags').select('*').eq('incident_id', id),
    ]);

    if (incidentRes.error || !incidentRes.data) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }

    return NextResponse.json({
      incident: {
        ...incidentRes.data,
        entities: entitiesRes.data ?? [],
        tags: tagsRes.data ?? [],
      },
    });
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

    // ── Verify ownership ──
    const { data: incident } = await supabase
      .from('incidents')
      .select('id, user_id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!incident) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }

    // ── Soft-delete: set status to Closed ──
    const { error: updateError } = await supabase
      .from('incidents')
      .update({ status: 'Closed' })
      .eq('id', id);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to close incident' }, { status: 500 });
    }

    // ── Audit log ──
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'close',
      metadata: { incident_id: id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE incident error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
