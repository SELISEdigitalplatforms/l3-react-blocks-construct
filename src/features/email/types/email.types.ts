export interface TEmail {
  id: string;
  sender?: string[];
  subject: string;
  preview: string;
  content?: string;
  date: string;
  isRead: boolean;
  isStarred: boolean;
  isImportant: boolean;
  email?: string;
  recipient?: string;
  reply?: string[];
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
  drafts: TEmail[];
  starred: TEmail[];
  important: TEmail[];
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

export interface TActiveAction {
  reply: boolean;
  replyAll: boolean;
  forward: boolean;
}

export type TDestination = 'spam' | 'trash' | 'draft' | 'important' | 'starred';

export interface TIsComposing {
  isCompose: boolean;
  isForward: boolean;
}

export interface TViewState {
  [key: string]: boolean;
}

export interface EmailViewProps {
  selectedEmail: TEmail | null;
  statusLabels: Record<string, { label: string; border: string; text: string }>;
  viewState: TViewState;
  handleTagChange: (key: string, value: boolean) => void;
  toggleEmailAttribute: (emailId: string, destination: 'isStarred' | 'isImportant') => void;
  checkedEmailIds: string[];
  setSelectedEmail: (email: TEmail | null) => void;
  moveEmailToCategory: (emailId: string, destination: 'spam' | 'trash') => void;
  formatDateTime: (date: string) => string;
  activeAction: { reply: boolean; replyAll: boolean; forward: boolean };
  handleSetActive: (action: 'reply' | 'replyAll' | 'forward') => void;
  handleComposeEmailForward: () => void;
  setActiveAction: (action: { reply: boolean; replyAll: boolean; forward: boolean }) => void;
  content: string;
  handleContentChange: (value: string) => void;
  handleSendEmail: (emailId: string) => void;
  isComposing: { isCompose: boolean; isForward: boolean };
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
}
