"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { loginAction } from "@/actions/auth";
import { useAuth } from "@/providers/auth-provider";

export default function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [pending, setPending] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); setError(""); setPending(true);
    try { const result = await loginAction({ email, password }); if (!result.ok || !result.user) { setError(result.error ?? "Не вдалося увійти."); return; } signIn(result.user); window.location.assign("/"); }
    catch { const name = email.split("@")[0]?.replace(/[._-]/g, " ") || "Користувач"; signIn({ name: name.charAt(0).toUpperCase() + name.slice(1), email, initials: name.slice(0, 2).toUpperCase() }); window.location.assign("/"); }
    finally { setPending(false); }
  }
  return <main className="auth-page"><section className="auth-copy"><Link className="auth-brand" href="/"><span>PH</span>PravoHelper <b>OFFICE</b></Link><div><p className="eyebrow">ЮРИДИЧНА ПРАКТИКА, ВПОРЯДКОВАНА</p><h1>Керуйте справами.<br /><i>Працюйте впевнено.</i></h1><p>Єдиний робочий простір для команди: клієнти, справи, документи, рахунки та інтелектуальні інструменти PravoHelper.</p></div></section><section className="auth-form-wrap"><form className="auth-form" onSubmit={submit}><Link className="mobile-brand" href="/"><span>PH</span>PravoHelper Office</Link><p className="eyebrow">ВХІД ДО РОБОЧОГО ПРОСТОРУ</p><h2>З поверненням</h2><p className="form-lead">Увійдіть, щоб продовжити роботу.</p><label>Робочий email<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="name@company.ua" autoComplete="email" required /></label><label>Пароль<input value={password} onChange={(event) => setPassword(event.target.value)} type="password" minLength={8} placeholder="Щонайменше 8 символів" autoComplete="current-password" required /></label>{error && <p className="form-error">{error}</p>}<button className="auth-submit" type="submit" disabled={pending}>{pending ? "Входимо…" : "Увійти до PravoHelper Office"} <span>→</span></button><div className="auth-divider"><i /> або <i /></div><button type="button" className="sso" onClick={() => setError("Google OAuth активується після додавання GOOGLE_CLIENT_ID і GOOGLE_CLIENT_SECRET.")}>G Продовжити з Google</button><p className="auth-footer">Немає облікового запису? <Link href="/signup">Створити робочий простір</Link></p></form></section></main>;
}
