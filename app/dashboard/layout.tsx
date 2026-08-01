import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import NavBar from '@/components/ui/NavBar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userEmail: string | undefined = undefined;
  
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.auth.getUser();
    userEmail = data.user?.email;
  } catch {}

  const cookieStore = await cookies();
  const demoCookie = cookieStore.get('gravitas_demo_user')?.value;

  if (!userEmail && !demoCookie) {
    redirect('/login');
  }

  if (!userEmail && demoCookie) {
    try {
      userEmail = decodeURIComponent(demoCookie);
    } catch {
      userEmail = 'analyst@gravitas.com';
    }
  }

  return (
    <div>
      <NavBar userEmail={userEmail} />
      <main style={{ paddingTop: '60px' }}>{children}</main>
    </div>
  );
}
