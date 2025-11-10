'use client';

import { ContentType } from '@/data/content';

interface ContentTypeToggleProps {
  selected: ContentType;
  onChange: (type: ContentType) => void;
}

export default function ContentTypeToggle({ selected, onChange }: ContentTypeToggleProps) {
  return (
    <div className="inline-flex bg-tldr-darkGray rounded-lg p-1">
      <button
        onClick={() => onChange('movie')}
        className={`px-6 py-2 rounded-md font-semibold transition-all duration-200 ${
          selected === 'movie'
            ? 'bg-tldr-gold text-tldr-dark'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        Movies
      </button>
      <button
        onClick={() => onChange('show')}
        className={`px-6 py-2 rounded-md font-semibold transition-all duration-200 ${
          selected === 'show'
            ? 'bg-tldr-gold text-tldr-dark'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        Shows
      </button>
    </div>
  );
}
