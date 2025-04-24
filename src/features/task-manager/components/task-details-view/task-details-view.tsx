import { useEffect, useState } from 'react';
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
import { CalendarIcon, CheckCircle, CircleDashed, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { Label } from 'components/ui/label';
import { EditableHeading } from './editable-heading';
import { EditableComment } from './editable-comment';
import { DialogContent } from 'components/ui/dialog';
import { EditableDescription } from './editable-description';
import { AttachmentsSection } from './attachment-section';
import { Separator } from 'components/ui/separator';
import { Tags } from './tag-selector';
import { AssigneeSelector } from './assignee-selector';
import { TaskDetails, TaskService } from '../../services/task-service';
import { useTaskContext } from '../../hooks/use-task-context';
import { useTaskDetails } from '../../hooks/use-task-details';
import { useCardTasks } from '../../hooks/use-card-tasks';
import { useToast } from 'hooks/use-toast';
import ConfirmationModal from 'components/blocks/confirmation-modal/confirmation-modal';
import { TaskManagerBadge } from '../task-manager-ui/task-manager-badge';
import { TPriority } from '../../types/task';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';

interface Assignee {
  id: string;
  name: string;
  avatar: string;
}

type TaskDetailsViewProps = {
  onClose: () => void;
  taskId?: string;
  taskService: TaskService;
  isNewTaskModalOpen?: boolean;
  onTaskAddedList?: () => void;
  onTaskAddedCard?: (columnId: string, taskTitle: string) => void;
  setActiveColumn?: (columnId: string) => void;
};

export default function TaskDetailsView({
  onClose,
  taskId,
  taskService,
  isNewTaskModalOpen,
  onTaskAddedList,
  onTaskAddedCard,
}: TaskDetailsViewProps) {
  const { tasks, addTask } = useTaskContext();
  const { columns } = useCardTasks();
  const { task, toggleTaskCompletion, removeTask, updateTaskDetails } = useTaskDetails(taskId);
  const [date, setDate] = useState<Date | undefined>(task?.dueDate ?? undefined);
  const [title, setTitle] = useState<string>(task?.title ?? '');
  const [mark, setMark] = useState<boolean>(task?.isCompleted ?? false);
  const [section, setSection] = useState<string>(task?.section ?? 'To Do');
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

  const availableAssignees: Assignee[] = [
    {
      id: '1',
      name: 'Aaron Green',
      avatar:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avator.JPG-eY44OKHv1M9ZlInG6sSFJSz2UMlimG.jpeg',
    },
    {
      id: '2',
      name: 'Adrian Müller',
      avatar:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avator.JPG-eY44OKHv1M9ZlInG6sSFJSz2UMlimG.jpeg',
    },
    {
      id: '3',
      name: 'Blocks Smith',
      avatar:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avator.JPG-eY44OKHv1M9ZlInG6sSFJSz2UMlimG.jpeg',
    },
    {
      id: '4',
      name: 'Sarah Pavan',
      avatar:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avator.JPG-eY44OKHv1M9ZlInG6sSFJSz2UMlimG.jpeg',
    },
  ];

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

  interface Tag {
    id: string;
    label: string;
  }

  const tags: Tag[] = [
    { id: 'calendar', label: 'Calendar' },
    { id: 'ui-ux', label: 'UI/UX' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'design', label: 'Design' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'responsive', label: 'Responsive' },
    { id: 'performance', label: 'Performance' },
    { id: 'usability', label: 'Usability' },
  ];

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
    const column = columns.find((col) => col.title === section);
    const columnId = column && column.id;
    if (isNewTaskModalOpen === true && onTaskAddedCard && columnId) {
      onTaskAddedCard(columnId, title);
      const lastTask = tasks[tasks.length - 1];
      const newId = lastTask ? String(Number(lastTask.id) + 1) : '1';
      const newTask: TaskDetails = {
        id: newId,
        section: section,
        isCompleted: mark,
        title: title,
        mark: false,
        priority: priority,
        dueDate: date === undefined ? null : date,
        assignees: [],
        description: description ?? '',
        tags: [],
        attachments: [],
        comments: [],
      };
      addTask(newTask);
      taskService?.addTask(newTask);
      onTaskAddedList && onTaskAddedList();
    }
  };

  const handleUpdateStatus = () => {
    setMark(!mark);
    toggleTaskCompletion(!mark);
  };

  const handleClose = () => {
    onClose();
    if (isNewTaskModalOpen) {
      handleAddItem();
    }
  };

  useEffect(() => {
    if (task && section !== task.section) {
      updateTaskDetails({ section });
    }
  }, [section, task, updateTaskDetails]);

  const handleDeleteTask = () => {
    removeTask();
    onClose();
  };

  const handleConfirm = () => {
    handleDeleteTask();
    setOpen(false);
    toast({
      variant: 'success',
      title: 'Deleted',
      description: 'Task was successfully deleted.',
    });
  };

  return (
    <div>
      <DialogContent
        className="rounded-md sm:max-w-[720px] xl:max-h-[800px] max-h-screen flex flex-col p-0"
        onInteractOutside={() => handleAddItem()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex-1 overflow-y-auto p-6 pb-16">
          {' '}
          <div>
            <EditableHeading
              taskId={taskId}
              taskService={taskService}
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
                    <span className="text-xs font-semibold text-secondary">Completed</span>
                  </>
                ) : (
                  <>
                    <CircleDashed className="h-4 w-4 text-secondary" />
                    <span className="text-xs font-semibold text-secondary">Open</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <Label className="text-high-emphasis text-base font-semibold">Section</Label>
              <Select value={section} onValueChange={setSection}>
                <SelectTrigger className="mt-2 w-full h-[28px] px-2 py-1">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((column) => (
                    <SelectItem key={column.id} value={column.title}>
                      {column.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-high-emphasis text-base font-semibold">Priority</Label>
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
              <Label className="text-high-emphasis text-base font-semibold">Due date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="relative mt-2">
                    <Input
                      value={date ? format(date, 'dd.MM.yyyy') : ''}
                      readOnly
                      placeholder="Choose a date"
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
                        if (newDate) {
                          const formattedDate = new Date(newDate);
                          setDate(formattedDate);
                          updateTaskDetails({ dueDate: formattedDate });
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
                        Clear date
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label className="text-high-emphasis text-base font-semibold">Assignee</Label>
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
            <AttachmentsSection attachment={task?.attachments} />
          </div>
          <Separator className="my-6" />
          {!isNewTaskModalOpen && (
            <div>
              <Label className="text-high-emphasis text-base font-semibold">Comments</Label>
              <div className="space-y-4 mt-3">
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <div className="h-10 w-10 rounded-full bg-gray-300 text-xs flex items-center justify-center border-2 border-white">
                      {'B'}
                    </div>
                    <Input
                      value={newCommentContent}
                      placeholder="Write a comment..."
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
                          Cancel
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
                          Save
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
          <div className=" flex justify-between items-center px-6">
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
              title="Are you sure?"
              description="This will permanently delete the task. This action cannot be undone."
              onConfirm={handleConfirm}
            />
            <div className="flex gap-2">
              {mark ? (
                <Button variant="ghost" className="h-10 border" onClick={handleUpdateStatus}>
                  <CircleDashed className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-high-emphasis">Reopen Task</span>
                </Button>
              ) : (
                <Button variant="ghost" className="h-10 border" onClick={handleUpdateStatus}>
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-high-emphasis">Mark As Complete</span>
                </Button>
              )}

              <Button variant="ghost" className="h-10 border" onClick={handleClose}>
                <span className="text-sm font-bold text-high-emphasis">Close</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </div>
  );
}
