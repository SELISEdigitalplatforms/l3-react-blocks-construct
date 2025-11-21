import { Activity } from 'react';
import { useIsProtected } from './use-is-protected';
import { cn } from '@/lib/utils';

type ProtectedFragmentProps = {
  roles?: string[];
  permissions?: string[];
  opt?: 'all' | 'any';
  mode?: 'disabled' | 'hidden';
  children: React.ReactNode;
};

export const ProtectedFragment = ({
  children,
  opt = 'any',
  roles = [],
  permissions = [],
  mode = 'hidden',
}: ProtectedFragmentProps) => {
  const { isProtected, isAuthenticated } = useIsProtected({ roles, permissions, opt });

  if (!isAuthenticated) {
    return mode === 'hidden' ? null : <>{children}</>;
  }

  if (mode === 'disabled') {
    return (
      <div className={cn(!isProtected && 'opacity-50 pointer-events-none cursor-not-allowed')}>
        {children}
      </div>
    );
  }

  return <Activity mode={isProtected ? 'visible' : 'hidden'}>{children}</Activity>;
};
