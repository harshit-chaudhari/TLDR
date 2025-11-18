'use client';

import { useState, useMemo } from 'react';
import {
  Content,
  ContentType,
  Platform,
  top10Movies,
  top10Shows,
  newReleaseMovies,
  newReleaseShows,
  upcomingMovies,
  upcomingShows,
} from '@/data/content';
import Image from 'next/image';
import PlatformSelector from './PlatformSelector';
import ContentTypeToggle from './ContentTypeToggle';
import TitleCard from './TitleCard';
import TrailerModal from './TrailerModal';

type Section = 'top10' | 'justin' | 'upcoming';

const languages = ['All', 'English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam'];

export default function ContentBrowser() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>('Netflix');
  const [activeSection, setActiveSection] = useState<Section>('top10');
  const [contentType, setContentType] = useState<ContentType>('movie');
  const [selectedLanguage, setSelectedLanguage] = useState('All');

  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter logic - ONE platform at a time
  const filteredContent = useMemo(() => {
    if (!selectedPlatform) return [];

    let content: Content[] = [];

    // Select base content based on section and type
    if (activeSection === 'top10') {
      content = contentType === 'movie' ? [...top10Movies] : [...top10Shows];
    } else if (activeSection === 'justin') {
      content = contentType === 'movie' ? [...newReleaseMovies] : [...newReleaseShows];
    } else if (activeSection === 'upcoming') {
      content = contentType === 'movie' ? [...upcomingMovies] : [...upcomingShows];
    }

    // Filter by selected platform (only ONE)
    content = content.filter(item => item.platform === selectedPlatform);

    // TODO: Language filter when we have language data
    // if (selectedLanguage !== 'All') {
    //   content = content.filter(item => item.language === selectedLanguage);
    // }

    // For Top 10, limit to 10 items
    if (activeSection === 'top10') {
      content = content.slice(0, 10);
    }

    return content;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlatform, activeSection, contentType]);

  const handleTrailerClick = (content: Content) => {
    setSelectedContent(content);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedContent(null), 300);
  };

  const sectionTitles = {
    top10: 'Top 10',
    justin: 'Just In',
    upcoming: 'Upcoming',
  };

  const sectionDescriptions = {
    top10: 'Most watched this week',
    justin: 'Fresh arrivals ready to stream',
    upcoming: 'Coming soon',
  };

  // Format date for upcoming section
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    return `${day} ${month}`;
  };

  return (
    <>
      {/* Platform Selection */}
      <PlatformSelector
        selected={selectedPlatform}
        onChange={setSelectedPlatform}
      />

      {/* Content Sections */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-tldr-dark min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Section Tabs */}
          <div className="mb-12 flex justify-center">
            <div className="inline-flex gap-2 bg-tldr-darkGray/30 backdrop-blur-sm p-2 rounded-2xl border border-tldr-lightGray/20">
              {(['top10', 'justin', 'upcoming'] as Section[]).map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`px-6 sm:px-8 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 ${
                    activeSection === section
                      ? 'bg-tldr-gold text-black shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {sectionTitles[section]}
                </button>
              ))}
            </div>
          </div>

          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {sectionTitles[activeSection]}
            </h2>
            <p className="text-base text-gray-500">
              {sectionDescriptions[activeSection]}
            </p>
          </div>

          {/* Filter Bar */}
          <div className="mb-10 flex flex-wrap items-center justify-center gap-4">
            {/* Content Type Toggle */}
            <ContentTypeToggle
              selected={contentType}
              onChange={setContentType}
            />

            {/* Language Filter */}
            <div className="inline-flex bg-tldr-darkGray rounded-lg p-1">
              {languages.slice(0, 3).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-4 sm:px-6 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                    selectedLanguage === lang
                      ? 'bg-tldr-gold text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Results Count */}
            <div className="text-gray-500 text-sm">
              {filteredContent.length} {filteredContent.length === 1 ? 'result' : 'results'}
            </div>
          </div>

          {/* Content Display */}
          {!selectedPlatform ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-2xl font-semibold text-white mb-2">
                Select a Platform
              </h3>
              <p className="text-gray-500">
                Choose a streaming service above to start exploring
              </p>
            </div>
          ) : filteredContent.length > 0 ? (
            <>
              {/* Top 10 - Grid with ranks */}
              {activeSection === 'top10' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                  {filteredContent.map((content, index) => (
                    <TitleCard
                      key={content.id}
                      content={content}
                      rank={index + 1}
                      onTrailerClick={handleTrailerClick}
                    />
                  ))}
                </div>
              )}

              {/* Just In - Grid without ranks */}
              {activeSection === 'justin' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                  {filteredContent.map((content) => (
                    <TitleCard
                      key={content.id}
                      content={content}
                      onTrailerClick={handleTrailerClick}
                    />
                  ))}
                </div>
              )}

              {/* Upcoming - Timeline with dates */}
              {activeSection === 'upcoming' && (
                <div className="max-w-5xl mx-auto">
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-tldr-lightGray/20" />

                    {/* Timeline items */}
                    <div className="space-y-8">
                      {filteredContent.map((content, index) => (
                        <div key={content.id} className="relative pl-20">
                          {/* Date badge */}
                          <div className="absolute left-0 top-0 w-16 text-center">
                            <div className="bg-tldr-gold text-black font-bold py-2 px-3 rounded-lg text-sm">
                              {formatDate(content.releaseDate)}
                            </div>
                          </div>

                          {/* Content card - horizontal */}
                          <div
                            onClick={() => handleTrailerClick(content)}
                            className="flex gap-4 bg-tldr-darkGray/30 hover:bg-tldr-darkGray/50 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] border border-tldr-lightGray/10"
                          >
                            {/* Poster */}
                            <div className="flex-shrink-0 w-20 sm:w-24 aspect-[2/3] rounded-lg overflow-hidden bg-tldr-gray relative">
                              <Image
                                src={content.poster}
                                alt={content.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 80px, 96px"
                              />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-bold text-lg mb-1 line-clamp-1">
                                {content.title}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                                <span>TLDR {content.tldrRating}</span>
                                <span>•</span>
                                <span>{content.year}</span>
                              </div>
                              {content.genre && (
                                <div className="flex flex-wrap gap-2">
                                  {content.genre.slice(0, 3).map((g) => (
                                    <span
                                      key={g}
                                      className="text-xs px-2 py-1 bg-tldr-gray/50 text-gray-300 rounded"
                                    >
                                      {g}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Action */}
                            <div className="flex-shrink-0 flex items-center">
                              <button className="w-10 h-10 rounded-full bg-tldr-gold/20 hover:bg-tldr-gold flex items-center justify-center text-tldr-gold hover:text-black transition-all duration-200">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No {contentType === 'movie' ? 'movies' : 'shows'} found
              </h3>
              <p className="text-gray-500">
                No content available on {selectedPlatform} for this section
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Trailer Modal */}
      <TrailerModal
        content={selectedContent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
