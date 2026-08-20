import MetaTags from "@/components/meta-tags";
import MyLayout from "@/layouts/my-layout";
import { Link } from "@inertiajs/react";
import { 
    MessageSquare, 
    Flame, 
    ShieldCheck, 
    TrendingDown, 
    Activity, 
    Award, 
    Smartphone, 
    ChevronRight, 
    BookOpen, 
    CheckCircle2, 
    HelpCircle,
    Heart
} from "lucide-react";

export default function Home() {
    return (
        <MyLayout>
            <MetaTags
                title="หน้าแรก | โครงการ Happy Health Happy Heart"
                description="ร่วมแข่งขันลดน้ำหนักกับ Happy Health, Happy Heart แพลตฟอร์มที่ช่วยให้คุณควบคุมน้ำหนักได้อย่างมีประสิทธิภาพ ด้วยคำแนะนำจาก AI โปรแกรมโภชนาการ และชุมชนที่สนับสนุนคุณในการมีสุขภาพที่ดีและหัวใจที่แข็งแรง!"
                keywords="ลดน้ำหนัก, การแข่งขันลดน้ำหนัก, ควบคุมน้ำหนัก, สุขภาพดี, สุขภาพและความสุข, โภชนาการ, ฟิตเนส, วิธีลดน้ำหนัก, ลดน้ำหนักอย่างปลอดภัย, ออกกำลังกายลดน้ำหนัก, เมนูอาหารสุขภาพ, คำนวณแคลอรี่, โปรแกรมลดน้ำหนักออนไลน์, แอปช่วยลดน้ำหนัก, ลดน้ำหนักด้วย AI, โปรแกรมสุขภาพที่ดีที่สุด"
                author="คณะวิทยาศาสตร์และเทคโนโลยี x คณะสาธารณสุขศาสตร์ มหาวิทยาลัยราชภัฏวไลยอลงกรณ์ ในพระบรมราชูปถัมภ์"
                imageUrl="https://picsum.photos/1600/900"
                url={route("home")}
            />

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-radial from-zinc-100 via-zinc-50 to-zinc-50 dark:from-zinc-900/50 dark:via-zinc-950 dark:to-zinc-950">
                <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/5 pointer-events-none" />
                <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-red-500/5 blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                        {/* Left Info Column */}
                        <div className="lg:col-span-7 text-center lg:text-left space-y-6">
                            <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-950/80 px-3 py-1.5 rounded-full text-emerald-800 dark:text-emerald-300 text-xs font-semibold tracking-wide">
                                <Award className="h-4 w-4" />
                                แพลตฟอร์ม R&D เพื่อสุขภาพ
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-zinc-900 dark:text-zinc-50">
                                ดูแลสุขภาพดี <br />
                                <span className="bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                                    หัวใจแข็งแรงอัจฉริยะ
                                </span>
                            </h1>
                            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto lg:mx-0">
                                แพลตฟอร์มให้คำปรึกษาโภชนาการและการดูแลสุขภาพเฉพาะบุคคล ด้วยการเชื่อมโยงระบบหลังบ้านอัจฉริยะและฐานข้อมูลเข้ากับ LINE Chatbot ขับเคลื่อนผลลัพธ์การควบคุมน้ำหนักของบุคลากรด้วยเจเนอเรทีฟเอไอ
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <a 
                                    href="https://line.me/R/ti/p/@203glfet" 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 px-6 py-3 rounded-full text-base font-bold shadow-md transition-all duration-150 active:scale-98"
                                >
                                    <MessageSquare className="h-5 w-5" />
                                    เพิ่มเพื่อน LINE OA
                                </a>
                                <a 
                                    href="#features" 
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-zinc-300 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900/50 px-6 py-3 rounded-full text-base font-bold transition-all duration-150"
                                >
                                    <BookOpen className="h-5 w-5" />
                                    ดูข้อมูลฟีเจอร์
                                </a>
                            </div>
                        </div>

                        {/* Right Chat Mockup Column */}
                        <div className="lg:col-span-5 flex justify-center">
                            <div className="relative w-full max-w-[340px] aspect-[9/18.5] bg-zinc-950 rounded-[44px] p-3 border-4 border-zinc-800 dark:border-zinc-900 shadow-2xl shadow-emerald-500/10">
                                {/* Speaker pill */}
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-950 rounded-full flex items-center justify-center z-20">
                                    <div className="w-12 h-1.5 bg-zinc-800 rounded-full" />
                                </div>

                                {/* Screen Content */}
                                <div className="h-full w-full bg-slate-100 dark:bg-zinc-900 rounded-[34px] overflow-hidden flex flex-col justify-between pt-8 pb-4 px-3 font-sans">
                                    {/* LINE-like chat logs */}
                                    <div className="space-y-4 flex-grow overflow-y-auto pt-4 text-xs">
                                        {/* User prompt bubble */}
                                        <div className="flex flex-col items-end space-y-1">
                                            <span className="text-[10px] text-zinc-400 mr-1">ผู้ใช้</span>
                                            <div className="bg-emerald-500 text-white rounded-2xl rounded-tr-none px-3.5 py-2 max-w-[85%] shadow-xs leading-relaxed">
                                                ผัดซีอิ๊วเส้นใหญ่หมู 1 จาน มีกี่แคลอรี่ และสำหรับคนคุมน้ำหนักควรเลือกกินอย่างไรครับ
                                            </div>
                                        </div>

                                        {/* AI Chatbot response bubble */}
                                        <div className="flex flex-col items-start space-y-1">
                                            <div className="flex items-center gap-1.5 ml-1">
                                                <Heart className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" />
                                                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold">Happy Health Bot (AI)</span>
                                            </div>
                                            <div className="bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 rounded-2xl rounded-tl-none px-3.5 py-2.5 max-w-[88%] shadow-xs leading-relaxed border border-zinc-200/50 dark:border-zinc-700/50">
                                                ผัดซีอิ๊วหมู 1 จาน ให้พลังงานประมาณ 650-700 แคลอรี เนื่องจากใช้เส้นใหญ่ผัดน้ำมันเข้มข้น หากควบคุมน้ำหนัก แนะนำสั่งเป็น "ผัดซีอิ๊วเส้นหมี่ขาว" หรือเปลี่ยนเป็นเนื้ออกไก่ไม่หนัง และขอใส่น้ำมันน้อย ซึ่งจะช่วยลดปริมาณแคลอรีลงได้กว่า 150-200 แคลอรีครับ
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mock typing input */}
                                    <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full py-1.5 px-3.5 flex items-center justify-between shadow-xs">
                                        <span className="text-[11px] text-zinc-400">พิมพ์คำถามสุขภาพที่นี่...</span>
                                        <ChevronRight className="h-4 w-4 text-emerald-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Research Stats Grid */}
            <section id="stats" className="py-16 border-t border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-3 mb-12">
                        <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50">
                            ผลสัมฤทธิ์และผลการวิจัย R&D
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base">
                            ตัวเลขสถิติจากการทดลองใช้งานจริงในกลุ่มตัวอย่างบุคลากรของมหาวิทยาลัยจำนวน 30 ราย ตลอดระยะเวลากิจกรรมการจัดแข่งขันควบคุมน้ำหนัก
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {/* Stat Card 1 */}
                        <div className="bg-zinc-50 dark:bg-zinc-900/40 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-center space-y-2">
                            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                                4.59 / 5.00
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200">
                                ความพึงพอใจการใช้งานภาพรวม
                            </div>
                            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                                คะแนนสถิติระดับมากที่สุด
                            </div>
                        </div>

                        {/* Stat Card 2 */}
                        <div className="bg-zinc-50 dark:bg-zinc-900/40 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-center space-y-2">
                            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                                2.14 กก.
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200">
                                น้ำหนักเฉลี่ยที่ลดลงต่อคน
                            </div>
                            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                                ภายในระยะเวลากิจกรรมกลุ่ม
                            </div>
                        </div>

                        {/* Stat Card 3 */}
                        <div className="bg-zinc-50 dark:bg-zinc-900/40 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-center space-y-2">
                            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                                2.4 วินาที
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200">
                                เวลาเฉลี่ยในการตอบกลับ
                            </div>
                            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                                ความเร็วประมวลผล Gemini AI
                            </div>
                        </div>

                        {/* Stat Card 4 */}
                        <div className="bg-zinc-50 dark:bg-zinc-900/40 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-center space-y-2">
                            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                                99.8%
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200">
                                ความเสถียรภาพของระบบ
                            </div>
                            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                                อัตราการรัน Uptime หลังบ้าน
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Chatbot Features */}
            <section id="features" className="py-20 bg-zinc-50 dark:bg-zinc-950/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-3 mb-16">
                        <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-50">
                            คุณสมบัติการทำงานที่โดดเด่น
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base">
                            การทำงานร่วมกันระหว่าง API ล่าสุดของ Google และความปลอดภัยในการเก็บบันทึกข้อมูลเพื่ออำนวยความสะดวกในการวิจัยด้านสุขภาพ
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/80 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-6">
                                <MessageSquare className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
                                โต้ตอบคำปรึกษาอัจฉริยะ (AI Advice)
                            </h3>
                            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                                วิเคราะห์ประโยคธรรมชาติและคำนวณแคลอรีอาหารไทยได้อย่างถูกต้อง ผ่าน Google Gemini 2.0 Flash ตอบรวดเร็วไม่เยิ่นเย้อภายใน 1 ย่อหน้า
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/80 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-6">
                                <Flame className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
                                คำนวณพลังงาน BMR & TDEE
                            </h3>
                            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                                แนะนำเมนูอาหารที่สอดคล้องกับความต้องการแคลอรี่พื้นฐานของบุคคล ช่วยเหลือการบริหารเป้าหมายการบริโภคและการเผาผลาญในแต่ละวัน
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/80 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-6">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
                                บันทึกปลอดภัยตามมาตรฐาน PDPA
                            </h3>
                            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                                เก็บข้อมูลประวัติสนทนาลงในระบบฐานข้อมูล SQLite หรือ MySQL ที่มีความเสถียร จำกัดสิทธิการเข้าถึงข้อมูลเฉพาะผู้วิจัยและแอดมินที่ได้รับอนุญาต
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* LINE OA Connection Details */}
            <section id="download" className="py-20 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
                    <div className="space-y-3">
                        <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-50">
                            เริ่มต้นใช้งานบน LINE ของคุณ
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto text-sm sm:text-base">
                            ไม่ต้องติดตั้งแอปพลิเคชันใด ๆ เพิ่มเติม เพียงสแกนคิวอาร์โค้ดหรือแอดไลน์ของโครงการเพื่อเริ่มคุยกับ AI และลดน้ำหนักได้ทันที
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-12 bg-zinc-50 dark:bg-zinc-900 p-8 sm:p-12 rounded-3xl border border-zinc-150 dark:border-zinc-800 max-w-2xl mx-auto">
                        {/* LINE QR Code image */}
                        <div className="w-44 h-44 bg-white dark:bg-zinc-800 p-2.5 rounded-2xl shadow-xs border border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center gap-2">
                            <img 
                                src="/assets/img/line-qr.png" 
                                alt="LINE Add Friend QR Code" 
                                className="w-32 h-32 rounded-lg object-contain"
                            />
                            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold tracking-tight">สแกนจากกล้องมือถือ</span>
                        </div>

                        {/* Step items */}
                        <div className="text-left space-y-4 flex-grow">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                                <p className="text-sm text-zinc-700 dark:text-zinc-300">สแกน QR Code หรือเพิ่มเพื่อนด้วย LINE ID: <strong className="text-emerald-600 dark:text-emerald-400">@203glfet</strong></p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                                <p className="text-sm text-zinc-700 dark:text-zinc-300">กรอกข้อมูลบันทึกสัดส่วนน้ำหนัก/ส่วนสูงเมื่อบอตร้องขอ</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                                <p className="text-sm text-zinc-700 dark:text-zinc-300">พิมพ์ชื่อเมนูอาหาร หรือพฤติกรรมการออกกำลังกายเพื่อขอแผนทันที</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </MyLayout>
    );
}
