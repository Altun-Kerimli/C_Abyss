import { supabase } from '@/app/lib/supabase';
import AnnouncementsClient from './AnnouncementsClient';

// Ensures the page always fetches fresh data from the DB
export const dynamic = 'force-dynamic';

export default async function AnnouncementsPage() {
  const now = new Date().toISOString();

  // 1. Fetch only active announcements that haven't expired yet
  const { data: logs } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order('created_at', { ascending: false });

  return (
    <div className="page-container justify-start max-w-4xl">
      
      {/* HEADER SECTION */}
      <div className="border-b border-gray-800 pb-8 mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-violet-400 uppercase tracking-widest leading-tight">
          Global Transmissions
        </h1>
        <p className="text-gray-500 mt-4 font-mono text-sm tracking-tighter">
          Status: <span className="text-green-500 animate-pulse">Connected</span> | Receiving Data Streams... </p>
      </div>

      {/* THE CLIENT COMPONENT (Handles Modals & Content Parsing) */}
      <AnnouncementsClient logs={logs || []} />

      {/* FALLBACK IF EMPTY */}
      {(!logs || logs.length === 0) && (
        <div className="py-20 text-center border border-dashed border-gray-800 rounded-2xl">
          <p className="text-gray-600 uppercase tracking-[0.2em] font-mono">
            No active transmissions detected in this sector.
          </p>
        </div>
      )}

    </div>
  );
}