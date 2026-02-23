import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';

// Admin pages
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import NewsListPage from './pages/admin/NewsListPage';
import NewsEditorPage from './pages/admin/NewsEditorPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import MatrimonyPage from './pages/admin/MatrimonyPage';
import ObituaryPage from './pages/admin/ObituaryPage';
import AdsPage from './pages/admin/AdsPage';
import MediaPage from './pages/admin/MediaPage';
import UsersPage from './pages/admin/UsersPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import AuditLogsPage from './pages/admin/AuditLogsPage';
import ClassifiedsAdminPage from './pages/admin/ClassifiedsAdminPage';
import VideosAdminPage from './pages/admin/VideosAdminPage';
import PrayersAdminPage from './pages/admin/PrayersAdminPage';
import SubscribersPage from './pages/admin/SubscribersPage';

// Public pages
import HomePage from './pages/public/HomePage';
import CategoryPage from './pages/public/CategoryPage';
import ArticlePage from './pages/public/ArticlePage';
import PublicMatrimonyPage from './pages/public/PublicMatrimonyPage';
import PublicObituaryPage from './pages/public/PublicObituaryPage';
import ClassifiedsPage from './pages/public/ClassifiedsPage';
import VideosPage from './pages/public/VideosPage';
import PrayersPage from './pages/public/PrayersPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import SearchPage from './pages/public/SearchPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-dpurple"></div></div>;
    if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
    return <>{children}</>;
};

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <BrowserRouter>
                    <Toaster position="top-right" toastOptions={{ className: 'text-sm', duration: 3000 }} />
                    <Routes>
                        {/* Public Routes */}
                        <Route element={<PublicLayout />}>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/category/:categoryId" element={<CategoryPage />} />
                            <Route path="/article/:slug" element={<ArticlePage />} />
                            <Route path="/matrimony" element={<PublicMatrimonyPage />} />
                            <Route path="/obituary" element={<PublicObituaryPage />} />
                            <Route path="/classifieds" element={<ClassifiedsPage />} />
                            <Route path="/videos" element={<VideosPage />} />
                            <Route path="/prayers" element={<PrayersPage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/search" element={<SearchPage />} />
                        </Route>

                        {/* Admin Login */}
                        <Route path="/admin/login" element={<LoginPage />} />

                        {/* Admin Protected Routes */}
                        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                            <Route index element={<DashboardPage />} />
                            <Route path="news" element={<NewsListPage />} />
                            <Route path="news/create" element={<NewsEditorPage />} />
                            <Route path="news/edit/:id" element={<NewsEditorPage />} />
                            <Route path="categories" element={<CategoriesPage />} />
                            <Route path="matrimony" element={<MatrimonyPage />} />
                            <Route path="obituary" element={<ObituaryPage />} />
                            <Route path="ads" element={<AdsPage />} />
                            <Route path="media" element={<MediaPage />} />
                            <Route path="users" element={<UsersPage />} />
                            <Route path="analytics" element={<AnalyticsPage />} />
                            <Route path="audit-logs" element={<AuditLogsPage />} />
                            <Route path="classifieds" element={<ClassifiedsAdminPage />} />
                            <Route path="videos" element={<VideosAdminPage />} />
                            <Route path="prayers" element={<PrayersAdminPage />} />
                            <Route path="subscribers" element={<SubscribersPage />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;
