import React, { useEffect, useState } from 'react';
import { adsAPI, mediaAPI } from '../../api/services';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';

const AdsPage: React.FC = () => {
    const [ads, setAds] = useState<any[]>([]);
    const [adsets, setAdsets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdForm, setShowAdForm] = useState(false);
    const [showAdsetForm, setShowAdsetForm] = useState(false);
    const [adsetForm, setAdsetForm] = useState({ name: '', placement: '' });
    const [adForm, setAdForm] = useState({ adsetId: '', mediaId: '', link: '', priority: 'standard', startDate: '', endDate: '' });

    const load = async () => {
        try {
            const [adsRes, adsetsRes] = await Promise.all([adsAPI.list(), adsAPI.listAdsets()]);
            setAds(adsRes.data.items || []);
            setAdsets(adsetsRes.data || []);
        } catch { } finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const handleCreateAdset = async (e: React.FormEvent) => {
        e.preventDefault();
        try { await adsAPI.createAdset(adsetForm); toast.success('Adset created'); setShowAdsetForm(false); setAdsetForm({ name: '', placement: '' }); load(); }
        catch (err: any) { toast.error(err.response?.data?.message || 'Error'); }
    };

    const handleCreateAd = async (e: React.FormEvent) => {
        e.preventDefault();
        try { await adsAPI.create(adForm); toast.success('Ad created'); setShowAdForm(false); setAdForm({ adsetId: '', mediaId: '', link: '', priority: 'standard', startDate: '', endDate: '' }); load(); }
        catch (err: any) { toast.error(err.response?.data?.message || 'Error'); }
    };

    const handleDeleteAd = async (id: string) => { if (!window.confirm('Delete ad?')) return; try { await adsAPI.delete(id); toast.success('Deleted'); load(); } catch { toast.error('Failed'); } };
    const handleDeleteAdset = async (id: string) => { if (!window.confirm('Delete adset?')) return; try { await adsAPI.deleteAdset(id); toast.success('Deleted'); load(); } catch { toast.error('Failed'); } };

    return (
        <div>
            <h1 className="text-2xl font-bold text-dark mb-6">Ads Management</h1>

            {/* Adsets */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Ad Sets</h2>
                    <button onClick={() => setShowAdsetForm(!showAdsetForm)} className="bg-teal text-white px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1"><HiOutlinePlus size={16} /> Add Adset</button>
                </div>
                {showAdsetForm && (
                    <form onSubmit={handleCreateAdset} className="bg-white rounded-xl shadow-sm border p-4 mb-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input value={adsetForm.name} onChange={e => setAdsetForm({ ...adsetForm, name: e.target.value })} placeholder="Adset name" className="px-3 py-2 border rounded-lg text-sm" required />
                            <input value={adsetForm.placement} onChange={e => setAdsetForm({ ...adsetForm, placement: e.target.value })} placeholder="Placement (e.g. homepage_sidebar)" className="px-3 py-2 border rounded-lg text-sm" required />
                        </div>
                        <button type="submit" className="bg-teal text-white px-4 py-2 rounded-lg text-sm mt-3">Create</button>
                    </form>
                )}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50"><tr className="text-left text-gray-500"><th className="px-4 py-3">Name</th><th className="px-4 py-3">Placement</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
                        <tbody className="divide-y">
                            {adsets.map((a: any) => (
                                <tr key={a._id}><td className="px-4 py-3 font-medium">{a.name}</td><td className="px-4 py-3 text-gray-500">{a.placement}</td><td className="px-4 py-3 text-right"><button onClick={() => handleDeleteAdset(a._id)} className="p-2 text-gray-400 hover:text-red-500"><HiOutlineTrash size={16} /></button></td></tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Ads */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Ads</h2>
                <button onClick={() => setShowAdForm(!showAdForm)} className="bg-teal text-white px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1"><HiOutlinePlus size={16} /> Add Ad</button>
            </div>
            {showAdForm && (
                <form onSubmit={handleCreateAd} className="bg-white rounded-xl shadow-sm border p-4 mb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <select value={adForm.adsetId} onChange={e => setAdForm({ ...adForm, adsetId: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" required>
                            <option value="">Select Adset</option>
                            {adsets.map((a: any) => <option key={a._id} value={a._id}>{a.name}</option>)}
                        </select>
                        <input value={adForm.mediaId} onChange={e => setAdForm({ ...adForm, mediaId: e.target.value })} placeholder="Media ID (from library)" className="px-3 py-2 border rounded-lg text-sm" required />
                        <input value={adForm.link} onChange={e => setAdForm({ ...adForm, link: e.target.value })} placeholder="Click URL" className="px-3 py-2 border rounded-lg text-sm" required />
                        <select value={adForm.priority} onChange={e => setAdForm({ ...adForm, priority: e.target.value })} className="px-3 py-2 border rounded-lg text-sm"><option value="standard">Standard</option><option value="premium">Premium</option></select>
                        <input type="date" value={adForm.startDate} onChange={e => setAdForm({ ...adForm, startDate: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" required />
                        <input type="date" value={adForm.endDate} onChange={e => setAdForm({ ...adForm, endDate: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" required />
                    </div>
                    <button type="submit" className="bg-teal text-white px-4 py-2 rounded-lg text-sm mt-3">Create</button>
                </form>
            )}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {loading ? <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal mx-auto"></div></div> : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50"><tr className="text-left text-gray-500"><th className="px-4 py-3">Adset</th><th className="px-4 py-3">Priority</th><th className="px-4 py-3 hidden sm:table-cell">Status</th><th className="px-4 py-3 hidden md:table-cell">Clicks</th><th className="px-4 py-3 hidden md:table-cell">Impressions</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
                            <tbody className="divide-y">
                                {ads.map((ad: any) => (
                                    <tr key={ad._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">{ad.adsetId?.name || '-'}</td>
                                        <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${ad.priority === 'premium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{ad.priority}</span></td>
                                        <td className="px-4 py-3 hidden sm:table-cell"><span className={`px-2 py-1 rounded-full text-xs font-medium ${ad.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{ad.status}</span></td>
                                        <td className="px-4 py-3 hidden md:table-cell">{ad.clicks}</td>
                                        <td className="px-4 py-3 hidden md:table-cell">{ad.impressions}</td>
                                        <td className="px-4 py-3 text-right"><button onClick={() => handleDeleteAd(ad._id)} className="p-2 text-gray-400 hover:text-red-500"><HiOutlineTrash size={16} /></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdsPage;
