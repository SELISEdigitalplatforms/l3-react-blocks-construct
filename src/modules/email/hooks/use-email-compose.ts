import { useState, useCallback } from 'react';
import { TActiveAction, TEmail, TReply } from '../types/email.types';

/**
 * Custom hook for managing email compose, reply, and forward functionality
 *
 * Handles:
 * - Compose email state
 * - Reply and forward functionality
 * - Active action tracking
 * - Reply editor state
 */
export const useEmailCompose = (
  setEmails: React.Dispatch<React.SetStateAction<Record<string, TEmail[]>>>,
  selectedEmail: TEmail | null,
  setSelectedEmail: React.Dispatch<React.SetStateAction<TEmail | null>>
) => {
  const [isComposing, setIsComposing] = useState({
    isCompose: false,
    isForward: false,
    replyData: {} as TReply | null,
  });

  const [activeAction, setActiveAction] = useState<TActiveAction>({
    reply: false,
    replyAll: false,
    forward: false,
  });

  const [isReplyVisible, setIsReplyVisible] = useState(false);
  const [isReplySingleAction, setIsReplySingleAction] = useState({
    isReplyEditor: false,
    replyId: '',
  });

  // Helper function to update a single reply's attribute
  const updateReplyAttribute = (
    reply: TReply,
    replyId: string,
    attribute: keyof TReply
  ): TReply => {
    if (reply.id !== replyId) return reply;
    return { ...reply, [attribute]: !reply[attribute] };
  };

  // Helper function to update replies within a single email
  const updateSingleEmailReplies = (
    email: TEmail,
    replyId: string,
    attribute: keyof TReply
  ): TEmail => {
    const updatedReplies =
      email.reply?.map((reply) => updateReplyAttribute(reply, replyId, attribute)) || [];
    return { ...email, reply: updatedReplies };
  };

  // Handle compose email
  const handleComposeEmail = useCallback(() => {
    setIsComposing({
      isCompose: true,
      isForward: false,
      replyData: {} as TReply | null,
    });
  }, []);

  // Handle compose email forward
  const handleComposeEmailForward = useCallback((replyData?: TReply) => {
    setIsComposing({
      isCompose: false,
      isForward: true,
      replyData: replyData ?? ({} as TReply),
    });
  }, []);

  // Set all active actions to false
  const onSetActiveActionFalse = useCallback(() => {
    setActiveAction({
      reply: false,
      replyAll: false,
      forward: false,
    });
    setIsReplySingleAction({ isReplyEditor: false, replyId: '' });
  }, []);

  // Handle close compose
  const handleCloseCompose = useCallback(() => {
    setIsComposing({
      isCompose: false,
      isForward: false,
      replyData: {} as TReply,
    });
    setIsReplySingleAction({ isReplyEditor: false, replyId: '' });
  }, []);

  // Handle reply action
  const handleReplyAction = (action: keyof TActiveAction) => {
    setActiveAction((prev) => ({
      ...prev,
      [action]: !prev[action],
    }));
  };

  // Handle single reply action
  const handleSingleReplyAction = (replyId: string) => {
    setIsReplySingleAction({
      isReplyEditor: true,
      replyId,
    });
  };

  // Update reply in email
  const updateReplyInEmail = (emailId: string, replyId: string, attribute: keyof TReply) => {
    setEmails((prev) => {
      const updatedEmails = { ...prev };

      for (const category in updatedEmails) {
        if (category && Object.hasOwn(prev, category)) {
          updatedEmails[category] = prev[category].map((email) =>
            email.id === emailId ? updateSingleEmailReplies(email, replyId, attribute) : email
          );
        }
      }

      return updatedEmails;
    });

    if (selectedEmail?.id === emailId) {
      setSelectedEmail((prev) =>
        prev ? updateSingleEmailReplies(prev, replyId, attribute) : null
      );
    }
  };

  return {
    isComposing,
    activeAction,
    isReplyVisible,
    isReplySingleAction,
    setIsComposing,
    setActiveAction,
    setIsReplyVisible,
    setIsReplySingleAction,
    handleComposeEmail,
    handleComposeEmailForward,
    handleCloseCompose,
    onSetActiveActionFalse,
    handleReplyAction,
    handleSingleReplyAction,
    updateReplyInEmail,
    updateReplyAttribute,
    updateSingleEmailReplies,
  };
};
