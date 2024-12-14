const { nextui } = require('@nextui-org/theme');
const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app,vaquita-ui-submodule}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
    '../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-100': '#ff8f00',
        'primary-200': '#FFA109',
        'primary-300': '#FEF0C7',
        'accent-100': '#F5F5F5',
        'accent-200': '#929292',
        'accent-300': '#667085',
        'text-100': '#F5F5F5',
        'text-200': '#E0E0E0',
        //bg-100: faeed6 // light version
        'bg-100': '#1D1F21',
        'bg-200': '#2C2E30',
        'bg-300': '#444648',
        'success-green': '#01BC8D',
        'warning-yellow': '#FFD032',
        'error-red': '#FF3B30',
      },
    },
    fontFamily: {
      clash: ['ClashDisplay', 'sans-serif'],
    },
    boxShadow: {
      'top-custom': '0 -4px 6px -2px rgba(245, 245, 245, 0.1)',
      'bottom-custom': '0 4px 6px 2px rgba(245, 245, 245, 0.1)',
    },
  },
  darkMode: 'class',
  plugins: [require('daisyui'), nextui()],
};
