import tailwindcssAnimate from 'tailwindcss-animate';
/** @typedef {import('tailwindcss').Config} Config */

/** @type {Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'bg-purple',
    'bg-burgundy',
    'bg-warning',
    'bg-primary-100',
    'bg-secondary-100',
    'bg-purple-100',
    'bg-burgundy-100',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito Sans', 'sans-serif'],
      },
      colors: {
        white: 'hsl(var(--white))',
        background: 'hsl(var(--background))',
        surface: 'hsl(var(--surface))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary-500))',
          50: 'hsl(var(--primary-50))',
          100: 'hsl(var(--primary-100))',
          200: 'hsl(var(--primary-200))',
          300: 'hsl(var(--primary-300))',
          400: 'hsl(var(--primary-400))',
          500: 'hsl(var(--primary-500))',
          600: 'hsl(var(--primary-600))',
          700: 'hsl(var(--primary-700))',
          800: 'hsl(var(--primary-800))',
          900: 'hsl(var(--primary-900))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary-500))',
          50: 'hsl(var(--secondary-50))',
          100: 'hsl(var(--secondary-100))',
          200: 'hsl(var(--secondary-200))',
          300: 'hsl(var(--secondary-300))',
          400: 'hsl(var(--secondary-400))',
          500: 'hsl(var(--secondary-500))',
          600: 'hsl(var(--secondary-600))',
          700: 'hsl(var(--secondary-700))',
          800: 'hsl(var(--secondary-800))',
          900: 'hsl(var(--secondary-900))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        neutral: {
          DEFAULT: 'hsl(var(--neutral-500))',
          25: 'hsl(var(--neutral-25))',
          50: 'hsl(var(--neutral-50))',
          100: 'hsl(var(--neutral-100))',
          200: 'hsl(var(--neutral-200))',
          300: 'hsl(var(--neutral-300))',
          400: 'hsl(var(--neutral-400))',
          600: 'hsl(var(--neutral-600))',
          700: 'hsl(var(--neutral-700))',
          800: 'hsl(var(--neutral-800))',
          900: 'hsl(var(--neutral-900))',
        },

        purple: {
          DEFAULT: 'hsl(var(--purple-500))',
          25: 'hsl(var(--purple-25))',
          50: 'hsl(var(--purple-50))',
          100: 'hsl(var(--purple-100))',
          200: 'hsl(var(--purple-200))',
          300: 'hsl(var(--purple-300))',
          400: 'hsl(var(--purple-400))',
          600: 'hsl(var(--purple-600))',
          700: 'hsl(var(--purple-700))',
          800: 'hsl(var(--purple-800))',
          900: 'hsl(var(--purple-900))',
        },

        pink: {
          DEFAULT: 'hsl(var(--pink-500))',
          50: 'hsl(var(--pink-50))',
          100: 'hsl(var(--pink-100))',
          200: 'hsl(var(--pink-200))',
          300: 'hsl(var(--pink-300))',
          400: 'hsl(var(--pink-400))',
          600: 'hsl(var(--pink-600))',
          700: 'hsl(var(--pink-700))',
          800: 'hsl(var(--pink-800))',
          900: 'hsl(var(--pink-900))',
        },

        green: {
          DEFAULT: 'hsl(var(--green-500))',
          50: 'hsl(var(--green-50))',
          100: 'hsl(var(--green-100))',
          200: 'hsl(var(--green-200))',
          300: 'hsl(var(--green-300))',
          400: 'hsl(var(--green-400))',
          600: 'hsl(var(--green-600))',
          700: 'hsl(var(--green-700))',
          800: 'hsl(var(--green-800))',
          900: 'hsl(var(--green-900))',
        },

        burgundy: {
          DEFAULT: 'hsl(var(--burgundy-500))',
          50: 'hsl(var(--burgundy-50))',
          100: 'hsl(var(--burgundy-100))',
          200: 'hsl(var(--burgundy-200))',
          300: 'hsl(var(--burgundy-300))',
          400: 'hsl(var(--burgundy-400))',
          500: 'hsl(var(--burgundy-500))',
          600: 'hsl(var(--burgundy-600))',
          700: 'hsl(var(--burgundy-700))',
          800: 'hsl(var(--burgundy-800))',
          900: 'hsl(var(--burgundy-900))',
        },

        'file-type': {
          folder: {
            icon: 'hsl(var(--folder-icon-color))',
            background: 'hsl(var(--folder-icon-background))',
          },
          file: {
            icon: 'hsl(var(--file-icon-color))',
            background: 'hsl(var(--file-icon-background))',
          },
          image: {
            icon: 'hsl(var(--image-icon-color))',
            background: 'hsl(var(--image-icon-background))',
          },
          audio: {
            icon: 'hsl(var(--audio-icon-color))',
            background: 'hsl(var(--audio-icon-background))',
          },
          video: {
            icon: 'hsl(var(--video-icon-color))',
            background: 'hsl(var(--video-icon-background))',
          },
        },

        success: {
          DEFAULT: 'hsl(var(--success))',
          background: 'hsl(var(--success-background))',
          'high-emphasis': 'hsl(var(--success-high-emphasis))',
        },

        warning: {
          DEFAULT: 'hsl(var(--warning))',
          background: 'hsl(var(--warning-background))',
          'high-emphasis': 'hsl(var(--warning-high-emphasis))',
        },

        error: {
          DEFAULT: 'hsl(var(--error))',
          background: 'hsl(var(--error-background))',
          'high-emphasis': 'hsl(var(--error-high-emphasis))',
        },

        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },

        'high-emphasis': 'hsl(var(--high-emphasis))',
        'medium-emphasis': 'hsl(var(--medium-emphasis))',
        'low-emphasis': 'hsl(var(--low-emphasis))',

        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      boxShadow: {
        'inset-right': 'inset -7px 0 5px -6px hsl(var(--surface))',
        'inset-left': 'inset 7px 0 5px -6px hsl(var(--surface))',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
