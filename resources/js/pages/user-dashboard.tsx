import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { 
    MessageSquare, 
    Flame, 
    Scale, 
    Utensils, 
    Send, 
    Loader2, 
    Activity, 
    CheckCircle2, 
    AlertCircle,
    User,
    ChevronRight,
    Heart,
    Trophy,
    BookOpen,
    HelpCircle,
    X,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'หน้าแดชบอร์ดสุขภาพ',
        href: '/dashboard',
    },
];

interface HealthLog {
    id: number;
    type: 'weight' | 'diet';
    value: number;
    description: string | null;
    created_at: string;
}

interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
}

interface LeaderboardEntry {
    name: string;
    loss: number;
    percentage: number;
}

interface Article {
    id: number;
    title: string;
    description: string;
    content: string;
    readTime: string;
    tag: string;
}

export default function UserDashboard() {
    const { auth } = usePage().props as any;
    const userName = auth?.user?.name || 'ผู้ใช้งาน';
    const userEmail = auth?.user?.email || '';

    // Tab Navigation State
    const [activeTab, setActiveTab] = useState<'overview' | 'leaderboard' | 'media' | 'support'>('overview');

    // Health profile states
    const [height, setHeight] = useState<number>(170);
    const [age, setAge] = useState<number>(30);
    const [gender, setGender] = useState<'male' | 'female'>('female');
    const [activityLevel, setActivityLevel] = useState<number>(1.2);
    
    // Logs states
    const [logs, setLogs] = useState<HealthLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [profileSaving, setProfileSaving] = useState(false);
    const [logSaving, setLogSaving] = useState(false);

    // Form inputs
    const [weightInput, setWeightInput] = useState('');
    const [foodName, setFoodName] = useState('');
    const [foodCal, setFoodCal] = useState('');

    // Leaderboard state
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [leaderboardLoading, setLeaderboardLoading] = useState(false);

    // Selected article for reader modal
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    // FAQ active index state
    const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

    // Ticket form state
    const [ticketMessage, setTicketMessage] = useState('');
    const [ticketSubmitting, setTicketSubmitting] = useState(false);

    // Chatbot widget states
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        { sender: 'bot', text: `สวัสดีค่ะคุณ ${userName} ยินดีต้อนรับสู่ระบบ Happy Health! มีอะไรอยากให้ช่วยวิเคราะห์ เช่น แคลอรี่ในจานโปรด หรือโปรแกรมออกกำลังกาย สามารถพิมพ์ถามได้เลยนะคะ` }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);

    // Toast message state
    const [toast, setToast] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Fetch user health data & profile
    const fetchUserData = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/user/health-logs');
            if (response.ok) {
                const result = await response.json();
                
                // Populate profile
                if (result.profile) {
                    setHeight(result.profile.height || 170);
                    setAge(result.profile.age || 30);
                    setGender(result.profile.gender || 'female');
                    setActivityLevel(result.profile.activity_level || 1.2);
                }
                
                setLogs(result.logs || []);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch Leaderboard
    const fetchLeaderboard = async () => {
        setLeaderboardLoading(true);
        try {
            const response = await fetch('/api/leaderboard');
            if (response.ok) {
                const result = await response.json();
                setLeaderboard(result || []);
            }
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        } finally {
            setLeaderboardLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        if (activeTab === 'leaderboard') {
            fetchLeaderboard();
        }
    }, [activeTab]);

    // Get latest logged weight
    const getLatestWeight = () => {
        const weightLog = logs.find(log => log.type === 'weight');
        return weightLog ? weightLog.value : 60; // Default to 60 kg if no weight logged
    };

    // Calculate BMR (Mifflin-St Jeor Equation)
    const calculateBMR = () => {
        const w = getLatestWeight();
        if (gender === 'male') {
            return Math.round(10 * w + 6.25 * height - 5 * age + 5);
        } else {
            return Math.round(10 * w + 6.25 * height - 5 * age - 161);
        }
    };

    // Calculate TDEE
    const calculateTDEE = () => {
        return Math.round(calculateBMR() * activityLevel);
    };

    // Target Calories (TDEE - 550 for calorie deficit)
    const getTargetCalories = () => {
        const target = calculateTDEE() - 500;
        return target > 1200 ? target : 1200; // Limit minimum to 1200 kcal for safety
    };

    // Get today's total calorie intake
    const getTodayCalorieIntake = () => {
        const today = new Date().toDateString();
        return logs
            .filter(log => log.type === 'diet' && new Date(log.created_at).toDateString() === today)
            .reduce((sum, log) => sum + log.value, 0);
    };

    // Update profile settings
    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileSaving(true);
        setToast(null);
        try {
            const response = await fetch('/api/user/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    height,
                    age,
                    gender,
                    activity_level: activityLevel
                })
            });
            if (response.ok) {
                setToast({ type: 'success', text: 'อัปเดตข้อมูลร่างกายสำเร็จแล้ว!' });
                setTimeout(() => setToast(null), 3000);
            } else {
                setToast({ type: 'error', text: 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบข้อมูล' });
            }
        } catch (error) {
            setToast({ type: 'error', text: 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์' });
        } finally {
            setProfileSaving(false);
        }
    };

    // Log a new weight or food calories
    const handleLogSubmit = async (type: 'weight' | 'diet') => {
        setLogSaving(true);
        setToast(null);
        
        let value = 0;
        let description = '';

        if (type === 'weight') {
            value = parseFloat(weightInput);
            if (isNaN(value) || value <= 0) {
                setToast({ type: 'error', text: 'กรุณากรอกค่าน้ำหนักตัวให้ถูกต้อง' });
                setLogSaving(false);
                return;
            }
            description = 'น้ำหนักตัวประจำวัน';
        } else {
            value = parseFloat(foodCal);
            description = foodName.trim();
            if (!description) {
                setToast({ type: 'error', text: 'กรุณากรอกชื่อเมนูอาหาร' });
                setLogSaving(false);
                return;
            }
            if (isNaN(value) || value <= 0) {
                setToast({ type: 'error', text: 'กรุณากรอกแคลอรี่ให้ถูกต้อง' });
                setLogSaving(false);
                return;
            }
        }

        try {
            const response = await fetch('/api/user/health-logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, value, description })
            });

            if (response.ok) {
                setToast({ type: 'success', text: type === 'weight' ? 'บันทึกค่าน้ำหนักสำเร็จ!' : 'บันทึกรายการอาหารสำเร็จ!' });
                
                // Clear input
                if (type === 'weight') {
                    setWeightInput('');
                } else {
                    setFoodName('');
                    setFoodCal('');
                }

                // Refresh data list
                fetchUserData();
                setTimeout(() => setToast(null), 3000);
            } else {
                setToast({ type: 'error', text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่' });
            }
        } catch (error) {
            setToast({ type: 'error', text: 'เกิดข้อผิดพลาดในการเชื่อมต่อหลังบ้าน' });
        } finally {
            setLogSaving(false);
        }
    };

    // Send chat message to AI Health Advisor
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const text = chatInput.trim();
        if (!text || chatLoading) return;

        // Append user message
        setChatMessages(prev => [...prev, { sender: 'user', text }]);
        setChatInput('');
        setChatLoading(true);

        try {
            const response = await fetch('/api/web-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: text })
            });

            if (response.ok) {
                const result = await response.json();
                setChatMessages(prev => [...prev, { sender: 'bot', text: result.reply }]);
            } else {
                setChatMessages(prev => [...prev, { sender: 'bot', text: 'ขออภัยด้วยค่ะ ระบบขัดข้องไม่สามารถสื่อสารกับ AI ได้ในขณะนี้' }]);
            }
        } catch (error) {
            setChatMessages(prev => [...prev, { sender: 'bot', text: 'การเชื่อมต่ออินเทอร์เน็ตมีปัญหา กรุณาลองส่งคำถามใหม่อีกครั้งนะคะ' }]);
        } finally {
            setChatLoading(false);
        }
    };

    // Submit ticket message
    const handleTicketSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!ticketMessage.trim()) return;

        setTicketSubmitting(true);
        setTimeout(() => {
            setToast({ type: 'success', text: 'ส่งตั๋วขอความช่วยเหลือสำเร็จ! ทีมงานจะติดต่อกลับทางอีเมลภายใน 24 ชม.' });
            setTicketMessage('');
            setTicketSubmitting(false);
            setTimeout(() => setToast(null), 4000);
        }, 1000);
    };

    // Articles data mockup
    const articles: Article[] = [
        {
            id: 1,
            title: "Caloric Deficit: กุญแจสำคัญสู่การลดน้ำหนักอย่างถาวร",
            description: "ทำความเข้าใจกับกลไกการรับแคลอรี่ให้ต่ำกว่าค่าเผาผลาญเพื่อลดความอ้วนอย่างปลอดภัย",
            readTime: "อ่าน 3 นาที",
            tag: "โภชนาการ",
            content: "Caloric Deficit หรือการขาดดุลพลังงาน คือกระบวนการที่เราควบคุมการบริโภคอาหาร (Energy Intake) ให้มีพลังงานน้อยกว่าที่ร่างกายเผาผลาญออกไปในชีวิตประจำวัน (Energy Expenditure) ส่งผลให้ร่างกายจำเป็นต้องสลายไขมันสะสมที่ตับและเนื้อเยื่อต่าง ๆ ออกมาเป็นพลังงานทดแทน วิธีการขาดดุลพลังงานที่ปลอดภัยและได้รับการยอมรับทางการแพทย์คือการจำกัดแคลอรี่ให้อยู่ในระดับติดลบ 300 - 500 kcal จากค่า TDEE ของคุณ โดยหลีกเลี่ยงการอดอาหารแบบรุนแรงหรือรับพลังงานต่ำกว่า 1200 kcal ต่อวัน ซึ่งอาจส่งผลเสียต่อการทำงานของต่อมไทรอยด์และระบบเมตาบอลิซึมระยะยาว"
        },
        {
            id: 2,
            title: "BMR vs TDEE: รู้จักค่าพลังงานเพื่อควบคุมอาหารให้ตรงจุด",
            description: "เข้าใจความต่างระหว่างพลังงานพื้นฐานในการอยู่รอดและพลังงานที่ใช้จริงในการทำกิจกรรม",
            readTime: "อ่าน 4 นาที",
            tag: "ความรู้พื้นฐาน",
            content: "BMR (Basal Metabolic Rate) คืออัตราการเผาผลาญพลังงานขั้นพื้นฐานของร่างกายในการดำรงชีวิตในขณะที่อยู่นิ่ง เช่น การหายใจ การสูบฉีดโลหิตของหัวใจ และการทำงานของระบบเซลล์อวัยวะภายใน ส่วน TDEE (Total Daily Energy Expenditure) คือจำนวนพลังงานทั้งหมดที่คุณเผาผลาญในแต่ละวันจากการออกกำลังกายและทำกิจกรรมต่าง ๆ โดยคำนวณจาก BMR คูณด้วยตัวแปรระดับกิจกรรม การทราบค่าทั้งสองจะช่วยให้เราสามารถกำหนดโควตาอาหารในแต่ละวันได้อย่างเหมาะสม เช่น หาก TDEE ของคุณคือ 2000 kcal การบริโภค 1500 kcal จะสร้าง Caloric Deficit 500 kcal ส่งผลให้น้ำหนักค่อย ๆ ลดลงอย่างเป็นธรรมชาติสัปดาห์ละ 0.5 กก."
        },
        {
            id: 3,
            title: "โภชนาการแบบ 80/20: วิธีควบคุมน้ำหนักโดยไม่ต้องตัดความสุข",
            description: "หลักการแบ่งมื้ออาหารสุขภาพ 80% และมื้ออาหารโปรด 20% เพื่อการคุมน้ำหนักในระยะยาว",
            readTime: "อ่าน 3 นาที",
            tag: "ไลฟ์สไตล์",
            content: "หลักการ 80/20 ในการคุมอาหารคือ แนวคิดการกินแบบยืดหยุ่น โดยแบ่งสัดส่วนอาหารที่กินในแต่ละวันหรือสัปดาห์ออกเป็น 2 ส่วน: 80% แรกคัดสรรอาหารที่มีคุณค่าโภชนาการสูง ปรุงแต่งน้อย มีใยอาหารและโปรตีนสูง (Whole Foods) เช่น ผัก ผลไม้ เนื้ออกไก่ ไข่ต้ม และข้าวกล้อง อีก 20% ที่เหลือแบ่งไว้สำหรับมื้ออาหารโปรดตามใจชอบ เช่น ขนมหวาน ชานมไข่มุก หรือพิซซ่า เพื่อช่วยลดความเครียดจากการลดน้ำหนัก และช่วยป้องกันอาการตะกละอาหารหลังหักดิบ (Binge Eating) ส่งผลให้ผู้เข้าร่วมวิจัยสามารถปรับเปลี่ยนพฤติกรรมการคุมอาหารไปใช้ตลอดชีวิตได้อย่างยั่งยืน"
        },
        {
            id: 4,
            title: "Cardio vs Weight Training: เลือกออกกำลังกายแบบไหนดีที่สุด?",
            description: "เปรียบเทียบการวิ่งคาดิโอเผาผลาญทันทีและการเวทเทรนนิ่งสร้างกล้ามเนื้อเพิ่มระบบเผาผลาญ",
            readTime: "อ่าน 5 นาที",
            tag: "การออกกำลังกาย",
            content: "ในการควบคุมน้ำหนัก การออกกำลังกายทั้งสองประเภทมีบทบาทสำคัญต่างกัน: การออกกำลังกายแบบคาร์ดิโอ (Cardio) เช่น การเดินเร็ว การวิ่งจ็อกกิ้ง หรือปั่นจักรยาน ช่วยให้หัวใจแข็งแรงและเผาผลาญพลังงานได้ทันทีจำนวนมากในระหว่างที่ออกกำลังกาย ในขณะที่การออกกำลังกายแบบเวทเทรนนิ่ง (Weight Training) เป็นการยกน้ำหนักเพื่อกระตุ้นและสร้างมวลกล้ามเนื้อ ซึ่งกล้ามเนื้อเปรียบเสมือนเตาเผาผลาญพลังงานของร่างกาย แม้ในขณะนอนหลับร่างกายที่มีมวลกล้ามเนื้อสูงก็จะเผาผลาญแคลอรี่ได้ดีกว่าปกติ (Afterburn Effect) ดังนั้นเพื่อผลลัพธ์ที่ดีที่สุดในการลดน้ำหนักและกระชับสัดส่วน ควรออกกำลังกายแบบผสมผสานทั้งเวทเทรนนิ่ง 3-4 วัน และคาร์ดิโอควบคู่กันสัปดาห์ละ 150 นาที"
        }
    ];

    // FAQ data mockup
    const faqs = [
        {
            question: "คำนวณแคลอรี่เป้าหมายอย่างไร?",
            answer: "ระบบคำนวณเป้าหมายแคลอรี่ประจำวันโดยใช้สูตร Mifflin-St Jeor เพื่อคำนวณค่า BMR (พลังงานพื้นฐาน) ร่วมกับระดับกิจกรรมของคุณเพื่อหาค่า TDEE จากนั้นระบบจะสร้าง Caloric Deficit โดยหักออก 500 kcal จากค่า TDEE เพื่อใช้เป็นเป้าหมายพลังงานการลดน้ำหนักที่ปลอดภัยและเหมาะสมเฉพาะตัวคุณ"
        },
        {
            question: "ทำอย่างไรหากปริมาณแคลอรี่สะสมของมื้ออาหารในวันนี้เกินเป้าหมาย?",
            answer: "หากวันนี้กินเกิน ไม่ต้องตื่นตระหนกหรืออดอาหารในวันถัดไปค่ะ แนะนำให้ชดเชยโดยการเพิ่มการทำกิจกรรม เช่น เดินเร็วให้มากขึ้น 20-30 นาที หรือลดปริมาณแคลอรี่ในวันถัดลงเล็กน้อย การลดน้ำหนักประเมินผลจากยอดรวมพลังงานในระดับสัปดาห์ ไม่ได้ขึ้นกับมื้อเดี่ยวเพียงมื้อเดียว"
        },
        {
            question: "คุยกับ LINE Bot อย่างไรและค้นหารูปภาพได้หรือไม่?",
            answer: "คุณสามารถสแกนคิวอาร์โค้ดหน้าแรกหรือเพิ่มเพื่อน LINE ID: @203glfet จากนั้นเปิดหน้าแชตส่งข้อความทักถามหรือพิมพ์เมนูอาหารได้ทันที นอกจากนี้ยังสามารถถ่ายรูปภาพจานอาหารส่งเข้าไปในไลน์ เพื่อให้ AI ทำการตรวจจับชิ้นอาหารและประมาณค่าแคลอรี่แนะแนวโภชนาการได้ทันทีค่ะ"
        }
    ];

    const todayCalIntake = getTodayCalorieIntake();
    const targetCalories = getTargetCalories();
    const caloriePercentage = Math.min(Math.round((todayCalIntake / targetCalories) * 100), 100);
    const calorieExceeded = todayCalIntake > targetCalories;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="แผงควบคุมโภชนาการและการควบคุมน้ำหนัก" />

            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header Title Section */}
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                            <Heart className="h-6 w-6 text-emerald-500 fill-emerald-500 animate-pulse" />
                            สวัสดีคุณ {userName}! ยินดีต้อนรับสู่แผงสุขภาพ
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm">
                            แผงควบคุมโภชนาการ สรุปอันดับการแข่งขันวิจัย คลังความรู้สุขภาพ และการปรึกษาแชตบอต AI
                        </p>
                    </div>
                </div>

                {/* Toast Notification Banner */}
                {toast && (
                    <div className={`p-4 rounded-xl border flex items-center justify-between text-sm font-semibold transition-all duration-200 animate-in fade-in-50 ${
                        toast.type === 'success' 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-800/80 dark:text-emerald-300' 
                            : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/30 dark:border-red-800/80 dark:text-red-300'
                    }`}>
                        <div className="flex items-center gap-2">
                            {toast.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                            {toast.text}
                        </div>
                        <button onClick={() => setToast(null)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {/* Tabs Switch Section */}
                <div className="flex border-b border-zinc-200 dark:border-zinc-800/80 overflow-x-auto pb-[2px] gap-2 shrink-0">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all duration-150 flex items-center gap-2 ${
                            activeTab === 'overview' 
                                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-extrabold' 
                                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                        }`}
                    >
                        <Flame className="h-4 w-4" />
                        ภาพรวมและแชต AI (Overview)
                    </button>
                    <button
                        onClick={() => setActiveTab('leaderboard')}
                        className={`px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all duration-150 flex items-center gap-2 ${
                            activeTab === 'leaderboard' 
                                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-extrabold' 
                                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                        }`}
                    >
                        <Trophy className="h-4 w-4" />
                        การแข่งขันลดน้ำหนัก (Leaderboard)
                    </button>
                    <button
                        onClick={() => setActiveTab('media')}
                        className={`px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all duration-150 flex items-center gap-2 ${
                            activeTab === 'media' 
                                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-extrabold' 
                                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                        }`}
                    >
                        <BookOpen className="h-4 w-4" />
                        คลังบทความสุขภาพ (Media Library)
                    </button>
                    <button
                        onClick={() => setActiveTab('support')}
                        className={`px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all duration-150 flex items-center gap-2 ${
                            activeTab === 'support' 
                                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-extrabold' 
                                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                        }`}
                    >
                        <HelpCircle className="h-4 w-4" />
                        ช่วยเหลือ & FAQ
                    </button>
                </div>

                {/* Tab Content 1: Overview & Web Chat */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Left Column: Chatbot Widget & Activity logs (lg:col-span-7) */}
                        <div className="lg:col-span-7 space-y-6 flex flex-col h-full">
                            {/* AI Health Chatbot Widget */}
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl shadow-xs overflow-hidden flex flex-col h-[520px]">
                                {/* Chat Header */}
                                <div className="bg-emerald-50/50 dark:bg-emerald-950/30 px-6 py-4 border-b border-zinc-150 dark:border-zinc-800/80 flex items-center justify-between shrink-0">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-emerald-500 animate-pulse" />
                                        <span className="font-extrabold text-sm sm:text-base text-zinc-950 dark:text-zinc-50">ปรึกษา AI สุขภาพ (Gemini Health Assistant)</span>
                                    </div>
                                    <span className="bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">โต้ตอบสด</span>
                                </div>

                                {/* Chat Log Body */}
                                <div className="flex-grow p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
                                    {chatMessages.map((msg, i) => (
                                        <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}>
                                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                                                {msg.sender === 'user' ? 'คุณ' : 'Happy Health AI'}
                                            </span>
                                            <div className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                                                msg.sender === 'user'
                                                    ? 'bg-emerald-600 text-white rounded-tr-none shadow-xs'
                                                    : 'bg-zinc-100 dark:bg-zinc-850 text-zinc-800 dark:text-zinc-100 rounded-tl-none border border-zinc-200/40 dark:border-zinc-850'
                                            }`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                    {chatLoading && (
                                        <div className="flex flex-col items-start space-y-1.5 animate-pulse">
                                            <span className="text-[10px] text-zinc-400">Happy Health AI</span>
                                            <div className="bg-zinc-100 dark:bg-zinc-850 p-3.5 rounded-2xl rounded-tl-none border border-zinc-200/40 dark:border-zinc-850 text-zinc-400 flex items-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                                                กำลังคำนวณสูตรอาหารเพื่อตอบกลับคุณ...
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Chat Input form */}
                                <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-150 dark:border-zinc-800/80 shrink-0 bg-zinc-50/50 dark:bg-zinc-900/30 flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="พิมพ์ถาม เช่น ข้าวผัด 1 จานมีกี่แคล? หรือขอโปรแกรมเวทเทรนนิ่งหน่อย..."
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        className="flex-grow px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-emerald-500/50 text-zinc-800 dark:text-zinc-100"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!chatInput.trim() || chatLoading}
                                        className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-300 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:disabled:bg-zinc-800 p-2.5 rounded-xl transition-all duration-150 flex items-center justify-center shrink-0"
                                    >
                                        <Send className="h-4 w-4" />
                                    </button>
                                </form>
                            </div>

                            {/* Activity logs history */}
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl p-6 shadow-2xs space-y-4">
                                <h3 className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-emerald-500" />
                                    ประวัติกิจกรรมย้อนหลัง
                                </h3>
                                <div className="divide-y divide-zinc-150 dark:divide-zinc-800/40 max-h-[300px] overflow-y-auto pr-2 text-xs sm:text-sm">
                                    {loading ? (
                                        <div className="py-6 text-center text-zinc-400 flex items-center justify-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                                            กำลังดึงบันทึกกิจกรรม...
                                        </div>
                                    ) : logs.length === 0 ? (
                                        <div className="py-6 text-center text-zinc-400">
                                            ยังไม่มีข้อมูลกิจกรรม ให้ลองเริ่มพิมพ์บันทึกน้ำหนักหรือรายการอาหารด้านขวามือได้เลยค่ะ
                                        </div>
                                    ) : (
                                        logs.map((log) => (
                                            <div key={log.id} className="py-3 flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                        log.type === 'weight' 
                                                            ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400' 
                                                            : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400'
                                                    }`}>
                                                        {log.type === 'weight' ? <Scale className="h-4 w-4" /> : <Utensils className="h-4 w-4" />}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-zinc-800 dark:text-zinc-200">
                                                            {log.type === 'weight' ? `บันทึกค่าน้ำหนัก` : log.description}
                                                        </span>
                                                        <span className="block text-[10px] text-zinc-400 mt-0.5">
                                                            {new Date(log.created_at).toLocaleString('th-TH')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                                                    {log.type === 'weight' ? `${log.value} กก.` : `${log.value} kcal`}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Health Profile & Data logging inputs (lg:col-span-5) */}
                        <div className="lg:col-span-5 space-y-6">
                            {/* Daily Calorie Intake Tracker Progress Bar */}
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl p-6 shadow-2xs space-y-4">
                                <h3 className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                                    <Flame className="h-5 w-5 text-emerald-500" />
                                    แคลอรี่ที่กินวันนี้ (Calorie Deficit Tracker)
                                </h3>
                                
                                <div className="flex justify-between items-end text-xs">
                                    <div>
                                        <span className="text-zinc-400">เป้าหมายพลังงานวันนี้</span>
                                        <span className="block text-xl font-black text-emerald-600 dark:text-emerald-400">{targetCalories} kcal</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-zinc-400">กินสะสมไปแล้ว</span>
                                        <span className={`block text-xl font-black ${calorieExceeded ? 'text-red-500' : 'text-zinc-900 dark:text-zinc-50'}`}>
                                            {todayCalIntake} kcal
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-4 overflow-hidden relative border border-zinc-200/40 dark:border-zinc-700/50">
                                        <div 
                                            style={{ width: `${caloriePercentage}%` }}
                                            className={`h-full rounded-full transition-all duration-300 ${
                                                calorieExceeded ? 'bg-red-500' : 'bg-emerald-500'
                                            }`}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-zinc-400">
                                        <span>0 kcal</span>
                                        <span>{caloriePercentage}% ของเป้าหมาย</span>
                                        <span>{targetCalories} kcal</span>
                                    </div>
                                </div>

                                {calorieExceeded && (
                                    <div className="p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-200/40 dark:border-red-900/40 text-red-800 dark:text-red-300 rounded-xl text-xs flex items-start gap-2 leading-relaxed">
                                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                        คุณรับประทานแคลอรี่เกินเป้าหมายการลดน้ำหนักวันนี้แล้ว แนะนำให้ลดมื้อถัดไปและเพิ่มการออกกำลังกายเบา ๆ เพื่อเผาผลาญส่วนเกินออกนะคะ
                                    </div>
                                )}
                            </div>

                            {/* Interactive Data Log Inputs */}
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl p-6 shadow-2xs space-y-6">
                                <h3 className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                                    <Scale className="h-5 w-5 text-emerald-500" />
                                    บันทึกสุขภาพด่วน (Add Logs)
                                </h3>

                                <div className="space-y-2 border-b border-dashed border-zinc-150 dark:border-zinc-800/80 pb-4">
                                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">1. บันทึกค่าน้ำหนักตัวล่าสุด (กิโลกรัม)</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            step="0.1"
                                            placeholder="เช่น 72.5"
                                            value={weightInput}
                                            onChange={(e) => setWeightInput(e.target.value)}
                                            className="flex-grow px-3.5 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-emerald-500/50 text-zinc-800 dark:text-zinc-100"
                                        />
                                        <button
                                            type="button"
                                            disabled={logSaving || !weightInput}
                                            onClick={() => handleLogSubmit('weight')}
                                            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 px-5 py-2 rounded-xl text-xs font-bold transition-colors shrink-0"
                                        >
                                            บันทึกน้ำหนัก
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">2. บันทึกมื้ออาหารที่กินประจำมื้อ</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            placeholder="ชื่อเมนู เช่น ข้าวผัดหมู"
                                            value={foodName}
                                            onChange={(e) => setFoodName(e.target.value)}
                                            className="px-3.5 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-emerald-500/50 text-zinc-800 dark:text-zinc-100"
                                        />
                                        <input
                                            type="number"
                                            placeholder="แคลอรี่ เช่น 550"
                                            value={foodCal}
                                            onChange={(e) => setFoodCal(e.target.value)}
                                            className="px-3.5 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-emerald-500/50 text-zinc-800 dark:text-zinc-100"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        disabled={logSaving || !foodName || !foodCal}
                                        onClick={() => handleLogSubmit('diet')}
                                        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors"
                                    >
                                        บันทึกรายการอาหาร
                                    </button>
                                </div>
                            </div>

                            {/* Health Profile Settings Form */}
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl p-6 shadow-2xs space-y-4">
                                <h3 className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                                    <User className="h-5 w-5 text-emerald-500" />
                                    การคำนวณ BMR & TDEE ตัวเลขร่างกาย
                                </h3>
                                
                                <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs sm:text-sm">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400">ส่วนสูง (เซนติเมตร)</label>
                                            <input
                                                type="number"
                                                value={height}
                                                onChange={(e) => setHeight(parseFloat(e.target.value) || 170)}
                                                className="w-full px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg text-sm text-zinc-800 dark:text-zinc-100"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400">อายุ (ปี)</label>
                                            <input
                                                type="number"
                                                value={age}
                                                onChange={(e) => setAge(parseInt(e.target.value) || 30)}
                                                className="w-full px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg text-sm text-zinc-800 dark:text-zinc-100"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400">เพศสภาพ</label>
                                            <select
                                                value={gender}
                                                onChange={(e) => setGender(e.target.value as any)}
                                                className="w-full px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg text-sm text-zinc-800 dark:text-zinc-100"
                                            >
                                                <option value="female">หญิง</option>
                                                <option value="male">ชาย</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400">การออกกำลังกาย</label>
                                            <select
                                                value={activityLevel}
                                                onChange={(e) => setActivityLevel(parseFloat(e.target.value) || 1.2)}
                                                className="w-full px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg text-sm text-zinc-800 dark:text-zinc-100"
                                            >
                                                <option value={1.2}>ทำงานออฟฟิศ นั่งทำงานส่วนใหญ่</option>
                                                <option value={1.375}>ออกกำลังกายเบา ๆ 1-3 วัน/สัปดาห์</option>
                                                <option value={1.55}>ออกกำลังกายปานกลาง 3-5 วัน/สัปดาห์</option>
                                                <option value={1.725}>ออกกำลังกายหนักหน่วง 6-7 วัน/สัปดาห์</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-zinc-150 dark:border-zinc-855 flex items-center justify-between gap-4 text-xs font-semibold">
                                        <div className="space-y-1">
                                            <span className="text-zinc-400 block text-[10px]">ค่า BMR / TDEE ของคุณ</span>
                                            <span className="text-zinc-850 dark:text-zinc-200">
                                                {loading ? '...' : calculateBMR()} / {loading ? '...' : calculateTDEE()} kcal
                                            </span>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={profileSaving}
                                            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 px-5 py-2 rounded-full text-xs font-bold transition-colors shrink-0"
                                        >
                                            {profileSaving ? 'บันทึก...' : 'บันทึกสัดส่วนร่างกาย'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Content 2: Leaderboard */}
                {activeTab === 'leaderboard' && (
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl p-6 shadow-2xs space-y-6">
                        <div>
                            <h2 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-amber-500" />
                                อันดับการลดน้ำหนักของกลุ่มการทดลองวิจัย (Anonymous Weight Loss Leaderboard)
                            </h2>
                            <p className="text-xs text-zinc-400 mt-1">
                                แสดงอันดับผู้เข้าร่วมการทดลองที่ลดน้ำหนักคิดเป็นเปอร์เซ็นต์สะสมได้สูงสุด 10 อันดับแรก โดยมีการย่อชื่อเพื่อรักษาสิทธิ์ความเป็นส่วนตัวตามข้อกำหนด PDPA
                            </p>
                        </div>

                        <div className="overflow-hidden border border-zinc-150 dark:border-zinc-800 rounded-xl">
                            <table className="w-full text-left text-xs sm:text-sm">
                                <thead className="bg-zinc-50 dark:bg-zinc-800/40 text-zinc-500 dark:text-zinc-400 border-b border-zinc-150 dark:border-zinc-800/80">
                                    <tr>
                                        <th className="px-6 py-3 font-bold text-center w-16">อันดับ</th>
                                        <th className="px-6 py-3 font-bold">ชื่อย่อผู้ร่วมวิจัย</th>
                                        <th className="px-6 py-3 font-bold">น้ำหนักที่ลดได้สะสม</th>
                                        <th className="px-6 py-3 font-bold">สัดส่วนที่ลดลง (%)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-150 dark:divide-zinc-800/50">
                                    {leaderboardLoading ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-zinc-400">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
                                                    กำลังคำนวณและประมวลผลลีดเดอร์บอร์ด...
                                                </div>
                                            </td>
                                        </tr>
                                    ) : leaderboard.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-zinc-400">
                                                ไม่มีข้อมูลการแข่งขัน (ผู้เข้าร่วมต้องมีบันทึกน้ำหนักตัวอย่างน้อย 2 วันขึ้นไป จึงจะแสดงผลในการจัดอันดับ)
                                            </td>
                                        </tr>
                                    ) : (
                                        leaderboard.map((user, index) => (
                                            <tr key={index} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-850/20 transition-colors">
                                                <td className="px-6 py-4 text-center font-black">
                                                    {index === 0 && <span className="inline-flex w-6 h-6 rounded-full bg-amber-400 text-amber-950 items-center justify-center text-xs font-bold shadow-xs">🥇</span>}
                                                    {index === 1 && <span className="inline-flex w-6 h-6 rounded-full bg-zinc-300 text-zinc-950 items-center justify-center text-xs font-bold shadow-xs">🥈</span>}
                                                    {index === 2 && <span className="inline-flex w-6 h-6 rounded-full bg-amber-600 text-amber-50 items-center justify-center text-xs font-bold shadow-xs">🥉</span>}
                                                    {index > 2 && index + 1}
                                                </td>
                                                <td className="px-6 py-4 font-bold text-zinc-800 dark:text-zinc-200">
                                                    {user.name}
                                                </td>
                                                <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                                                    -{user.loss} กก.
                                                </td>
                                                <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 font-black font-mono">
                                                    {user.percentage}%
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Tab Content 3: Media Library */}
                {activeTab === 'media' && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl p-6 shadow-2xs">
                            <h2 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-emerald-500" />
                                คลังสื่อสุขภาพและโภชนาการดิจิทัล (Educational Media Hub)
                            </h2>
                            <p className="text-xs text-zinc-400 mt-1">
                                รวบรวมองค์ความรู้ งานวิจัย และคำแนะนำการจำกัดแคลอรี่ที่อิงตามหลักวิทยาศาสตร์เพื่อความยั่งยืน
                            </p>
                        </div>

                        {/* Article Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {articles.map((art) => (
                                <div 
                                    key={art.id} 
                                    onClick={() => setSelectedArticle(art)}
                                    className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl p-6 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                                >
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
                                                {art.tag}
                                            </span>
                                            <span className="text-zinc-400">{art.readTime}</span>
                                        </div>
                                        <h3 className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-zinc-50">
                                            {art.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                                            {art.description}
                                        </p>
                                    </div>
                                    <div className="pt-4 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-extrabold">
                                        คลิกเปิดอ่านฉบับเต็ม
                                        <ChevronRight className="h-3.5 w-3.5" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tab Content 4: FAQ & Support */}
                {activeTab === 'support' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* FAQ Section */}
                        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl p-6 shadow-2xs space-y-4">
                            <h3 className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                                <HelpCircle className="h-5 w-5 text-emerald-500" />
                                คำถามที่พบบ่อย (FAQs)
                            </h3>
                            <div className="space-y-3 text-xs sm:text-sm leading-relaxed">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="border border-zinc-150 dark:border-zinc-850 rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => setActiveFaqIndex(activeFaqIndex === index ? null : index)}
                                            className="w-full px-5 py-3.5 text-left font-bold bg-zinc-50/50 dark:bg-zinc-800/20 hover:bg-zinc-100/40 dark:hover:bg-zinc-800/40 flex items-center justify-between transition-colors"
                                        >
                                            <span>{faq.question}</span>
                                            {activeFaqIndex === index ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
                                        </button>
                                        {activeFaqIndex === index && (
                                            <div className="px-5 py-4 border-t border-zinc-150 dark:border-zinc-850 text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 animate-in fade-in duration-150">
                                                {faq.answer}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Support ticket submission form */}
                        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl p-6 shadow-2xs space-y-4">
                            <h3 className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-emerald-500" />
                                แจ้งปัญหาและส่งตั๋วบริการ (Help Desk)
                            </h3>
                            
                            <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs sm:text-sm">
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-zinc-500">ชื่อของคุณ</label>
                                    <input
                                        type="text"
                                        value={userName}
                                        readOnly
                                        className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-500 rounded-lg text-sm outline-hidden cursor-not-allowed"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-zinc-500">อีเมลติดต่อกลับ</label>
                                    <input
                                        type="email"
                                        value={userEmail}
                                        readOnly
                                        className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-500 rounded-lg text-sm outline-hidden cursor-not-allowed"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-zinc-500">รายละเอียดคำถามหรือปัญหาที่พบ</label>
                                    <textarea
                                        rows={4}
                                        placeholder="แจ้งสเปกเครื่อง บัญชี LINE เชื่อมต่อไม่ได้ หรือปัญหาอื่น ๆ..."
                                        value={ticketMessage}
                                        onChange={(e) => setTicketMessage(e.target.value)}
                                        className="w-full p-3 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg text-sm text-zinc-800 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500/50"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={ticketSubmitting || !ticketMessage.trim()}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
                                >
                                    {ticketSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            กำลังนำส่งตั๋วเข้าระบบ...
                                        </>
                                    ) : (
                                        'ส่งตั๋วขอความช่วยเหลือ'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            {/* Selected Article Reading Modal */}
            {selectedArticle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 w-full max-w-xl rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="bg-zinc-50 dark:bg-zinc-850 px-6 py-4 border-b border-zinc-150 dark:border-zinc-800 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-zinc-955 dark:text-zinc-50">
                                <BookOpen className="h-5 w-5 text-emerald-500" />
                                บทความโภชนาการและการควบคุมน้ำหนัก
                            </div>
                            <button 
                                onClick={() => setSelectedArticle(null)}
                                className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                            <div className="flex justify-between items-center text-xs">
                                <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
                                    {selectedArticle.tag}
                                </span>
                                <span className="text-zinc-400 font-medium">{selectedArticle.readTime}</span>
                            </div>
                            <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-50 leading-tight">
                                {selectedArticle.title}
                            </h2>
                            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-350 leading-relaxed whitespace-pre-line">
                                {selectedArticle.content}
                            </p>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-zinc-50/50 dark:bg-zinc-850 px-6 py-4 border-t border-zinc-150 dark:border-zinc-800 flex justify-end">
                            <button
                                onClick={() => setSelectedArticle(null)}
                                className="bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 px-6 py-2 rounded-full text-xs sm:text-sm font-bold shadow-xs transition-colors"
                            >
                                ปิดอ่าน
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
