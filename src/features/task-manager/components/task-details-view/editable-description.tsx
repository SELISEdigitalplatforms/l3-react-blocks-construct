import { useEffect, useRef, useState } from 'react';
import { Button } from 'components/ui/button';
import { ChevronDown, PenLine } from 'lucide-react';
import { Label } from 'components/ui/label';
import { useTaskDetails } from '../../hooks/use-task-details';

interface EditableDescriptionProps {
  taskId?: string;
  initialContent?: string;
  onContentChange?: (content: string) => void;
}

export function EditableDescription({ initialContent, onContentChange, taskId }: EditableDescriptionProps) {
  const {task, updateTaskDetails} = useTaskDetails(taskId);
  const [content, setContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(initialContent ? false : true);
  const [isHovering, setIsHovering] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [EditorComponent, setEditorComponent] = useState<any>(null);

  const [forceRender, setForceRender] = useState(0);

  useEffect(() => {
    setIsMounted(true);

    if (isEditing) {
      import('../../../../components/blocks/custom-text-editor/custom-text-editor')
        .then((module) => {
          setEditorComponent(() => module.default);
        })
        .catch((error) => {
          console.error('Error loading editor:', error);
        });
    }
  }, [isEditing]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleSave = () => {
    if (onContentChange) {
      content && onContentChange(content);
    }

    if (content && task) {
      updateTaskDetails({ description: content });
    }

    setEditorComponent(null);

    setIsEditing(false);

    setForceRender((prev) => prev + 1);
  };

  const handleCancel = () => {
    setContent(initialContent);

    setEditorComponent(null);

    setIsEditing(false);

    setForceRender((prev) => prev + 1);
  };

  const [showMore, setShowMore] = useState(false);
  const [hasMoreLines, setHasMoreLines] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkLines = () => {
      if (contentRef.current) {
        const lineHeight = parseInt(window.getComputedStyle(contentRef.current).lineHeight) || 20;
        const height = contentRef.current.scrollHeight;
        const lineCount = Math.ceil(height / lineHeight);

        setHasMoreLines(lineCount > 5);
      }
    };

    checkLines();

    window.addEventListener('resize', checkLines);
    window.addEventListener('load', checkLines);

    return () => {
      window.removeEventListener('resize', checkLines);
      window.removeEventListener('load', checkLines);
    };
  }, [content]);

  const renderContent = () => {
    if (!content) return null;

    return (
      <div className="relative">
        <div
          ref={contentRef}
          className="ql-editor text-sm formatted-content"
          style={{
            maxHeight: !showMore && hasMoreLines ? '7.5em' : 'none',
            overflow: !showMore && hasMoreLines ? 'hidden' : 'visible',
            padding: '0',
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {hasMoreLines && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 text-sm font-semibold border"
            onClick={() => setShowMore(!showMore)}
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${showMore ? 'rotate-180' : ''}`}
            />
            {showMore ? 'Show Less' : 'Show More'}
          </Button>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (!isEditing) {
      const styleTag = document.createElement('style');
      styleTag.id = 'hide-quill-toolbar';
      document.head.appendChild(styleTag);

      return () => {
        const existingStyle = document.getElementById('hide-quill-toolbar');
        if (existingStyle) {
          document.head.removeChild(existingStyle);
        }
      };
    }
  }, [isEditing, forceRender]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      key={`editor-container-${forceRender}`}
    >
      <div className="flex items-center gap-1 h-9">
        <Label className="text-high-emphasis text-base font-semibold">Description</Label>
        {isHovering && !isEditing && (
          <Button onClick={() => setIsEditing(true)} aria-label="Edit description" variant="ghost">
            <PenLine className="h-4 w-4 text-primary" />
          </Button>
        )}
      </div>

      {isEditing ? (
        isMounted && EditorComponent ? (
          <div>
            <EditorComponent
              key={`editor-instance-${forceRender}`}
              value={content}
              onChange={handleContentChange}
              showIcons={false}
            />
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
                  Save
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="border rounded-md p-4">Loading editor...</div>
        )
      ) : (
        <div className="text-sm">{renderContent()}</div>
      )}
    </div>
  );
}
