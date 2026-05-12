import { supabase } from '@/app/lib/supabase';
import StorageManager from './StorageManager';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminStoragePage() {
  // Fetch lists of raw files directly from the storage buckets
  const { data: coversFiles } = await supabase.storage.from('covers').list();
  const { data: galleryFiles } = await supabase.storage.from('gallery').list();

  // Next.js needs the base URL to render the images
  const { data: urlData } = supabase.storage.from('covers').getPublicUrl('');
  const publicUrlBase = urlData.publicUrl.replace('/covers/', '');

  // Filter out the empty placeholder files Supabase sometimes creates
  const validCovers = coversFiles?.filter(f => f.name !== '.emptyFolderPlaceholder') || [];
  const validGallery = galleryFiles?.filter(f => f.name !== '.emptyFolderPlaceholder') || [];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-violet-400 uppercase tracking-widest">Storage Control</h1>
        <Link href="/adminOfTheAbyss" className="text-sm border border-gray-700 hover:border-gray-500 text-gray-400 px-4 py-2 rounded transition-colors">
          &larr; Back to Dashboard
        </Link>
      </div>

      <p className="text-gray-400 mb-10">Warning: Deleting files here bypasses the database. Only delete orphaned files that are no longer linked to an album or gallery post.</p>

      <StorageManager files={validCovers} bucketName="covers" publicUrlBase={publicUrlBase} />
      <StorageManager files={validGallery} bucketName="gallery" publicUrlBase={publicUrlBase} />
    </div>
  );
}