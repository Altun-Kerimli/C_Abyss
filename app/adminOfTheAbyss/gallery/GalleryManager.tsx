'use client';

import { useState } from 'react';
import Image from 'next/image';
import { uploadGalleryImages, deleteGalleryImages } from '@/app/lib/actions';

export default function GalleryManager({ images }: { images: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} image(s)? This will remove them from the database and storage permanently.`)) return;
    setIsProcessing(true);
    await deleteGalleryImages(selectedIds);
    setSelectedIds([]);
    setIsProcessing(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    // Call the new plural function
    await uploadGalleryImages(new FormData(e.currentTarget)); 
    setIsProcessing(false);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => setIsModalOpen(true)} className="bg-green-600 hover:bg-green-500 text-black font-bold py-2 px-4 rounded transition-colors">
          + Upload Image
        </button>
        {selectedIds.length > 0 && (
          <button onClick={handleDelete} disabled={isProcessing} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded transition-colors">
            {isProcessing ? 'Processing...' : `Delete Selected (${selectedIds.length})`}
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-gray-900/50 border border-gray-800 rounded-lg">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-gray-900 text-xs uppercase text-gray-500 border-b border-gray-800">
            <tr>
              <th className="p-4 w-12 text-center">
                <input type="checkbox" onChange={(e) => setSelectedIds(e.target.checked ? images.map(img => img.id) : [])} checked={images.length > 0 && selectedIds.length === images.length} />
              </th>
              <th className="p-4 w-24 text-center">Preview</th>
              <th className="p-4">Title (Optional)</th>
              <th className="p-4 text-center">Upload Date</th>
            </tr>
          </thead>
          <tbody>
            {images.map((img) => (
              <tr key={img.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                <td className="p-4 text-center">
                  <input type="checkbox" checked={selectedIds.includes(img.id)} onChange={() => handleSelect(img.id)} />
                </td>
                <td className="p-4">
                  <div className="relative w-16 h-16 mx-auto rounded overflow-hidden border border-gray-700">
                    <Image src={img.image_url} alt="Preview" fill className="object-cover" unoptimized />
                  </div>
                </td>
                <td className="p-4 font-bold text-gray-200">{img.title || <span className="text-gray-600 italic">No Title</span>}</td>
                <td className="p-4 text-center">{new Date(img.created_at).toLocaleDateString('en-GB')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* UPLOAD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-lg w-full p-6 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>
            <h2 className="text-2xl font-bold text-violet-400 mb-6 uppercase tracking-widest">Upload to Gallery</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Image Files</label>
                <input type="file" name="images" multiple accept="image/*" required className="w-full bg-black border border-gray-700 rounded p-2 text-gray-400" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title <span className="text-gray-600 text-xs">(Optional)</span></label>
                <input type="text" name="title" className="w-full bg-black border border-gray-700 rounded p-2 text-white" placeholder="Add Name" />
              </div>
              <button type="submit" disabled={isProcessing} className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded uppercase tracking-widest disabled:opacity-50 transition-colors">
                {isProcessing ? 'Uploading...' : 'Upload'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}