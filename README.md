# TLDR - What to watch? Made simple.

A modern web application that helps users discover the most relevant movies and shows across major streaming platforms. No endless scrolling. Just the best.

![TLDR App](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=for-the-badge&logo=tailwind-css)

## 🎯 Overview

TLDR (Too Long; Didn't Read) is designed to eliminate endless scrolling by providing a curated, elegant experience for discovering top-rated content across all major streaming platforms.

## ✨ Features

### 🎬 Three Main Sections
- **Top 10**: This week's most-watched content across all platforms with weekly rankings
- **Just In**: Recently released movies and shows ready to stream
- **Upcoming**: Coming soon to your favorite platforms with release dates

### 🎨 Key Features
- **Multi-Platform Support**: Netflix, Prime Video, Disney+, HBO Max, Apple TV+, Hulu
- **Smart Filtering**:
  - Filter by content type (movies/shows)
  - Multi-platform filtering
  - Weekly tracking for Top 10 content
- **Interactive Content Cards**:
  - Hover reveals TLDR rating and action buttons
  - Direct "Watch Now" link to streaming platform
  - "Watch Trailer" opens embedded YouTube player
- **Custom Trailer Modal**:
  - Embedded YouTube trailers
  - Clean, distraction-free viewing experience
  - Easy close functionality
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Feedback System**:
  - Fixed bottom banner for easy access
  - Expandable form with file upload support
  - Community feedback collection

### Design Philosophy

- **Premium Aesthetics**: Dark theme with gold accents, clean typography
- **Curated Content**: High-quality, editorially selected movies and shows
- **User-Focused**: Intuitive navigation and filtering
- **Performance**: Fast loading, smooth animations, optimized images

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Video Player**: YouTube IFrame API
- **Images**: TMDB API (The Movie Database)

## 📁 Project Structure

```
TLDR/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles and animations
├── components/
│   ├── Hero.tsx            # Landing hero section with animated background
│   ├── ContentBrowser.tsx  # Main content browsing interface
│   ├── ContentTypeToggle.tsx   # Movie/Show toggle component
│   ├── PlatformFilter.tsx      # Platform filter chips
│   ├── WeekPicker.tsx          # Week selection for Top 10
│   ├── TitleCard.tsx           # Individual content card
│   ├── TLDRRating.tsx          # Custom rating display
│   ├── PlatformBadge.tsx       # Platform logo badges
│   ├── TrailerModal.tsx        # Video trailer modal
│   ├── FeedbackBanner.tsx      # Feedback form banner
│   └── Footer.tsx              # Footer with links and legal info
├── data/
│   └── content.ts          # Content data (movies, shows, platforms)
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🎨 TLDR Rating System

The proprietary **TLDR rating** is expressed as a single number (e.g., "TLDR 9.7") designed to become a recognizable trust marker for content quality.

## 🎬 Supported Platforms

- Netflix
- Prime Video
- Disney+
- HBO Max
- Apple TV+
- Hulu

## 📊 MVP Objectives

1. Validate audience interest in TLDR's discovery model
2. Measure engagement metrics:
   - Hover interactions
   - Play button clicks
   - Trailer modal opens
   - Feedback submissions
3. Gather community feedback for next-phase features

## 🔮 Future Roadmap

- [ ] Mood-based content filters
- [ ] Genre-specific browsing
- [ ] User accounts & personalization
- [ ] Watchlist functionality
- [ ] Social sharing features
- [ ] Advanced recommendation engine
- [ ] Mobile app (iOS & Android)
- [ ] Integration with more streaming platforms

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy this Next.js app:

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "Add New Project"
4. Import your repository
5. Vercel auto-configures Next.js settings
6. Click "Deploy"

Your app will be live at `https://your-project.vercel.app`

### Netlify

1. Build: `npm run build`
2. Deploy to [netlify.com](https://netlify.com)
3. Drag and drop `.next` folder or connect Git repo

### Docker

```bash
docker build -t tldr-app .
docker run -p 3000:3000 tldr-app
```

## 🎨 Customization

### Update Content

Edit `/data/content.ts` to add/modify movies and shows:
- Update top10Movies, top10Shows arrays
- Add new releases to newReleaseMovies, newReleaseShows
- Manage upcoming content in upcomingMovies, upcomingShows

### Customize Theme

Edit `tailwind.config.ts` to change colors:
```typescript
colors: {
  tldr: {
    dark: "#0a0a0a",      // Background
    gold: "#d4af37",      // Accent color
    // Modify other colors as needed
  }
}
```

### Add Platforms

Update `/data/content.ts`:
```typescript
export const allPlatforms: Platform[] = [
  'Netflix',
  'Prime Video',
  // Add new platforms here
];
```

## 📊 Performance

- ⚡ Lighthouse Score: 90+
- 📱 Fully responsive (mobile, tablet, desktop)
- 🎨 Optimized images with Next.js Image component
- ⚙️ Code splitting and lazy loading
- 🚀 Fast page loads with App Router

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 License & Legal

Copyright © circuit house technologies pvt ltd 2025. All rights reserved.

The images and content on this website are owned by their respective content partners. This experimental website displays these images solely for preview purposes, and users are redirected to the official content partners' platforms to access or play the full content.

Unauthorized use or reproduction of any images or content from this website is strictly prohibited.

For any licensing or copyright claims, contact: legal@circuithouse.tech

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For support, email support@circuithouse.tech or use the feedback banner in the app.

## 🙏 Acknowledgments

- Movie/Show data and images from [TMDB](https://www.themoviedb.org/)
- Design inspiration from modern streaming platforms
- Built with ❤️ using Next.js and Tailwind CSS

---

**Made with ❤️ by Circuit House Technologies**

**TLDR** - What to watch? Made simple.
