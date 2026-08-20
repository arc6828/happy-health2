import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X, Heart, LogIn, LayoutDashboard } from 'lucide-react';

export default function MyLayout({ children }: { children: React.ReactNode }) {
    const { auth } = usePage().props as any;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col font-sans transition-colors duration-250">
            {/* Navigation Header */}
            <nav className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80 transition-all duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo / Title */}
                        <div className="flex items-center gap-2">
                            <Heart className="h-6 w-6 text-red-500 fill-red-500 animate-pulse" />
                            <span className="font-bold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-50 dark:to-zinc-400 bg-clip-text text-transparent">
                                Happy Health Happy Heart
                            </span>
                        </div>

                        {/* Desktop Navigation Links */}
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                                ฟีเจอร์หลัก
                            </a>
                            <a href="#stats" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                                ผลงานวิจัย
                            </a>
                            <a href="#download" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                                วิธีใช้งาน LINE OA
                            </a>
                        </div>

                        {/* CTA / Auth Actions */}
                        <div className="hidden md:flex items-center gap-4">
                            {auth?.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center gap-2 bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 px-4 py-2 rounded-full text-sm font-semibold shadow-sm transition-all duration-150"
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                    ไปที่ Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="inline-flex items-center gap-2 border border-zinc-300 dark:border-zinc-700 bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 px-4 py-2 rounded-full text-sm font-semibold shadow-xs transition-all duration-150"
                                >
                                    <LogIn className="h-4 w-4" />
                                    สำหรับผู้ดูแลระบบ
                                </Link>
                            )}
                        </div>

                        {/* Mobile Toggler */}
                        <div className="flex md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-900 focus:outline-none transition-colors"
                            >
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 pt-2 pb-4 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
                        <a
                            href="#features"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                        >
                            ฟีเจอร์หลัก
                        </a>
                        <a
                            href="#stats"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                        >
                            ผลงานวิจัย
                        </a>
                        <a
                            href="#download"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                        >
                            วิธีใช้งาน LINE OA
                        </a>
                        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                            {auth?.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 py-3 rounded-full text-base font-semibold transition-all duration-150"
                                >
                                    <LayoutDashboard className="h-5 w-5" />
                                    ไปที่ Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="w-full flex items-center justify-center gap-2 border border-zinc-300 dark:border-zinc-700 bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 py-3 rounded-full text-base font-semibold transition-all duration-150"
                                >
                                    <LogIn className="h-5 w-5" />
                                    สำหรับผู้ดูแลระบบ
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Page Contents */}
            <main className="flex-grow">{children}</main>

            {/* Modern Footer */}
            <footer className="bg-zinc-900 text-zinc-400 py-12 border-t border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <p className="font-bold text-zinc-200 flex items-center justify-center md:justify-start gap-2">
                                <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                                โครงการ Happy Health Happy Heart
                            </p>
                            <p className="text-xs text-zinc-500 mt-2 max-w-md">
                                โครงการวิจัยและพัฒนาเพื่อส่งเสริมการดูแลสุขภาพของบุคลากรในมหาวิทยาลัยและชุมชนลุ่มน้ำพรมโหด อำเภออรัญประเทศ จังหวัดสระแก้ว
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                            <a href="#features" className="hover:text-white transition-colors">ฟีเจอร์หลัก</a>
                            <a href="#stats" className="hover:text-white transition-colors">ผลการวิจัย</a>
                            <a href="#download" className="hover:text-white transition-colors">LINE OA</a>
                            <Link href={route('login')} className="hover:text-white transition-colors">Admin Login</Link>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-zinc-800 text-center text-xs text-zinc-600 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p>© {new Date().getFullYear()} Happy Health Happy Heart. สงวนลิขสิทธิ์ทั้งหมดตามกฎหมาย</p>
                        <p>คณะวิทยาศาสตร์และเทคโนโลยี x คณะสาธารณสุขศาสตร์ มหาวิทยาลัยราชภัฏวไลยอลงกรณ์ ในพระบรมราชูปถัมภ์</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
