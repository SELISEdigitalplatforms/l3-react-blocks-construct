export interface TEmail {
  id: string;
  sender?: string[];
  subject: string;
  preview: string;
  content?: string;
  date: string;
  isRead: boolean;
  isStarred: boolean;
  email?: string;
  recipient?: string;
  reply?: TReply[];
  tags?: TTags;
  images: string[];
  attachments: string[];

  trash: boolean;
  spam: boolean;
  cc?: string;
  bcc?: string;
  sectionCategory: string;
  isDeleted: boolean;
}

interface TTags {
  personal?: boolean;
  work?: boolean;
  payments?: boolean;
  invoices?: boolean;
}

export interface TEmailData {
  inbox: TEmail[];
  sent: TEmail[];
  draft: TEmail[];
  starred: TEmail[];
  trash: TEmail[];
  spam: TEmail[];
  personal?: TEmail[];
  work?: TEmail[];
  payments?: TEmail[];
  invoices?: TEmail[];
  tags?: TTags;
}

export interface TFormProps {
  images: string[];
  attachments: string[];
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
}

export interface TFormData {
  images: string[];
  attachments: string[];
}

export interface TActiveAction {
  reply: boolean;
  replyAll: boolean;
  forward: boolean;
}

export interface TReply {
  id: string;
  reply: string;
  isStarred: boolean;
  prevData: string;
  date: string;
  images: string[];
  attachments: string[];
}

export type TDestination = 'spam' | 'trash' | 'draft' | 'important' | 'starred';

export interface TIsComposing {
  isCompose: boolean;
  isForward: boolean;
  replyData: TReply | null;
  category?: string;
}

export interface TViewState {
  [key: string]: boolean;
}

export interface EmailViewProps {
  selectedEmail: TEmail | null;
  statusLabels: Record<string, { label: string; border: string; text: string }>;
  viewState: TViewState;
  handleTagChange: (key: string, value: boolean) => void;
  toggleEmailAttribute: (emailId: string, destination: 'isStarred') => void;
  checkedEmailIds: string[];
  setSelectedEmail: (email: TEmail | null) => void;
  moveEmailToCategory: (emailId: string, destination: 'spam' | 'trash') => void;
  formatDateTime: (date: string) => string;
  activeAction: { reply: boolean; replyAll: boolean; forward: boolean };
  handleSetActive: (action: 'reply' | 'replyAll' | 'forward') => void;
  handleComposeEmailForward: (replyData?: TReply) => void;
  setActiveAction: (action: { reply: boolean; replyAll: boolean; forward: boolean }) => void;
  content: string;
  handleContentChange: (value: string) => void;
  handleSendEmail: (emailId: string, currentCategory: 'inbox' | 'sent', replyData?: TReply) => void;
  isComposing: TIsComposing;
  addOrUpdateEmailInSent: (email: TEmail) => void;
  handleCloseCompose: () => void;
  updateEmailReadStatus: (emailId: string, category: string, isRead: boolean) => void;
  category: string;
  handleToggleReplyVisibility: () => void;
  isReplyVisible: boolean;
  onGoBack?: () => void;
  deleteEmailsPermanently: (emailIds: string[]) => void;
  restoreEmailsToCategory: (emailIds: string[]) => void;
  expandedReplies: number[];
  toggleExpand: (emailIds: number) => void;
  onSetActiveActionFalse: () => void;
  toggleReplyAttribute: (emailId: string, replyId: string, destination: 'isStarred') => void;
  isReplySingleAction?: TIsReplySingleActionState;
  setIsReplySingleAction?: React.Dispatch<
    React.SetStateAction<{ isReplyEditor: boolean; replyId: string }>
  >;
  setIsComposing: React.Dispatch<React.SetStateAction<TIsComposing>>;
  activeActionReply: { reply: boolean; replyAll: boolean; forward: boolean };
  setActiveActionReply: (action: { reply: boolean; replyAll: boolean; forward: boolean }) => void;
  handleSetActiveReply: (action: 'reply' | 'replyAll' | 'forward') => void;
  formData: TFormData;
  setFormData: React.Dispatch<React.SetStateAction<TFormData>>;
}

export type TIsReplySingleActionState = {
  isReplyEditor: boolean;
  replyId: string | undefined;
};

type ActionType = 'reply' | 'replyAll' | 'forward';

export interface EmailSingleActionsProps {
  selectedEmail: TEmail | TReply | null;
  reply?: TReply;
  formatDateTime: (date: string) => string;
  onToggleStar?: (emailId: string, replyId?: string) => void;
  onReplyClick?: () => void;
  onPopOutReplyClick?: (email: TEmail | TReply | null) => void;
  onMoreOptionsClick?: () => void;
  handleSetActiveReply: (action: ActionType) => void;
  isReplySingleAction?: TIsReplySingleActionState;
  setIsReplySingleAction?: React.Dispatch<
    React.SetStateAction<{ isReplyEditor: boolean; replyId: string }>
  >;
  handleComposeEmailForward: () => void;
  activeActionReply: { reply: boolean; replyAll: boolean; forward: boolean };
  handleSetActive: (action: ActionType) => void;
}

export type EmailActionType = 'reply' | 'replyAll' | 'forward' | 'popOutReply';

export interface MenuAction {
  type: EmailActionType;
  icon: React.ComponentType<{ className?: string }>;
  labelKey: string;
  onClick: () => void;
}

export type NavItem = {
  icon: React.ReactNode;
  label: string;
  href: string;
  count: number;
  isActive?: boolean;
  onClick?: () => void;
};

export type EmailCounts = {
  inbox?: any[];
  starred?: any[];
  sent?: any[];
  draft?: any[];
  spam?: any[];
  trash?: any[];
};

export type LabelItem = {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
  onClick?: () => void;
};