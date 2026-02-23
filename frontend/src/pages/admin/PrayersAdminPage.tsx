import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { prayersAPI } from '../../api/services';
import { HiOutlineCheck, HiOutlineTrash } from 'react-icons/hi';

const PrayersAdminPage: React.FC = () => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const load = () => {
        setLoading(true);
        prayersAPI.list().then(res => setItems(res.data.prayers || [])).catch(() => { }).finally(() => setLoading(false));
    };
    useEffect(load, []);

    const handleApprove = async (id: string) => {
        try { await prayersAPI.approve(id); toast.success('Approved'); load(); } catch { toast.error('Error'); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete?')) return;
        try { await prayersAPI.delete(id); toast.success('Deleted'); load(); } catch { toast.error('Error'); }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Prayer Requests</h1>
            {loading ? <p className="text-gray-400 text-center py-8">Loading...</p> : items.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No prayer requests</p>
            ) : (
                <div className="space-y-3">
                    {items.map(p => (
                        <div key={p._id} className={`bg-white rounded-xl border p-4 ${p.isApproved ? 'border-green-200' : 'border-yellow-200'}`}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${p.type === 'praise' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{p.type}</span>
                                        {p.isApproved ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Approved</span> : <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Pending</span>}
                                    </div>
                                    <h3 className="font-semibold">{p.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{p.content}</p>
                                    <p className="text-xs text-gray-400 mt-2">By {p.submittedBy || 'Anonymous'} • {new Date(p.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    {!p.isApproved && <button onClick={() => handleApprove(p._id)} className="text-green-500 hover:text-green-700"><HiOutlineCheck size={20} /></button>}
                                    <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:text-red-700"><HiOutlineTrash size={20} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PrayersAdminPage;
