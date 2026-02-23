import React from 'react';

const AboutPage: React.FC = () => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">About Good News</h1>
        <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-slate-700/50 p-8">
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                <strong className="text-slate-800 dark:text-white">Good News</strong> is a Malayalam Christian Newspaper Portal dedicated to spreading the Gospel and keeping the community informed. Our mission is <em>"Growth, Unity & Edification"</em>.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                We provide verified Christian news, spiritual content, testimonies, youth updates, family resources, and educational articles. Our platform also serves as a community hub with a Marriage Bureau, Obituary section, Buy & Sell marketplace, and Praise & Prayers page.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Established to serve the Malayalam-speaking Christian community worldwide, Good News brings together believers from Kerala, the US, Canada, and beyond through quality journalism and spiritual content.
            </p>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-3">Our Values</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
                <li>Truth and accurate reporting</li>
                <li>Faith-based community building</li>
                <li>Connecting the diaspora with their roots</li>
                <li>Supporting families and youth</li>
                <li>Providing a trustworthy platform for the community</li>
            </ul>
        </div>
    </div>
);

export default AboutPage;
