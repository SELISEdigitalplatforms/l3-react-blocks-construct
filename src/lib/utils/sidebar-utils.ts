import React from 'react';

/**
 * Computes the sidebar style based on the current state
 * @param isMobile Whether the device is mobile
 * @param open Whether the sidebar is open in desktop mode
 * @param openMobile Whether the sidebar is open in mobile mode
 * @returns CSS properties object for the sidebar
 */
export function getSidebarStyle(
  isMobile: boolean,
  open: boolean,
  openMobile: boolean
): React.CSSProperties {
  if (isMobile) {
    return {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100%',
      zIndex: 50,
      borderRight: 'none',
      transition: 'transform 0.3s ease-in-out',
      transform: openMobile ? 'translateX(0)' : 'translateX(-100%)',
    };
  }

  return {
    width: open ? 'var(--sidebar-width)' : '64px',
    minWidth: open ? 'var(--sidebar-width)' : '64px',
    transition: 'width 0.3s ease, min-width 0.3s ease',
    height: '100%',
  };
}
