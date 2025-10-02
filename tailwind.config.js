module.exports = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // XL Axiata Brand Colors
        xl: {
          primary: '#FF0000', // Merah XL
          secondary: '#000000', // Hitam
          accent: '#FFFFFF', // Putih
          blue: '#0066CC', // Biru XL
          dark: '#333333', // Dark Gray
          light: '#F5F5F5', // Light Gray
          success: '#00A650', // Hijau
          warning: '#FF9900', // Orange
        },
      },
      fontFamily: {
        xl: ['Arial', 'Helvetica', 'sans-serif'], // Font similar to XL
      },
    },
  },
  plugins: [],
};
