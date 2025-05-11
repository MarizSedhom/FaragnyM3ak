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
  },
  {
    id: 'm3',
    type: 'movie',
    title: 'The Dark Knight',
    posterUrl: 'https://m.media-amazon.com/images/I/91KkWf50SoL._AC_UF894,1000_QL80_.jpg',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    genre: ['Action', 'Crime', 'Drama'],
    isFavorite: true,
    createdAt: new Date('2008-07-18'),
    lastModified: new Date('2024-01-02'),
    rating: 5,
    ratingCount: 2300000,
    hasSub: true,
    hasDub: true,
    progress: 100,
    timeLeft: 0,
    duration: 152,
    releaseYear: 2008,
    watched: true
  },
  {
    id: 'm4',
    type: 'movie',
    title: 'Spirited Away',
    posterUrl: 'https://th.bing.com/th/id/R.c7ce41d0f84610a4c364456591cfc4ba?rik=6%2f7AFFgCCACeLg&riu=http%3a%2f%2fimages5.fanpop.com%2fimage%2fphotos%2f29000000%2fSpirited-Away-spirited-away-29095841-1024-768.jpg&ehk=6%2frDh75HklVOHrZ4w9PgUd1W3FFLeqCzbY40OUHwkkw%3d&risl=&pid=ImgRaw&r=0',
    description: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, where humans are changed into beasts.',
    genre: ['Animation', 'Adventure', 'Fantasy'],
    isFavorite: true,
    createdAt: new Date('2001-07-20'),
    lastModified: new Date('2024-01-04'),
    rating: 5,
    ratingCount: 750000,
    hasSub: true,
    hasDub: true,
    progress: 80,
    timeLeft: 25,
    duration: 125,
    releaseYear: 2001,
    watched: false
  },
  {
    id: 'm5',
    type: 'movie',
    title: 'Parasite',
    posterUrl: 'https://m.media-amazon.com/images/I/91sustfojBL._AC_UF894,1000_QL80_.jpg',
    description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    genre: ['Drama', 'Thriller'],
    isFavorite: false,
    createdAt: new Date('2019-05-30'),
    lastModified: new Date('2024-01-05'),
    rating: 4,
    ratingCount: 680000,
    hasSub: true,
    hasDub: false,
    progress: 0,
    timeLeft: 132,
    duration: 132,
    releaseYear: 2019,
    watched: false
  },
  {
    id: 'm6',
    type: 'movie',
    title: 'Pulp Fiction',
    posterUrl: 'https://picfiles.alphacoders.com/371/371109.jpg',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    genre: ['Crime', 'Drama'],
    isFavorite: false,
    createdAt: new Date('1994-10-14'),
    lastModified: new Date('2024-01-10'),
    rating: 4,
    ratingCount: 1950000,
    hasSub: true,
    hasDub: true,
    progress: 60,
    timeLeft: 68,
    duration: 154,
    releaseYear: 1994,
    watched: false
  },
  {
    id: 'm7',
    type: 'movie',
    title: 'Interstellar',
    posterUrl:'https://th.bing.com/th/id/R.0e117005bd334d4f305f4ce25c6d95dc?rik=XoXHR1j4PEpbfg&pid=ImgRaw&r=0',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    genre: ['Adventure', 'Drama', 'Sci-Fi'],
    isFavorite: true,
    createdAt: new Date('2014-11-07'),
    lastModified: new Date('2024-01-12'),
    rating: 5,
    ratingCount: 1600000,
    hasSub: true,
    hasDub: true,
    progress: 100,
    timeLeft: 0,
    duration: 169,
    releaseYear: 2014,
    watched: true
  },
  {
    id: 's4',
    type: 'series',
    title: 'Attack on Titan',
    posterUrl: 'https://m.media-amazon.com/images/I/81dH7-pkjiL._AC_UF894,1000_QL80_.jpg',
    description: 'After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.',
    genre: ['Action', 'Drama', 'Fantasy'],
    isFavorite: true,
    createdAt: new Date('2013-04-07'),
    lastModified: new Date('2024-01-15'),
    rating: 5,
    ratingCount: 950000,
    hasSub: true,
    hasDub: true,
    seasons: [
      {
        seasonNumber: 1,
        releaseYear: 2013,
        episodes: [
          {
            id: 's4e1',
            episodeNumber: 1,
            title: 'To You, 2000 Years From Now',
            duration: 24,
            watched: true,
            progress: 100,
            timeLeft: 0
          },
          {
            id: 's4e2',
            episodeNumber: 2,
            title: 'That Day',
            duration: 24,
            watched: true,
            progress: 100,
            timeLeft: 0
          }
        ]
      },
      {
        seasonNumber: 2,
        releaseYear: 2017,
        episodes: [
          {
            id: 's4e3',
            episodeNumber: 1,
            title: 'Beast Titan',
            duration: 24,
            watched: false,
            progress: 10,
            timeLeft: 21
          }
        ]
      }
    ],
    totalSeasons: 4
  },
  {
    id: 's5',
    type: 'series',
    title: 'Breaking Bad',
    posterUrl: 'https://th.bing.com/th/id/OIP.Ue2bjTLkJ1RKxP7R67NprgHaLe?cb=iwc1&rs=1&pid=ImgDetMain',
    description: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family\'s future.',
    genre: ['Crime', 'Drama', 'Thriller'],
    isFavorite: true,
    createdAt: new Date('2008-01-20'),
    lastModified: new Date('2024-01-18'),
    rating: 5,
    ratingCount: 1750000,
    hasSub: true,
    hasDub: true,
    seasons: [
      {
        seasonNumber: 1,
        releaseYear: 2008,
        episodes: [
          {
            id: 's5e1',
            episodeNumber: 1,
            title: 'Pilot',
            duration: 58,
            watched: true,
            progress: 100,
            timeLeft: 0
          },
          {
            id: 's5e2',
            episodeNumber: 2,
            title: 'Cat\'s in the Bag...',
            duration: 48,
            watched: true,
            progress: 100,
            timeLeft: 0
          }
        ]
      }
    ],
    totalSeasons: 5
  },
  {
    id: 's6',
    type: 'series',
    title: 'One Punch Man',
    posterUrl: 'https://th.bing.com/th/id/OIP.4Rfi8npznW1R5HG35H7cbAHaLE?cb=iwc1&rs=1&pid=ImgDetMain',
    description: 'The story of Saitama, a hero who can defeat any opponent with a single punch but seeks to find a worthy opponent after growing bored by a lack of challenge.',
    genre: ['Action', 'Comedy'],
    isFavorite: false,
    createdAt: new Date('2015-10-05'),
    lastModified: new Date('2024-01-20'),
    rating: 4,
    ratingCount: 520000,
    hasSub: true,
    hasDub: true,
    seasons: [
      {
        seasonNumber: 1,
        releaseYear: 2015,
        episodes: [
          {
            id: 's6e1',
            episodeNumber: 1,
            title: 'The Strongest Man',
            duration: 24,
            watched: true,
            progress: 100,
            timeLeft: 0
          },
          {
            id: 's6e2',
            episodeNumber: 2,
            title: 'The Lone Cyborg',
            duration: 24,
            watched: false,
            progress: 15,
            timeLeft: 20
          }
        ]
      }
    ],
    totalSeasons: 2
  },
  {
    id: 'm8',
    type: 'movie',
    title: 'Your Name',
    posterUrl: 'https://th.bing.com/th/id/OIP.27bMFKjtQAqnEFYC-MdYMAHaLH?cb=iwc1&rs=1&pid=ImgDetMain',
    description: 'Two strangers find themselves linked in a bizarre way. When a connection forms, will distance be the only thing to keep them apart?',
    genre: ['Animation', 'Drama', 'Fantasy'],
    isFavorite: true,
    createdAt: new Date('2016-08-26'),
    lastModified: new Date('2024-01-22'),
    rating: 5,
    ratingCount: 420000,
    hasSub: true,
    hasDub: true,
    progress: 100,
    timeLeft: 0,
    duration: 106,
    releaseYear: 2016,
    watched: true
  },
  {
    id: 'm9',
    type: 'movie',
    title: 'The Matrix',
    posterUrl: 'https://m.media-amazon.com/images/I/71PfZFFz9yL._AC_UF894,1000_QL80_.jpg',
    description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    genre: ['Action', 'Sci-Fi'],
    isFavorite: false,
    createdAt: new Date('1999-03-31'),
    lastModified: new Date('2024-01-25'),
    rating: 4,
    ratingCount: 1850000,
    hasSub: true,
    hasDub: true,
    progress: 45,
    timeLeft: 81,
    duration: 136,
    releaseYear: 1999,
    watched: false
  },
  {
    id: 's7',
    type: 'series',
    title: 'Stranger Things',
    posterUrl: 'https://th.bing.com/th/id/OIP.txVyc1okHSqirQcffy5ltAHaK-?cb=iwc1&rs=1&pid=ImgDetMain',
    description: 'When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.',
    genre: ['Drama', 'Fantasy', 'Horror'],
    isFavorite: true,
    createdAt: new Date('2016-07-15'),
    lastModified: new Date('2024-01-28'),
    rating: 4,
    ratingCount: 1200000,
    hasSub: true,
    hasDub: true,
    seasons: [
      {
        seasonNumber: 1,
        releaseYear: 2016,
        episodes: [
          {
            id: 's7e1',
            episodeNumber: 1,
            title: 'The Vanishing of Will Byers',
            duration: 49,
            watched: true,
            progress: 100,
            timeLeft: 0
          },
          {
            id: 's7e2',
            episodeNumber: 2,
            title: 'The Weirdo on Maple Street',
            duration: 46,
            watched: true,
            progress: 100,
            timeLeft: 0
          }
        ]
      }
    ],
    totalSeasons: 4
  },
  {
    id: 's8',
    type: 'series',
    title: 'My Hero Academia',
    posterUrl: 'https://th.bing.com/th/id/R.a328ac503a703c5532dadd4e882d7ca5?rik=5M92Nb1qLDrsTg&riu=http%3a%2f%2fvisualprint-store.com%2fcdn%2fshop%2fproducts%2fFP4602.jpg%3fv%3d1665616410&ehk=GVErIPeC10e4eF3M1IUo2NYso4ZIJaMk3%2bRIxYLqiQ4%3d&risl=&pid=ImgRaw&r=0',
    description: 'A superhero-loving boy without any powers is determined to enroll in a prestigious hero academy and learn what it really means to be a hero.',
    genre: ['Animation', 'Action', 'Adventure'],
    isFavorite: false,
    createdAt: new Date('2016-04-03'),
    lastModified: new Date('2024-01-30'),
    rating: 4,
    ratingCount: 480000,
    hasSub: true,
    hasDub: true,
    seasons: [
      {
        seasonNumber: 1,
        releaseYear: 2016,
        episodes: [
          {
            id: 's8e1',
            episodeNumber: 1,
            title: 'Izuku Midoriya: Origin',
            duration: 24,
            watched: false,
            progress: 0,
            timeLeft: 24
          },
          {
            id: 's8e2',
            episodeNumber: 2,
            title: 'What It Takes to Be a Hero',
            duration: 24,
            watched: false,
            progress: 0,
            timeLeft: 24
          }
        ]
      }
    ],
    totalSeasons: 6
  },
  {
    id: 'm10',
    type: 'movie',
    title: 'The Silence of the Lambs',
    posterUrl: 'https://m.media-amazon.com/images/I/71JxA6I+sgL._AC_UF894,1000_QL80_.jpg',
    description: 'A young FBI cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.',
    genre: ['Crime', 'Drama', 'Thriller'],
    isFavorite: false,
    createdAt: new Date('1991-02-14'),
    lastModified: new Date('2024-02-01'),
    rating: 4,
    ratingCount: 1350000,
    hasSub: true,
    hasDub: true,
    progress: 0,
    timeLeft: 118,
    duration: 118,
    releaseYear: 1991,
    watched: false
  },
  {
    id: 'm11',
    type: 'movie',
    title: 'Princess Mononoke',
    posterUrl: 'https://www.themoviedb.org/t/p/original/cdclY72b6L5Y3ObGWAjoxsjgsgR.jpg',
    description: 'On a journey to find the cure for a Tatarigami\'s curse, Ashitaka finds himself in the middle of a war between the forest gods and Tatara, a mining colony.',
    genre: ['Animation', 'Adventure', 'Fantasy'],
    isFavorite: true,
    createdAt: new Date('1997-07-12'),
    lastModified: new Date('2024-02-03'),
    rating: 5,
    ratingCount: 350000,
    hasSub: true,
    hasDub: true,
    progress: 70,
    timeLeft: 40,
    duration: 134,
    releaseYear: 1997,
    watched: false
  },
  {
    id: 's9',
    type: 'series',
    title: 'Fullmetal Alchemist: Brotherhood',
    posterUrl: 'https://th.bing.com/th/id/OIP.mTJzFdfcm7D9eeEcYJXWlAAAAA?cb=iwc1&rs=1&pid=ImgDetMain',
    description: 'Two brothers search for a Philosopher\'s Stone after an attempt to revive their deceased mother goes wrong and leaves them in damaged physical forms.',
    genre: ['Animation', 'Action', 'Adventure'],
    isFavorite: true,
    createdAt: new Date('2009-04-05'),
    lastModified: new Date('2024-02-05'),
    rating: 5,
    ratingCount: 570000,
    hasSub: true,
    hasDub: true,
    seasons: [
      {
        seasonNumber: 1,
        releaseYear: 2009,
        episodes: [
          {
            id: 's9e1',
            episodeNumber: 1,
            title: 'Fullmetal Alchemist',
            duration: 24,
            watched: true,
            progress: 100,
            timeLeft: 0
          },
          {
            id: 's9e2',
            episodeNumber: 2,
            title: 'The First Day',
            duration: 24,
            watched: true,
            progress: 100,
            timeLeft: 0
          }
        ]
      }
    ],
    totalSeasons: 1
  },
  {
    id: 'm12',
    type: 'movie',
    title: 'Akira',
    posterUrl: 'https://th.bing.com/th/id/R.fbdd00223e7ad613e1224fbe8970515d?rik=j%2bL1cwx2cQNsRQ&pid=ImgRaw&r=0',
    description: 'A secret military project endangers Neo-Tokyo when it turns a biker gang member into a rampaging psychic psychopath who can only be stopped by two teenagers and a group of psychics.',
    genre: ['Animation', 'Action', 'Sci-Fi'],
    isFavorite: false,
    createdAt: new Date('1988-07-16'),
    lastModified: new Date('2024-02-08'),
    rating: 4,
    ratingCount: 290000,
    hasSub: true,
    hasDub: true,
    progress: 20,
    timeLeft: 104,
    duration: 124,
    releaseYear: 1988,
    watched: false
  },
  {
    id: 's10',
    type: 'series',
    title: 'Hunter x Hunter',
    posterUrl: 'https://m.media-amazon.com/images/I/71aoeOhdNnL._AC_SL1000_.jpg',
    description: 'Gon Freecss aspires to become a Hunter, an exceptional being capable of greatness. With his friends and his potential, he seeks for his father who left him when he was younger.',
    genre: ['Animation', 'Action', 'Adventure'],
    isFavorite: true,
    createdAt: new Date('2011-10-02'),
    lastModified: new Date('2024-02-10'),
    rating: 5,
    ratingCount: 410000,
    hasSub: true,
    hasDub: true,
    seasons: [
      {
        seasonNumber: 1,
        releaseYear: 2011,
        episodes: [
          {
            id: 's10e1',
            episodeNumber: 1,
            title: 'Departure × And × Friends',
            duration: 24,
            watched: true,
            progress: 100,
            timeLeft: 0
          },
          {
            id: 's10e2',
            episodeNumber: 2,
            title: 'Test × Of × Tests',
            duration: 24,
            watched: false,
            progress: 50,
            timeLeft: 12
          }
        ]
      }
    ],
    totalSeasons: 6
  },
  {
    id: 'm13',
    type: 'movie',
    title: 'Grave of the Fireflies',
    posterUrl: 'https://image.tmdb.org/t/p/original/qG3RYlIVpTYclR9TYIsy8p7m7AT.jpg',
    description: 'A young boy and his little sister struggle to survive in Japan during World War II.',
    genre: ['Animation', 'Drama', 'War'],
    isFavorite: false,
    createdAt: new Date('1988-04-16'),
    lastModified: new Date('2024-02-12'),
    rating: 5,
    ratingCount: 270000,
    hasSub: true,
    hasDub: true,
    progress: 0,
    timeLeft: 89,
    duration: 89,
    releaseYear: 1988,
    watched: false
  },
  {
    id: 's11',
    type: 'series',
    title: 'The Witcher',
    posterUrl: 'https://th.bing.com/th/id/OIP.5GXMWzjvja13qo-QnUkzHwHaK-?cb=iwc1&rs=1&pid=ImgDetMain',
    description: 'Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.',
    genre: ['Action', 'Adventure', 'Fantasy'],
    isFavorite: false,
    createdAt: new Date('2019-12-20'),
    lastModified: new Date('2024-02-15'),
    rating: 4,
    ratingCount: 680000,
    hasSub: true,
    hasDub: true,
    seasons: [
      {
        seasonNumber: 1,
        releaseYear: 2019,
        episodes: [
          {
            id: 's11e1',
            episodeNumber: 1,
            title: 'The End\'s Beginning',
            duration: 61,
            watched: true,
            progress: 100,
            timeLeft: 0
          },
          {
            id: 's11e2',
            episodeNumber: 2,
            title: 'Four Marks',
            duration: 61,
            watched: false,
            progress: 20,
            timeLeft: 49
          }
        ]
      }
    ],
    totalSeasons: 3
  }
];