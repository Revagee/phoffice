"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";

const Icon = ({ children }: { children: string }) => <span className="icon" aria-hidden>{children}</span>;

const nav: readonly [string, string, string][] = [
  ["⌘", "Огляд", "/"], ["◉", "Клієнти", "/clients"], ["▣", "Справи", "/cases"], ["□", "Завдання", "/tasks"],
  ["◫", "Календар", "/calendar"], ["▤", "Документи", "/documents"], ["₴", "Фінанси", "/finance"],
];

const matters = [
  { code: "№ 761/18234/24", name: "Олег Бондаренко", type: "Цивільна справа", status: "В роботі", tone: "blue" },
  { code: "№ 910/4412/24", name: "ТОВ «СкайЛайн»", type: "Господарський спір", status: "Судовий розгляд", tone: "violet" },
  { code: "№ 757/29018/24", name: "Аліна Марченко", type: "Сімейне право", status: "Очікує документів", tone: "amber" },
];

const tasks = [
  ["Підготувати заперечення на позов", "Сьогодні, 14:00", "high"],
  ["Узгодити договір із ТОВ «Верес»", "Сьогодні, 16:30", "medium"],
  ["Перевірити статус справи № 910/4412/24", "Завтра", "low"],
] as const;

export function Dashboard() {
  const [active, setActive] = useState("Огляд");
  const [searchOpen, setSearchOpen] = useState(false);
  const [done, setDone] = useState<number[]>([]);
  const [notice, setNotice] = useState("");
  const { user, ready, signOut } = useAuth();
  if (!ready) return null;
  if (!user) { window.location.assign("/login"); return null; }

  return <main className="shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">PH</div><span>pravohelper</span><small>OFFICE</small></div>
      <div className="workspace"><div className="avatar navy">ЮФ</div><div><b>Юстус & Партнери</b><small>Юридична фірма</small></div><span>⌄</span></div>
      <nav>{nav.map(([symbol, label, href]) => <Link href={href} key={label} onClick={() => setActive(label)} className={active === label ? "active" : ""}><Icon>{symbol}</Icon>{label}{label === "Завдання" && <em>4</em>}</Link>)}<a href="https://pravohelper.com" className="ai-link"><Icon>✦</Icon>AI-помічник <span>↗</span></a></nav>
      <div className="sidebar-bottom"><Link href="/settings"><Icon>⚙</Icon>Налаштування</Link><div className="profile"><div className="avatar portrait">{user.initials}</div><div><b>{user.name}</b><small>{user.email}</small></div><button className="logout" onClick={signOut} title="Вийти">↪</button></div></div>
    </aside>

    <section className="workspace-main">
      <header><div className="crumb"><span>PravoHelper Office</span><b>/</b><strong>{active}</strong></div><div className="header-actions"><button className="search" onClick={() => setSearchOpen(true)}>⌕ <span>Пошук у PravoHelper</span><kbd>⌘ K</kbd></button><button className="round" onClick={() => setNotice("Режим фокусування увімкнено")}>◌</button><button className="round notification" onClick={() => setNotice("У вас 3 нові сповіщення")}>♧<i /></button><div className="avatar portrait">{user.initials}</div></div></header>
      <div className="content">
        <div className="title-row"><div><p className="eyebrow">ЧЕТВЕР, 31 ЛИПНЯ</p><h1>Доброго ранку, {user.name} <span>✦</span></h1><p className="subtitle">Ось що відбувається у вашій практиці сьогодні.</p></div><button className="primary" onClick={() => window.location.assign("/cases")}>＋ Нова справа</button></div>
        <section className="metrics">
          <Metric icon="₴" label="Надходження цього місяця" value="₴ 284 600" change="+12.5%" />
          <Metric icon="▣" label="Активні справи" value="48" change="+8 за місяць" />
          <Metric icon="◫" label="Найближчі засідання" value="6" change="2 сьогодні" alert />
          <Metric icon="✓" label="Завдання виконано" value="72%" change="18 із 25 цього тижня" />
        </section>
        <section className="dashboard-grid">
          <div className="card revenue"><div className="card-head"><div><h2>Динаміка доходів</h2><p>Надходження за останні 6 місяців</p></div><button className="select">6 місяців⌄</button></div><div className="chart"><div className="axis"><span>300k</span><span>200k</span><span>100k</span><span>0</span></div><div className="bars">{[42, 54, 46, 70, 61, 92].map((v, i) => <div key={v + i} className="bar-wrap"><div className={i === 5 ? "bar current" : "bar"} style={{ height: `${v}%` }}><span>₴ {v === 92 ? "284k" : `${Math.round(v * 3)}k`}</span></div><small>{["Лют", "Бер", "Кві", "Тра", "Чер", "Лип"][i]}</small></div>)}</div></div><div className="chart-note"><span><i className="dot" />Надходження</span><b>+12.5% <small>від попереднього періоду</small></b></div></div>
          <div className="card hearings"><div className="card-head"><div><h2>Найближчі засідання</h2><p>Наступні 7 днів</p></div><button className="text-button" onClick={() => window.location.assign("/calendar")}>Календар →</button></div><div className="hearing"><div className="date"><b>31</b><small>ЛИП</small></div><div><b>Бондаренко проти ТОВ «Будсервіс»</b><p>14:30 · Шевченківський районний суд</p></div><span className="status blue">Сьогодні</span></div><div className="hearing"><div className="date"><b>01</b><small>СЕР</small></div><div><b>ТОВ «СкайЛайн» — податковий спір</b><p>10:00 · Господарський суд м. Києва</p></div><span className="status violet">Завтра</span></div><div className="hearing"><div className="date"><b>04</b><small>СЕР</small></div><div><b>Марченко — визначення місця проживання</b><p>11:15 · Дарницький районний суд</p></div><span className="status muted">Пн, 4 серп.</span></div></div>
          <div className="card matters"><div className="card-head"><div><h2>Активні справи</h2><p>Останні оновлення</p></div><button className="text-button" onClick={() => window.location.assign("/cases")}>Усі справи →</button></div>{matters.map(item => <button className="matter" onClick={() => window.location.assign("/cases")} key={item.code}><div className={`matter-icon ${item.tone}`}>⚖</div><div><b>{item.name}</b><p>{item.code} · {item.type}</p></div><span className={`status ${item.tone}`}>{item.status}</span><span className="more">···</span></button>)}</div>
          <div className="card today"><div className="card-head"><div><h2>Завдання на сьогодні</h2><p>3 з 8 виконано</p></div><button className="text-button" onClick={() => window.location.assign("/tasks")}>Усі завдання →</button></div>{tasks.map(([name, due, priority], i) => <button className="task" onClick={() => setDone(d => d.includes(i) ? d.filter(x => x !== i) : [...d, i])} key={name}><i className={done.includes(i) ? "checked" : ""}>{done.includes(i) ? "✓" : ""}</i><span><b className={done.includes(i) ? "completed" : ""}>{name}</b><small>{due}</small></span><em className={priority}>{priority === "high" ? "Високий" : priority === "medium" ? "Середній" : "Низький"}</em></button>)}<button className="add-task" onClick={() => window.location.assign("/tasks")}>＋ Додати завдання</button></div>
        </section>
      </div>
    </section>
    {searchOpen && <div className="modal-backdrop" onClick={() => setSearchOpen(false)}><div className="command" onClick={e => e.stopPropagation()}><div>⌕ <input autoFocus placeholder="Пошук клієнтів, справ, документів…" /><kbd>ESC</kbd></div><p>ШВИДКІ ДІЇ</p><button onClick={() => window.location.assign("/cases")}>＋ Створити нову справу <kbd>⌘ N</kbd></button><button onClick={() => window.location.assign("/clients")}>◉ Додати клієнта</button><button onClick={() => window.location.assign("https://pravohelper.com")}>✦ Запитати AI-помічника</button></div></div>}{notice && <button className="toast" onClick={() => setNotice("")}>{notice} <span>×</span></button>}
  </main>;
}

function Metric({ icon, label, value, change, alert }: { icon: string; label: string; value: string; change: string; alert?: boolean }) { return <div className="metric"><div className={alert ? "metric-icon alert" : "metric-icon"}>{icon}</div><p>{label}</p><h3>{value}</h3><small className={alert ? "warm" : "positive"}>{alert ? "● " : "↗ "}{change}</small></div>; }
