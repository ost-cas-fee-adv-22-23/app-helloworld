/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@smartive-education/design-system-component-library-hello-world-team/tailwind')],
  content: [
    './node_modules/@smartive-education/design-system-component-library-hello-world-team/dist/components/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
  ],
};
