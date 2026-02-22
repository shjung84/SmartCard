// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 여기서 src 폴더 안의 모든 파일을 훑는지 확인!
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}