import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from 'components/ui/button';
import { Plus, Upload, Download, Trash2, File, ImageIcon, ChevronDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'components/ui/dialog';
import { Label } from 'components/ui/label';
import { Input } from 'components/ui/input';

interface Attachment {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'image' | 'other';
  file?: File;
}

interface AttachmentSectionProps {
  attachment?: Attachment[];
}

export function AttachmentsSection({attachment}: AttachmentSectionProps) {
  const [attachments, setAttachments] = useState<Attachment[]>(attachment || []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileType = (file: File): 'pdf' | 'image' | 'other' => {
    if (file.type.includes('pdf')) return 'pdf';
    if (file.type.includes('image')) return 'image';
    return 'other';
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newAttachments = acceptedFiles.map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: formatFileSize(file.size),
      type: getFileType(file),
      file: file,
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
    setIsDialogOpen(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
      'image/jpeg': [],
      'image/png': [],
    },
    maxSize: 25 * 1024 * 1024,
  });

  const handleDeleteAttachment = (id: string) => {
    setAttachments(attachments.filter((attachment) => attachment.id !== id));
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <File className="h-5 w-5 text-blue-500" />;
      case 'image':
        return <ImageIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <File className="h-5 w-5 text-blue-500" />;
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
        <Label className="text-high-emphasis text-base font-semibold">Attachments</Label>
        {attachments.length > 0 && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-sm flex items-center gap-1 text-green-600"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] md:max-w-[672px]">
              <DialogHeader>
                <DialogTitle>Upload Attachments</DialogTitle>
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
                  <Upload className="h-10 w-10 text-gray-400" />
                  {isDragActive ? (
                    <p>Drop the files here...</p>
                  ) : (
                    <>
                      <p className="text-sm font-medium">
                        Drag & drop files here, or click to select files
                      </p>
                      <p className="text-xs text-gray-500">
                        Upload any file type. Max file size: 10MB.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {attachments.length === 0 ? (
        <div
          {...getRootProps()}
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors border-gray-300 hover:border-primary/50"
        >
          <Input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-10 w-10 text-gray-400" />
            <p className="text-sm font-medium">Drag & drop files here, or click to select files</p>
            <p className="text-xs text-gray-500">PDF, DOCX, JPG, PNG | Max size: 25MB per file</p>
          </div>
        </div>
      ) : (
        <div>
          {(showMore ? attachmentRows : attachmentRows.slice(0, 2)).map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              {row.map((attachment) => (
                <div key={attachment.id} className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    {getFileIcon(attachment.type)}
                    <div>
                      <p className="text-sm font-medium">{attachment.name}</p>
                      <p className="text-xs text-gray-500">{attachment.size}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500"
                      onClick={() => handleDeleteAttachment(attachment.id)}
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
              {showMore ? 'Show Less' : 'Show More'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
