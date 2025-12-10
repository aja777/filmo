
import { Movie, Category, User } from '../types';

const API_BASE_URL = 'https://kiamovie.ir/wp-json/kia/v1';

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  token?: string;
  profile?: any;
  // List response
  page?: number;
  per_page?: number;
  total?: number;
  total_pages?: number;
  items?: any[]; 
}

// Convert WP Movie structure to App Movie structure
const transformMovie = (wpMovie: any): Movie => {
    // Parse download links from API
    // Expecting structure: [{ quality: '1080p', url: '...', size: '...' }, ...]
    const downloadLinks = Array.isArray(wpMovie.download_links) 
        ? wpMovie.download_links.map((l: any) => ({
            quality: l.quality || 'کیفیت بالا',
            size: l.size || 'نامشخص',
            url: l.url
        })) 
        : [];

    // Use download links as stream sources if available
    // Fallback to mock if no links exist (so player doesn't break during dev)
    const streamLinks = downloadLinks.length > 0 
        ? downloadLinks.map((l: any) => ({ quality: l.quality || 'HD', url: l.url }))
        : [
            { quality: '720p', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }
        ];

    return {
      id: String(wpMovie.id),
      title: wpMovie.title,
      originalTitle: '', // Not provided in current API response
      description: wpMovie.excerpt || '',
      posterUrl: wpMovie.thumbnail || 'https://via.placeholder.com/300x450',
      backdropUrl: wpMovie.thumbnail || 'https://via.placeholder.com/800x400',
      rating: wpMovie.rating || 0,
      year: String(wpMovie.year || ''),
      country: wpMovie.country || '',
      genres: wpMovie.categories || [],
      duration: '', 
      director: '', 
      hasDubbing: wpMovie.categories?.includes('دوبله فارسی'),
      hasSubtitle: wpMovie.categories?.includes('زیرنویس فارسی'),
      type: wpMovie.type === 'post' ? 'movie' : wpMovie.type, // Map 'post' to 'movie' if needed
      age_rating: wpMovie.age_rating,
      downloadLinks: downloadLinks,
      streamLinks: streamLinks,
      isFree: false 
    };
};

export const api = {
  // Get Movies List
  getMovies: async (page = 1, perPage = 20): Promise<{ items: Movie[], totalPages: number }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/movies?page=${page}&per_page=${perPage}`);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      
      if (data && Array.isArray(data.items)) {
        return {
            items: data.items.map(transformMovie),
            totalPages: data.total_pages || 1
        };
      }
      return { items: [], totalPages: 0 };
    } catch (error) {
      console.error('API getMovies error:', error);
      return { items: [], totalPages: 0 };
    }
  },

  // Get Categories
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      if (Array.isArray(data)) {
        return data.map((cat: any) => ({
          id: String(cat.id),
          name: cat.name,
          slug: cat.slug,
          count: cat.count
        }));
      }
      return [];
    } catch (error) {
      console.error('API getCategories error:', error);
      return [];
    }
  },

  // Login
  login: async (username: string, password: string): Promise<{ success: boolean; token?: string; user?: User; message?: string }> => {
    try {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            const user: User = {
                id: String(data.profile.user_id),
                name: data.profile.display_name,
                email: data.profile.email,
                avatar: `https://ui-avatars.com/api/?name=${data.profile.display_name}&background=random`,
                subscription: data.profile.subscription
            };
            return { success: true, token: data.token, user };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        return { success: false, message: 'خطا در برقراری ارتباط با سرور' };
    }
  },

  // Get Current User (Me)
  getCurrentUser: async (token: string): Promise<User | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) return null;

      const data = await response.json();
      
      if (data.logged_in) {
          return {
              id: String(data.user_id),
              name: data.display_name,
              email: data.email,
              avatar: `https://ui-avatars.com/api/?name=${data.display_name}&background=random`,
              subscription: data.subscription
          };
      }
      return null;
    } catch (error) {
      console.error('API getCurrentUser error:', error);
      return null;
    }
  }
};
