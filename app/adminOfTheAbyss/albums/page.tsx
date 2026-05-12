import { supabase } from '@/app/lib/supabase';
import AlbumsManager from './AlbumsManager';
import Link from 'next/link'; // ADD THIS LINE

// 1. Force Next.js to always fetch fresh data for the Admin panel (never cache it)
export const dynamic = 'force-dynamic';

export default async function AdminAlbumsPage() {
  
  // 2. THE JANITOR: Before loading the table, find any 'upcoming' albums 
  // that have passed their release date and permanently update them in the DB.
  const now = new Date().toISOString();
  
  await supabase
    .from('albums')
    .update({ status: 'newly released' })
    .eq('status', 'upcoming')
    .lte('release_date', now);

  // 3. Now fetch the freshly cleaned data to pass to your Datatable
  const { data: albums } = await supabase
    .from('albums')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-violet-400 uppercase">Albums Database</h1>
        <Link href="/adminOfTheAbyss" className="text-sm border border-gray-700 hover:border-gray-500 text-gray-400 px-4 py-2 rounded transition-colors">
          &larr; Back to Dashboard
        </Link>
      </div>
      
      <AlbumsManager albums={albums || []} />
    </div>
  );
}