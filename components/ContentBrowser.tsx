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
  getAvailableWeeks,
  allPlatforms,
} from '@/data/content';
import ContentTypeToggle from './ContentTypeToggle';
import PlatformFilter from './PlatformFilter';
import WeekPicker from './WeekPicker';
import TitleCard from './TitleCard';
import TrailerModal from './TrailerModal';

type Section = 'top10' | 'new' | 'upcoming';

export default function ContentBrowser() {
  const [activeSection, setActiveSection] = useState<Section>('top10');
  const [contentType, setContentType] = useState<ContentType>('movie');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string>(getAvailableWeeks()[0] || '');

  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter logic
  const filteredContent = useMemo(() => {
    let content: Content[] = [];

    // Select base content based on section and type
    if (activeSection === 'top10') {
      content = contentType === 'movie' ? [...top10Movies] : [...top10Shows];
      // Filter by selected week
      if (selectedWeek) {
        content = content.filter(item => item.weekStart === selectedWeek);
      }
    } else if (activeSection === 'new') {
      content = contentType === 'movie' ? [...newReleaseMovies] : [...newReleaseShows];
    } else if (activeSection === 'upcoming') {
      content = contentType === 'movie' ? [...upcomingMovies] : [...upcomingShows];
    }

    // Filter by platforms (if any selected)
    if (selectedPlatforms.length > 0 && selectedPlatforms.length < allPlatforms.length) {
      content = content.filter(item => selectedPlatforms.includes(item.platform));
    }

    return content;
  }, [activeSection, contentType, selectedPlatforms, selectedWeek]);

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
    new: 'New Releases',
    upcoming: 'Upcoming Releases',
  };

  const sectionDescriptions = {
    top10: 'This week\'s most-watched content across all platforms',
    new: 'Recently released and ready to stream',
    upcoming: 'Coming soon to your favorite platforms',
  };

  return (
    <>
      <section id="content-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-tldr-dark min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Section Tabs */}
          <div className="mb-8 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {(['top10', 'new', 'upcoming'] as Section[]).map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-200 ${
                    activeSection === section
                      ? 'bg-tldr-gold text-tldr-dark shadow-lg'
                      : 'bg-tldr-darkGray text-gray-400 hover:text-white hover:bg-tldr-gray'
                  }`}
                >
                  {sectionTitles[section]}
                </button>
              ))}
            </div>
          </div>

          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              {sectionTitles[activeSection]}
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {sectionDescriptions[activeSection]}
            </p>
          </div>

          {/* Filter Bar */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 bg-tldr-darkGray/50 backdrop-blur-sm p-4 rounded-lg border border-tldr-lightGray/30">
            <div className="flex flex-wrap items-center gap-4">
              {/* Content Type Toggle */}
              <ContentTypeToggle
                selected={contentType}
                onChange={setContentType}
              />

              {/* Platform Filter */}
              <PlatformFilter
                selected={selectedPlatforms}
                onChange={setSelectedPlatforms}
              />

              {/* Week Picker - Only for Top 10 */}
              {activeSection === 'top10' && (
                <WeekPicker
                  selected={selectedWeek}
                  availableWeeks={getAvailableWeeks()}
                  onChange={setSelectedWeek}
                />
              )}
            </div>

            {/* Results Count */}
            <div className="text-gray-400 text-sm">
              {filteredContent.length} {filteredContent.length === 1 ? 'title' : 'titles'}
            </div>
          </div>

          {/* Content Grid */}
          {filteredContent.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {filteredContent.map((content, index) => (
                <TitleCard
                  key={content.id}
                  content={content}
                  rank={activeSection === 'top10' ? index + 1 : undefined}
                  onTrailerClick={handleTrailerClick}
                />
              ))}
            </div>
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
                Try adjusting your filters or check back later
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
