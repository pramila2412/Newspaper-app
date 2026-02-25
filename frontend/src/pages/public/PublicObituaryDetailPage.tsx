import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { obituaryAPI, newsAPI } from '../../api/services';
import BlockRenderer from '../../components/editor/BlockRenderer';
import { HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineEye, HiOutlineChevronRight } from 'react-icons/hi';

const PublicObituaryDetailPage: React.FC = () => {
    const { id } = useParams();
    const [obituary, setObituary] = useState<any>(null);
    const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        setLoading(true);
        obituaryAPI.publicById(id!)
            .then(res => {
                setObituary(res.data);
                // Fetch some recent news as "related posts" (or recent obituaries)
                return newsAPI.publicList({ limit: 4 });
            })
            .then(res => setRelatedPosts(res.data?.news || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return <div className="flex justify-center py-24"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1CA7A6]"></div></div>;
    }

    if (!obituary) {
        return <div className="text-center py-24 text-slate-400 text-lg">Obituary not found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 mb-6 flex-wrap">
                <Link to="/" className="hover:text-[#1CA7A6] transition-colors">Home</Link>
                <HiOutlineChevronRight size={14} />
                <Link to="/obituary" className="hover:text-[#1CA7A6] transition-colors">Obituary</Link>
                <HiOutlineChevronRight size={14} />
                <span className="text-slate-700 dark:text-slate-300 line-clamp-1">{obituary.name}</span>
            </nav>

            <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-slate-700/50 overflow-hidden shadow-sm mb-12">
                {/* Large Image */}
                {obituary.photo ? (
                    <img src={obituary.photo} alt={obituary.name} className="w-full max-h-[500px] object-cover" />
                ) : (
                    <div className="w-full h-64 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <span className="text-4xl text-slate-300 dark:text-slate-600">✝</span>
                    </div>
                )}

                <div className="p-6 sm:p-8">
                    {/* Header Info */}
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-4">{obituary.name}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-8 pb-8 border-b border-slate-200 dark:border-slate-700/50">
                        {obituary.age && <span className="font-medium bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded text-slate-700 dark:text-slate-300">Age {obituary.age}</span>}
                        <span className="flex items-center gap-1"><HiOutlineCalendar size={16} /> {new Date(obituary.deathDate).toLocaleDateString('ml-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span className="flex items-center gap-1"><HiOutlineLocationMarker size={16} /> {obituary.district}</span>
                        <span className="flex items-center gap-1 ml-auto"><HiOutlineEye size={16} /> {obituary.viewCount || 0} views</span>
                    </div>

                    {/* Content Blocks */}
                    {obituary.contentBlocks && obituary.contentBlocks.length > 0 ? (
                        <div className="prose-custom block-content">
                            <BlockRenderer blocks={obituary.contentBlocks} />
                        </div>
                    ) : (
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed min-h-[100px]">
                            With profound grief and sorrow, we inform the sad demise of {obituary.name}, aged {obituary.age}, from {obituary.district}. Please keep the bereaved family in your prayers.
                        </p>
                    )}
                </div>
            </div>

            {/* Related Posts Section */}
            {relatedPosts.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <span className="w-1 h-7 bg-[#1CA7A6] rounded-full"></span> Related News
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {relatedPosts.map((post) => (
                            <Link key={post._id} to={`/article/${post.slug}`} className="group bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-slate-700/50 overflow-hidden hover:shadow-lg dark:hover:shadow-black/20 transition-all">
                                {post.heroImage ? (
                                    <img src={post.heroImage} alt={post.title} className="w-full h-32 object-cover" />
                                ) : (
                                    <div className="w-full h-32 bg-slate-100 dark:bg-slate-800" />
                                )}
                                <div className="p-4">
                                    <h3 className="font-bold text-slate-800 dark:text-white text-sm line-clamp-2 group-hover:text-[#1CA7A6] transition-colors">{post.title}</h3>
                                    <p className="text-xs text-slate-400 mt-2">{new Date(post.publishedAt).toLocaleDateString()}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PublicObituaryDetailPage;
