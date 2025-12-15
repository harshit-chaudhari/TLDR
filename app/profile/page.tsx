'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { getPosterUrl, TMDBMovie, TMDBShow } from '@/lib/tmdb';
import dynamic from 'next/dynamic';

const DetailsOverlay = dynamic(() => import('@/components/DetailsOverlay'), { ssr: false });

type NavSection = 'account' | 'favorites' | 'feedback' | 'settings';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const { favorites, removeFavorite } = useFavorites();

  const [activeSection, setActiveSection] = useState<NavSection>('account');
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFavoriteIndex, setSelectedFavoriteIndex] = useState<number | null>(null);
  const [showDetailsOverlay, setShowDetailsOverlay] = useState(false);

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleSaveUsername = async () => {
    if (!username.trim() || username === user?.username) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      const storedUser = localStorage.getItem('tldr_demo_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        userData.username = username.trim();
        localStorage.setItem('tldr_demo_user', JSON.stringify(userData));
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to update username:', error);
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleFavoriteClick = (index: number) => {
    setSelectedFavoriteIndex(index);
    setShowDetailsOverlay(true);
  };

  const handleRemoveFavorite = async (e: React.MouseEvent, tmdbId: number, mediaType: 'movie' | 'tv') => {
    e.stopPropagation();
    await removeFavorite(tmdbId, mediaType);
  };

  const handleCloseOverlay = () => {
    setShowDetailsOverlay(false);
    setSelectedFavoriteIndex(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#e69d2e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navItems: { key: NavSection; label: string; icon: React.ReactNode }[] = [
    {
      key: 'account',
      label: 'Account',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
    },
    {
      key: 'favorites',
      label: 'Favorites',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
    },
    {
      key: 'feedback',
      label: 'Feedback',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
      ),
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-[#0a0a0a]">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-lg border-b border-[#1a1a1a]">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-3 text-white/60 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                <span className="font-medium">Back</span>
              </Link>

              <h1
                className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#e69d2e] to-[#a46e1d] uppercase"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                TLDR
              </h1>

              <div className="w-20" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Navigation - 30% */}
            <aside className="lg:w-[30%] lg:max-w-[280px]">
              {/* Profile Card */}
              <div className="bg-[#111111] rounded-2xl p-6 mb-6">
                <div className="flex flex-col items-center">
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#e69d2e] to-[#a46e1d] p-[2px]">
                    <div className="w-full h-full rounded-full bg-[#111111] overflow-hidden flex items-center justify-center">
                      {user.profilePicture || user.image ? (
                        <Image
                          src={user.profilePicture || user.image || ''}
                          alt={user.name || 'User'}
                          width={80}
                          height={80}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-[#e69d2e] font-bold text-3xl">
                          {(user.name || user.email || 'U')[0].toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-white">
                    {user.username || user.name || 'User'}
                  </h2>
                  <p className="text-sm text-white/50">{user.email}</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="bg-[#111111] rounded-2xl overflow-hidden">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActiveSection(item.key)}
                    className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-colors ${
                      activeSection === item.key
                        ? 'bg-[#e69d2e]/10 text-[#e69d2e] border-l-2 border-[#e69d2e]'
                        : 'text-white/70 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                    {item.key === 'favorites' && favorites.length > 0 && (
                      <span className="ml-auto text-xs bg-white/10 px-2 py-0.5 rounded-full">
                        {favorites.length}
                      </span>
                    )}
                  </button>
                ))}

                {/* Sign Out Button */}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left text-white/50 hover:bg-white/5 hover:text-red-400 transition-colors border-t border-[#1a1a1a]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                  </svg>
                  <span className="font-medium">Sign Out</span>
                </button>
              </nav>
            </aside>

            {/* Right Content - 70% */}
            <main className="flex-1 lg:w-[70%]">
              <div className="bg-[#111111] rounded-2xl p-6 lg:p-8 min-h-[600px]">
                {/* Account Section */}
                {activeSection === 'account' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">Account</h2>
                      <p className="text-white/50">Manage your account information</p>
                    </div>

                    <div className="space-y-6">
                      {/* Username */}
                      <div className="p-5 bg-[#0a0a0a] rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-medium text-white/60">Username</label>
                          {!isEditing && (
                            <button
                              onClick={() => setIsEditing(true)}
                              className="text-sm text-[#e69d2e] hover:text-[#d4af37] font-medium transition-colors"
                            >
                              Edit
                            </button>
                          )}
                        </div>

                        {isEditing ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              placeholder="Enter username"
                              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#e69d2e] transition-colors"
                              maxLength={20}
                              minLength={3}
                              autoFocus
                            />
                            <div className="flex gap-3">
                              <button
                                onClick={handleSaveUsername}
                                disabled={isSaving}
                                className="px-5 py-2 bg-[#e69d2e] hover:bg-[#d4af37] text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
                              >
                                {isSaving ? 'Saving...' : 'Save'}
                              </button>
                              <button
                                onClick={() => {
                                  setIsEditing(false);
                                  setUsername(user.username || '');
                                }}
                                className="px-5 py-2 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-white text-lg">
                            {user.username || <span className="text-white/30">Not set</span>}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="p-5 bg-[#0a0a0a] rounded-xl">
                        <label className="text-sm font-medium text-white/60 block mb-3">Email</label>
                        <p className="text-white text-lg">{user.email}</p>
                      </div>

                      {/* Member Since */}
                      <div className="p-5 bg-[#0a0a0a] rounded-xl">
                        <label className="text-sm font-medium text-white/60 block mb-3">Member Since</label>
                        <p className="text-white text-lg">
                          {new Date().toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Favorites Section */}
                {activeSection === 'favorites' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">Favorites</h2>
                      <p className="text-white/50">
                        {favorites.length === 0
                          ? 'Start adding your favorite movies and shows'
                          : `${favorites.length} item${favorites.length !== 1 ? 's' : ''} saved`
                        }
                      </p>
                    </div>

                    {favorites.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-6">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10 text-white/20">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">No favorites yet</h3>
                        <p className="text-white/40 max-w-sm">
                          Browse our collection and tap the heart icon to save your favorite movies and shows.
                        </p>
                        <Link
                          href="/"
                          className="mt-6 px-6 py-3 bg-[#e69d2e] hover:bg-[#d4af37] text-black font-semibold rounded-lg transition-colors"
                        >
                          Browse Content
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {favorites.map((favorite, index) => (
                          <div
                            key={favorite.id}
                            className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#1a1a1a] group cursor-pointer"
                            onClick={() => handleFavoriteClick(index)}
                          >
                            {favorite.posterPath ? (
                              <Image
                                src={getPosterUrl(favorite.posterPath)}
                                alt={favorite.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center p-3">
                                <p className="text-white/60 text-sm text-center font-medium line-clamp-3">
                                  {favorite.title}
                                </p>
                              </div>
                            )}

                            {/* Overlay on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <div className="absolute bottom-0 left-0 right-0 p-3">
                                <p className="text-white text-sm font-medium line-clamp-2 mb-2">
                                  {favorite.title}
                                </p>
                                <button
                                  onClick={(e) => handleRemoveFavorite(e, favorite.tmdbId, favorite.mediaType)}
                                  className="w-full py-2 bg-white/10 hover:bg-red-500/80 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                                  </svg>
                                  Remove
                                </button>
                              </div>
                            </div>

                            {/* Media Type Badge */}
                            <div className="absolute top-2 left-2">
                              <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white/80 text-xs font-medium rounded">
                                {favorite.mediaType === 'movie' ? 'Movie' : 'TV'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Feedback Section */}
                {activeSection === 'feedback' && (
                  <div className="space-y-6 h-full">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">Feedback</h2>
                      <p className="text-white/50">Help us improve TLDR with your feedback</p>
                    </div>

                    <div className="relative rounded-xl overflow-hidden bg-[#0a0a0a]" style={{ height: 'calc(100% - 80px)', minHeight: '500px' }}>
                      <iframe
                        src="https://forms.lumio.co.in/s/cmiwt48qt000fn3019p5fqv96"
                        frameBorder="0"
                        className="absolute inset-0 w-full h-full"
                        style={{ border: 0 }}
                      />
                    </div>
                  </div>
                )}

                {/* Settings Section */}
                {activeSection === 'settings' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">Settings</h2>
                      <p className="text-white/50">Customize your experience</p>
                    </div>

                    <div className="space-y-4">
                      {/* Notifications */}
                      <div className="p-5 bg-[#0a0a0a] rounded-xl flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-medium">Push Notifications</h3>
                          <p className="text-sm text-white/50 mt-1">Get notified about new releases</p>
                        </div>
                        <button className="w-12 h-7 bg-white/10 rounded-full relative transition-colors">
                          <span className="absolute left-1 top-1 w-5 h-5 bg-white/50 rounded-full transition-transform" />
                        </button>
                      </div>

                      {/* Email Updates */}
                      <div className="p-5 bg-[#0a0a0a] rounded-xl flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-medium">Email Updates</h3>
                          <p className="text-sm text-white/50 mt-1">Receive weekly recommendations</p>
                        </div>
                        <button className="w-12 h-7 bg-white/10 rounded-full relative transition-colors">
                          <span className="absolute left-1 top-1 w-5 h-5 bg-white/50 rounded-full transition-transform" />
                        </button>
                      </div>

                      {/* Language */}
                      <div className="p-5 bg-[#0a0a0a] rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-white font-medium">Language</h3>
                            <p className="text-sm text-white/50 mt-1">Choose your preferred language</p>
                          </div>
                          <span className="text-white/60">English</span>
                        </div>
                      </div>

                      {/* Region */}
                      <div className="p-5 bg-[#0a0a0a] rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-white font-medium">Region</h3>
                            <p className="text-sm text-white/50 mt-1">Content availability by region</p>
                          </div>
                          <span className="text-white/60">United States</span>
                        </div>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="pt-6 border-t border-[#1a1a1a]">
                      <h3 className="text-red-400 font-medium mb-4">Danger Zone</h3>
                      <button className="px-5 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium rounded-lg transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Details Overlay */}
      {showDetailsOverlay && selectedFavoriteIndex !== null && (
        <DetailsOverlay
          items={favorites.map(fav => ({
            id: fav.tmdbId,
            title: fav.mediaType === 'movie' ? fav.title : undefined,
            name: fav.mediaType === 'tv' ? fav.title : undefined,
            poster_path: fav.posterPath,
            backdrop_path: null,
            overview: '',
            vote_average: 0,
            media_type: fav.mediaType,
            release_date: '',
            first_air_date: '',
            genre_ids: [],
          })) as (TMDBMovie | TMDBShow)[]}
          initialIndex={selectedFavoriteIndex}
          mediaType={favorites[selectedFavoriteIndex].mediaType}
          onClose={handleCloseOverlay}
        />
      )}
    </>
  );
}
