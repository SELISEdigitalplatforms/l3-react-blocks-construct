import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from 'components/ui/breadcrumb';
import { DYNAMIC_BREADCRUMB_TITLES } from 'constant/dynamic-breadcrumb-title';

/**
 * DynamicBreadcrumb Component
 *
 * A responsive breadcrumb navigation component that automatically generates breadcrumb
 * links based on the current URL path segments.
 *
 * Features:
 * - Automatic breadcrumb generation from URL path
 * - Configurable starting depth with breadcrumbIndex
 * - Transforms URL segments into readable labels (converts dashes to spaces, uppercase)
 * - Custom title mapping via DYNAMIC_BREADCRUMB_TITLES constant
 * - Responsive design (hidden on small screens)
 * - Current page indicator with different styling
 *
 * Props:
 * @param {number} [breadcrumbIndex] - Optional index to start displaying breadcrumbs from
 *   (e.g., breadcrumbIndex=2 will skip the first breadcrumb segment)
 *
 * @returns {JSX.Element} A breadcrumb navigation component
 *
 * @example
 * // Basic usage showing all path segments
 * <DynamicBreadcrumb />
 *
 * // Skip first breadcrumb level
 * <DynamicBreadcrumb breadcrumbIndex={2} />
 *
 * @note Requires DYNAMIC_BREADCRUMB_TITLES object for custom segment labels
 * @note Depends on React Router's useLocation hook for path information
 */

type DynamicBreadcrumbSegment = {
  href: string;
  label: string;
};

type DynamicBreadcrumbProps = {
  breadcrumbIndex?: number;
};

const DynamicBreadcrumb: React.FC<DynamicBreadcrumbProps> = ({ breadcrumbIndex }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const pathSegments = location.pathname.split('/').filter((segment) => segment);

  const dynamicBreadcrumbs: DynamicBreadcrumbSegment[] = pathSegments.map((_, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
    return {
      href,
      label: pathSegments[index].replace(/-/g, ' ').toUpperCase(),
    };
  });

  const displayedCrumbs = breadcrumbIndex
    ? dynamicBreadcrumbs.slice(breadcrumbIndex - 1)
    : dynamicBreadcrumbs;

  if (displayedCrumbs.length === 1 && DYNAMIC_BREADCRUMB_TITLES[displayedCrumbs[0].href]) {
    return null;
  }

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {displayedCrumbs.map((breadcrumb, index) => {
          const isLast = index === displayedCrumbs.length - 1;
          const title = DYNAMIC_BREADCRUMB_TITLES[breadcrumb.href];

          const isDynamicSegment = breadcrumb.label.includes('[') && breadcrumb.label.includes(']');
          const parentPath = breadcrumb.href.split('/').slice(0, -1).join('/');
          const parentTitle = parentPath ? DYNAMIC_BREADCRUMB_TITLES[parentPath] : null;

          const displayLabel =
            isDynamicSegment && parentTitle
              ? `${t(parentTitle)} > ${t(breadcrumb.label.replace(/[[\]]/g, ''))}`
              : title
                ? t(title)
                : t(breadcrumb.label);

          return (
            <React.Fragment key={breadcrumb.href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-xs text-muted-foreground">
                    {displayLabel}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      to={breadcrumb.href}
                      className="text-xs text-high-emphasis font-semibold hover:text-primary"
                    >
                      {displayLabel}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;
