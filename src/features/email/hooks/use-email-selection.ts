import { useState, useEffect, useCallback } from 'react';
import { TEmail } from '../types/email.types';

/**
 * Custom hook for managing email selection and bulk operations
 * 
 * Handles:
 * - Individual and bulk email selection
 * - Read/unread status management
 * - Selection state tracking
 */
export const useEmailSelection = (
  filteredEmails: TEmail[],
  updateEmail: (emailId: string, updates: Partial<TEmail>) => void
) => {
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);
  const [checkedEmailIds, setCheckedEmailIds] = useState<string[]>([]);
  const [hasUnreadSelected, setHasUnreadSelected] = useState(false);

  // Reset selection when category changes
  const resetSelection = useCallback(() => {
    setCheckedEmailIds([]);
    setIsAllSelected(false);
    setHasUnreadSelected(false);
  }, []);

  // Update hasUnreadSelected when checkedEmailIds changes
  useEffect(() => {
    if (checkedEmailIds.length > 0) {
      const hasUnread = checkedEmailIds.some((id) => {
        const email = filteredEmails.find((e) => e.id === id);
        return email && !email.isRead;
      });
      setHasUnreadSelected(hasUnread);
    } else {
      setHasUnreadSelected(false);
    }
  }, [checkedEmailIds, filteredEmails]);

  // Handle single email selection
  const handleSingleEmailCheck = (emailId: string, isChecked: boolean) => {
    setCheckedEmailIds((prev) => {
      if (isChecked) {
        return [...prev, emailId];
      } else {
        return prev.filter((id) => id !== emailId);
      }
    });
  };

  // Handle select all emails
  const handleSelectAllEmails = (isChecked: boolean) => {
    setIsAllSelected(isChecked);
    if (isChecked) {
      const allEmailIds = filteredEmails.map((email) => email.id);
      setCheckedEmailIds(allEmailIds);
    } else {
      setCheckedEmailIds([]);
    }
  };

  // Update read status for selected emails
  const updateReadStatus = (isRead: boolean) => {
    checkedEmailIds.forEach((emailId) => {
      updateEmail(emailId, { isRead });
    });
    
    // Reset selection after updating
    resetSelection();
  };

  // Update read status for a single email
  const updateSingleEmailReadStatus = (emailId: string, isRead: boolean) => {
    updateEmail(emailId, { isRead });
  };

  // Toggle star status for an email
  const toggleEmailStar = (emailId: string, isStarred: boolean) => {
    updateEmail(emailId, { isStarred });
  };

  return {
    // State
    isAllSelected,
    checkedEmailIds,
    hasUnreadSelected,
    
    // Setters
    setIsAllSelected,
    setCheckedEmailIds,
    setHasUnreadSelected,
    
    // Operations
    handleSingleEmailCheck,
    handleSelectAllEmails,
    updateReadStatus,
    updateSingleEmailReadStatus,
    toggleEmailStar,
    resetSelection,
  };
};
