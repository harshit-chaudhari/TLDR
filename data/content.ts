export interface Content {
  id: string;
  title: string;
  poster: string;
  tldrRating: number;
  platform: 'Netflix' | 'Prime Video' | 'Disney+' | 'HBO Max' | 'Apple TV+' | 'Hulu';
  watchUrl: string;
  trailerUrl: string;
  year?: number;
  genre?: string[];
}

export const top10Movies: Content[] = [
  {
    id: "m1",
    title: "Oppenheimer",
    poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    tldrRating: 9.4,
    platform: "Prime Video",
    watchUrl: "https://www.primevideo.com",
    trailerUrl: "https://www.youtube.com/embed/uYPbbksJxIg",
    year: 2023,
    genre: ["Biography", "Drama", "History"]
  },
  {
    id: "m2",
    title: "The Holdovers",
    poster: "https://image.tmdb.org/t/p/w500/6zc1dwwQ6S5JLPAjKQb5iN7HT1M.jpg",
    tldrRating: 9.1,
    platform: "Prime Video",
    watchUrl: "https://www.primevideo.com",
    trailerUrl: "https://www.youtube.com/embed/5h9E3fLLfN8",
    year: 2023,
    genre: ["Comedy", "Drama"]
  },
  {
    id: "m3",
    title: "Poor Things",
    poster: "https://image.tmdb.org/t/p/w500/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg",
    tldrRating: 8.9,
    platform: "Disney+",
    watchUrl: "https://www.disneyplus.com",
    trailerUrl: "https://www.youtube.com/embed/RlbR5N6veqw",
    year: 2023,
    genre: ["Comedy", "Drama", "Romance"]
  },
  {
    id: "m4",
    title: "Killers of the Flower Moon",
    poster: "https://image.tmdb.org/t/p/w500/dB6Krk806zeqd0YNp2ngQ9zXteH.jpg",
    tldrRating: 9.2,
    platform: "Apple TV+",
    watchUrl: "https://tv.apple.com",
    trailerUrl: "https://www.youtube.com/embed/EP34Yoxs3FQ",
    year: 2023,
    genre: ["Crime", "Drama", "History"]
  },
  {
    id: "m5",
    title: "Past Lives",
    poster: "https://image.tmdb.org/t/p/w500/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg",
    tldrRating: 9.0,
    platform: "Prime Video",
    watchUrl: "https://www.primevideo.com",
    trailerUrl: "https://www.youtube.com/embed/kA244xewjcI",
    year: 2023,
    genre: ["Drama", "Romance"]
  },
  {
    id: "m6",
    title: "The Zone of Interest",
    poster: "https://image.tmdb.org/t/p/w500/pCrbux5FVLp2vn6cO7mJnqxR9G7.jpg",
    tldrRating: 8.7,
    platform: "HBO Max",
    watchUrl: "https://www.hbomax.com",
    trailerUrl: "https://www.youtube.com/embed/blN4eHWMB_k",
    year: 2023,
    genre: ["Drama", "History", "War"]
  },
  {
    id: "m7",
    title: "May December",
    poster: "https://image.tmdb.org/t/p/w500/5EXCTmh3MGtb1gkdJVgCqBxIdxC.jpg",
    tldrRating: 8.5,
    platform: "Netflix",
    watchUrl: "https://www.netflix.com",
    trailerUrl: "https://www.youtube.com/embed/loANUDd9pq8",
    year: 2023,
    genre: ["Drama"]
  },
  {
    id: "m8",
    title: "The Boy and the Heron",
    poster: "https://image.tmdb.org/t/p/w500/f4oZTcfGrVTXKTWg157AwikXqmP.jpg",
    tldrRating: 9.3,
    platform: "HBO Max",
    watchUrl: "https://www.hbomax.com",
    trailerUrl: "https://www.youtube.com/embed/t5khm-VjEu4",
    year: 2023,
    genre: ["Animation", "Adventure", "Fantasy"]
  },
  {
    id: "m9",
    title: "Anatomy of a Fall",
    poster: "https://image.tmdb.org/t/p/w500/kQs6keheMwCxJxrzV83VUwFtHkB.jpg",
    tldrRating: 8.8,
    platform: "Hulu",
    watchUrl: "https://www.hulu.com",
    trailerUrl: "https://www.youtube.com/embed/6xtH4f_NZ3o",
    year: 2023,
    genre: ["Crime", "Drama", "Thriller"]
  },
  {
    id: "m10",
    title: "American Fiction",
    poster: "https://image.tmdb.org/t/p/w500/57MFWGHarg9jid7yfDTka4RmcMU.jpg",
    tldrRating: 8.6,
    platform: "Prime Video",
    watchUrl: "https://www.primevideo.com",
    trailerUrl: "https://www.youtube.com/embed/C1PUk-_Hcu0",
    year: 2023,
    genre: ["Comedy", "Drama"]
  }
];

export const top10Shows: Content[] = [
  {
    id: "s1",
    title: "The Bear",
    poster: "https://image.tmdb.org/t/p/w500/zCb3K4K1rwL8F3N5AhLmJuOZi9g.jpg",
    tldrRating: 9.5,
    platform: "Disney+",
    watchUrl: "https://www.disneyplus.com",
    trailerUrl: "https://www.youtube.com/embed/y-cqqAJIXhs",
    year: 2023,
    genre: ["Drama", "Comedy"]
  },
  {
    id: "s2",
    title: "Succession",
    poster: "https://image.tmdb.org/t/p/w500/7HW47XbkNQ5fiwQFYGWdw9gs144.jpg",
    tldrRating: 9.7,
    platform: "HBO Max",
    watchUrl: "https://www.hbomax.com",
    trailerUrl: "https://www.youtube.com/embed/OdYVdLKVPJ0",
    year: 2023,
    genre: ["Drama"]
  },
  {
    id: "s3",
    title: "Beef",
    poster: "https://image.tmdb.org/t/p/w500/g9KvUfX6qN0vQq0WQ7tZjLovkhA.jpg",
    tldrRating: 9.2,
    platform: "Netflix",
    watchUrl: "https://www.netflix.com",
    trailerUrl: "https://www.youtube.com/embed/1R-uOq4hNX0",
    year: 2023,
    genre: ["Comedy", "Drama", "Thriller"]
  },
  {
    id: "s4",
    title: "The Last of Us",
    poster: "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
    tldrRating: 9.4,
    platform: "HBO Max",
    watchUrl: "https://www.hbomax.com",
    trailerUrl: "https://www.youtube.com/embed/uLtkt8BonwM",
    year: 2023,
    genre: ["Action", "Adventure", "Drama"]
  },
  {
    id: "s5",
    title: "Shrinking",
    poster: "https://image.tmdb.org/t/p/w500/eqbXPRH8LmEPh9lLAH1URBOJJW3.jpg",
    tldrRating: 8.8,
    platform: "Apple TV+",
    watchUrl: "https://tv.apple.com",
    trailerUrl: "https://www.youtube.com/embed/5INdGXlbPPM",
    year: 2023,
    genre: ["Comedy", "Drama"]
  },
  {
    id: "s6",
    title: "Blue Eye Samurai",
    poster: "https://image.tmdb.org/t/p/w500/fXm3JT4WLQVnwukdvghtAblc1wc.jpg",
    tldrRating: 9.1,
    platform: "Netflix",
    watchUrl: "https://www.netflix.com",
    trailerUrl: "https://www.youtube.com/embed/mKcl3J1Z5d4",
    year: 2023,
    genre: ["Animation", "Action", "Drama"]
  },
  {
    id: "s7",
    title: "The Morning Show",
    poster: "https://image.tmdb.org/t/p/w500/oYB3rKyNRGPVf7wnf1wA6K8qLSQ.jpg",
    tldrRating: 8.6,
    platform: "Apple TV+",
    watchUrl: "https://tv.apple.com",
    trailerUrl: "https://www.youtube.com/embed/eA7D4_qU9jo",
    year: 2023,
    genre: ["Drama"]
  },
  {
    id: "s8",
    title: "The Crown",
    poster: "https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8V4o68.jpg",
    tldrRating: 9.0,
    platform: "Netflix",
    watchUrl: "https://www.netflix.com",
    trailerUrl: "https://www.youtube.com/embed/JWtnJjn6ng0",
    year: 2023,
    genre: ["Drama", "History"]
  },
  {
    id: "s9",
    title: "Gen V",
    poster: "https://image.tmdb.org/t/p/w500/uuot1N5AgZ7xRCKgm4ZCwOhgIJu.jpg",
    tldrRating: 8.4,
    platform: "Prime Video",
    watchUrl: "https://www.primevideo.com",
    trailerUrl: "https://www.youtube.com/embed/kV0F4C08n8I",
    year: 2023,
    genre: ["Action", "Drama", "Sci-Fi"]
  },
  {
    id: "s10",
    title: "For All Mankind",
    poster: "https://image.tmdb.org/t/p/w500/sYUtjEQN3xqCCgYKfvRo8cHYHk8.jpg",
    tldrRating: 8.9,
    platform: "Apple TV+",
    watchUrl: "https://tv.apple.com",
    trailerUrl: "https://www.youtube.com/embed/HZS9M52Bd_w",
    year: 2023,
    genre: ["Drama", "Sci-Fi"]
  }
];
