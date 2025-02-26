import { useState } from 'react';
import { Lock, Pencil, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import { Button } from 'components/ui/button';
import { Separator } from 'components/ui/separator';
import { Dialog } from 'components/ui/dialog';
import { EditProfile } from '../modals/edit-profile/edit-profile';
import DummyProfile from '../../../../assets/images/dummy_profile.png';
import { UpdatePassword } from '../modals/update-password/update-password';
import { Skeleton } from 'components/ui/skeleton';
import { useGetAccount } from '../../hooks/use-account';

export const GeneralInfo = () => {
  const { data: userInfo, isLoading, isFetching } = useGetAccount();
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  const handleEditProfileClose = () => {
    setIsEditProfileModalOpen(false);
  };

  const joinedDate = userInfo ? new Date(userInfo.createdDate) : null;
  const lastLoggedInDate = userInfo ? new Date(userInfo.lastLoggedInTime) : null;

  return (
    <div className="flex flex-col gap-4">
      <Card className="w-full border-none rounded-[8px] shadow-sm">
        <CardHeader className="p-0 hidden">
          <CardTitle />
          <CardDescription />
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex justify-between">
            <div className="flex items-center">
              <div className="relative w-16 h-16 rounded-full border overflow-hidden border-white shadow-sm">
                {isLoading || isFetching ? (
                  <Skeleton className="w-16 h-16 rounded-full" />
                ) : (
                  <img
                    src={userInfo?.profileImageUrl || DummyProfile}
                    alt="Profile"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex flex-col gap-1 ml-3 sm:ml-9">
                {isLoading || isFetching ? (
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
            <Button size="sm" variant="ghost" onClick={() => setIsEditProfileModalOpen(true)}>
              <Pencil className="w-3 h-3 text-primary" />
              <span className="text-primary text-sm font-bold sr-only sm:not-sr-only sm:whitespace-nowrap">
                Edit
              </span>
            </Button>
            <Dialog open={isEditProfileModalOpen} onOpenChange={setIsEditProfileModalOpen}>
              {userInfo && <EditProfile userInfo={userInfo} onClose={handleEditProfileClose} />}
            </Dialog>
          </div>
          <Separator orientation="horizontal" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {isLoading || isFetching ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index}>
                  <Skeleton className="h-3 w-20 mb-1" />
                  <Skeleton className="h-5 w-36" />
                </div>
              ))
            ) : (
              <>
                <div>
                  <p className="text-medium-emphasis text-xs font-normal">Mobile No.</p>
                  <p className="text-high-emphasis text-sm">{userInfo?.phoneNumber ?? '-'}</p>
                </div>
                <div>
                  <p className="text-medium-emphasis text-xs font-normal">Joined On</p>
                  <p className="text-high-emphasis text-sm">
                    {joinedDate
                      ? `${joinedDate.toLocaleDateString('en-US')}, ${joinedDate.toLocaleTimeString('en-US')}`
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-medium-emphasis text-xs font-normal">Last Logged in</p>
                  <p className="text-high-emphasis text-sm">
                    {lastLoggedInDate
                      ? `${lastLoggedInDate.toLocaleDateString('en-US')}, ${lastLoggedInDate.toLocaleTimeString('en-US')}`
                      : '-'}
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="w-full border-none rounded-[8px] shadow-sm">
        <CardHeader className="space-y-0 p-0 hidden">
          <CardTitle />
          <CardDescription />
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <h1 className="text-xl text-high-emphasis font-semibold">Account security</h1>
          <Separator orientation="horizontal" />
          <div className="flex flex-col py-2 gap-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1">
                <h1 className="text-sm text-high-emphasis font-bold">Two-factor authentication</h1>
                <p className="text-sm text-medium-emphasis">
                  Enhance your security with app or email-based authenticator.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                disabled
                className="text-primary hover:text-primary text-sm font-bold"
              >
                <ShieldCheck className="w-4 h-4" />
                Enable
              </Button>
            </div>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1">
                <h1 className="text-sm text-high-emphasis font-bold">Change password</h1>
                <p className="text-sm text-medium-emphasis">
                  Update your password to keep your account safe.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="text-primary hover:text-primary text-sm font-bold"
                onClick={() => setIsChangePasswordModalOpen(true)}
              >
                <Lock className="w-4 h-4" />
                Update Password
              </Button>
              <UpdatePassword
                onClose={() => setIsChangePasswordModalOpen(false)}
                open={isChangePasswordModalOpen}
                onOpenChange={setIsChangePasswordModalOpen}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
