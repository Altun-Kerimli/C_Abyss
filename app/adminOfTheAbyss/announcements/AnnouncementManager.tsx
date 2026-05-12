'use client';
import { useState } from 'react';
import { upsertAnnouncement, deleteAnnouncements } from '@/app/lib/actions';

export default function AnnouncementManager({ logs }: { logs: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<any | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleEdit = (log: any) => {
    setEditingLog(log);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await upsertAnnouncement(new FormData(e.currentTarget));
    setIsModalOpen(false);
    setEditingLog(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <button onClick={() => { setEditingLog(null); setIsModalOpen(true); }} className="bg-violet-600 text-white px-6 py-2 rounded font-bold uppercase tracking-widest text-sm hover:bg-violet-500">
          + New Broadcast
        </button>
        {selectedIds.length > 0 && (
          <button onClick={() => deleteAnnouncements(selectedIds)} className="bg-red-600 text-white px-6 py-2 rounded font-bold uppercase tracking-widest text-sm">
            Delete ({selectedIds.length})
          </button>
        )}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm text-gray-400">
          <tbody className="divide-y divide-gray-800">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-800/30 transition-colors group">
                <td className="p-4 w-10">
                  <input type="checkbox" onChange={() => setSelectedIds(prev => prev.includes(log.id) ? prev.filter(i => i !== log.id) : [...prev, log.id])} />
                </td>
                <td className="p-4 cursor-pointer" onClick={() => handleEdit(log)}>
                  <div className="flex items-center gap-3">
                    <p className="text-gray-200 font-bold">{log.title}</p>
                    <span className="text-[10px] text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity uppercase font-mono tracking-tighter">Click to Edit</span>
                  </div>
                  <p className="text-gray-500 truncate max-w-lg">{log.content}</p>
                </td>
                <td className="p-4 text-right">
                  <span className={`text-[10px] uppercase px-2 py-0.5 rounded border ${log.priority === 'urgent' ? 'border-red-500 text-red-500' : 'border-violet-500 text-violet-500'}`}>{log.priority}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 p-8 rounded-xl max-w-lg w-full space-y-4">
            <h2 className="text-xl font-bold text-violet-400 uppercase tracking-widest mb-4">{editingLog ? 'Update Transmission' : 'New Broadcast'}</h2>
            <input type="hidden" name="id" value={editingLog?.id || ''} />
            
            <input name="title" defaultValue={editingLog?.title} placeholder="Short Title" required className="w-full bg-black border border-gray-700 rounded p-3 text-white" />
            
            <textarea name="content" defaultValue={editingLog?.content} placeholder="Transmission Content... Use {http://link.com} for links" required rows={6} className="w-full bg-black border border-gray-700 rounded p-3 text-white font-mono text-sm" />
            
            <div className="grid grid-cols-2 gap-4">
              <select name="priority" defaultValue={editingLog?.priority || 'info'} className="bg-black border border-gray-700 rounded p-3 text-white">
                <option value="info">Info</option>
                <option value="urgent">Urgent</option>
                <option value="event">Event</option>
              </select>
              <select name="is_active" defaultValue={editingLog?.is_active?.toString() || 'true'} className="bg-black border border-gray-700 rounded p-3 text-white">
                <option value="true">Visible</option>
                <option value="false">Hidden</option>
              </select>
            </div>
            
            <div className="flex gap-4 pt-4">
              <button type="button" onClick={() => { setIsModalOpen(false); setEditingLog(null); }} className="flex-1 text-gray-500 uppercase tracking-widest text-xs">Cancel</button>
              <button type="submit" className="flex-1 bg-violet-600 text-white font-bold py-3 rounded uppercase tracking-widest">
                {editingLog ? 'Update' : 'Broadcast'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}