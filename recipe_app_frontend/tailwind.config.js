/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,jsx}',
        './components/**/*.{js,jsx}'
    ],
    theme: {
        extend: {
            colors: {
                primary: '#3b82f6',
                accent: '#06b6d4',
                surface: '#ffffff',
                background: '#f9fafb',
                text: '#111827',
                muted: '#64748b'
            }
        }
    },
    plugins: []
};
