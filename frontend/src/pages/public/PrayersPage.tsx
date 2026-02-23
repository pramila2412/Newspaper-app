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
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Praise & Prayers</h1>
                <button onClick={() => setShowForm(!showForm)} className="bg-primary dark:bg-dpurple text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-600 dark:hover:bg-dpurple-600 transition-colors">
                    {showForm ? 'Close' : 'Submit Request'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white dark:bg-card-dark rounded-xl border border-cream-300 dark:border-dpurple-900/40 p-6 mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required
                            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-dpurple-800 bg-cream-50 dark:bg-surface-dark text-gray-800 dark:text-gray-200 outline-none" />
                        <input type="text" placeholder="Your Name (optional)" value={form.submittedBy} onChange={e => setForm({ ...form, submittedBy: e.target.value })}
                            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-dpurple-800 bg-cream-50 dark:bg-surface-dark text-gray-800 dark:text-gray-200 outline-none" />
                    </div>
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-dpurple-800 bg-cream-50 dark:bg-surface-dark text-gray-800 dark:text-gray-200 mb-4 outline-none">
                        <option value="prayer">Prayer Request</option>
                        <option value="praise">Praise Report</option>
                    </select>
                    <textarea placeholder="Your message..." value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required rows={4}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-dpurple-800 bg-cream-50 dark:bg-surface-dark text-gray-800 dark:text-gray-200 mb-4 outline-none resize-none" />
                    <button type="submit" className="bg-primary dark:bg-dpurple text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-600 dark:hover:bg-dpurple-600 transition-colors">Submit</button>
                </form>
            )}

            <div className="flex gap-2 mb-6">
                {[{ key: '', label: 'All' }, { key: 'prayer', label: 'Prayers' }, { key: 'praise', label: 'Praise' }].map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${tab === t.key
                            ? 'bg-primary dark:bg-dpurple text-white'
                            : 'bg-white dark:bg-card-dark text-gray-600 dark:text-gray-400 border border-cream-300 dark:border-dpurple-900/40'}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-dpurple"></div></div>
            ) : prayers.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-12">No prayer requests yet</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {prayers.map((p: any) => (
                        <div key={p._id} className="bg-white dark:bg-card-dark rounded-xl border border-cream-300 dark:border-dpurple-900/40 p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`text-xs font-medium px-2 py-0.5 rounded ${p.type === 'praise' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                    {p.type === 'praise' ? '🙌 Praise' : '🙏 Prayer'}
                                </span>
                            </div>
                            <h3 className="font-bold text-gray-800 dark:text-white mb-1">{p.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{p.content}</p>
                            <p className="text-xs text-gray-400 mt-3">— {p.submittedBy || 'Anonymous'} • {new Date(p.createdAt).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PrayersPage;
