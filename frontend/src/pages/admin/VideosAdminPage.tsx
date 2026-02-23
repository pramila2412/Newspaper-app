import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { videosAPI } from '../../api/services';
import { HiOutlinePlus, HiOutlineTrash, HiOutlinePencil, HiOutlineX } from 'react-icons/hi';

const VideosAdminPage: React.FC = () => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState({ title: '', youtubeUrl: '', description: '', status: 'DRAFT' });

    const load = () => {
        setLoading(true);
        videosAPI.list().then(res => setItems(res.data.videos || [])).catch(() => { }).finally(() => setLoading(false));
    };
    useEffect(load, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = { ...form, publishedAt: form.status === 'PUBLISHED' ? new Date() : null };
            if (editing) { await videosAPI.update(editing._id, data); toast.success('Updated'); }
            else { await videosAPI.create(data); toast.success('Created'); }
            setShowForm(false); setEditing(null); load();
        } catch { toast.error('Error'); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete?')) return;
        try { await videosAPI.delete(id); toast.success('Deleted'); load(); } catch { toast.error('Error'); }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Videos</h1>
                <button onClick={() => { setEditing(null); setForm({ title: '', youtubeUrl: '', description: '', status: 'DRAFT' }); setShowForm(true); }} className="bg-teal text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-teal-600">
                    <HiOutlinePlus size={18} /> Add Video
                </button>
            </div>
            {showForm && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <div className="flex justify-between mb-4"><h2 className="font-bold">{editing ? 'Edit' : 'New'} Video</h2><button onClick={() => setShowForm(false)}><HiOutlineX size={20} /></button></div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="w-full px-3 py-2 border rounded-lg" />
                        <input placeholder="YouTube URL" value={form.youtubeUrl} onChange={e => setForm({ ...form, youtubeUrl: e.target.value })} required className="w-full px-3 py-2 border rounded-lg" />
                        <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} />
                        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                            <option value="DRAFT">Draft</option>
                            <option value="PUBLISHED">Published</option>
                        </select>
                        <button type="submit" className="bg-teal text-white px-6 py-2 rounded-lg font-semibold">{editing ? 'Update' : 'Create'}</button>
                    </form>
                </div>
            )}
            {loading ? <p className="text-gray-400 text-center py-8">Loading...</p> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map(v => (
                        <div key={v._id} className="bg-white rounded-xl border border-gray-200 p-4">
                            <h3 className="font-semibold mb-1">{v.title}</h3>
                            <p className="text-xs text-gray-400 mb-2 truncate">{v.youtubeUrl}</p>
                            <span className={`text-xs px-2 py-0.5 rounded ${v.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{v.status}</span>
                            <div className="flex gap-2 mt-3">
                                <button onClick={() => { setEditing(v); setForm({ title: v.title, youtubeUrl: v.youtubeUrl, description: v.description || '', status: v.status }); setShowForm(true); }} className="text-blue-500 text-sm">Edit</button>
                                <button onClick={() => handleDelete(v._id)} className="text-red-500 text-sm">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VideosAdminPage;
