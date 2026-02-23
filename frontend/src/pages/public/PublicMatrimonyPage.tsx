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
            <h1 className="text-3xl font-bold text-dark mb-2">Christian Matrimony</h1>
            <p className="text-gray-500 mb-8">Find your soulmate from the Christian community in Kerala</p>

            {loading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal"></div></div>
            ) : items.length === 0 ? (
                <div className="text-center py-12 text-gray-400">No active listings</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item: any) => (
                        <div key={item._id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-100 to-primary-100 flex items-center justify-center text-xl font-bold text-primary">{item.name.charAt(0)}</div>
                                <div>
                                    <h3 className="font-bold text-dark">{item.name}</h3>
                                    <p className="text-sm text-gray-500">{item.age} years • {item.gender}</p>
                                </div>
                            </div>
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600"><HiOutlineAcademicCap size={16} className="text-teal" />{item.education}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-600"><HiOutlineLocationMarker size={16} className="text-teal" />{item.district}</div>
                                <p className="text-xs text-gray-400">{item.denomination}</p>
                            </div>
                            {item.description && <p className="text-sm text-gray-500 mb-4 line-clamp-3">{item.description}</p>}
                            <a href={`tel:${item.contactNumber}`} className="flex items-center justify-center gap-2 bg-teal hover:bg-teal-600 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors w-full">
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
