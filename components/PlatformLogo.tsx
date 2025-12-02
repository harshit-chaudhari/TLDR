import Image from 'next/image';

type PlatformLogoProps = {
  platform: string;
  isSelected: boolean;
  size?: 'normal' | 'badge';  // badge size for content cards
};

const platformLogos: Record<string, string> = {
  'JioHotstar': 'http://localhost:3845/assets/458657b1f44c3a0dff9d7a54132314a9b6f06ea9.png',
  'NETFLIX': 'http://localhost:3845/assets/15c90598dae774a47b9db0f0ebc8017779432cdb.png',
  'prime video': 'http://localhost:3845/assets/afc01bc0a6094827791e3e0aa0688fe6b8b981ed.png',
  'Disney+': 'http://localhost:3845/assets/106f47f7c46ba7773f8ab4becabc97647a5e1630.png',
  'hoichoi': 'http://localhost:3845/assets/e899a01cb3f6588b6c6e8c932fadfc657c57fad9.svg',
  'Apple TV': 'http://localhost:3845/assets/e3fe09a513e9ca2952a42acc898639e00e9c6cf2.png',
  'Zee5': 'http://localhost:3845/assets/15bb935e6fada6bdbf7975d12e9c22a94e07003a.png',
  'SonyLIV': 'http://localhost:3845/assets/2c9b9adb78f2f18f065f47258cde81057469029f.png',
  'Lionsgate Play': '',  // Fallback to text
  'MX Player': '',  // Fallback to text
  'Sun NXT': '',  // Fallback to text
};

export function PlatformLogo({ platform, isSelected, size = 'normal' }: PlatformLogoProps) {
  const logoUrl = platformLogos[platform];

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
      <div className="bg-black/80 backdrop-blur-sm rounded px-2 py-1">
        <div className="relative h-3 w-10 flex items-center justify-center">
          <Image
            src={logoUrl}
            alt={platform}
            fill
            className="object-contain opacity-90"
          />
        </div>
      </div>
    );
  }

  // Normal size for platform selector - uniform height for visual consistency
  return (
    <div className="relative h-6 w-20 flex items-center justify-center">
      <Image
        src={logoUrl}
        alt={platform}
        fill
        className={`object-contain ${isSelected ? 'opacity-100' : 'opacity-40'}`}
        style={{
          filter: isSelected ? 'none' : 'grayscale(20%)',
          objectFit: 'contain',
        }}
      />
    </div>
  );
}
