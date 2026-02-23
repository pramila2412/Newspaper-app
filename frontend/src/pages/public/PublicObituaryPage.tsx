import React, { useEffect, useState } from 'react';
import { obituaryAPI } from '../../api/services';

const PublicObituaryPage: React.FC = () => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        obituaryAPI.publicList({ limit: 20 }).then(({ data }) => setItems(data.items)).catch(() => { }).finally(() => setLoading(false));
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Obituary</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">In loving memory</p>

            {loading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1CA7A6]"></div></div>
            ) : items.length === 0 ? (
                <div className="text-center py-12 text-gray-400 dark:text-gray-500">No records</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item: any) => (
                        <div key={item._id} className="bg-white dark:bg-[#1a1a2e] rounded-xl border border-gray-100 dark:border-gray-700/50 p-5 text-center hover:shadow-lg dark:hover:shadow-black/30 transition-shadow">
                            {item.photo ? (
                                <img src={item.photo} alt={item.name} className="w-20 h-20 rounded-full mx-auto mb-3 object-cover" />
                            ) : (
                                <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-gray-100 dark:bg-gray-700/40 flex items-center justify-center text-2xl text-gray-400 dark:text-gray-500">✝</div>
                            )}
                            <h3 className="font-bold text-gray-800 dark:text-white text-lg">{item.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Age: {item.age}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.district}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{new Date(item.deathDate).toLocaleDateString('ml-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PublicObituaryPage;
