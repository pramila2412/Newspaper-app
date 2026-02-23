import React, { useEffect, useState } from 'react';
import { obituaryAPI } from '../../api/services';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';

const ObituaryPage: React.FC = () => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', age: '', district: '', deathDate: '', photo: '', status: 'ACTIVE' });

    const load = async () => { try { const { data } = await obituaryAPI.list(); setItems(data.items); } catch { } finally { setLoading(false); } };
    useEffect(() => { load(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await obituaryAPI.create({ ...form, age: parseInt(form.age), contentBlocks: [] });
            toast.success('Created'); setShowForm(false); setForm({ name: '', age: '', district: '', deathDate: '', photo: '', status: 'ACTIVE' }); load();
        } catch (err: any) { toast.error(err.response?.data?.message || 'Error'); }
    };

    const handleDelete = async (id: string) => { if (!window.confirm('Delete?')) return; try { await obituaryAPI.delete(id); toast.success('Deleted'); load(); } catch { toast.error('Failed'); } };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-dark">Obituary</h1>
                <button onClick={() => setShowForm(!showForm)} className="bg-teal text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"><HiOutlinePlus size={18} /> Add</button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" className="px-3 py-2 border rounded-lg text-sm" required />
                        <input type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} placeholder="Age" className="px-3 py-2 border rounded-lg text-sm" required />
                        <input value={form.district} onChange={e => setForm({ ...form, district: e.target.value })} placeholder="District" className="px-3 py-2 border rounded-lg text-sm" required />
                        <input type="date" value={form.deathDate} onChange={e => setForm({ ...form, deathDate: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" required />
                        <input value={form.photo} onChange={e => setForm({ ...form, photo: e.target.value })} placeholder="Photo URL" className="px-3 py-2 border rounded-lg text-sm" />
                        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="px-3 py-2 border rounded-lg text-sm">
                            <option value="ACTIVE">Active</option><option value="DRAFT">Draft</option><option value="ARCHIVED">Archived</option>
                        </select>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button type="submit" className="bg-teal text-white px-4 py-2 rounded-lg text-sm font-semibold">Create</button>
                        <button type="button" onClick={() => setShowForm(false)} className="bg-gray-100 px-4 py-2 rounded-lg text-sm">Cancel</button>
                    </div>
                </form>
            )}

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {loading ? <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal mx-auto"></div></div> : items.length === 0 ? <div className="p-8 text-center text-gray-400">No records</div> : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50"><tr className="text-left text-gray-500"><th className="px-4 py-3">Name</th><th className="px-4 py-3">Age</th><th className="px-4 py-3 hidden sm:table-cell">District</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
                            <tbody className="divide-y">
                                {items.map((item: any) => (
                                    <tr key={item._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">{item.name}</td>
                                        <td className="px-4 py-3">{item.age}</td>
                                        <td className="px-4 py-3 hidden sm:table-cell">{item.district}</td>
                                        <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{item.status}</span></td>
                                        <td className="px-4 py-3 text-right"><button onClick={() => handleDelete(item._id)} className="p-2 text-gray-400 hover:text-red-500"><HiOutlineTrash size={16} /></button></td>
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

export default ObituaryPage;
