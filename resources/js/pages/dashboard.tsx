import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { 
    MessageSquare, 
    Users, 
    Settings, 
    Search, 
    ChevronLeft, 
    ChevronRight, 
    Loader2, 
    Sparkles, 
    Calendar,
    Clock,
    X,
    CheckCircle2
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface ChatLog {
    id: number;
    line_user_id: string;
    prompt: string;
    reply: string;
    created_at: string;
}

export default function Dashboard() {
    // Tab switching state
    const [activeTab, setActiveTab] = useState<'logs' | 'settings'>('logs');

    // Chat logs table & filter states
    const [logs, setLogs] = useState<ChatLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [totalLogs, setTotalLogs] = useState(0);
    const [uniqueUsers, setUniqueUsers] = useState(0);
    
    // Log detail modal state
    const [selectedLog, setSelectedLog] = useState<ChatLog | null>(null);

    // AI Settings state
    const [systemPrompt, setSystemPrompt] = useState('');
    const [suffixPrompt, setSuffixPrompt] = useState('');
    const [modelName, setModelName] = useState('gemini-2.0-flash');
    const [settingsLoading, setSettingsLoading] = useState(true);
    const [settingsSaving, setSettingsSaving] = useState(false);
    const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Fetch chat logs
    const fetchChatLogs = async (pageNum = 1, searchQuery = '') => {
        setLoading(true);
        try {
            const response = await fetch(`/api/chatlogs?page=${pageNum}&search=${encodeURIComponent(searchQuery)}`);
            if (response.ok) {
                const result = await response.json();
                setLogs(result.logs.data || []);
                setCurrentPage(result.logs.current_page || 1);
                setLastPage(result.logs.last_page || 1);
                setTotalLogs(result.logs.total || 0);
                setUniqueUsers(result.unique_users || 0);
            }
        } catch (error) {
            console.error('Error fetching chat logs:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch AI settings
    const fetchSettings = async () => {
        setSettingsLoading(true);
        try {
            const response = await fetch('/api/settings');
            if (response.ok) {
                const result = await response.json();
                setSystemPrompt(result.system_prompt || '');
                setSuffixPrompt(result.suffix_prompt || '');
                setModelName(result.model_name || 'gemini-2.0-flash');
            }
        } catch (error) {
            console.error('Error fetching AI settings:', error);
        } finally {
            setSettingsLoading(false);
        }
    };

    // Fetch logs on mount/dependency change
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchChatLogs(currentPage, search);
        }, 300); // Debounce search queries

        return () => clearTimeout(timer);
    }, [currentPage, search]);

    // Fetch settings on mount
    useEffect(() => {
        fetchSettings();
    }, []);

    // Save AI settings
    const saveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setSettingsSaving(true);
        setToastMessage(null);
        try {
            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    system_prompt: systemPrompt,
                    suffix_prompt: suffixPrompt,
                    model_name: modelName,
                }),
            });
            if (response.ok) {
                setToastMessage({ type: 'success', text: 'บันทึกการตั้งค่าคำสั่ง AI สำเร็จแล้ว!' });
                // Automatically hide toast
                setTimeout(() => setToastMessage(null), 4000);
            } else {
                setToastMessage({ type: 'error', text: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            setToastMessage({ type: 'error', text: 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์' });
        } finally {
            setSettingsSaving(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="แผงควบคุมระบบ Happy Health" />

            <div className="flex h-full flex-col gap-6 p-6 bg-zinc-50/50 dark:bg-zinc-950/20 rounded-xl">
                {/* Header Title */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                            ระบบจัดการหลังบ้าน Happy Health
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm">
                            วิเคราะห์สถิติจำนวนแชตสุขภาพของ LINE Chatbot และจัดการระบบ Prompt เจเนอเรทีฟเอไอ
                        </p>
                    </div>
                </div>

                {/* Toast Notification */}
                {toastMessage && (
                    <div className={`p-4 rounded-xl border flex items-center justify-between shadow-xs transition-all duration-200 animate-in fade-in-50 slide-in-from-top-2 ${
                        toastMessage.type === 'success' 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-800/80 dark:text-emerald-300' 
                            : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/30 dark:border-red-800/80 dark:text-red-300'
                    }`}>
                        <div className="flex items-center gap-2 text-sm font-semibold">
                            {toastMessage.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <X className="h-5 w-5" />}
                            {toastMessage.text}
                        </div>
                        <button onClick={() => setToastMessage(null)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {/* Statistics Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Stat Card 1 */}
                    <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/80 flex items-center gap-4 shadow-2xs">
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                            <MessageSquare className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="text-xs font-medium text-zinc-400 dark:text-zinc-500">ปริมาณแชตคำถามคำตอบทั้งหมด</div>
                            <div className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{loading ? '...' : totalLogs} แถว</div>
                        </div>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/80 flex items-center gap-4 shadow-2xs">
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="text-xs font-medium text-zinc-400 dark:text-zinc-500">จำนวนกลุ่มตัวอย่างผู้ใช้จริง</div>
                            <div className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{loading ? '...' : uniqueUsers} LINE IDs</div>
                        </div>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/80 flex items-center gap-4 shadow-2xs">
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                            <Sparkles className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="text-xs font-medium text-zinc-400 dark:text-zinc-500">โมเดลประมวลผลปัจจุบัน</div>
                            <div className="text-base font-extrabold text-zinc-900 dark:text-zinc-50 truncate max-w-[180px]">
                                {settingsLoading ? '...' : modelName}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Switch Section */}
                <div className="flex border-b border-zinc-250 dark:border-zinc-800/80">
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-[2px] transition-all duration-150 flex items-center gap-2 ${
                            activeTab === 'logs' 
                                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-extrabold' 
                                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                        }`}
                    >
                        <Calendar className="h-4 w-4" />
                        ประวัติสนทนาสุขภาพ (Chat Logs)
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-[2px] transition-all duration-150 flex items-center gap-2 ${
                            activeTab === 'settings' 
                                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-extrabold' 
                                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                        }`}
                    >
                        <Settings className="h-4 w-4" />
                        ตั้งค่าคำสั่งเอไอ (AI Prompt Settings)
                    </button>
                </div>

                {/* Tab Content 1: Chat Logs View */}
                {activeTab === 'logs' && (
                    <div className="flex flex-col gap-4">
                        {/* Search & Toolbar */}
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="ค้นหาตาม LINE User ID หรือข้อความคำถาม..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1); // Reset page to 1 on search change
                                }}
                                className="w-full pl-10 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-emerald-500/50"
                            />
                        </div>

                        {/* Logs Table Container */}
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xs">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs sm:text-sm">
                                    <thead className="bg-zinc-50 dark:bg-zinc-800/40 text-zinc-500 dark:text-zinc-400 border-b border-zinc-150 dark:border-zinc-800/80">
                                        <tr>
                                            <th className="px-6 py-3.5 font-bold">LINE User ID</th>
                                            <th className="px-6 py-3.5 font-bold">คำถามของผู้ใช้ (Prompt)</th>
                                            <th className="px-6 py-3.5 font-bold">คำตอบของ AI (Reply)</th>
                                            <th className="px-6 py-3.5 font-bold">วันเวลา</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-150 dark:divide-zinc-800/50">
                                        {loading ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-12 text-center text-zinc-400">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
                                                        กำลังดึงข้อมูลประวัติแชต...
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : logs.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-12 text-center text-zinc-400">
                                                    ไม่พบประวัติการสนทนาโต้ตอบสุขภาพในระบบ
                                                </td>
                                            </tr>
                                        ) : (
                                            logs.map((log) => (
                                                <tr 
                                                    key={log.id} 
                                                    onClick={() => setSelectedLog(log)}
                                                    className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/20 cursor-pointer transition-colors"
                                                >
                                                    <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[120px]">
                                                        {log.line_user_id}
                                                    </td>
                                                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400 truncate max-w-[220px]">
                                                        {log.prompt}
                                                    </td>
                                                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400 truncate max-w-[300px]">
                                                        {log.reply}
                                                    </td>
                                                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-500 whitespace-nowrap">
                                                        {new Date(log.created_at).toLocaleString('th-TH')}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Controls */}
                            {!loading && lastPage > 1 && (
                                <div className="bg-zinc-50/50 dark:bg-zinc-800/20 px-6 py-3.5 border-t border-zinc-150 dark:border-zinc-800/80 flex items-center justify-between">
                                    <span className="text-xs text-zinc-500">
                                        หน้า {currentPage} จาก {lastPage} หน้า (แสดงผลลัพธ์ทั้งหมด {totalLogs} รายการ)
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            className="inline-flex items-center gap-1 border border-zinc-300 dark:border-zinc-700 bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800/60 px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50 disabled:pointer-events-none transition-colors"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            ก่อนหน้า
                                        </button>
                                        <button
                                            disabled={currentPage === lastPage}
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, lastPage))}
                                            className="inline-flex items-center gap-1 border border-zinc-300 dark:border-zinc-700 bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800/60 px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50 disabled:pointer-events-none transition-colors"
                                        >
                                            ถัดไป
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Tab Content 2: AI Settings Panel */}
                {activeTab === 'settings' && (
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl p-6 shadow-2xs">
                        {settingsLoading ? (
                            <div className="py-12 flex flex-col items-center justify-center gap-2 text-zinc-400">
                                <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                                กำลังดึงการตั้งค่าคำสั่ง AI...
                            </div>
                        ) : (
                            <form onSubmit={saveSettings} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-zinc-900 dark:text-zinc-50">
                                        โมเดลประมวลผลเอไอ (Gemini Model Selection)
                                    </label>
                                    <select
                                        value={modelName}
                                        onChange={(e) => setModelName(e.target.value)}
                                        className="w-full max-w-xs px-3.5 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-emerald-500/50"
                                    >
                                        <option value="gemini-2.0-flash">Gemini 2.0 Flash (แนะนำ - ประมวลผลเร็ว)</option>
                                        <option value="gemini-2.0-pro">Gemini 2.0 Pro (ประมวลผลลึกซึ้ง)</option>
                                    </select>
                                    <p className="text-xs text-zinc-400">เลือกรุ่นแบบจำลองของ Google Gemini API ที่เหมาะกับโครงการ</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-zinc-900 dark:text-zinc-50">
                                        คำสั่งบทบาทเอไอ (System Instruction Prompt)
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={systemPrompt}
                                        onChange={(e) => setSystemPrompt(e.target.value)}
                                        placeholder="คุณคือผู้ช่วยแนะนำด้านโภชนาการและการออกกำลังกาย..."
                                        className="w-full p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-emerald-500/50"
                                    />
                                    <p className="text-xs text-zinc-400">กำหนดพฤติกรรม ขอบเขตองค์ความรู้ด้านโภชนาการ และการจำกัด calories ของแชตบอต</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-zinc-900 dark:text-zinc-50">
                                        ข้อจำกัดความยาวของคำตอบ (Suffix Constraints Prompt)
                                    </label>
                                    <input
                                        type="text"
                                        value={suffixPrompt}
                                        onChange={(e) => setSuffixPrompt(e.target.value)}
                                        placeholder="ไม่เกิน 1 ย่อหน้า"
                                        className="w-full p-3 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-emerald-500/50"
                                    />
                                    <p className="text-xs text-zinc-400">ประโยคบังคับท้ายข้อความคำถามเพื่อใช้ลดความยาวคำตอบ (ช่วยประหยัดจำนวน Tokens)</p>
                                </div>

                                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                    <button
                                        type="submit"
                                        disabled={settingsSaving}
                                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 px-6 py-2.5 rounded-full text-sm font-bold shadow-md transition-all duration-150 disabled:opacity-70 disabled:pointer-events-none"
                                    >
                                        {settingsSaving ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                กำลังบันทึก...
                                            </>
                                        ) : (
                                            'บันทึกการตั้งค่าคำสั่ง AI'
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </div>

            {/* Log Detail Modal Dialog */}
            {selectedLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="bg-zinc-50 dark:bg-zinc-850 px-6 py-4 border-b border-zinc-150 dark:border-zinc-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-emerald-500" />
                                <span className="font-bold text-zinc-900 dark:text-zinc-50">ประวัติแชตฉบับเต็ม</span>
                            </div>
                            <button 
                                onClick={() => setSelectedLog(null)}
                                className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto text-sm sm:text-base leading-relaxed">
                            {/* Metadata */}
                            <div className="grid grid-cols-2 gap-4 text-xs text-zinc-500 border-b border-dashed border-zinc-100 dark:border-zinc-800/80 pb-4">
                                <div>
                                    <span className="font-bold block text-zinc-400">LINE User ID</span>
                                    <span className="font-mono break-all text-zinc-700 dark:text-zinc-300">{selectedLog.line_user_id}</span>
                                </div>
                                <div>
                                    <span className="font-bold block text-zinc-400">วันเวลาทำกิจกรรม</span>
                                    <span className="text-zinc-700 dark:text-zinc-300">{new Date(selectedLog.created_at).toLocaleString('th-TH')}</span>
                                </div>
                            </div>

                            {/* Prompt block */}
                            <div className="space-y-2">
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block tracking-wider uppercase">คำถามของผู้ใช้ (Prompt)</span>
                                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200">
                                    {selectedLog.prompt}
                                </div>
                            </div>

                            {/* Reply block */}
                            <div className="space-y-2">
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block tracking-wider uppercase">คำตอบของ AI (Reply)</span>
                                <div className="bg-emerald-50/20 dark:bg-emerald-950/10 p-4 rounded-xl border border-emerald-100/30 dark:border-emerald-900/30 text-zinc-800 dark:text-zinc-100">
                                    {selectedLog.reply}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-zinc-50/50 dark:bg-zinc-850 px-6 py-4 border-t border-zinc-150 dark:border-zinc-800 flex justify-end">
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 px-5 py-2 rounded-full text-xs sm:text-sm font-bold shadow-xs transition-colors"
                            >
                                ปิดหน้าต่าง
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
