import React from 'react';
import { useTranslation } from 'react-i18next';
import { History, Mail, MailOpen, Menu, Search, Trash2, TriangleAlert, X } from 'lucide-react';
import { Input } from '@/components/ui-kit/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui-kit/tooltip';
import { makeFirstLetterUpperCase } from '../../utils/email-utils';
import { TooltipConfirmAction } from '../email-tooltip-confirm-action/email-tooltip-confirm-action';

/**
 * EmailHeader Component
 *
 * A reusable header component for the email interface that includes:
 * - Collapsible sidebar toggle
 * - Category display
 * - Bulk action controls (mark as read/unread, spam, trash, restore, delete)
 * - Search functionality
 *
 * @param props - EmailHeader component props
 * @returns JSX.Element - The email header component
 */

interface EmailHeaderToolProps {
  isCollapsedEmailSidebar: boolean;
  setIsCollapsedEmailSidebar: (collapsed: boolean) => void;
  category?: string;
  checkedEmailIds: string[];
  hasUnreadSelected: boolean;
  updateReadStatus: (isRead: boolean) => void;
  moveEmailToCategory: (
    emailIds: string | string[],
    destination: 'spam' | 'trash' | 'inbox' | 'sent'
  ) => void;
  restoreEmailsToCategory: (emailIds: string[]) => void;
  deleteEmailsPermanently: (emailIds: string[]) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchRef: React.RefObject<HTMLInputElement | null>;
  handleClearInput: () => void;
}

export const EmailHeaderTool = ({
  isCollapsedEmailSidebar,
  setIsCollapsedEmailSidebar,
  category,
  checkedEmailIds,
  hasUnreadSelected,
  updateReadStatus,
  moveEmailToCategory,
  restoreEmailsToCategory,
  deleteEmailsPermanently,
  searchTerm,
  setSearchTerm,
  searchRef,
  handleClearInput,
}: Readonly<EmailHeaderToolProps>) => {
  const { t } = useTranslation();

  return (
    <div className="flex bg-white ">
      <div
        className={`p-4 transition-all duration-300 ${
          isCollapsedEmailSidebar
            ? 'md:min-w-[70px] md:max-w-[70px]'
            : 'md:min-w-[280px] md:max-w-[280px]'
        }

        `}
      >
        <h2 className="text-2xl font-bold tracking-tight">
          {!isCollapsedEmailSidebar && t('MAIL')}
        </h2>
      </div>
      <div className="hidden md:flex border-l justify-between w-full px-4 py-3">
        <div className="flex items-center gap-4">
          <Menu
            className="w-6 h-6 text-medium-emphasis cursor-pointer"
            onClick={() => setIsCollapsedEmailSidebar(!isCollapsedEmailSidebar)}
          />
          {makeFirstLetterUpperCase(t(category?.toUpperCase() ?? ''))}
        </div>
        <div className="flex items-center  gap-4">
          {checkedEmailIds.length > 0 && (
            <div className="flex items-center gap-4">
              <p className="text-xs text-medium-emphasis text-center">
                {checkedEmailIds.length} {t('SELECTED')}
              </p>
              <div className="h-4 w-px bg-low-emphasis" />
              {hasUnreadSelected && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <MailOpen
                      className="h-5 w-5 cursor-pointer text-medium-emphasis hover:text-high-emphasis"
                      onClick={() => updateReadStatus(true)}
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    className="bg-surface text-medium-emphasis "
                    side="top"
                    align="center"
                  >
                    <p>{t('MARK_AS_READ')}</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {!hasUnreadSelected && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Mail
                      className="h-5 w-5 cursor-pointer text-medium-emphasis hover:text-high-emphasis"
                      onClick={() => updateReadStatus(false)}
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    className="bg-surface text-medium-emphasis "
                    side="top"
                    align="center"
                  >
                    <p>{t('MARK_AS_UNREAD')}</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {category !== 'spam' && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TriangleAlert
                      className="h-5 w-5 cursor-pointer text-medium-emphasis hover:text-high-emphasis"
                      onClick={() => {
                        moveEmailToCategory(checkedEmailIds, 'spam');
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    className="bg-surface text-medium-emphasis"
                    side="top"
                    align="center"
                  >
                    <p>
                      {t('SPAM')} {checkedEmailIds.length} {t('ITEMS')}
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
              {(category === 'trash' || category === 'spam') && (
                <>
                  <TooltipConfirmAction
                    tooltipLabel={`${t('RESTORE')} ${checkedEmailIds.length} ${t('ITEMS')}`}
                    confirmTitle={t('RESTORE_EMAILS')}
                    confirmDescription={`${t('ARE_YOU_SURE_WANT_RESTORE')} ${checkedEmailIds.length} ${t('SELECTED_ITEMS')}?`}
                    onConfirm={() => restoreEmailsToCategory(checkedEmailIds)}
                    toastDescription={`${t('RESTORED')} ${checkedEmailIds.length} ${t('ITEMS')}`}
                  >
                    <History className="h-5 w-5 cursor-pointer text-medium-emphasis hover:text-high-emphasis" />
                  </TooltipConfirmAction>

                  <TooltipConfirmAction
                    tooltipLabel={`${t('DELETE')} ${checkedEmailIds.length} ${t('ITEMS_PERMANENTLY')}`}
                    confirmTitle={t('DELETE_EMAILS_PERMANENTLY')}
                    confirmDescription={`${t('ARE_YOU_SURE_WANT_DELETE_PERMANENTLY')} ${checkedEmailIds.length} ${t('SELECTED_ITEMS')}? ${t('THIS_ACTION_CANNOT_BE_UNDONE')}`}
                    onConfirm={() => deleteEmailsPermanently(checkedEmailIds)}
                    toastDescription={`${t('Deleted')} ${checkedEmailIds.length} ${t('ITEMS')}`}
                  >
                    <Trash2 className="h-5 w-5 cursor-pointer text-medium-emphasis hover:text-high-emphasis" />
                  </TooltipConfirmAction>
                </>
              )}
              {category !== 'trash' && category !== 'spam' && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Trash2
                      className="h-5 w-5 cursor-pointer text-medium-emphasis hover:text-high-emphasis"
                      onClick={() => {
                        moveEmailToCategory(checkedEmailIds, 'trash');
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    className="bg-surface text-medium-emphasis"
                    side="top"
                    align="center"
                  >
                    <p>
                      {t('TRASH')} {checkedEmailIds.length} {t('ITEMS')}
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          )}

          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-medium-emphasis bg-surface" />
            <Input
              placeholder={t('SEARCH_BY_NAME_AND_SUBJECT')}
              ref={searchRef}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              className="pl-9 bg-surface w-80"
            />
            {searchTerm && (
              <button
                onClick={handleClearInput}
                type="button"
                aria-label={t('CLEAR_SEARCH')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-medium-emphasis p-1 rounded-sm hover:bg-surface focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <X className="h-4 w-4 text-low-emphasis transition delay-150 hover:text-destructive" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
