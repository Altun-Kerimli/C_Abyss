'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

export default function GalleryLightbox({ images }: { images: any[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Close modal on Escape key, navigate with arrows
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setSelectedIndex(null);
    if (e.key === 'ArrowRight' && selectedIndex !== null) showNext();
    if (e.key === 'ArrowLeft' && selectedIndex !== null) showPrev();
  }, [selectedIndex, images.length]);

  useEffect(() => {
    if (selectedIndex !== null) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, handleKeyDown]);

  const showNext = () => setSelectedIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
  const showPrev = () => setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));

  if (!images || images.length === 0) {
    return <p className="text-gray-500 text-center py-20">The gallery is currently empty.</p>;
  }

  // Helper to format date cleanly
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <>
      {/* 1. PHOTO GRID (Now with titles and dates) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {images.map((image, idx) => (
          <div key={image.id} onClick={() => setSelectedIndex(idx)} className="group cursor-pointer block">
            
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-900 border border-gray-800 mb-3">
              <Image 
                src={image.image_url} 
                alt={image.title || 'Gallery Image'} 
                fill 
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110 group-hover:opacity-75"
                unoptimized
              />
            </div>
            
            <h3 className="text-sm font-bold text-gray-200 truncate group-hover:text-white transition-colors">
              {image.title}
            </h3>
            <p className="text-xs text-violet-400 mt-1 uppercase tracking-widest">
              {formatDate(image.created_at)}
            </p>

          </div>
        ))}
      </div>

      {/* 2. LIGHTBOX MODAL (Now with date below title) */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-200">
          
          <button onClick={() => setSelectedIndex(null)} className="absolute top-6 right-6 text-gray-400 hover:text-white z-50 text-3xl">&times;</button>
          
          <button onClick={(e) => { e.stopPropagation(); showPrev(); }} className="absolute left-4 md:left-10 text-gray-500 hover:text-white text-4xl z-50 p-4">
            &larr;
          </button>

          <div className="relative w-full max-w-5xl h-[75vh] mx-12 flex flex-col items-center justify-center" onClick={() => setSelectedIndex(null)}>
            
            <div className="relative w-full h-full mb-6" onClick={(e) => e.stopPropagation()}>
              <Image 
                src={images[selectedIndex].image_url} 
                alt={images[selectedIndex].title || 'Gallery Image'} 
                fill 
                className="object-contain"
                unoptimized
              />
            </div>

            {/* Lightbox Text Area */}
            <div className="absolute -bottom-12 flex flex-col items-center text-center" onClick={(e) => e.stopPropagation()}>
              <p className="text-gray-200 uppercase tracking-widest text-lg font-bold">
                {images[selectedIndex].title}
              </p>
              <p className="text-violet-400 text-sm tracking-widest mt-1">
                {formatDate(images[selectedIndex].created_at)}
              </p>
            </div>

          </div>

          <button onClick={(e) => { e.stopPropagation(); showNext(); }} className="absolute right-4 md:right-10 text-gray-500 hover:text-white text-4xl z-50 p-4">
            &rarr;
          </button>
        </div>
      )}
    </>
  );
}