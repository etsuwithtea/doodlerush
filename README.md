# 🎨 DoodleRush

**DoodleRush** เป็นเกมแนว 2D Infinite Runner/Platformer ที่สร้างขึ้นด้วยเทคโนโลยีเว็บสมัยใหม่ มาพร้อมกับดีไซน์สไตล์ Neo-brutalism ที่เน้นเส้นขอบหนาและสีสันที่สดใส

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-State_Management-orange?style=flat-square)](https://zustand-demo.pmnd.rs/)

## 🚀 ฟีเจอร์เด่น
- **Infinite Gameplay**: ฉากที่ถูกสร้างแบบสุ่ม (Procedural Generation) ทำให้การเล่นแต่ละครั้งไม่ซ้ำกัน
- **Dynamic Physics**: ระบบฟิสิกส์ที่ลื่นไหล รองรับการกระโดดสองชั้น (Double Jump)
- **Session History**: บันทึกสถิติการเล่น ทั้งจำนวนดาวที่เก็บได้และเวลาที่ทำได้
- **Responsive Design**: รองรับการเล่นทั้งบน Desktop และ Mobile พร้อมปุ่มควบคุมบนหน้าจอ
- **Neo-brutalism UI**: ดีไซน์ที่โดดเด่น ทันสมัย และมีเอกลักษณ์

## 🎮 วิธีการเล่น (Controls)
### Desktop
- **เดินซ้าย/ขวา**: `A`, `D` หรือ `←`, `→`
- **กระโดด**: `W`, `Space` หรือ `↑` (กดซ้ำเพื่อ Double Jump)

### Mobile
- ใช้ปุ่มควบคุมบนหน้าจอเพื่อเคลื่อนที่และกระโดด

## 🛠️ เทคโนโลยีที่ใช้
- **Core**: [Next.js 15](https://nextjs.org/) & [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.stevenly.me/)

## 📦 การติดตั้งและเริ่มต้นใช้งาน

1. ติดตั้ง dependencies:
   ```bash
   npm install
   ```

2. รันโหมดการพัฒนา:
   ```bash
   npm run dev
   ```

3. เปิดเบราว์เซอร์ไปที่: [http://localhost:3000](http://localhost:3000)

## 📁 โครงสร้างโปรเจกต์
- `src/components/game`: คอมโพเนนต์หลักของเกมและระบบฟิสิกส์
- `src/store`: การจัดการ State ด้วย Zustand (คะแนน, เวลา, ประวัติ)
- `src/lib`: ฟังก์ชันช่วยเหลือและระบบฟิสิกส์พื้นฐาน
- `src/app`: โครงสร้างหน้าเว็บหลักของ Next.js

---
สร้างด้วย ❤️ โดย Antigravity

