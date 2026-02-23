import React, { useState } from 'react';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';
import toast from 'react-hot-toast';

const ContactPage: React.FC = () => {
    const [form, setForm] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Thank you! Your message has been sent.');
        setForm({ name: '', email: '', message: '' });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-8">Contact Us</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-slate-700/50 p-8">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Get in Touch</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0F172A] text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[#1CA7A6]" />
                        <input type="email" placeholder="Your Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0F172A] text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[#1CA7A6]" />
                        <textarea placeholder="Your Message" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required rows={5}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0F172A] text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[#1CA7A6] resize-none" />
                        <button type="submit" className="bg-[#1CA7A6] hover:bg-[#159c9b] text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                            Send Message
                        </button>
                    </form>
                </div>
                <div className="space-y-6">
                    <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-slate-700/50 p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineMail size={24} className="text-[#1CA7A6]" />
                            <div>
                                <h3 className="font-semibold text-slate-800 dark:text-white">Email</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">info@onlinegoodnews.com</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-slate-700/50 p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlinePhone size={24} className="text-[#1CA7A6]" />
                            <div>
                                <h3 className="font-semibold text-slate-800 dark:text-white">Phone</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Contact us via WhatsApp</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-slate-700/50 p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineLocationMarker size={24} className="text-[#1CA7A6]" />
                            <div>
                                <h3 className="font-semibold text-slate-800 dark:text-white">Location</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Kerala, India</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
