'use client';

import { useState } from 'react';
import Image from 'next/image';
import { deleteStorageFiles } from '@/app/lib/actions';

export default function StorageManager({ files, bucketName, publicUrlBase }: { files: any[], bucketName: string, publicUrlBase: string }) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelect = (name: string) => {
    setSelectedFiles(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };

  const handleDelete = async () => {
    if (!confirm(`Permanently delete ${selectedFiles.length} file(s) from ${bucketName}?`)) return;
    setIsProcessing(true);
    await deleteStorageFiles(bucketName, selectedFiles);
    setSelectedFiles([]);
    setIsProcessing(false);
  };

  return (
    <div className="mb-12">
      <div className="flex justify-between items-end mb-4 border-b border-gray-800 pb-2">
        <h2 className="text-xl font-bold text-gray-200 uppercase tracking-widest">Bucket: <span className="text-violet-400">{bucketName}</span></h2>
        {selectedFiles.length > 0 && (
          <button onClick={handleDelete} disabled={isProcessing} className="bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-4 rounded text-sm transition-colors">
            {isProcessing ? 'Deleting...' : `Delete Selected (${selectedFiles.length})`}
          </button>
        )}
      </div>

      {!files || files.length === 0 ? (
        <p className="text-gray-600 italic">No files in this bucket.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {files.map((file) => (
            <div key={file.name} className="relative group aspect-square rounded overflow-hidden border border-gray-800 bg-black">
              <input 
                type="checkbox" 
                checked={selectedFiles.includes(file.name)} 
                onChange={() => handleSelect(file.name)} 
                className="absolute top-2 left-2 z-10 w-4 h-4 cursor-pointer"
              />
              <Image 
                src={`${publicUrlBase}/${bucketName}/${file.name}`} 
                alt={file.name} 
                fill 
                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                unoptimized
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}