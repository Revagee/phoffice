"use server";

import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import { createSession, destroySession } from "@/server/auth/session";

const credentialsSchema = z.object({ email: z.string().email("Вкажіть коректний email."), password: z.string().min(8, "Пароль має містити щонайменше 8 символів.") });
type AuthResult = { ok: boolean; error?: string; user?: { name: string; email: string; initials: string } };
const publicUser = (user: { firstName: string; lastName: string; email: string }) => ({ name: `${user.firstName} ${user.lastName}`.trim(), email: user.email, initials: `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase() });

export async function loginAction(input: { email: string; password: string }): Promise<AuthResult> {
  const parsed = credentialsSchema.safeParse(input); if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message };
  const user = await prisma.user.findFirst({ where: { email: parsed.data.email.toLowerCase(), deletedAt: null }, include: { role: true } });
  if (!user?.passwordHash || user.status !== "ACTIVE" || !(await verifyPassword(parsed.data.password, user.passwordHash))) return { ok: false, error: "Невірний email або пароль." };
  await createSession(user.id); return { ok: true, user: publicUser(user) };
}

export async function registerAction(input: { name: string; email: string; password: string }): Promise<AuthResult> {
  const parsed = credentialsSchema.extend({ name: z.string().trim().min(2, "Вкажіть ваше ім’я.") }).safeParse(input); if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message };
  const email = parsed.data.email.toLowerCase();
  if (await prisma.user.findFirst({ where: { email } })) return { ok: false, error: "Цей email уже зареєстрований." };
  const [firstName, ...lastNameParts] = parsed.data.name.split(/\s+/); const lastName = lastNameParts.join(" ") || "Користувач";
  const slugBase = `office-${Math.random().toString(36).slice(2, 8)}`;
  const passwordHash = await hashPassword(parsed.data.password);
  const user = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const organization = await tx.organization.create({ data: { name: `${parsed.data.name} — PravoHelper Office`, slug: slugBase, timezone: "Europe/Kyiv", currency: "UAH" } });
    const role = await tx.role.create({ data: { organizationId: organization.id, name: "Власник", slug: "owner", isSystem: true } });
    return tx.user.create({ data: { organizationId: organization.id, roleId: role.id, email, passwordHash, firstName: firstName ?? "Користувач", lastName } });
  });
  await createSession(user.id); return { ok: true, user: publicUser(user) };
}

export async function logoutAction() { await destroySession(); return { ok: true }; }
