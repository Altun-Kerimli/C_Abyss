import { supabase } from '@/app/lib/supabase';
import GalleryManager from './GalleryManager';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminGalleryPage() {
  const { data: images } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-violet-400 uppercase tracking-widest">Gallery Database</h1>
        <Link href="/adminOfTheAbyss" className="text-sm border border-gray-700 hover:border-gray-500 text-gray-400 px-4 py-2 rounded transition-colors">
          &larr; Back to Dashboard
        </Link>
      </div>
      
      <GalleryManager images={images || []} />
    </div>
  );
}