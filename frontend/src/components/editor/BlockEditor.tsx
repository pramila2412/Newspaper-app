import React from 'react';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineArrowUp, HiOutlineArrowDown } from 'react-icons/hi';

interface ContentBlock {
    id: string;
    type: string;
    data: Record<string, any>;
}

interface BlockEditorProps {
    blocks: ContentBlock[];
    onChange: (blocks: ContentBlock[]) => void;
}

const BLOCK_TYPES = [
    { type: 'heading', label: 'Heading' },
    { type: 'paragraph', label: 'Paragraph' },
    { type: 'bible_verse', label: 'Bible Verse' },
    { type: 'quote', label: 'Quote' },
    { type: 'image', label: 'Image' },
    { type: 'divider', label: 'Divider' },
    { type: 'callout', label: 'Callout' },
    { type: 'list', label: 'List' },
    { type: 'youtube', label: 'YouTube' },
];

const BlockEditor: React.FC<BlockEditorProps> = ({ blocks, onChange }) => {
    const addBlock = (type: string) => {
        const newBlock: ContentBlock = {
            id: `block_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            type,
            data: getDefaultData(type),
        };
        onChange([...blocks, newBlock]);
    };

    const getDefaultData = (type: string): Record<string, any> => {
        switch (type) {
            case 'heading': return { text: '', level: 'h2' };
            case 'paragraph': return { text: '' };
            case 'bible_verse': return { text: '', reference: '' };
            case 'quote': return { text: '', author: '' };
            case 'image': return { url: '', caption: '', alt: '' };
            case 'divider': return {};
            case 'callout': return { text: '' };
            case 'list': return { items: [''], ordered: false };
            case 'youtube': return { url: '' };
            default: return {};
        }
    };

    const updateBlock = (id: string, data: Record<string, any>) => {
        onChange(blocks.map(b => b.id === id ? { ...b, data: { ...b.data, ...data } } : b));
    };

    const removeBlock = (id: string) => {
        onChange(blocks.filter(b => b.id !== id));
    };

    const moveBlock = (idx: number, dir: number) => {
        const newBlocks = [...blocks];
        const target = idx + dir;
        if (target < 0 || target >= newBlocks.length) return;
        [newBlocks[idx], newBlocks[target]] = [newBlocks[target], newBlocks[idx]];
        onChange(newBlocks);
    };

    const renderBlockEditor = (block: ContentBlock, idx: number) => {
        const { type, data, id } = block;

        switch (type) {
            case 'heading':
                return (
                    <div>
                        <select value={data.level} onChange={e => updateBlock(id, { level: e.target.value })} className="mb-2 px-2 py-1 border rounded text-sm">
                            <option value="h1">H1</option>
                            <option value="h2">H2</option>
                            <option value="h3">H3</option>
                        </select>
                        <input value={data.text} onChange={e => updateBlock(id, { text: e.target.value })} placeholder="Heading text..." className="w-full px-3 py-2 border rounded-lg text-base font-bold" />
                    </div>
                );
            case 'paragraph':
                return <textarea value={data.text} onChange={e => updateBlock(id, { text: e.target.value })} placeholder="Write paragraph..." className="w-full px-3 py-2 border rounded-lg text-sm min-h-[100px] resize-y" />;
            case 'bible_verse':
                return (
                    <div className="space-y-2">
                        <textarea value={data.text} onChange={e => updateBlock(id, { text: e.target.value })} placeholder="Bible verse text..." className="w-full px-3 py-2 border rounded-lg text-sm min-h-[80px] resize-y" />
                        <input value={data.reference} onChange={e => updateBlock(id, { reference: e.target.value })} placeholder="Reference (e.g. John 3:16)" className="w-full px-3 py-2 border rounded-lg text-sm" />
                    </div>
                );
            case 'quote':
                return (
                    <div className="space-y-2">
                        <textarea value={data.text} onChange={e => updateBlock(id, { text: e.target.value })} placeholder="Quote text..." className="w-full px-3 py-2 border rounded-lg text-sm min-h-[80px] resize-y italic" />
                        <input value={data.author} onChange={e => updateBlock(id, { author: e.target.value })} placeholder="Author" className="w-full px-3 py-2 border rounded-lg text-sm" />
                    </div>
                );
            case 'image':
                return (
                    <div className="space-y-2">
                        <input value={data.url} onChange={e => updateBlock(id, { url: e.target.value })} placeholder="Image URL (from media library)" className="w-full px-3 py-2 border rounded-lg text-sm" />
                        <input value={data.caption} onChange={e => updateBlock(id, { caption: e.target.value })} placeholder="Caption" className="w-full px-3 py-2 border rounded-lg text-sm" />
                        <input value={data.alt} onChange={e => updateBlock(id, { alt: e.target.value })} placeholder="Alt text (Malayalam)" className="w-full px-3 py-2 border rounded-lg text-sm" />
                        {data.url && <img src={data.url} alt={data.alt} className="max-h-48 rounded-lg object-cover" />}
                    </div>
                );
            case 'divider':
                return <hr className="border-gray-300" />;
            case 'callout':
                return <textarea value={data.text} onChange={e => updateBlock(id, { text: e.target.value })} placeholder="Callout text..." className="w-full px-3 py-2 border-l-4 border-yellow-400 bg-yellow-50 rounded-r-lg text-sm min-h-[60px] resize-y" />;
            case 'list':
                return (
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={data.ordered} onChange={e => updateBlock(id, { ordered: e.target.checked })} /> Ordered list
                        </label>
                        {(data.items || ['']).map((item: string, i: number) => (
                            <div key={i} className="flex gap-2">
                                <span className="text-gray-400 mt-2 text-sm">{data.ordered ? `${i + 1}.` : '•'}</span>
                                <input
                                    value={item}
                                    onChange={e => {
                                        const newItems = [...(data.items || [''])];
                                        newItems[i] = e.target.value;
                                        updateBlock(id, { items: newItems });
                                    }}
                                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                                    placeholder="List item..."
                                />
                                <button
                                    onClick={() => {
                                        const newItems = (data.items || ['']).filter((_: any, idx: number) => idx !== i);
                                        updateBlock(id, { items: newItems.length ? newItems : [''] });
                                    }}
                                    className="text-red-400 hover:text-red-600 text-sm"
                                >×</button>
                            </div>
                        ))}
                        <button onClick={() => updateBlock(id, { items: [...(data.items || ['']), ''] })} className="text-teal text-sm font-medium">+ Add item</button>
                    </div>
                );
            case 'youtube':
                return <input value={data.url} onChange={e => updateBlock(id, { url: e.target.value })} placeholder="YouTube URL" className="w-full px-3 py-2 border rounded-lg text-sm" />;
            default:
                return <p className="text-gray-400 text-sm">Unknown block type</p>;
        }
    };

    return (
        <div className="space-y-4">
            {blocks.map((block, idx) => (
                <div key={block.id} className="bg-white border border-gray-200 rounded-xl p-4 group relative">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{block.type.replace('_', ' ')}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => moveBlock(idx, -1)} className="p-1 text-gray-400 hover:text-gray-600"><HiOutlineArrowUp size={14} /></button>
                            <button onClick={() => moveBlock(idx, 1)} className="p-1 text-gray-400 hover:text-gray-600"><HiOutlineArrowDown size={14} /></button>
                            <button onClick={() => removeBlock(block.id)} className="p-1 text-red-400 hover:text-red-600"><HiOutlineTrash size={14} /></button>
                        </div>
                    </div>
                    {renderBlockEditor(block, idx)}
                </div>
            ))}

            {/* Add block buttons */}
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-3 font-medium">Add Block</p>
                <div className="flex flex-wrap gap-2">
                    {BLOCK_TYPES.map(bt => (
                        <button key={bt.type} onClick={() => addBlock(bt.type)} className="px-3 py-1.5 bg-gray-100 hover:bg-teal hover:text-white text-gray-600 rounded-lg text-xs font-medium transition-colors">
                            {bt.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlockEditor;
