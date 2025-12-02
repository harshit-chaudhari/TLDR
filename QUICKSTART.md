# TLDR Quick Start Guide

Get your TLDR application up and running in minutes!

## 🚀 Local Development

### 1. Start the Development Server

The server is already running! Open your browser and navigate to:

```
http://localhost:3000
```

If you need to restart the server:

```bash
npm run dev
```

### 2. Explore the Application

Your TLDR app includes:

- **Hero Section**: Scroll down or click "Explore Now"
- **Section Tabs**: Switch between "Top 10", "Just In", and "Upcoming"
- **Filters**:
  - Toggle between Movies and Shows
  - Filter by streaming platforms
  - Select different weeks (Top 10 only)
- **Content Cards**: Hover to see ratings and action buttons
  - Click "Watch Trailer" to see embedded trailers
  - Click "Watch Now" to go to the streaming platform
- **Feedback**: Click the gold banner at the bottom to submit feedback
- **Footer**: Scroll to bottom for links and legal information

## 📝 Making Changes

### Update Content Data

Edit [data/content.ts](data/content.ts):

```typescript
// Add a new Top 10 movie
export const top10Movies: Content[] = [
  {
    id: "tm-new",
    title: "Your Movie Title",
    type: "movie",
    poster: "https://image.tmdb.org/t/p/w500/poster-id.jpg",
    tldrRating: 9.5,
    platform: "Netflix",
    watchUrl: "https://www.netflix.com/title/12345",
    trailerUrl: "https://www.youtube.com/embed/video-id",
    year: 2024,
    genre: ["Drama", "Thriller"],
    weekStart: currentWeek
  },
  // ... existing movies
];
```

### Customize Colors

Edit [tailwind.config.ts](tailwind.config.ts):

```typescript
colors: {
  tldr: {
    dark: "#0a0a0a",      // Main background
    darkGray: "#1a1a1a",  // Secondary background
    gray: "#2a2a2a",      // Tertiary background
    lightGray: "#3a3a3a", // Borders
    gold: "#d4af37",      // Accent color (change this!)
  }
}
```

### Add New Platforms

1. Update the Platform type in [data/content.ts](data/content.ts):
```typescript
export type Platform = 'Netflix' | 'Prime Video' | 'Disney+' | 'HBO Max' | 'Apple TV+' | 'Hulu' | 'Your Platform';
```

2. Add to allPlatforms array:
```typescript
export const allPlatforms: Platform[] = [
  'Netflix',
  'Prime Video',
  // ... existing platforms
  'Your Platform'
];
```

3. Add content with the new platform:
```typescript
{
  id: "example",
  platform: "Your Platform",
  // ... other properties
}
```

## 🏗️ Building for Production

### Build the Application

```bash
npm run build
```

This creates an optimized production build in the `.next` folder.

### Test Production Build Locally

```bash
npm start
```

Visit `http://localhost:3000` to test the production build.

## 🌐 Deploy to Vercel (Easiest)

### Option 1: Via GitHub

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/tldr.git
   git push -u origin main
   ```

2. **Deploy**:
   - Go to [vercel.com](https://vercel.com/new)
   - Sign in with GitHub
   - Click "Import Project"
   - Select your repository
   - Click "Deploy"

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

## 📱 Features Overview

### Three Main Sections

1. **Top 10**
   - Weekly rankings of most-watched content
   - Filter by week using the week picker
   - Shows rank numbers (1-10)

2. **Just In**
   - Recently released movies and shows
   - No weekly filtering
   - Shows release dates

3. **Upcoming**
   - Content coming soon
   - Release date information
   - Trailers available before release

### Filtering Options

- **Content Type**: Toggle between Movies and Shows
- **Platforms**: Select one or multiple streaming platforms
- **Week**: Choose different weeks (Top 10 only)

### Interactive Elements

- **Content Cards**: Hover to reveal TLDR rating and buttons
- **Trailer Modal**: Click "Watch Trailer" for embedded YouTube videos
- **Watch Now**: Direct links to streaming platforms
- **Feedback Form**: Expandable form at the bottom of the page

## 🛠️ Common Tasks

### Clear Build Cache

```bash
rm -rf .next
npm run dev
```

### Update Dependencies

```bash
npm update
```

### Check for Issues

```bash
npm run lint
```

## 📊 File Structure Quick Reference

```
/app
  layout.tsx     - Root layout, metadata, fonts
  page.tsx       - Main page with all sections
  globals.css    - Global styles and animations

/components
  Hero.tsx              - Landing section
  ContentBrowser.tsx    - Main content section with tabs
  TitleCard.tsx         - Individual movie/show cards
  TrailerModal.tsx      - Video player modal
  Footer.tsx            - Footer with links
  FeedbackBanner.tsx    - Bottom feedback form

/data
  content.ts     - All movies, shows, and data
```

## 🎨 Customization Tips

### Change the Hero Background

Edit `components/Hero.tsx` around line 40-62 to modify the poster grid animation.

### Modify Section Titles

Edit `components/ContentBrowser.tsx` around line 69-79:

```typescript
const sectionTitles = {
  top10: 'Your Custom Title',
  new: 'New Releases',
  upcoming: 'Coming Soon',
};
```

### Update Platform Badges in Hero

Edit `components/Hero.tsx` around line 103 to change displayed platforms.

### Change Footer Content

Edit `components/Footer.tsx` to update:
- Social media links
- Quick links
- Legal information

## 🐛 Troubleshooting

### Server Won't Start
```bash
# Kill any process on port 3000
lsof -ti:3000 | xargs kill -9

# Restart
npm run dev
```

### Images Not Loading
- Check that poster URLs are valid
- Ensure you have internet connection for TMDB images
- Check browser console for errors

### Styles Not Applying
```bash
# Rebuild Tailwind
rm -rf .next
npm run dev
```

### TypeScript Errors
```bash
# Check for type errors
npx tsc --noEmit
```

## 📚 Next Steps

1. **Customize Content**: Add your own movies and shows
2. **Brand It**: Change colors, fonts, and styling
3. **Add Features**: Implement search, user accounts, etc.
4. **Deploy**: Get it online with Vercel or Netlify
5. **Share**: Get feedback from users

## 💡 Tips for Success

- Start small: Add 5-10 pieces of content first
- Test on mobile: Use browser dev tools
- Optimize images: Use appropriate poster sizes
- Monitor performance: Check Lighthouse scores
- Collect feedback: Use the built-in feedback form

## 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TMDB API](https://www.themoviedb.org/documentation/api) - For poster images
- [Vercel Deployment](https://vercel.com/docs)

---

Need help? Check the main [README.md](README.md) for detailed documentation!

**Happy coding!** 🚀
