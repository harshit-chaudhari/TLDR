'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getTrendingByPlatformAndWeek, getPopularByPlatformAndDate, getUpcomingByPlatformAndDate, getPosterUrl, TMDBMovie, TMDBShow } from '@/lib/tmdb';
import { PlatformLogo } from '@/components/PlatformLogo';
import DetailsOverlay from '@/components/DetailsOverlay';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { extractDominantColor } from '@/lib/colorExtractor';

type Section = 'top10' | 'new' | 'upcoming';
type MediaType = 'movie' | 'tv';
type Platform = 'JioHotstar' | 'NETFLIX' | 'prime video' | 'Disney+' | 'hoichoi' | 'Apple TV' | 'Zee5' | 'SonyLIV';
type DurationFilter = 'This Week' | 'Last Week' | 'This Month' | 'Next Week';

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>('top10');
  const [mediaType, setMediaType] = useState<MediaType>('movie');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('JioHotstar');
  const [durationFilter, setDurationFilter] = useState<DurationFilter>('This Week');
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const [showWeekPicker, setShowWeekPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPosterIndex, setCurrentPosterIndex] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayIndex, setOverlayIndex] = useState(0);
  const [hasInitialAnimationPlayed, setHasInitialAnimationPlayed] = useState(false);
  const [backgroundGradient, setBackgroundGradient] = useState('rgba(212, 175, 55, 0.35)');

  const [top10Movies, setTop10Movies] = useState<TMDBMovie[]>([]);
  const [top10Shows, setTop10Shows] = useState<TMDBShow[]>([]);
  const [newMovies, setNewMovies] = useState<TMDBMovie[]>([]);
  const [newShows, setNewShows] = useState<TMDBShow[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<TMDBMovie[]>([]);
  const [upcomingShows, setUpcomingShows] = useState<TMDBShow[]>([]);

  // Fetch data - refetch when platform, week, or duration changes
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Top 10 - filtered by platform and week
        const [trendingMovies, trendingShows] = await Promise.all([
          getTrendingByPlatformAndWeek('movie', selectedPlatform, selectedWeek),
          getTrendingByPlatformAndWeek('tv', selectedPlatform, selectedWeek),
        ]);

        // Just In - filtered by platform and duration
        const [popularMovies, popularShows] = await Promise.all([
          getPopularByPlatformAndDate('movie', selectedPlatform, durationFilter as any),
          getPopularByPlatformAndDate('tv', selectedPlatform, durationFilter as any),
        ]);

        // Upcoming - filtered by platform and duration
        const [upcomingMoviesData, upcomingShowsData] = await Promise.all([
          getUpcomingByPlatformAndDate('movie', selectedPlatform, durationFilter as any),
          getUpcomingByPlatformAndDate('tv', selectedPlatform, durationFilter as any),
        ]);

        setTop10Movies(trendingMovies);
        setTop10Shows(trendingShows);
        setNewMovies(popularMovies);
        setNewShows(popularShows);
        setUpcomingMovies(upcomingMoviesData);
        setUpcomingShows(upcomingShowsData);
      } catch (error) {
        console.error('Error fetching TMDB data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedPlatform, selectedWeek, durationFilter]);

  const getCurrentContent = () => {
    if (activeSection === 'top10') {
      return mediaType === 'movie' ? top10Movies : top10Shows;
    } else if (activeSection === 'new') {
      return mediaType === 'movie' ? newMovies : newShows;
    } else {
      // Sort upcoming content chronologically by release date
      const upcomingContent = mediaType === 'movie' ? upcomingMovies : upcomingShows;
      return [...upcomingContent].sort((a, b) => {
        const dateA = 'release_date' in a ? a.release_date : a.first_air_date;
        const dateB = 'release_date' in b ? b.release_date : b.first_air_date;
        if (!dateA) return 1;
        if (!dateB) return -1;
        return new Date(dateA).getTime() - new Date(dateB).getTime();
      });
    }
  };

  const currentContent = getCurrentContent();
  const heroContent = mediaType === 'movie' ? top10Movies : top10Shows;

  // Initial animation on page load
  useEffect(() => {
    // Wait for content to load, then play initial animation
    if (heroContent.length > 0 && !hasInitialAnimationPlayed) {
      const timer = setTimeout(() => {
        setHasInitialAnimationPlayed(true);
      }, 1500); // Give 1.5s for the initial spread animation
      return () => clearTimeout(timer);
    }
  }, [heroContent.length, hasInitialAnimationPlayed]);

  // Infinite carousel rotation - only starts after initial animation
  useEffect(() => {
    if (!hasInitialAnimationPlayed) return;

    const interval = setInterval(() => {
      setCurrentPosterIndex((prev) => (prev + 1) % 10);
    }, 3000);
    return () => clearInterval(interval);
  }, [hasInitialAnimationPlayed]);

  // Extract dominant color from current center poster
  useEffect(() => {
    const currentItem = heroContent[currentPosterIndex];
    if (!currentItem?.poster_path) return;

    const posterUrl = getPosterUrl(currentItem.poster_path);

    extractDominantColor(posterUrl).then(color => {
      setBackgroundGradient(color);
    });
  }, [currentPosterIndex, heroContent]);

  const selectPlatform = (platform: Platform) => {
    setSelectedPlatform(platform);
  };

  const openOverlay = (index: number) => {
    setOverlayIndex(index);
    setShowOverlay(true);
  };

  const closeOverlay = () => {
    setShowOverlay(false);
  };

  // Helper to get week start date (Monday)
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  // Format week range for display
  const formatWeekRange = (date: Date) => {
    const weekStart = getWeekStart(date);
    const month = weekStart.toLocaleDateString('en-US', { month: 'long' });
    const day = weekStart.getDate();
    const year = weekStart.getFullYear();
    return `WEEK OF ${month.toUpperCase()} ${day}, ${year}`;
  };

  // Navigate weeks
  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setSelectedWeek(newDate);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="h-[92px] bg-black border-b border-[#444444]">
        <div className="h-full flex items-center">
          {/* Left Section - TLDR Logo */}
          <div className="w-[240px] h-full border-r border-[#444444] flex items-center justify-center px-[54px] py-[28px]">
            <h1 className="text-[44px] font-bold leading-[0] text-transparent bg-clip-text bg-gradient-to-r from-[#e69d2e] to-[#a46e1d] uppercase" style={{ fontFamily: "'Bebas Neue', 'Gia Variable', sans-serif", textShadow: 'rgba(0,0,0,0.4) 0px 0px 36.202px' }}>
              TLDR
            </h1>
          </div>

          {/* Center Section - Heading */}
          <div className="flex-1 h-full border-r border-[#444444] flex items-center justify-center px-[40px] py-[28px]">
            <h2 className="text-[28px] font-bold leading-none tracking-[12.32px] uppercase whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-[rgba(255,255,255,0.72)] via-[#ffffff] to-[rgba(255,255,255,0.8)]" style={{ fontFamily: "'Red Hat Display', sans-serif" }}>
              TOP TEN TRENDING TITLES
            </h2>
          </div>

          {/* Right Section - Top 10 Button */}
          <div className="w-[240px] h-full flex items-center justify-center px-[54px] py-[28px]">
            <button className="relative backdrop-blur-[9.057px] bg-gradient-to-r from-[rgba(0,0,0,0.008)] via-[rgba(0,0,0,0.01)] to-[rgba(0,0,0,0.008)] border-[1.5px] border-solid border-[#e69d2e] rounded-[32px] px-[24px] py-[12px] hover:from-[rgba(230,157,46,0.1)] hover:via-[rgba(230,157,46,0.15)] hover:to-[rgba(230,157,46,0.1)] transition-all whitespace-nowrap">
              <span className="text-[18px] font-bold tracking-[5.4px] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#e69d2e] to-[#a46e1d]" style={{ fontFamily: "'Red Hat Display', sans-serif" }}>
                Top 10
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section - Infinite Carousel with Overlapping Posters */}
      <section className="relative h-[783px] bg-black overflow-hidden py-12">
        {/* Dynamic Gradient Background */}
        <div
          className="absolute inset-0 transition-all duration-1000 ease-in-out"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${backgroundGradient}, transparent 70%)`
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center px-16">
          <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: '2000px' }}>
            {heroContent.slice(0, 10).map((item, index) => {
              const title = 'title' in item ? item.title : item.name;
              const position = ((index - currentPosterIndex + 10) % 10);

              // Only show 5 posters at a time: positions 0, 1, 2, 3, 4
              // Position 2 is center
              const isVisible = position < 5;

              if (!isVisible) return null;

              // Center poster (position 2) - highest z-index
              const isCenter = position === 2;
              // Adjacent posters (positions 1 and 3) - middle z-index
              const isAdjacent = position === 1 || position === 3;

              // Z-index: center (50) > adjacent (40) > far (25)
              const getZIndex = () => {
                if (isCenter) return 50;
                if (isAdjacent) return 40;
                return 25; // Far posters behind adjacent
              };

              // Initial animation: all cards start stacked in center, then spread out
              const getInitialTransform = () => {
                if (!hasInitialAnimationPlayed) {
                  // All cards start in center, slightly stacked
                  return `
                    translate(-50%, -50%)
                    translateX(0px)
                    scale(0.95)
                    rotateY(0deg)
                  `;
                }
                // Final positions after animation
                return `
                  translate(-50%, -50%)
                  translateX(${(position - 2) * 300}px)
                  scale(${isCenter ? 1.1 : isAdjacent ? 0.9 : 0.75})
                  ${position < 2 ? 'rotateY(18deg)' : position > 2 ? 'rotateY(-18deg)' : ''}
                `;
              };

              const getInitialOpacity = () => {
                if (!hasInitialAnimationPlayed) {
                  // All cards slightly visible initially
                  return index === 2 ? 1 : 0.3; // Only center card fully visible
                }
                return isCenter ? 1 : isAdjacent ? 0.85 : 0.5;
              };

              return (
                <div
                  key={`${item.id}-${index}`}
                  className="absolute transition-all ease-out"
                  style={{
                    left: '50%',
                    top: '50%',
                    zIndex: getZIndex(),
                    transform: getInitialTransform(),
                    opacity: getInitialOpacity(),
                    filter: isCenter ? 'brightness(1)' : isAdjacent ? 'brightness(0.7)' : 'brightness(0.5)',
                    transitionDuration: hasInitialAnimationPlayed ? '700ms' : '1200ms',
                    transitionDelay: hasInitialAnimationPlayed ? '0ms' : `${index * 80}ms`, // Stagger the initial animation
                  }}
                >
                  <div className="relative w-[360px] h-[540px] rounded-lg overflow-hidden shadow-[0px_0px_40px_rgba(0,0,0,0.48)]">
                    <Image
                      src={getPosterUrl(item.poster_path)}
                      alt={title}
                      fill
                      className="object-cover"
                      sizes="320px"
                      priority={isCenter}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
          <div className="w-2 h-2 rounded-full bg-white"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="border-t border-b border-[#444]">
        <div className="flex items-center justify-center">
          <button
            onClick={() => setActiveSection('new')}
            className={`w-[480px] h-[84px] flex items-center justify-center border-r border-[#444] transition-all ${
              activeSection === 'new' ? 'border-b-2 border-b-[#e69d2e]' : ''
            }`}
          >
            <span className={`text-[28px] font-semibold tracking-[6.72px] uppercase ${
              activeSection === 'new'
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#e69d2e] to-[#a46e1d]'
                : 'text-transparent bg-clip-text bg-gradient-to-r from-[rgba(255,255,255,0.48)] via-[rgba(255,255,255,0.6)] to-[rgba(255,255,255,0.53)]'
            }`} style={{ textShadow: 'rgba(0,0,0,0.56) 4px 4px 28px' }}>
              JUST IN
            </span>
          </button>
          <button
            onClick={() => setActiveSection('top10')}
            className={`w-[480px] h-[84px] flex items-center justify-center transition-all ${
              activeSection === 'top10' ? 'border-b-2 border-b-[#e69d2e]' : ''
            }`}
          >
            <span className={`text-[28px] font-bold tracking-[6.72px] uppercase ${
              activeSection === 'top10'
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#e69d2e] to-[#a46e1d]'
                : 'text-transparent bg-clip-text bg-gradient-to-r from-[rgba(255,255,255,0.48)] via-[rgba(255,255,255,0.6)] to-[rgba(255,255,255,0.53)]'
            }`} style={{ textShadow: 'rgba(0,0,0,0.56) 4px 4px 28px' }}>
              TOP 10
            </span>
          </button>
          <button
            onClick={() => setActiveSection('upcoming')}
            className={`w-[480px] h-[84px] flex items-center justify-center border-l border-[#444] transition-all ${
              activeSection === 'upcoming' ? 'border-b-2 border-b-[#e69d2e]' : ''
            }`}
          >
            <span className={`text-[28px] font-semibold tracking-[6.72px] uppercase ${
              activeSection === 'upcoming'
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#e69d2e] to-[#a46e1d]'
                : 'text-transparent bg-clip-text bg-gradient-to-r from-[rgba(255,255,255,0.48)] via-[rgba(255,255,255,0.6)] to-[rgba(255,255,255,0.53)]'
            }`} style={{ textShadow: 'rgba(0,0,0,0.56) 4px 4px 28px' }}>
              UPCOMING
            </span>
          </button>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-black py-8 px-14">
        <div className="max-w-[1440px] mx-auto">
          {/* Filters */}
          <div className="mb-8 space-y-6">
            <div className="flex items-center justify-between">
              {/* Movies/Shows Toggle */}
              <div className="flex items-center border border-[#444] rounded-[30px] p-[6px] w-[320px] h-[60px]">
                <button
                  onClick={() => setMediaType('movie')}
                  className={`flex-1 h-[48px] rounded-[29px] flex items-center justify-center transition-all ${
                    mediaType === 'movie' ? 'bg-gradient-to-b from-[rgba(255,255,255,0.84)] via-[#ffffff] to-[rgba(255,255,255,0.88)]' : ''
                  }`}
                >
                  <span className={`text-[17px] font-bold tracking-[0.68px] uppercase ${
                    mediaType === 'movie'
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-[rgba(0,0,0,0.8)] via-[#000000] to-[rgba(0,0,0,0.88)]'
                      : 'text-transparent bg-clip-text bg-gradient-to-r from-[rgba(255,255,255,0.8)] via-[#ffffff] to-[rgba(255,255,255,0.88)]'
                  }`}>
                    MOVIES
                  </span>
                </button>
                <button
                  onClick={() => setMediaType('tv')}
                  className={`flex-1 h-[48px] rounded-[29px] flex items-center justify-center transition-all ${
                    mediaType === 'tv' ? 'bg-gradient-to-b from-[rgba(255,255,255,0.84)] via-[#ffffff] to-[rgba(255,255,255,0.88)]' : ''
                  }`}
                >
                  <span className={`text-[17px] font-bold tracking-[0.68px] uppercase ${
                    mediaType === 'tv'
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-[rgba(0,0,0,0.8)] via-[#000000] to-[rgba(0,0,0,0.88)]'
                      : 'text-transparent bg-clip-text bg-gradient-to-r from-[rgba(255,255,255,0.8)] via-[#ffffff] to-[rgba(255,255,255,0.88)]'
                  }`}>
                    SHOWS
                  </span>
                </button>
              </div>

              {/* Week Picker (only for top10) OR Duration Filter (Just In & Upcoming) */}
              {activeSection === 'top10' ? (
                <div className="relative flex items-center gap-2">
                  <button
                    onClick={() => navigateWeek('prev')}
                    className="w-10 h-10 flex items-center justify-center border border-[#444] hover:border-[#666] hover:bg-white/5 transition-all"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setShowWeekPicker(!showWeekPicker)}
                    className="border border-[#444444] border-solid h-[60px] w-[410px] flex items-center gap-[16px] pr-[16px] hover:border-[#666] transition-all"
                  >
                    <div className="h-full w-[60px] bg-gradient-to-b from-[rgba(255,255,255,0.04)] to-[rgba(255,255,255,0)] border-r border-[#444444] flex items-center justify-center">
                      <svg className="w-[18px] h-[20px] text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                    <span className="flex-1 text-[16px] font-extrabold tracking-[2.56px] uppercase text-center text-transparent bg-clip-text bg-gradient-to-r from-[rgba(255,255,255,0.8)] via-[#ffffff] to-[rgba(255,255,255,0.88)]" style={{ fontFamily: "'Red Hat Display', sans-serif" }}>
                      {formatWeekRange(selectedWeek)}
                    </span>
                  </button>
                  <button
                    onClick={() => navigateWeek('next')}
                    className="w-10 h-10 flex items-center justify-center border border-[#444] hover:border-[#666] hover:bg-white/5 transition-all"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Week Picker Dropdown */}
                  {showWeekPicker && (
                    <div className="absolute top-full mt-2 right-0 z-50 bg-[#1a1a1a] border border-[#444] rounded-lg p-4 shadow-2xl">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-300">Select Week</h3>
                        <button
                          onClick={() => setShowWeekPicker(false)}
                          className="text-gray-500 hover:text-white"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {Array.from({ length: 12 }, (_, i) => {
                          const weekDate = new Date();
                          weekDate.setDate(weekDate.getDate() - (i * 7));
                          const isSelected = formatWeekRange(weekDate) === formatWeekRange(selectedWeek);
                          return (
                            <button
                              key={i}
                              onClick={() => {
                                setSelectedWeek(weekDate);
                                setShowWeekPicker(false);
                              }}
                              className={`w-full text-left px-4 py-2 rounded text-sm transition-all ${
                                isSelected
                                  ? 'bg-[#d4af37] text-black font-semibold'
                                  : 'text-gray-300 hover:bg-white/10'
                              }`}
                            >
                              {formatWeekRange(weekDate)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Duration Filter for Just In & Upcoming - moved to right side
                <div className="flex items-center gap-2">
                  {(activeSection === 'new'
                    ? ['This Week', 'Last Week', 'This Month']
                    : ['This Week', 'Next Week', 'This Month']
                  ).map((duration) => (
                    <button
                      key={duration}
                      onClick={() => setDurationFilter(duration as DurationFilter)}
                      className={`border border-[#444444] h-[60px] px-8 flex items-center justify-center transition-all ${
                        durationFilter === duration
                          ? 'bg-gradient-to-b from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0)] border-[#666]'
                          : 'hover:bg-[rgba(255,255,255,0.02)] hover:border-[#666]'
                      }`}
                    >
                      <span className={`text-[14px] font-bold tracking-[2.24px] uppercase ${
                        durationFilter === duration
                          ? 'text-transparent bg-clip-text bg-gradient-to-r from-[rgba(255,255,255,0.8)] via-[#ffffff] to-[rgba(255,255,255,0.88)]'
                          : 'text-transparent bg-clip-text bg-gradient-to-r from-[rgba(255,255,255,0.4)] via-[rgba(255,255,255,0.5)] to-[rgba(255,255,255,0.44)]'
                      }`} style={{ fontFamily: "'Red Hat Display', sans-serif" }}>
                        {duration}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Platform Pills - Single Row (only platforms with logos) */}
            <div className="flex border-t border-b border-[#444]">
              {(['JioHotstar', 'NETFLIX', 'prime video', 'Disney+', 'hoichoi', 'Apple TV', 'Zee5', 'SonyLIV'] as Platform[]).map((platform) => {
                const isSelected = selectedPlatform === platform;

                return (
                  <button
                    key={platform}
                    onClick={() => selectPlatform(platform)}
                    className={`flex-1 h-[68px] flex items-center justify-center border-r border-[#444] last:border-r-0 transition-all ${
                      isSelected
                        ? 'bg-gradient-to-b from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0)]'
                        : 'hover:bg-[rgba(255,255,255,0.02)]'
                    }`}
                  >
                    <PlatformLogo platform={platform} isSelected={isSelected} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Grid */}
          {loading ? (
            activeSection === 'top10' ? (
              <SkeletonLoader type="top10" />
            ) : activeSection === 'new' ? (
              <SkeletonLoader type="grid" />
            ) : (
              <SkeletonLoader type="horizontal" />
            )
          ) : activeSection === 'top10' ? (
            <div className="grid grid-cols-5 gap-0">
              {currentContent.slice(0, 10).map((item, index) => {
                const title = 'title' in item ? item.title : item.name;
                const posterUrl = getPosterUrl(item.poster_path);

                return (
                  <div
                    key={item.id}
                    className="relative border border-[#1a1a1a] overflow-hidden"
                    onClick={() => openOverlay(index)}
                  >
                    <div className="relative aspect-[2/3] bg-[#0a0a0a] group cursor-pointer">
                      <Image
                        src={posterUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="288px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-center">
                          <p className="text-white text-base font-bold text-center line-clamp-3">{title}</p>
                        </div>
                      </div>
                      {/* Platform Logo Badge */}
                      <div className="absolute top-3 right-3">
                        <PlatformLogo platform={selectedPlatform} isSelected={true} size="badge" />
                      </div>
                      {/* Rank Badge - Large and Prominent */}
                      <div className="absolute top-0 left-0 w-24 h-24">
                        {/* Shadow/Glow effect */}
                        <div className="absolute inset-0 bg-[#d4af37] opacity-30 blur-2xl"></div>
                        {/* Main number */}
                        <div className="relative w-full h-full flex items-start justify-start p-2">
                          <span className="text-[64px] font-black leading-none text-[#d4af37] drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]" style={{
                            textShadow: '3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 4px 4px 8px rgba(0,0,0,0.6)',
                            WebkitTextStroke: '2px rgba(0,0,0,0.5)'
                          }}>
                            {index + 1}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : activeSection === 'new' ? (
            <div className="grid grid-cols-6 gap-4">
              {currentContent.slice(0, 18).map((item, index) => {
                const title = 'title' in item ? item.title : item.name;
                const posterUrl = getPosterUrl(item.poster_path);

                return (
                  <div
                    key={item.id}
                    className="relative overflow-hidden rounded-lg"
                    onClick={() => openOverlay(index)}
                  >
                    <div className="relative aspect-[2/3] bg-[#0a0a0a] group cursor-pointer overflow-hidden rounded-lg">
                      <Image
                        src={posterUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="192px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-center">
                          <p className="text-white text-base font-bold text-center line-clamp-3">{title}</p>
                        </div>
                      </div>
                      {/* Platform Logo Badge */}
                      <div className="absolute top-2 right-2">
                        <PlatformLogo platform={selectedPlatform} isSelected={true} size="badge" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Horizontal Timeline for Upcoming
            <div className="relative py-8">
              {/* Horizontal Timeline Line */}
              <div className="absolute top-[180px] left-0 right-0 h-[2px] bg-gradient-to-r from-[rgba(212,175,55,0.2)] via-[#d4af37] to-[rgba(212,175,55,0.2)]" />

              {/* Scrollable Timeline Container */}
              <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                <div className="flex gap-8 px-8 min-w-max">
                  {currentContent.slice(0, 15).map((item, index) => {
                    const title = 'title' in item ? item.title : item.name;
                    const posterUrl = getPosterUrl(item.poster_path);
                    const releaseDate = 'release_date' in item ? item.release_date : item.first_air_date;
                    const dateObj = releaseDate ? new Date(releaseDate) : null;
                    const monthDay = dateObj ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBA';
                    const year = dateObj ? dateObj.getFullYear() : '';

                    return (
                      <div key={item.id} className="relative flex flex-col items-center w-[200px]">
                        {/* Content Card */}
                        <div
                          className="cursor-pointer group mb-4"
                          onClick={() => openOverlay(index)}
                        >
                          <div className="relative w-[200px] h-[300px] rounded-lg overflow-hidden shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                            <Image
                              src={posterUrl}
                              alt={title}
                              fill
                              className="object-cover"
                              sizes="200px"
                            />
                            {/* Gradient overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="absolute bottom-0 left-0 right-0 p-3">
                                <p className="text-white text-sm font-bold line-clamp-2">{title}</p>
                              </div>
                            </div>
                            {/* Platform Logo Badge */}
                            <div className="absolute top-2 right-2">
                              <PlatformLogo platform={selectedPlatform} isSelected={true} size="badge" />
                            </div>
                          </div>
                          {/* Title below poster */}
                          <div className="mt-3 text-center">
                            <h3 className="text-white text-sm font-semibold line-clamp-2">{title}</h3>
                          </div>
                        </div>

                        {/* Connector Line from card to timeline */}
                        <div className="w-[2px] h-[40px] bg-gradient-to-b from-transparent to-[#d4af37]" />

                        {/* Timeline Date Badge */}
                        <div className="relative z-10 flex-shrink-0">
                          <div className="w-[80px] h-[80px] rounded-full bg-gradient-to-br from-[#d4af37] to-[#a46e1d] p-[2px] shadow-lg shadow-[#d4af37]/50">
                            <div className="w-full h-full rounded-full bg-black flex flex-col items-center justify-center">
                              <span className="text-[#d4af37] text-xl font-bold">{monthDay.split(' ')[1]}</span>
                              <span className="text-[#d4af37] text-xs font-medium uppercase">{monthDay.split(' ')[0]}</span>
                              {year && <span className="text-gray-400 text-[10px] mt-0.5">{year}</span>}
                            </div>
                          </div>
                        </div>

                        {/* Connector Line from timeline continuing down */}
                        <div className="w-[2px] h-[20px] bg-gradient-to-b from-[#d4af37] to-transparent" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-[#333] py-16 px-16">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-[#d4af37] text-xl tracking-[0.3em] font-medium">MAKE TLDR BETTER</h3>
            <button className="px-6 py-2 bg-transparent border border-gray-700 text-gray-400 text-xs tracking-wider hover:border-gray-500 transition-all">
              ↑ FEEDBACK FORM
            </button>
          </div>
          <div className="flex justify-center gap-32 mb-12 text-xs text-gray-600 tracking-wider">
            <button className="hover:text-gray-400 transition-colors">PRIVACY POLICY</button>
            <button className="hover:text-gray-400 transition-colors">END-USER AGREEMENT LICENSE</button>
          </div>
          <div className="text-center space-y-3">
            <p className="text-xs text-gray-600 leading-relaxed">
              COPYRIGHT © CIRCUIT HOUSE TECHNOLOGIES PVT LTD 2025. ALL RIGHTS RESERVED.<br />
              THE IMAGES AND CONTENT ON THIS WEBSITE ARE OWNED BY THEIR RESPECTIVE CONTENT PARTNERS.
            </p>
            <p className="text-[10px] text-gray-700 leading-relaxed max-w-4xl mx-auto">
              THIS EXPERIMENTAL WEBSITE DISPLAYS THESE IMAGES SOLELY FOR PREVIEW PURPOSES, AND USERS ARE REDIRECTED TO THE OFFICIAL CONTENT PARTNERS&apos; PLATFORMS TO ACCESS OR PLAY THE FULL CONTENT.
              UNAUTHORIZED USE OR REPRODUCTION OF ANY IMAGES OR CONTENT FROM THIS WEBSITE IS STRICTLY PROHIBITED. FOR ANY LICENSING OR COPYRIGHT CLAIMS, CONTACT: LEGAL@CIRCUITHOUSE.TECH
            </p>
          </div>
        </div>
      </footer>

      {/* Details Overlay */}
      {showOverlay && (
        <DetailsOverlay
          items={currentContent}
          initialIndex={overlayIndex}
          mediaType={mediaType}
          onClose={closeOverlay}
        />
      )}
    </div>
  );
}
