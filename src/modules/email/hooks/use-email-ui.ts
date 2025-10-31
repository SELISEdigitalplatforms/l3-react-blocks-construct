import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDebounce } from './use-debounce';
import { TEmail } from '../types/email.types';

/**
 * Custom hook for managing email UI state and interactions
 *
 * Handles:
 * - Search functionality
 * - Navigation state
 * - Sidebar collapse state
 * - UI interaction state
 */
export const useEmailUI = () => {
  const navigate = useNavigate();
  const { category, emailId } = useParams<{
    category: string;
    emailId?: string;
  }>();

  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCollapsedEmailSidebar, setIsCollapsedEmailSidebar] = useState(false);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 500);

  // Handle clear search input
  const handleClearInput = () => {
    setSearchTerm('');
    if (searchRef.current) {
      searchRef.current.focus();
    }
  };

  // Handle email selection for navigation
  const handleEmailSelection = (email: TEmail) => {
    navigate(`/mail/${category}/${email.id}`);
  };

  // Handle go back navigation
  const onGoBack = () => {
    navigate(`/mail/${category}`);
  };

  // Handle navigation to mail
  const navigateToMail = () => {
    navigate('/mail');
  };

  // Toggle search state
  const toggleSearch = () => {
    setIsSearching(!isSearching);
    if (!isSearching && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  };

  // Filter emails based on search term
  const filterEmailsBySearch = (emails: TEmail[]): TEmail[] => {
    if (!debouncedSearch.trim()) {
      return emails;
    }

    const searchLower = debouncedSearch.toLowerCase();
    return emails.filter((email) => {
      const sender = email.sender ? email.sender.join(' ').toLowerCase() : '';
      const recipient = email.recipient?.toLowerCase() ?? '';
      const subject = email.subject?.toLowerCase() ?? '';
      const preview = email.preview?.toLowerCase() ?? '';

      return (
        sender.includes(searchLower) ||
        recipient.includes(searchLower) ||
        subject.includes(searchLower) ||
        preview.includes(searchLower)
      );
    });
  };

  return {
    navigate,
    category,
    emailId,
    isSearching,
    searchTerm,
    debouncedSearch,
    searchRef,
    isCollapsedEmailSidebar,
    setIsSearching,
    setSearchTerm,
    setIsCollapsedEmailSidebar,
    handleClearInput,
    handleEmailSelection,
    onGoBack,
    navigateToMail,
    toggleSearch,
    filterEmailsBySearch,
  };
};
