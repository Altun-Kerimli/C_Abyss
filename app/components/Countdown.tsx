'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Countdown({ targetDate, albumId }: { targetDate: string, albumId: string }) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const [hasRefreshed, setHasRefreshed] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const target = new Date(targetDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        
        // Timer hit zero! Tell Next.js to pull fresh data and reorganize the page.
        if (!hasRefreshed) {
          setHasRefreshed(true);
          router.refresh(); 
        }
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, albumId, router, hasRefreshed]);

  if (!isMounted) return null;

  return (
    <div className="flex gap-4 justify-center font-mono text-3xl md:text-5xl text-green-400 mb-8 tracking-widest drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">
      <div className="flex flex-col items-center">
        <span>{String(timeLeft.days).padStart(2, '0')}</span><span className="text-xs text-gray-500 uppercase tracking-widest mt-1">Days</span>
      </div>
      <span className="animate-pulse opacity-50">:</span>
      <div className="flex flex-col items-center">
        <span>{String(timeLeft.hours).padStart(2, '0')}</span><span className="text-xs text-gray-500 uppercase tracking-widest mt-1">Hrs</span>
      </div>
      <span className="animate-pulse opacity-50">:</span>
      <div className="flex flex-col items-center">
        <span>{String(timeLeft.minutes).padStart(2, '0')}</span><span className="text-xs text-gray-500 uppercase tracking-widest mt-1">Min</span>
      </div>
      <span className="animate-pulse opacity-50">:</span>
      <div className="flex flex-col items-center">
        <span>{String(timeLeft.seconds).padStart(2, '0')}</span><span className="text-xs text-gray-500 uppercase tracking-widest mt-1">Sec</span>
      </div>
    </div>
  );
}