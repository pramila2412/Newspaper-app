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
            <h1 className="text-3xl font-bold text-dark mb-2">Obituary</h1>
            <p className="text-gray-500 mb-8">In loving memory</p>

            {loading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal"></div></div>
            ) : items.length === 0 ? (
                <div className="text-center py-12 text-gray-400">No records</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item: any) => (
                        <div key={item._id} className="bg-white rounded-xl border border-gray-100 p-5 text-center hover:shadow-lg transition-shadow">
                            {item.photo ? (
                                <img src={item.photo} alt={item.name} className="w-20 h-20 rounded-full mx-auto mb-3 object-cover" />
                            ) : (
                                <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-gray-100 flex items-center justify-center text-2xl text-gray-400">✝</div>
                            )}
                            <h3 className="font-bold text-dark text-lg">{item.name}</h3>
                            <p className="text-sm text-gray-500">Age: {item.age}</p>
                            <p className="text-sm text-gray-500">{item.district}</p>
                            <p className="text-xs text-gray-400 mt-2">{new Date(item.deathDate).toLocaleDateString('ml-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PublicObituaryPage;
