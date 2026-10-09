/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Public Theme: Red, Pink & Purple system
        fashion: {
          bg: 'var(--color-bg)',
          card: 'var(--color-card)',
          text: 'var(--color-text)',
          muted: 'var(--color-muted)',
          border: 'var(--color-border)',
          red: '#EF4444',
          pink: '#EC4899',
          purple: '#9333EA',
          rose: '#F43F5E',
          magenta: '#D946EF',
          violet: '#8B5CF6',
        },
        // Admin Theme: Blue & Black system
        admin: {
          blue: '#3B82F6',
          darkBlue: '#1E3A8A',
          hoverBlue: '#2563EB',
          lightBlue: '#60A5FA',
        },
        // Backwards compatibility mappings for public & admin components
        gold: {
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#F472B6', // Light Pink
          400: '#EC4899', // Hot Pink / Accent
          500: '#D946EF', // Fuchsia / Magenta Primary
          600: '#9333EA', // Royal Purple
          700: '#7E22CE', // Deep Purple
          800: '#E11D48', // Crimson Red
          900: '#991B1B', // Dark Red
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(236, 72, 153, 0.35)',
        'glow-purple': '0 0 25px -5px rgba(147, 51, 234, 0.4)',
        'glow-red': '0 0 25px -5px rgba(239, 68, 68, 0.4)',
        'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.4)',
        'luxury': '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
};

