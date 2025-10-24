import { useState, useEffect, useCallback, useRef } from 'react';
import { emailData } from '../services/email-data';
import { TEmail } from '../types/email.types';

/**
 * Custom hook for managing email state and core operations
 *
 * Handles:
 * - Email data state management
 * - Email filtering and sorting
 * - Email CRUD operations (update, move, delete, restore)
 * - Selected email management
 */
export const useEmailState = (category?: string, emailId?: string) => {
  const [emails, setEmails] = useState<Record<string, TEmail[]>>(() => {
    try {
      const saved = localStorage.getItem('emails-state');
      if (saved) {
        return JSON.parse(saved) as Record<string, TEmail[]>;
      }
    } catch {
      // noop: ignore JSON parse/localStorage access errors
    }

    return Object.fromEntries(
      Object.entries(emailData)
        .filter(([, value]) => Array.isArray(value))
        .map(([key, value]) => [key, (value as TEmail[]).filter((email) => !email.isDeleted)])
    ) as Record<string, TEmail[]>;
  });

  const [selectedEmail, setSelectedEmail] = useState<TEmail | null>(null);
  const [filteredEmails, setFilteredEmails] = useState<Array<TEmail>>([]);

  useEffect(() => {
    try {
      localStorage.setItem('emails-state', JSON.stringify(emails));
    } catch {
      // noop: ignore localStorage write errors
    }
  }, [emails]);

  // Helper function to sort emails by time
  const sortEmailsByTime = (emailsToSort: TEmail[]): TEmail[] => {
    return [...emailsToSort].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  // Filter emails based on category and emailId
  useEffect(() => {
    if (category) {
      const allowedLabelKeys = ['personal', 'work', 'payments', 'invoices'] as const;
      type LabelKey = (typeof allowedLabelKeys)[number];

      if (category === 'labels' && emailId) {
        const source = emails.inbox || [];
        if (allowedLabelKeys.includes(emailId as LabelKey)) {
          const key = emailId as LabelKey;
          const labelFiltered = source.filter((e) => Boolean(e.tags?.[key]));
          setFilteredEmails(sortEmailsByTime(labelFiltered));
        } else {
          setFilteredEmails([]);
        }
      } else if (allowedLabelKeys.includes(category as LabelKey)) {
        const key = category as LabelKey;
        const source = emails.inbox || [];
        const labelFiltered = source.filter((e) => Boolean(e.tags?.[key]));
        setFilteredEmails(sortEmailsByTime(labelFiltered));
      } else if (Object.hasOwn(emails, category)) {
        const emailDataToSort = emails[category];
        setFilteredEmails(Array.isArray(emailDataToSort) ? sortEmailsByTime(emailDataToSort) : []);
      } else {
        setFilteredEmails([]);
      }
    }
  }, [category, emailId, emails]);

  // Set selected email based on emailId and mark it as read once upon open
  const lastMarkedReadIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (emailId && filteredEmails.length > 0) {
      const foundEmail = filteredEmails.find((email) => email.id === emailId) || null;

      if (foundEmail) {
        const shouldAutoMarkRead =
          !foundEmail.isRead && lastMarkedReadIdRef.current !== foundEmail.id;
        if (shouldAutoMarkRead) {
          setEmails((prev) => {
            const updated = { ...prev } as Record<string, TEmail[]>;
            for (const cat in updated) {
              updated[cat] = (updated[cat] || []).map((e) =>
                e.id === foundEmail.id ? { ...e, isRead: true } : e
              );
            }
            return updated;
          });

          // Reflect read state in selected email immediately
          setSelectedEmail({ ...foundEmail, isRead: true });
          lastMarkedReadIdRef.current = foundEmail.id;
        } else {
          setSelectedEmail(foundEmail);
        }
      } else {
        setSelectedEmail(null);
      }
    }
  }, [emailId, filteredEmails]);

  // Update email function
  const updateEmail = useCallback(
    (emailId: string, updates: Partial<TEmail>) => {
      setEmails((prevEmails) => {
        const updatedEmails = { ...prevEmails };

        let targetEmail: TEmail | undefined;

        for (const cat in updatedEmails) {
          const found = updatedEmails[cat]?.find((email) => email.id === emailId);
          if (found) {
            targetEmail = found;
            break;
          }
        }

        if (!targetEmail) return prevEmails;

        const updatedEmail = { ...targetEmail, ...updates };

        for (const cat in updatedEmails) {
          updatedEmails[cat] = updatedEmails[cat]?.map((email) =>
            email.id === emailId ? updatedEmail : email
          );
        }

        if (updatedEmail.isStarred) {
          if (!updatedEmails.starred?.some((email) => email.id === emailId)) {
            updatedEmails.starred = [...(updatedEmails.starred || []), updatedEmail];
          }
        } else {
          updatedEmails.starred = (updatedEmails.starred || []).filter(
            (email) => email.id !== emailId
          );
        }

        return updatedEmails;
      });

      if (selectedEmail?.id === emailId) {
        setSelectedEmail((prev) => (prev ? { ...prev, ...updates } : null));
      }
    },
    [selectedEmail]
  );

  // Move email to category function
  const moveEmailToCategory = useCallback(
    (emailIds: string | string[], destination: 'spam' | 'trash' | 'inbox' | 'sent') => {
      const idsToMove = Array.isArray(emailIds) ? emailIds : [emailIds];

      setEmails((prevEmails) => {
        const updatedEmails: { [key: string]: TEmail[] } = {};
        const movedEmailMap: { [id: string]: TEmail } = {};

        for (const category in prevEmails) {
          const emailsInCategory = prevEmails[category] || [];
          const remainingEmails = emailsInCategory.filter((email) => {
            if (idsToMove.includes(email.id)) {
              if (!movedEmailMap[email.id]) {
                movedEmailMap[email.id] = { ...email, [destination]: true };
              }
              return false;
            }
            return true;
          });
          updatedEmails[category] = remainingEmails;
        }

        updatedEmails[destination] = [
          ...(updatedEmails[destination] || []),
          ...Object.values(movedEmailMap),
        ];

        return updatedEmails;
      });

      if (selectedEmail && idsToMove.includes(selectedEmail.id)) {
        setSelectedEmail(null);
      }
    },
    [selectedEmail]
  );

  // Add or update email in sent folder
  const addOrUpdateEmailInSent = useCallback((newEmail: TEmail) => {
    setEmails((prevEmails) => {
      const updatedEmails = { ...prevEmails };
      const sentEmails = updatedEmails.sent || [];
      const existingIndex = sentEmails.findIndex((email) => email.id === newEmail.id);

      if (existingIndex !== -1) {
        sentEmails[existingIndex] = newEmail;
      } else {
        sentEmails.unshift(newEmail);
      }

      updatedEmails.sent = sentEmails;
      return updatedEmails;
    });
  }, []);

  // Restore emails to their original category
  const restoreEmailsToCategory = useCallback((emailIds: string[]) => {
    setEmails((prevEmails) => {
      const updatedEmails = { ...prevEmails };
      const emailsToRestore: TEmail[] = [];

      // Find emails to restore from trash and spam
      for (const cat of ['trash', 'spam'] as const) {
        const categoryEmails = updatedEmails[cat] || [];
        const remainingEmails: TEmail[] = [];
        for (const email of categoryEmails) {
          if (emailIds.includes(email.id)) {
            emailsToRestore.push({ ...email, [cat]: false });
          } else {
            remainingEmails.push(email);
          }
        }
        updatedEmails[cat] = remainingEmails;
      }

      // Restore emails to inbox by default
      if (emailsToRestore.length > 0) {
        updatedEmails.inbox = [...(updatedEmails.inbox || []), ...emailsToRestore];
      }

      return updatedEmails;
    });
  }, []);

  // Delete emails permanently
  const deleteEmailsPermanently = useCallback(
    (emailIds: string[]) => {
      setEmails((prevEmails) => {
        const updatedEmails = { ...prevEmails };

        for (const category in updatedEmails) {
          updatedEmails[category] = (updatedEmails[category] || []).filter(
            (email) => !emailIds.includes(email.id)
          );
        }

        return updatedEmails;
      });

      if (selectedEmail && emailIds.includes(selectedEmail.id)) {
        setSelectedEmail(null);
      }
    },
    [selectedEmail]
  );

  return {
    emails,
    selectedEmail,
    filteredEmails,
    setEmails,
    setSelectedEmail,
    setFilteredEmails,
    updateEmail,
    moveEmailToCategory,
    addOrUpdateEmailInSent,
    restoreEmailsToCategory,
    deleteEmailsPermanently,
    sortEmailsByTime,
  };
};
