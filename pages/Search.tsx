import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Search as SearchIcon, Filter, X, ChevronDown } from 'lucide-react';
import { MOCK_MOVIES, MOCK_CATEGORIES, FILTER_COUNTRIES, FILTER_YEARS } from '../constants';
import MovieCard from '../components/MovieCard';

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  
  // Advanced Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState<'all' | 'movie' | 'series' | 'animation'>('all');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Filtering Logic
  const filteredMovies = MOCK_MOVIES.filter(m => {
    // 1. Text Search (Name/Original Name)
    const matchesSearch = 
      !debouncedTerm || 
      m.title.includes(debouncedTerm) || 
      m.originalTitle?.toLowerCase().includes(debouncedTerm.toLowerCase());

    // 2. Type Filter
    const matchesType = selectedType === 'all' || m.type === selectedType;

    // 3. Genre Filter
    const matchesGenre = !selectedGenre || m.genres.includes(selectedGenre);

    // 4. Country Filter
    const matchesCountry = !selectedCountry || m.country === selectedCountry;

    // 5. Year Filter
    const matchesYear = !selectedYear || m.year === selectedYear;

    return matchesSearch && matchesType && matchesGenre && matchesCountry && matchesYear;
  });

  const clearFilters = () => {
    setSelectedType('all');
    setSelectedGenre('');
    setSelectedCountry('');
    setSelectedYear('');
    setSearchTerm('');
  };

  const activeFiltersCount = [selectedGenre, selectedCountry, selectedYear].filter(Boolean).length + (selectedType !== 'all' ? 1 : 0);

  return (
    <Layout>
      <div className="min-h-screen bg-dark-bg md:pl-64 pt-6 px-4 pb-24 transition-colors duration-300">
         <div className="flex items-center justify-between mb-6">
             <h1 className="text-2xl font-bold text-content-primary">جستجو پیشرفته</h1>
             {activeFiltersCount > 0 && (
                 <button onClick={clearFilters} className="text-xs text-primary hover:underline">
                     حذف فیلترها
                 </button>
             )}
         </div>
         
         {/* Search Bar & Filter Toggle */}
         <div className="flex space-x-3 space-x-reverse mb-4">
             <div className="relative flex-1">
                 <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-content-secondary" size={20} />
                 <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="نام فیلم، سریال..."
                    className="w-full bg-dark-surface border border-separator rounded-xl py-3.5 pr-12 pl-4 text-content-primary placeholder-content-secondary focus:outline-none focus:border-primary/50 transition-colors shadow-sm"
                 />
             </div>
             <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 rounded-xl border flex items-center justify-center transition-colors ${showFilters || activeFiltersCount > 0 ? 'bg-primary text-white border-primary' : 'bg-dark-surface border-separator text-content-primary'}`}
             >
                <Filter size={20} />
                {activeFiltersCount > 0 && (
                    <span className="bg-white text-primary text-[10px] w-5 h-5 flex items-center justify-center rounded-full mr-2 font-bold">
                        {activeFiltersCount}
                    </span>
                )}
             </button>
         </div>

         {/* Collapsible Filters Panel */}
         <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-[500px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
             <div className="bg-dark-surface rounded-2xl p-4 border border-separator shadow-lg">
                 
                 {/* Content Type Tabs */}
                 <div className="flex bg-dark-bg/50 p-1 rounded-xl mb-4 overflow-x-auto">
                     {[
                         { id: 'all', label: 'همه' },
                         { id: 'movie', label: 'فیلم' },
                         { id: 'series', label: 'سریال' },
                         { id: 'animation', label: 'انیمیشن' }
                     ].map((type) => (
                         <button
                            key={type.id}
                            onClick={() => setSelectedType(type.id as any)}
                            className={`flex-1 min-w-[70px] py-2 rounded-lg text-xs font-bold transition-all ${selectedType === type.id ? 'bg-primary text-white shadow-md' : 'text-content-secondary hover:text-content-primary'}`}
                         >
                             {type.label}
                         </button>
                     ))}
                 </div>

                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                     {/* Genre Select */}
                     <div className="relative">
                         <select 
                            value={selectedGenre}
                            onChange={(e) => setSelectedGenre(e.target.value)}
                            className="w-full appearance-none bg-dark-card border border-separator text-content-primary text-xs rounded-xl px-3 py-3 focus:outline-none focus:border-primary/50"
                         >
                             <option value="">همه ژانرها</option>
                             {MOCK_CATEGORIES.map(cat => (
                                 <option key={cat.id} value={cat.name}>{cat.name}</option>
                             ))}
                         </select>
                         <ChevronDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-content-secondary pointer-events-none" />
                     </div>

                     {/* Country Select */}
                     <div className="relative">
                         <select 
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            className="w-full appearance-none bg-dark-card border border-separator text-content-primary text-xs rounded-xl px-3 py-3 focus:outline-none focus:border-primary/50"
                         >
                             <option value="">همه کشورها</option>
                             {FILTER_COUNTRIES.map(c => (
                                 <option key={c} value={c}>{c}</option>
                             ))}
                         </select>
                         <ChevronDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-content-secondary pointer-events-none" />
                     </div>

                     {/* Year Select */}
                     <div className="relative col-span-2 md:col-span-1">
                         <select 
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="w-full appearance-none bg-dark-card border border-separator text-content-primary text-xs rounded-xl px-3 py-3 focus:outline-none focus:border-primary/50"
                         >
                             <option value="">همه سال‌ها</option>
                             {FILTER_YEARS.map(y => (
                                 <option key={y} value={y}>{y}</option>
                             ))}
                         </select>
                         <ChevronDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-content-secondary pointer-events-none" />
                     </div>
                 </div>
             </div>
         </div>

         {/* Results Header */}
         <div className="flex items-center justify-between mb-4">
             <span className="text-sm text-content-secondary">
                 {debouncedTerm || activeFiltersCount > 0 ? `${filteredMovies.length} نتیجه یافت شد` : 'پیشنهادهای تصادفی'}
             </span>
         </div>

         {/* Movies Grid */}
         <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-5 animate-fadeIn">
             {filteredMovies.length > 0 ? (
                 filteredMovies.map(movie => (
                     <div key={movie.id} className="w-full">
                         <MovieCard movie={movie} />
                     </div>
                 ))
             ) : (
                 <div className="col-span-full flex flex-col items-center justify-center py-20 text-content-secondary opacity-60">
                     <Filter size={48} className="mb-4" />
                     <p>هیچ فیلمی با این مشخصات یافت نشد.</p>
                     <button onClick={clearFilters} className="mt-4 text-primary text-sm font-bold border-b border-primary border-dashed">
                         پاک کردن فیلترها
                     </button>
                 </div>
             )}
         </div>
      </div>
    </Layout>
  );
};

export default Search;