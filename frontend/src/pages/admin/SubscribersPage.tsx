import React, { useEffect, useState } from 'react';
import { subscribersAPI } from '../../api/services';

const SubscribersPage: React.FC = () => {
    const [subs, setSubs] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        subscribersAPI.list().then(res => { setSubs(res.data.subscribers || []); setTotal(res.data.total || 0); }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Newsletter Subscribers</h1>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{total} active</span>
            </div>
            {loading ? <p className="text-gray-400 text-center py-8">Loading...</p> : subs.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No subscribers yet</p>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left text-gray-500"><tr><th className="px-4 py-3">#</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Subscribed</th></tr></thead>
                        <tbody>
                            {subs.map((s, i) => (
                                <tr key={s._id} className="border-t"><td className="px-4 py-3 text-gray-400">{i + 1}</td><td className="px-4 py-3 font-medium">{s.email}</td><td className="px-4 py-3 text-gray-500">{new Date(s.subscribedAt).toLocaleDateString()}</td></tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SubscribersPage;
