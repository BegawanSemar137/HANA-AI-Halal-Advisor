import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { useSearch } from '../contexts/SearchContext';
import { useDebounce } from '../hooks/useDebounce';
import { useProducts } from '../hooks/useProducts';
import PriceRangeSlider from './PriceRangeSlider';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (scope: 'products' | 'certificates') => void;
}

const productCategories = ['all', 'food', 'cosmetics', 'fashion', 'pharmaceuticals'];
const certificateStatuses = ['all', 'certified', 'expired', 'notCertified'];

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose, onSearch }) => {
    const { t } = useTranslations();
    const { products: allProducts } = useProducts();
    const { 
        setGlobalQuery, 
        setGlobalFilters, 
        searchScope, 
        setSearchScope,
        triggerGlobalSearch
    } = useSearch();

    const [localQuery, setLocalQuery] = useState('');
    const [localFilters, setLocalFilters] = useState<{
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        certStatus?: string;
    }>({});

    const debouncedQuery = useDebounce(localQuery, 300);

    const { minPrice, maxPrice } = useMemo(() => {
        if (allProducts.length === 0) return { minPrice: 0, maxPrice: 100 };
        const prices = allProducts.map(p => p.price);
        return {
            minPrice: Math.floor(Math.min(...prices)),
            maxPrice: Math.ceil(Math.max(...prices)),
        };
    }, [allProducts]);
    
    // Set initial price range for the slider
    useEffect(() => {
        setLocalFilters(prev => ({ ...prev, minPrice, maxPrice }));
    }, [minPrice, maxPrice]);

    const handleSearch = () => {
        setGlobalQuery(debouncedQuery);
        setGlobalFilters(localFilters);
        triggerGlobalSearch();
        
        const effectiveScope = searchScope === 'all' 
            ? (debouncedQuery.toLowerCase().includes('cert') ? 'certificates' : 'products')
            : searchScope;

        onSearch(effectiveScope as 'products' | 'certificates');
        onClose();
    };

    const handleClear = () => {
        setLocalQuery('');
        setLocalFilters({ minPrice, maxPrice });
        setSearchScope('all');
    }
    
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex justify-center p-4 pt-[15vh]"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-fit animate-fadein"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 border-b">
                    <div className="relative">
                        <input
                            type="text"
                            value={localQuery}
                            onChange={(e) => setLocalQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder={t('header.searchPlaceholder')}
                            className="w-full py-3 pl-12 pr-4 text-gray-800 text-lg bg-gray-100 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-halal-green"
                            autoFocus
                        />
                         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left Column: Scopes */}
                        <div className="md:border-r pr-6">
                             <h3 className="font-semibold text-gray-700 mb-3">{t('search.searchIn')}</h3>
                             <div className="space-y-2">
                                {(['all', 'products', 'certificates'] as const).map(scope => (
                                     <button 
                                        key={scope}
                                        onClick={() => setSearchScope(scope)}
                                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${searchScope === scope ? 'bg-halal-green text-white font-bold' : 'hover:bg-gray-100'}`}
                                    >
                                        {t(`search.scope${scope.charAt(0).toUpperCase() + scope.slice(1)}`)}
                                    </button>
                                ))}
                             </div>
                        </div>

                        {/* Right Column: Filters */}
                        <div className="md:col-span-2">
                             <h3 className="font-semibold text-gray-700 mb-3">{t('search.filters')}</h3>
                             <div className="space-y-4">
                                { (searchScope === 'all' || searchScope === 'products') && (
                                    <div className="animate-fadein">
                                        <label htmlFor="category-filter" className="text-sm font-medium text-gray-600">{t('search.category')}</label>
                                        <select 
                                            id="category-filter"
                                            value={localFilters.category || 'all'}
                                            onChange={(e) => setLocalFilters(prev => ({...prev, category: e.target.value}))}
                                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-halal-green"
                                        >
                                            {productCategories.map(cat => (
                                                <option key={cat} value={cat}>{t(`marketplace.categories.${cat}`)}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                { (searchScope === 'all' || searchScope === 'products') && (
                                     <div className="animate-fadein">
                                        <label className="text-sm font-medium text-gray-600">{t('marketplace.priceRange')}</label>
                                        <PriceRangeSlider
                                            min={minPrice}
                                            max={maxPrice}
                                            value={{min: localFilters.minPrice ?? minPrice, max: localFilters.maxPrice ?? maxPrice}}
                                            onChange={(range) => setLocalFilters(prev => ({...prev, minPrice: range.min, maxPrice: range.max }))}
                                        />
                                     </div>
                                )}
                                { (searchScope === 'all' || searchScope === 'certificates') && (
                                     <div className="animate-fadein">
                                        <label htmlFor="status-filter" className="text-sm font-medium text-gray-600">{t('search.certificationStatus')}</label>
                                        <select 
                                            id="status-filter"
                                            value={localFilters.certStatus || 'all'}
                                            onChange={(e) => setLocalFilters(prev => ({...prev, certStatus: e.target.value}))}
                                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-halal-green"
                                        >
                                            {certificateStatuses.map(status => (
                                                 <option key={status} value={status}>
                                                    {status === 'all' ? t('home.news.categories.all') : t(`certCheck.status${status.charAt(0).toUpperCase() + status.slice(1)}`)}
                                                 </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                             </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-b-2xl flex justify-between items-center">
                     <button onClick={handleClear} className="text-sm font-semibold text-gray-600 hover:text-halal-green">
                        {t('search.clearAll')}
                     </button>
                     <button 
                        onClick={handleSearch}
                        className="px-8 py-3 bg-halal-green text-white font-bold rounded-full hover:bg-opacity-90 transition-colors"
                     >
                        {t('search.searchButton')}
                     </button>
                </div>
            </div>
        </div>
    )
}

export default GlobalSearch;