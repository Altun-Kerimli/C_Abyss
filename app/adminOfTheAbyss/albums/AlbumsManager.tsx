'use client';

import { useState } from 'react';
import { createAlbum, updateAlbum, deleteAlbums } from '@/app/lib/actions';

export default function AlbumsManager({ albums }: { albums: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Platform visibility toggles
  const [showYouTube, setShowYouTube] = useState(false);
  const [showAppleMusic, setShowAppleMusic] = useState(false);

  // The clean 1-liner for the Data Table (European Format)
  const formatCustomDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB'); 
  };

  // Safely extracts exact local time without UTC shifting
  const formatForInput = (dateString: string) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    const yyyy = d.getFullYear();
    const MM = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
  };

  const openModal = (album: any = null) => {
    setEditingAlbum(album);
    setShowYouTube(album?.youtube_url ? true : false);
    setShowAppleMusic(album?.apple_music_url ? true : false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingAlbum(null);
    setIsModalOpen(false);
  };

  const handleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} album(s)? This cannot be undone.`)) return;
    setIsProcessing(true);
    await deleteAlbums(selectedIds);
    setSelectedIds([]);
    setIsProcessing(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!confirm(`Are you sure you want to ${editingAlbum ? 'update' : 'save'} this album?`)) return;
    
    setIsProcessing(true);
    const formData = new FormData(e.currentTarget);
    
    // THE TIMEZONE FIX: Intercept the local time string and force it into absolute UTC before sending
    const rawDate = formData.get('releaseDate') as string;
    if (rawDate) {
      formData.set('releaseDate', new Date(rawDate).toISOString());
    }
    
    if (editingAlbum) {
      formData.append('id', editingAlbum.id);
      await updateAlbum(formData);
    } else {
      await createAlbum(formData);
    }
    
    setIsProcessing(false);
    closeModal();
  };

  return (
    <div>
      {/* Controls */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => openModal()} className="bg-green-600 hover:bg-green-500 text-black font-bold py-2 px-4 rounded transition-colors">
          + New Album
        </button>
        {selectedIds.length > 0 && (
          <button onClick={handleDelete} disabled={isProcessing} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded transition-colors">
            {isProcessing ? 'Processing...' : `Delete Selected (${selectedIds.length})`}
          </button>
        )}
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto bg-gray-900/50 border border-gray-800 rounded-lg">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-gray-900 text-xs uppercase text-gray-500 border-b border-gray-800">
            <tr>
              <th className="p-4 w-12 text-center">
                <input type="checkbox" onChange={(e) => setSelectedIds(e.target.checked ? albums.map(a => a.id) : [])} checked={albums.length > 0 && selectedIds.length === albums.length} />
              </th>
              <th className="p-4 w-16 text-center">Cover</th>
              <th className="p-4 ">Title</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 ">Release Date</th>
              <th className="p-4 text-center">Tracks</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {albums.map((album) => (
              <tr key={album.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                <td className="p-4 text-center">
                  <input type="checkbox" checked={selectedIds.includes(album.id)} onChange={() => handleSelect(album.id)} />
                </td>
                <td className="p-4">
                  {album.cover_url ? (
                    <img src={album.cover_url} className="w-10 h-10 object-cover rounded mx-auto" alt="Cover" />
                  ) : (
                    <div className="w-10 h-10 bg-gray-800 rounded mx-auto"></div>
                  )}
                </td>
                <td className="p-4 font-bold text-gray-200">{album.title}</td>
                <td className="p-4 text-center">
                  <span className={`px-2 py-1 rounded text-xs uppercase font-bold tracking-wider 
                    ${album.status === 'upcoming' ? 'bg-violet-900/50 text-violet-400 border border-violet-500/30' : 
                      album.status === 'newly released' ? 'bg-blue-900/50 text-blue-400 border border-blue-500/30 shadow-[0_0_10px_rgba(96,165,250,0.3)]' : 
                      album.status === 'released' ? 'bg-green-900/50 text-green-400 border border-green-500/30' : 
                      'bg-gray-800 text-gray-400 border border-gray-600'}`}>
                    {album.status}
                  </span>
                </td>
                <td className="p-4">{formatCustomDate(album.release_date)}</td>
                <td className="p-4 text-center">{album.song_count}</td>
                <td className="p-4 text-center">
                  <button onClick={() => openModal(album)} className="text-violet-400 hover:text-violet-300">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto relative">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>
            <h2 className="text-2xl font-bold text-violet-400 mb-6">{editingAlbum ? 'Edit Album' : 'New Album'}</h2>
            
            <form key={editingAlbum ? editingAlbum.id : 'new'} onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Title</label>
                  <input type="text" name="title" required defaultValue={editingAlbum?.title || ''} className="w-full bg-black border border-gray-700 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Release Date <span className="text-gray-600 text-xs">(Leave blank for current time)</span></label>
                  {/* Removed 'required' attribute to allow auto-dating */}
                  <input 
                    type="datetime-local" 
                    name="releaseDate" 
                    defaultValue={editingAlbum?.release_date ? formatForInput(editingAlbum.release_date) : ''} 
                    className="w-full bg-black border border-gray-700 rounded p-2 text-white [color-scheme:dark]" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea name="description" rows={3} defaultValue={editingAlbum?.description || ''} className="w-full bg-black border border-gray-700 rounded p-2 text-white"></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Song Count</label>
                  <input type="number" name="songCount" min="1" required defaultValue={editingAlbum?.song_count || 1} className="w-full bg-black border border-gray-700 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Status</label>
                  <select name="status" defaultValue={editingAlbum?.status || 'pending'} className="w-full bg-black border border-gray-700 rounded p-2 text-white">
                    <option value="pending">Pending</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="newly released">Newly Released</option>
                    <option value="released">Released</option>
                  </select>
                </div>
              </div>

              {/* STREAMING PLATFORMS DYNAMIC URLs */}
              <div className="space-y-4 border border-gray-800 p-4 rounded-lg bg-black/50">
                <h3 className="text-violet-400 font-bold uppercase tracking-widest text-sm">Streaming Links</h3>
                
                {/* Spotify (Always visible & required) */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="w-28 text-sm text-[#1DB954] font-bold">Spotify</span>
                  <input type="url" name="spotifyUrl" required defaultValue={editingAlbum?.spotify_url || ''} className="flex-1 bg-gray-900 border border-gray-700 rounded p-2 text-white text-sm focus:border-[#1DB954] outline-none transition-colors" placeholder="https://open.spotify.com/..." />
                </div>

                {/* YouTube */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <label className="w-28 flex items-center gap-2 text-sm text-gray-400 cursor-pointer hover:text-white transition-colors">
                    <input type="checkbox" checked={showYouTube} onChange={(e) => setShowYouTube(e.target.checked)} className="rounded bg-black border-gray-700 text-[#FF0000] focus:ring-[#FF0000]" />
                    YouTube
                  </label>
                  {showYouTube && (
                    <input type="url" name="youtubeUrl" defaultValue={editingAlbum?.youtube_url || ''} className="flex-1 bg-gray-900 border border-gray-700 rounded p-2 text-white text-sm focus:border-[#FF0000] outline-none transition-colors" placeholder="https://youtube.com/..." />
                  )}
                </div>

                {/* Apple Music */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <label className="w-28 flex items-center gap-2 text-sm text-gray-400 cursor-pointer hover:text-white transition-colors">
                    <input type="checkbox" checked={showAppleMusic} onChange={(e) => setShowAppleMusic(e.target.checked)} className="rounded bg-black border-gray-700 text-[#FA243C] focus:ring-[#FA243C]" />
                    Apple Music
                  </label>
                  {showAppleMusic && (
                    <input type="url" name="appleMusicUrl" defaultValue={editingAlbum?.apple_music_url || ''} className="flex-1 bg-gray-900 border border-gray-700 rounded p-2 text-white text-sm focus:border-[#FA243C] outline-none transition-colors" placeholder="https://music.apple.com/..." />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Cover Image {editingAlbum && '(Leave blank to keep current)'}</label>
                <input type="file" name="coverImage" accept="image/*" required={!editingAlbum} className="w-full bg-black border border-gray-700 rounded p-2 text-gray-400" />
              </div>
              
              <button type="submit" disabled={isProcessing} className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded uppercase tracking-widest disabled:opacity-50 transition-colors">
                {isProcessing ? 'Saving...' : 'Save Album'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}