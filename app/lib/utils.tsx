import React from 'react';

export function parseContent(content: string) {
  if (!content) return null;

  // 1. Split by new lines first
  return content.split('\n').map((line, i) => {
    // 2. For each line, find links inside {}
    const parts = line.split(/\{(https?:\/\/[^\s}]+)\}/g);
    
    return (
      <span key={i} className="block min-h-[1.5rem]">
        {parts.map((part, j) => {
          if (part.startsWith('http')) {
            return (
              <a 
                key={j} 
                href={part} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-violet-400 hover:text-violet-300 underline underline-offset-4 decoration-violet-500/50 transition-colors"
                onClick={(e) => e.stopPropagation()} // Prevents opening modal when clicking link
              >
                {part.replace(/^https?:\/\//, '')}
              </a>
            );
          }
          return part;
        })}
      </span>
    );
  });
}