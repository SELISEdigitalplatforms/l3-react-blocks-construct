import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarIcon, CheckCircle, CircleDashed, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from 'components/ui/calendar';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select';
import { Label } from 'components/ui/label';
import { EditableHeading } from './editable-heading';
import { EditableComment } from './editable-comment';
import { DialogContent, DialogDescription, DialogTitle } from 'components/ui/dialog';
import { EditableDescription } from './editable-description';
import { AttachmentsSection } from './attachment-section';
import { Separator } from 'components/ui/separator';
import { Tags } from './tag-selector';
import { AssigneeSelector } from './assignee-selector';
import { Attachment, Tag, TaskDetails } from '../../services/task-service';
import { useTaskDetails } from '../../hooks/use-task-details';
import { useCardTasks } from '../../hooks/use-card-tasks';
import { useToast } from 'hooks/use-toast';
import ConfirmationModal from 'components/blocks/confirmation-modal/confirmation-modal';
import { TaskManagerBadge } from '../task-manager-ui/task-manager-badge';
import { TPriority } from '../../types/task';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { useTaskContext } from '../../contexts/task-context';

/**
 * TaskDetailsView Component
 *
 * A comprehensive component for managing and displaying task details.
 * This component supports:
 * - Viewing and editing task details such as title, description, priority, due date, and assignees
 * - Adding, editing, and deleting comments
 * - Managing tags and attachments
 * - Marking tasks as complete or reopening them
 * - Deleting tasks with confirmation
 *
 * Features:
 * - Inline editing for task title and description
 * - Dynamic updates for task properties (e.g., priority, section, due date)
 * - Comment management with inline editing and deletion
 * - Attachment management with drag-and-drop support
 * - Confirmation modal for task deletion
 *
 * Props:
 * @param {() => void} onClose - Callback to close the task details view
 * @param {string} [taskId] - The ID of the task being viewed
 * @param {TaskService} taskService - Service for managing task-related operations
 * @param {boolean} [isNewTaskModalOpen] - Whether the modal is open for creating a new task
 * @param {() => void} [onTaskAddedList] - Callback triggered when a task is added to the list
 * @param {(columnId: string, taskTitle: string) => void} [onTaskAddedCard] - Callback for adding a task to a specific column
 * @param {(columnId: string) => void} [setActiveColumn] - Callback to set the active column
 *
 * @returns {JSX.Element} The task details view component
 *
 * @example
 * // Basic usage
 * <TaskDetailsView
 *   onClose={() => console.log('Closed')}
 *   taskId="123"
 *   taskService={taskServiceInstance}
 * />
 */

interface Assignee {
  id: string;
  name: string;
  avatar: string;
}

type TaskDetailsViewProps = {
  readonly onClose: () => void;
  readonly taskId?: string;
  readonly isNewTaskModalOpen?: boolean;
  readonly onTaskAddedList?: () => void;
};

const toTranslationKey = (title: string): string => {
  return title.replace(/\s+/g, '_').toUpperCase();
};

export default function TaskDetailsView({
  onClose,
  taskId,
  isNewTaskModalOpen,
  onTaskAddedList,
}: TaskDetailsViewProps) {
  const { t } = useTranslation();
  const { addTask, tags, assignees: availableAssignees } = useTaskContext();
  const { columns } = useCardTasks();
  const [currentTaskId, setCurrentTaskId] = useState<string | undefined>(taskId);
  const [newTaskAdded, setNewTaskAdded] = useState<boolean>(false);
  const { task, toggleTaskCompletion, removeTask, updateTaskDetails } =
    useTaskDetails(currentTaskId);
  const [date, setDate] = useState<Date | undefined>(task?.dueDate ?? undefined);
  const [title, setTitle] = useState<string>(task?.title ?? '');
  const [mark, setMark] = useState<boolean>(task?.isCompleted ?? false);
  const [section, setSection] = useState<string>(task?.section ?? 'To Do');
  const [attachments, setAttachments] = useState<Attachment[]>(task?.attachments || []);
  const [priority, setPriority] = useState<string>(
    task?.priority === 'Low' || task?.priority === 'Medium' || task?.priority === 'High'
      ? task.priority
      : ''
  );
  const [newCommentContent, setNewCommentContent] = useState('');
  const [isWritingComment, setIsWritingComment] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(task?.tags.map((tag) => tag.id) || []);
  const [selectedAssignees, setSelectedAssignees] = useState<Assignee[]>(task?.assignees || []);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const badgeArray = ['Low', 'Medium', 'High'];

  const inputRef = useRef<HTMLInputElement>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    if (calendarOpen && !date) {
      // Slight delay allows the popover to fully render
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [calendarOpen, date]);

  const [description, setDescription] = useState(task?.description);
  const [comments, setComments] = useState(
    task?.comments || [
      {
        id: '1',
        author: 'Block Smith',
        timestamp: '20.03.2025, 12:00',
        text: 'Please check, review & verify.',
      },
      {
        id: '2',
        author: 'Jane Doe',
        timestamp: '20.03.2025, 13:15',
        text: 'Looks good to me. Ready for deployment.',
      },
    ]
  );

  const handleEditComment = (id: string, newText: string) => {
    setComments(
      comments.map((comment) => (comment.id === id ? { ...comment, text: newText } : comment))
    );
  };

  const handleDeleteComment = (id: string) => {
    setComments(comments.filter((comment) => comment.id !== id));
  };

  const handlePriorityChange = (value: string) => {
    if (value === 'Low' || value === 'Medium' || value === 'High') {
      setPriority(value);
      updateTaskDetails({ priority: value });
    }
  };

  const handleStartWritingComment = () => {
    setIsWritingComment(true);
  };

  const handleCancelComment = () => {
    setIsWritingComment(false);
    setNewCommentContent('');
  };

  const handleSubmitComment = (content: string) => {
    if (content.trim()) {
      const now = new Date();
      const timestamp = format(now, 'dd.MM.yyyy, HH:mm');

      const newComment = {
        id: Date.now().toString(),
        author: 'Block Smith',
        timestamp,
        text: content,
      };

      setComments([...comments, newComment]);
      setNewCommentContent('');
      setIsWritingComment(false);
    }
  };

  const handleAddItem = () => {
    if (isNewTaskModalOpen === true && !newTaskAdded) {
      const newTags: Tag[] = selectedTags
        .map((tagId) => tags.find((tag) => tag.id === tagId))
        .filter((tag): tag is Tag => tag !== undefined);

      const newTask: Partial<TaskDetails> = {
        section: section,
        isCompleted: mark,
        title: title,
        mark: false,
        priority: priority,
        dueDate: date ?? null,
        assignees: selectedAssignees,
        description: description ?? '',
        tags: newTags,
        attachments: attachments,
        comments: [],
      };
      const newTaskId = title && addTask(newTask);
      setCurrentTaskId(newTaskId);
      setNewTaskAdded(true);
      onTaskAddedList && onTaskAddedList();
    }
  };

  const handleUpdateStatus = () => {
    setMark(!mark);
    toggleTaskCompletion(!mark);
  };

  const handleClose = () => {
    onClose();
    if (isNewTaskModalOpen && !newTaskAdded) {
      handleAddItem();
    }
  };

  useEffect(() => {
    if (task && section !== task.section) {
      updateTaskDetails({ section });
    }
  }, [section, task, updateTaskDetails]);

  useEffect(() => {
    if (task && selectedAssignees !== task.assignees) {
      updateTaskDetails({ assignees: selectedAssignees });
    }
  }, [selectedAssignees, task, updateTaskDetails]);

  useEffect(() => {
    if (task && selectedTags !== task.tags.map((tag) => tag.id)) {
      const updatedTags = tags.filter((tag) => selectedTags.includes(tag.id));
      updateTaskDetails({ tags: updatedTags });
    }
  }, [selectedTags, task, tags, updateTaskDetails]);

  useEffect(() => {
    if (task && attachments !== task.attachments) {
      updateTaskDetails({ attachments: attachments });
    }
  }, [attachments, task, updateTaskDetails]);

  const handleDeleteTask = () => {
    removeTask();
    onClose();
  };

  const handleConfirm = () => {
    handleDeleteTask();
    setOpen(false);
    toast({
      variant: 'success',
      title: t('TASK_REMOVED'),
      description: t('TASK_HAS_DELETED_SUCCESSFULLY'),
    });
  };

  return (
    <div>
      <DialogTitle />
      <DialogDescription />
      <DialogContent
        className="rounded-md sm:max-w-[720px] xl:max-h-[800px] max-h-screen flex flex-col p-0"
        onInteractOutside={() => handleAddItem()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex-1 overflow-y-auto p-6 pb-16">
          <div>
            <EditableHeading
              taskId={taskId}
              isNewTaskModalOpen={isNewTaskModalOpen}
              initialValue={title}
              onValueChange={setTitle}
              className="mb-2 mt-3"
            />
            <div className="flex h-7">
              <div className="bg-surface rounded px-2 py-1 gap-2 flex items-center">
                {mark ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-xs font-semibold text-secondary">{t('COMPLETED')}</span>
                  </>
                ) : (
                  <>
                    <CircleDashed className="h-4 w-4 text-secondary" />
                    <span className="text-xs font-semibold text-secondary">{t('OPEN')}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <Label className="text-high-emphasis text-base font-semibold">{t('SECTION')}</Label>
              <Select value={section} onValueChange={setSection}>
                <SelectTrigger className="mt-2 w-full h-[28px] px-2 py-1">
                  <SelectValue placeholder={t('SELECT')} />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((column) => (
                    <SelectItem key={column.id} value={column.title}>
                      {t(toTranslationKey(column.title))}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-high-emphasis text-base font-semibold">{t('PRIORITY')}</Label>
              <div className="flex mt-2 gap-2">
                {badgeArray.map((item) => (
                  <TaskManagerBadge
                    key={item}
                    {...(task?.priority === item && { priority: task?.priority as TPriority })}
                    {...(priority === item && { priority: priority as TPriority })}
                    withBorder
                    className="px-3 py-1 cursor-pointer"
                    onClick={() => handlePriorityChange(item)}
                  >
                    {item}
                  </TaskManagerBadge>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="relative">
              <Label className="text-high-emphasis text-base font-semibold">{t('DUE_DATE')}</Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <div className="relative mt-2">
                    <Input
                      ref={inputRef}
                      value={date ? date.toLocaleDateString('en-GB') : ''}
                      readOnly
                      placeholder={t('CHOOSE_DATE')}
                      className="h-[28px] px-2 py-1"
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <div className="absolute z-10 mt-1 bg-white border rounded-md shadow-md">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => {
                        if (newDate instanceof Date && !isNaN(newDate.getTime())) {
                          setDate(newDate);
                          updateTaskDetails({ dueDate: newDate });
                        } else {
                          console.error('Invalid date selected:', newDate);
                        }
                      }}
                      initialFocus
                    />
                    <div className="p-2 border-t">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setDate(undefined);
                          updateTaskDetails({ dueDate: null });
                        }}
                        className="w-full"
                        size="sm"
                      >
                        {t('CLEAR_DATE')}
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label className="text-high-emphasis text-base font-semibold">{t('ASSIGNEE')}</Label>
              <AssigneeSelector
                availableAssignees={availableAssignees}
                selectedAssignees={selectedAssignees}
                onChange={setSelectedAssignees}
              />
            </div>
          </div>
          <div className="mt-6">
            <EditableDescription
              taskId={taskId}
              initialContent={description}
              onContentChange={(newContent) => {
                setDescription(newContent);
              }}
            />
          </div>
          <div className="mt-6">
            <Tags availableTags={tags} selectedTags={selectedTags} onChange={setSelectedTags} />
          </div>
          <div className="mt-6">
            <AttachmentsSection attachments={attachments} setAttachments={setAttachments} />
          </div>
          <Separator className="my-6" />
          {!isNewTaskModalOpen && (
            <div className="mb-4">
              <Label className="text-high-emphasis text-base font-semibold">{t('COMMENTS')}</Label>
              <div className="space-y-4 mt-3">
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <div className="h-10 w-10 rounded-full bg-gray-300 text-xs flex items-center justify-center border-2 border-white">
                      {'B'}
                    </div>
                    <Input
                      value={newCommentContent}
                      placeholder={t('WRITE_A_COMMENT')}
                      className="flex-1 text-sm"
                      onChange={(e) => setNewCommentContent(e.target.value)}
                      onClick={handleStartWritingComment}
                      readOnly={!isWritingComment} // Make input editable only when writing a comment
                    />
                  </div>
                  {isWritingComment && (
                    <div className="flex justify-end mt-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-sm font-semibold border"
                          onClick={handleCancelComment}
                        >
                          {t('CANCEL')}
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="text-sm font-semibold ml-2"
                          onClick={() => {
                            handleSubmitComment(newCommentContent);
                            setIsWritingComment(false);
                          }}
                        >
                          {t('SAVE')}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {comments.map((comment) => (
                  <EditableComment
                    key={comment.id}
                    author={comment.author}
                    timestamp={comment.timestamp}
                    initialComment={comment.text}
                    onEdit={(newText) => handleEditComment(comment.id, newText)}
                    onDelete={() => handleDeleteComment(comment.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-background">
          <Separator className="mb-3" />
          <div className="flex justify-between items-center px-6">
            <Button
              onClick={() => setOpen(true)}
              variant="ghost"
              size="icon"
              className="text-error bg-white w-12 h-10 border"
            >
              <Trash className="h-3 w-3" />
            </Button>
            <ConfirmationModal
              open={open}
              onOpenChange={setOpen}
              title={t('ARE_YOU_SURE')}
              description={t('THIS_WILL_PERMANENTLY_DELETE_THE_TASK')}
              onConfirm={handleConfirm}
            />
            <div className="flex gap-2">
              {mark ? (
                <Button variant="ghost" className="h-10 border" onClick={handleUpdateStatus}>
                  <CircleDashed className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-high-emphasis">{t('REOPEN_TASK')}</span>
                </Button>
              ) : (
                <Button variant="ghost" className="h-10 border" onClick={handleUpdateStatus}>
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-high-emphasis">
                    {t('MARK_AS_COMPLETE')}
                  </span>
                </Button>
              )}

              <Button variant="ghost" className="h-10 border" onClick={handleClose}>
                <span className="text-sm font-bold text-high-emphasis">{t('CLOSE')}</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </div>
  );
}
