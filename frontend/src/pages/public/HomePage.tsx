import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { newsAPI, categoriesAPI, discoverAPI, obituaryAPI, classifiedsAPI } from '../../api/services';
import { HiOutlineBookOpen, HiOutlineHeart, HiOutlineNewspaper, HiOutlineShieldCheck, HiOutlineUserGroup, HiOutlineGlobe, HiOutlineEye, HiOutlineFilm, HiOutlinePencilAlt, HiOutlineChatAlt2 } from 'react-icons/hi';

const categoryIcons: Record<string, React.ElementType> = {
    news: HiOutlineNewspaper,
    spiritual: HiOutlineBookOpen,
    testimony: HiOutlineChatAlt2,
    youth: HiOutlineUserGroup,
    family: HiOutlineHeart,
    article: HiOutlinePencilAlt,
    editorial: HiOutlineFilm,
    interview: HiOutlineChatAlt2,
};

const HomePage: React.FC = () => {
    const [news, setNews] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [featured, setFeatured] = useState<any[]>([]);
    const [popular, setPopular] = useState<any[]>([]);
    const [popularPeriod, setPopularPeriod] = useState<string>('week');
    const [tags, setTags] = useState<any[]>([]);
    const [obituaries, setObituary] = useState<any[]>([]);
    const [classifieds, setClassifieds] = useState<any[]>([]);
    const [subCat, setSubCat] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            newsAPI.publicList({ limit: 12 }),
            categoriesAPI.list(),
            discoverAPI.featured(),
            discoverAPI.popular('week', 8),
            discoverAPI.tags(),
            obituaryAPI.publicList({ limit: 4 }),
            classifiedsAPI.publicList({ limit: 4 }),
        ]).then(([newsRes, catRes, featRes, popRes, tagRes, obRes, clRes]) => {
            setNews(newsRes.data.news || []);
            setCategories(catRes.data || []);
            setFeatured(featRes.data || []);
            setPopular(popRes.data || []);
            setTags(tagRes.data || []);
            setObituary(obRes.data.obituaries || []);
            setClassifieds(clRes.data.classifieds || []);
        }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        discoverAPI.popular(popularPeriod, 8).then(res => setPopular(res.data || [])).catch(() => { });
    }, [popularPeriod]);

    const filteredNews = subCat === 'all' ? news : news.filter((n: any) => n.subCategory === subCat);

    const trustItems = [
        { icon: HiOutlineShieldCheck, text: 'Verified News' },
        { icon: HiOutlineBookOpen, text: 'Biblical Content' },
        { icon: HiOutlineUserGroup, text: 'Community Focused' },
        { icon: HiOutlineGlobe, text: 'Kerala-Wide Coverage' },
    ];

    return (
        <div>
            {/* Hero */}
            <section className="bg-white dark:bg-card-dark border-b border-cream-300 dark:border-dpurple-900/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                    <div className="max-w-3xl">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 text-primary-800 dark:text-white">
                            Malayalam Christian<br /><span className="text-primary dark:text-dpurple-400">Newspaper Portal</span>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg mb-8 leading-relaxed">
                            Your trusted source for Christian news, spiritual content, testimonies and community updates from Kerala. Stay connected with your faith and community.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link to="/matrimony" className="bg-primary dark:bg-dpurple hover:bg-primary-600 dark:hover:bg-dpurple-600 text-white px-6 py-3 rounded-lg font-semibold text-center transition-colors">
                                <HiOutlineHeart className="inline mr-2" size={18} /> Marriage Bureau
                            </Link>
                            <a href="#categories" className="border-2 border-primary dark:border-dpurple text-primary dark:text-dpurple-300 hover:bg-primary/5 dark:hover:bg-dpurple/10 px-6 py-3 rounded-lg font-semibold text-center transition-colors">
                                Browse Categories
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Strip */}
            <section className="bg-cream-100 dark:bg-surface-dark border-b border-cream-300 dark:border-dpurple-900/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {trustItems.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 justify-center sm:justify-start">
                                <item.icon size={20} className="text-primary dark:text-dpurple-400 shrink-0" />
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section id="categories" className="bg-white dark:bg-card-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Browse by Category</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {categories.map((cat: any) => {
                            const IconComp = categoryIcons[cat.slug] || HiOutlineNewspaper;
                            return (
                                <Link key={cat._id} to={`/category/${cat._id}`} className="bg-cream-50 dark:bg-surface-dark rounded-xl p-5 text-center hover:shadow-md transition-shadow border border-cream-300 dark:border-dpurple-900/40 card-hover group">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-dpurple/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 dark:group-hover:bg-dpurple/30 transition-colors">
                                        <IconComp size={24} className="text-primary dark:text-dpurple-400" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Main Content Grid: News + Sidebar */}
            <section className="bg-cream dark:bg-surface-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* News Column */}
                        <div className="flex-1">
                            {/* Sub Category Tabs */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    <span className="w-1 h-7 bg-primary dark:bg-dpurple rounded-full"></span> Latest News
                                </h2>
                                <div className="hidden sm:flex gap-1 text-xs">
                                    {['all', 'us-canada', 'world', 'india', 'business'].map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setSubCat(tab)}
                                            className={`px-3 py-1.5 rounded-full font-medium transition-colors ${subCat === tab
                                                ? 'bg-primary dark:bg-dpurple text-white'
                                                : 'bg-white dark:bg-card-dark text-gray-600 dark:text-gray-400 hover:bg-cream-200 dark:hover:bg-dpurple-900/50'}`}
                                        >
                                            {tab === 'all' ? 'All' : tab.replace('-', ' & ').replace(/\b\w/g, c => c.toUpperCase())}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {loading ? (
                                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-dpurple"></div></div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {filteredNews.map((article: any) => (
                                        <Link key={article._id} to={`/article/${article.slug}`} className="group bg-white dark:bg-card-dark rounded-xl border border-cream-300 dark:border-dpurple-900/40 overflow-hidden card-hover">
                                            {article.heroImage ? (
                                                <img src={article.heroImage} alt={article.title} className="w-full h-44 object-cover" loading="lazy" />
                                            ) : (
                                                <div className="w-full h-44 bg-gradient-to-br from-cream-200 to-cream-300 dark:from-dpurple-900 dark:to-surface-dark flex items-center justify-center">
                                                    <HiOutlineNewspaper size={40} className="text-primary-300 dark:text-dpurple-700" />
                                                </div>
                                            )}
                                            <div className="p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    {article.categoryId && (
                                                        <span className="text-xs font-medium text-primary dark:text-dpurple-300 bg-primary/10 dark:bg-dpurple/20 px-2 py-0.5 rounded">{article.categoryId.name || ''}</span>
                                                    )}
                                                    <span className="text-xs text-gray-400">{article.publishedAt && new Date(article.publishedAt).toLocaleDateString('ml-IN')}</span>
                                                    <span className="text-xs text-gray-400 flex items-center gap-0.5"><HiOutlineEye size={12} />{article.viewCount}</span>
                                                </div>
                                                <h3 className="font-bold text-gray-800 dark:text-white group-hover:text-primary dark:group-hover:text-dpurple-300 transition-colors line-clamp-2">{article.title}</h3>
                                                {article.subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{article.subtitle}</p>}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <aside className="w-full lg:w-80 shrink-0 space-y-6">
                            {/* Popular Posts */}
                            <div className="bg-white dark:bg-card-dark rounded-xl border border-cream-300 dark:border-dpurple-900/40 p-5">
                                <h3 className="font-bold text-gray-800 dark:text-white mb-3 text-sm uppercase tracking-wider">Popular Posts</h3>
                                <div className="flex gap-1 mb-4 text-xs">
                                    {(['week', 'month', 'all'] as const).map(p => (
                                        <button key={p} onClick={() => setPopularPeriod(p)}
                                            className={`px-2.5 py-1 rounded-full font-medium transition-colors ${popularPeriod === p
                                                ? 'bg-primary dark:bg-dpurple text-white'
                                                : 'bg-cream-100 dark:bg-surface-dark text-gray-600 dark:text-gray-400'}`}>
                                            {p === 'week' ? 'This Week' : p === 'month' ? 'This Month' : 'All Time'}
                                        </button>
                                    ))}
                                </div>
                                <div className="space-y-3">
                                    {popular.slice(0, 5).map((p: any, idx: number) => (
                                        <Link key={p._id || idx} to={`/article/${p.slug}`} className="flex gap-3 group">
                                            {p.heroImage ? (
                                                <img src={p.heroImage} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                                            ) : (
                                                <div className="w-16 h-16 rounded-lg bg-cream-200 dark:bg-dpurple-900 shrink-0" />
                                            )}
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-dpurple-300 line-clamp-2">{p.title}</h4>
                                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><HiOutlineEye size={12} />{p.viewCount}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Follow Us */}
                            <div className="bg-white dark:bg-card-dark rounded-xl border border-cream-300 dark:border-dpurple-900/40 p-5">
                                <h3 className="font-bold text-gray-800 dark:text-white mb-3 text-sm uppercase tracking-wider">Follow Us</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { name: 'Facebook', color: 'bg-blue-600' },
                                        { name: 'Twitter', color: 'bg-sky-500' },
                                        { name: 'Instagram', color: 'bg-pink-500' },
                                        { name: 'YouTube', color: 'bg-red-600' },
                                    ].map(s => (
                                        <a key={s.name} href="#" className={`${s.color} text-white text-xs font-medium py-2 px-3 rounded-lg text-center hover:opacity-90 transition-opacity`}>
                                            {s.name}
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Popular Tags */}
                            {tags.length > 0 && (
                                <div className="bg-white dark:bg-card-dark rounded-xl border border-cream-300 dark:border-dpurple-900/40 p-5">
                                    <h3 className="font-bold text-gray-800 dark:text-white mb-3 text-sm uppercase tracking-wider">Popular Tags</h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {tags.slice(0, 15).map((t: any) => (
                                            <Link key={t.tag} to={`/search?q=${encodeURIComponent(t.tag)}`}
                                                className="text-xs bg-cream-200 dark:bg-dpurple-900/50 text-gray-600 dark:text-gray-400 px-2.5 py-1 rounded-full hover:bg-primary/10 dark:hover:bg-dpurple/30 hover:text-primary dark:hover:text-dpurple-300 transition-colors">
                                                {t.tag}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </aside>
                    </div>
                </div>
            </section>

            {/* Buy & Sell Section */}
            {classifieds.length > 0 && (
                <section className="bg-white dark:bg-card-dark">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <span className="w-1 h-7 bg-accent dark:bg-dpurple rounded-full"></span> Buy & Sell
                            </h2>
                            <Link to="/classifieds" className="text-sm text-primary dark:text-dpurple-400 hover:underline font-medium">View All →</Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {classifieds.map((c: any) => (
                                <div key={c._id} className="bg-cream-50 dark:bg-surface-dark rounded-xl border border-cream-300 dark:border-dpurple-900/40 p-4 card-hover">
                                    {c.images?.[0] && <img src={c.images[0]} alt={c.title} className="w-full h-36 object-cover rounded-lg mb-3" />}
                                    <h4 className="font-semibold text-gray-800 dark:text-white text-sm line-clamp-2">{c.title}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{c.location} • {c.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Articles */}
            {featured.length > 0 && (
                <section className="bg-cream dark:bg-surface-dark">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                            <span className="w-1 h-7 bg-red-500 dark:bg-dpurple rounded-full"></span> Featured Articles
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {featured.slice(0, 6).map((a: any) => (
                                <Link key={a._id} to={`/article/${a.slug}`} className="group bg-white dark:bg-card-dark rounded-xl border border-cream-300 dark:border-dpurple-900/40 overflow-hidden card-hover">
                                    {a.heroImage && <img src={a.heroImage} alt={a.title} className="w-full h-40 object-cover" loading="lazy" />}
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-800 dark:text-white group-hover:text-primary dark:group-hover:text-dpurple-300 line-clamp-2">{a.title}</h3>
                                        <p className="text-xs text-gray-400 mt-2">{a.publishedAt && new Date(a.publishedAt).toLocaleDateString('ml-IN')} • <HiOutlineEye className="inline" size={12} /> {a.viewCount}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Obituary Section */}
            {obituaries.length > 0 && (
                <section className="bg-white dark:bg-card-dark">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <span className="w-1 h-7 bg-gray-800 dark:bg-gray-500 rounded-full"></span> Obituary
                            </h2>
                            <Link to="/obituary" className="text-sm text-primary dark:text-dpurple-400 hover:underline font-medium">View All →</Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {obituaries.map((o: any) => (
                                <div key={o._id} className="bg-cream-50 dark:bg-surface-dark rounded-xl border border-cream-300 dark:border-dpurple-900/40 p-4">
                                    {o.photo && <img src={o.photo} alt={o.name} className="w-full h-36 object-cover rounded-lg mb-3" />}
                                    <h4 className="font-semibold text-gray-800 dark:text-white text-sm">{o.name}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{o.age && `Age ${o.age}`} {o.place && `• ${o.place}`}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default HomePage;
