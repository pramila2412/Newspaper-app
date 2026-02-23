import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { discoverAPI } from '../../api/services';
import { HiOutlineEye, HiOutlineNewspaper } from 'react-icons/hi';

const SearchPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!query) { setLoading(false); return; }
        setLoading(true);
        discoverAPI.search(query)
            .then(res => {
                setResults(res.data.results || []);
                setTotal(res.data.total || 0);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [query]);

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Search results for: <span className="text-primary dark:text-dpurple-400">"{query}"</span>
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{total} result{total !== 1 ? 's' : ''} found</p>

            {loading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-dpurple"></div></div>
            ) : results.length === 0 ? (
                <div className="text-center py-12">
                    <HiOutlineNewspaper size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No results found. Try a different search term.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {results.map((r: any) => (
                        <Link key={r._id} to={`/article/${r.slug}`} className="flex gap-4 bg-white dark:bg-card-dark rounded-xl border border-cream-300 dark:border-dpurple-900/40 p-4 card-hover group">
                            {r.heroImage ? (
                                <img src={r.heroImage} alt="" className="w-24 h-24 rounded-lg object-cover shrink-0" />
                            ) : (
                                <div className="w-24 h-24 rounded-lg bg-cream-200 dark:bg-dpurple-900 shrink-0 flex items-center justify-center">
                                    <HiOutlineNewspaper size={24} className="text-gray-400" />
                                </div>
                            )}
                            <div className="min-w-0">
                                <h3 className="font-bold text-gray-800 dark:text-white group-hover:text-primary dark:group-hover:text-dpurple-300 line-clamp-2">{r.title}</h3>
                                {r.subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{r.subtitle}</p>}
                                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                                    {r.categoryId && <span className="bg-primary/10 dark:bg-dpurple/20 text-primary dark:text-dpurple-300 px-2 py-0.5 rounded">{r.categoryId.name}</span>}
                                    <span>{r.publishedAt && new Date(r.publishedAt).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1"><HiOutlineEye size={12} />{r.viewCount}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchPage;
