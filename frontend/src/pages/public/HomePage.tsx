import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { newsAPI, categoriesAPI, discoverAPI, obituaryAPI, classifiedsAPI, videosAPI } from '../../api/services';
import { HiOutlineNewspaper, HiOutlineEye, HiOutlinePlay, HiOutlineClock, HiOutlineArrowRight, HiOutlineFilm, HiOutlineLightningBolt } from 'react-icons/hi';

// Handle broken images gracefully
const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    target.style.display = 'none';
    // Show sibling fallback if present
    const fallback = target.nextElementSibling as HTMLElement;
    if (fallback && fallback.dataset.fallback) {
        fallback.style.display = 'flex';
    }
};

// Wrapper component for images with fallback
const NewsImage: React.FC<{ src?: string; alt: string; className?: string; fallbackIcon?: React.ReactNode; fallbackClass?: string }> = ({
    src, alt, className = '', fallbackIcon, fallbackClass = ''
}) => {
    if (!src) {
        return (
            <div className={`${fallbackClass} flex items-center justify-center`}>
                {fallbackIcon || <HiOutlineNewspaper size={36} className="text-slate-300 dark:text-slate-600" />}
            </div>
        );
    }
    return (
        <>
            <img
                src={src}
                alt={alt}
                className={className}
                loading="lazy"
                onError={handleImgError}
            />
            <div data-fallback="true" className={`${fallbackClass} items-center justify-center`} style={{ display: 'none' }}>
                {fallbackIcon || <HiOutlineNewspaper size={36} className="text-slate-300 dark:text-slate-600" />}
            </div>
        </>
    );
};

const formatDate = (d: string) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTimeAgo = (d: string) => {
    if (!d) return '';
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return formatDate(d);
};

const HomePage: React.FC = () => {
    const [news, setNews] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [featured, setFeatured] = useState<any[]>([]);
    const [popular, setPopular] = useState<any[]>([]);
    const [videos, setVideos] = useState<any[]>([]);
    const [obituaries, setObituary] = useState<any[]>([]);
    const [classifieds, setClassifieds] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [categoryNews, setCategoryNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [catLoading, setCatLoading] = useState(false);
    const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([
            newsAPI.publicList({ limit: 20 }),
            categoriesAPI.list(),
            discoverAPI.featured(),
            discoverAPI.popular('week', 8),
            videosAPI.publicList({ limit: 6 }),
            obituaryAPI.publicList({ limit: 4 }),
            classifiedsAPI.publicList({ limit: 4 }),
        ]).then(([newsRes, catRes, featRes, popRes, vidRes, obRes, clRes]) => {
            const allNews = newsRes.data.news || [];
            setNews(allNews);
            setCategoryNews(allNews);
            setCategories(catRes.data || []);
            setFeatured(featRes.data || []);
            setPopular(popRes.data || []);
            setVideos(vidRes.data.videos || vidRes.data || []);
            setObituary(obRes.data.items || []);
            setClassifieds(clRes.data.classifieds || []);
        }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    // Category filter
    const handleCategoryChange = async (catId: string) => {
        setActiveCategory(catId);
        if (catId === 'all') {
            setCategoryNews(news);
            return;
        }
        setCatLoading(true);
        try {
            const res = await newsAPI.publicByCategory(catId, { limit: 8 });
            setCategoryNews(res.data.news || []);
        } catch { setCategoryNews([]); }
        finally { setCatLoading(false); }
    };

    // Global broken image handler — catches all images in the homepage
    useEffect(() => {
        const container = document.querySelector('.homepage-redesign');
        if (!container) return;

        const handler = (e: Event) => {
            const img = e.target as HTMLImageElement;
            if (img.tagName === 'IMG') {
                // Hide broken image and show a gradient placeholder
                img.style.display = 'none';
                const parent = img.parentElement;
                if (parent && !parent.querySelector('.img-fallback-placeholder')) {
                    const placeholder = document.createElement('div');
                    placeholder.className = 'img-fallback-placeholder w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center absolute inset-0';
                    placeholder.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="text-slate-300 dark:text-slate-600" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V9a2 2 0 012-2h2a2 2 0 012 2v9a2 2 0 01-2 2h-2z" /></svg>';
                    if (parent.style.position !== 'absolute' && parent.style.position !== 'relative') {
                        parent.style.position = 'relative';
                    }
                    parent.appendChild(placeholder);
                }
            }
        };

        container.addEventListener('error', handler, true);
        return () => container.removeEventListener('error', handler, true);
    });

    // Derive hero data
    const heroArticle = news[0];
    const sidebarArticles = news.slice(1, 5);
    const latestMainArticle = news.length > 5 ? news[5] : null;
    const latestSideList = news.slice(6, 10);
    const trendingNews = categoryNews.slice(0, 8);
    const highlightArticles = featured.slice(0, 4);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-slate-200 border-t-[#1CA7A6]"></div>
                    <span className="text-sm text-slate-400">Loading news...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="homepage-redesign">
            {/* ═══════ HERO SECTION ═══════ */}
            <section className="bg-white dark:bg-[#1E293B]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    <div className="flex flex-col lg:flex-row gap-5">
                        {/* Main Hero Article */}
                        {heroArticle && (
                            <Link to={`/article/${heroArticle.slug}`} className="flex-1 group relative overflow-hidden rounded-2xl hero-card-hover">
                                <div className="relative aspect-[16/9] lg:aspect-[4/3] xl:aspect-[16/10]">
                                    {heroArticle.heroImage ? (
                                        <img
                                            src={heroArticle.heroImage}
                                            alt={heroArticle.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-[#0B3C5D] to-[#1CA7A6] flex items-center justify-center">
                                            <HiOutlineNewspaper size={64} className="text-white/30" />
                                        </div>
                                    )}
                                    {/* Overlay gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                                        <div className="flex items-center gap-2 mb-3">
                                            {heroArticle.isBreaking && (
                                                <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 animate-pulse">
                                                    <HiOutlineLightningBolt size={12} /> Breaking
                                                </span>
                                            )}
                                            {heroArticle.categoryId && (
                                                <span className="bg-[#1CA7A6] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                                    {heroArticle.categoryId.name || ''}
                                                </span>
                                            )}
                                        </div>
                                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight mb-2 line-clamp-3 group-hover:text-[#4dd9d8] transition-colors">
                                            {heroArticle.title}
                                        </h1>
                                        {heroArticle.subtitle && (
                                            <p className="text-white/70 text-sm sm:text-base mb-3 line-clamp-2 hidden sm:block">{heroArticle.subtitle}</p>
                                        )}
                                        <div className="flex items-center gap-3 text-white/60 text-xs">
                                            <span className="flex items-center gap-1"><HiOutlineClock size={13} /> {formatTimeAgo(heroArticle.publishedAt)}</span>
                                            <span className="flex items-center gap-1"><HiOutlineEye size={13} /> {heroArticle.viewCount}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* Sidebar — Latest Articles Stack */}
                        <div className="w-full lg:w-[340px] xl:w-[380px] shrink-0 flex flex-col gap-3">
                            <div className="flex items-center justify-between mb-1">
                                <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                    <span className="w-1 h-5 bg-[#1CA7A6] rounded-full"></span> Latest
                                </h2>
                                <Link to="/search?q=" className="text-xs text-[#1CA7A6] hover:underline font-medium">View All →</Link>
                            </div>
                            {sidebarArticles.map((article: any, idx: number) => (
                                <Link key={article._id} to={`/article/${article.slug}`} className="group flex gap-3 bg-slate-50 dark:bg-[#0F172A] rounded-xl p-3 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
                                    {article.heroImage ? (
                                        <img src={article.heroImage} alt="" className="w-20 h-20 rounded-lg object-cover shrink-0 transition-transform duration-500 group-hover:scale-105" />
                                    ) : (
                                        <div className="w-20 h-20 rounded-lg bg-slate-200 dark:bg-slate-700 shrink-0 flex items-center justify-center">
                                            <HiOutlineNewspaper size={20} className="text-slate-400" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        {article.categoryId && (
                                            <span className="text-[10px] font-bold text-[#1CA7A6] uppercase tracking-wider mb-1">{article.categoryId.name || ''}</span>
                                        )}
                                        <h3 className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-[#1CA7A6] transition-colors line-clamp-2 leading-snug">
                                            {article.title}
                                        </h3>
                                        <span className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                                            <HiOutlineClock size={11} /> {formatTimeAgo(article.publishedAt)}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════ CATEGORY TABS + TRENDING NEWS ═══════ */}
            <section className="bg-slate-50 dark:bg-[#0F172A]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                    {/* Section Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="w-1.5 h-7 bg-[#1CA7A6] rounded-full"></span> Trending News
                        </h2>
                        <Link to="/search?q=" className="text-sm text-[#1CA7A6] hover:underline font-semibold flex items-center gap-1">
                            See more <HiOutlineArrowRight size={14} />
                        </Link>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                        <button
                            onClick={() => handleCategoryChange('all')}
                            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeCategory === 'all'
                                ? 'bg-[#0B3C5D] dark:bg-[#1CA7A6] text-white shadow-md'
                                : 'bg-white dark:bg-[#1E293B] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 border border-slate-200 dark:border-slate-700'}`}
                        >
                            All
                        </button>
                        {categories.map((cat: any) => (
                            <button
                                key={cat._id}
                                onClick={() => handleCategoryChange(cat._id)}
                                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeCategory === cat._id
                                    ? 'bg-[#0B3C5D] dark:bg-[#1CA7A6] text-white shadow-md'
                                    : 'bg-white dark:bg-[#1E293B] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 border border-slate-200 dark:border-slate-700'}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Trending Grid */}
                    {catLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-[3px] border-slate-200 border-t-[#1CA7A6]"></div>
                        </div>
                    ) : trendingNews.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {trendingNews.map((article: any) => (
                                <Link key={article._id} to={`/article/${article.slug}`} className="group bg-white dark:bg-[#1E293B] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-black/30 transition-all duration-300 border border-slate-100 dark:border-slate-700/50">
                                    <div className="relative overflow-hidden">
                                        {article.heroImage ? (
                                            <img src={article.heroImage} alt={article.title} className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                                        ) : (
                                            <div className="w-full h-44 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                                                <HiOutlineNewspaper size={36} className="text-slate-300 dark:text-slate-600" />
                                            </div>
                                        )}
                                        {article.categoryId && (
                                            <span className="absolute top-3 left-3 bg-[#1CA7A6] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                                {article.categoryId.name || ''}
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-slate-800 dark:text-white text-sm leading-snug group-hover:text-[#1CA7A6] transition-colors line-clamp-2 mb-2">
                                            {article.title}
                                        </h3>
                                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                                            <span className="flex items-center gap-1"><HiOutlineClock size={12} /> {formatTimeAgo(article.publishedAt)}</span>
                                            <span className="flex items-center gap-1"><HiOutlineEye size={12} /> {article.viewCount}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-400">
                            <HiOutlineNewspaper size={40} className="mx-auto mb-2 opacity-40" />
                            <p className="text-sm">No news found in this category</p>
                        </div>
                    )}
                </div>
            </section>

            {/* ═══════ LATEST NEWS — 2 COLUMN ═══════ */}
            <section className="bg-white dark:bg-[#1E293B]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="w-1.5 h-7 bg-red-500 rounded-full"></span> Latest News
                        </h2>
                        <Link to="/search?q=" className="text-sm text-[#1CA7A6] hover:underline font-semibold flex items-center gap-1">
                            See more <HiOutlineArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Large Featured Card */}
                        {latestMainArticle && (
                            <Link to={`/article/${latestMainArticle.slug}`} className="flex-1 group relative overflow-hidden rounded-2xl hero-card-hover">
                                <div className="relative aspect-[16/9]">
                                    {latestMainArticle.heroImage ? (
                                        <img src={latestMainArticle.heroImage} alt={latestMainArticle.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-[#0B3C5D] to-[#1CA7A6] flex items-center justify-center">
                                            <HiOutlineNewspaper size={48} className="text-white/30" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                                        {latestMainArticle.categoryId && (
                                            <span className="bg-[#1CA7A6] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
                                                {latestMainArticle.categoryId.name || ''}
                                            </span>
                                        )}
                                        <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight mb-2 line-clamp-2 group-hover:text-[#4dd9d8] transition-colors">
                                            {latestMainArticle.title}
                                        </h3>
                                        {latestMainArticle.subtitle && (
                                            <p className="text-white/60 text-sm line-clamp-2 hidden sm:block">{latestMainArticle.subtitle}</p>
                                        )}
                                        <div className="flex items-center gap-3 text-white/50 text-xs mt-2">
                                            <span>{formatDate(latestMainArticle.publishedAt)}</span>
                                            <span className="flex items-center gap-1"><HiOutlineEye size={12} /> {latestMainArticle.viewCount}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* Stacked Article List */}
                        <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0 space-y-1">
                            {latestSideList.map((article: any) => (
                                <Link key={article._id} to={`/article/${article.slug}`} className="group flex gap-4 py-4 border-b border-slate-100 dark:border-slate-700/50 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors px-2 rounded-lg">
                                    {article.heroImage ? (
                                        <img src={article.heroImage} alt="" className="w-24 h-20 rounded-xl object-cover shrink-0 transition-transform duration-500 group-hover:scale-105" />
                                    ) : (
                                        <div className="w-24 h-20 rounded-xl bg-slate-100 dark:bg-slate-700 shrink-0 flex items-center justify-center">
                                            <HiOutlineNewspaper size={20} className="text-slate-400" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        {article.categoryId && (
                                            <span className="text-[10px] font-bold text-[#1CA7A6] uppercase tracking-wider mb-1">{article.categoryId.name || ''}</span>
                                        )}
                                        <h4 className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-[#1CA7A6] transition-colors line-clamp-2 leading-snug">
                                            {article.title}
                                        </h4>
                                        <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1.5">
                                            <span>{formatDate(article.publishedAt)}</span>
                                            <span className="flex items-center gap-1"><HiOutlineEye size={11} /> {article.viewCount}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════ POPULAR VIDEOS ═══════ */}
            {videos.length > 0 && (
                <section className="bg-slate-50 dark:bg-[#0F172A]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="w-1.5 h-7 bg-purple-500 rounded-full"></span> Popular Videos
                            </h2>
                            <Link to="/videos" className="text-sm text-[#1CA7A6] hover:underline font-semibold flex items-center gap-1">
                                See more <HiOutlineArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {videos.slice(0, 6).map((video: any) => {
                                const ytId = (video.youtubeUrl || '').match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^?&]+)/)?.[1] || '';
                                const thumbUrl = ytId ? `https://img.youtube.com/vi/${ytId}/0.jpg` : '';
                                const isPlaying = playingVideoId === video._id;

                                return (
                                    <div key={video._id} className="bg-white dark:bg-[#1E293B] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700/50">
                                        <div className="relative overflow-hidden aspect-video">
                                            {isPlaying ? (
                                                <iframe
                                                    src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                                                    className="w-full h-full"
                                                    allowFullScreen
                                                    allow="autoplay"
                                                />
                                            ) : (
                                                <button
                                                    onClick={() => setPlayingVideoId(video._id)}
                                                    className="w-full h-full relative group cursor-pointer text-left focus:outline-none"
                                                >
                                                    {thumbUrl ? (
                                                        <img src={thumbUrl} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-purple-900 to-purple-600 flex items-center justify-center">
                                                            <HiOutlineFilm size={48} className="text-white/30" />
                                                        </div>
                                                    )}
                                                    {/* Play icon overlay */}
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                                                        <div className="w-14 h-14 rounded-full bg-white/90 dark:bg-white/80 flex items-center justify-center shadow-2xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                                                            <HiOutlinePlay size={24} className="text-[#0B3C5D] ml-0.5" />
                                                        </div>
                                                    </div>
                                                </button>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-slate-800 dark:text-white text-sm leading-snug group-hover:text-[#1CA7A6] transition-colors line-clamp-2 mb-2">
                                                {video.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                                <HiOutlineClock size={12} />
                                                <span>{formatDate(video.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* ═══════ WEEKLY HIGHLIGHTS / FEATURED ═══════ */}
            {highlightArticles.length > 0 && (
                <section className="bg-white dark:bg-[#1E293B]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="w-1.5 h-7 bg-amber-500 rounded-full"></span> Featured Articles
                            </h2>
                            <Link to="/search?q=featured" className="text-sm text-[#1CA7A6] hover:underline font-semibold flex items-center gap-1">
                                See more <HiOutlineArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {highlightArticles.map((article: any) => (
                                <Link key={article._id} to={`/article/${article.slug}`} className="group bg-slate-50 dark:bg-[#0F172A] rounded-2xl overflow-hidden hover:shadow-xl dark:hover:shadow-black/30 transition-all duration-300 border border-slate-100 dark:border-slate-700/50">
                                    <div className="relative overflow-hidden">
                                        {article.heroImage ? (
                                            <img src={article.heroImage} alt={article.title} className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                                        ) : (
                                            <div className="w-full h-44 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                                                <HiOutlineNewspaper size={36} className="text-amber-300 dark:text-slate-600" />
                                            </div>
                                        )}
                                        {article.isFeatured && (
                                            <span className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                                ★ Featured
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        {article.categoryId && (
                                            <span className="text-[10px] font-bold text-[#1CA7A6] uppercase tracking-wider mb-1.5 inline-block">{article.categoryId.name || ''}</span>
                                        )}
                                        <h3 className="font-bold text-slate-800 dark:text-white text-sm leading-snug group-hover:text-[#1CA7A6] transition-colors line-clamp-2 mb-2">
                                            {article.title}
                                        </h3>
                                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                                            <span>{formatDate(article.publishedAt)}</span>
                                            <span className="flex items-center gap-1"><HiOutlineEye size={12} /> {article.viewCount}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ═══════ POPULAR POSTS ═══════ */}
            {popular.length > 0 && (
                <section className="bg-slate-50 dark:bg-[#0F172A]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="w-1.5 h-7 bg-orange-500 rounded-full"></span> Popular This Week
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {popular.slice(0, 4).map((article: any, idx: number) => (
                                <Link key={article._id} to={`/article/${article.slug}`} className="group flex gap-4 bg-white dark:bg-[#1E293B] rounded-2xl p-4 hover:shadow-lg transition-all duration-300 border border-slate-100 dark:border-slate-700/50">
                                    <span className="text-3xl font-black text-slate-200 dark:text-slate-700 shrink-0 w-8">{String(idx + 1).padStart(2, '0')}</span>
                                    <div className="flex-1 min-w-0">
                                        {article.categoryId && (
                                            <span className="text-[10px] font-bold text-[#1CA7A6] uppercase tracking-wider mb-1 inline-block">{article.categoryId.name || ''}</span>
                                        )}
                                        <h4 className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-[#1CA7A6] transition-colors line-clamp-2 leading-snug">
                                            {article.title}
                                        </h4>
                                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1.5">
                                            <span className="flex items-center gap-1"><HiOutlineEye size={11} /> {article.viewCount}</span>
                                            <span>{formatTimeAgo(article.publishedAt)}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ═══════ BUY & SELL ═══════ */}
            {classifieds.length > 0 && (
                <section className="bg-white dark:bg-[#1E293B]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="w-1.5 h-7 bg-emerald-500 rounded-full"></span> Buy & Sell
                            </h2>
                            <Link to="/classifieds" className="text-sm text-[#1CA7A6] hover:underline font-semibold flex items-center gap-1">
                                View All <HiOutlineArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {classifieds.map((c: any) => (
                                <div key={c._id} className="group bg-slate-50 dark:bg-[#0F172A] rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300">
                                    {c.images?.[0] && (
                                        <div className="overflow-hidden">
                                            <img src={c.images[0]} alt={c.title} className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105" />
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <h4 className="font-bold text-slate-800 dark:text-white text-sm line-clamp-2 mb-1">{c.title}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{c.location} • {c.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ═══════ OBITUARY ═══════ */}
            {obituaries.length > 0 && (
                <section className="bg-slate-50 dark:bg-[#0F172A]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="w-1.5 h-7 bg-slate-500 rounded-full"></span> Obituary
                            </h2>
                            <Link to="/obituary" className="text-sm text-[#1CA7A6] hover:underline font-semibold flex items-center gap-1">
                                View All <HiOutlineArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {obituaries.map((o: any) => (
                                <Link key={o._id} to={`/obituary/${o._id}`} className="group bg-white dark:bg-[#1E293B] rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700/50 hover:shadow-lg dark:hover:shadow-black/20 transition-all duration-300 flex flex-col">
                                    {o.photo ? (
                                        <div className="overflow-hidden">
                                            <img src={o.photo} alt={o.name} className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = `/images/obituary-${(obituaries.indexOf(o) % 4) + 1}.png`; }} />
                                        </div>
                                    ) : (
                                        <div className="overflow-hidden">
                                            <img src={`/images/obituary-${(obituaries.indexOf(o) % 4) + 1}.png`} alt={o.name} className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                                        </div>
                                    )}
                                    <div className="p-4 flex flex-col flex-1">
                                        <h4 className="font-bold text-slate-800 dark:text-white text-sm group-hover:text-[#1CA7A6] transition-colors line-clamp-2 mb-1">{o.name}</h4>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">{o.age && `Age ${o.age}`} {o.district && `• ${o.district}`}</p>
                                        <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
                                            <span>{new Date(o.deathDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            <span className="flex items-center gap-1"><HiOutlineEye size={11} /> {o.viewCount || 0}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default HomePage;
