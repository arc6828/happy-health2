# รายงานวิจัย: ระบบให้คำปรึกษากับผู้ควบคุมน้ำหนักร่วมกับเจเนอเรทีฟเอไอ

รายงานวิจัยฉบับนี้ศึกษาและนำเสนอการออกแบบและพัฒนา **ระบบช่วยคัดกรอง ให้คำปรึกษา และแนะนำข้อมูลการควบคุมน้ำหนัก** โดยใช้เทคโนโลยี Generative AI (Google Gemini 2.0 Flash) บูรณาการเข้ากับระบบแชตบอตบนแพลตฟอร์ม LINE เชื่อมต่อกับระบบหลังบ้านจัดการข้อมูล Laravel

---

## 📌 โครงสร้างรายงานวิจัย (Research Report Structure)

รายงานวิจัยนี้แบ่งออกเป็น 5 บทหลัก โดยถูกจัดกลุ่มเป็นบทละโฟลเดอร์เพื่อความสะดวกในการจัดการเอกสาร ดังนี้:

* **[บทที่ 1: บทนำ (Introduction)](file:///e:/chavalit/laravel/happy-health2/docs/chapter1/README.md)**
  * ความเป็นมาและประเด็นปัญหาพฤติกรรมสุขภาพและโรคอ้วน
  * วัตถุประสงค์ ขอบเขตงานวิจัย และประโยชน์ที่คาดว่าจะได้รับจากระบบ

* **[บทที่ 2: เอกสารและงานวิจัยที่เกี่ยวข้อง (Literature Review)](file:///e:/chavalit/laravel/happy-health2/docs/chapter2/README.md)**
  * แนวคิดการควบคุมน้ำหนัก ดัชนีมวลกาย และสมดุลพลังงาน (Caloric Deficit)
  * ปัญญาประดิษฐ์เชิงสร้างสรรค์ (Generative AI), LLM และโมเดล Gemini 2.0 Flash
  * LINE Messaging API และผลงานวิจัยแชตบอตสุขภาพในประเทศไทย

* **[บทที่ 3: วิธีการดำเนินงานวิจัย (Methodology)](file:///e:/chavalit/laravel/happy-health2/docs/chapter3/README.md)**
  * สถาปัตยกรรมระบบ (System Architecture) และเส้นทางการไหลของข้อมูล
  * รายละเอียดฐานข้อมูลการบันทึกประวัติการคุย (`line_chat_logs`)
  * การสกัดข้อผิดพลาด (isUrl Filter) และการวิศวกรรมพร้อมต์ (Prompt Engineering)

* **[บทที่ 4: ผลการวิจัยและการอภิปรายผล (Results and Discussion)](file:///e:/chavalit/laravel/happy-health2/docs/chapter4/README.md)**
  * ผลสัมฤทธิ์ของหน้าตาโปรแกรมประยุกต์และฐานข้อมูลหลังบ้าน
  * ตัวอย่างกรณีศึกษาในการทดลองพูดคุยและการสกัดคำตอบของโมเดล AI
  * การอภิปรายเรื่องระยะเวลาการตอบสนอง (Latency) และข้อจำกัดความยาวของย่อหน้า

* **[บทที่ 5: สรุปผลและข้อเสนอแนะ (Conclusion and Recommendations)](file:///e:/chavalit/laravel/happy-health2/docs/chapter5/README.md)**
  * สรุปผลลัพธ์และความสำเร็จของโครงการพัฒนา
  * ข้อจำกัดของระบบในเชิงรูปแบบข้อความและความน่าเชื่อถือด้านการแพทย์
  * ข้อเสนอแนะการพัฒนาต่อยอด เช่น การส่งภาพถ่ายอาหาร (Multimodal AI) และระบบการเก็บประวัติเจาะจงบุคคล (Personalized Tracking)

---

## 🛠️ รายละเอียดเทคโนโลยีในโครงการจริง (Project Stack Summary)
* **Backend Framework**: Laravel 11.x
* **Frontend Library**: Inertia.js + React.js + TypeScript
* **Database**: MySQL Server
* **Integrations**: LINE Messaging API SDK & Google Gemini API (`gemini-2.0-flash`)
