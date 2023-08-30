/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        visited: 'visitedAnimation 1.5s ease-in-out 0s 1 alternate forwards running',
        shortest: 'shortestPath 1.5s ease-in-out 0s 1 alternate forwards running',
        isWall: 'wallAni 0.6s ease-in 0s 1 alternate forwards running',
      },
      keyframes: {
        visitedAnimation: {
          '0%': {
            transform: 'scale(0.3)',
            backgroundColor: 'rgba(0, 0, 66, 0.75)',
            borderRadius: '100%',
          },
          '50%': {
            backgroundColor: 'rgba(217, 17, 187, 0.75)',
          },
          '75%': {
            transform: 'scale(1.2)',
            backgroundColor: 'rgba(34, 17, 217, 0.75)',
          },
          '100%': {
            transform: 'scale(1)',
            backgroundColor: 'rgba(0, 218, 69, 0.75)',
          },
        },
        shortestPath: {
          '0%': {
            transform: 'scale(0.6)',
            backgroundColor: 'rgba(78, 163, 191)',
          },
          '50%': {
            transform: 'scale(1.2)',
            backgroundColor: 'rgba(78, 163, 191)',
          },
          '100%': {
            transform: 'scale(1)',
            backgroundColor: 'rgba(78, 163, 191)',
          },
        },
        wallAni: {
          backgroundColor: 'rgb(255, 255, 255)',
          '0%': {
            transform: 'scale(0.3)',
            backgroundColor: 'rgb(128, 128, 128)',
          },
          '50%': {
            transform: 'scale(1.2)',
            backgroundColor: 'rgb(64, 64, 64)',
          },

          '100%': {
            transform: 'scale(1)',
            backgroundColor: 'rgb(0, 0, 0)',
          },
        },
      },
    },
  },
  plugins: [],
};
