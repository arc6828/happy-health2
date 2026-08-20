import { Link } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative overflow-hidden bg-radial from-zinc-100 via-zinc-50 to-zinc-50 dark:from-zinc-900/50 dark:via-zinc-950 dark:to-zinc-950 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            {/* Background Blur Bubbles */}
            <div className="absolute top-0 right-0 -z-10 h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/5 pointer-events-none" />
            <div className="absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] rounded-full bg-red-500/5 blur-3xl pointer-events-none" />

            <div className="w-full max-w-md bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xl rounded-3xl p-8 md:p-10">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-4">
                        <Link href={route('home')} className="flex items-center gap-2 font-black text-xl text-zinc-900 dark:text-zinc-50">
                            <Heart className="h-6 w-6 text-red-500 fill-red-500" />
                            <span>Happy Health</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{title}</h1>
                            <p className="text-zinc-500 dark:text-zinc-400 text-center text-sm">{description}</p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
