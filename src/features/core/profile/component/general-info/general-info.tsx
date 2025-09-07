import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProfileCard } from './profile-card';
import { SecurityCard } from './security-card';
import { useGetAccount } from '../../hooks/use-account';
import { MfaDialogState } from '../../enums/mfa-dialog-state.enum';
import { UserMfaType } from '../../enums/user-mfa-type-enum';

/**
 * `GeneralInfo` component renders a user profile and account security section with options to
 * edit the profile, manage two-factor authentication (MFA), and change the password.
 * It also handles various dialogs for MFA setup, authentication app setup, and email verification.
 *
 * @returns {JSX.Element} The rendered user profile and account security sections.
 */

export const GeneralInfo = () => {
  const { data: userInfo, isLoading } = useGetAccount();
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [currentDialog, setCurrentDialog] = useState(MfaDialogState.NONE);
  const isLocalStorageSet = useRef(false);
  const [dialogState, setDialogState] = useState(MfaDialogState.AUTHENTICATOR_APP_SETUP);
  const { t } = useTranslation();

  const closeAllModals = () => setCurrentDialog(MfaDialogState.NONE);
  const handleEditProfileClose = () => setIsEditProfileModalOpen(false);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return `${date.toLocaleDateString('en-US')}, ${date.toLocaleTimeString('en-US')}`;
  };

  useEffect(() => {
    if (
      currentDialog === MfaDialogState.AUTHENTICATOR_APP_SETUP ||
      currentDialog === MfaDialogState.EMAIL_VERIFICATION
    ) {
      setDialogState(currentDialog);
    }
  }, [currentDialog]);

  useEffect(() => {
    if (!userInfo || isLocalStorageSet.current) return;

    const shouldSetMfaState =
      userInfo.userMfaType === UserMfaType.NONE ||
      (userInfo.userMfaType !== UserMfaType.NONE && userInfo.mfaEnabled);

    if (shouldSetMfaState) {
      localStorage.setItem('initialMfaUserState', String(userInfo.mfaEnabled));
      isLocalStorageSet.current = true;
    }
  }, [userInfo]);

  const isDemoAccount = userInfo?.email === 'demo.construct@seliseblocks.com';

  return (
    <div className="flex flex-col gap-4">
      <ProfileCard
        userInfo={userInfo}
        isLoading={isLoading}
        formatDate={formatDate}
        onEditClick={() => setIsEditProfileModalOpen(true)}
        isEditProfileModalOpen={isEditProfileModalOpen}
        setIsEditProfileModalOpen={setIsEditProfileModalOpen}
        handleEditProfileClose={handleEditProfileClose}
      />

      <SecurityCard
        userInfo={userInfo}
        isLoading={isLoading}
        isDemoAccount={isDemoAccount}
        t={t}
        currentDialog={currentDialog}
        setCurrentDialog={setCurrentDialog}
        closeAllModals={closeAllModals}
        dialogState={dialogState}
        isChangePasswordModalOpen={isChangePasswordModalOpen}
        setIsChangePasswordModalOpen={setIsChangePasswordModalOpen}
      />
    </div>
  );
};
