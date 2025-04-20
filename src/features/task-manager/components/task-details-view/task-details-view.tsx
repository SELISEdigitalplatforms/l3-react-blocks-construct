import { useState } from 'react';
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
import { Badge } from 'components/ui/badge';
import { Label } from 'components/ui/label';
import { EditableHeading } from './editable-heading';
import { EditableComment } from './editable-comment';
import { DialogContent } from 'components/ui/dialog';
import { EditableDescription } from './editable-description';
import { AttachmentsSection } from './attachment-section';
import { Separator } from 'components/ui/separator';
import { Tags } from './tag-selector';
import { AssigneeSelector } from './assignee-selector';
import { EditableCommentInput } from './editable-comment-input';
import { TaskDetails, TaskService } from '../../services/task-service';
import { useTaskContext } from '../../hooks/use-task-context';

interface Assignee {
  id: string;
  name: string;
  avatar: string;
}

type TaskDetailsViewProps = {
  onClose: () => void;
  taskId?: string;
  taskService: TaskService;
  handleDeleteTask: (id: string) => void;
  isNewTaskModalOpen?: boolean;
  onTaskAddedList?: () => void;
  onTaskAddedCard?: (columnId: string, taskTitle: string) => void;
  setActiveColumn?: (columnId: string) => void;
};

export default function TaskDetailsView({
  onClose,
  taskId,
  taskService,
  handleDeleteTask,
  isNewTaskModalOpen,
  onTaskAddedList,
  onTaskAddedCard,
}: TaskDetailsViewProps) {
  const { tasks, addTask, toggleMark } = useTaskContext();
  // const tasks = taskService.getTasks();
  const task = tasks.find((task) => task.id === taskId);
  const [date, setDate] = useState<Date | undefined>(task?.dueDate ?? undefined);
  const [title, setTitle] = useState<string>(task?.title ?? '');
  const [mark, setMark] = useState<boolean>(task?.isCompleted ?? false);
  const [section, setSection] = useState<string>(task?.section ?? 'To Do');
  const [showCalendar, setShowCalendar] = useState(false);
  const [priority, setPriority] = useState<string>(
    task?.priority === 'Low' || task?.priority === 'Medium' || task?.priority === 'High'
      ? task.priority
      : '' // Default value
  );
  const [newCommentContent, setNewCommentContent] = useState('');
  const [isWritingComment, setIsWritingComment] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(task?.tags.map((tag) => tag.id) || []);
  const [selectedAssignees, setSelectedAssignees] = useState<Assignee[]>(task?.assignees || []);

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
    if (isNewTaskModalOpen === true && onTaskAddedCard) {
      onTaskAddedCard(section == "To Do" ? '1' : section == 'In Progress' ? '2' : '3', title);
      const lastTask = tasks[tasks.length - 1];
      const newId = lastTask ? String(Number(lastTask.id) + 1) : '1';
      const newTask: TaskDetails = {
        id: newId,
        section: section,
        isCompleted: false,
        title: title,
        mark: false,
        priority: priority,
        dueDate: null,
        assignees: [],
        description: '',
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
    setMark(true);
    toggleMark
  }

  const handleClose = () => {
    onClose();
    if (isNewTaskModalOpen) {
      handleAddItem();
    }
  };

  return (
    <div>
      <DialogContent
        className="rounded-md sm:max-w-[720px] xl:max-h-[800px] overflow-y-auto max-h-screen flex flex-col gap-6"
        onInteractOutside={() => handleAddItem()}
        onOpenAutoFocus={(e) => e.preventDefault()}
        hideClose
      >
        <div>
          <EditableHeading
            taskService={taskService}
            isNewTaskModalOpen={isNewTaskModalOpen}
            initialValue={title}
            onValueChange={setTitle}
            className="mb-2 mt-4"
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-high-emphasis text-base font-semibold">Section</Label>
            <Select value={section} onValueChange={setSection}>
              <SelectTrigger className="mt-2 w-full h-[28px] px-2 py-1">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="To Do">To Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-high-emphasis text-base font-semibold">Priority</Label>
            <div className="flex gap-2 mt-3">
              <Badge
                variant={priority === 'Low' ? 'default' : 'outline'}
                className={`rounded text-xs font-semibold cursor-pointer ${
                  priority === 'Low' ? 'bg-blue-100 text-blue-700' : 'text-medium-emphasis'
                }`}
                onClick={() => handlePriorityChange('Low')}
              >
                Low
              </Badge>
              <Badge
                variant={priority === 'Medium' ? 'default' : 'outline'}
                className={`rounded text-xs font-semibold cursor-pointer ${
                  priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'text-medium-emphasis'
                }`}
                onClick={() => handlePriorityChange('Medium')}
              >
                Medium
              </Badge>
              <Badge
                variant={priority === 'High' ? 'default' : 'outline'}
                className={`rounded text-xs font-semibold cursor-pointer ${
                  priority === 'High' ? 'bg-red-100 text-red-700' : 'text-medium-emphasis'
                }`}
                onClick={() => handlePriorityChange('High')}
              >
                High
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <Label className="text-high-emphasis text-base font-semibold">Due date</Label>
            <div className="relative mt-2">
              <Input
                value={date ? format(date, 'dd.MM.yyyy') : ''}
                readOnly
                placeholder='Choose a date'
                className="h-[28px] px-2 py-1"
                onClick={() => setShowCalendar(!showCalendar)}
              />
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
            {showCalendar && (
              <div className="absolute z-10 mt-1 bg-white border rounded-md shadow-md">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate);
                    setShowCalendar(false);
                  }}
                  initialFocus
                />
              </div>
            )}
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

        <div>
          <EditableDescription
            initialContent={description}
            onContentChange={(newContent) => {
              setDescription(newContent);
            }}
          />
        </div>

        <Tags availableTags={tags} selectedTags={selectedTags} onChange={setSelectedTags} />

        <AttachmentsSection attachment={task?.attachments} />
        <Separator />

        {!isNewTaskModalOpen && (
          <div>
            <Label className="text-high-emphasis text-base font-semibold">Comments</Label>
            <div className="space-y-4 mt-3">
              {isWritingComment ? (
                <EditableCommentInput
                  initialContent={newCommentContent}
                  onSubmit={(content) => {
                    handleSubmitComment(content);
                    setIsWritingComment(false);
                  }}
                  onCancel={handleCancelComment}
                />
              ) : (
                <div className="flex gap-2">
                  <div className="h-10 w-10 rounded-full bg-gray-300 text-xs flex items-center justify-center border-2 border-white">
                    {'P'}
                  </div>
                  <Input
                    placeholder="Write a comment..."
                    className="flex-1 text-sm"
                    onClick={handleStartWritingComment}
                    readOnly
                  />
                </div>
              )}

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

        <div className="flex justify-between mt-4">
          <Button
            onClick={() => handleDeleteTask}
            variant="ghost"
            size="icon"
            className="text-red-500 bg-white w-12 h-10 border"
          >
            <Trash className="h-3 w-3" />
          </Button>
          <div className="flex gap-2">
            {mark ? (
              <Button variant="ghost" className="h-10 border" onClick={() => setMark(false)}>
                <CircleDashed className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-black">Reopen Task</span>
              </Button>
            ) : (
              <Button variant="ghost" className="h-10 border" onClick={handleUpdateStatus}>
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-black">Mark As Complete</span>
              </Button>
            )}

            <Button variant="ghost" className="h-10 border" onClick={handleClose}>
              <span className="text-sm font-bold text-black">Close</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </div>
  );
}
