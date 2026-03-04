import React, { useEffect, useState } from 'react';
import { videosAPI } from '../../api/services';
import { HiOutlinePlay, HiOutlineClock, HiOutlineFilm } from 'react-icons/hi';

const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^?&]+)/);
    return match ? match[1] : '';
};

const formatDate = (d: string) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const VideosPage: React.FC = () => {
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [playingId, setPlayingId] = useState<string | null>(null);

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
                    {videos.map((v: any) => {
                        const ytId = getYouTubeId(v.youtubeUrl || '');
                        const thumbUrl = ytId ? `https://img.youtube.com/vi/${ytId}/0.jpg` : '';
                        const isPlaying = playingId === v._id;

                        return (
                            <div key={v._id} className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-slate-700/50 overflow-hidden hover:shadow-lg dark:hover:shadow-black/20 transition-shadow">
                                <div className="aspect-video relative">
                                    {isPlaying ? (
                                        <iframe
                                            src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                                            className="w-full h-full"
                                            allowFullScreen
                                            allow="autoplay"
                                        />
                                    ) : (
                                        <button
                                            onClick={() => setPlayingId(v._id)}
                                            className="w-full h-full relative group cursor-pointer"
                                        >
                                            {thumbUrl ? (
                                                <img src={thumbUrl} alt={v.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-purple-900 to-purple-600 flex items-center justify-center">
                                                    <HiOutlineFilm size={48} className="text-white/30" />
                                                </div>
                                            )}
                                            {/* Play button overlay */}
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors">
                                                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-2xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                                                    <HiOutlinePlay size={28} className="text-[#0B3C5D] ml-1" />
                                                </div>
                                            </div>
                                        </button>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-slate-800 dark:text-white mb-1">{v.title}</h3>
                                    {v.description && <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">{v.description}</p>}
                                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                        <HiOutlineClock size={12} />
                                        <span>{formatDate(v.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default VideosPage;
