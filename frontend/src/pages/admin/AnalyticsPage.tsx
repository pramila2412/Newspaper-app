import React, { useEffect, useState } from 'react';
import { analyticsAPI } from '../../api/services';

const AnalyticsPage: React.FC = () => {
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        analyticsAPI.articles({ limit: 50 }).then(({ data }) => setArticles(data.articles)).catch(() => { }).finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold text-dark mb-6">Analytics</h1>
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {loading ? <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal mx-auto"></div></div> : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50"><tr className="text-left text-gray-500"><th className="px-4 py-3">#</th><th className="px-4 py-3">Title</th><th className="px-4 py-3 hidden sm:table-cell">Category</th><th className="px-4 py-3 text-right">Views</th></tr></thead>
                            <tbody className="divide-y">
                                {articles.map((a: any, idx: number) => (
                                    <tr key={a._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                                        <td className="px-4 py-3 font-medium">{a.title}</td>
                                        <td className="px-4 py-3 hidden sm:table-cell text-gray-500">{a.categoryId?.name || '-'}</td>
                                        <td className="px-4 py-3 text-right font-semibold text-teal">{a.viewCount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyticsPage;
