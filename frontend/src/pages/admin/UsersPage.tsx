import React, { useEffect, useState } from 'react';
import { usersAPI } from '../../api/services';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineCheck, HiOutlineBan, HiOutlineTrash } from 'react-icons/hi';

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ email: '', name: '' });

    const load = async () => { try { const { data } = await usersAPI.list(); setUsers(data.users); } catch { } finally { setLoading(false); } };
    useEffect(() => { load(); }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try { await usersAPI.createEditor(form); toast.success('Editor created'); setShowForm(false); setForm({ email: '', name: '' }); load(); }
        catch (err: any) { toast.error(err.response?.data?.message || 'Error'); }
    };

    const handleActivate = async (id: string) => { try { await usersAPI.activate(id); toast.success('Activated'); load(); } catch { toast.error('Failed'); } };
    const handleDeactivate = async (id: string) => { try { await usersAPI.deactivate(id); toast.success('Deactivated'); load(); } catch { toast.error('Failed'); } };
    const handleDelete = async (id: string) => { if (!window.confirm('Delete user?')) return; try { await usersAPI.delete(id); toast.success('Deleted'); load(); } catch { toast.error('Failed'); } };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-dark">User Management</h1>
                <button onClick={() => setShowForm(!showForm)} className="bg-teal text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"><HiOutlinePlus size={18} /> Create Editor</button>
            </div>

            {showForm && (
                <form onSubmit={handleCreate} className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" className="px-3 py-2 border rounded-lg text-sm" required />
                        <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" className="px-3 py-2 border rounded-lg text-sm" required />
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button type="submit" className="bg-teal text-white px-4 py-2 rounded-lg text-sm font-semibold">Create</button>
                        <button type="button" onClick={() => setShowForm(false)} className="bg-gray-100 px-4 py-2 rounded-lg text-sm">Cancel</button>
                    </div>
                </form>
            )}

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {loading ? <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal mx-auto"></div></div> : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50"><tr className="text-left text-gray-500"><th className="px-4 py-3">Name</th><th className="px-4 py-3 hidden sm:table-cell">Email</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
                            <tbody className="divide-y">
                                {users.map((u: any) => (
                                    <tr key={u._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">{u.name}</td>
                                        <td className="px-4 py-3 hidden sm:table-cell text-gray-500">{u.email}</td>
                                        <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{u.role}</span></td>
                                        <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${u.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : u.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{u.status}</span></td>
                                        <td className="px-4 py-3 text-right">
                                            {u.role === 'EDITOR' && (
                                                <div className="flex items-center justify-end gap-1">
                                                    {u.status === 'PENDING' && <button onClick={() => handleActivate(u._id)} className="p-2 text-green-500 hover:text-green-700" title="Activate"><HiOutlineCheck size={16} /></button>}
                                                    {u.status === 'ACTIVE' && <button onClick={() => handleDeactivate(u._id)} className="p-2 text-yellow-500 hover:text-yellow-700" title="Deactivate"><HiOutlineBan size={16} /></button>}
                                                    <button onClick={() => handleDelete(u._id)} className="p-2 text-gray-400 hover:text-red-500"><HiOutlineTrash size={16} /></button>
                                                </div>
                                            )}
                                        </td>
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

export default UsersPage;
