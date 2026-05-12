import { supabase } from '@/app/lib/supabase';
import AnnouncementManager from './AnnouncementManager';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminAnnouncementsPage() {
  // Fetch all logs, even inactive/expired ones, so the admin can reactivate them
  const { data: logs } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-violet-400 uppercase tracking-widest">Broadcast Center</h1>
          <p className="text-gray-500 text-sm font-mono">Manage global transmissions and alerts.</p>
        </div>
        <Link href="/adminOfTheAbyss" className="text-sm border border-gray-700 hover:border-gray-500 text-gray-400 px-4 py-2 rounded transition-colors">
          &larr; Back to Dashboard
        </Link>
      </div>
      
      {/* Passing the component we built in the previous response */}
      <AnnouncementManager logs={logs || []} />
    </div>
  );
}