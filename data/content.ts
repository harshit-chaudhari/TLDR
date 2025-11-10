export type Platform = 'Netflix' | 'Prime Video' | 'Disney+' | 'HBO Max' | 'Apple TV+' | 'Hulu';
export type ContentType = 'movie' | 'show';

export interface Content {
  id: string;
  title: string;
  type: ContentType;
  poster: string;
  tldrRating: number;
  platform: Platform;
  watchUrl: string;
  trailerUrl: string;
  year?: number;
  genre?: string[];
  releaseDate?: string; // ISO format: YYYY-MM-DD
  weekStart?: string; // For Top 10: ISO format week start date
}

// Helper function to get week start date (Monday)
const getWeekStart = (date: Date): string => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  const monday = new Date(date.setDate(diff));
  return monday.toISOString().split('T')[0];
};

// Current week and past weeks for Top 10
const currentWeek = getWeekStart(new Date());
const lastWeek = getWeekStart(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
const twoWeeksAgo = getWeekStart(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000));

// ===== TOP 10 MOVIES =====
export const top10Movies: Content[] = [
  {
    id: "tm1",
    title: "Oppenheimer",
    type: "movie",
    poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    tldrRating: 9.4,
    platform: "Prime Video",
    watchUrl: "https://www.primevideo.com",
    trailerUrl: "https://www.youtube.com/embed/uYPbbksJxIg",
    year: 2023,
    genre: ["Biography", "Drama", "History"],
    weekStart: currentWeek
  },
  {
    id: "tm2",
    title: "The Holdovers",
    type: "movie",
    poster: "https://image.tmdb.org/t/p/w500/6zc1dwwQ6S5JLPAjKQb5iN7HT1M.jpg",
    tldrRating: 9.1,
    platform: "Prime Video",
    watchUrl: "https://www.primevideo.com",
    trailerUrl: "https://www.youtube.com/embed/5h9E3fLLfN8",
    year: 2023,
    genre: ["Comedy", "Drama"],
    weekStart: currentWeek
  },
  {
    id: "tm3",
    title: "Poor Things",
    type: "movie",
    poster: "https://image.tmdb.org/t/p/w500/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg",
    tldrRating: 8.9,
    platform: "Disney+",
    watchUrl: "https://www.disneyplus.com",
    trailerUrl: "https://www.youtube.com/embed/RlbR5N6veqw",
    year: 2023,
    genre: ["Comedy", "Drama", "Romance"],
    weekStart: currentWeek
  },
  {
    id: "tm4",
    title: "Killers of the Flower Moon",
    type: "movie",
    poster: "https://image.tmdb.org/t/p/w500/dB6Krk806zeqd0YNp2ngQ9zXteH.jpg",
    tldrRating: 9.2,
    platform: "Apple TV+",
    watchUrl: "https://tv.apple.com",
    trailerUrl: "https://www.youtube.com/embed/EP34Yoxs3FQ",
    year: 2023,
    genre: ["Crime", "Drama", "History"],
    weekStart: currentWeek
  },
  {
    id: "tm5",
    title: "Past Lives",
    type: "movie",
    poster: "https://image.tmdb.org/t/p/w500/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg",
    tldrRating: 9.0,
    platform: "Prime Video",
    watchUrl: "https://www.primevideo.com",
    trailerUrl: "https://www.youtube.com/embed/kA244xewjcI",
    year: 2023,
    genre: ["Drama", "Romance"],
    weekStart: currentWeek
  },
  {
    id: "tm6",
    title: "The Zone of Interest",
    type: "movie",
    poster: "https://image.tmdb.org/t/p/w500/pCrbux5FVLp2vn6cO7mJnqxR9G7.jpg",
    tldrRating: 8.7,
    platform: "HBO Max",
    watchUrl: "https://www.hbomax.com",
    trailerUrl: "https://www.youtube.com/embed/blN4eHWMB_k",
    year: 2023,
    genre: ["Drama", "History", "War"],
    weekStart: currentWeek
  },
  {
    id: "tm7",
    title: "May December",
    type: "movie",
    poster: "https://image.tmdb.org/t/p/w500/5EXCTmh3MGtb1gkdJVgCqBxIdxC.jpg",
    tldrRating: 8.5,
    platform: "Netflix",
    watchUrl: "https://www.netflix.com",
    trailerUrl: "https://www.youtube.com/embed/loANUDd9pq8",
    year: 2023,
    genre: ["Drama"],
    weekStart: currentWeek
  },
  {
    id: "tm8",
    title: "The Boy and the Heron",
    type: "movie",
    poster: "https://image.tmdb.org/t/p/w500/f4oZTcfGrVTXKTWg157AwikXqmP.jpg",
    tldrRating: 9.3,
    platform: "HBO Max",
    watchUrl: "https://www.hbomax.com",
    trailerUrl: "https://www.youtube.com/embed/t5khm-VjEu4",
    year: 2023,
    genre: ["Animation", "Adventure", "Fantasy"],
    weekStart: currentWeek
  },
  {
    id: "tm9",
    title: "Anatomy of a Fall",
    type: "movie",
    poster: "https://image.tmdb.org/t/p/w500/kQs6keheMwCxJxrzV83VUwFtHkB.jpg",
    tldrRating: 8.8,
    platform: "Hulu",
    watchUrl: "https://www.hulu.com",
    trailerUrl: "https://www.youtube.com/embed/6xtH4f_NZ3o",
    year: 2023,
    genre: ["Crime", "Drama", "Thriller"],
    weekStart: currentWeek
  },
  {
    id: "tm10",
    title: "American Fiction",
    type: "movie",
    poster: "https://image.tmdb.org/t/p/w500/57MFWGHarg9jid7yfDTka4RmcMU.jpg",
    tldrRating: 8.6,
    platform: "Prime Video",
    watchUrl: "https://www.primevideo.com",
    trailerUrl: "https://www.youtube.com/embed/C1PUk-_Hcu0",
    year: 2023,
    genre: ["Comedy", "Drama"],
    weekStart: currentWeek
  }
];

// ===== TOP 10 SHOWS =====
export const top10Shows: Content[] = [
  {
    id: "ts1",
    title: "The Bear",
    type: "show",
    poster: "https://image.tmdb.org/t/p/w500/zCb3K4K1rwL8F3N5AhLmJuOZi9g.jpg",
    tldrRating: 9.5,
    platform: "Disney+",
    watchUrl: "https://www.disneyplus.com",
    trailerUrl: "https://www.youtube.com/embed/y-cqqAJIXhs",
    year: 2023,
    genre: ["Drama", "Comedy"],
    weekStart: currentWeek
  },
  {
    id: "ts2",
    title: "Succession",
    type: "show",
    poster: "https://image.tmdb.org/t/p/w500/7HW47XbkNQ5fiwQFYGWdw9gs144.jpg",
    tldrRating: 9.7,
    platform: "HBO Max",
    watchUrl: "https://www.hbomax.com",
    trailerUrl: "https://www.youtube.com/embed/OdYVdLKVPJ0",
    year: 2023,
    genre: ["Drama"],
    weekStart: currentWeek
  },
  {
    id: "ts3",
    title: "Beef",
    type: "show",
    poster: "https://image.tmdb.org/t/p/w500/g9KvUfX6qN0vQq0WQ7tZjLovkhA.jpg",
    tldrRating: 9.2,
    platform: "Netflix",
    watchUrl: "https://www.netflix.com",
    trailerUrl: "https://www.youtube.com/embed/1R-uOq4hNX0",
    year: 2023,
    genre: ["Comedy", "Drama", "Thriller"],
    weekStart: currentWeek
  },
  {
    id: "ts4",
    title: "The Last of Us",
    type: "show",
    poster: "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
    tldrRating: 9.4,
    platform: "HBO Max",
    watchUrl: "https://www.hbomax.com",
    trailerUrl: "https://www.youtube.com/embed/uLtkt8BonwM",
    year: 2023,
    genre: ["Action", "Adventure", "Drama"],
    weekStart: currentWeek
  },
  {
    id: "ts5",
    title: "Shrinking",
    type: "show",
    poster: "https://image.tmdb.org/t/p/w500/eqbXPRH8LmEPh9lLAH1URBOJJW3.jpg",
    tldrRating: 8.8,
    platform: "Apple TV+",
    watchUrl: "https://tv.apple.com",
    trailerUrl: "https://www.youtube.com/embed/5INdGXlbPPM",
    year: 2023,
    genre: ["Comedy", "Drama"],
    weekStart: currentWeek
  },
  {
    id: "ts6",
    title: "Blue Eye Samurai",
    type: "show",
    poster: "https://image.tmdb.org/t/p/w500/fXm3JT4WLQVnwukdvghtAblc1wc.jpg",
    tldrRating: 9.1,
    platform: "Netflix",
    watchUrl: "https://www.netflix.com",
    trailerUrl: "https://www.youtube.com/embed/mKcl3J1Z5d4",
    year: 2023,
    genre: ["Animation", "Action", "Drama"],
    weekStart: currentWeek
  },
  {
    id: "ts7",
    title: "The Morning Show",
    type: "show",
    poster: "https://image.tmdb.org/t/p/w500/oYB3rKyNRGPVf7wnf1wA6K8qLSQ.jpg",
    tldrRating: 8.6,
    platform: "Apple TV+",
    watchUrl: "https://tv.apple.com",
    trailerUrl: "https://www.youtube.com/embed/eA7D4_qU9jo",
    year: 2023,
    genre: ["Drama"],
    weekStart: currentWeek
  },
  {
    id: "ts8",
    title: "The Crown",
    type: "show",
    poster: "https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8V4o68.jpg",
    tldrRating: 9.0,
    platform: "Netflix",
    watchUrl: "https://www.netflix.com",
    trailerUrl: "https://www.youtube.com/embed/JWtnJjn6ng0",
    year: 2023,
    genre: ["Drama", "History"],
    weekStart: currentWeek
  },
  {
    id: "ts9",
    title: "Gen V",
    type: "show",
    poster: "https://image.tmdb.org/t/p/w500/uuot1N5AgZ7xRCKgm4ZCwOhgIJu.jpg",
    tldrRating: 8.4,
    platform: "Prime Video",
    watchUrl: "https://www.primevideo.com",
    trailerUrl: "https://www.youtube.com/embed/kV0F4C08n8I",
    year: 2023,
    genre: ["Action", "Drama", "Sci-Fi"],
    weekStart: currentWeek
  },
  {
    id: "ts10",
    title: "For All Mankind",
    type: "show",
    poster: "https://image.tmdb.org/t/p/w500/sYUtjEQN3xqCCgYKfvRo8cHYHk8.jpg",
    tldrRating: 8.9,
    platform: "Apple TV+",
    watchUrl: "https://tv.apple.com",
    trailerUrl: "https://www.youtube.com/embed/HZS9M52Bd_w",
    year: 2023,
    genre: ["Drama", "Sci-Fi"],
    weekStart: currentWeek
  }
];

// ===== NEW RELEASES =====
export const newReleaseMovies: Content[] = [
  {
    id: "nrm1",
    title: "Dune: Part Two",
    type: "movie",
    poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    tldrRating: 9.3,
    platform: "HBO Max",
    watchUrl: "https://www.hbomax.com",
    trailerUrl: "https://www.youtube.com/embed/Way9Dexny3w",
    year: 2024,
    genre: ["Sci-Fi", "Adventure"],
    releaseDate: "2024-11-01"
  },
  {
    id: "nrm2",
    title: "The Bikeriders",
    type: "movie",
    poster: "https://image.tmdb.org/t/p/w500/qTb6sSRt8Pw96JTan8ezU2xO0FU.jpg",
    tldrRating: 8.4,
    platform: "Prime Video",
    watchUrl: "https://www.primevideo.com",
    trailerUrl: "https://www.youtube.com/embed/nU2pbI79SO4",
    year: 2024,
    genre: ["Drama", "Crime"],
    releaseDate: "2024-11-03"
  },
  {
    id: "nrm3",
    title: "Challengers",
    type: "movie",
    poster: "https://image.tmdb.org/t/p/w500/H6vke7zGiuLsz4v4RPeReb9rsv.jpg",
    tldrRating: 8.7,
    platform: "Prime Video",
    watchUrl: "https://www.primevideo.com",
    trailerUrl: "https://www.youtube.com/embed/IEEpIZxkcW0",
    year: 2024,
    genre: ["Romance", "Drama", "Sport"],
    releaseDate: "2024-11-05"
  },
  {
    id: "nrm4",
    title: "Civil War",
    type: "movie",
    poster: "https://image.tmdb.org/t/p/w500/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg",
    tldrRating: 8.9,
    platform: "HBO Max",
    watchUrl: "https://www.hbomax.com",
    trailerUrl: "https://www.youtube.com/embed/aDyQxtg0V2w",
    year: 2024,
    genre: ["Action", "Drama", "War"],
    releaseDate: "2024-11-02"
  },
  {
    id: "nrm5",
    title: "Furiosa: A Mad Max Saga",
    type: "movie",
    poster: "https://image.tmdb.org/t/p/w500/iADOJ8Zymht2JPMoy3R7xceZprc.jpg",
    tldrRating: 9.1,
    platform: "HBO Max",
    watchUrl: "https://www.hbomax.com",
    trailerUrl: "https://www.youtube.com/embed/XJMuhwVlca4",
    year: 2024,
    genre: ["Action", "Adventure", "Sci-Fi"],
    releaseDate: "2024-11-04"
  }
];

export const newReleaseShows: Content[] = [
  {
    id: "nrs1",
    title: "The Penguin",
    type: "show",
    poster: "https://image.tmdb.org/t/p/w500/9GZVgY6JQFD4QsoYfv5Nq8qVxrf.jpg",
    tldrRating: 9.2,
    platform: "HBO Max",
    watchUrl: "https://www.hbomax.com",
    trailerUrl: "https://www.youtube.com/embed/yyOHuxOKMfs",
    year: 2024,
    genre: ["Crime", "Drama"],
    releaseDate: "2024-11-01"
  },
  {
    id: "nrs2",
    title: "Fallout",
    type: "show",
    poster: "https://image.tmdb.org/t/p/w500/AnsSKR9LuK0T9bAOcPVA3PUvyWj.jpg",
    tldrRating: 9.4,
    platform: "Prime Video",
    watchUrl: "https://www.primevideo.com",
    trailerUrl: "https://www.youtube.com/embed/V-mugKDQDlg",
    year: 2024,
    genre: ["Sci-Fi", "Action", "Drama"],
    releaseDate: "2024-11-02"
  },
  {
    id: "nrs3",
    title: "Shōgun",
    type: "show",
    poster: "https://image.tmdb.org/t/p/w500/7O4iVfOMQmdCSxhOg1WnzG1AgYT.jpg",
    tldrRating: 9.6,
    platform: "Disney+",
    watchUrl: "https://www.disneyplus.com",
    trailerUrl: "https://www.youtube.com/embed/2GvCpEXCJRI",
    year: 2024,
    genre: ["Drama", "History", "War"],
    releaseDate: "2024-11-03"
  },
  {
    id: "nrs4",
    title: "3 Body Problem",
    type: "show",
    poster: "https://image.tmdb.org/t/p/w500/5cqRD6DfZWT5PFoQwmWbMJqCT3W.jpg",
    tldrRating: 8.8,
    platform: "Netflix",
    watchUrl: "https://www.netflix.com",
    trailerUrl: "https://www.youtube.com/embed/mqOE3BGFQwg",
    year: 2024,
    genre: ["Sci-Fi", "Mystery", "Drama"],
    releaseDate: "2024-11-04"
  },
  {
    id: "nrs5",
    title: "The Gentlemen",
    type: "show",
    poster: "https://image.tmdb.org/t/p/w500/lXXbkCqPEQ18kPE2j99poJJwG8N.jpg",
    tldrRating: 8.5,
    platform: "Netflix",
    watchUrl: "https://www.netflix.com",
    trailerUrl: "https://www.youtube.com/embed/LjWCB8YzHCk",
    year: 2024,
    genre: ["Crime", "Comedy", "Action"],
    releaseDate: "2024-11-05"
  }
];

// ===== UPCOMING RELEASES =====
export const upcomingMovies: Content[] = [
  {
    id: "um1",
    title: "Deadpool & Wolverine",
    type: "movie",
    poster: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    tldrRating: 9.0,
    platform: "Disney+",
    watchUrl: "https://www.disneyplus.com",
    trailerUrl: "https://www.youtube.com/embed/73_1biulkYk",
    year: 2024,
    genre: ["Action", "Comedy", "Superhero"],
    releaseDate: "2024-12-15"
  },
  {
    id: "um2",
    title: "Wicked",
    type: "movie",
    poster: "https://image.tmdb.org/t/p/w500/xDGbZ0JJ3mYaGKy4Nzd9Kph6M9L.jpg",
    tldrRating: 8.8,
    platform: "Prime Video",
    watchUrl: "https://www.primevideo.com",
    trailerUrl: "https://www.youtube.com/embed/6COmYeLsz4c",
    year: 2024,
    genre: ["Musical", "Fantasy"],
    releaseDate: "2024-12-20"
  },
  {
    id: "um3",
    title: "Nosferatu",
    type: "movie",
    poster: "https://image.tmdb.org/t/p/w500/7NggGW3mC5SYviRAJWaTBBQNGPw.jpg",
    tldrRating: 8.6,
    platform: "Prime Video",
    watchUrl: "https://www.primevideo.com",
    trailerUrl: "https://www.youtube.com/embed/iD_D4aRjiUE",
    year: 2024,
    genre: ["Horror", "Drama"],
    releaseDate: "2024-12-18"
  },
  {
    id: "um4",
    title: "A Complete Unknown",
    type: "movie",
    poster: "https://image.tmdb.org/t/p/w500/66w8VbZz5FgYPxChhDh6zDhzAzX.jpg",
    tldrRating: 8.9,
    platform: "Prime Video",
    watchUrl: "https://www.primevideo.com",
    trailerUrl: "https://www.youtube.com/embed/H1vXFK9-P9g",
    year: 2024,
    genre: ["Biography", "Drama", "Music"],
    releaseDate: "2024-12-22"
  },
  {
    id: "um5",
    title: "The Brutalist",
    type: "movie",
    poster: "https://image.tmdb.org/t/p/w500/mCYVZ1aTfNDMNpKLAoWLGTKXEH2.jpg",
    tldrRating: 9.2,
    platform: "HBO Max",
    watchUrl: "https://www.hbomax.com",
    trailerUrl: "https://www.youtube.com/embed/iGYRoPjZT8A",
    year: 2024,
    genre: ["Drama", "History"],
    releaseDate: "2024-12-25"
  }
];

export const upcomingShows: Content[] = [
  {
    id: "us1",
    title: "The Last of Us Season 2",
    type: "show",
    poster: "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
    tldrRating: 9.5,
    platform: "HBO Max",
    watchUrl: "https://www.hbomax.com",
    trailerUrl: "https://www.youtube.com/embed/uLtkt8BonwM",
    year: 2025,
    genre: ["Action", "Adventure", "Drama"],
    releaseDate: "2025-01-15"
  },
  {
    id: "us2",
    title: "Severance Season 2",
    type: "show",
    poster: "https://image.tmdb.org/t/p/w500/fFXXNw6GC7xGO9vDNd5JJVvZHjP.jpg",
    tldrRating: 9.3,
    platform: "Apple TV+",
    watchUrl: "https://tv.apple.com",
    trailerUrl: "https://www.youtube.com/embed/xEQP4VVuyrY",
    year: 2025,
    genre: ["Sci-Fi", "Thriller", "Mystery"],
    releaseDate: "2025-01-20"
  },
  {
    id: "us3",
    title: "House of the Dragon Season 3",
    type: "show",
    poster: "https://image.tmdb.org/t/p/w500/7QMsOTMUswlwxJP0rTTZfmz2tX2.jpg",
    tldrRating: 9.1,
    platform: "HBO Max",
    watchUrl: "https://www.hbomax.com",
    trailerUrl: "https://www.youtube.com/embed/DotnJ7tTA34",
    year: 2025,
    genre: ["Fantasy", "Drama", "Action"],
    releaseDate: "2025-02-01"
  },
  {
    id: "us4",
    title: "Stranger Things Season 5",
    type: "show",
    poster: "https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
    tldrRating: 9.0,
    platform: "Netflix",
    watchUrl: "https://www.netflix.com",
    trailerUrl: "https://www.youtube.com/embed/yQEondeGvKo",
    year: 2025,
    genre: ["Sci-Fi", "Horror", "Drama"],
    releaseDate: "2025-02-10"
  },
  {
    id: "us5",
    title: "Wednesday Season 2",
    type: "show",
    poster: "https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
    tldrRating: 8.7,
    platform: "Netflix",
    watchUrl: "https://www.netflix.com",
    trailerUrl: "https://www.youtube.com/embed/Di310WS8zLk",
    year: 2025,
    genre: ["Comedy", "Mystery", "Fantasy"],
    releaseDate: "2025-02-15"
  }
];

// Helper to get all available weeks from Top 10 data
export const getAvailableWeeks = (): string[] => {
  const weeks = new Set<string>();
  [...top10Movies, ...top10Shows].forEach(item => {
    if (item.weekStart) weeks.add(item.weekStart);
  });
  return Array.from(weeks).sort().reverse(); // Most recent first
};

// All available platforms
export const allPlatforms: Platform[] = [
  'Netflix',
  'Prime Video',
  'Disney+',
  'HBO Max',
  'Apple TV+',
  'Hulu'
];
