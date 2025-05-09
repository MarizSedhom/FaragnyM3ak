import { MediaItem } from "../models/media.model";

export const MOCK_MEDIA: MediaItem[] = [
  {
    id: 'm1',
    type: 'movie',
    title: 'The Shawshank Redemption',
    posterUrl: 'https://m.media-amazon.com/images/I/61t9ie31jgL._AC_UF894,1000_QL80_.jpg',
    description: 'Two imprisoned men bond over several years, finding solace and eventual redemption through acts of common decency.',
    genre: ['Drama'],
    isFavorite: false,
    createdAt: new Date('1994-09-23'),
    lastModified: new Date('2024-01-01'),
    rating: 4,
    ratingCount: 2500000,
    hasSub: true,
    hasDub: true,
    progress: 30,
    timeLeft: 100,
    duration: 142,
    releaseYear: 1994,
    watched: false
  },
  {
    id: 'm2',
    type: 'movie',
    title: 'Inception',
    posterUrl: 'https://th.bing.com/th/id/OIP.EkJQrnhiuYNofj8mcwrnKgHaE8?w=1348&h=899&rs=1&pid=ImgDetMain',
    description: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    genre: ['Action', 'Sci-Fi'],
    isFavorite: true,
    createdAt: new Date('2010-07-16'),
    lastModified: new Date('2024-01-01'),
    rating: 4,
    ratingCount: 1800000,
    hasSub: true,
    hasDub: true,
    progress: 100,
    timeLeft: 0,
    duration: 148,
    releaseYear: 2010,
    watched: true
  },
  {
    id: 's1',
    type: 'series',
    title: 'Demon Slayer',
    posterUrl: 'https://m.media-amazon.com/images/I/71V5F1sj-mL._AC_UF894,1000_QL80_.jpg',
    description: 'A young boy becomes a demon slayer after his family is slaughtered and his sister transformed into a demon.',
    genre: ['Action', 'Fantasy'],
    isFavorite: true,
    createdAt: new Date('2019-04-06'),
    lastModified: new Date('2024-01-01'),
    rating: 5,
    ratingCount: 350000,
    hasSub: true,
    hasDub: true,
    seasons: [
      {
        seasonNumber: 1,
        releaseYear: 2019,
        episodes: [
          {
            id: 's1e1',
            episodeNumber: 1,
            title: 'Cruelty',
            duration: 24,
            watched: false,
            progress: 2,
            timeLeft: 24
          },
          {
            id: 's1e2',
            episodeNumber: 2,
            title: 'Trainer Sakonji Urokodaki',
            duration: 24,
            watched: false,
            progress: 0,
            timeLeft: 24
          }
        ]
      }
    ],
    totalSeasons: 3
  },
  {
    id: 's2',
    type: 'series',
    title: 'Jujutsu Kaisen',
    posterUrl: 'https://m.media-amazon.com/images/I/81s+jxE5KEL._AC_SL1500_.jpg',
    description: 'A boy swallows a cursed talisman and becomes host to a powerful curse, joining a secret organization to fight curses.',
    genre: ['Action', 'Supernatural'],
    isFavorite: false,
    createdAt: new Date('2020-10-03'),
    lastModified: new Date('2024-01-01'),
    rating: 3,
    ratingCount: 420000,
    hasSub: true,
    hasDub: true,
    seasons: [
      {
        seasonNumber: 1,
        releaseYear: 2020,
        episodes: [
          {
            id: 's2e1',
            episodeNumber: 1,
            title: 'Ryomen Sukuna',
            duration: 24,
            watched: true,
            progress: 100,
            timeLeft: 0
          },
          {
            id: 's2e2',
            episodeNumber: 2,
            title: 'For Myself',
            duration: 24,
            watched: true,
            progress: 100,
            timeLeft: 0
          }
        ]
      }
    ],
    totalSeasons: 2
  },
  {
    id: 's3',
    type: 'series',
    title: 'Death Note',
    posterUrl: 'https://m.media-amazon.com/images/I/716ASj7z2GL._AC_SL1000_.jpg',
    description: 'A high school student discovers a supernatural notebook that allows him to kill anyone by writing their name.',
    genre: ['Thriller', 'Psychological'],
    isFavorite: true,
    createdAt: new Date('2006-10-03'),
    lastModified: new Date('2024-01-01'),
    rating: 2,
    ratingCount: 680000,
    hasSub: true,
    hasDub: true,
    seasons: [
      {
        seasonNumber: 1,
        releaseYear: 2006,
        episodes: [
          {
            id: 's3e1',
            episodeNumber: 1,
            title: 'Rebirth',
            duration: 24,
            watched: false,
            progress: 0,
            timeLeft: 24
          },
          {
            id: 's3e2',
            episodeNumber: 2,
            title: 'Confrontation',
            duration: 24,
            watched: false,
            progress: 0,
            timeLeft: 24
          }
        ]
      }
    ],
    totalSeasons: 1
  }
];