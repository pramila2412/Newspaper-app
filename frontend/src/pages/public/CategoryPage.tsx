import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { newsAPI, categoriesAPI } from '../../api/services';
import { HiOutlineNewspaper } from 'react-icons/hi';

const CategoryPage: React.FC = () => {
    const { categoryId } = useParams();
    const [news, setNews] = useState<any[]>([]);
    const [category, setCategory] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [newsRes, catRes] = await Promise.all([
                    newsAPI.publicByCategory(categoryId!, { page, limit: 12 }),
                    categoriesAPI.list(),
                ]);
                setNews(newsRes.data.news);
                setTotalPages(newsRes.data.totalPages);
                const cat = catRes.data.find((c: any) => c._id === categoryId || c.slug === categoryId);
                setCategory(cat);
            } catch { } finally { setLoading(false); }
        };
        load();
    }, [categoryId, page]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{category?.name || 'Category'}</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">All published articles in this category</p>

            {loading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1CA7A6]"></div></div>
            ) : news.length === 0 ? (
                <div className="text-center py-12 text-gray-400 dark:text-gray-500">No articles in this category</div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {news.map((article: any) => (
                            <Link key={article._id} to={`/article/${article.slug}`} className="group bg-white dark:bg-[#1a1a2e] rounded-xl border border-gray-100 dark:border-gray-700/50 overflow-hidden hover:shadow-lg dark:hover:shadow-black/30 transition-shadow">
                                {article.heroImage ? (
                                    <img src={article.heroImage} alt={article.title} className="w-full h-48 object-cover" loading="lazy" />
                                ) : (
                                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#1CA7A6]/10 dark:to-purple-900/20 flex items-center justify-center">
                                        <HiOutlineNewspaper size={48} className="text-gray-300 dark:text-gray-600" />
                                    </div>
                                )}
                                <div className="p-4">
                                    {article.categoryId && (
                                        <span className="text-[10px] font-semibold uppercase text-[#1CA7A6] dark:text-[#1CA7A6]">{article.categoryId.name}</span>
                                    )}
                                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">{new Date(article.publishedAt).toLocaleDateString()}</span>
                                    <h3 className="font-bold text-gray-800 dark:text-white group-hover:text-[#1CA7A6] transition-colors line-clamp-2 mt-1">{article.title}</h3>
                                    {article.subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{article.subtitle}</p>}
                                </div>
                            </Link>
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Prev</button>
                            <span className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">Page {page} of {totalPages}</span>
                            <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Next</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CategoryPage;
