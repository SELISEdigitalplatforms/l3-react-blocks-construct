import { useState } from 'react';
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
import { getUserRoles } from '@/hooks/use-user-roles';
import { useGetMultiOrgs } from '@/lib/api/hooks/use-multi-orgs';

const projectKey = import.meta.env.VITE_X_BLOCKS_KEY || '';

export const OrgSwitcher = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const { t } = useTranslation();

  const { data, isLoading } = useGetAccount();
  const { data: orgsData, isLoading: isLoadingOrgs } = useGetMultiOrgs({
    ProjectKey: projectKey,
    Page: 0,
    PageSize: 10,
  });

  const organizations = orgsData?.organizations ?? [];
  const enabledOrganizations = organizations.filter((org) => org.isEnable);

  const selectedOrg = selectedOrgId
    ? enabledOrganizations.find((org) => org.itemId === selectedOrgId)
    : enabledOrganizations[0];

  const userRoles = getUserRoles(data ?? null);
  const translatedRoles = userRoles
    .map((role: string) => {
      const roleKey = role.toUpperCase();
      return t(roleKey);
    })
    .join(', ');

  const handleOrgSelect = (orgId: string) => {
    setSelectedOrgId(orgId);
    setIsDropdownOpen(false);
  };

  const isComponentLoading = isLoading || isLoadingOrgs;

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
              <Skeleton className="w-24 h-4 mb-1" />
            ) : (
              <h2 className="text-xs font-normal text-high-emphasis">
                {selectedOrg?.name || 'Organization 1'}
              </h2>
            )}
            <p className="text-[10px] text-low-emphasis capitalize">{translatedRoles}</p>
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
          <DropdownMenuItem>Organization 1</DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem>{t('CREATE_NEW')}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
