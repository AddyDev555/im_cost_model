'use client'; // Important for Next.js 13+ with app directory

import React, { useMemo, useState, useCallback } from 'react';
import { createEditor, Editor, Transforms, Text } from 'slate';
import { Slate, Editable, withReact, useSlate } from 'slate-react';
import { withHistory } from 'slate-history';
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    List,
    Undo,
    Redo
} from 'lucide-react';

// Serialize Slate content to markup string
const serializeToMarkup = (nodes) => {
    if (!nodes || !Array.isArray(nodes)) return '';
    return nodes.map(n => serializeNode(n)).join('\n');
};

const serializeNode = (node) => {
    if (Text.isText(node)) {
        let text = node.text;
        if (node.bold) text = `**${text}**`;
        if (node.italic) text = `*${text}*`;
        if (node.underline) text = `__${text}__`;
        if (node.strikethrough) text = `~~${text}~~`;
        return text;
    }

    const children = node.children.map(n => serializeNode(n)).join('');

    switch (node.type) {
        case 'paragraph':
            let alignPrefix = '';
            if (node.align === 'center') alignPrefix = '[center]';
            if (node.align === 'right') alignPrefix = '[right]';
            if (node.align === 'justify') alignPrefix = '[justify]';
            return alignPrefix + children;
        case 'bulleted-list':
            return children;
        case 'list-item':
            return `- ${children}`;
        default:
            return children;
    }
};

// Deserialize markup string back to Slate content
const deserializeFromMarkup = (markup) => {
    if (!markup || typeof markup !== 'string') {
        return [{ type: 'paragraph', children: [{ text: '' }] }];
    }

    const lines = markup.split('\n');
    return lines.map(line => {
        let align = undefined;
        let content = line;

        // Check for alignment
        if (line.startsWith('[center]')) {
            align = 'center';
            content = line.substring(8);
        } else if (line.startsWith('[right]')) {
            align = 'right';
            content = line.substring(7);
        } else if (line.startsWith('[justify]')) {
            align = 'justify';
            content = line.substring(9);
        }

        const children = parseInlineStyles(content);

        return {
            type: 'paragraph',
            align,
            children: children.length > 0 ? children : [{ text: '' }]
        };
    });
};

const parseInlineStyles = (text) => {
    const children = [];

    // Regex to match styled text: **bold**, *italic*, __underline__, ~~strikethrough~~
    const regex = /(\*\*.*?\*\*|\*.*?\*|__.*?__|~~.*?~~)/g;
    let match;
    let lastIndex = 0;

    while ((match = regex.exec(text)) !== null) {
        // Add plain text before the match
        if (match.index > lastIndex) {
            const plainText = text.substring(lastIndex, match.index);
            if (plainText) {
                children.push({ text: plainText });
            }
        }

        const matched = match[0];
        let content = matched;
        const marks = {};

        // Parse bold
        if (matched.startsWith('**') && matched.endsWith('**')) {
            content = matched.slice(2, -2);
            marks.bold = true;
        }
        // Parse italic
        else if (matched.startsWith('*') && matched.endsWith('*')) {
            content = matched.slice(1, -1);
            marks.italic = true;
        }
        // Parse underline
        else if (matched.startsWith('__') && matched.endsWith('__')) {
            content = matched.slice(2, -2);
            marks.underline = true;
        }
        // Parse strikethrough
        else if (matched.startsWith('~~') && matched.endsWith('~~')) {
            content = matched.slice(2, -2);
            marks.strikethrough = true;
        }

        children.push({ text: content, ...marks });
        lastIndex = regex.lastIndex;
    }

    // Add remaining plain text
    if (lastIndex < text.length) {
        const plainText = text.substring(lastIndex);
        if (plainText) {
            children.push({ text: plainText });
        }
    }

    return children.length > 0 ? children : [{ text: '' }];
};

// Export helper functions for use in parent component
export const notesToMarkup = (notes) => {
    if (typeof notes === 'string') return notes;
    if (Array.isArray(notes)) return serializeToMarkup(notes);
    return '';
};

export const markupToNotes = (markup) => {
    if (Array.isArray(markup)) return markup;
    if (typeof markup === 'string') return deserializeFromMarkup(markup);
    return [{ type: 'paragraph', children: [{ text: '' }] }];
};

export default function SlateEditor({ notes, setNotes }) {
    const editor = useMemo(() => withHistory(withReact(createEditor())), []);

    const initialValue = useMemo(() => {
        if (notes) {
            // If notes is a string (markup), deserialize it
            if (typeof notes === 'string') {
                return deserializeFromMarkup(notes);
            }
            // If notes is already an array (Slate format), use it
            if (Array.isArray(notes) && notes.length > 0) {
                return notes;
            }
        }
        return [{ type: 'paragraph', children: [{ text: '' }] }];
    }, []);

    const renderLeaf = useCallback(props => <Leaf {...props} />, []);

    // Helpers
    const isMarkActive = (editor, format) => {
        const marks = Editor.marks(editor);
        return marks ? marks[format] === true : false;
    };

    const toggleMark = (editor, format) => {
        const isActive = isMarkActive(editor, format);
        if (isActive) {
            Editor.removeMark(editor, format);
        } else {
            Editor.addMark(editor, format, true);
        }
    };

    const LIST_TYPES = ['numbered-list', 'bulleted-list'];
    const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'];

    const toggleBlock = (editor, format) => {
        const isActive = isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type');
        const isList = LIST_TYPES.includes(format);

        let newProperties;
        if (TEXT_ALIGN_TYPES.includes(format)) {
            newProperties = { align: isActive ? undefined : format };
            Transforms.setNodes(editor, newProperties);
        } else {
            const isListActive = isBlockActive(editor, 'bulleted-list', 'type') || isBlockActive(editor, 'numbered-list', 'type');

            Transforms.unwrapNodes(editor, {
                match: n => !Editor.isEditor(n) && LIST_TYPES.includes(n.type),
                split: true,
            });

            Transforms.setNodes(editor, { type: isListActive ? 'paragraph' : 'list-item' });

            if (!isListActive && isList) {
                const block = { type: format, children: [] };
                Transforms.wrapNodes(editor, block);
            }
        }
    };

    const isBlockActive = (editor, format, blockType = 'type') => {
        const { selection } = editor;
        if (!selection) return false;

        const [match] = Array.from(
            Editor.nodes(editor, {
                at: Editor.unhangRange(editor, selection),
                match: n => !Editor.isEditor(n) && n[blockType] === format,
            })
        );

        return !!match;
    };

    const renderElement = useCallback(props => <Element {...props} />, []);

    const onKeyDown = useCallback(event => {
        if (!event.ctrlKey) {
            return;
        }

        // The user wants Ctrl+Shift+Z for redo, which is common on Windows.
        if (event.shiftKey && event.key.toLowerCase() === 'z') {
            event.preventDefault();
            editor.redo();
            return;
        }

        switch (event.key.toLowerCase()) {
            case 'z':
                event.preventDefault();
                editor.undo();
                break;
            case 'b':
                event.preventDefault();
                toggleMark(editor, 'bold');
                break;
            case 'i':
                event.preventDefault();
                toggleMark(editor, 'italic');
                break;
            case 'u':
                event.preventDefault();
                toggleMark(editor, 'underline');
                break;
        }
    }, [editor]);

    // Convert Slate content to markup string when saving
    const handleChange = useCallback((newValue) => {
        const markupString = serializeToMarkup(newValue);
        setNotes(markupString);
    }, [setNotes]);

    return (
        <div className="border rounded shadow-md bg-white">
            <Slate
                editor={editor}
                initialValue={initialValue}
                onChange={handleChange}
            >
                <Toolbar toggleMark={toggleMark} isMarkActive={isMarkActive} toggleBlock={toggleBlock} isBlockActive={isBlockActive} />
                <Editable
                    renderLeaf={renderLeaf}
                    renderElement={renderElement}
                    onKeyDown={onKeyDown}
                    placeholder="Add you Note…"
                    className="min-h-[150px] p-2 outline-none"
                />
            </Slate>

        </div>
    );
}

const Element = ({ attributes, children, element }) => {
    const style = { textAlign: element.align };
    switch (element.type) {
        case 'bulleted-list':
            return <ul style={style} {...attributes}>{children}</ul>;
        case 'list-item':
            return <li style={style} {...attributes}>{children}</li>;
        default:
            return <p style={style} {...attributes}>{children}</p>;
    }
};

const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) children = <strong>{children}</strong>;
    if (leaf.italic) children = <em>{children}</em>;
    if (leaf.underline) children = <u>{children}</u>;
    if (leaf.strikethrough) children = <s>{children}</s>;

    return <span {...attributes}>{children}</span>;
};

const Toolbar = ({ toggleMark, isMarkActive, toggleBlock, isBlockActive }) => {
    const editor = useSlate();
    return (
        <div className="flex flex-wrap items-center gap-1 p-1 mb-2 bg-gray-50 rounded-t border-b">
            <button type="button" onMouseDown={() => editor.undo()} className="p-2 rounded hover:bg-gray-200"><Undo className="w-4 h-4" /></button>
            <button type="button" onMouseDown={() => editor.redo()} className="p-2 rounded hover:bg-gray-200"><Redo className="w-4 h-4" /></button>
            <div className="w-[1px] h-6 bg-gray-300 mx-1" />
            <MarkButton format="bold" icon={<Bold className="w-4 h-4" />} toggleMark={toggleMark} isMarkActive={isMarkActive} />
            <MarkButton format="italic" icon={<Italic className="w-4 h-4" />} toggleMark={toggleMark} isMarkActive={isMarkActive} />
            <MarkButton format="underline" icon={<Underline className="w-4 h-4" />} toggleMark={toggleMark} isMarkActive={isMarkActive} />
            <MarkButton format="strikethrough" icon={<Strikethrough className="w-4 h-4" />} toggleMark={toggleMark} isMarkActive={isMarkActive} />
            <div className="w-[1px] h-6 bg-gray-300 mx-1" />
            <BlockButton format="left" icon={<AlignLeft className="w-4 h-4" />} toggleBlock={toggleBlock} active={isBlockActive(editor, 'left', 'align')} />
            <BlockButton format="center" icon={<AlignCenter className="w-4 h-4" />} toggleBlock={toggleBlock} active={isBlockActive(editor, 'center', 'align')} />
            <BlockButton format="right" icon={<AlignRight className="w-4 h-4" />} toggleBlock={toggleBlock} active={isBlockActive(editor, 'right', 'align')} />
            <BlockButton format="justify" icon={<AlignJustify className="w-4 h-4" />} toggleBlock={toggleBlock} active={isBlockActive(editor, 'justify', 'align')} />
        </div>
    );
};

const MarkButton = ({ format, icon, toggleMark, isMarkActive }) => {
    const editor = useSlate();
    const isActive = isMarkActive(editor, format);
    return (
        <button
            type="button"
            onMouseDown={event => { event.preventDefault(); toggleMark(editor, format); }}
            className={`p-2 rounded ${isActive ? 'bg-violet-500 text-white' : 'hover:bg-gray-200'}`}
            title={format}
        >
            {icon}
        </button>
    );
};

const BlockButton = ({ format, icon, toggleBlock, active }) => {
    const editor = useSlate();
    return (
        <button
            type="button"
            onMouseDown={event => { event.preventDefault(); toggleBlock(editor, format); }}
            className={`p-2 rounded ${active ? 'bg-violet-500 text-white' : 'hover:bg-gray-200'}`}
            title={format}
        >
            {icon}
        </button>
    );
};