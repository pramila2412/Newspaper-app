import React, { useEffect, useState } from 'react';
import { analyticsAPI } from '../../api/services';
import { HiOutlineNewspaper, HiOutlineHeart, HiOutlineBookOpen, HiOutlinePhotograph, HiOutlineCursorClick, HiOutlineEye } from 'react-icons/hi';

const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await analyticsAPI.dashboard();
                setStats(data);
            } catch (error) {
                console.error('Failed to load dashboard', error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal"></div></div>;
    }

    const cards = [
        { label: 'Published News', value: stats?.news?.published || 0, icon: HiOutlineNewspaper, color: 'bg-teal' },
        { label: 'Draft News', value: stats?.news?.draft || 0, icon: HiOutlineNewspaper, color: 'bg-yellow-500' },
        { label: 'Active Matrimony', value: stats?.matrimony?.active || 0, icon: HiOutlineHeart, color: 'bg-pink-500' },
        { label: 'Obituaries', value: stats?.obituaries?.total || 0, icon: HiOutlineBookOpen, color: 'bg-purple-500' },
        { label: 'Media Files', value: stats?.media || 0, icon: HiOutlinePhotograph, color: 'bg-blue-500' },
        { label: 'Ad Clicks', value: stats?.ads?.totalClicks || 0, icon: HiOutlineCursorClick, color: 'bg-green-500' },
        { label: 'Ad Impressions', value: stats?.ads?.totalImpressions || 0, icon: HiOutlineEye, color: 'bg-indigo-500' },
        { label: 'Total Users', value: stats?.users || 0, icon: HiOutlineEye, color: 'bg-orange-500' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-dark mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {cards.map((card, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">{card.label}</p>
                                <p className="text-3xl font-bold text-dark mt-1">{card.value}</p>
                            </div>
                            <div className={`${card.color} p-3 rounded-lg`}>
                                <card.icon size={24} className="text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Top Articles */}
            {stats?.topArticles && stats.topArticles.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-dark mb-4">Top Articles</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-500 border-b">
                                    <th className="pb-3 font-medium">#</th>
                                    <th className="pb-3 font-medium">Title</th>
                                    <th className="pb-3 font-medium text-right">Views</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.topArticles.map((article: any, idx: number) => (
                                    <tr key={article._id} className="border-b last:border-0">
                                        <td className="py-3 text-gray-400">{idx + 1}</td>
                                        <td className="py-3 font-medium text-dark">{article.title}</td>
                                        <td className="py-3 text-right text-teal font-semibold">{article.viewCount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
