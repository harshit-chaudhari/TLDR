'use client';

export default function Hero() {
  const scrollToTop10 = () => {
    const top10Section = document.getElementById('top10-section');
    if (top10Section) {
      top10Section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        {/* Using a dark gradient as placeholder for video background */}
        <div className="absolute inset-0 gradient-warm animate-gradient" />

        {/* Optional: Add a subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-tldr-dark/50 to-tldr-dark z-10" />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Logo/Brand */}
          <div className="mb-8">
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight">
              <span className="text-tldr-gold font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
                TLDR
              </span>
            </h1>
          </div>

          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            What to watch?
            <br />
            <span className="text-tldr-gold">Made simple.</span>
          </h2>

          {/* Subheader */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Discover the most relevant movies and shows across major streaming platforms.
            <br />
            <span className="text-gray-400">No endless scrolling. Just the best.</span>
          </p>

          {/* CTA Button */}
          <button
            onClick={scrollToTop10}
            className="group relative inline-flex items-center gap-3 bg-tldr-gold text-tldr-dark font-bold text-lg px-8 py-4 rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
          >
            Explore Now
            <svg
              className="w-5 h-5 transform group-hover:translate-y-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-gray-400 flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-gray-400 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Bottom fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-tldr-dark to-transparent z-10" />
    </section>
  );
}
