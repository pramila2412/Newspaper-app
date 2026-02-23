import React, { useEffect, useState } from 'react';
import { classifiedsAPI } from '../../api/services';
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineEye } from 'react-icons/hi';

const tabs = [
    { key: '', label: 'All' },
    { key: 'real-estate', label: 'Real Estate' },
    { key: 'rent-lease', label: 'Rent & Lease' },
    { key: 'construction', label: 'Construction' },
    { key: 'outfits', label: 'Outfits' },
];

const ClassifiedsPage: React.FC = () => {
    const [items, setItems] = useState<any[]>([]);
    const [tab, setTab] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const params: any = { limit: 20 };
        if (tab) params.category = tab;
        classifiedsAPI.publicList(params)
            .then(res => setItems(res.data.classifieds || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [tab]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Buy & Sell</h1>
            <div className="flex gap-2 mb-6 flex-wrap">
                {tabs.map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${tab === t.key
                            ? 'bg-primary dark:bg-dpurple text-white'
                            : 'bg-white dark:bg-card-dark text-gray-600 dark:text-gray-400 border border-cream-300 dark:border-dpurple-900/40 hover:bg-cream-100 dark:hover:bg-dpurple-900/30'}`}>
                        {t.label}
                    </button>
                ))}
            </div>
            {loading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-dpurple"></div></div>
            ) : items.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-12">No listings found</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {items.map((item: any) => (
                        <div key={item._id} className="bg-white dark:bg-card-dark rounded-xl border border-cream-300 dark:border-dpurple-900/40 overflow-hidden card-hover">
                            {item.images?.[0] && <img src={item.images[0]} alt={item.title} className="w-full h-48 object-cover" />}
                            <div className="p-4">
                                <h3 className="font-bold text-gray-800 dark:text-white mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{item.description}</p>
                                {item.price && <p className="text-lg font-bold text-primary dark:text-dpurple-400 mb-2">{item.price}</p>}
                                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                    {item.location && <span className="flex items-center gap-1"><HiOutlineLocationMarker size={14} />{item.location}</span>}
                                    {item.contactPhone && <span className="flex items-center gap-1"><HiOutlinePhone size={14} />{item.contactPhone}</span>}
                                    <span className="flex items-center gap-1"><HiOutlineEye size={14} />{item.viewCount}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClassifiedsPage;
