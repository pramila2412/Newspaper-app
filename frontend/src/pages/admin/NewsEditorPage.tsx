import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { newsAPI, categoriesAPI } from '../../api/services';
import BlockEditor from '../../components/editor/BlockEditor';
import BlockRenderer from '../../components/editor/BlockRenderer';
import toast from 'react-hot-toast';

const NewsEditorPage: React.FC = () => {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();

    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [previewMode, setPreviewMode] = useState<'edit' | 'mobile' | 'desktop'>('edit');

    const [form, setForm] = useState({
        title: '', subtitle: '', categoryId: '', heroImage: '', status: 'DRAFT', scheduledAt: '',
        seoTitle: '', seoDescription: '', seoKeywords: '',
        contentBlocks: [] as any[],
    });

    useEffect(() => {
        categoriesAPI.list().then(({ data }) => setCategories(data)).catch(() => { });
        if (isEdit) {
            setLoading(true);
            newsAPI.getById(id).then(({ data }) => {
                setForm({
                    title: data.title, subtitle: data.subtitle || '', categoryId: data.categoryId?._id || data.categoryId || '',
                    heroImage: data.heroImage || '', status: data.status,
                    scheduledAt: data.scheduledAt ? new Date(data.scheduledAt).toISOString().slice(0, 16) : '',
                    seoTitle: data.seoTitle || '', seoDescription: data.seoDescription || '', seoKeywords: (data.seoKeywords || []).join(', '),
                    contentBlocks: data.contentBlocks || [],
                });
            }).catch(() => toast.error('Failed to load article')).finally(() => setLoading(false));
        }
    }, [id]);

    const handleSubmit = async (status?: string) => {
        if (!form.title.trim()) { toast.error('Title is required'); return; }
        if (!form.categoryId) { toast.error('Category is required'); return; }

        setSaving(true);
        try {
            const payload = {
                ...form,
                status: status || form.status,
                seoKeywords: form.seoKeywords ? form.seoKeywords.split(',').map(s => s.trim()) : [],
                scheduledAt: form.scheduledAt || undefined,
            };

            if (isEdit) {
                await newsAPI.update(id, payload);
                toast.success('Article updated');
            } else {
                await newsAPI.create(payload);
                toast.success('Article created');
            }
            navigate('/admin/news');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal"></div></div>;
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-dark">{isEdit ? 'Edit Article' : 'Create Article'}</h1>
                <div className="flex gap-2 flex-wrap">
                    <button onClick={() => setPreviewMode('edit')} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${previewMode === 'edit' ? 'bg-teal text-white' : 'bg-gray-100'}`}>Edit</button>
                    <button onClick={() => setPreviewMode('mobile')} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${previewMode === 'mobile' ? 'bg-teal text-white' : 'bg-gray-100'}`}>Mobile Preview</button>
                    <button onClick={() => setPreviewMode('desktop')} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${previewMode === 'desktop' ? 'bg-teal text-white' : 'bg-gray-100'}`}>Desktop Preview</button>
                </div>
            </div>

            {previewMode !== 'edit' ? (
                <div className={`bg-white rounded-xl shadow-sm border p-6 mx-auto ${previewMode === 'mobile' ? 'max-w-sm' : 'max-w-4xl'}`}>
                    {form.heroImage && <img src={form.heroImage} alt="" className="w-full rounded-lg mb-4 max-h-64 object-cover" />}
                    <h1 className="text-2xl sm:text-3xl font-bold text-dark mb-2">{form.title || 'Untitled'}</h1>
                    {form.subtitle && <p className="text-gray-500 mb-4">{form.subtitle}</p>}
                    <BlockRenderer blocks={form.contentBlocks} />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
                            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Article Title..." className="w-full text-2xl font-bold outline-none border-b pb-3 mb-4" />
                            <input value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} placeholder="Subtitle (optional)..." className="w-full text-base outline-none text-gray-500 mb-4" />
                            <input value={form.heroImage} onChange={e => setForm({ ...form, heroImage: e.target.value })} placeholder="Hero image URL (from media library)..." className="w-full px-3 py-2 border rounded-lg text-sm mb-4" />
                        </div>

                        <BlockEditor blocks={form.contentBlocks} onChange={blocks => setForm({ ...form, contentBlocks: blocks })} />
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
                            <h3 className="font-semibold text-dark mb-4">Publish</h3>
                            <div className="space-y-3">
                                <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
                                    <option value="">Select Category</option>
                                    {categories.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
                                    <option value="DRAFT">Draft</option>
                                    <option value="PUBLISHED">Published</option>
                                    <option value="SCHEDULED">Scheduled</option>
                                </select>
                                {form.status === 'SCHEDULED' && (
                                    <input type="datetime-local" value={form.scheduledAt} onChange={e => setForm({ ...form, scheduledAt: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
                                )}
                                <div className="flex gap-2">
                                    <button onClick={() => handleSubmit('DRAFT')} disabled={saving} className="flex-1 bg-gray-100 text-dark py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50">Save Draft</button>
                                    <button onClick={() => handleSubmit('PUBLISHED')} disabled={saving} className="flex-1 bg-teal text-white py-2 rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors disabled:opacity-50">Publish</button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
                            <h3 className="font-semibold text-dark mb-4">SEO</h3>
                            <div className="space-y-3">
                                <input value={form.seoTitle} onChange={e => setForm({ ...form, seoTitle: e.target.value })} placeholder="SEO Title" className="w-full px-3 py-2 border rounded-lg text-sm" />
                                <textarea value={form.seoDescription} onChange={e => setForm({ ...form, seoDescription: e.target.value })} placeholder="SEO Description" className="w-full px-3 py-2 border rounded-lg text-sm min-h-[80px] resize-y" />
                                <input value={form.seoKeywords} onChange={e => setForm({ ...form, seoKeywords: e.target.value })} placeholder="Keywords (comma-separated)" className="w-full px-3 py-2 border rounded-lg text-sm" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewsEditorPage;
