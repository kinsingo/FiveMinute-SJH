"use server";
import { signIn, signOut } from "../next-auth";

export async function signInServerAction() {
    await signIn();
}

export async function signOutServerAction() {
    await signOut();
}