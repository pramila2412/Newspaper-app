import React, { useEffect, useState } from 'react';
import { newsAPI, categoriesAPI } from '../../api/services';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi';

const NewsListPage: React.FC = () => {
    const [news, setNews] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const navigate = useNavigate();

    const loadNews = async () => {
        setLoading(true);
        try {
            const params: any = { page, limit: 20 };
            if (statusFilter) params.status = statusFilter;
            const { data } = await newsAPI.list(params);
            setNews(data.news);
            setTotal(data.total);
        } catch (error) {
            toast.error('Failed to load news');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadNews(); }, [page, statusFilter]);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this article?')) return;
        try {
            await newsAPI.delete(id);
            toast.success('Article deleted');
            loadNews();
        } catch { toast.error('Failed to delete'); }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            PUBLISHED: 'bg-green-100 text-green-700',
            DRAFT: 'bg-yellow-100 text-yellow-700',
            SCHEDULED: 'bg-blue-100 text-blue-700',
            ARCHIVED: 'bg-gray-100 text-gray-700',
        };
        return `inline-block px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100'}`;
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-dark">News Management</h1>
                <button onClick={() => navigate('/admin/news/create')} className="bg-teal hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
                    <HiOutlinePlus size={18} /> Create Article
                </button>
            </div>

            <div className="mb-4">
                <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="px-3 py-2 border rounded-lg text-sm">
                    <option value="">All Status</option>
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="ARCHIVED">Archived</option>
                </select>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal"></div></div>
                ) : news.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">No articles found</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr className="text-left text-gray-500">
                                    <th className="px-4 py-3 font-medium">Title</th>
                                    <th className="px-4 py-3 font-medium hidden md:table-cell">Category</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 font-medium hidden sm:table-cell">Views</th>
                                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {news.map((item: any) => (
                                    <tr key={item._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-dark truncate max-w-xs">{item.title}</p>
                                            <p className="text-xs text-gray-400 mt-1">{new Date(item.createdAt).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell text-gray-600">{item.categoryId?.name || '-'}</td>
                                        <td className="px-4 py-3"><span className={getStatusBadge(item.status)}>{item.status}</span></td>
                                        <td className="px-4 py-3 hidden sm:table-cell text-gray-600">{item.viewCount}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => navigate(`/admin/news/edit/${item._id}`)} className="p-2 text-gray-400 hover:text-teal transition-colors"><HiOutlinePencil size={16} /></button>
                                                <button onClick={() => handleDelete(item._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><HiOutlineTrash size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {total > 20 && (
                <div className="flex justify-center gap-2 mt-4">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded border text-sm disabled:opacity-50">Prev</button>
                    <span className="px-3 py-1 text-sm text-gray-500">Page {page}</span>
                    <button onClick={() => setPage(p => p + 1)} disabled={news.length < 20} className="px-3 py-1 rounded border text-sm disabled:opacity-50">Next</button>
                </div>
            )}
        </div>
    );
};

export default NewsListPage;
