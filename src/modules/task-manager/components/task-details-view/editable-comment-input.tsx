import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui-kit/button';

/**
 * EditableCommentInput Component
 *
 * A reusable component for editing and submitting comments with a rich text editor.
 * This component supports:
 * - Loading a custom text editor dynamically
 * - Providing initial content for editing
 * - Submitting or canceling the comment editing process
 *
 * Features:
 * - Dynamically imports a custom text editor to reduce initial bundle size
 * - Allows users to edit and save comments
 * - Provides cancel functionality to revert changes
 * - Displays a loading state while the editor is being loaded
 *
 * Props:
 * @param {string} initialContent - The initial content of the comment to be edited
 * @param {(content: string) => void} onSubmit - Callback triggered when the comment is submitted
 * @param {() => void} [onCancel] - Optional callback triggered when the editing is canceled
 * @param {string} [submitName='Comment'] - Optional label for the submit button (default: "Comment")
 * @param {string} [cancelButton='Cancel'] - Optional label for the cancel button (default: "Cancel")
 *
 * @example
 * // Basic usage
 * <EditableCommentInput
 *   initialContent="This is a comment."
 *   onSubmit={(content) => console.log('Submitted:', content)}
 *   onCancel={() => console.log('Editing canceled')}
 * />
 *
 * // Custom button labels
 * <EditableCommentInput
 *   initialContent="This is a comment."
 *   onSubmit={(content) => console.log('Submitted:', content)}
 *   submitName="Save"
 *   cancelButton="Discard"
 * />
 */

interface EditableCommentInputProps {
  readonly initialContent: string;
  readonly onSubmit: (content: string) => void;
  readonly onCancel?: () => void;
  readonly submitName?: string;
  readonly cancelButton?: string;
}

type EditorComponentType = React.ComponentType<{
  value: string;
  onChange: (value: string) => void;
  showIcons: boolean;
}> | null;

export function EditableCommentInput({
  initialContent,
  onSubmit,
  onCancel,
  submitName = 'COMMENT',
  cancelButton = 'CANCEL',
}: EditableCommentInputProps) {
  const [content, setContent] = useState(initialContent);
  const [isMounted, setIsMounted] = useState(false);
  const [editorComponent, setEditorComponent] = useState<EditorComponentType>(null);
  const { t } = useTranslation();

  useEffect(() => {
    setIsMounted(true);

    import('../../../../components/core/custom-text-editor/custom-text-editor')
      .then(({ CustomTextEditor }) => {
        setEditorComponent(() => CustomTextEditor);
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
      {isMounted && editorComponent ? (
        <div>
          {React.createElement(editorComponent, {
            value: content,
            onChange: setContent,
            showIcons: false,
          })}
          <div className="flex justify-end mt-4">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-semibold border"
                onClick={handleCancel}
              >
                {t(cancelButton)}
              </Button>
              <Button
                variant="default"
                size="sm"
                className="text-sm font-semibold ml-2"
                onClick={handleSave}
              >
                {t(submitName)}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded-md p-4">{t('LOADING_EDITOR')}</div>
      )}
    </div>
  );
}
