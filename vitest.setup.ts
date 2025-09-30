import '@testing-library/jest-dom'
import { vi } from 'vitest'
import React from 'react'

// Browser APIs mocks for JSDOM compatibility
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver for components that use it
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver if needed
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Global mock for lucide-react icons to prevent missing export errors
vi.mock('lucide-react', () => {
  const mockIcon = ({ className, ...props }: any) => {
    return React.createElement('svg', {
      ...props,
      className: `lucide ${className || ''}`.trim(),
      'data-testid': 'mock-lucide-icon',
    })
  }

  // Create mock for all commonly used icons
  const iconNames = [
    'ChevronDown', 'ChevronUp', 'ChevronLeft', 'ChevronRight',
    'Calendar', 'CalendarIcon', 'Clock', 'User', 'Users', 'Settings', 'Search',
    'Plus', 'Minus', 'X', 'Check', 'Edit', 'Trash2', 'Eye', 'EyeOff',
    'Info', 'AlertCircle', 'CheckCircle', 'XCircle', 'Bell', 'BellOff',
    'Menu', 'MoreHorizontal', 'MoreVertical', 'Download', 'Upload',
    'Phone', 'Video', 'Mail', 'MessageSquare', 'Send', 'Forward',
    'Reply', 'Share', 'Copy', 'ExternalLink', 'Filter', 'SortAsc',
    'SortDesc', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
    'Loader2', 'LoaderCircle', 'EllipsisVertical', 'CircleUser', 'Pen',
    'Image', 'CirclePlus', 'FileText', 'LayoutDashboard', 'UserRoundX',
    'TrendingUp', 'UserCog', 'UserPlus'
  ]

  const mockIcons = iconNames.reduce((acc, name) => {
    acc[name] = mockIcon
    return acc
  }, {} as Record<string, any>)

  // Use Proxy to catch any missing icons dynamically
  return new Proxy(mockIcons, {
    get: (target, prop) => {
      if (prop in target) {
        return target[prop as string]
      }
      // Return mock icon for any missing icon
      return mockIcon
    }
  })
})

// Vitest automatically handles import.meta.env, but we can add custom setup here if needed
// For backward compatibility during migration, we'll set up both process.env and import.meta.env

// Mock import.meta.env for test environment
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        // Legacy CRA environment variables (for backward compatibility)
        REACT_APP_PUBLIC_BACKEND_URL: 'https://dev-api.seliseblocks.com',
        REACT_APP_PUBLIC_X_BLOCKS_KEY: 'cf18dc87904c4e1485639242cda4a026',
        REACT_APP_PUBLIC_BLOCKS_API_URL: 'https://dev-api.seliseblocks.com',
        REACT_APP_PUBLIC_API_URL: 'https://dev-api.seliseblocks.com',

        // Vite environment variables (for new development)
        VITE_PUBLIC_BACKEND_URL: 'https://dev-api.seliseblocks.com',
        VITE_PUBLIC_X_BLOCKS_KEY: 'cf18dc87904c4e1485639242cda4a026',
        VITE_PUBLIC_BLOCKS_API_URL: 'https://dev-api.seliseblocks.com',
        VITE_PUBLIC_API_URL: 'https://dev-api.seliseblocks.com',
        
        MODE: 'test',
        DEV: false,
        PROD: false,
      },
    },
  },
})