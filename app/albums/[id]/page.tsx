import { supabase } from '@/app/lib/supabase';
import Image from 'next/image';
import Link from 'next/link'; // ADD THIS LINE
import { notFound } from 'next/navigation';

// Helper to convert standard Spotify URLs (albums, tracks, playlists, artists) to Embed URLs
function getSpotifyEmbedUrl(url: string | null) {
  if (!url || !url.includes('spotify.com')) return null;
  
  // Finds spotify.com/ followed by album, track, playlist, or artist, and injects /embed/
  return url.replace(/spotify\.com\/(album|track|playlist|artist)\//, 'spotify.com/embed/$1/');
}

// 1. Change the type of params to a Promise
export default async function AlbumDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  
  // 2. Await the params to get the actual ID string
  const resolvedParams = await params;
  
  const { data: album, error } = await supabase
    .from('albums')
    .select('*')
    .eq('id', resolvedParams.id) // 3. Use the resolved ID
    .single();

  if (error || !album) {
    notFound(); 
  }

  const embedUrl = getSpotifyEmbedUrl(album.spotify_url);

  return (
    <div className="page-container justify-start">
      <Link href="/albums" className="text-sm text-gray-500 hover:text-violet-400 mb-8 inline-block transition-colors uppercase tracking-widest">
        &larr; Back to Discography
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* LEFT COLUMN: Cover Art */}
        <div className="relative aspect-square w-full shadow-2xl shadow-violet-900/20 rounded-lg overflow-hidden border border-gray-800">
          {album.cover_url ? (
            <Image 
              src={album.cover_url} 
              alt={album.title} 
              fill 
              className="object-cover"
              unoptimized={true}
              priority={true}
            />
          ) : (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-700 font-bold">NO COVER</div>
          )}
        </div>

        {/* RIGHT COLUMN: Info & Player */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide mb-2">{album.title}</h1>
            <p className="text-violet-400 tracking-widest text-sm uppercase">
              Released: {new Date(album.release_date).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} • {album.song_count} Tracks
            </p>
          </div>

          {/* <p className="text-gray-400 text-lg leading-relaxed whitespace-pre-wrap">
            {album.description}
          </p> */}

          {/* SPOTIFY EMBED PLAYER */}
          {embedUrl ? (
            <div className="rounded-xl overflow-hidden border border-gray-800 bg-black">
              <iframe 
                src={embedUrl} 
                width="100%" 
                height="600" 
                frameBorder="0" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
              ></iframe>
            </div>
          ) : (
             <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg text-center">
               <p className="text-gray-500">Audio stream not yet available for this frequency.</p>
             </div>
          )}

          {/* EXTERNAL PLATFORM REDIRECTS */}
          <div className="pt-8 border-t border-gray-800">
            <h3 className="text-sm text-gray-500 uppercase tracking-widest mb-4">Stream Elsewhere</h3>
            <div className="flex flex-wrap gap-4">
              {album.spotify_url && (
                <a href={album.spotify_url} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-[#1DB954]/10 text-[#1DB954] border border-[#1DB954]/30 hover:bg-[#1DB954]/20 rounded-full font-bold uppercase tracking-wide text-sm transition-colors">
                  Spotify
                </a>
              )}
              {album.apple_music_url && (
                <a href={album.apple_music_url} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-gray-300/10 text-gray-300 border border-gray-400/30 hover:bg-gray-200/20 hover:text-white rounded-full font-bold uppercase tracking-wide text-sm transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                  Apple Music
                </a>
              )}
              {album.youtube_url && (
                <a href={album.youtube_url} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-[#FF0000]/10 text-[#FF0000] border border-[#FF0000]/30 hover:bg-[#FF0000]/20 rounded-full font-bold uppercase tracking-wide text-sm transition-colors">
                  YouTube
                </a>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}