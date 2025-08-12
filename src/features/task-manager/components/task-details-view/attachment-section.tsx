import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { Button } from 'components/ui/button';
import {
  Plus,
  Upload,
  Download,
  Trash2,
  File,
  ImageIcon,
  ChevronDown,
  Loader2,
  FileText,
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'components/ui/dialog';
import { Label } from 'components/ui/label';
import { Input } from 'components/ui/input';
import { useToast } from 'hooks/use-toast';
import {
  TaskAttachments,
  FileType,
  TaskAttachmentInsertInput,
} from '../../types/task-manager.types';
import { useCreateTaskAttachment, useDeleteTaskAttachment } from '../../hooks/use-task-manager';

/**
 * AttachmentsSection Component
 *
 * A reusable component for managing task attachments. This component allows users to:
 * - Upload files via drag-and-drop or file selection
 * - View uploaded attachments with details such as name, size, and type
 * - Delete attachments
 * - Show more or fewer attachments in a paginated view
 *
 * Features:
 * - Drag-and-drop file upload with visual feedback
 * - File type and size validation
 * - Displays attachments in a grid layout
 * - Allows users to delete attachments
 * - Supports showing more or fewer attachments with a toggle button
 *
 * Props:
 * @param {Attachment[]} attachments - The list of current attachments
 * @param {React.Dispatch<React.SetStateAction<Attachment[]>>} setAttachments - Callback to update the attachments list
 *
 * @returns {JSX.Element} The attachments section component
 *
 * @example
 * // Basic usage
 * <AttachmentsSection
 *   attachments={taskAttachments}
 *   setAttachments={setTaskAttachments}
 * />
 */

interface AttachmentsSectionProps {
  taskId?: string;
  attachments: TaskAttachments[];
  onAttachmentsChange: () => void;
  isLoading?: boolean;
}

export function AttachmentsSection({
  taskId,
  attachments = [],
  onAttachmentsChange,
  isLoading = false,
}: Readonly<AttachmentsSectionProps>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const { t } = useTranslation();
  const { toast } = useToast();
  const { mutate: createAttachment } = useCreateTaskAttachment();
  const { mutate: deleteAttachment } = useDeleteTaskAttachment();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileType = (file: File): FileType => {
    if (file.type.includes('pdf')) return 'pdf';
    if (file.type.includes('image')) return 'image';
    return 'other';
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!taskId) return;

      const uploadPromises = acceptedFiles.map((file) => {
        const fileId = uuidv4();
        const fileSize = formatFileSize(file.size);
        const fileType = getFileType(file);

        const attachmentInput: TaskAttachmentInsertInput = {
          ItemId: fileId,
          TaskId: taskId,
          FileName: file.name,
          FileSize: fileSize,
          FileType: fileType,
          CreatedDate: new Date().toISOString(),
        };

        return new Promise<void>((resolve, reject) => {
          createAttachment(attachmentInput, {
            onError: (error) => {
              console.error('Error uploading attachment:', error);
              reject(error);
            },
            onSettled: () => {
              resolve();
            },
          });
        });
      });

      Promise.all(uploadPromises)
        .then(() => {
          onAttachmentsChange();
          setIsDialogOpen(false);
        })
        .catch((error) => {
          console.error('Error uploading files:', error);
          toast({
            variant: 'destructive',
            title: t('Error'),
            description: t('Failed to upload files'),
          });
        });
    },
    [taskId, t, toast, createAttachment, onAttachmentsChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 25 * 1024 * 1024, // 25MB
    multiple: true,
    disabled: !taskId || isLoading,
  });

  const handleDeleteAttachment = (id: string) => {
    deleteAttachment(id, {
      onError: (error) => {
        console.error('Error deleting attachment:', error);
        toast({
          title: t('Error'),
          description: t('Failed to delete attachment. Please try again.'),
        });
      },
      onSuccess: () => {
        onAttachmentsChange();
      },
    });
  };

  const handleDownload = async (attachment: TaskAttachments) => {
    try {
      const content = `File: ${attachment.FileName}\nSize: ${attachment.FileSize}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.FileName || 'attachment.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error creating download:', error);
    }
  };

  const getFileIcon = (type: string) => {
    const iconContainerClass =
      'flex-shrink-0 flex items-center justify-center w-12 h-10 rounded-[7px]';

    switch (type) {
      case 'pdf':
        return (
          <div className={`${iconContainerClass} bg-primary-50`}>
            <FileText className="h-5 w-5 text-primary" />
          </div>
        );
      case 'image':
        return (
          <div className={`${iconContainerClass} bg-error-background`}>
            <ImageIcon className="h-5 w-5 text-error" />
          </div>
        );
      default:
        return (
          <div className={`${iconContainerClass} bg-primary-50`}>
            <File className="h-5 w-5 text-primary" />
          </div>
        );
    }
  };

  const createAttachmentRows = () => {
    const rows = [];
    for (let i = 0; i < attachments.length; i += 2) {
      rows.push(attachments.slice(i, i + 2));
    }
    return rows;
  };

  const attachmentRows = createAttachmentRows();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Label className="text-high-emphasis text-base font-semibold">{t('ATTACHMENTS')}</Label>
        {attachments.length > 0 && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-sm flex items-center gap-1 text-green-600"
              >
                <Plus className="h-4 w-4" />
                {t('ADD')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] md:max-w-[672px]">
              <DialogHeader>
                <DialogTitle>{t('UPLOAD_ATTACHMENTS')}</DialogTitle>
              </DialogHeader>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-300 hover:border-primary/50'
                }`}
              >
                <Input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                  {isLoading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-sm">{t('UPLOADING')}...</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-gray-400" />
                      {isDragActive ? (
                        <p>{t('DROP_FILES_HERE')}</p>
                      ) : (
                        <>
                          <p className="text-sm font-medium">{t('DRAG_AND_DROP_FILES_HERE')}</p>
                          <p className="text-xs text-gray-500">
                            {t('UPLOAD_ANY_FILE_TYPE_MAX_SIZE')}: 25MB
                          </p>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : attachments.length === 0 ? (
        <div
          {...getRootProps()}
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors border-gray-300 hover:border-primary/50"
        >
          <Input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            {isLoading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm">{t('UPLOADING')}...</p>
              </div>
            ) : (
              <>
                <Upload className="h-10 w-10 text-gray-400" />
                <p className="text-sm font-medium">{t('DRAG_AND_DROP_FILES_HERE')}</p>
                <p className="text-xs text-gray-500">
                  PDF, DOCX, JPG, PNG | {t('MAX_SIZE')}: 25MB {t('PER_FILE')}
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div>
          {(showMore ? attachmentRows : attachmentRows.slice(0, 2)).map((row, rowIndex) => (
            <div
              key={`${row.length}-${rowIndex}`}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2"
            >
              {row.map((attachment) => (
                <div key={attachment.ItemId} className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    {getFileIcon(attachment.FileType)}
                    <div>
                      <p className="text-sm font-medium">{attachment.FileName}</p>
                      <p className="text-xs text-gray-500">{attachment.FileSize}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-medium-emphasis hover:text-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(attachment);
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-error hover:text-error"
                      onClick={() => handleDeleteAttachment(attachment.ItemId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ))}
          {attachments.length > 4 && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-sm font-semibold border"
              onClick={() => setShowMore(!showMore)}
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform ${showMore ? 'rotate-180' : ''}`}
              />
              {showMore ? t('SHOW_LESS') : t('SHOW_MORE')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
