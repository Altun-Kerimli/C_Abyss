import { supabase } from '@/app/lib/supabase';
import AlbumsView from './AlbumsView';

export default async function PublicAlbumsPage() {
  const { data: allAlbums } = await supabase
    .from('albums')
    .select('*')
    .in('status', ['released', 'upcoming', 'newly released'])
    .order('release_date', { ascending: false });

  const now = Date.now();

  const validUpcoming = allAlbums?.find(a => a.status === 'upcoming' && new Date(a.release_date).getTime() > now);
  const validNewlyReleased = allAlbums?.find(a => a.status === 'newly released' || (a.status === 'upcoming' && new Date(a.release_date).getTime() <= now));

  const heroAlbum = validUpcoming || validNewlyReleased || null;
  const isUpcoming = !!validUpcoming;
  const gridAlbums = allAlbums?.filter(a => a.id !== heroAlbum?.id) || [];

  return (
    <div className="page-container justify-start">
      <AlbumsView heroAlbum={heroAlbum} isUpcoming={isUpcoming} gridAlbums={gridAlbums} />
    </div>
  );
}