import api from './axios';

// Auth
export const authAPI = {
    login: (email: string, password: string) => api.post('/auth/login', { email, password }),
    refresh: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
    setPassword: (email: string, password: string) => api.post('/auth/set-password', { email, password }),
    getMe: () => api.get('/auth/me'),
    logout: () => api.post('/auth/logout'),
};

// Users
export const usersAPI = {
    list: (params?: any) => api.get('/users', { params }),
    createEditor: (data: { email: string; name: string }) => api.post('/users', data),
    activate: (id: string) => api.patch(`/users/${id}/activate`),
    deactivate: (id: string) => api.patch(`/users/${id}/deactivate`),
    delete: (id: string) => api.delete(`/users/${id}`),
};

// Categories
export const categoriesAPI = {
    list: () => api.get('/categories'),
    create: (data: { name: string; order?: number }) => api.post('/categories', data),
    update: (id: string, data: any) => api.patch(`/categories/${id}`, data),
    delete: (id: string) => api.delete(`/categories/${id}`),
};

// News
export const newsAPI = {
    list: (params?: any) => api.get('/news', { params }),
    getById: (id: string) => api.get(`/news/${id}`),
    create: (data: any) => api.post('/news', data),
    update: (id: string, data: any) => api.patch(`/news/${id}`, data),
    delete: (id: string) => api.delete(`/news/${id}`),
    // Public
    publicList: (params?: any) => api.get('/news/public', { params }),
    publicBySlug: (slug: string) => api.get(`/news/public/slug/${slug}`),
    publicByCategory: (categoryId: string, params?: any) => api.get(`/news/public/category/${categoryId}`, { params }),
};

// Matrimony
export const matrimonyAPI = {
    list: (params?: any) => api.get('/matrimony', { params }),
    create: (data: any) => api.post('/matrimony', data),
    update: (id: string, data: any) => api.patch(`/matrimony/${id}`, data),
    delete: (id: string) => api.delete(`/matrimony/${id}`),
    publicList: (params?: any) => api.get('/matrimony/public', { params }),
};

// Obituary
export const obituaryAPI = {
    list: (params?: any) => api.get('/obituary', { params }),
    create: (data: any) => api.post('/obituary', data),
    update: (id: string, data: any) => api.patch(`/obituary/${id}`, data),
    delete: (id: string) => api.delete(`/obituary/${id}`),
    publicList: (params?: any) => api.get('/obituary/public', { params }),
    publicById: (id: string) => api.get(`/obituary/public/${id}`),
};

// Media
export const mediaAPI = {
    upload: (file: File, altText?: string) => {
        const formData = new FormData();
        formData.append('file', file);
        if (altText) formData.append('altText', altText);
        return api.post('/media/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
    list: (params?: any) => api.get('/media', { params }),
    getById: (id: string) => api.get(`/media/${id}`),
    delete: (id: string) => api.delete(`/media/${id}`),
};

// Ads
export const adsAPI = {
    list: (params?: any) => api.get('/ads', { params }),
    create: (data: any) => api.post('/ads', data),
    update: (id: string, data: any) => api.patch(`/ads/${id}`, data),
    delete: (id: string) => api.delete(`/ads/${id}`),
    listAdsets: () => api.get('/ads/adsets'),
    createAdset: (data: any) => api.post('/ads/adsets', data),
    deleteAdset: (id: string) => api.delete(`/ads/adsets/${id}`),
    publicAds: (placement?: string) => api.get('/ads/public', { params: { placement } }),
    trackClick: (id: string) => api.post(`/ads/${id}/click`),
};

// Analytics
export const analyticsAPI = {
    dashboard: () => api.get('/analytics/dashboard'),
    articles: (params?: any) => api.get('/analytics/articles', { params }),
};

// Audit
export const auditAPI = {
    list: (params?: any) => api.get('/audit-logs', { params }),
};

// Classifieds (Buy & Sell)
export const classifiedsAPI = {
    list: (params?: any) => api.get('/classifieds', { params }),
    create: (data: any) => api.post('/classifieds', data),
    update: (id: string, data: any) => api.patch(`/classifieds/${id}`, data),
    delete: (id: string) => api.delete(`/classifieds/${id}`),
    publicList: (params?: any) => api.get('/classifieds/public', { params }),
};

// Videos
export const videosAPI = {
    list: (params?: any) => api.get('/videos', { params }),
    create: (data: any) => api.post('/videos', data),
    update: (id: string, data: any) => api.patch(`/videos/${id}`, data),
    delete: (id: string) => api.delete(`/videos/${id}`),
    publicList: (params?: any) => api.get('/videos/public', { params }),
};

// Prayers
export const prayersAPI = {
    list: (params?: any) => api.get('/prayers', { params }),
    create: (data: any) => api.post('/prayers', data),
    approve: (id: string) => api.patch(`/prayers/${id}/approve`),
    delete: (id: string) => api.delete(`/prayers/${id}`),
    publicList: (params?: any) => api.get('/prayers/public', { params }),
    submit: (data: any) => api.post('/prayers/submit', data),
};

// Subscribers
export const subscribersAPI = {
    list: (params?: any) => api.get('/subscribers', { params }),
    subscribe: (email: string) => api.post('/subscribers/subscribe', { email }),
    unsubscribe: (email: string) => api.post('/subscribers/unsubscribe', { email }),
};

// Discover (Search, Popular, Breaking, Featured, Tags)
export const discoverAPI = {
    search: (q: string, params?: any) => api.get('/discover/search', { params: { q, ...params } }),
    popular: (period?: string, limit?: number) => api.get('/discover/popular', { params: { period, limit } }),
    breaking: () => api.get('/discover/breaking'),
    featured: (sponsored?: boolean) => api.get('/discover/featured', { params: { sponsored } }),
    tags: () => api.get('/discover/tags'),
    bySubCategory: (subCategory: string, params?: any) => api.get('/discover/by-subcategory', { params: { subCategory, ...params } }),
};
