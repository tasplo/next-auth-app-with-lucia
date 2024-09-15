"use server";

import { Register } from "@/types/register";
import prisma from "../lib/prisma";
import { Login } from "@/types/login";
import { lucia, validateRequest } from "@/lib/auth";
import { cookies } from "next/headers";

export async function registerUser({ ...form }: Register) {
    try {
        if (
            !form.email ||
            !form.firstName ||
            !form.lastName ||
            !form.password
        ) {
            return {
                error: `all values are required`,
            };
        }

        const userExist = await prisma.user.findFirst({
            where: { email: form.email },
        });

        if (userExist) {
            return {
                error: `user with the email: ${form.email} already exist`,
            };
        }

        const createUser = await prisma.user.create({
            data: {
                id: form.email,
                email: form.email,
                firstName: form.firstName,
                lastName: form.lastName,
                password: form.password,
            },
        });

        if (!createUser) {
            return {
                error: `something went wrong`,
            };
        }

        return {
            success: `user created successfully`,
        };
    } catch (error) {
        return {
            error: "unknown registration error",
        };
    }
}

export async function loginUser({ ...form }: Login) {
    try {
        if (!form.email || !form.password) {
            return {
                error: `all values are required`,
            };
        }
        const userExist = await prisma.user.findFirst({
            where: { email: form.email },
        });

        if (!userExist) {
            return {
                error: `user with the email${form.email} does not exist`,
            };
        }

        // check password match
        if (userExist.password !== form.password) {
            return {
                error: `incorrect user password`,
            };
        }
        const session = await lucia.createSession(userExist.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);

        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        );

        return {
            success: true,
        };
    } catch (error) {
        return {
            error: "unknown login error",
        };
    }
}

export async function logoutUser() {
    const { session } = await validateRequest();

    if (!session) {
        return {
            error: "Unauthorized",
        };
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
    );
}
