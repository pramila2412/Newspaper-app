import React, { useEffect, useState } from 'react';
import { matrimonyAPI } from '../../api/services';
import { HiOutlineLocationMarker, HiOutlineAcademicCap, HiOutlinePhone } from 'react-icons/hi';

const PublicMatrimonyPage: React.FC = () => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        matrimonyAPI.publicList({ limit: 20 }).then(({ data }) => setItems(data.items)).catch(() => { }).finally(() => setLoading(false));
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Christian Matrimony</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Find your soulmate from the Christian community in Kerala</p>

            {loading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1CA7A6]"></div></div>
            ) : items.length === 0 ? (
                <div className="text-center py-12 text-gray-400 dark:text-gray-500">No active listings</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item: any) => (
                        <div key={item._id} className="bg-white dark:bg-[#1a1a2e] rounded-xl border border-gray-100 dark:border-gray-700/50 p-5 hover:shadow-lg dark:hover:shadow-black/30 transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1CA7A6]/20 to-blue-100 dark:from-[#1CA7A6]/30 dark:to-purple-900/30 flex items-center justify-center text-xl font-bold text-[#0B3C5D] dark:text-[#1CA7A6]">{item.name.charAt(0)}</div>
                                <div>
                                    <h3 className="font-bold text-gray-800 dark:text-white">{item.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.age} years • {item.gender}</p>
                                </div>
                            </div>
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><HiOutlineAcademicCap size={16} className="text-[#1CA7A6]" />{item.education}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><HiOutlineLocationMarker size={16} className="text-[#1CA7A6]" />{item.district}</div>
                                <p className="text-xs text-gray-400 dark:text-gray-500">{item.denomination}</p>
                            </div>
                            {item.description && <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-3">{item.description}</p>}
                            <a href={`tel:${item.contactNumber}`} className="flex items-center justify-center gap-2 bg-[#1CA7A6] hover:bg-[#159c9b] text-white py-2.5 rounded-lg font-semibold text-sm transition-colors w-full">
                                <HiOutlinePhone size={16} /> Contact
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PublicMatrimonyPage;
