import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import NavBar from '@/components/ui/NavBar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const demoCookie = cookieStore.get('gravitas_demo_user')?.value;

  let userEmail: string | undefined = undefined;

  if (demoCookie) {
    try {
      userEmail = decodeURIComponent(demoCookie);
    } catch {
      userEmail = 'analyst@gravitas.com';
    }
  } else {
    try {
      const supabase = await createServerSupabaseClient();
      const userPromise = supabase.auth.getUser();
      const timeoutPromise = new Promise<{ data: { user: null } }>((resolve) =>
        setTimeout(() => resolve({ data: { user: null } }), 1000)
      );
      const res = (await Promise.race([userPromise, timeoutPromise])) as { data: { user: { email?: string } | null } };
      userEmail = res.data?.user?.email;
    } catch {}
  }

  if (!userEmail && !demoCookie) {
    redirect('/login');
  }

  return (
    <div>
      <NavBar userEmail={userEmail} />
      <main style={{ paddingTop: '60px' }}>{children}</main>
    </div>
  );
}
