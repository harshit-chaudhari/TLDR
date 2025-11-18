'use client';

import { useState } from 'react';
import { top10Movies, top10Shows, Content } from '@/data/content';
import TitleCard from './TitleCard';
import TrailerModal from './TrailerModal';
import ContentDetailsModal from './ContentDetailsModal';

export default function Top10Section() {
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleTrailerClick = (content: Content) => {
    setSelectedContent(content);
    setIsTrailerModalOpen(true);
  };

  const handleCardClick = (content: Content) => {
    setSelectedContent(content);
    setIsDetailsModalOpen(true);
  };

  const handleCloseTrailerModal = () => {
    setIsTrailerModalOpen(false);
    setTimeout(() => {
      if (!isDetailsModalOpen) setSelectedContent(null);
    }, 300);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setTimeout(() => {
      if (!isTrailerModalOpen) setSelectedContent(null);
    }, 300);
  };

  const handlePlayTrailerFromDetails = () => {
    setIsDetailsModalOpen(false);
    setIsTrailerModalOpen(true);
  };

  return (
    <>
      <section id="top10-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-tldr-dark">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Top 10 Right Now
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Curated picks across all major streaming platforms
            </p>
          </div>

          {/* Top 10 Movies */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-3xl font-bold text-white">Movies</h3>
              <div className="h-1 flex-1 bg-gradient-to-r from-tldr-gold to-transparent rounded" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {top10Movies.map((movie, index) => (
                <TitleCard
                  key={movie.id}
                  content={movie}
                  rank={index + 1}
                  onTrailerClick={handleTrailerClick}
                  onCardClick={handleCardClick}
                />
              ))}
            </div>
          </div>

          {/* Top 10 Shows */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-3xl font-bold text-white">TV Shows</h3>
              <div className="h-1 flex-1 bg-gradient-to-r from-tldr-gold to-transparent rounded" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {top10Shows.map((show, index) => (
                <TitleCard
                  key={show.id}
                  content={show}
                  rank={index + 1}
                  onTrailerClick={handleTrailerClick}
                  onCardClick={handleCardClick}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Details Modal */}
      <ContentDetailsModal
        content={selectedContent}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        onPlayTrailer={handlePlayTrailerFromDetails}
      />

      {/* Trailer Modal */}
      <TrailerModal
        content={selectedContent}
        isOpen={isTrailerModalOpen}
        onClose={handleCloseTrailerModal}
      />
    </>
  );
}
