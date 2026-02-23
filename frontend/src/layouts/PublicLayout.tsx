import React, { useState, useEffect } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { HiOutlineMenu, HiOutlineX, HiOutlineSearch, HiOutlineMoon, HiOutlineSun, HiOutlineChevronUp, HiOutlineMail, HiChevronDown } from 'react-icons/hi';
import { useTheme } from '../context/ThemeContext';
import { discoverAPI, subscribersAPI } from '../api/services';
import LanguageSwitcher from '../components/LanguageSwitcher';

interface NavItem {
    label: string;
    path?: string;
    dropdown?: { label: string; path: string }[];
}

const navItems: NavItem[] = [
    { label: 'HOME', path: '/' },
    {
        label: 'NEWS',
        dropdown: [
            { label: 'All News', path: '/category/news' },
            { label: 'US & Canada', path: '/search?q=US+Canada' },
            { label: 'World', path: '/search?q=World' },
            { label: 'India', path: '/search?q=India' },
            { label: 'Business', path: '/search?q=Business' },
            { label: 'Kerala', path: '/search?q=Kerala' },
        ],
    },
    {
        label: 'BUY & SELL',
        dropdown: [
            { label: 'All', path: '/classifieds' },
            { label: 'Real Estate', path: '/classifieds?cat=real-estate' },
            { label: 'Rent & Lease', path: '/classifieds?cat=rent-lease' },
            { label: 'Construction', path: '/classifieds?cat=construction' },
            { label: 'Outfits', path: '/classifieds?cat=outfits' },
        ],
    },
    {
        label: 'FEATURED ARTICLE',
        dropdown: [
            { label: 'All Featured', path: '/search?q=featured' },
            { label: 'Sponsored', path: '/search?q=sponsored' },
        ],
    },
    {
        label: 'OBITUARY',
        dropdown: [
            { label: 'All Obituaries', path: '/obituary' },
            { label: 'Recent', path: '/obituary?sort=recent' },
        ],
    },
    {
        label: 'MATRIMONY',
        dropdown: [
            { label: 'All Profiles', path: '/matrimony' },
            { label: 'Groom', path: '/matrimony?type=groom' },
            { label: 'Bride', path: '/matrimony?type=bride' },
        ],
    },
    {
        label: 'VIDEOS',
        dropdown: [
            { label: 'All Videos', path: '/videos' },
            { label: 'Sermons', path: '/videos?cat=sermons' },
            { label: 'Worship', path: '/videos?cat=worship' },
            { label: 'Testimonies', path: '/videos?cat=testimonies' },
        ],
    },
    {
        label: 'PRAISE & PRAYERS',
        dropdown: [
            { label: 'All Requests', path: '/prayers' },
            { label: 'Prayer Requests', path: '/prayers?type=prayer' },
            { label: 'Praise Reports', path: '/prayers?type=praise' },
            { label: 'Submit Request', path: '/prayers?submit=true' },
        ],
    },
    { label: 'CONTACT US', path: '/contact' },
];

/* ─── Desktop dropdown nav item ─── */
const DropdownItem: React.FC<{ item: NavItem }> = ({ item }) => {
    if (!item.dropdown) {
        return (
            <NavLink
                to={item.path!}
                end={item.path === '/'}
                className={({ isActive }) =>
                    `px-3 py-2.5 text-[11px] font-bold tracking-wider transition-all whitespace-nowrap border-b-2 ${isActive
                        ? 'text-white border-[#1CA7A6]'
                        : 'text-white/75 border-transparent hover:text-white hover:border-white/40'
                    }`
                }
            >
                {item.label}
            </NavLink>
        );
    }

    return (
        <div className="relative group">
            <button className="flex items-center gap-0.5 px-3 py-2.5 text-[11px] font-bold tracking-wider text-white/75 hover:text-white transition-all whitespace-nowrap border-b-2 border-transparent group-hover:border-white/40">
                {item.label}
                <HiChevronDown size={12} className="ml-0.5 group-hover:rotate-180 transition-transform duration-200" />
            </button>
            <div className="absolute top-full left-0 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-white dark:bg-[#1e1e3a] rounded-lg shadow-2xl ring-1 ring-black/10 dark:ring-white/10 py-1.5 min-w-[180px] backdrop-blur-xl">
                    {item.dropdown.map((sub) => (
                        <Link
                            key={sub.path}
                            to={sub.path}
                            className="block px-4 py-2.5 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-[#1CA7A6] hover:text-white transition-colors rounded-md mx-1"
                        >
                            {sub.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

const PublicLayout: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [breakingNews, setBreakingNews] = useState<any[]>([]);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [email, setEmail] = useState('');
    const [subMsg, setSubMsg] = useState('');
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        discoverAPI.breaking().then(res => setBreakingNews(res.data)).catch(() => { });
    }, []);

    useEffect(() => {
        const handleScroll = () => setShowScrollTop(window.scrollY > 400);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
            setSearchQuery('');
        }
    };

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await subscribersAPI.subscribe(email);
            setSubMsg(res.data.message);
            setEmail('');
            setTimeout(() => setSubMsg(''), 4000);
        } catch { setSubMsg('Something went wrong'); }
    };

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    const toggleMobileDropdown = (label: string) => setMobileExpanded(prev => prev === label ? null : label);

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-[#0F172A] transition-colors duration-300">

            {/* ═══════ TOP UTILITY BAR ═══════ */}
            <div className="bg-slate-50 dark:bg-[#0B1120] border-b border-slate-200 dark:border-slate-700/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-9">
                    <div className="flex gap-4 text-[11px] text-gray-500 dark:text-gray-500">
                        <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/about" className="text-[11px] text-gray-500 dark:text-gray-500 hover:text-[#1CA7A6] transition-colors">About</Link>
                        <Link to="/contact" className="text-[11px] text-gray-500 dark:text-gray-500 hover:text-[#1CA7A6] transition-colors">Contact</Link>
                        <LanguageSwitcher />
                        <button onClick={toggleTheme} className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-500 hover:text-[#1CA7A6] transition-colors">
                            {theme === 'dark' ? <><HiOutlineSun size={13} /> Light</> : <><HiOutlineMoon size={13} /> Dark</>}
                        </button>
                    </div>
                </div>
            </div>

            {/* ═══════ LOGO HEADER ═══════ */}
            <header className="bg-white dark:bg-[#0F172A] border-b border-slate-100 dark:border-slate-700/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-5">
                    <Link to="/" className="flex flex-col">
                        <div className="flex items-baseline gap-1">
                            <span className="text-[#1CA7A6] text-3xl sm:text-4xl font-black italic leading-none">Online</span>
                            <span className="text-gray-900 dark:text-white text-3xl sm:text-4xl font-black leading-none">Goodnews</span>
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 tracking-[0.3em] uppercase font-medium mt-1">Christian News Portal</span>
                    </Link>

                    {/* Right: Ad space or CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link to="/admin/login" className="text-xs text-gray-400 hover:text-[#1CA7A6] transition-colors border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-full">
                            Admin Login
                        </Link>
                    </div>
                </div>
            </header>

            {/* ═══════ NAVIGATION BAR ═══════ */}
            <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#0B3C5D] to-[#0e4a72] dark:from-[#0F172A] dark:to-[#1E293B] shadow-lg">
                {/* Teal accent line */}
                <div className="h-[3px] bg-gradient-to-r from-[#1CA7A6] via-[#22c9c8] to-[#1CA7A6]" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Desktop nav */}
                    <div className="hidden lg:flex items-center justify-between h-11">
                        <div className="flex items-center -mx-1">
                            {navItems.map(item => (
                                <DropdownItem key={item.label} item={item} />
                            ))}
                        </div>
                        <button
                            onClick={() => setSearchOpen(!searchOpen)}
                            className="text-white/70 hover:text-white transition-all p-2 hover:bg-white/10 rounded-full"
                        >
                            <HiOutlineSearch size={18} />
                        </button>
                    </div>

                    {/* Mobile nav trigger */}
                    <div className="lg:hidden flex items-center justify-between h-11">
                        <button onClick={() => setMenuOpen(!menuOpen)} className="text-white p-1">
                            {menuOpen ? <HiOutlineX size={22} /> : <HiOutlineMenu size={22} />}
                        </button>
                        <span className="text-white text-[11px] font-bold tracking-wider">MENU</span>
                        <button onClick={() => setSearchOpen(!searchOpen)} className="text-white/70 hover:text-white p-1">
                            <HiOutlineSearch size={18} />
                        </button>
                    </div>
                </div>

                {/* Search overlay */}
                {searchOpen && (
                    <div className="bg-[#0a3250] dark:bg-[#0B1120] border-t border-white/10">
                        <div className="max-w-7xl mx-auto px-4 py-3">
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search news, articles, videos..."
                                    className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder-white/40 outline-none focus:border-[#1CA7A6] focus:bg-white/15 transition-all"
                                    autoFocus
                                />
                                <button type="submit" className="bg-[#1CA7A6] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#159c9b] transition-colors">
                                    Search
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="lg:hidden bg-[#0a3250] dark:bg-[#0B1120] border-t border-white/10 max-h-[70vh] overflow-y-auto">
                        <div className="px-4 py-2">
                            {navItems.map(item => (
                                <div key={item.label}>
                                    {item.dropdown ? (
                                        <>
                                            <button
                                                onClick={() => toggleMobileDropdown(item.label)}
                                                className="flex items-center justify-between w-full text-white/90 text-[13px] py-3 font-bold tracking-wider border-b border-white/5"
                                            >
                                                {item.label}
                                                <HiChevronDown size={16} className={`transition-transform ${mobileExpanded === item.label ? 'rotate-180' : ''}`} />
                                            </button>
                                            {mobileExpanded === item.label && (
                                                <div className="pl-4 py-2 space-y-0.5 border-l-2 border-[#1CA7A6] ml-2 mb-1">
                                                    {item.dropdown.map(sub => (
                                                        <Link key={sub.path} to={sub.path} onClick={() => setMenuOpen(false)} className="block text-white/60 text-sm py-2 hover:text-[#1CA7A6] transition-colors">
                                                            {sub.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <Link to={item.path!} onClick={() => setMenuOpen(false)} className="block text-white/90 text-[13px] py-3 font-bold tracking-wider border-b border-white/5">
                                            {item.label}
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            {/* ═══════ BREAKING NEWS TICKER ═══════ */}
            {breakingNews.length > 0 && (
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 flex items-center h-9">
                        <span className="bg-white text-red-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full mr-3 shrink-0 uppercase tracking-wider animate-pulse">Breaking</span>
                        <div className="overflow-hidden flex-1 whitespace-nowrap">
                            <div className="ticker-animate inline-block">
                                {breakingNews.map((n, i) => (
                                    <Link key={n._id || i} to={`/article/${n.slug}`} className="hover:underline mr-8 text-sm font-medium">
                                        {n.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════ CONTENT ═══════ */}
            <main className="flex-1 bg-slate-50 dark:bg-[#0F172A]">
                <Outlet />
            </main>

            {/* ═══════ FOOTER ═══════ */}
            <footer className="bg-[#0B3C5D] dark:bg-[#020617] text-slate-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {/* Brand */}
                        <div>
                            <div className="mb-4">
                                <span className="text-[#1CA7A6] text-xl font-black italic">Online</span>
                                <span className="text-white text-xl font-black ml-1">Goodnews</span>
                            </div>
                            <p className="text-sm leading-relaxed text-gray-400">
                                Spreading the Gospel and keeping the Malayalam Christian community informed through quality journalism and spiritual content.
                            </p>
                            <div className="flex gap-2.5 mt-5">
                                {[
                                    { letter: 'f', bg: 'bg-[#1877F2]' },
                                    { letter: '𝕏', bg: 'bg-gray-800' },
                                    { letter: 'in', bg: 'bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888]' },
                                    { letter: '▶', bg: 'bg-[#FF0000]' },
                                ].map((s, i) => (
                                    <a key={i} href="#" className={`w-9 h-9 rounded-full ${s.bg} flex items-center justify-center text-[11px] text-white font-bold hover:scale-110 transition-transform`}>
                                        {s.letter}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
                            <div className="space-y-2.5 text-sm">
                                {[
                                    { to: '/about', label: 'About Us' },
                                    { to: '/matrimony', label: 'Matrimony' },
                                    { to: '/obituary', label: 'Obituary' },
                                    { to: '/classifieds', label: 'Buy & Sell' },
                                    { to: '/videos', label: 'Videos' },
                                    { to: '/prayers', label: 'Praise & Prayers' },
                                    { to: '/contact', label: 'Contact Us' },
                                ].map(l => (
                                    <Link key={l.to} to={l.to} className="block text-gray-400 hover:text-[#1CA7A6] hover:translate-x-1 transition-all">{l.label}</Link>
                                ))}
                            </div>
                        </div>

                        {/* Legal */}
                        <div>
                            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Legal</h4>
                            <div className="space-y-2.5 text-sm">
                                <a href="#" className="block text-gray-400 hover:text-[#1CA7A6] hover:translate-x-1 transition-all">Privacy Policy</a>
                                <a href="#" className="block text-gray-400 hover:text-[#1CA7A6] hover:translate-x-1 transition-all">Terms of Service</a>
                                <a href="#" className="block text-gray-400 hover:text-[#1CA7A6] hover:translate-x-1 transition-all">Cookie Policy</a>
                                <a href="#" className="block text-gray-400 hover:text-[#1CA7A6] hover:translate-x-1 transition-all">Disclaimer</a>
                            </div>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Newsletter</h4>
                            <p className="text-sm text-gray-400 mb-4">Get the latest news delivered to your inbox</p>
                            <form onSubmit={handleSubscribe} className="space-y-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/15 text-white text-sm placeholder-gray-500 outline-none focus:border-[#1CA7A6] focus:ring-1 focus:ring-[#1CA7A6]/30 transition-all"
                                />
                                <button type="submit" className="w-full bg-[#1CA7A6] hover:bg-[#159c9b] text-white py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2">
                                    <HiOutlineMail size={16} /> Subscribe
                                </button>
                            </form>
                            {subMsg && <p className="text-xs text-[#1CA7A6] mt-2">{subMsg}</p>}
                        </div>
                    </div>

                    <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
                        <p>© {new Date().getFullYear()} Online Goodnews. All rights reserved.</p>
                        <p>Malayalam Christian News Portal</p>
                    </div>
                </div>
            </footer>

            {/* ═══════ SCROLL TO TOP ═══════ */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-[#1CA7A6] text-white shadow-lg shadow-[#1CA7A6]/30 hover:bg-[#159c9b] hover:scale-110 transition-all flex items-center justify-center"
                >
                    <HiOutlineChevronUp size={20} />
                </button>
            )}
        </div>
    );
};

export default PublicLayout;
