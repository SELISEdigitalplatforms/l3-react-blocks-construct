import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumb, BreadcrumbLink, BreadcrumbList } from 'components/ui/breadcrumb';
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

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {/* Multi Breadcrumbs */}
        {/* {displayedCrumbs.map((breadcrumb, index) => (
          <React.Fragment key={breadcrumb.href}>
            <BreadcrumbItem>
              {index === displayedCrumbs.length - 1 ? (
                <BreadcrumbPage className="text-muted-foreground">
                  {DYNAMIC_BREADCRUMB_TITLES[breadcrumb.href] || breadcrumb.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={breadcrumb.href} className="hover:text-primary">
                    {DYNAMIC_BREADCRUMB_TITLES[breadcrumb.href] || breadcrumb.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < displayedCrumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))} */}
        {/* Single Breadcrumbs */}
        <BreadcrumbLink asChild>
          <Link to={displayedCrumbs[0].href} className="hover:text-primary">
            {DYNAMIC_BREADCRUMB_TITLES[displayedCrumbs[0].href] || displayedCrumbs[0].label}
          </Link>
        </BreadcrumbLink>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;
