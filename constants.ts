
import { Movie, Category, User, Transaction, Comment } from './types';

export const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'اکشن', slug: 'action' },
  { id: '2', name: 'درام', slug: 'drama' },
  { id: '3', name: 'کمدی', slug: 'comedy' },
  { id: '4', name: 'علمی تخیلی', slug: 'sci-fi' },
  { id: '5', name: 'ترسناک', slug: 'horror' },
  { id: '6', name: 'انیمیشن', slug: 'animation' },
];

export const FILTER_COUNTRIES = ['آمریکا', 'انگلستان', 'ایران', 'کره جنوبی', 'آلمان', 'فرانسه'];
export const FILTER_YEARS = Array.from({length: 20}, (_, i) => (2024 - i).toString());

export const MOCK_MOVIES: Movie[] = [
  {
    id: '1',
    title: 'اوپنهایمر',
    originalTitle: 'Oppenheimer',
    description: 'داستان نقش جی. رابرت اوپنهایمر در توسعه بمب اتمی در طول جنگ جهانی دوم.',
    posterUrl: 'https://picsum.photos/300/450?random=1',
    backdropUrl: 'https://picsum.photos/800/400?random=1',
    rating: 8.9,
    year: '2023',
    country: 'آمریکا',
    genres: ['بیوگرافی', 'درام', 'تاریخی'],
    duration: '3h',
    director: 'کریستوفر نولان',
    hasDubbing: true,
    hasSubtitle: true,
    type: 'movie',
    downloadLinks: [
      { quality: '1080p', size: '2.5GB', url: '#' },
      { quality: '720p', size: '1.2GB', url: '#' }
    ],
    streamLinks: [
        { quality: '1080p', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
        { quality: '720p', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' }
    ]
  },
  {
    id: '2',
    title: 'تلقین',
    originalTitle: 'Inception',
    description: 'دزدی که اسرار شرکت‌ها را از طریق استفاده از تکنولوژی به اشتراک‌گذاری رویا می‌دزدد.',
    posterUrl: 'https://picsum.photos/300/450?random=2',
    backdropUrl: 'https://picsum.photos/800/400?random=2',
    rating: 8.8,
    year: '2010',
    country: 'آمریکا',
    genres: ['اکشن', 'علمی تخیلی'],
    duration: '2h 28m',
    director: 'کریستوفر نولان',
    hasDubbing: true,
    type: 'movie',
    streamLinks: [
        { quality: '1080p', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' }
    ]
  },
  {
    id: '3',
    title: 'بریکینگ بد',
    originalTitle: 'Breaking Bad',
    description: 'یک معلم شیمی دبیرستان که مبتلا به سرطان ریه است، برای تامین آینده خانواده‌اش به تولید متامفتامین روی می‌آورد.',
    posterUrl: 'https://picsum.photos/300/450?random=3',
    backdropUrl: 'https://picsum.photos/800/400?random=3',
    rating: 9.5,
    year: '2008',
    country: 'آمریکا',
    genres: ['جنایی', 'درام'],
    director: 'وینس گیلیگان',
    hasDubbing: true,
    hasSubtitle: true,
    type: 'series',
    isFree: true
  },
  {
    id: '4',
    title: 'مرد عنکبوتی: میان دنیای عنکبوتی',
    originalTitle: 'Spider-Man: Across the Spider-Verse',
    description: 'مایلز مورالس برای یک ماجراجویی حماسی به مولتی‌ورس پرتاب می‌شود.',
    posterUrl: 'https://picsum.photos/300/450?random=4',
    backdropUrl: 'https://picsum.photos/800/400?random=4',
    rating: 8.7,
    year: '2023',
    country: 'آمریکا',
    genres: ['انیمیشن', 'اکشن'],
    director: 'واکیم دوس سانتوس',
    hasDubbing: true,
    type: 'animation'
  },
  {
    id: '5',
    title: 'پدرخوانده',
    originalTitle: 'The Godfather',
    description: 'پیرمرد سالخورده یک سلسله جنایت سازمان‌یافته کنترل امپراتوری مخفی خود را به پسر بی میل خود منتقل می‌کند.',
    posterUrl: 'https://picsum.photos/300/450?random=5',
    backdropUrl: 'https://picsum.photos/800/400?random=5',
    rating: 9.2,
    year: '1972',
    country: 'آمریکا',
    genres: ['جنایی', 'درام'],
    hasSubtitle: true,
    type: 'movie',
    isFree: true
  },
  {
    id: '6',
    title: 'بازی تاج و تخت',
    originalTitle: 'Game of Thrones',
    description: 'نه خاندان اشرافی برای کنترل سرزمین‌های وستروس می‌جنگند، در حالی که یک دشمن باستانی پس از هزاران سال بازمی‌گردد.',
    posterUrl: 'https://picsum.photos/300/450?random=6',
    backdropUrl: 'https://picsum.photos/800/400?random=6',
    rating: 9.2,
    year: '2011',
    country: 'انگلستان',
    genres: ['اکشن', 'ماجراجویی', 'درام'],
    hasDubbing: true,
    hasSubtitle: true,
    type: 'series'
  },
  {
    id: '7',
    title: 'روح',
    originalTitle: 'Soul',
    description: 'یک نوازنده موسیقی جاز پس از یک قدم اشتباه، به سرزمینی عجیب منتقل می‌شود.',
    posterUrl: 'https://picsum.photos/300/450?random=7',
    backdropUrl: 'https://picsum.photos/800/400?random=7',
    rating: 8.1,
    year: '2020',
    country: 'آمریکا',
    genres: ['انیمیشن', 'خانوادگی'],
    hasDubbing: true,
    type: 'animation',
    isFree: true
  }
];

export const HERO_SLIDES: Movie[] = MOCK_MOVIES.slice(0, 3);

// Mock User Data
export const MOCK_USER: User = {
  id: 'u1',
  name: 'کاربر مهمان',
  email: 'guest@example.com',
  avatar: 'https://ui-avatars.com/api/?name=Ali+Rezaei&background=random&color=fff',
  subscription: {
    active: false,
    expires_at: null,
    expires_hum: null
  }
};

// Mock Transactions
export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '101', title: 'خرید اشتراک ۱ ماهه', amount: 99000, date: '2023-10-15T14:30:00', status: 'success', refId: '12345678' },
  { id: '102', title: 'خرید اشتراک ۳ ماهه', amount: 250000, date: '2023-07-15T10:00:00', status: 'success', refId: '87654321' },
  { id: '103', title: 'تلاش ناموفق', amount: 99000, date: '2023-07-15T09:55:00', status: 'failed', refId: '00000000' },
];

// Mock Comments
export const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    userId: 'u2',
    userName: 'سارا محمدی',
    userAvatar: 'https://ui-avatars.com/api/?name=Sara+Mohammadi&background=random',
    content: 'فیلم فوق‌العاده‌ای بود، حتما پیشنهاد می‌کنم ببینید. پایانش خیلی شوکه کننده بود.',
    date: '2 ساعت پیش',
    likes: 12
  },
  {
    id: 'c2',
    userId: 'u3',
    userName: 'امیرحسین',
    userAvatar: 'https://ui-avatars.com/api/?name=Amir+Hossein&background=random',
    content: 'نسخه دوبله کیفیت صداش خیلی خوب بود. ممنون از سایت خوبتون.',
    date: '1 روز پیش',
    likes: 8
  },
  {
    id: 'c3',
    userId: 'u4',
    userName: 'رضا',
    userAvatar: 'https://ui-avatars.com/api/?name=Reza&background=random',
    content: 'من زیاد با داستانش ارتباط برقرار نکردم، ولی بازی بازیگرها عالی بود.',
    date: '3 روز پیش',
    likes: 3
  }
];
