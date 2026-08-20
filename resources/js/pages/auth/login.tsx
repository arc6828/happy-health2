import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="เข้าสู่ระบบบัญชีของคุณ" description="กรอกอีเมลและรหัสผ่านเพื่อเข้าสู่ระบบ">
            <Head title="เข้าสู่ระบบ" />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-zinc-700 dark:text-zinc-300 font-semibold">ที่อยู่อีเมล</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
                            className="focus-visible:ring-emerald-500 focus-visible:border-emerald-500 rounded-xl bg-white/50 dark:bg-zinc-950/50"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password" className="text-zinc-700 dark:text-zinc-300 font-semibold">รหัสผ่าน</Label>
                            {canResetPassword && (
                                <TextLink href={route('password.request')} className="ml-auto text-sm text-emerald-600 dark:text-emerald-400 font-semibold hover:underline" tabIndex={5}>
                                    ลืมรหัสผ่าน?
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="รหัสผ่านของคุณ"
                            className="focus-visible:ring-emerald-500 focus-visible:border-emerald-500 rounded-xl bg-white/50 dark:bg-zinc-950/50"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onClick={() => setData('remember', !data.remember)}
                            tabIndex={3}
                            className="border-zinc-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                        />
                        <Label htmlFor="remember" className="text-zinc-600 dark:text-zinc-400 font-medium">จดจำฉันในระบบ</Label>
                    </div>

                    <Button type="submit" className="mt-4 w-full bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white rounded-full py-2.5 font-bold shadow-md transition-all duration-150 active:scale-98 cursor-pointer" tabIndex={4} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                        เข้าสู่ระบบ
                    </Button>
                </div>

                <div className="text-zinc-500 dark:text-zinc-400 text-center text-sm">
                    ยังไม่มีบัญชีผู้ใช้?{' '}
                    <TextLink href={route('register')} className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline" tabIndex={5}>
                        สมัครสมาชิกใหม่ที่นี่
                    </TextLink>
                </div>
            </form>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
