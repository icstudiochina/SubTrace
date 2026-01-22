import { supabase } from '../lib/supabaseClient';
import type { AuthResponse, User, Session } from '@supabase/supabase-js';

export interface AuthResult {
    user: User | null;
    session: Session | null;
    error: string | null;
}

/**
 * Sign up a new user with email and password
 */
export async function signUp(email: string, password: string): Promise<AuthResult> {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            return { user: null, session: null, error: error.message };
        }

        return { user: data.user, session: data.session, error: null };
    } catch (err) {
        return { user: null, session: null, error: '註冊失敗，請稍後再試' };
    }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<AuthResult> {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return { user: null, session: null, error: error.message };
        }

        return { user: data.user, session: data.session, error: null };
    } catch (err) {
        return { user: null, session: null, error: '登錄失敗，請稍後再試' };
    }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ error: string | null }> {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            return { error: error.message };
        }
        return { error: null };
    } catch (err) {
        return { error: '登出失敗，請稍後再試' };
    }
}

/**
 * Get the current session
 */
export async function getSession(): Promise<{ session: Session | null; error: string | null }> {
    try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
            return { session: null, error: error.message };
        }
        return { session: data.session, error: null };
    } catch (err) {
        return { session: null, error: '獲取會話失敗' };
    }
}

/**
 * Get the current user
 */
export async function getCurrentUser(): Promise<{ user: User | null; error: string | null }> {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
            return { user: null, error: error.message };
        }
        return { user, error: null };
    } catch (err) {
        return { user: null, error: '獲取用戶信息失敗' };
    }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<{ error: string | null }> {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) {
            return { error: error.message };
        }
        return { error: null };
    } catch (err) {
        return { error: '發送重置郵件失敗，請稍後再試' };
    }
}

/**
 * Update user password (when logged in)
 */
export async function updatePassword(newPassword: string): Promise<{ error: string | null }> {
    try {
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });
        if (error) {
            return { error: error.message };
        }
        return { error: null };
    } catch (err) {
        return { error: '更新密碼失敗，請稍後再試' };
    }
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
        callback(event, session);
    });
}
