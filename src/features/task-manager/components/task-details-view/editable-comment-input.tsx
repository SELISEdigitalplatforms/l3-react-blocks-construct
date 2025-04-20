import { useState, useEffect } from 'react';
import { Button } from 'components/ui/button';

interface EditableCommentInputProps {
  initialContent: string;
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  submitName?: string;
  cancelButton?: string;
}

export function EditableCommentInput({
  initialContent,
  onSubmit,
  onCancel,
}: EditableCommentInputProps) {
  const [content, setContent] = useState(initialContent);
  const [isMounted, setIsMounted] = useState(false);
  const [EditorComponent, setEditorComponent] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);

    import('../../../../components/blocks/custom-text-editor/custom-text-editor')
      .then((module) => {
        setEditorComponent(() => module.default);
      })
      .catch((error) => {
        console.error('Error loading editor:', error);
      });
  }, []);

  const handleSave = () => {
    if (content.trim()) {
      onSubmit(content);
    }
  };

  const handleCancel = () => {
    setContent(initialContent);
    if (onCancel) onCancel();
  };

  return (
    <div>
      {isMounted && EditorComponent ? (
        <div>
          <EditorComponent value={content} onChange={setContent} showIcons={false} />
          <div className="flex justify-end mt-4">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-semibold border"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                className="text-sm font-semibold ml-2"
                onClick={handleSave}
              >
                comment
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded-md p-4">Loading editor...</div>
      )}
    </div>
  );
}
