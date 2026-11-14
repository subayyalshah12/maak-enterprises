import Link from 'next/link'; import { ResetPasswordForm } from '@/components/reset-password-form';
export default function ResetPassword(){return <main className="login-page"><div className="login-card"><p className="eyebrow">ADMINISTRATOR ACCESS</p><h1>Choose a new password.</h1><ResetPasswordForm/><Link href="/admin/login" className="text-link">← Back to sign in</Link></div></main>}
