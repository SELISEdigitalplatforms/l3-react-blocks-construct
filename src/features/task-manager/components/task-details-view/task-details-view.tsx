import { SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarIcon, CheckCircle, CircleDashed, Trash } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import {
  useCreateTags,
  useGetTaskTags,
  useGetUsers,
  useCreateTaskItem,
} from '../../hooks/use-task-manager';
import {
  Assignee,
  ItemTag,
  TaskItem,
  TaskTagInsertInput,
  TaskPriority,
  TaskComments,
  TaskAttachments,
  priorityStyle,
} from '../../types/task-manager.types';
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
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from 'components/ui/dialog';
import { EditableDescription } from './editable-description';
import { AttachmentsSection } from './attachment-section';
import { Separator } from 'components/ui/separator';
import { Tags } from './tag-selector';
import { AssigneeSelector } from './assignee-selector';
import { useTaskDetails } from '../../hooks/use-task-details';
import { useCardTasks } from '../../hooks/use-card-tasks';
import { useToast } from 'hooks/use-toast';
import ConfirmationModal from 'components/blocks/confirmation-modal/confirmation-modal';
import { TaskManagerBadge } from '../task-manager-ui/task-manager-badge';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { AddTag } from '../modals/add-tag';

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
 *   onClose={() => {}}
 *   taskId="123"
 * />
 */

type TaskDetailsViewProps = {
  onClose: () => void;
  taskId?: string;
  isNewTaskModalOpen?: boolean;
  onTaskAddedList?: () => void;
  addTask?: (task: Partial<TaskItem>) => string | undefined;
};

export default function TaskDetailsView({
  onClose,
  taskId,
  isNewTaskModalOpen,
  onTaskAddedList,
  addTask,
}: Readonly<TaskDetailsViewProps>) {
  const { t } = useTranslation();
  const { data: tagsResponse } = useGetTaskTags({
    pageNo: 1,
    pageSize: 100,
  });

  const { data: usersResponse } = useGetUsers({
    page: 0,
    pageSize: 100,
  });

  const tags = useMemo<ItemTag[]>(() => {
    if (!tagsResponse?.TaskManagerTags?.items) return [];
    return tagsResponse.TaskManagerTags.items.map((tag: { ItemId: string; Label: string }) => ({
      ItemId: tag.ItemId,
      TagLabel: tag.Label,
    }));
  }, [tagsResponse]);

  const availableAssignees = useMemo<Assignee[]>(() => {
    if (!usersResponse?.data) return [];
    return usersResponse.data.map((user) => ({
      ItemId: user.itemId,
      Name: `${user.firstName} ${user.lastName || ''}`.trim(),
      ImageUrl: user.profileImageUrl ?? '',
    }));
  }, [usersResponse]);
  const { columns } = useCardTasks();
  const [currentTaskId, setCurrentTaskId] = useState<string | undefined>(taskId);
  const [newTaskAdded, setNewTaskAdded] = useState<boolean>(false);
  const {
    task,
    removeTask,
    updateTaskDetails,
    addNewComment: addComment,
    deleteComment: removeComment,
    addNewAttachment: addAttachment,
    deleteAttachment: removeAttachment,
    addNewTag: addTagToTask,
    deleteTag: removeTag,
  } = useTaskDetails(currentTaskId);

  const { mutate: createTag, isPending: isCreatingTag } = useCreateTags();

  const [date, setDate] = useState<Date | undefined>(
    task?.DueDate ? new Date(task.DueDate) : undefined
  );
  const [title, setTitle] = useState<string>(task?.Title ?? '');
  const [isMarkComplete, setIsMarkComplete] = useState<boolean>(task?.IsCompleted || false);
  const [section, setSection] = useState<string>(task?.Section ?? '');
  const [attachments, setAttachments] = useState<TaskAttachments[]>(
    task?.Attachments?.map((attachment) => ({
      ItemId: attachment.ItemId,
      FileName: attachment.FileName,
      FileSize: attachment.FileSize,
      FileType: attachment.FileType,
    })) || []
  );
  const [priority, setPriority] = useState<TaskPriority>(
    task?.Priority && Object.values(TaskPriority).includes(task.Priority as TaskPriority)
      ? (task.Priority as TaskPriority)
      : TaskPriority.MEDIUM
  );
  const [description, setDescription] = useState<string>(task?.Description ?? '');
  const [newCommentContent, setNewCommentContent] = useState('');
  const [isWritingComment, setIsWritingComment] = useState(false);
  const [selectedTags, setSelectedTags] = useState<ItemTag[]>(task?.ItemTag ?? []);
  const [selectedAssignees, setSelectedAssignees] = useState<Assignee[]>([]);

  useEffect(() => {
    if (!task?.ItemTag) {
      if (selectedTags.length > 0 && !isNewTaskModalOpen) {
        setSelectedTags([]);
      }
      return;
    }

    const localTagSet = new Map(selectedTags.map((tag) => [tag.TagLabel.toLowerCase(), tag]));

    const serverTagSet = new Map(task.ItemTag.map((tag) => [tag.TagLabel.toLowerCase(), tag]));

    const hasDifference =
      selectedTags.length !== task.ItemTag.length ||
      selectedTags.some((tag) => !serverTagSet.has(tag.TagLabel.toLowerCase())) ||
      task.ItemTag.some((tag) => !localTagSet.has(tag.TagLabel.toLowerCase()));

    if (hasDifference) {
      setSelectedTags(task.ItemTag);
    }
  }, [task?.ItemTag, selectedTags, isNewTaskModalOpen, setSelectedTags]);

  useEffect(() => {
    if (!task) return;

    const currentAssigneeIds = selectedAssignees
      .map((a) => a.ItemId)
      .sort()
      .join(',');
    const newAssigneeIds = (task.Assignee ?? [])
      .map((a) => a.ItemId)
      .sort()
      .join(',');

    if (currentAssigneeIds !== newAssigneeIds) {
      if (task.Assignee && Array.isArray(task.Assignee) && task.Assignee.length > 0) {
        const newAssignees = task.Assignee.map((assignee) => ({
          ItemId: assignee.ItemId || '',
          Name: assignee.Name || '',
          ImageUrl: assignee.ImageUrl || '',
        }));
        setSelectedAssignees(newAssignees);
      } else if (selectedAssignees.length > 0) {
        setSelectedAssignees([]);
      }
    }
  }, [task, task?.Assignee, selectedAssignees]);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const badgeArray = useMemo(() => [TaskPriority.HIGH, TaskPriority.MEDIUM, TaskPriority.LOW], []);

  const inputRef = useRef<HTMLInputElement>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    if (calendarOpen && !date) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [calendarOpen, date]);

  const [comments, setComments] = useState<TaskComments[]>(task?.Comments ?? []);

  const handleEditComment = async (id: string, newText: string) => {
    try {
      await updateTaskDetails({
        Comments: comments.map((comment) => ({
          ...comment,
          Content: comment.ItemId === id ? newText : comment.Content,
        })),
      });

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
      toast({
        title: t('ERROR'),
        description: t('FAILED_TO_UPDATE_COMMENT'),
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (task) {
      setTitle(task.Title ?? '');
      setIsMarkComplete(!!task.IsCompleted);
      setSection(task.Section ?? '');
      setAttachments(
        (task.Attachments ?? []).map((attachment) => ({
          ItemId: attachment.ItemId,
          FileName: attachment.FileName,
          FileSize: attachment.FileSize,
          FileType: attachment.FileType,
        }))
      );
      setDate(task.DueDate ? new Date(task.DueDate) : undefined);
      setDescription(task.Description ?? '');
      setSelectedTags(task.ItemTag ?? []);

      if (task.Assignee) {
        if (Array.isArray(task.Assignee)) {
          setSelectedAssignees(
            task.Assignee.length > 0
              ? task.Assignee.map((assignee) => ({
                  ItemId: assignee.ItemId || '',
                  Name: assignee.Name || '',
                  ImageUrl: assignee.ImageUrl || '',
                }))
              : []
          );
        } else if (typeof task.Assignee === 'object' && task.Assignee !== null) {
          const assignee = task.Assignee as Assignee;
          setSelectedAssignees([
            {
              ItemId: assignee.ItemId || '',
              Name: assignee.Name || '',
              ImageUrl: assignee.ImageUrl || '',
            },
          ]);
        } else {
          setSelectedAssignees([]);
        }
      } else {
        setSelectedAssignees([]);
      }

      if (task.Priority && Object.values(TaskPriority).includes(task.Priority as TaskPriority)) {
        setPriority(task.Priority as TaskPriority);
      } else {
        setPriority(TaskPriority.MEDIUM);
      }
    } else {
      setTitle('');
      setIsMarkComplete(false);
      setSection('');
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
    setIsMarkComplete,
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

        await addComment(content);

        setComments((prev) => [...prev, newComment]);
        setNewCommentContent('');
        setIsWritingComment(false);

        toast({
          title: t('SUCCESS'),
          description: t('COMMENT_ADDED_SUCCESSFULLY'),
        });
      } catch (error) {
        toast({
          title: t('ERROR'),
          description: t('FAILED_TO_ADD_COMMENT'),
          variant: 'destructive',
        });
      }
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!currentTaskId) return;

    try {
      await removeComment(commentId);

      setComments((prev) => prev.filter((comment) => comment.ItemId !== commentId));

      toast({
        title: t('SUCCESS'),
        description: t('COMMENT_DELETED_SUCCESSFULLY'),
      });
    } catch (error) {
      toast({
        title: t('ERROR'),
        description: t('FAILED_TO_DELETE_COMMENT'),
        variant: 'destructive',
      });
    }
  };

  type NewTaskInput = Omit<Partial<TaskItem>, 'Assignee'> & { Assignee?: string[] };

  const { mutateAsync: createTaskItem } = useCreateTaskItem();

  const safeAddTask = async (task: NewTaskInput): Promise<string | undefined> => {
    try {
      const taskForApi: Partial<TaskItem> = {
        ...task,
        Attachments: task.Attachments?.map(({ ItemId, FileName, FileSize, FileType }) => ({
          ItemId,
          FileName,
          FileType,
          FileSize: typeof FileSize === 'string' ? parseInt(FileSize, 10) : FileSize,
        })) as any,
        Assignee: Array.isArray(task.Assignee)
          ? task.Assignee.map((id) => ({
              ItemId: id,
              Name: selectedAssignees.find((a) => a.ItemId === id)?.Name ?? '',
              ImageUrl: selectedAssignees.find((a) => a.ItemId === id)?.ImageUrl ?? '',
            }))
          : undefined,
      };

      if (addTask) {
        const result = await addTask(taskForApi);
        if (!result) {
          throw new Error('No task ID returned from addTask');
        }
        return result;
      }

      const response = await createTaskItem(taskForApi as any);
      const taskId = (response as any)?.insertTaskManagerItem?.itemId;
      if (!taskId) {
        throw new Error('No task ID returned from API response');
      }
      return taskId;
    } catch (error) {
      console.error('Error in safeAddTask:', error);
      throw error;
    }
  };

  const handleAddItem = async () => {
    if (isNewTaskModalOpen === true && !newTaskAdded) {
      const tagsToCreate = [...selectedTags];
      setSelectedTags([]);

      const newTask: NewTaskInput = {
        Section: section,
        IsCompleted: isMarkComplete,
        Title: title,
        Priority: priority,
        DueDate: date ? new Date(date).toISOString() : undefined,
        Assignee: selectedAssignees.length > 0 ? selectedAssignees.map((a) => a.ItemId) : undefined,
        Description: description ?? '',
        ItemTag: selectedTags,
        Attachments: attachments,
        Comments: [],
      };

      try {
        if (!title) {
          throw new Error('Task title is required');
        }

        const newTaskId = await safeAddTask(newTask);

        if (!newTaskId) {
          throw new Error('Failed to create task: No task ID returned');
        }

        setCurrentTaskId(newTaskId);
        setNewTaskAdded(true);

        if (tagsToCreate.length > 0) {
          const now = new Date().toISOString();
          const existingTagLabels = tags.map((tag) => tag.TagLabel.toLowerCase());
          const tagPromises = tagsToCreate
            .filter((tag) => {
              const tagLabel = typeof tag === 'string' ? tag : tag.TagLabel;
              return !existingTagLabels.includes(tagLabel.toLowerCase());
            })
            .map((tag) => {
              const tagLabel = typeof tag === 'string' ? tag : tag.TagLabel;
              return createTag({
                ItemId: uuidv4(),
                Label: tagLabel,
                CreatedDate: now,
                IsDeleted: false,
                LastUpdatedDate: now,
              } as TaskTagInsertInput);
            });

          await Promise.all(tagPromises);
        }

        toast({
          title: t('SUCCESS'),
          description: t('TASK_CREATED_SUCCESSFULLY'),
        });
        onTaskAddedList?.();
        onClose();
      } catch (error) {
        console.error('Error in handleAddItem:', error);
        toast({
          title: t('ERROR'),
          description: error instanceof Error ? error.message : t('Failed to create task or tags'),
          variant: 'destructive',
        });

        setSelectedTags(tagsToCreate);
      }
    }
  };

  const handleUpdateStatus = async () => {
    const newStatus = !isMarkComplete;
    setIsMarkComplete(newStatus);
    if (currentTaskId) {
      await updateTaskDetails({ IsCompleted: newStatus });
    }
  };

  const handleClose = () => {
    onClose();
    if (isNewTaskModalOpen && !newTaskAdded) {
      handleAddItem();
    }
  };

  const handleSectionChange = async (newSection: string) => {
    setSection(newSection);
    if (currentTaskId) {
      await updateTaskDetails({ Section: newSection });
    }
  };

  const handleAssigneeChange = async (newAssignees: Assignee[]) => {
    const previousAssignees = [...selectedAssignees];

    try {
      setSelectedAssignees(newAssignees);

      if (currentTaskId) {
        await updateTaskDetails({
          Assignee: newAssignees,
        });
      }
    } catch (error) {
      console.error('Failed to update assignees:', error);
      setSelectedAssignees(previousAssignees);

      toast({
        variant: 'destructive',
        title: t('ERROR'),
        description: t('Failed to update assignees. Please try again.'),
      });
    }
  };

  const handleTagChange = async (newTags: Array<string | ItemTag>) => {
    const normalizedNewTags = newTags.map((tag) =>
      typeof tag === 'string' ? { ItemId: uuidv4(), TagLabel: tag } : tag
    ) as ItemTag[];

    const existingTagsMap = new Map(tags.map((tag) => [tag.TagLabel.toLowerCase(), tag]));

    const processedTags = normalizedNewTags.map((tag) => {
      const existingTag = existingTagsMap.get(tag.TagLabel.toLowerCase());
      return existingTag || tag;
    });

    const uniqueTags = Array.from(
      new Map(processedTags.map((tag) => [tag.TagLabel.toLowerCase(), tag])).values()
    );

    const previousTags = [...selectedTags];

    setSelectedTags(uniqueTags);

    if (!currentTaskId) {
      return;
    }

    try {
      await updateTaskDetails({
        ItemTag: uniqueTags,
      });

      const currentTagLabels = new Set(previousTags.map((tag) => tag.TagLabel.toLowerCase()));
      const newTagLabels = new Set(uniqueTags.map((tag) => tag.TagLabel.toLowerCase()));

      const tagsToAdd = uniqueTags.filter(
        (tag) => !currentTagLabels.has(tag.TagLabel.toLowerCase())
      );
      const tagsToRemove = previousTags.filter(
        (tag) => !newTagLabels.has(tag.TagLabel.toLowerCase())
      );

      await Promise.all([
        ...tagsToAdd.map((tag) => addTagToTask(tag.TagLabel).catch(console.error)),
        ...tagsToRemove.map((tag) => removeTag(tag.ItemId).catch(console.error)),
      ]);
    } catch (error) {
      console.error('Failed to update tags:', error);
      setSelectedTags(previousTags);

      toast({
        variant: 'destructive',
        title: t('ERROR'),
        description: t('Failed to update tags. Please try again.'),
      });
    }
  };

  const handleAttachmentChange = async (newAttachments: SetStateAction<TaskAttachments[]>) => {
    setAttachments((prev) => {
      const updatedAttachments =
        typeof newAttachments === 'function' ? newAttachments(prev) : newAttachments;

      if (currentTaskId) {
        const taskAttachments: TaskAttachments[] = updatedAttachments.map((attachment) => ({
          ItemId: attachment.ItemId,
          FileName: attachment.FileName,
          FileSize: attachment.FileSize,
          FileType: attachment.FileType,
        }));

        updateTaskDetails({ Attachments: taskAttachments });

        const addedAttachments = updatedAttachments.filter(
          (newAtt) => !prev.some((prevAtt) => prevAtt.ItemId === newAtt.ItemId)
        );
        const removedAttachments = prev.filter(
          (prevAtt) => !updatedAttachments.some((newAtt) => newAtt.ItemId === prevAtt.ItemId)
        );

        addedAttachments.forEach((attachment) => {
          addAttachment(attachment);
        });
        removedAttachments.forEach((attachment) => {
          removeAttachment(attachment.ItemId);
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
        return true;
      } else {
        throw new Error('Failed to delete task');
      }
    } catch (error) {
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
      onClose();
    }
  };

  const createTagMutation = useCreateTags();

  const handleTagAdd = async (label: string) => {
    const trimmedLabel = label.trim();
    if (!trimmedLabel) return;

    const normalizedLabel = trimmedLabel.toLowerCase();
    const tagExists = selectedTags.some((tag) => tag.TagLabel.toLowerCase() === normalizedLabel);

    if (tagExists) {
      toast({
        title: t('TAG_EXISTS'),
        description: t('TAG_ALREADY_ADDED'),
        variant: 'default',
      });
      return;
    }

    try {
      let tagToAdd: ItemTag;
      const existingTag = tags.find((t) => t.TagLabel.toLowerCase() === normalizedLabel);

      if (existingTag) {
        tagToAdd = existingTag;
      } else {
        const newTagId = uuidv4();
        const tagCreateInput: TaskTagInsertInput = {
          ItemId: newTagId,
          Label: trimmedLabel,
          CreatedBy: 'current-user',
          CreatedDate: new Date().toISOString(),
          IsDeleted: false,
        };

        await createTagMutation.mutateAsync(tagCreateInput);
        tagToAdd = { ItemId: newTagId, TagLabel: trimmedLabel };
      }

      const updatedTags = [...selectedTags, tagToAdd];

      if (currentTaskId) {
        await updateTaskDetails({
          ItemTag: updatedTags,
        });
      }

      setSelectedTags(updatedTags);
    } catch (error) {
      console.error('Error adding tag:', error);
      toast({
        title: t('ERROR'),
        description: t('FAILED_TO_ADD_TAG'),
        variant: 'destructive',
      });
    }
  };

  return (
    <DialogContent
      className="rounded-md sm:max-w-[720px] xl:max-h-[750px] max-h-screen flex flex-col p-0"
      onInteractOutside={() => handleAddItem()}
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      <DialogHeader className="hidden">
        <DialogTitle />
        <DialogDescription />
      </DialogHeader>
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
              {isMarkComplete ? (
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
                  onClick={() => handlePriorityChange(item)}
                  withBorder
                  className={`px-3 py-1 cursor-pointer ${priority === item && priorityStyle[item]}`}
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
                        updateTaskDetails({ DueDate: newDate.toISOString() });
                      } else if (newDate === undefined) {
                        setDate(undefined);
                        updateTaskDetails({ DueDate: undefined });
                      } else {
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
        <div className="flex items-center w-full justify-between mt-6">
          <Tags availableTags={tags} selectedTags={selectedTags} onChange={handleTagChange} />
          <AddTag onAddTag={handleTagAdd} isLoading={isCreatingTag} />
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
                    readOnly={!isWritingComment}
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
        <div className="flex w-full justify-between items-center px-6">
          {!isNewTaskModalOpen && (
            <Button
              onClick={() => setOpen(true)}
              variant="ghost"
              size="icon"
              className="text-error bg-white w-12 h-10 border"
            >
              <Trash className="h-3 w-3" />
            </Button>
          )}
          <ConfirmationModal
            open={open}
            onOpenChange={setOpen}
            title={t('ARE_YOU_SURE')}
            description={t('THIS_WILL_PERMANENTLY_DELETE_THE_TASK')}
            onConfirm={handleConfirm}
          />
          <div className={`${isNewTaskModalOpen && 'justify-end w-full'} flex gap-2`}>
            <div className="flex gap-2">
              {isMarkComplete ? (
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
            </div>
            {isNewTaskModalOpen && !newTaskAdded ? (
              <Button
                onClick={handleAddItem}
                variant="default"
                className="h-10 px-6"
                disabled={!title?.trim()}
              >
                {t('ADD_TASK')}
              </Button>
            ) : (
              <Button variant="ghost" className="h-10 border" onClick={handleClose}>
                <span className="text-sm font-bold text-high-emphasis">{t('CLOSE')}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </DialogContent>
  );
}
