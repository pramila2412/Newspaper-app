import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { newsAPI } from '../../api/services';
import BlockRenderer from '../../components/editor/BlockRenderer';
import { HiOutlineClock, HiOutlineEye, HiOutlineTag, HiOutlineChevronRight } from 'react-icons/hi';

const ArticlePage: React.FC = () => {
    const { slug } = useParams();
    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        newsAPI.publicBySlug(slug!).then(({ data }) => setArticle(data)).catch(() => { }).finally(() => setLoading(false));
    }, [slug]);

    if (loading) {
        return <div className="flex justify-center py-24"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-dpurple"></div></div>;
    }

    if (!article) {
        return <div className="text-center py-24 text-gray-400 text-lg">Article not found</div>;
    }

    const shareUrl = window.location.href;
    const shareText = encodeURIComponent(article.title + ' ' + shareUrl);

    return (
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-6 flex-wrap">
                <Link to="/" className="hover:text-primary dark:hover:text-dpurple-300 transition-colors">Home</Link>
                <HiOutlineChevronRight size={14} />
                {article.categoryId && (
                    <>
                        <Link to={`/category/${article.categoryId._id}`} className="hover:text-primary dark:hover:text-dpurple-300 transition-colors">{article.categoryId.name}</Link>
                        <HiOutlineChevronRight size={14} />
                    </>
                )}
                <span className="text-gray-700 dark:text-gray-300 line-clamp-1">{article.title}</span>
            </nav>

            {/* Category + Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-gray-500 dark:text-gray-400">
                {article.categoryId && (
                    <span className="flex items-center gap-1 text-primary dark:text-dpurple-300 bg-primary/10 dark:bg-dpurple/20 px-2 py-0.5 rounded font-medium">
                        <HiOutlineTag size={14} /> {article.categoryId.name}
                    </span>
                )}
                <span className="flex items-center gap-1"><HiOutlineClock size={14} /> {new Date(article.publishedAt).toLocaleDateString('ml-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span className="flex items-center gap-1"><HiOutlineEye size={14} /> {article.viewCount} views</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 dark:text-white leading-tight mb-3">{article.title}</h1>
            {article.subtitle && <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">{article.subtitle}</p>}

            {/* Author */}
            {article.authorId && (
                <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">By <span className="font-medium text-gray-700 dark:text-gray-300">{article.authorId.name}</span></p>
            )}

            {/* Hero Image */}
            {article.heroImage && (
                <img src={article.heroImage} alt={article.title} className="w-full rounded-xl object-cover max-h-[500px] mb-8" />
            )}

            {/* Content */}
            <div className="prose-custom block-content">
                <BlockRenderer blocks={article.contentBlocks || []} />
            </div>

            {/* Share Buttons */}
            <div className="border-t border-cream-300 dark:border-dpurple-900/40 mt-12 pt-6">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Share this article</p>
                <div className="flex flex-wrap gap-2">
                    <a href={`https://wa.me/?text=${shareText}`} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">WhatsApp</a>
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Facebook</a>
                    <a href={`https://twitter.com/intent/tweet?text=${shareText}`} target="_blank" rel="noopener noreferrer" className="bg-sky-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky-600 transition-colors">Twitter</a>
                    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">LinkedIn</a>
                    <a href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener noreferrer" className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">Pinterest</a>
                    <button onClick={() => window.print()} className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">Print</button>
                </div>
            </div>

            {/* WhatsApp Group CTA */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 rounded-xl p-5 mt-6 text-center">
                <p className="text-sm text-green-700 dark:text-green-400 font-medium">📱 Join our WhatsApp group for the latest news updates!</p>
                <a href="#" className="inline-block mt-2 bg-green-500 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors">Join WhatsApp Group</a>
            </div>
        </article>
    );
};

export default ArticlePage;
