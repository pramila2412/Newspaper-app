import React, { useEffect, useState } from 'react';
import { prayersAPI } from '../../api/services';
import toast from 'react-hot-toast';

const PrayersPage: React.FC = () => {
    const [prayers, setPrayers] = useState<any[]>([]);
    const [tab, setTab] = useState('');
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', content: '', submittedBy: '', type: 'prayer' });

    useEffect(() => {
        const params: any = { limit: 30 };
        if (tab) params.type = tab;
        prayersAPI.publicList(params)
            .then(res => setPrayers(res.data.prayers || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [tab]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await prayersAPI.submit(form);
            toast.success('Your request has been submitted for review');
            setShowForm(false);
            setForm({ title: '', content: '', submittedBy: '', type: 'prayer' });
        } catch { toast.error('Failed to submit'); }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Praise & Prayers</h1>
                <button onClick={() => setShowForm(!showForm)} className="bg-[#1CA7A6] hover:bg-[#159c9b] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    {showForm ? 'Close' : 'Submit Request'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-slate-700/50 p-6 mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required
                            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0F172A] text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[#1CA7A6]" />
                        <input type="text" placeholder="Your Name (optional)" value={form.submittedBy} onChange={e => setForm({ ...form, submittedBy: e.target.value })}
                            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0F172A] text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[#1CA7A6]" />
                    </div>
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0F172A] text-slate-800 dark:text-slate-200 mb-4 outline-none">
                        <option value="prayer">Prayer Request</option>
                        <option value="praise">Praise Report</option>
                    </select>
                    <textarea placeholder="Your message..." value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required rows={4}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0F172A] text-slate-800 dark:text-slate-200 mb-4 outline-none resize-none" />
                    <button type="submit" className="bg-[#1CA7A6] hover:bg-[#159c9b] text-white px-6 py-2 rounded-lg font-semibold transition-colors">Submit</button>
                </form>
            )}

            <div className="flex gap-2 mb-6">
                {[{ key: '', label: 'All' }, { key: 'prayer', label: 'Prayers' }, { key: 'praise', label: 'Praise' }].map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${tab === t.key
                            ? 'bg-[#1CA7A6] text-white'
                            : 'bg-white dark:bg-[#1E293B] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50'}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1CA7A6]"></div></div>
            ) : prayers.length === 0 ? (
                <p className="text-center text-slate-500 dark:text-slate-400 py-12">No prayer requests yet</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {prayers.map((p: any) => (
                        <div key={p._id} className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-slate-700/50 p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`text-xs font-medium px-2 py-0.5 rounded ${p.type === 'praise' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                    {p.type === 'praise' ? '🙌 Praise' : '🙏 Prayer'}
                                </span>
                            </div>
                            <h3 className="font-bold text-slate-800 dark:text-white mb-1">{p.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{p.content}</p>
                            <p className="text-xs text-slate-400 mt-3">— {p.submittedBy || 'Anonymous'} • {new Date(p.createdAt).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PrayersPage;
