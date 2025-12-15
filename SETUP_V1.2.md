# TLDR v1.2 Setup Guide

## Phase 1 Complete: Foundation ✅

The following infrastructure has been successfully implemented:

### 1. Dependencies Installed
- ✅ NextAuth.js v5 for authentication
- ✅ Prisma ORM with PostgreSQL support
- ✅ AWS SDK for S3 file uploads
- ✅ React Hot Toast for notifications

### 2. Database Schema Created
- ✅ Prisma schema with all required models (User, Account, Session, Favorite)
- ✅ Prisma client generated and ready
- ✅ Database migrations ready to run

### 3. Authentication Setup
- ✅ NextAuth configuration with Google OAuth
- ✅ JWT session strategy
- ✅ Auth API routes created
- ✅ Type-safe session with custom user fields

### 4. State Management
- ✅ AuthContext for authentication state
- ✅ FavoritesContext for favorites management
- ✅ Custom hooks (useAuth, useFavorites)
- ✅ Optimistic UI updates for favorites
- ✅ LocalStorage caching for offline support

### 5. File Upload Infrastructure
- ✅ S3 utilities for presigned URL generation
- ✅ CloudFront CDN support
- ✅ Profile picture upload ready

### 6. Root Layout Updated
- ✅ SessionProvider wrapper
- ✅ AuthProvider for auth state
- ✅ FavoritesProvider for favorites state
- ✅ Toast notifications configured

---

## Required Environment Variables

Before the app can run, you need to create a `.env` file with the following variables:

```bash
# Database (AWS RDS PostgreSQL)
DATABASE_URL="postgresql://username:password@your-rds-endpoint.us-east-1.rds.amazonaws.com:5432/tldr"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"  # Change to your domain in production
NEXTAUTH_SECRET="your-generated-secret-here"  # Generate with: openssl rand -base64 32

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AWS S3 (For profile pictures)
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_S3_BUCKET_NAME="tldr-profile-pictures"
AWS_CLOUDFRONT_DOMAIN="your-cloudfront-domain.cloudfront.net"  # Optional

# TMDB (Existing - already in your .env)
TMDB_API_KEY="your-existing-key"
TMDB_ACCESS_TOKEN="your-existing-token"
```

---

## Setup Steps

### 1. Set up AWS RDS PostgreSQL Database

```bash
# In AWS Console:
# 1. Create RDS PostgreSQL instance (db.t3.micro for free tier)
# 2. Note down the endpoint URL
# 3. Add DATABASE_URL to .env file
```

### 2. Run Database Migrations

```bash
# After DATABASE_URL is set:
npx prisma db push

# OR for production:
npx prisma migrate dev --name init
```

### 3. Set up Google OAuth

```bash
# In Google Cloud Console:
# 1. Create new project
# 2. Enable Google+ API
# 3. Create OAuth 2.0 credentials
# 4. Add authorized redirect URI: http://localhost:3000/api/auth/callback/google
# 5. Copy Client ID and Client Secret to .env
```

### 4. Set up AWS S3 Bucket

```bash
# In AWS Console:
# 1. Create S3 bucket: tldr-profile-pictures
# 2. Block all public access (use presigned URLs)
# 3. Add CORS configuration (see below)
# 4. Create IAM user with S3 permissions
# 5. Add credentials to .env
```

#### S3 CORS Configuration:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "POST"],
    "AllowedOrigins": ["http://localhost:3000", "https://your-domain.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

### 5. Generate NextAuth Secret

```bash
openssl rand -base64 32
# Copy the output to NEXTAUTH_SECRET in .env
```

---

## Next Steps

### Phase 2: UI Components (Ready to Start)
The following components need to be built:
- [ ] Header with sign-in button
- [ ] AuthModal for Google sign-in
- [ ] ProfileSidebar (right-side drawer)
- [ ] FavoriteButton with heart icon
- [ ] ProfilePictureUpload component

### Phase 3: API Routes (Ready to Start)
The following API routes need to be implemented:
- [ ] `/api/favorites` - GET all, POST new
- [ ] `/api/favorites/[id]` - DELETE by ID
- [ ] `/api/user` - GET profile
- [ ] `/api/user/update` - PATCH username/picture
- [ ] `/api/upload` - POST presigned S3 URL

### Phase 4: Integration
- [ ] Add FavoriteButton to all card components
- [ ] Integrate ProfileSidebar with Header
- [ ] Add Share functionality with Web Share API
- [ ] Visual indication for favorited items

### Phase 5: Polish
- [ ] Error handling
- [ ] Loading states
- [ ] Responsive design
- [ ] Accessibility
- [ ] Performance optimization

---

## Testing the Foundation

Once environment variables are set:

```bash
# Start the dev server
npm run dev

# The app should now:
# - Load without errors
# - Have SessionProvider active
# - Have AuthContext and FavoritesContext ready
# - Show toast notifications when triggered
```

---

## File Structure Created

```
/Users/harshit/TLDR/
├── prisma/
│   └── schema.prisma                 ✅ Complete database schema
├── lib/
│   ├── auth.ts                      ✅ NextAuth configuration
│   ├── prisma.ts                    ✅ Prisma client singleton
│   └── s3.ts                        ✅ S3 upload utilities
├── contexts/
│   ├── AuthContext.tsx              ✅ Auth state management
│   └── FavoritesContext.tsx         ✅ Favorites state management
├── hooks/
│   ├── useAuth.ts                   ✅ Auth hook export
│   └── useFavorites.ts              ✅ Favorites hook export
├── types/
│   ├── auth.ts                      ✅ Auth TypeScript types
│   └── favorite.ts                  ✅ Favorite TypeScript types
├── app/
│   ├── layout.tsx                   ✅ Updated with providers
│   └── api/
│       └── auth/[...nextauth]/
│           └── route.ts             ✅ NextAuth handler
└── package.json                     ✅ All dependencies added
```

---

## Common Issues & Solutions

### Issue: Prisma Client not found
```bash
Solution: npx prisma generate
```

### Issue: Database connection refused
```bash
Solution: Check DATABASE_URL format and RDS security group allows your IP
```

### Issue: Google OAuth error
```bash
Solution: Verify redirect URI in Google Console matches exactly:
http://localhost:3000/api/auth/callback/google
```

### Issue: S3 upload fails
```bash
Solution: Check CORS configuration and IAM permissions
```

---

## Ready to Continue!

Phase 1 (Foundation) is complete. You can now:
1. Set up the environment variables
2. Run database migrations
3. Continue with Phase 2 (UI Components)

The architecture is solid, type-safe, and ready for AWS deployment.
