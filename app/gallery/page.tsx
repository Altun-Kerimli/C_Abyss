import { supabase } from '@/app/lib/supabase';
import GalleryLightbox from './GalleryLightbox';

export const dynamic = 'force-dynamic';

export default async function PublicGalleryPage() {
  const { data: images } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="page-container justify-start space-y-12">
      <div className="border-b border-gray-800 pb-4">
        <h1 className="text-4xl font-bold text-violet-400 uppercase tracking-widest">Visuals</h1>
        <p className="text-gray-400 mt-2">Captured frequencies and visual artifacts.</p>
      </div>

      <GalleryLightbox images={images || []} />
    </div>
  );
}