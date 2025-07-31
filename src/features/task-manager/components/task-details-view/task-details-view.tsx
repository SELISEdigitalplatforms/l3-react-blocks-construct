import { SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarIcon, CheckCircle, CircleDashed, Trash } from 'lucide-react';
import { TaskPriority, TaskComments, TaskAttachments } from '../../types/task-manager.types';
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
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';

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
  onClose: () => void;
  taskId?: string;
  isNewTaskModalOpen?: boolean;
  onTaskAddedList?: () => void;
  addTask?: (task: Partial<TaskDetails>) => string | undefined;
};

export default function TaskDetailsView({
  onClose,
  taskId,
  isNewTaskModalOpen,
  onTaskAddedList,
  addTask,
}: Readonly<TaskDetailsViewProps>) {
  const { t } = useTranslation();
  // Use local state for tags and assignees (empty for now, ready for API integration)
  const tags = useMemo<Tag[]>(() => [], []);
  const availableAssignees = useMemo<Assignee[]>(() => [], []);
  const { columns } = useCardTasks();
  const [currentTaskId, setCurrentTaskId] = useState<string | undefined>(taskId);
  const [newTaskAdded, setNewTaskAdded] = useState<boolean>(false);
  const {
    task,
    toggleTaskCompletion,
    removeTask,
    updateTaskDetails,
    addNewComment: addComment,
    deleteComment: removeComment,
    addNewAttachment: addAttachment,
    deleteAttachment: removeAttachment,
    addNewAssignee: addAssignee,
    deleteAssignee: removeAssignee,
    addNewTag: addTag,
    deleteTag: removeTag,
  } = useTaskDetails(currentTaskId);

  // Initialize state from task
  const [date, setDate] = useState<Date | undefined>(
    task?.DueDate ? new Date(task.DueDate) : undefined
  );
  const [title, setTitle] = useState<string>(task?.Title || '');
  const [mark, setMark] = useState<boolean>(task?.IsCompleted || false);
  const [section, setSection] = useState<string>(task?.Section || '');
  const [attachments, setAttachments] = useState<Attachment[]>(
    task?.Attachments?.map((attachment) => ({
      id: attachment.ItemId,
      name: attachment.FileName,
      size: attachment.FileSize,
      type: attachment.FileType,
    })) || []
  );
  const [priority, setPriority] = useState<TaskPriority>(
    task?.Priority && Object.values(TaskPriority).includes(task.Priority as TaskPriority)
      ? (task.Priority as TaskPriority)
      : TaskPriority.MEDIUM
  );
  const [description, setDescription] = useState<string>(task?.Description || '');
  const [newCommentContent, setNewCommentContent] = useState('');
  const [isWritingComment, setIsWritingComment] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Array<{ id: string; label: string }>>(
    task?.Tags?.map((tag) => ({
      id: tag.toLowerCase().replace(/\s+/g, '-'),
      label: tag,
    })) || []
  );
  const [selectedAssignees, setSelectedAssignees] = useState<Assignee[]>(
    task?.Assignee
      ? [
          {
            id: task.Assignee.toLowerCase().replace(/\\s+/g, '-'),
            name: task.Assignee,
            avatar: '', // Default empty avatar, you might want to set a proper avatar URL
          },
        ]
      : []
  );
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const badgeArray = useMemo(() => [TaskPriority.HIGH, TaskPriority.MEDIUM, TaskPriority.LOW], []);

  const inputRef = useRef<HTMLInputElement>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Handle calendar focus management
  useEffect(() => {
    if (calendarOpen && !date) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [calendarOpen, date]);

  // Initialize comments with task comments or default values
  const [comments, setComments] = useState<TaskComments[]>(task?.Comments || []);

  // Handle comment editing
  const handleEditComment = async (id: string, newText: string) => {
    try {
      // Update the comment in the task
      await updateTaskDetails({
        Comments: comments.map((comment) => ({
          ...comment,
          Content: comment.ItemId === id ? newText : comment.Content,
        })),
      });

      // Update the UI
      setComments((prev) =>
        prev.map((comment) => ({
          ...comment,
          Content: comment.ItemId === id ? newText : comment.Content,
        }))
      );

      toast({
        title: t('SUCCESS'),
        description: t('COMMENT_UPDATED_SUCCESSFULLY'),
      });
    } catch (error) {
      console.error('Failed to update comment:', error);
      toast({
        title: t('ERROR'),
        description: t('FAILED_TO_UPDATE_COMMENT'),
        variant: 'destructive',
      });
    }
  };

  // Update local state when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.Title || '');
      setMark(!!task.IsCompleted);
      setSection(task.Section || 'To Do');
      setAttachments(
        (task.Attachments || []).map((attachment) => ({
          id: attachment.ItemId,
          name: attachment.FileName,
          size: attachment.FileSize,
          type: attachment.FileType,
        }))
      );
      setDate(task.DueDate ? new Date(task.DueDate) : undefined);
      setDescription(task.Description || '');
      // Convert string[] to Tag[] format
      setSelectedTags(
        (task.Tags || []).map((tag) => ({
          id: tag.toLowerCase().replace(/\s+/g, '-'),
          label: tag,
        }))
      );

      // Convert string | undefined to Assignee[] format
      setSelectedAssignees(
        task.Assignee
          ? [
              {
                id: task.Assignee.toLowerCase().replace(/\s+/g, '-'),
                name: task.Assignee,
                avatar: '', // Default empty avatar, you might want to set a proper avatar URL
              },
            ]
          : []
      );

      // Set priority from task or default to MEDIUM
      if (task.Priority && Object.values(TaskPriority).includes(task.Priority as TaskPriority)) {
        setPriority(task.Priority as TaskPriority);
      } else {
        setPriority(TaskPriority.MEDIUM);
      }
    } else {
      // Reset to defaults when no task is selected
      setTitle('');
      setMark(false);
      setSection('To Do');
      setAttachments([]);
      setDate(undefined);
      setDescription('');
      setSelectedTags([]);
      setSelectedAssignees([]);
      setPriority(TaskPriority.MEDIUM);
    }
  }, [
    task,
    setTitle,
    setMark,
    setSection,
    setAttachments,
    setDate,
    setDescription,
    setSelectedTags,
    setSelectedAssignees,
    setPriority,
  ]);

  const handleTitleChange = async (newTitle: string) => {
    setTitle(newTitle);
    if (currentTaskId) {
      await updateTaskDetails({ Title: newTitle });
    }
  };

  const handlePriorityChange = async (newPriority: TaskPriority) => {
    setPriority(newPriority);
    if (currentTaskId) {
      await updateTaskDetails({ Priority: newPriority });
    }
  };

  const handleStartWritingComment = () => {
    setIsWritingComment(true);
  };

  const handleCancelComment = () => {
    setIsWritingComment(false);
    setNewCommentContent('');
  };

  const handleSubmitComment = async (content: string) => {
    if (content.trim() && currentTaskId) {
      try {
        const now = new Date();
        const timestamp = format(now, 'dd.MM.yyyy, HH:mm');

        const newComment: TaskComments = {
          ItemId: Date.now().toString(),
          Author: 'Current User',
          Timestamp: timestamp,
          Content: content,
        };

        // Add the comment to the task
        await addComment(content);

        // Update the UI
        setComments((prev) => [...prev, newComment]);
        setNewCommentContent('');
        setIsWritingComment(false);

        toast({
          title: t('SUCCESS'),
          description: t('COMMENT_ADDED_SUCCESSFULLY'),
        });
      } catch (error) {
        console.error('Failed to add comment:', error);
        toast({
          title: t('ERROR'),
          description: t('FAILED_TO_ADD_COMMENT'),
          variant: 'destructive',
        });
      }
    }
  };

  // Handle comment deletion
  const handleDeleteComment = async (commentId: string) => {
    if (!currentTaskId) return;

    try {
      // Remove the comment from the task
      await removeComment(commentId);

      // Update the UI
      setComments((prev) => prev.filter((comment) => comment.ItemId !== commentId));

      toast({
        title: t('SUCCESS'),
        description: t('COMMENT_DELETED_SUCCESSFULLY'),
      });
    } catch (error) {
      console.error('Failed to delete comment:', error);
      toast({
        title: t('ERROR'),
        description: t('FAILED_TO_DELETE_COMMENT'),
        variant: 'destructive',
      });
    }
  };

  // Provide a default no-op for addTask if not provided
  const safeAddTask = addTask ?? (() => undefined);

  const handleAddItem = () => {
    if (isNewTaskModalOpen === true && !newTaskAdded) {
      // Since selectedTags is already an array of Tag objects, we can use it directly
      const newTask: Partial<TaskDetails> = {
        section: section,
        isCompleted: mark,
        title: title,
        mark: false,
        priority: priority,
        dueDate: date ?? null,
        assignees: selectedAssignees,
        description: description ?? '',
        tags: selectedTags, // Directly use selectedTags as it's already in the correct format
        attachments: attachments,
        comments: [],
      };
      const newTaskId = title && safeAddTask(newTask);
      setCurrentTaskId(newTaskId);
      setNewTaskAdded(true);
      onTaskAddedList && onTaskAddedList();
    }
  };

  const handleUpdateStatus = async () => {
    const newStatus = !mark;
    setMark(newStatus);
    if (currentTaskId) {
      await updateTaskDetails({ IsCompleted: newStatus });
      await toggleTaskCompletion(newStatus);
    }
  };

  const handleClose = () => {
    onClose();
    if (isNewTaskModalOpen && !newTaskAdded) {
      handleAddItem();
    }
  };

  // Handle section changes
  const handleSectionChange = async (newSection: string) => {
    setSection(newSection);
    if (currentTaskId) {
      await updateTaskDetails({ Section: newSection });
    }
  };

  // Handle assignee changes
  const handleAssigneeChange = async (newAssignees: Assignee[]) => {
    setSelectedAssignees(newAssignees);
    if (currentTaskId) {
      // Update the task with the first assignee's name (or undefined if no assignees)
      const assigneeName = newAssignees.length > 0 ? newAssignees[0].name : undefined;
      await updateTaskDetails({ Assignee: assigneeName });

      // Handle added assignees
      const addedAssignees = newAssignees.filter(
        (newAssign) => !selectedAssignees.some((prevAssign) => prevAssign.id === newAssign.id)
      );

      // Handle removed assignees
      const removedAssignees = selectedAssignees.filter(
        (prevAssign) => !newAssignees.some((newAssign) => newAssign.id === prevAssign.id)
      );

      // Process added assignees
      for (const assignee of addedAssignees) {
        await addAssignee(assignee.name);
      }

      // Process removed assignees
      // Since deleteAssignee removes all assignees (as per TaskItem interface),
      // we only need to call it once if there are any assignees to remove
      if (removedAssignees.length > 0) {
        await removeAssignee();
      }
    }
  };

  // Handle tag changes
  const handleTagChange = async (newTags: Array<string | { id: string; label: string }>) => {
    // Convert all tags to the correct format
    const normalizedNewTags = newTags.map((tag) =>
      typeof tag === 'string' ? { id: tag, label: tag } : tag
    );

    setSelectedTags(normalizedNewTags);

    if (currentTaskId) {
      // Update the task with the new tags (using just the labels as per TaskItem interface)
      await updateTaskDetails({
        Tags: normalizedNewTags.map((tag) => tag.label),
      });

      // Get the IDs for comparison
      const currentTagIds = selectedTags.map((tag) => tag.id);
      const newTagIds = normalizedNewTags.map((tag) => tag.id);

      // Handle added tags
      const addedTags = normalizedNewTags.filter((tag) => !currentTagIds.includes(tag.id));

      // Handle removed tags
      const removedTagIds = selectedTags
        .filter((tag) => !newTagIds.includes(tag.id))
        .map((tag) => tag.id);

      // Process added tags
      for (const tag of addedTags) {
        await addTag(tag.label);
      }

      // Process removed tags
      for (const tagId of removedTagIds) {
        await removeTag(tagId);
      }
    }
  };

  // Handle attachment changes
  const handleAttachmentChange = async (newAttachments: SetStateAction<Attachment[]>) => {
    setAttachments((prev) => {
      const updatedAttachments =
        typeof newAttachments === 'function' ? newAttachments(prev) : newAttachments;

      if (currentTaskId) {
        // Map Attachment[] to TaskAttachments[] for the update
        const taskAttachments: TaskAttachments[] = updatedAttachments.map((attachment) => ({
          ItemId: attachment.id,
          FileName: attachment.name,
          FileSize: attachment.size,
          FileType: attachment.type,
        }));

        // Update the task with the new attachments
        updateTaskDetails({ Attachments: taskAttachments });

        // Handle new attachments
        const addedAttachments = updatedAttachments.filter(
          (newAtt) => !prev.some((prevAtt) => prevAtt.id === newAtt.id)
        );

        // Handle removed attachments
        const removedAttachments = prev.filter(
          (prevAtt) => !updatedAttachments.some((newAtt) => newAtt.id === prevAtt.id)
        );

        // Process added attachments
        addedAttachments.forEach((attachment) => {
          addAttachment(attachment);
        });

        // Process removed attachments
        removedAttachments.forEach((attachment) => {
          removeAttachment(attachment.id);
        });
      }

      return updatedAttachments;
    });
  };

  const handleDeleteTask = async (): Promise<boolean> => {
    if (!currentTaskId) return false;

    try {
      const success = await removeTask();
      if (success) {
        onClose();
        toast({
          title: t('SUCCESS'),
          description: t('TASK_DELETED_SUCCESSFULLY'),
        });
        return true;
      } else {
        throw new Error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: t('ERROR'),
        description: t('FAILED_TO_DELETE_TASK'),
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleConfirm = async () => {
    const success = await handleDeleteTask();
    setOpen(false);

    if (success) {
      toast({
        variant: 'default',
        title: t('TASK_REMOVED'),
        description: t('TASK_HAS_DELETED_SUCCESSFULLY'),
      });
      onClose();
    }
  };

  return (
    <div>
      <DialogTitle />
      <DialogDescription />
      <DialogContent
        className="rounded-md sm:max-w-[720px] xl:max-h-[750px] max-h-screen flex flex-col p-0"
        onInteractOutside={() => handleAddItem()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex-1 overflow-y-auto p-6 pb-16">
          <div>
            <EditableHeading
              taskId={taskId}
              isNewTaskModalOpen={isNewTaskModalOpen}
              initialValue={title}
              onValueChange={handleTitleChange}
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
              <Select value={section} onValueChange={handleSectionChange}>
                <SelectTrigger className="mt-2 w-full h-[28px] px-2 py-1">
                  <SelectValue placeholder={t('SELECT')} />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((column) => (
                    <SelectItem key={column.ItemId} value={column.Title}>
                      {t(column.Title)}
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
                    priority={item}
                    withBorder
                    className={`px-3 py-1 cursor-pointer ${priority === item ? 'opacity-100' : 'opacity-60'}`}
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
                      selected={date || undefined}
                      onSelect={(newDate: Date | undefined) => {
                        if (newDate && !isNaN(newDate.getTime())) {
                          setDate(newDate);
                          // Convert Date to ISO string for the API
                          updateTaskDetails({ DueDate: newDate.toISOString() });
                        } else if (newDate === undefined) {
                          setDate(undefined);
                          updateTaskDetails({ DueDate: undefined });
                        } else {
                          console.error('Invalid date selected:', newDate);
                          toast({
                            title: t('ERROR'),
                            description: t('INVALID_DATE_SELECTED'),
                            variant: 'destructive',
                          });
                        }
                      }}
                      initialFocus
                    />
                    <div className="p-2 border-t">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setDate(undefined);
                          updateTaskDetails({ DueDate: undefined });
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
                onChange={handleAssigneeChange}
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
            <Tags
              availableTags={tags}
              selectedTags={selectedTags.map((tag) => (typeof tag === 'string' ? tag : tag.id))}
              onChange={handleTagChange}
            />
          </div>
          <div className="mt-6">
            <AttachmentsSection attachments={attachments} setAttachments={handleAttachmentChange} />
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
                    key={comment.ItemId}
                    author={comment.Author}
                    timestamp={comment.Timestamp}
                    initialComment={comment.Content}
                    onEdit={(newText) => handleEditComment(comment.ItemId, newText)}
                    onDelete={() => handleDeleteComment(comment.ItemId)}
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
