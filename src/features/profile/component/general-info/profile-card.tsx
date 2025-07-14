import { useTranslation } from 'react-i18next';
import { Pencil } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import DummyProfile from 'assets/images/dummy_profile.png';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import { Button } from 'components/ui/button';
import { Dialog } from 'components/ui/dialog';
import { Separator } from 'components/ui/separator';
import { Skeleton } from 'components/ui/skeleton';
import { EditProfile } from '../modals/edit-profile/edit-profile';

export const ProfileCard: React.FC<{
  userInfo: any;
  isLoading: boolean;
  formatDate: (dateString: string | undefined) => string;
  onEditClick: () => void;
  isEditProfileModalOpen: boolean;
  setIsEditProfileModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleEditProfileClose: () => void;
}> = ({
  userInfo,
  isLoading,
  formatDate,
  onEditClick,
  isEditProfileModalOpen,
  setIsEditProfileModalOpen,
  handleEditProfileClose,
}) => {
  const { t } = useTranslation();

  return (
    <Card className="w-full border-none rounded-[8px] shadow-sm">
      <CardHeader className="p-0 hidden">
        <CardTitle />
        <CardDescription />
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex justify-between">
          <div className="flex items-center">
            <div className="relative w-16 h-16 rounded-full border overflow-hidden border-white shadow-sm">
              {isLoading ? (
                <Skeleton className="w-16 h-16 rounded-full" />
              ) : (
                <img
                  src={
                    userInfo?.profileImageUrl !== ''
                      ? (userInfo?.profileImageUrl ?? DummyProfile)
                      : DummyProfile
                  }
                  alt="Profile"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex flex-col gap-1 ml-3 sm:ml-9">
              {isLoading ? (
                <>
                  <Skeleton className="w-40 h-5" />
                  <Skeleton className="w-48 h-4 mt-1" />
                </>
              ) : (
                <>
                  <h1 className="text-xl text-high-emphasis font-semibold">
                    {userInfo?.firstName} {userInfo?.lastName}
                  </h1>
                  <p className="text-sm text-medium-emphasis">{userInfo?.email}</p>
                </>
              )}
            </div>
          </div>
          <Button size="sm" variant="ghost" onClick={onEditClick}>
            <Pencil className="w-3 h-3 text-primary" />
            <span className="text-primary text-sm font-bold sr-only sm:not-sr-only sm:whitespace-nowrap">
              {t('EDIT')}
            </span>
          </Button>
          <Dialog open={isEditProfileModalOpen} onOpenChange={setIsEditProfileModalOpen}>
            {userInfo && <EditProfile userInfo={userInfo} onClose={handleEditProfileClose} />}
          </Dialog>
        </div>
        <Separator orientation="horizontal" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map(() => (
              <div key={uuidv4()}>
                <Skeleton className="h-3 w-20 mb-1" />
                <Skeleton className="h-5 w-36" />
              </div>
            ))
          ) : (
            <>
              <div>
                <p className="text-medium-emphasis text-xs font-normal">{t('MOBILE_NO')}</p>
                <p className="text-high-emphasis text-sm">{userInfo?.phoneNumber ?? '-'}</p>
              </div>
              <div>
                <p className="text-medium-emphasis text-xs font-normal">{t('JOINED_ON')}</p>
                <p className="text-high-emphasis text-sm">{formatDate(userInfo?.createdDate)}</p>
              </div>
              <div>
                <p className="text-medium-emphasis text-xs font-normal">{t('LAST_LOGGED_IN')}</p>
                <p className="text-high-emphasis text-sm">
                  {formatDate(userInfo?.lastLoggedInTime)}
                </p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
