import Quill from 'quill';
import { useEffect, useRef } from 'react';
import { Button } from 'components/ui/button';
import { Paperclip, Smile, Image } from 'lucide-react';
import 'quill/dist/quill.snow.css';

/**
 * CustomTextEditor Component
 *
 * A rich text editor component built with Quill that provides formatting options
 * and custom submission controls.
 *
 * Features:
 * - Rich text editing with Quill editor
 * - Formatting options including bold, italic, lists, alignment, etc.
 * - Configurable submit and cancel buttons
 * - Optional icon display for additional media functions
 * - Two-way binding with parent component
 *
 * Props:
 * @param {string} value - The HTML content to display in the editor
 * @param {(content: string) => void} onChange - Callback function when content changes
 * @param {string} submitName - Text displayed on the submit button
 * @param {string} cancelButton - Text displayed on the cancel button
 * @param {boolean} [showIcons=true] - Whether to show the media icons (image, paperclip, smile)
 * @param {() => void} [onSubmit] - Callback function when submit button is clicked
 * @param {() => void} [onCancel] - Callback function when cancel button is clicked
 *
 * @returns {JSX.Element} A rich text editor with formatting toolbar and action buttons
 *
 * @example
 * // Basic usage
 * <CustomTextEditor
 *   value={editorContent}
 *   onChange={(content) => setEditorContent(content)}
 *   submitName="Save"
 *   cancelButton="Cancel"
 *   onSubmit={handleSave}
 *   onCancel={handleCancel}
 * />
 *
 * // Without icons
 * <CustomTextEditor
 *   value={editorContent}
 *   onChange={(content) => setEditorContent(content)}
 *   submitName="Post"
 *   cancelButton="Discard"
 *   showIcons={false}
 *   onSubmit={handlePost}
 *   onCancel={handleDiscard}
 * />
 */

interface CustomTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  submitName?: string;
  cancelButton?: string;
  showIcons?: boolean;
  onSubmit?: () => void;
  onCancel?: () => void;
}

const CustomTextEditor = ({
  value,
  onChange,
  submitName,
  onSubmit,
  onCancel,
  cancelButton,
  showIcons = true,
}: Readonly<CustomTextEditorProps>) => {
  const quillRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (quillRef.current && !editorRef.current) {
      editorRef.current = new Quill(quillRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ align: [] }],
            [{ direction: 'rtl' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            ['link'],
            ['clean'],
          ],
        },
      });

      editorRef.current.on('text-change', () => {
        if (onChange) {
          if (editorRef.current) {
            onChange(editorRef.current.root.innerHTML);
          }
        }
      });
    }

    if (value && editorRef.current && editorRef.current.root.innerHTML !== value) {
      editorRef.current.root.innerHTML = value;
    }
  }, [value, onChange]);

  return (
    <>
      <div ref={quillRef} />
      <div className={`flex flex-row gap-4 ${showIcons ? 'justify-between mt-4' : 'justify-end'}`}>
        {showIcons && (
          <div className="flex gap-4">
            <Image className="h-4 w-4" />
            <Paperclip className="h-4 w-4" />
            <Smile className="h-4 w-4" />
          </div>
        )}
        <div className="flex gap-4">
          {cancelButton && (
            <Button onClick={onCancel} variant={'outline'}>
              {cancelButton}
            </Button>
          )}
          {submitName && <Button onClick={onSubmit}>{submitName}</Button>}
        </div>
      </div>
    </>
  );
};

export default CustomTextEditor;
