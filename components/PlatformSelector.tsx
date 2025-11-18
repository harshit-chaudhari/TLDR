'use client';

import { Platform, allPlatforms } from '@/data/content';

interface PlatformSelectorProps {
  selected: Platform | null;
  onChange: (platform: Platform) => void;
}

const PlatformLogos: Record<Platform, () => JSX.Element> = {
  'Netflix': () => (
    <svg viewBox="0 0 111 30" className="h-6 sm:h-8">
      <path fill="currentColor" d="M105.06233,14.2806261 L110.999156,30 C109.249227,29.7497422 107.500234,29.4366857 105.718437,29.1554972 L102.374168,20.4686475 L98.9371075,28.4375293 C97.2499766,28.1563408 95.5928391,28.061674 93.9057081,27.8432843 L99.9372012,14.0931671 L94.4680851,-5.68434189e-14 L99.5313525,-5.68434189e-14 L102.593495,7.87421502 L105.874965,-5.68434189e-14 L110.999156,-5.68434189e-14 L105.06233,14.2806261 Z M90.4686475,-5.68434189e-14 L85.8749649,-5.68434189e-14 L85.8749649,27.2499766 C87.3746368,27.3437061 88.9371075,27.4055675 90.4686475,27.5930265 L90.4686475,-5.68434189e-14 Z M81.9055207,26.93692 C78.6186138,26.4179976 75.3009245,25.9928862 72.0441681,25.5657514 L72.0441681,-5.68434189e-14 L76.6375777,-5.68434189e-14 L76.6375777,22.2499766 L81.9055207,23.2986886 L81.9055207,26.93692 Z M64.2496954,10.6561065 L64.2496954,15.3435186 L57.8442216,15.3435186 L57.8442216,25.9582194 C59.4313866,26.0245203 61.0185516,26.0908212 62.6057166,26.1571221 L62.6057166,15.3435186 L68.3126943,15.3435186 L68.3126943,28.0693296 C65.8517742,28.1356305 63.3597536,28.2019314 60.9280341,28.2682323 L60.9280341,10.6561065 L64.2496954,10.6561065 Z M53.5136661,9.96895879 L53.5136661,28.785908 C51.6488882,28.785908 49.7841103,28.785908 47.9193324,28.785908 L47.9193324,9.96895879 L41.5741397,9.96895879 L41.5741397,6.09100112 L59.9430671,6.09100112 L59.9430671,9.96895879 L53.5136661,9.96895879 Z M37.1764719,27.6539144 C35.3435429,27.4345816 33.4797305,27.277223 31.6460276,27.0586361 L31.6460276,0 L36.2414555,0 L36.2414555,27.6539144 L37.1764719,27.6539144 Z M27.1452578,25.8469571 C25.3127288,25.6895017 23.4802998,25.5320463 21.6169878,25.4364673 L21.6169878,0 L26.2124157,0 L26.2124157,25.8469571 L27.1452578,25.8469571 Z M16.2431861,24.7638046 C14.4106572,24.7019416 12.5781282,24.6400787 10.7456003,24.5782157 L10.7456003,0 L15.3410281,0 L15.3410281,24.7638046 L16.2431861,24.7638046 Z M4.21026597,23.2336926 C2.90468949,23.2336926 1.59911301,23.2026928 0.293536541,23.1406931 L0.293536541,0 L4.88896439,0 L4.88896439,23.2336926 L4.21026597,23.2336926 Z"/>
    </svg>
  ),
  'Prime Video': () => (
    <svg viewBox="0 0 120 30" className="h-6 sm:h-8">
      <path fill="currentColor" d="M15.7182 21.8557C11.0034 25.3042 4.32831 27.1255 -0.726806 27.2498C-1.85797 27.2807 -2.36353 26.0173 -1.54323 25.3351C3.1716 21.4803 9.44142 19.2538 15.7182 19.9668C15.7182 20.5978 15.7182 21.2288 15.7182 21.8557ZM18.0293 19.0982C17.8188 18.7046 15.4252 19.0177 14.2837 19.1421C13.9472 19.1832 13.8935 18.8701 14.1988 18.6531C16.0739 17.3279 18.9922 17.7215 19.3804 18.2077C19.7686 18.694 19.2837 21.5939 17.5334 23.0644C17.2488 23.3055 16.9847 23.1811 17.1127 22.8577C17.5745 21.6663 18.2398 19.4918 18.0293 19.0982Z"/>
    </svg>
  ),
  'Disney+': () => (
    <svg viewBox="0 0 120 30" className="h-6 sm:h-8">
      <path fill="currentColor" d="M18.08,24.08c-1.48,0-2.68-1.2-2.68-2.68v-9.14c0-1.48,1.2-2.68,2.68-2.68h4.82c1.48,0,2.68,1.2,2.68,2.68v9.14c0,1.48-1.2,2.68-2.68,2.68H18.08z"/>
    </svg>
  ),
  'HBO Max': () => (
    <svg viewBox="0 0 120 30" className="h-6 sm:h-8">
      <path fill="currentColor" d="M7.042,16.896H4.414v-3.754H2.893v3.754H0.273V8.008h2.62v3.518h1.521V8.008h2.628V16.896z M13.008,16.896h-2.271l-1.244-3.048h-0.137v3.048H7.487V8.008h2.82c1.352,0,2.354,0.694,2.354,2.138c0,1.005-0.544,1.626-1.352,1.897l1.734,4.853H13.008z"/>
    </svg>
  ),
  'Apple TV+': () => (
    <svg viewBox="0 0 120 30" className="h-6 sm:h-8">
      <path fill="currentColor" d="M18.71,19.5c-.83,0-1.5-.67-1.5-1.5s.67-1.5,1.5-1.5,1.5.67,1.5,1.5-.67,1.5-1.5,1.5Zm0-2.82c-.73,0-1.32.59-1.32,1.32s.59,1.32,1.32,1.32,1.32-.59,1.32-1.32-.59-1.32-1.32-1.32Z"/>
    </svg>
  ),
  'Hulu': () => (
    <svg viewBox="0 0 120 30" className="h-6 sm:h-8">
      <path fill="currentColor" d="M14.706,11.695c0-1.37,0.874-2.244,2.244-2.244h4.046v7.612c0,1.37-0.874,2.244-2.244,2.244h-4.046V11.695z"/>
    </svg>
  ),
};

export default function PlatformSelector({ selected, onChange }: PlatformSelectorProps) {
  return (
    <section id="platform-selection" className="py-12 bg-tldr-dark border-b border-tldr-lightGray/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Choose Your Platform
          </h2>
          <p className="text-gray-500">Select a streaming service to explore</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {allPlatforms.map((platform) => {
            const Logo = PlatformLogos[platform];
            const isSelected = selected === platform;

            return (
              <button
                key={platform}
                onClick={() => onChange(platform)}
                className={`group relative px-6 sm:px-8 py-4 sm:py-5 rounded-2xl border-2 transition-all duration-300 ${
                  isSelected
                    ? 'bg-tldr-gold/10 border-tldr-gold shadow-lg shadow-tldr-gold/20 scale-105'
                    : 'bg-tldr-darkGray/30 border-tldr-lightGray/20 hover:border-tldr-gold/50 hover:bg-tldr-darkGray/50'
                }`}
              >
                <div className={`transition-all duration-300 ${
                  isSelected ? 'text-tldr-gold' : 'text-white/60 group-hover:text-white/90'
                }`}>
                  <Logo />
                </div>

                {/* Active indicator */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-tldr-gold rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
