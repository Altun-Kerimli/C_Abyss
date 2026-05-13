'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // ADD THIS LINE
import Countdown from '@/app/components/Countdown';

export default function AlbumsView({ heroAlbum, isUpcoming, gridAlbums }: any) {
  const [activeTab, setActiveTab] = useState('releases');

  return (
    <div className="space-y-12 w-full">
      
      {/* 1. HERO SECTION (Always on top) */}
      {heroAlbum ? (
        <section className="flex flex-col lg:flex-row gap-8 items-center bg-gray-900/30 p-8 rounded-xl border border-gray-800">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-wide">
            <Link href={`/albums/${heroAlbum.id}`} className="hover:text-violet-400 transition-colors">{heroAlbum.title}</Link>
          </h2>
          <Link href={`/albums/${heroAlbum.id}`} className={`shrink-0 rounded-lg overflow-hidden border transition-all duration-500 ${isUpcoming ? 'shadow-2xl shadow-violet-900/20 border-gray-800' : 'shadow-[0_0_40px_rgba(96,165,250,0.3)] border-blue-500/50 hover:scale-105'}`}>
            <Image src={heroAlbum.cover_url} alt={heroAlbum.title} width={256} height={256} className="object-cover w-48 h-48 md:w-64 md:h-64 block" unoptimized={true} priority={true} />
          </Link>
          <div className="flex-1 text-center lg:text-left">
            <p className={`font-bold tracking-[0.3em] uppercase mb-4 ${isUpcoming ? 'text-violet-500' : 'text-blue-400 animate-pulse'}`}>
              {isUpcoming ? 'Incoming Transmission' : 'Out Now'}
            </p>
            {isUpcoming ? (
              <div className="max-w-md mx-auto lg:mx-0">
                <Countdown targetDate={heroAlbum.release_date} albumId={heroAlbum.id} />
              </div>
            ) : (
              <Link href={`/albums/${heroAlbum.id}`} className="inline-block bg-blue-900/40 text-blue-400 border border-blue-500/50 px-8 py-3 rounded-full font-bold tracking-widest uppercase hover:bg-blue-500 hover:text-black transition-all">Listen Now</Link>
            )}
          </div>
        </section>
      ) : (
        <section className="flex flex-col justify-center items-center h-[30vh] border border-gray-800 border-dashed rounded-xl bg-gray-900/20">
           <p className="text-gray-500 mb-2 uppercase tracking-widest text-sm font-bold">Signal Lost</p>
           <h1 className="text-2xl md:text-3xl text-gray-400 font-bold tracking-widest uppercase text-center leading-relaxed">
             No upcoming releases yet.<br/>Stay put!
           </h1>
        </section>
      )}

      {/* 2. FULL WIDTH 50/50 TABS */}
      <div className="grid grid-cols-2 border-b border-gray-800">
        <button 
          onClick={() => setActiveTab('releases')} 
          className={`pb-4 text-center font-bold tracking-widest uppercase transition-all duration-300 ${activeTab === 'releases' ? 'text-violet-400 border-b-2 border-violet-400 bg-violet-900/10' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900/50'}`}>
          Discography
        </button>
        <button 
          onClick={() => setActiveTab('sketches')} 
          className={`pb-4 text-center font-bold tracking-widest uppercase transition-all duration-300 ${activeTab === 'sketches' ? 'text-violet-400 border-b-2 border-violet-400 bg-violet-900/10' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900/50'}`}>
          Sketches
        </button>
      </div>

      {/* 3. TAB CONTENT */}
      {activeTab === 'releases' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 animate-in fade-in duration-500">
          {gridAlbums.map((album: any) => (
            <Link href={`/albums/${album.id}`} key={album.id} className="group block">
              {/* Added relative aspect-square to ensure consistent mobile scaling */}
              <div className="img-wrapper-square relative aspect-square rounded-lg overflow-hidden mb-2 md:mb-4">
                {album.cover_url ? (
                  <Image src={album.cover_url} alt={album.title} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-110 group-hover:opacity-50" unoptimized={true} />
                ) : (<div className="flex w-full h-full items-center justify-center text-gray-700 font-bold bg-gray-900">NO COVER</div>)}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                   <span className="text-white font-bold tracking-widest border border-white px-4 py-2 md:px-6 md:py-2 text-xs md:text-sm rounded uppercase bg-black/50 backdrop-blur-sm">Listen</span>
                </div>
              </div>
              <h3 className="text-base md:text-xl font-bold text-gray-200 truncate group-hover:text-white transition-colors">{album.title}</h3>
              <p className="text-[10px] md:text-sm text-violet-400 mt-1">{new Date(album.release_date).getFullYear()} • {album.song_count} Tracks</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex justify-center animate-in fade-in duration-500">
          <div className="w-full max-w-3xl space-y-8">
            <h2 className="text-3xl font-black text-white uppercase tracking-wide text-center">The Sketchbook</h2>
            <p className="text-gray-400 text-lg text-center">Raw frequencies, unmastered ideas, and works in progress.</p>
            
            <div className="rounded-xl overflow-hidden border border-gray-800 bg-black w-full shadow-2xl">
              <iframe 
                src="https://open.spotify.com/embed/playlist/4U1atN0hEnev3SK4MO8w72" 
                width="100%" 
                height="400" 
                frameBorder="0" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
              ></iframe>
            </div>

            <div className="flex justify-center gap-4 pt-8 border-t border-gray-800">
              <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-[#FF0000]/10 text-[#FF0000] border border-[#FF0000]/30 hover:bg-[#FF0000]/20 rounded-full font-bold uppercase tracking-wide text-sm transition-colors">
                YouTube Channel
              </Link>
              
              {/* The New Whitish-Silver Apple Music Button */}
              <Link href="https://music.apple.com" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-gray-300/10 text-gray-300 border border-gray-400/30 hover:bg-gray-200/20 hover:text-white rounded-full font-bold uppercase tracking-wide text-sm transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                Apple Music Profile
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}