import React from 'react';

interface ContentBlock {
    id: string;
    type: string;
    data: Record<string, any>;
}

interface BlockRendererProps {
    blocks: ContentBlock[];
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ blocks }) => {
    const renderBlock = (block: ContentBlock) => {
        const { type, data } = block;

        switch (type) {
            case 'heading': {
                const Tag = (data.level || 'h2') as keyof JSX.IntrinsicElements;
                return <Tag className={`font-bold ${data.level === 'h1' ? 'text-2xl sm:text-3xl' : data.level === 'h3' ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'} text-dark mb-3`}>{data.text}</Tag>;
            }
            case 'paragraph':
                return <p className="text-base sm:text-lg leading-relaxed text-gray-700 mb-4" style={{ whiteSpace: 'pre-wrap' }}>{data.text}</p>;
            case 'bible_verse':
                return (
                    <div className="bible-verse border-l-4 border-primary bg-gradient-to-r from-teal-50 to-white p-4 sm:p-6 my-4 rounded-r-lg">
                        <p className="italic text-gray-700 text-base sm:text-lg leading-relaxed">{data.text}</p>
                        {data.reference && <p className="text-sm text-primary font-semibold mt-2">— {data.reference}</p>}
                    </div>
                );
            case 'quote':
                return (
                    <blockquote className="border-l-4 border-teal bg-gray-50 p-4 sm:p-6 my-4 rounded-r-lg">
                        <p className="italic text-gray-600 text-base sm:text-lg leading-relaxed">{data.text}</p>
                        {data.author && <p className="text-sm text-gray-500 mt-2 font-medium">— {data.author}</p>}
                    </blockquote>
                );
            case 'image':
                return (
                    <figure className="my-4">
                        <img src={data.url} alt={data.alt || ''} className="w-full rounded-xl object-cover max-h-[500px]" loading="lazy" />
                        {data.caption && <figcaption className="text-center text-sm text-gray-500 mt-2">{data.caption}</figcaption>}
                    </figure>
                );
            case 'divider':
                return <hr className="my-6 border-gray-200" />;
            case 'callout':
                return (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-5 my-4">
                        <p className="text-gray-700 text-base leading-relaxed">{data.text}</p>
                    </div>
                );
            case 'list': {
                const Tag = data.ordered ? 'ol' : 'ul';
                return (
                    <Tag className={`${data.ordered ? 'list-decimal' : 'list-disc'} pl-6 my-4 space-y-2`}>
                        {(data.items || []).map((item: string, i: number) => (
                            <li key={i} className="text-gray-700 text-base leading-relaxed">{item}</li>
                        ))}
                    </Tag>
                );
            }
            case 'youtube': {
                const videoId = data.url?.match(/(?:youtu\.be\/|v=)([a-zA-Z0-9_-]{11})/)?.[1];
                if (!videoId) return <p className="text-gray-400">Invalid YouTube URL</p>;
                return (
                    <div className="my-4 aspect-video rounded-xl overflow-hidden">
                        <iframe src={`https://www.youtube.com/embed/${videoId}`} className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                    </div>
                );
            }
            default:
                return null;
        }
    };

    return (
        <div className="block-content">
            {blocks.map(block => (
                <div key={block.id}>{renderBlock(block)}</div>
            ))}
        </div>
    );
};

export default BlockRenderer;
