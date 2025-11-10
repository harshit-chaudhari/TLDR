interface PlatformBadgeProps {
  platform: 'Netflix' | 'Prime Video' | 'Disney+' | 'HBO Max' | 'Apple TV+' | 'Hulu';
}

export default function PlatformBadge({ platform }: PlatformBadgeProps) {
  const platformColors = {
    'Netflix': 'bg-red-600',
    'Prime Video': 'bg-blue-500',
    'Disney+': 'bg-blue-600',
    'HBO Max': 'bg-purple-600',
    'Apple TV+': 'bg-gray-800',
    'Hulu': 'bg-green-500',
  };

  const bgColor = platformColors[platform] || 'bg-gray-600';

  return (
    <div className={`${bgColor} px-3 py-1 rounded-md text-white text-xs font-semibold`}>
      {platform}
    </div>
  );
}
