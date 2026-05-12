import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="page-container items-center py-12 md:py-24 min-h-[85vh]">
      
      {/* HEADER */}
      <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl md:text-6xl font-black text-violet-400 uppercase tracking-[0.2em]">
          Establish Connection
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
          For bookings, collaborations, and all sonic inquiries.
        </p>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        
        {/* LEFT COLUMN: Direct Contact & Socials */}
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          
          <section>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2 mb-6">
              Communications
            </h2>
            <div className="space-y-4">
              
              {/* EMAIL */}
              <a href="mailto:booking@theabyss.com" className="group flex items-center gap-4 bg-violet-500/10 border border-violet-500/40 hover:bg-violet-500/20 p-4 rounded-lg transition-all">
                {/* Solid Background, Pure White Icon */}
                <div className="p-3 bg-violet-600 rounded-lg text-white shadow-lg shadow-violet-900/50 transition-transform group-hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </div>
                <div className="flex-1">
                  <p className="text-gray-200"><span className="font-bold text-violet-400 tracking-wide">Email</span> : <span className="text-gray-300 group-hover:text-white transition-colors">booking@theabyss.com</span></p>
                </div>
              </a>
              
              {/* TELEGRAM */}
              <a href="https://t.me/dummy_tg_handle" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 bg-[#0088cc]/10 border border-[#0088cc]/40 hover:bg-[#0088cc]/20 p-4 rounded-lg transition-all">
                <div className="p-3 bg-[#0088cc] rounded-lg text-white shadow-lg shadow-[#0088cc]/30 transition-transform group-hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                </div>
                <div className="flex-1">
                  <p className="text-gray-200"><span className="font-bold text-[#00A3FF] tracking-wide">Telegram</span> : <span className="text-gray-300 group-hover:text-white transition-colors">@dummy_tg_handle</span></p>
                </div>
              </a>

              {/* INSTAGRAM */}
              <a href="https://instagram.com/dummy_insta" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 bg-[#E1306C]/10 border border-[#E1306C]/40 hover:bg-[#E1306C]/20 p-4 rounded-lg transition-all">
                <div className="p-3 bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] rounded-lg text-white shadow-lg shadow-[#E1306C]/30 transition-transform group-hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </div>
                <div className="flex-1">
                  <p className="text-gray-200"><span className="font-bold text-[#E1306C] tracking-wide">Instagram</span> : <span className="text-gray-300 group-hover:text-white transition-colors">@dummy_insta</span></p>
                </div>
              </a>

            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: Audio Platforms */}
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          
          <section>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2 mb-6">
              Frequencies
            </h2>
            <div className="space-y-4">
              
              {/* SPOTIFY */}
              <a href="https://open.spotify.com/artist/dummy" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 bg-[#1DB954]/10 border border-[#1DB954]/40 hover:bg-[#1DB954]/20 p-4 rounded-lg transition-all">
                <div className="p-3 bg-[#1DB954] rounded-lg text-white shadow-lg shadow-[#1DB954]/30 transition-transform group-hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 11.9c3.1-.9 7.4-1.1 10.3.5"/><path d="M8.9 14.8c2.4-.7 5.5-.8 7.7.3"/><path d="M9.8 17.3c1.8-.5 4.1-.6 5.6.2"/></svg>
                </div>
                <div className="flex-1">
                  <p className="text-gray-200"><span className="font-bold text-[#1DB954] tracking-wide">Spotify</span> : <span className="text-gray-300 group-hover:text-white transition-colors">The Abyss</span></p>
                </div>
              </a>

              {/* APPLE MUSIC (Translucent Silver Aesthetic with White Icon) */}
              <a href="https://music.apple.com/artist/dummy" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 bg-gray-400/10 border border-gray-400/40 hover:bg-gray-400/20 p-4 rounded-lg transition-all">
                <div className="p-3 bg-gray-400/50 backdrop-blur-sm rounded-lg text-white shadow-lg shadow-gray-500/20 transition-transform group-hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                </div>
                <div className="flex-1">
                  <p className="text-gray-200"><span className="font-bold text-gray-300 tracking-wide">Apple Music</span> : <span className="text-gray-300 group-hover:text-white transition-colors">The Abyss</span></p>
                </div>
              </a>

              {/* YOUTUBE (With custom split lettering) */}
              <a href="https://youtube.com/@dummy" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 bg-[#FF0000]/10 border border-[#FF0000]/40 hover:bg-[#FF0000]/20 p-4 rounded-lg transition-all">
                <div className="p-3 bg-[#FF0000] rounded-lg text-white shadow-lg shadow-[#FF0000]/30 transition-transform group-hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
                </div>
                <div className="flex-1">
                  <p className="text-gray-200">
                    <span className="font-bold tracking-wide"><span className="text-white">You</span><span className="text-[#FF0000]">Tube</span></span> : <span className="text-gray-300 group-hover:text-white transition-colors">youtube.com/@theabyss</span>
                  </p>
                </div>
              </a>

            </div>
          </section>

        </div>
      </div>
    </div>
  );
}