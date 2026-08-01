import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function HomePage() {
  let user = null;
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {}

  const cookieStore = await cookies();
  const isDemo = cookieStore.get('gravitas_demo_user')?.value === 'true';

  if (user || isDemo) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}
