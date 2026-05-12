'use client';
import { useState } from 'react';
import { parseContent } from '@/app/lib/utils';

export default function AnnouncementsClient({ logs }: { logs: any[] }) {
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  return (
    <div className="space-y-6">
      {logs?.map((log) => (
        <div 
          key={log.id} 
          onClick={() => setSelectedLog(log)}
          className="group relative pl-8 border-l border-gray-800 hover:border-violet-500 transition-colors py-4 cursor-pointer bg-gray-900/10 hover:bg-gray-900/40 pr-4 rounded-r-lg"
        >
          <div className="absolute left-[-5px] top-6 w-2 h-2 rounded-full bg-gray-800 group-hover:bg-violet-500 transition-colors" />
          <div className="flex flex-col md:flex-row md:items-baseline gap-2 mb-2">
            <span className="text-[10px] font-mono text-gray-600 uppercase">[{new Date(log.created_at).toLocaleString('en-GB')}]</span>
            <h2 className={`font-bold uppercase tracking-wide ${log.priority === 'urgent' ? 'text-red-500' : 'text-gray-200'}`}>{log.title}</h2>
          </div>
          <div className="text-gray-400 line-clamp-2 text-sm">
            {parseContent(log.content)}
          </div>
          <span className="text-[10px] text-violet-500/50 uppercase tracking-widest mt-2 block opacity-0 group-hover:opacity-100 transition-opacity">Click to Expand // Full Transmission</span>
        </div>
      ))}

      {/* FULL VIEW MODAL */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setSelectedLog(null)}>
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedLog(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white text-xl">✕</button>
            <div className="mb-6 border-b border-gray-800 pb-4">
              <span className="text-xs font-mono text-violet-500 uppercase tracking-widest">Transmission Log: {new Date(selectedLog.created_at).toLocaleString('en-GB')}</span>
              <h2 className={`text-3xl font-black uppercase tracking-tighter mt-2 ${selectedLog.priority === 'urgent' ? 'text-red-500' : 'text-white'}`}>{selectedLog.title}</h2>
            </div>
            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
              {parseContent(selectedLog.content)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}