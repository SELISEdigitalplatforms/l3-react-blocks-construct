import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui-kit/avatar';
import { CalendarIcon, CheckCircle, CircleDashed, Trash } from 'lucide-react';
import {
  useCreateTags,
  useGetTaskTags,
  useGetTaskSections,
  useGetUsers,
  useCreateTaskItem,
  useCreateTaskComment,
  useGetTaskComments,
  useUpdateTaskComment,
  useDeleteTaskComment,
} from '../../hooks/use-task-manager';
import {
  Assignee,
  ItemTag,
  TaskItem,
  TaskTagInsertInput,
  TaskCommentInsertInput,
  TaskPriority,
  TaskAttachments,
  priorityStyle,
} from '../../types/task-manager.types';
import { Calendar } from '@/components/ui-kit/calendar';
import { Button } from '@/components/ui-kit/button';
import { Input } from '@/components/ui-kit/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui-kit/select';
import { Label } from '@/components/ui-kit/label';
import { EditableHeading } from './editable-heading';
import { EditableComment } from './editable-comment';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui-kit/dialog';
import { EditableDescription, EditableDescriptionRef } from './editable-description';
import { AttachmentsSection } from './attachment-section';
import { Separator } from '@/components/ui-kit/separator';
import { Tags } from './tag-selector';
import { AssigneeSelector } from './assignee-selector';
import { useTaskDetails } from '../../hooks/use-task-details';
import { useCardTasks } from '../../hooks/use-card-tasks';
import { useToast } from '@/hooks/use-toast';
import { ConfirmationModal } from '@/components/core';
import { TaskManagerBadge } from '../task-manager-ui/task-manager-badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui-kit/popover';
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
      Name: `${user.firstName} ${user.lastName ?? ''}`.trim(),
      ImageUrl: user.profileImageUrl ?? '',
    }));
  }, [usersResponse]);
  const { columns } = useCardTasks();
  const [currentTaskId, setCurrentTaskId] = useState<string | undefined>(taskId);
  const [newTaskAdded, setNewTaskAdded] = useState<boolean>(false);
  const { task, removeTask, updateTaskDetails } = useTaskDetails(currentTaskId);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: createTag, isPending: isCreatingTag } = useCreateTags();
  const [date, setDate] = useState<Date | undefined>(
    task?.DueDate ? new Date(task.DueDate) : undefined
  );
  const [title, setTitle] = useState<string>(task?.Title ?? '');
  const [isMarkComplete, setIsMarkComplete] = useState<boolean>(task?.IsCompleted ?? false);
  const [section, setSection] = useState<string>(task?.Section ?? '');
  const [attachments, setAttachments] = useState<TaskAttachments[]>(task?.AttachmentField ?? []);
  const isLoadingAttachments = false;

  useEffect(() => {
    if (task) {
      setTitle(task.Title ?? '');
      setDescription(task.Description ?? '');
      setPriority(task.Priority ?? TaskPriority.MEDIUM);
      setSection(task.Section ?? '');
      setIsMarkComplete(task.IsCompleted ?? false);

      if (task.AttachmentField) {
        setAttachments(task.AttachmentField);
      } else {
        setAttachments([]);
      }

      if (task.ItemTag) {
        setSelectedTags(task.ItemTag);
      }

      if (task.Assignee) {
        setSelectedAssignees(task.Assignee);
      }

      if (task.DueDate) {
        setDate(new Date(task.DueDate));
      }
    }
  }, [task]);

  // Handle attachment changes and update both local state and backend
  const handleAttachmentsChange = useCallback(
    async (newAttachments: TaskAttachments[]) => {
      setAttachments(newAttachments);
      if (currentTaskId) {
        await updateTaskDetails({
          AttachmentField: newAttachments,
        });
      }
    },
    [currentTaskId, updateTaskDetails]
  );
  const [priority, setPriority] = useState<TaskPriority>(
    task?.Priority && Object.values(TaskPriority).includes(task.Priority)
      ? task.Priority
      : TaskPriority.MEDIUM
  );
  const [description, setDescription] = useState<string>(task?.Description ?? '');
  const [newCommentContent, setNewCommentContent] = useState('');
  const [isWritingComment, setIsWritingComment] = useState(false);
  const [userProfile, setUserProfile] = useState<{ fullName?: string; profileImageUrl?: string }>(
    {}
  );
  const [selectedTags, setSelectedTags] = useState<ItemTag[]>(task?.ItemTag ?? []);
  const [selectedAssignees, setSelectedAssignees] = useState<Assignee[]>(task?.Assignee || []);
  const descriptionRef = useRef<EditableDescriptionRef>(null);

  useEffect(() => {
    const profile = localStorage.getItem('userProfile');
    if (profile) {
      setUserProfile(JSON.parse(profile));
    }
  }, []);

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
  }, [task?.ItemTag, selectedTags, isNewTaskModalOpen]);

  useEffect(() => {
    if (!task) {
      setSelectedAssignees([]);
      return;
    }

    const taskAssignees = task.Assignee || [];
    const newAssignees = taskAssignees.map((assignee) => ({
      ItemId: assignee.ItemId || '',
      Name: assignee.Name || '',
      ImageUrl: assignee.ImageUrl || '',
    }));

    setSelectedAssignees((prevAssignees) => {
      if (prevAssignees.length === 0 || prevAssignees[0]?.ItemId !== newAssignees[0]?.ItemId) {
        return newAssignees;
      }
      return prevAssignees;
    });
  }, [task, task?.ItemId]);

  const badgeArray = useMemo(() => [TaskPriority.HIGH, TaskPriority.MEDIUM, TaskPriority.LOW], []);

  useEffect(() => {
    if (calendarOpen && !date) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [calendarOpen, date]);

  const {
    data: commentsData,
    isLoading: isLoadingComments,
    refetch: refetchComments,
  } = useGetTaskComments({
    pageNo: 1,
    pageSize: 100,
  });

  const comments = useMemo(() => {
    if (!commentsData?.TaskManagerComments?.items) return [];
    return commentsData.TaskManagerComments.items.filter(
      (comment) => comment.TaskId === currentTaskId
    );
  }, [commentsData, currentTaskId]);

  const { mutateAsync: updateComment } = useUpdateTaskComment();
  const { mutateAsync: deleteComment } = useDeleteTaskComment();

  const handleEditComment = async (id: string, newText: string) => {
    if (!currentTaskId) return;

    try {
      await updateComment({
        itemId: id,
        input: {
          Content: newText,
        },
      });
    } catch (error) {
      console.error('Error updating comment:', error);
      toast({
        variant: 'destructive',
        title: t('UNABLE_UPDATE_COMMENT'),
        description: t('FAILED_TO_UPDATE_COMMENT'),
      });
    }
  };

  const { data: sectionsData } = useGetTaskSections({
    pageNo: 1,
    pageSize: 100,
  });

  const defaultSection = useMemo(() => {
    return sectionsData?.TaskManagerSections?.items?.[0]?.Title ?? '';
  }, [sectionsData]);

  const resetForm = useCallback(() => {
    setTitle('');
    setIsMarkComplete(false);
    setSection(defaultSection);
    setDate(undefined);
    setDescription('');
    setSelectedTags([]);
    setSelectedAssignees([]);
    setPriority(TaskPriority.MEDIUM);
  }, [
    setTitle,
    setIsMarkComplete,
    setSection,
    setDate,
    setDescription,
    setSelectedTags,
    setSelectedAssignees,
    setPriority,
    defaultSection,
  ]);

  const setTaskAssignees = useCallback(
    (assignee: any) => {
      if (!assignee) {
        setSelectedAssignees([]);
        return;
      }

      if (Array.isArray(assignee)) {
        setSelectedAssignees(
          assignee.length > 0
            ? assignee.map((a) => ({
                ItemId: a.ItemId || '',
                Name: a.Name || '',
                ImageUrl: a.ImageUrl || '',
              }))
            : []
        );
      } else if (typeof assignee === 'object' && assignee !== null) {
        const a = assignee as Assignee;
        setSelectedAssignees([
          {
            ItemId: a.ItemId || '',
            Name: a.Name || '',
            ImageUrl: a.ImageUrl || '',
          },
        ]);
      } else {
        setSelectedAssignees([]);
      }
    },
    [setSelectedAssignees]
  );

  const setTaskPriority = useCallback(
    (priority: any) => {
      setPriority(
        priority && Object.values(TaskPriority).includes(priority) ? priority : TaskPriority.MEDIUM
      );
    },
    [setPriority]
  );

  useEffect(() => {
    if (!task) {
      resetForm();
      return;
    }

    setTitle(task.Title ?? '');
    setIsMarkComplete(!!task.IsCompleted);
    setSection(task.Section ?? '');
    setDate(task.DueDate ? new Date(task.DueDate) : undefined);
    setDescription(task.Description ?? '');
    setSelectedTags(task.ItemTag ?? []);

    setTaskAssignees(task.Assignee);
    setTaskPriority(task.Priority);
  }, [
    task,
    resetForm,
    setTitle,
    setIsMarkComplete,
    setSection,
    setDate,
    setDescription,
    setSelectedTags,
    setTaskAssignees,
    setTaskPriority,
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

  const { mutate: createComment, isPending: isCreatingComment } = useCreateTaskComment();

  const renderComments = () => {
    if (isLoadingComments) {
      return (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (comments.length === 0) {
      return null;
    }

    return comments.map((comment) => (
      <EditableComment
        key={comment.ItemId}
        author={comment.Author}
        timestamp={comment.CreatedDate ?? comment.Timestamp}
        initialComment={comment.Content}
        onEdit={(newText) => handleEditComment(comment.ItemId, newText)}
        onDelete={() => handleDeleteComment(comment.ItemId)}
      />
    ));
  };

  const handleSubmitComment = async (content: string) => {
    if (!content.trim() || !currentTaskId) return;

    try {
      const commentInput: TaskCommentInsertInput = {
        TaskId: currentTaskId,
        Content: content,
        Author: userProfile.fullName ?? '',
      };

      setNewCommentContent('');
      setIsWritingComment(false);
      createComment(commentInput);
      await refetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        variant: 'destructive',
        title: t('UNABLE_ADD_COMMENT'),
        description: t('FAILED_ADD_COMMENT'),
      });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!currentTaskId) return;

    try {
      await deleteComment(commentId);
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        variant: 'destructive',
        title: t('UNABLE_DELETE_COMMENT'),
        description: t('FAILED_TO_DELETE_COMMENT'),
      });
    }
  };

  type NewTaskInput = Omit<Partial<TaskItem>, 'Assignee'> & { Assignee?: string[] };

  const { mutateAsync: createTaskItem } = useCreateTaskItem();

  const safeAddTask = async (task: NewTaskInput): Promise<string | undefined> => {
    try {
      const taskForApi: Partial<TaskItem> = {
        ...task,
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

  const createNewTask = useCallback((): NewTaskInput => {
    return {
      Section: section,
      IsCompleted: isMarkComplete,
      Title: title,
      Priority: priority,
      DueDate: date ? new Date(date).toISOString() : undefined,
      Assignee: selectedAssignees.length > 0 ? selectedAssignees.map((a) => a.ItemId) : undefined,
      Description: description ?? '',
      ItemTag: selectedTags,
      AttachmentField: attachments.length > 0 ? attachments : undefined,
      OrganizationIds: [],
    };
  }, [
    section,
    isMarkComplete,
    title,
    priority,
    date,
    selectedAssignees,
    description,
    selectedTags,
    attachments,
  ]);

  const createNewTags = useCallback(
    async (tagsToCreate: Array<string | ItemTag>) => {
      if (tagsToCreate.length === 0) return;

      const existingTagLabels = tags.map((tag) => tag.TagLabel.toLowerCase());

      const tagPromises = tagsToCreate
        .filter((tag) => {
          const tagLabel = typeof tag === 'string' ? tag : tag.TagLabel;
          return !existingTagLabels.includes(tagLabel.toLowerCase());
        })
        .map((tag) => {
          const tagLabel = typeof tag === 'string' ? tag : tag.TagLabel;
          return createTag({
            Label: tagLabel,
          });
        });

      await Promise.all(tagPromises);
    },
    [tags, createTag]
  );

  const handleAddItem = async () => {
    if (isNewTaskModalOpen !== true || newTaskAdded) return;

    const tagsToCreate = [...selectedTags];

    try {
      if (!title) return;

      const newTask = createNewTask();
      const newTaskId = await safeAddTask(newTask);

      if (!newTaskId) {
        throw new Error('Failed to create task: No task ID returned');
      }

      setCurrentTaskId(newTaskId);
      setNewTaskAdded(true);

      await createNewTags(tagsToCreate);

      resetForm();
      setNewTaskAdded(false);
      setCurrentTaskId(undefined);
      setSelectedTags([]);

      toast({
        variant: 'success',
        title: t('TASK_CREATED'),
        description: t('TASK_CREATED_SUCCESSFULLY'),
      });

      onTaskAddedList?.();
      onClose();

      return true;
    } catch (error) {
      console.error('Error in handleAddItem:', error);
      toast({
        variant: 'destructive',
        title: t('UNABLE_CREATE_TASK'),
        description: error instanceof Error ? error.message : t('FAILED_CREATE_TASK'),
      });
      setSelectedTags(tagsToCreate);
      return false;
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
    if (isNewTaskModalOpen) {
      if (!newTaskAdded) {
        onClose();
        return;
      }
    } else {
      toast({
        variant: 'success',
        title: t('TASK_UPDATED'),
        description: t('TASK_UPDATED_SUCCESSFULLY'),
      });
    }
    onClose();
  };

  const handleAssigneeChange = useCallback(
    async (newAssignees: Assignee[]) => {
      const previousAssignees = [...selectedAssignees];
      setSelectedAssignees(newAssignees);

      if (!currentTaskId) {
        return;
      }

      try {
        const currentIds = new Set(previousAssignees.map((a) => a.ItemId));
        const newIds = new Set(newAssignees.map((a) => a.ItemId));
        const hasChanges =
          previousAssignees.length !== newAssignees.length ||
          Array.from(currentIds).some((id) => !newIds.has(id)) ||
          Array.from(newIds).some((id) => !currentIds.has(id));

        if (hasChanges) {
          updateTaskDetails({
            Assignee: newAssignees.map((a) => ({
              ItemId: a.ItemId,
              Name: a.Name,
              ImageUrl: a.ImageUrl || '',
            })),
          }).catch((error) => {
            console.error('Failed to update assignees:', error);
            setSelectedAssignees(previousAssignees);
            toast({
              variant: 'destructive',
              title: t('UNABLE_UPDATE_ASSIGNEES'),
              description: t('FAILED_UPDATE_ASSIGNEES'),
            });
          });
        }
      } catch (error) {
        console.error('Error in handleAssigneeChange:', error);
        setSelectedAssignees(previousAssignees);
        toast({
          variant: 'destructive',
          title: t('UNABLE_UPDATE_ASSIGNEES'),
          description: t('FAILED_UPDATE_ASSIGNEES'),
        });
      }
    },
    [currentTaskId, updateTaskDetails, t, selectedAssignees, toast]
  );

  const handleSectionChange = async (newSection: string) => {
    setSection(newSection);
    if (currentTaskId) {
      await updateTaskDetails({ Section: newSection });
    }
  };

  const handleTagChange = useCallback(
    async (newTags: ItemTag[]) => {
      if (isNewTaskModalOpen && !currentTaskId) {
        setSelectedTags(newTags);
        return;
      }

      if (!currentTaskId) return;

      const previousTags = [...selectedTags];

      try {
        setSelectedTags(newTags);
        await updateTaskDetails({
          ItemTag: newTags,
        });
      } catch (error) {
        console.error('Failed to update tags:', error);
        setSelectedTags(previousTags);
        toast({
          variant: 'destructive',
          title: t('UNABLE_UPDATE_TAGS'),
          description: t('FAILED_UPDATE_TAGS'),
        });
      }
    },
    [currentTaskId, selectedTags, updateTaskDetails, t, toast, isNewTaskModalOpen]
  );

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
        title: t('UNABLE_DELETE_TASK'),
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
        variant: 'destructive',
        title: t('TAG_ALREADY_EXISTS'),
        description: t('THIS_TAG_ALREADY_ADDED'),
      });
      return;
    }

    try {
      let tagToAdd: ItemTag;
      const existingTag = tags.find((t) => t.TagLabel.toLowerCase() === normalizedLabel);

      if (existingTag) {
        tagToAdd = existingTag;
      } else {
        const tagCreateInput: TaskTagInsertInput = {
          Label: trimmedLabel,
        };

        const response = await createTagMutation.mutateAsync(tagCreateInput);
        const newTagId = response.insertTaskManagerTag.itemId;
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
        title: t('UNABLE_ADD_TAG'),
        description: t('FAILED_TO_ADD_TAG'),
        variant: 'destructive',
      });
    }
  };

  return (
    <DialogContent
      onInteractOutside={(e) => {
        if (
          isNewTaskModalOpen &&
          !(e.target as HTMLElement).closest('button, a, [role="button"], [role="menuitem"]')
        ) {
          resetForm();
        }
        onClose();
      }}
      className="rounded-md sm:max-w-[720px] xl:max-h-[750px] max-h-screen flex flex-col p-0"
      onEscapeKeyDown={() => {
        if (isNewTaskModalOpen) {
          resetForm();
        }
        onClose();
      }}
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
                          variant: 'destructive',
                          title: t('INVALID_DATE_SELECTED'),
                          description: t('PLEASE_SELECT_VALID_DATE'),
                        });
                      }
                    }}
                    autoFocus
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
            <div className="w-full">
              <AssigneeSelector
                key={`assignee-selector-${task?.ItemId ?? 'new'}`}
                availableAssignees={availableAssignees}
                selectedAssignees={selectedAssignees}
                isEditMode={!isNewTaskModalOpen}
                onChange={handleAssigneeChange}
              />
            </div>
          </div>
        </div>
        <div className="mt-6">
          <EditableDescription
            ref={descriptionRef}
            taskId={taskId}
            initialContent={description}
            isNewTask={isNewTaskModalOpen}
            onContentChange={setDescription}
            onSave={async (newContent) => {
              if (taskId) {
                await updateTaskDetails({ Description: newContent });
              }
              setDescription(newContent);
            }}
          />
        </div>
        <div className="flex items-center w-full justify-between mt-6">
          <Tags availableTags={tags} selectedTags={selectedTags} onChange={handleTagChange} />
          <AddTag onAddTag={handleTagAdd} isLoading={isCreatingTag} />
        </div>
        <div className="mt-6">
          <AttachmentsSection
            taskId={taskId}
            taskItemId={task?.ItemId}
            attachments={attachments}
            onAttachmentsChange={handleAttachmentsChange}
            isLoading={isLoadingAttachments}
          />
        </div>
        <Separator className="my-6" />
        {!isNewTaskModalOpen && (
          <div className="mb-4">
            <Label className="text-high-emphasis text-base font-semibold">{t('COMMENTS')}</Label>
            <div className="space-y-4 mt-3">
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Avatar className="h-10 w-10 border-2 border-white">
                    <AvatarImage src={userProfile.profileImageUrl} alt={userProfile.fullName} />
                    <AvatarFallback className="bg-neutral-200 text-xs">
                      {userProfile.fullName?.charAt(0) ?? ''}
                    </AvatarFallback>
                  </Avatar>
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
                        onClick={() => handleSubmitComment(newCommentContent)}
                        disabled={isCreatingComment || !newCommentContent.trim()}
                      >
                        {isCreatingComment ? t('SAVING') : t('SAVE')}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {renderComments()}
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
