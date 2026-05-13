import { supabase } from '@/app/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import Countdown from '@/app/components/Countdown';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // 1. Fetch Albums
  const { data: allAlbums } = await supabase
    .from('albums')
    .select('*')
    .in('status', ['released', 'upcoming', 'newly released'])
    .order('release_date', { ascending: false });

  // 2. Fetch Latest Gallery Images (Limit to 4 for the preview)
  const { data: galleryImages } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4);

  // 3. Fetch Active Announcements
  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1);

  const now = Date.now();
  const validUpcoming = allAlbums?.find(a => a.status === 'upcoming' && new Date(a.release_date).getTime() > now);
  const validNewlyReleased = allAlbums?.find(a => a.status === 'newly released' || (a.status === 'upcoming' && new Date(a.release_date).getTime() <= now));

  const heroAlbum = validUpcoming || validNewlyReleased || null;
  const isUpcoming = !!validUpcoming;
  const gridAlbums = allAlbums?.filter(a => a.id !== heroAlbum?.id).slice(0, 3) || [];

  return (
    <div className="page-container space-y-10 pb-10">
      
      {/* 1. DYNAMIC HERO */}
      {heroAlbum ? (
        <section className="flex flex-col items-center text-center pt-5">
          <p className={`font-bold tracking-[0.3em] uppercase mb-6 md:mb-8 ${isUpcoming ? 'text-violet-500' : 'text-blue-400 animate-pulse'}`}>
            {isUpcoming ? 'Incoming Transmission' : 'Out Now'}
          </p>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 md:mb-8 uppercase tracking-wide">
            {/* CONDITION 1: Title Link */}
            {isUpcoming ? (
              <span className="cursor-default text-gray-200">{heroAlbum.title}</span>
            ) : (
              <Link href={`/albums/${heroAlbum.id}`} className="hover:text-violet-400 transition-colors">
                {heroAlbum.title}
              </Link>
            )}
          </h1>
          
          {/* CONDITION 2: Cover Image Link */}
          {heroAlbum.cover_url && (
            isUpcoming ? (
              <div className="mb-8 rounded-lg overflow-hidden border border-gray-800 shadow-2xl shadow-violet-900/20 block cursor-default">
                <Image src={heroAlbum.cover_url} alt={heroAlbum.title} width={256} height={256} className="object-cover w-48 h-48 md:w-64 md:h-64 block opacity-80" unoptimized priority />
              </div>
            ) : (
              <Link href={`/albums/${heroAlbum.id}`} className="mb-8 rounded-lg overflow-hidden border border-blue-500/50 shadow-[0_0_40px_rgba(96,165,250,0.3)] hover:scale-105 transition-all duration-500 block">
                <Image src={heroAlbum.cover_url} alt={heroAlbum.title} width={256} height={256} className="object-cover w-48 h-48 md:w-64 md:h-64 block" unoptimized priority />
              </Link>
            )
          )}

          {isUpcoming && (
            <div className="mb-8 w-full max-w-2xl">
              <Countdown targetDate={heroAlbum.release_date} albumId={heroAlbum.id} />
            </div>
          )}
        </section>
      ) : (
        <section className="flex flex-col justify-center items-center h-[30vh] border border-gray-800 border-dashed rounded-xl bg-gray-900/20 mt-10">
           <h1 className="text-xl md:text-2xl text-gray-400 font-bold tracking-widest uppercase text-center leading-relaxed">No upcoming releases yet.<br/>Stay put!</h1>
        </section>
      )}

      {/* 2. ANNOUNCEMENTS (Live Ticker Style) */}
      {announcements && announcements.length > 0 && (
        <section className="max-w-4xl mx-auto w-full px-4 md:px-0">
          <Link href="/announcements" className="group block bg-gray-900/40 border border-gray-800 hover:border-violet-500/50 rounded-2xl overflow-hidden transition-all duration-300">
            <div className="flex flex-col md:flex-row items-center">
              {/* Priority Indicator */}
              <div className={`w-full md:w-24 py-2 md:py-8 flex items-center justify-center font-black text-xs uppercase tracking-[0.2em] 
                ${announcements[0].priority === 'urgent' ? 'bg-red-600 text-white animate-pulse' : 'bg-violet-600 text-white'}`}>
                {announcements[0].priority === 'urgent' ? 'Alert' : 'Feed'}
              </div>
              
              <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center gap-4">
                <span className="font-mono text-gray-600 text-xs shrink-0">
                  [{new Date(announcements[0].created_at).toLocaleDateString('en-GB')}]
                </span>
                <div className="space-y-1">
                  <h3 className="text-white font-bold uppercase tracking-wide group-hover:text-violet-400 transition-colors">
                    {announcements[0].title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-1">
                    {announcements[0].content}
                  </p>
                </div>
              </div>

              <div className="hidden md:block pr-8 text-gray-700 group-hover:text-violet-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* 3. DISCOGRAPHY PREVIEW */}
      {gridAlbums.length > 0 && (
        <section>
          <div className="flex justify-between items-end mb-6 md:mb-8 border-b border-gray-800 pb-4">
            <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-widest">Recent Waves</h2>
            <Link href="/albums" className="text-xs md:text-sm text-violet-400 hover:text-violet-300 uppercase tracking-widest">Discography &rarr;</Link>
          </div>
          
          {/* THE FIX: Changed grid-cols-1 to grid-cols-2 for mobile, adjusted gap */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-8">
            
            {gridAlbums.map((album) => (
              <Link href={`/albums/${album.id}`} key={album.id} className="group block">
                <div className="relative aspect-square mb-2 md:mb-4 overflow-hidden rounded-lg">
                  <Image src={album.cover_url} alt={album.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" unoptimized />
                </div>
                <h3 className="text-base md:text-lg font-bold text-gray-200 truncate group-hover:text-white">{album.title}</h3>
                <p className="text-[10px] md:text-xs text-violet-400 uppercase tracking-widest mt-1">{new Date(album.release_date).getFullYear()}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 4. GALLERY PREVIEW */}
      <section>
        <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-4">
          <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Visual Artifacts</h2>
          <Link href="/gallery" className="text-sm text-violet-400 hover:text-violet-300 uppercase tracking-widest">Full Gallery &rarr;</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages?.map((img) => (
            <Link href="/gallery" key={img.id} className="relative aspect-square rounded-lg overflow-hidden border border-gray-800 group">
              <Image src={img.image_url} alt="Gallery" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" unoptimized />
              <div className="absolute inset-0 bg-violet-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </section>

      {/* 5. SHORT CONTACT */}
      <section className="bg-gray-900/30 border border-gray-800 rounded-3xl p-8 md:p-16 text-center md:text-left">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl font-black text-white uppercase tracking-widest">Connect</h2>
            <p className="text-gray-400 text-lg max-w-md">For bookings, collaborations, or sending frequencies through the abyss.</p>
            <Link href="/contact" className="inline-block bg-white text-black px-8 py-3 rounded-full font-black uppercase tracking-widest hover:bg-violet-500 hover:text-white transition-all transform hover:-translate-y-1">
              All Platforms
            </Link>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mr-4">
            {/* Quick Links with solid branded boxes */}
            <a href="mailto:booking@theabyss.com" className="p-5 bg-violet-600 rounded-2xl text-white shadow-xl shadow-violet-900/40 hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </a>
            <a href="https://t.me/yourusername" target="_blank" className="p-5 bg-[#0088cc] rounded-2xl text-white shadow-xl shadow-blue-900/40 hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </a>
            <a href="https://instagram.com/yourprofile" target="_blank" className="p-5 bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] rounded-2xl text-white shadow-xl shadow-pink-900/40 hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}