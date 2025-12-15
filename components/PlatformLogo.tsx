import Image from 'next/image';

type PlatformLogoProps = {
  platform: string;
  isSelected: boolean;
  size?: 'normal' | 'badge';
  logoPath?: string | null; // TMDB logo_path from watch providers
};

// TMDB logo paths for common platforms (fallback when logoPath not provided)
const tmdbLogoPaths: Record<string, string> = {
  'Netflix': '/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg',
  'NETFLIX': '/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg',
  'Amazon Prime Video': '/emthp39XA2YScoYL1p0sdbAH2WA.jpg',
  'Prime Video': '/emthp39XA2YScoYL1p0sdbAH2WA.jpg',
  'prime video': '/emthp39XA2YScoYL1p0sdbAH2WA.jpg',
  'Disney Plus': '/7rwgEs15tFwyR9NPQ5vpzxTj19Q.jpg',
  'Disney+': '/7rwgEs15tFwyR9NPQ5vpzxTj19Q.jpg',
  'Hotstar': '/4QT7gMNTqZADHOdvvhRrE7zWMNW.jpg',
  'JioHotstar': '/4QT7gMNTqZADHOdvvhRrE7zWMNW.jpg',
  'Apple TV Plus': '/6uhKBfmtzFqOcLousHwZuzcrScK.jpg',
  'Apple TV+': '/6uhKBfmtzFqOcLousHwZuzcrScK.jpg',
  'Apple TV': '/peURlLlr8jggOwK53fJ5wdQl05y.jpg',
  'Zee5': '/pxcLkrXYbgxOWlFkKXUAktZl1Lv.jpg',
  'ZEE5': '/pxcLkrXYbgxOWlFkKXUAktZl1Lv.jpg',
  'SonyLIV': '/tXp00b46AL7RLhpjYbAedEvhwOn.jpg',
  'Sony Liv': '/tXp00b46AL7RLhpjYbAedEvhwOn.jpg',
  'Hoichoi': '/d4vHcXY9rwnr763wQns2XJThclt.jpg',
  'hoichoi': '/d4vHcXY9rwnr763wQns2XJThclt.jpg',
  'Lionsgate Play': '/6IPjvnYl6WWkIwN158qBFXCr2Ne.jpg',
  'MX Player': '/1XAJbNBk8IXjbVwTLbeREgPbDGn.jpg',
  'Sun NXT': '/uW4dPCcbXaaFTyfL5d6WT1xnRNa.jpg',
  'JioCinema': '/58aUMVWJRolhVpMIJil8tFvBNbP.jpg',
  'Jio Cinema': '/58aUMVWJRolhVpMIJil8tFvBNbP.jpg',
  'Voot': '/go2TLtFCPRrHkvBpMKj0PA6hv4k.jpg',
  'Aha': '/1xH8KPdjTKxxVDuWGFLp3GJKT26.jpg',
  'Crunchyroll': '/8Gt1iClBlzTeQs8WQm8rRwbNBMi.jpg',
  'Mubi': '/bVR4Z1LCHY7gidXAJF5pMa4QrDS.jpg',
  'HBO Max': '/Ajqyt5aNxNGjmF9uOfxArGrdf3X.jpg',
  'Max': '/6Q3ZYUNA9Hsgj6iWnVsw2gR5V6z.jpg',
  'Hulu': '/zxrVdFjIjLqkfnwyghnfywTn3Lh.jpg',
  'Paramount+': '/xbhHHa1YgtpwhC8lb1NQ3ACVcLd.jpg',
  'Paramount Plus': '/xbhHHa1YgtpwhC8lb1NQ3ACVcLd.jpg',
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
  // Priority: 1. Provided logoPath, 2. Fallback from our mapping
  const finalLogoPath = logoPath || tmdbLogoPaths[platform];
  const logoUrl = getTmdbLogoUrl(finalLogoPath);

  // Don't show badge if no logo
  if (!logoUrl) {
    if (size === 'badge') return null;
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
      />
    </div>
  );
}
