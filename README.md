# TLDR: Top 10 MVP

A premium content discovery platform that simplifies streaming decisions by showcasing the top 10 movies and shows across major OTT platforms.

## 🎯 Overview

TLDR (Too Long; Didn't Read) is designed to eliminate endless scrolling by providing a curated, elegant snapshot of what's trending and worth watching right now.

## ✨ Features

### Core Functionality

- **Hero Section**: Cinematic landing with smooth scroll-to-content CTA
- **Top 10 Movies & Shows**: Curated lists with premium card design
- **Interactive Title Cards**:
  - Hover reveals TLDR rating and action buttons
  - Direct "Play Now" link to OTT platform
  - "Watch Trailer" opens custom modal
- **Custom Trailer Player**:
  - YouTube IFrame API integration
  - Custom controls (Play/Pause, Mute, Fullscreen)
  - Clean, distraction-free viewing
- **Feedback System**:
  - Fixed bottom banner
  - Expandable form with file upload support
  - Community testing feedback collection

### Design Philosophy

- **Premium over Playful**: Muted palette, minimal motion, strong typography
- **Editorial over Algorithmic**: Curated, high-signal content
- **Clarity over Complexity**: Single-purpose sections

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
│   ├── layout.tsx       # Root layout with metadata
│   ├── page.tsx         # Main page component
│   └── globals.css      # Global styles
├── components/
│   ├── Hero.tsx         # Landing hero section
│   ├── Top10Section.tsx # Movies & shows container
│   ├── TitleCard.tsx    # Individual content card
│   ├── TLDRRating.tsx   # Custom rating display
│   ├── PlatformBadge.tsx # OTT platform badges
│   ├── TrailerModal.tsx # Custom trailer player
│   └── FeedbackBanner.tsx # Feedback collection
├── data/
│   └── content.ts       # Sample movies & shows data
└── public/              # Static assets
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

- Mood-based content filters
- "Upcoming Releases" section
- "New Releases" tracking
- User accounts & personalization
- Watchlist functionality
- Advanced recommendation engine

## 📝 License

Private - All rights reserved

## 🤝 Contributing

This is an MVP in community testing phase. Use the feedback banner in the app to submit suggestions and report issues.

---

**TLDR** - What to watch? Made simple.
