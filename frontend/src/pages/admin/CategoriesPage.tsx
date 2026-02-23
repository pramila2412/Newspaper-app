import React, { useEffect, useState } from 'react';
import { categoriesAPI } from '../../api/services';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';

const CategoriesPage: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState({ name: '', order: 0 });

    const load = async () => {
        try { const { data } = await categoriesAPI.list(); setCategories(data); } catch { } finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editId) {
                await categoriesAPI.update(editId, form);
                toast.success('Category updated');
            } else {
                await categoriesAPI.create(form);
                toast.success('Category created');
            }
            setForm({ name: '', order: 0 }); setEditId(null); setShowForm(false); load();
        } catch (err: any) { toast.error(err.response?.data?.message || 'Error'); }
    };

    const handleEdit = (cat: any) => { setEditId(cat._id); setForm({ name: cat.name, order: cat.order }); setShowForm(true); };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete category?')) return;
        try { await categoriesAPI.delete(id); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-dark">Categories</h1>
                <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ name: '', order: 0 }); }} className="bg-teal text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                    <HiOutlinePlus size={18} /> Add
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Category name" className="px-3 py-2 border rounded-lg text-sm" required />
                        <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) })} placeholder="Order" className="px-3 py-2 border rounded-lg text-sm" />
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button type="submit" className="bg-teal text-white px-4 py-2 rounded-lg text-sm font-semibold">{editId ? 'Update' : 'Create'}</button>
                        <button type="button" onClick={() => setShowForm(false)} className="bg-gray-100 px-4 py-2 rounded-lg text-sm">Cancel</button>
                    </div>
                </form>
            )}

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {loading ? <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal mx-auto"></div></div> : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50"><tr className="text-left text-gray-500"><th className="px-4 py-3">Name</th><th className="px-4 py-3">Slug</th><th className="px-4 py-3">Order</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
                        <tbody className="divide-y">
                            {categories.map(cat => (
                                <tr key={cat._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">{cat.name}</td>
                                    <td className="px-4 py-3 text-gray-500">{cat.slug}</td>
                                    <td className="px-4 py-3 text-gray-500">{cat.order}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button onClick={() => handleEdit(cat)} className="p-2 text-gray-400 hover:text-teal"><HiOutlinePencil size={16} /></button>
                                        <button onClick={() => handleDelete(cat._id)} className="p-2 text-gray-400 hover:text-red-500"><HiOutlineTrash size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default CategoriesPage;
