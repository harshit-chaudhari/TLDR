'use client';

import Image from 'next/image';
import { useState } from 'react';

type PlatformLogoProps = {
  platform: string;
  isSelected: boolean;
  size?: 'normal' | 'badge';
  logoPath?: string | null; // TMDB logo_path from watch providers
};

// Map stale/outdated TMDB logo paths to current valid ones
// TMDB periodically changes logo URLs, so API responses may contain stale paths
// We also map some paths to null to force fallback to text display
const staleToValidPath: Record<string, string | null> = {
  // Hotstar/JioHotstar old paths -> current JioHotstar
  '/4QT7gMNTqZADHOdvvhRrE7zWMNW.jpg': '/kVqjgpcwvDJOhCupjcLzwwtOp52.jpg',
  '/emthp39XA2YScoYL1p0sdbAH03W.jpg': '/kVqjgpcwvDJOhCupjcLzwwtOp52.jpg',
  // Zee5 old paths
  '/pxcLkrXYbgxOWlFkKXUAktZl1Lv.jpg': '/gP67NRy1ShUJilrzMsbOmEmdmcv.jpg',
  // SonyLIV old paths
  '/tXp00b46AL7RLhpjYbAedEvhwOn.jpg': '/3973zlBbBXdXxaWqRWzGG2GYxbT.jpg',
  // MX Player old paths -> current verified path
  '/1XAJbNBk8IXjbVwTLbeREgPbDGn.jpg': '/tFkqZYsDhNe6hJCx50Aw6oma24w.jpg',
  '/ayHY6wKxvCKj2PU8eRPFxnPc6B0.jpg': '/tFkqZYsDhNe6hJCx50Aw6oma24w.jpg',
  // Sun NXT old path
  '/uW4dPCcbXaaFTyfL5d6WT1xnRNa.jpg': '/6KEQzITx2RrCAQt5Nw9WrL1OI8z.jpg',
  // Hoichoi old path
  '/d4vHcXY9rwnr763wQns2XJThclt.jpg': '/u7dwMceEbjxd1N3TLEUBILSK2x6.jpg',
  // Lionsgate Play old path
  '/6IPjvnYl6WWkIwN158qBFXCr2Ne.jpg': '/e2hCUg2Z3sJ6yWF9NLU24SIKeWa.jpg',
  // Netflix old path
  '/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg': '/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg',
  // Amazon Prime old path
  '/emthp39XA2YScoYL1p0sdbAH2WA.jpg': '/pvske1MyAoymrs5bguRfVqYiM9a.jpg',
  // JioCinema - not in TMDB anymore, force null to show text fallback
  '/58aUMVWJRolhVpMIJil8tFvBNbP.jpg': null,
  '/bxdNcDbk1ohVeNPq5DQA9fGKo6n.jpg': null,
  // Crunchyroll old paths -> current verified path
  '/8Gt1iClBlzTeQs8WQm8rRwbNBMi.jpg': '/fzN5Jok5Ig1eJ7gyNGoMhnLSCfh.jpg',
  // Disney+ old path
  '/7rwgEs15tFwyR9NPQ5vpzxTj19Q.jpg': '/97yvRBw1GzX7fXprcF80er19ot.jpg',
  // Aha old path
  '/1xH8KPdjTKxxVDuWGFLp3GJKT26.jpg': '/8WerMI8XcZXqPpkHTZNtzMzousF.jpg',
  // Mubi old path
  '/bVR4Z1LCHY7gidXAJF5pMa4QrDS.jpg': '/x570VpH2C9EKDf1riP83rYc5dnL.jpg',
};

// Helper function to fix stale logo paths - exported for use in other components
export function fixStaleLogoPath(logoPath: string | null | undefined): string | null {
  if (!logoPath) return null;
  // Check if this path is in our mapping
  if (logoPath in staleToValidPath) {
    // Return the mapped value (could be null to force fallback, or a valid path)
    return staleToValidPath[logoPath];
  }
  return logoPath;
}

// Normalize platform name to find in our mapping
function normalizePlatformName(name: string): string {
  const lower = name.toLowerCase();

  // Map variations to canonical names
  // Note: Order matters - more specific matches should come first

  // Crunchyroll variants (including "Crunchyroll Amazon Channel")
  if (lower.includes('crunchyroll')) return 'Crunchyroll';

  // JioCinema (no longer has valid TMDB logo)
  if (lower.includes('jiocinema') || lower.includes('jio cinema')) return 'JioCinema';

  // Amazon variants
  if (lower.includes('prime') && lower.includes('video')) return 'Amazon Prime Video';
  if (lower.includes('amazon video')) return 'Amazon Prime Video';
  // Skip "Amazon Channel" variants as they should use the base platform
  if (lower.includes('amazon') && lower.includes('channel')) {
    // Already handled specific channels above (like Crunchyroll Amazon Channel)
    return name; // Return original, will trigger fallback
  }
  if (lower.includes('amazon prime')) return 'Amazon Prime Video';

  // Netflix
  if (lower.includes('netflix')) return 'Netflix';

  // Disney/Hotstar variants
  if (lower.includes('disney') && lower.includes('hotstar')) return 'JioHotstar';
  if (lower.includes('jiohotstar') || lower.includes('hotstar')) return 'JioHotstar';
  if (lower.includes('disney+') || lower.includes('disney plus')) return 'Disney+';

  // Apple
  if (lower.includes('apple') && lower.includes('tv')) return 'Apple TV';
  if (lower.includes('itunes')) return 'iTunes';

  // Indian platforms
  if (lower.includes('zee5')) return 'Zee5';
  if (lower.includes('sonyliv') || lower.includes('sony liv')) return 'SonyLIV';
  if (lower.includes('hoichoi')) return 'Hoichoi';
  if (lower.includes('lionsgate')) return 'Lionsgate Play';
  if (lower.includes('mx player')) return 'MX Player';
  if (lower.includes('sun n')) return 'Sun NXT';
  if (lower.includes('voot')) return 'Voot';
  if (lower.includes('aha')) return 'Aha';

  // International
  if (lower.includes('mubi')) return 'Mubi';
  if (lower.includes('hbo')) return 'HBO Max';
  if (lower === 'max') return 'Max';
  if (lower.includes('hulu')) return 'Hulu';
  if (lower.includes('paramount')) return 'Paramount+';
  if (lower.includes('peacock')) return 'Peacock';
  if (lower.includes('youtube')) return 'YouTube';
  if (lower.includes('google play')) return 'Google Play Movies';

  return name;
}

// TMDB logo paths for common platforms (fallback when logoPath not provided)
// Updated Dec 2025 with current valid TMDB paths verified from API
const tmdbLogoPaths: Record<string, string> = {
  // Netflix (verified)
  'Netflix': '/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg',
  // Amazon Prime (verified)
  'Amazon Prime Video': '/pvske1MyAoymrs5bguRfVqYiM9a.jpg',
  // Disney+ (verified)
  'Disney+': '/97yvRBw1GzX7fXprcF80er19ot.jpg',
  // JioHotstar (verified - provider 2336)
  'JioHotstar': '/kVqjgpcwvDJOhCupjcLzwwtOp52.jpg',
  // Apple TV (verified)
  'Apple TV': '/mcbz1LgtErU9p4UdbZ0rG6RTWHX.jpg',
  // Zee5 (verified - provider 232)
  'Zee5': '/gP67NRy1ShUJilrzMsbOmEmdmcv.jpg',
  // SonyLIV (verified - provider 237)
  'SonyLIV': '/3973zlBbBXdXxaWqRWzGG2GYxbT.jpg',
  // Hoichoi (verified - provider 315)
  'Hoichoi': '/u7dwMceEbjxd1N3TLEUBILSK2x6.jpg',
  // Other Indian platforms
  'Lionsgate Play': '/e2hCUg2Z3sJ6yWF9NLU24SIKeWa.jpg',
  'MX Player': '/tFkqZYsDhNe6hJCx50Aw6oma24w.jpg', // verified from provider 515
  'Sun NXT': '/6KEQzITx2RrCAQt5Nw9WrL1OI8z.jpg',
  // JioCinema - no longer in TMDB, will show fallback
  'Voot': '/go2TLtFCPRrHkvBpMKj0PA6hv4k.jpg',
  'Aha': '/8WerMI8XcZXqPpkHTZNtzMzousF.jpg', // verified - provider 532
  // International
  'Crunchyroll': '/fzN5Jok5Ig1eJ7gyNGoMhnLSCfh.jpg', // verified - provider 283
  'Mubi': '/x570VpH2C9EKDf1riP83rYc5dnL.jpg', // verified - provider 11
  'HBO Max': '/Ajqyt5aNxNGjmF9uOfxArGrdf3X.jpg',
  'Max': '/6Q3ZYUNA9Hsgj6iWnVsw2gR5V6z.jpg',
  'Hulu': '/zxrVdFjIjLqkfnwyghnfywTn3Lh.jpg',
  'Paramount+': '/xbhHHa1YgtpwhC8lb1NQ3ACVcLd.jpg',
  'Peacock': '/8VCV78prwd9QzZnEm0ReO6bERDa.jpg',
  'YouTube': '/oIkQkEkwfmcG7IGpje5LCnBvF2a.jpg',
  'Google Play Movies': '/tbEdFQDwx5LEVr8WpSeXQSIirVq.jpg',
  'iTunes': '/peURlLlr8jggOwK53fJ5wdQl05y.jpg',
};

function getTmdbLogoUrl(logoPath: string | null | undefined): string | null {
  if (!logoPath) return null;
  return `https://image.tmdb.org/t/p/w92${logoPath}`;
}

export function PlatformLogo({ platform, isSelected, size = 'normal', logoPath }: PlatformLogoProps) {
  const [hasError, setHasError] = useState(false);

  // Normalize platform name to handle variations
  const normalizedPlatform = normalizePlatformName(platform);

  // Priority: 1. Fix stale logoPath if provided, 2. Use logoPath, 3. Fallback from our mapping
  const correctedLogoPath = logoPath ? fixStaleLogoPath(logoPath) : null;
  const finalLogoPath = correctedLogoPath || tmdbLogoPaths[normalizedPlatform];
  const logoUrl = getTmdbLogoUrl(finalLogoPath);

  // If no logo URL or error loading, show text fallback
  if (!logoUrl || hasError) {
    if (size === 'badge') {
      // For badge, show a small colored box with first letter
      return (
        <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center">
          <span className="text-white text-xs font-bold">
            {platform.charAt(0).toUpperCase()}
          </span>
        </div>
      );
    }
    return (
      <span className={`text-xs font-medium tracking-wide ${
        isSelected ? 'text-white' : 'text-[rgba(255,255,255,0.4)]'
      }`}>
        {platform}
      </span>
    );
  }

  // Badge size for content cards
  if (size === 'badge') {
    return (
      <Image
        src={logoUrl}
        alt={platform}
        width={20}
        height={20}
        className="rounded"
        onError={() => setHasError(true)}
        unoptimized // Skip Next.js image optimization to avoid 404 caching issues
      />
    );
  }

  // Normal size for platform selector - uniform height for visual consistency
  return (
    <div className="relative h-6 w-20 flex items-center justify-center">
      <Image
        src={logoUrl}
        alt={platform}
        fill
        className={`object-contain rounded ${isSelected ? 'opacity-100' : 'opacity-40'}`}
        style={{
          filter: isSelected ? 'none' : 'grayscale(20%)',
          objectFit: 'contain',
        }}
        onError={() => setHasError(true)}
        unoptimized // Skip Next.js image optimization to avoid 404 caching issues
      />
    </div>
  );
}
