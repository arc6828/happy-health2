import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="สมัครสมาชิกใหม่" description="กรอกข้อมูลของคุณด้านล่างเพื่อสร้างบัญชีผู้ใช้งาน">
            <Head title="สมัครสมาชิก" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-zinc-700 dark:text-zinc-300 font-semibold">ชื่อ-นามสกุล</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="กรอกชื่อจริงและนามสกุล"
                            className="focus-visible:ring-emerald-500 focus-visible:border-emerald-500 rounded-xl bg-white/50 dark:bg-zinc-950/50"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-zinc-700 dark:text-zinc-300 font-semibold">ที่อยู่อีเมล</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                            className="focus-visible:ring-emerald-500 focus-visible:border-emerald-500 rounded-xl bg-white/50 dark:bg-zinc-950/50"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-zinc-700 dark:text-zinc-300 font-semibold">รหัสผ่าน</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="กำหนดรหัสผ่านใหม่"
                            className="focus-visible:ring-emerald-500 focus-visible:border-emerald-500 rounded-xl bg-white/50 dark:bg-zinc-950/50"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation" className="text-zinc-700 dark:text-zinc-300 font-semibold">ยืนยันรหัสผ่าน</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="ป้อนรหัสผ่านอีกครั้ง"
                            className="focus-visible:ring-emerald-500 focus-visible:border-emerald-500 rounded-xl bg-white/50 dark:bg-zinc-950/50"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="mt-2 w-full bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white rounded-full py-2.5 font-bold shadow-md transition-all duration-150 active:scale-98 cursor-pointer" tabIndex={5} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                        สร้างบัญชีผู้ใช้
                    </Button>
                </div>

                <div className="text-zinc-500 dark:text-zinc-400 text-center text-sm">
                    มีบัญชีผู้ใช้อยู่แล้ว?{' '}
                    <TextLink href={route('login')} className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline" tabIndex={6}>
                        เข้าสู่ระบบที่นี่
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
