/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {

      fontFamily: {
        'k2d': ['K2D', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'nunito-sans': ['Nunito Sans', 'sans-serif'],
        'oswald': ['Oswald', 'sans-serif'],


       
        

      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out forwards',
      },
    
      

      colors: {
        customGreen: '#248C9A', 
      },
    },
  },
  plugins: [],
}

