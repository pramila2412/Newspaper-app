import React, { useEffect, useState, useRef } from 'react';
import { mediaAPI } from '../../api/services';
import toast from 'react-hot-toast';
import { HiOutlineUpload, HiOutlineTrash } from 'react-icons/hi';

const MediaPage: React.FC = () => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [altText, setAltText] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);

    const load = async () => { try { const { data } = await mediaAPI.list(); setItems(data.items); } catch { } finally { setLoading(false); } };
    useEffect(() => { load(); }, []);

    const handleUpload = async () => {
        const file = fileRef.current?.files?.[0];
        if (!file) { toast.error('Select a file'); return; }
        setUploading(true);
        try {
            await mediaAPI.upload(file, altText);
            toast.success('Uploaded!');
            setAltText('');
            if (fileRef.current) fileRef.current.value = '';
            load();
        } catch (err: any) { toast.error(err.response?.data?.message || 'Upload failed'); }
        finally { setUploading(false); }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete media?')) return;
        try { await mediaAPI.delete(id); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-dark mb-6">Media Library</h1>

            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Image File</label>
                        <input ref={fileRef} type="file" accept="image/*" className="w-full text-sm" />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Alt Text (Malayalam)</label>
                        <input value={altText} onChange={e => setAltText(e.target.value)} placeholder="ചിത്രത്തിന്റെ വിവരണം" className="w-full px-3 py-2 border rounded-lg text-sm" />
                    </div>
                    <button onClick={handleUpload} disabled={uploading} className="bg-teal text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 disabled:opacity-50 whitespace-nowrap">
                        <HiOutlineUpload size={18} /> {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
            </div>

            {loading ? <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal"></div></div> : items.length === 0 ? <div className="text-center py-12 text-gray-400">No media uploaded yet</div> : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {items.map((item: any) => (
                        <div key={item._id} className="group relative bg-white rounded-xl shadow-sm border overflow-hidden">
                            <img src={item.thumbnailUrl || item.originalUrl} alt={item.altText} className="w-full h-32 object-cover" loading="lazy" />
                            <div className="p-2">
                                <p className="text-xs text-gray-500 truncate">{item.fileName}</p>
                                <p className="text-xs text-gray-400 truncate">{item.altText || 'No alt text'}</p>
                            </div>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleDelete(item._id)} className="bg-red-500 text-white p-1.5 rounded-lg shadow"><HiOutlineTrash size={14} /></button>
                            </div>
                            <button onClick={() => { navigator.clipboard.writeText(item.mediumUrl || item.originalUrl); toast.success('URL copied!'); }} className="absolute bottom-8 right-2 opacity-0 group-hover:opacity-100 bg-primary text-white text-xs px-2 py-1 rounded shadow transition-opacity">
                                Copy URL
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MediaPage;
