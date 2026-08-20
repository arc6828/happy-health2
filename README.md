# โครงการ Happy Health Happy Heart 💚❤️

**โครงการวิจัยและพัฒนา "ระบบให้คำปรึกษากับผู้ควบคุมน้ำหนักร่วมกับเจเนอเรทีฟเอไอ"**
* **เว็บไซต์อย่างเป็นทางการ**: [https://happyhealthhappyheart.com](https://happyhealthhappyheart.com)
* **LINE Official Account (ID)**: `@203glfet` (ลิงก์เพิ่มเพื่อน: [https://line.me/R/ti/p/@203glfet](https://line.me/R/ti/p/@203glfet))

---

## 📖 คู่มือการใช้งานระบบ (User Manuals & Documentation)

คณะผู้วิจัยได้จัดเตรียมคู่มือการใช้งานระบบอย่างละเอียดเพื่ออำนวยความสะดวกในการทดสอบ ดังนี้:

1. **[คู่มือการใช้งานระบบเว็บไซต์ (Website User Manual)](file:///e:/chavalit/laravel/happy-health2/docs/website_manual.md)**
   * รายละเอียดฟังก์ชันระบบพอร์ตทัลสำหรับผู้ใช้ทั่วไป (คำนวณสัดส่วนร่างกาย, จดบันทึกน้ำหนัก/แคลอรี่, กระดานแข่งขัน, คลังสื่อความรู้)
   * รายละเอียดแดชบอร์ดหลังบ้านสำหรับผู้ดูแลระบบ (ค้นหาประวัติคุย, ขยายข้อความตอบกลับ AI, การปรับเปลี่ยน System Prompt และ Model Settings)
2. **[คู่มือการใช้งานแชตบอต LINE OA (LINE Chatbot User Manual)](file:///e:/chavalit/laravel/happy-health2/docs/line_manual.md)**
   * ขั้นตอนการแอดไลน์, การผูกบัญชีข้อมูลร่างกายเจาะจงบุคคล (Personalized Mode)
   * ขั้นตอนการส่งภาพถ่ายอาหารเพื่อประมาณพลังงานด้วยเอไอ (Multimodal Vision API)
   * วิธีสนทนาโต้ตอบสุขภาพ และระบบคัดกรองความปลอดภัยดักจับสแปมลิงก์ (URL filter)
3. **[ดัชนีเอกสารบทรายงานวิจัย 5 บท (Research Chapters Index)](file:///e:/chavalit/laravel/happy-health2/docs/README.md)**
   * เอกสารและข้อมูลเชิงทฤษฎี/วิธีดำเนินงานวิจัยแบ่งตามโฟลเดอร์บทที่ 1 ถึง 5 

---

## 🛠️ ขั้นตอนการติดตั้งและรันระบบเครื่องโลคอล (Local Setup & Run Instructions)

ระบบพัฒนาด้วยเทคโนโลยี **Laravel 11** ร่วมกับ **Inertia.js (React + TypeScript)** และจัดแต่งด้วย **Tailwind CSS v4** โดยใช้ฐานข้อมูล **SQLite** หรือ **MySQL** ในการทดสอบ

### 1. ความต้องการของระบบพื้นฐาน (Prerequisites)
* PHP >= 8.2
* Composer >= 2.0
* Node.js >= 18 (พร้อม npm)
* SQLite หรือ MySQL Server

### 2. ขั้นตอนการติดตั้ง (Installation Sequence)
เปิด Terminal ในโฟลเดอร์โปรเจกต์แล้วรันคำสั่งตามลำดับดังนี้:

```bash
# 1. ติดตั้งไลบรารีฝั่ง Backend (PHP)
composer install

# 2. ติดตั้งไลบรารีฝั่ง Frontend (JavaScript/TypeScript)
npm install

# 3. คัดลอกไฟล์ตั้งค่าระบบ (.env)
copy .env.example .env

# 4. สุ่มสร้างคีย์รหัสความปลอดภัยของ Laravel
php artisan key:generate

# 5. รันสร้างฐานข้อมูลและตารางข้อมูลทั้งหมด (Migrations)
php artisan migrate
```

### 3. การกรอกคีย์บริการภายนอกในไฟล์ `.env` (Environment Variables Configuration)
เปิดไฟล์ `.env` ขึ้นมาแก้ไขค่าตัวแปรเชื่อมโยงภายนอกให้ครบถ้วน:

```env
# ตั้งค่าคีย์เอไอประมวลผล Google Gemini
GEMINI_API_KEY="ใส่คีย์บริการ Gemini 2.0 ของท่าน"

# ตั้งค่าการเชื่อมต่อแชตบอต LINE Official Account
LINE_CHANNEL_ACCESS_TOKEN="ใส่ Channel Access Token จาก LINE Developers console"
LINE_CHANNEL_SECRET="ใส่ Channel Secret จาก LINE Developers console"
```

### 4. การเปิดใช้งานตัวเซิร์ฟเวอร์พัฒนาระบบ (Running Development Servers)
ต้องเปิด Terminal แยกจำนวน 2 หน้าต่างเพื่อรันเซิร์ฟเวอร์หลังบ้านและหน้าบ้านควบคู่กัน:

* **หน้าต่างที่ 1: รัน PHP Artisan Serve (Backend)**
  ```bash
  php artisan serve
  ```
  *(ระบบจะเริ่มรันที่อยู่เว็บท้องถิ่นที่: `http://127.0.0.1:8000`)*

* **หน้าต่างที่ 2: รัน Vite Development Server (Frontend)**
  ```bash
  npm run dev
  ```
  *(ระบบจะเริ่มการทำงานของ Hot-Reload ตรวจแก้โค้ดสด)*

---

## 🚀 การคอมไพล์เพื่อใช้งานจริง (Production Build)
เมื่อระบบพร้อมสำหรับติดตั้งใช้งานจริงบนโฮสติ้ง ให้รันคอมไพล์ฝั่งหน้าบ้านด้วยคำสั่ง:
```bash
npm run build
```
ระบบจะบีบอัดและคอมไพล์ไฟล์สคริปต์และ CSS เข้าสู่โฟลเดอร์ `public/build` เพื่อการโหลดที่รวดเร็วและมีความเสถียรสูงสุดตามมาตรฐานทางเทคนิค
