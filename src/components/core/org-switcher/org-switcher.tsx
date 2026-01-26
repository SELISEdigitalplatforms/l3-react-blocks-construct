import { useState, useMemo } from 'react';
import { Building2, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui-kit/dropdown-menu';
import { Skeleton } from '@/components/ui-kit/skeleton';
import { useGetAccount } from '@/modules/profile/hooks/use-account';
import { useGetMultiOrgs } from '@/lib/api/hooks/use-multi-orgs';
import { switchOrganization } from '@/modules/auth/services/auth.service';
import { useAuthStore } from '@/state/store/auth';
import { useToast } from '@/hooks/use-toast';
import { HttpError } from '@/lib/https';
import { decodeJWT } from '@/lib/utils/decode-jwt-utils';

const projectKey = import.meta.env.VITE_X_BLOCKS_KEY || '';

export const OrgSwitcher = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const { t } = useTranslation();
  const { setTokens, accessToken } = useAuthStore();
  const { toast } = useToast();

  const currentOrgId = useMemo(() => {
    if (!accessToken) return null;
    const decoded = decodeJWT(accessToken);
    return decoded?.org_id || null;
  }, [accessToken]);

  const { data, isLoading } = useGetAccount();
  const { data: orgsData, isLoading: isLoadingOrgs } = useGetMultiOrgs({
    ProjectKey: projectKey,
    Page: 0,
    PageSize: 10,
  });

  const organizations = orgsData?.organizations ?? [];
  const enabledOrganizations = organizations.filter((org) => org.isEnable);

  const selectedOrg = currentOrgId
    ? enabledOrganizations.find((org) => org.itemId === currentOrgId)
    : enabledOrganizations[0];

  const currentOrgRoles = useMemo(() => {
    if (!data?.memberships?.length || !currentOrgId) return [];
    const membership = data.memberships.find((m) => m.organizationId === currentOrgId);
    return membership?.roles ?? [];
  }, [data, currentOrgId]);

  const translatedRoles = currentOrgRoles
    .map((role: string) => {
      const roleKey = role.toUpperCase();
      return t(roleKey);
    })
    .join(', ');

  const handleOrgSelect = async (orgId: string) => {
    if (isSwitching || orgId === currentOrgId) {
      return;
    }

    try {
      setIsSwitching(true);
      setIsDropdownOpen(false);

      const response = await switchOrganization(orgId);

      setTokens({
        accessToken: response.access_token,
        refreshToken: response.refresh_token || useAuthStore.getState().refreshToken || '',
      });

      localStorage.setItem('selected-org-id', orgId);

      window.location.reload();
    } catch (error) {
      console.error('Failed to switch organization:', error);
      setIsSwitching(false);

      let errorTitle = t('FAILED_TO_SWITCH_ORGANIZATION');
      let errorDescription = t('SOMETHING_WENT_WRONG');

      if (error instanceof HttpError) {
        const errorData = error.error;

        if (errorData?.error === 'user_inactive_or_not_verified') {
          errorTitle = t('ACCESS_DENIED');
          errorDescription =
            typeof errorData?.error_description === 'string'
              ? errorData.error_description
              : t('USER_NOT_EXIST_IN_ORGANIZATION');
        } else if (typeof errorData?.error_description === 'string') {
          errorDescription = errorData.error_description;
        } else if (typeof errorData?.error === 'string') {
          errorDescription = errorData.error;
        }
      }

      toast({
        variant: 'destructive',
        title: errorTitle,
        description: errorDescription,
      });
    }
  };

  const isComponentLoading = isLoading || isLoadingOrgs || isSwitching;

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild className="cursor-pointer p-1 rounded-[2px]">
        <div className="flex justify-between items-center gap-1 sm:gap-3 cursor-pointer">
          <div className="flex items-center">
            {isComponentLoading ? (
              <Skeleton className="h-8 w-8 rounded-full" />
            ) : (
              <Building2 className="h-5 w-5 text-medium-emphasis" />
            )}
          </div>
          <div className="flex flex-col">
            {isComponentLoading ? (
              <>
                <Skeleton className="w-24 h-4 mb-1" />
                <Skeleton className="w-16 h-3" />
              </>
            ) : (
              <>
                <h2 className="text-xs font-normal text-high-emphasis">
                  {selectedOrg?.name ?? '_'}
                </h2>
                <p className="text-[10px] text-low-emphasis capitalize">{translatedRoles}</p>
              </>
            )}
          </div>
          {isDropdownOpen ? (
            <ChevronUp className="h-5 w-5 text-medium-emphasis" />
          ) : (
            <ChevronDown className="h-5 w-5 text-medium-emphasis" />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 text-medium-emphasis"
        align="end"
        side="top"
        sideOffset={10}
      >
        {enabledOrganizations.length > 0 ? (
          enabledOrganizations.map((org) => (
            <DropdownMenuItem key={org.itemId} onClick={() => handleOrgSelect(org.itemId)}>
              {org.name}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem>No orgs found</DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>{t('CREATE_NEW')}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
