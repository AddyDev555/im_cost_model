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

export default function SlateEditor() {
    const editor = useMemo(() => withHistory(withReact(createEditor())), []);
    
    // Load initial value from localStorage or use a default.
    const initialValue = useMemo(() => {
        if (typeof window !== 'undefined') {
            const savedNotes = localStorage.getItem('slate-notes');
            try {
                return savedNotes ? JSON.parse(savedNotes) : [{ type: 'paragraph', children: [{ text: '' }] }];
            } catch (error) {
                console.error("Error parsing notes from localStorage:", error);
            }
        }
        return [{ type: 'paragraph', children: [{ text: '' }] }];
    }, []);

    const [value, setValue] = useState(initialValue);
    
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

    return (
        <div className="border rounded shadow-md bg-white">
            {/* In newer versions, `value` is for uncontrolled and `initialValue` for controlled components.
                We are now using a controlled component to manage saving to localStorage. */}
            <Slate
                editor={editor}
                initialValue={value}
                onChange={newValue => {
                    setValue(newValue);
                    // Save the new value to localStorage.
                    const content = JSON.stringify(newValue);
                    localStorage.setItem('slate-notes', content);
                }}
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
            {/* <div className="w-[1px] h-6 bg-gray-300 mx-1" /> */}
            {/* <BlockButton format="bulleted-list" icon={<List className="w-4 h-4" />} toggleBlock={toggleBlock} active={isBlockActive(editor, 'bulleted-list', 'type')} /> */}
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
