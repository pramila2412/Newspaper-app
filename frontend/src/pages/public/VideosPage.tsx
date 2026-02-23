import React, { useEffect, useState } from 'react';
import { videosAPI } from '../../api/services';

const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^?&]+)/);
    return match ? match[1] : '';
};

const VideosPage: React.FC = () => {
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        videosAPI.publicList({ limit: 20 })
            .then(res => setVideos(res.data.videos || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">Videos</h1>
            {loading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1CA7A6]"></div></div>
            ) : videos.length === 0 ? (
                <p className="text-center text-slate-500 dark:text-slate-400 py-12">No videos yet</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((v: any) => (
                        <div key={v._id} className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-slate-700/50 overflow-hidden hover:shadow-lg dark:hover:shadow-black/20 transition-shadow">
                            <div className="aspect-video">
                                <iframe
                                    src={`https://www.youtube.com/embed/${getYouTubeId(v.youtubeUrl)}`}
                                    className="w-full h-full"
                                    allowFullScreen
                                    loading="lazy"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-slate-800 dark:text-white mb-1">{v.title}</h3>
                                {v.description && <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{v.description}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VideosPage;
