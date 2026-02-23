import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { classifiedsAPI } from '../../api/services';
import { HiOutlinePlus, HiOutlineTrash, HiOutlinePencil, HiOutlineX } from 'react-icons/hi';

const categories = ['real-estate', 'rent-lease', 'construction', 'outfits', 'other'];
const statusOptions = ['ACTIVE', 'SOLD', 'EXPIRED', 'DRAFT'];

const ClassifiedsAdminPage: React.FC = () => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState({ title: '', description: '', category: 'other', contactPhone: '', contactName: '', location: '', price: '', status: 'ACTIVE' });

    const load = () => {
        setLoading(true);
        classifiedsAPI.list().then(res => setItems(res.data.classifieds || [])).catch(() => { }).finally(() => setLoading(false));
    };
    useEffect(load, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editing) {
                await classifiedsAPI.update(editing._id, form);
                toast.success('Updated');
            } else {
                await classifiedsAPI.create(form);
                toast.success('Created');
            }
            setShowForm(false); setEditing(null); load();
        } catch { toast.error('Error'); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete?')) return;
        try { await classifiedsAPI.delete(id); toast.success('Deleted'); load(); } catch { toast.error('Error'); }
    };

    const startEdit = (item: any) => {
        setEditing(item);
        setForm({ title: item.title || '', description: item.description || '', category: item.category || 'other', contactPhone: item.contactPhone || '', contactName: item.contactName || '', location: item.location || '', price: item.price || '', status: item.status || 'ACTIVE' });
        setShowForm(true);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Classifieds (Buy & Sell)</h1>
                <button onClick={() => { setEditing(null); setForm({ title: '', description: '', category: 'other', contactPhone: '', contactName: '', location: '', price: '', status: 'ACTIVE' }); setShowForm(true); }} className="bg-teal text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-teal-600">
                    <HiOutlinePlus size={18} /> New Listing
                </button>
            </div>
            {showForm && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <div className="flex justify-between mb-4"><h2 className="font-bold">{editing ? 'Edit' : 'New'} Listing</h2><button onClick={() => setShowForm(false)}><HiOutlineX size={20} /></button></div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="px-3 py-2 border rounded-lg" />
                        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="px-3 py-2 border rounded-lg">
                            {categories.map(c => <option key={c} value={c}>{c.replace('-', ' ')}</option>)}
                        </select>
                        <input placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="px-3 py-2 border rounded-lg" />
                        <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="px-3 py-2 border rounded-lg" />
                        <input placeholder="Contact Name" value={form.contactName} onChange={e => setForm({ ...form, contactName: e.target.value })} className="px-3 py-2 border rounded-lg" />
                        <input placeholder="Contact Phone" value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} className="px-3 py-2 border rounded-lg" />
                        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="px-3 py-2 border rounded-lg">
                            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="px-3 py-2 border rounded-lg col-span-full" rows={3} />
                        <button type="submit" className="bg-teal text-white px-6 py-2 rounded-lg font-semibold col-span-full sm:col-span-1">{editing ? 'Update' : 'Create'}</button>
                    </form>
                </div>
            )}
            {loading ? <p className="text-gray-400 text-center py-8">Loading...</p> : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left text-gray-500"><tr><th className="px-4 py-3">Title</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr></thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item._id} className="border-t"><td className="px-4 py-3 font-medium">{item.title}</td><td className="px-4 py-3 text-gray-500">{item.category}</td><td className="px-4 py-3">{item.price}</td><td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded ${item.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{item.status}</span></td><td className="px-4 py-3 flex gap-2"><button onClick={() => startEdit(item)} className="text-blue-500 hover:text-blue-700"><HiOutlinePencil size={16} /></button><button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-700"><HiOutlineTrash size={16} /></button></td></tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ClassifiedsAdminPage;
