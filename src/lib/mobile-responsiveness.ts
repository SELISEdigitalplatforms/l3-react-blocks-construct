/**
 * Gets the maximum height for a scrollable container based on device dimensions
 * @param options Configuration options
 * @returns CSS value for maxHeight
 */
export function getResponsiveContainerHeight(options: {
  isEmpty?: boolean;
  isMobile: boolean;
  desktopHeight?: string;
  tallMobileHeight?: string;
  standardMobileHeight?: string;
  smallMobileHeight?: string;
}) {
  const {
    isEmpty = false,
    isMobile,
    desktopHeight = 'calc(100vh - 300px)',
    tallMobileHeight = 'calc(100vh - 420px)',
    standardMobileHeight = 'calc(100vh - 400px)',
    smallMobileHeight = 'calc(100vh - 350px)',
  } = options;

  // If container is empty, no need for scroll constraints
  if (isEmpty) return 'auto';

  if (!isMobile) return desktopHeight;

  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  // Handle iPhone XR (896px height), iPhone 14 Pro Max (932px), and Pixel 7 (around 915px) specifically
  if (viewportHeight >= 890 && viewportHeight <= 940 && viewportWidth <= 430) {
    // For iPhone XR, 14 Pro Max, Pixel 7 - reduce space to show more UI
    return tallMobileHeight;
  } else if (viewportHeight < 700) {
    // For smaller screens like iPhone SE
    return smallMobileHeight;
  } else {
    // For other mobile screens
    return standardMobileHeight;
  }
}
