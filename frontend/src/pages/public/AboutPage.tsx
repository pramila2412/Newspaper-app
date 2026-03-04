import React from 'react';
import { HiOutlineGlobeAlt, HiOutlineLightBulb, HiOutlineHeart, HiOutlineUserGroup, HiOutlineBookOpen, HiOutlineStar } from 'react-icons/hi';

const teamMembers = [
    { name: 'C V Mathew', role: 'Founder & Chief Editor', photo: '/images/team-1.png' },
    { name: 'T M Mathew', role: 'Senior Editor', photo: '/images/team-2.png' },
    { name: 'Shaji Maniyat', role: 'Editor', photo: '/images/team-3.png' },
    { name: 'Wesly Mathew', role: 'Editor', photo: '/images/team-4.png' },
    { name: 'Saji Mathai Kathettu', role: 'Editor', photo: '/images/team-5.png' },
    { name: 'Jessy Shajan', role: 'Editor', photo: '/images/team-6.png' },
];

const values = [
    { icon: HiOutlineBookOpen, label: 'Faith-Rooted Content', desc: 'Every story is rooted in faith, thoughtfully designed and creatively inspired.' },
    { icon: HiOutlineGlobeAlt, label: 'Global Reach', desc: 'Connecting the Malayalam Christian diaspora worldwide — Kerala, US, Canada and beyond.' },
    { icon: HiOutlineLightBulb, label: 'Hope & Inspiration', desc: 'Shining a spotlight on the great happenings in communities, stories of hope, love and resilience.' },
    { icon: HiOutlineHeart, label: 'Unity & Growth', desc: 'Fostering growth, unity, and encouragement, all for the greater glory of God.' },
    { icon: HiOutlineUserGroup, label: 'Community Focused', desc: 'A space for believers, seekers, and the curious to discover uplifting stories.' },
    { icon: HiOutlineStar, label: 'Excellence', desc: 'Over four decades of expertise in Christian journalism and communications.' },
];

const AboutPage: React.FC = () => (
    <div className="homepage-redesign">
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-[#0B3C5D] to-[#0e4a72] dark:from-[#0F172A] dark:to-[#1E293B] relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-[#1CA7A6] blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-[#1CA7A6] blur-3xl"></div>
            </div>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center relative z-10">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
                    About <span className="text-[#1CA7A6]">Online Goodnews</span>
                </h1>
                <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                    Your own online platform for sharing Hope, Inspiration, and Uplifting stories from around the Globe.
                </p>
            </div>
        </section>

        {/* Welcome / Intro */}
        <section className="bg-white dark:bg-[#1E293B]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="bg-slate-50 dark:bg-[#0F172A] rounded-2xl p-6 sm:p-10 border border-slate-100 dark:border-slate-700/50">
                    <p className="text-slate-700 dark:text-slate-300 text-base sm:text-lg leading-relaxed mb-5">
                        Welcome to <strong className="text-[#0B3C5D] dark:text-[#1CA7A6]">"onlinegoodnews.com"</strong> — your own online platform for sharing Hope, Inspiration, and Uplifting stories from around the Globe. We are dedicated in delivering content rooted in faith and positive values that inspire and unite Christians of all backgrounds.
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                        Our mission is to create a space where everyone—believers, seekers, and those simply curious—can discover stories of hope, love, and resilience. By shining a spotlight on the great happenings in communities and beyond, we strive to be a source of light in a world often overshadowed by negativity.
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                        To provide news and insights about churches and missions worldwide, fostering growth, unity, and encouragement, all for the greater glory of God.
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        In all that we do, across every platform, we strive to provide a deeper experience that is very much rooted in faith thoughtfully designed and creatively inspired, driven the love of Christ and His Church.
                    </p>
                </div>
            </div>
        </section>

        {/* Our Values */}
        <section className="bg-slate-50 dark:bg-[#0F172A]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-10 flex items-center justify-center gap-3">
                    <span className="w-1.5 h-8 bg-[#1CA7A6] rounded-full"></span>
                    What We Stand For
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {values.map((v, i) => (
                        <div key={i} className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-slate-100 dark:border-slate-700/50 hover:shadow-lg transition-shadow duration-300 group">
                            <div className="w-12 h-12 rounded-xl bg-[#1CA7A6]/10 dark:bg-[#1CA7A6]/15 flex items-center justify-center mb-4 group-hover:bg-[#1CA7A6]/20 transition-colors">
                                <v.icon size={24} className="text-[#1CA7A6]" />
                            </div>
                            <h3 className="font-bold text-slate-800 dark:text-white mb-2 text-base">{v.label}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{v.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Our Team */}
        <section className="bg-white dark:bg-[#1E293B]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-4 flex items-center justify-center gap-3">
                    <span className="w-1.5 h-8 bg-[#1CA7A6] rounded-full"></span>
                    Our Team
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-center max-w-2xl mx-auto mb-10 text-sm sm:text-base">
                    Online Goodnews is powered by seasoned professionals with over four decades of expertise in Christian journalism and communications, committed to sharing stories that inspire, connect, and inform a global audience.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {teamMembers.map((member, i) => (
                        <div key={i} className="text-center group">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-3 overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                                <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                            </div>
                            <h4 className="font-bold text-slate-800 dark:text-white text-xs sm:text-sm">{member.name}</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">{member.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Platform Notice */}
        <section className="bg-slate-50 dark:bg-[#0F172A]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Online Goodnews serves as a platform for sharing Christian news and content. We are committed to accuracy, faith-based reporting, and building a connected community of believers worldwide.
                </p>
            </div>
        </section>
    </div>
);

export default AboutPage;
