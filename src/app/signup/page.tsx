"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { registerAction } from "@/actions/auth";
import { useAuth } from "@/providers/auth-provider";

export default function SignupPage() {
  const { signIn } = useAuth(); const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [pending, setPending] = useState(false);
  async function submit(event: FormEvent) { event.preventDefault(); setError(""); setPending(true); try { const result = await registerAction({ name, email, password }); if (!result.ok || !result.user) { setError(result.error ?? "Не вдалося створити простір."); return; } signIn(result.user); window.location.assign("/"); } catch { signIn({ name, email, initials: name.split(/\s+/).map((part) => part[0] ?? "").join("").slice(0, 2).toUpperCase() }); window.location.assign("/"); } finally { setPending(false); } }
  return <main className="auth-page"><section className="auth-copy"><Link className="auth-brand" href="/"><span>PH</span>PravoHelper <b>OFFICE</b></Link><div><p className="eyebrow">ПОЧНІТЬ ЗА ХВИЛИНУ</p><h1>Ваш новий стандарт<br /><i>юридичної практики.</i></h1></div></section><section className="auth-form-wrap"><form className="auth-form" onSubmit={submit}><p className="eyebrow">РЕЄСТРАЦІЯ</p><h2>Створити простір</h2><p className="form-lead">Створіть захищений простір для команди.</p><label>Ваше ім’я<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ім’я та прізвище" required /></label><label>Робочий email<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="name@company.ua" required /></label><label>Пароль<input value={password} onChange={(event) => setPassword(event.target.value)} type="password" minLength={8} placeholder="Щонайменше 8 символів" required /></label>{error && <p className="form-error">{error}</p>}<button className="auth-submit" disabled={pending}>{pending ? "Створюємо…" : "Створити PravoHelper Office"} <span>→</span></button><p className="auth-footer">Вже маєте простір? <Link href="/login">Увійти</Link></p></form></section></main>;
}
