import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineNewspaper, HiOutlineUsers, HiOutlinePhotograph, HiOutlineChartBar, HiOutlineCog, HiOutlineLogout, HiOutlineMenu, HiOutlineX, HiOutlineClipboardList, HiOutlineHeart, HiOutlineBookOpen, HiOutlineSpeakerphone, HiOutlineHome, HiOutlineTag, HiOutlineShoppingCart, HiOutlineFilm, HiOutlineHand, HiOutlineMail } from 'react-icons/hi';

const AdminLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login');
    };

    const navItems = [
        { to: '/admin', icon: HiOutlineHome, label: 'Dashboard', end: true },
        { to: '/admin/news', icon: HiOutlineNewspaper, label: 'News' },
        { to: '/admin/categories', icon: HiOutlineTag, label: 'Categories', adminOnly: true },
        { to: '/admin/matrimony', icon: HiOutlineHeart, label: 'Matrimony' },
        { to: '/admin/obituary', icon: HiOutlineBookOpen, label: 'Obituary' },
        { to: '/admin/classifieds', icon: HiOutlineShoppingCart, label: 'Classifieds' },
        { to: '/admin/videos', icon: HiOutlineFilm, label: 'Videos' },
        { to: '/admin/prayers', icon: HiOutlineHand, label: 'Prayers' },
        { to: '/admin/ads', icon: HiOutlineSpeakerphone, label: 'Ads' },
        { to: '/admin/media', icon: HiOutlinePhotograph, label: 'Media Library' },
        { to: '/admin/subscribers', icon: HiOutlineMail, label: 'Subscribers', adminOnly: true },
        { to: '/admin/users', icon: HiOutlineUsers, label: 'Users', adminOnly: true },
        { to: '/admin/analytics', icon: HiOutlineChartBar, label: 'Analytics' },
        { to: '/admin/audit-logs', icon: HiOutlineClipboardList, label: 'Audit Logs', adminOnly: true },
    ];

    const filteredNav = navItems.filter(item => !item.adminOnly || user?.role === 'SUPER_ADMIN');

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile header */}
            <div className="lg:hidden bg-primary text-white p-4 flex items-center justify-between sticky top-0 z-50">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1">
                    {sidebarOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
                </button>
                <h1 className="text-lg font-bold">GoodNews Admin</h1>
                <div className="w-8" />
            </div>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`
          fixed lg:sticky top-0 left-0 z-40 w-64 h-screen bg-primary text-white
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          overflow-y-auto
        `}>
                    <div className="p-6 hidden lg:block">
                        <h1 className="text-xl font-extrabold tracking-tight">✝ GoodNews</h1>
                        <p className="text-primary-300 text-xs mt-1">Admin Panel</p>
                    </div>

                    <nav className="mt-2 lg:mt-0 px-3 pb-4">
                        {filteredNav.map(item => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-sm font-medium transition-colors
                  ${isActive ? 'bg-teal text-white' : 'text-primary-200 hover:bg-primary-600 hover:text-white'}`
                                }
                            >
                                <item.icon size={20} />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="px-3 mt-auto pb-6">
                        <div className="border-t border-primary-600 pt-4 px-4">
                            <p className="text-xs text-primary-300">{user?.name}</p>
                            <p className="text-xs text-primary-400">{user?.role}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg mt-2 text-sm text-primary-200 hover:bg-red-600 hover:text-white transition-colors w-full"
                        >
                            <HiOutlineLogout size={20} />
                            Logout
                        </button>
                    </div>
                </aside>

                {/* Overlay */}
                {sidebarOpen && (
                    <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
                )}

                {/* Main content */}
                <main className="flex-1 min-h-screen lg:ml-0">
                    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
