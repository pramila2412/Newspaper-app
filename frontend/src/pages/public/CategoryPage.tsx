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
                const cat = catRes.data.find((c: any) => c._id === categoryId);
                setCategory(cat);
            } catch { } finally { setLoading(false); }
        };
        load();
    }, [categoryId, page]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-dark mb-2">{category?.name || 'Category'}</h1>
            <p className="text-gray-500 mb-8">All published articles in this category</p>

            {loading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal"></div></div>
            ) : news.length === 0 ? (
                <div className="text-center py-12 text-gray-400">No articles in this category</div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {news.map((article: any) => (
                            <Link key={article._id} to={`/article/${article.slug}`} className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                                {article.heroImage ? (
                                    <img src={article.heroImage} alt={article.title} className="w-full h-48 object-cover" loading="lazy" />
                                ) : (
                                    <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-teal-100 flex items-center justify-center">
                                        <HiOutlineNewspaper size={48} className="text-primary-300" />
                                    </div>
                                )}
                                <div className="p-4">
                                    <span className="text-xs text-gray-400">{new Date(article.publishedAt).toLocaleDateString('ml-IN')}</span>
                                    <h3 className="font-bold text-dark group-hover:text-teal transition-colors line-clamp-2 mt-1">{article.title}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-lg border text-sm disabled:opacity-50">Prev</button>
                            <span className="px-4 py-2 text-sm text-gray-500">Page {page} of {totalPages}</span>
                            <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages} className="px-4 py-2 rounded-lg border text-sm disabled:opacity-50">Next</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CategoryPage;
