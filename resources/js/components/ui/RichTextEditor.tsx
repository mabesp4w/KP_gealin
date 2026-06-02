import { useRef, useState, useCallback } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export interface RichTextEditorProps {
    label?: string;
    value?: string;
    onChange?: (value: string) => void;
    onBlur?: () => void;
    error?: string;
    required?: boolean;
    placeholder?: string;
    height?: number;
    disabled?: boolean;
}

export function RichTextEditor({
    label,
    value = '',
    onChange,
    onBlur,
    error,
    required,
    placeholder = 'Tulis konten di sini...',
    height = 400,
    disabled = false,
}: RichTextEditorProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const editorRef = useRef<any>(null);
    const [ready, setReady] = useState(false);

    const handleInit = useCallback((_evt: unknown, editor: any) => {
        editorRef.current = editor;
        setReady(true);
    }, []);

    return (
        <div className="form-control w-full">
            {label && (
                <label className="label">
                    <span className="label-text font-medium">
                        {label}
                        {required && <span className="text-error ml-1">*</span>}
                    </span>
                </label>
            )}
            <div className={`rounded-lg border ${error ? 'border-error' : 'border-base-300'}`}>
                {!ready && (
                    <div className="flex items-center justify-center bg-base-200/50" style={{ height }}>
                        <span className="loading loading-spinner loading-md text-primary" />
                        <span className="ml-2 text-sm text-base-content/60">Memuat editor...</span>
                    </div>
                )}
                <Editor
                    apiKey={import.meta.env.VITE_API_TINYMCE}
                    onInit={handleInit}
                    value={value}
                    onEditorChange={(content) => {
                        onChange?.(content);
                    }}
                    onBlur={onBlur}
                    disabled={disabled}
                    init={{
                        height,
                        menubar: true,
                        plugins: [
                            'advlist',
                            'autolink',
                            'lists',
                            'link',
                            'image',
                            'charmap',
                            'preview',
                            'anchor',
                            'searchreplace',
                            'visualblocks',
                            'code',
                            'fullscreen',
                            'insertdatetime',
                            'media',
                            'table',
                            'wordcount',
                        ],
                        toolbar:
                            'undo redo | blocks | ' +
                            'bold italic forecolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'link image media | removeformat | code fullscreen',
                        content_style:
                            'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 14px; }',
                        placeholder,
                        branding: false,
                        promotion: false,
                    }}
                />
            </div>
            {error && <span className="text-error text-xs mt-1">{error}</span>}
        </div>
    );
}
