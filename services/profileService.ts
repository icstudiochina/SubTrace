import { supabase } from '../lib/supabaseClient';

export interface Profile {
    id: string;
    nickname: string | null;
    email: string | null;
    avatar_url: string | null;
    email_notify: boolean;
    reminder_days: number;
    created_at: string;
    updated_at: string;
}

export interface ProfileUpdate {
    nickname?: string;
    email?: string;
    email_notify?: boolean;
    reminder_days?: number;
}

/**
 * Get current user's profile
 */
export async function getProfile(): Promise<{ profile: Profile | null; error: string | null }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { profile: null, error: '用戶未登錄' };
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            return { profile: null, error: error.message };
        }

        return { profile: data as Profile, error: null };
    } catch (err) {
        return { profile: null, error: '獲取用戶資料失敗' };
    }
}

/**
 * Update user profile
 */
export async function updateProfile(updates: ProfileUpdate): Promise<{ profile: Profile | null; error: string | null }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { profile: null, error: '用戶未登錄' };
        }

        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single();

        if (error) {
            return { profile: null, error: error.message };
        }

        return { profile: data as Profile, error: null };
    } catch (err) {
        return { profile: null, error: '更新用戶資料失敗' };
    }
}

/**
 * Update notification settings
 */
export async function updateSettings(emailNotify: boolean, reminderDays: number): Promise<{ error: string | null }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { error: '用戶未登錄' };
        }

        const { error } = await supabase
            .from('profiles')
            .update({
                email_notify: emailNotify,
                reminder_days: reminderDays,
            })
            .eq('id', user.id);

        if (error) {
            return { error: error.message };
        }

        return { error: null };
    } catch (err) {
        return { error: '更新設置失敗' };
    }
}

/**
 * Upload avatar image
 */
export async function uploadAvatar(file: File): Promise<{ url: string | null; error: string | null }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { url: null, error: '用戶未登錄' };
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/avatar.${fileExt}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, file, { upsert: true });

        if (uploadError) {
            return { url: null, error: uploadError.message };
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

        // Update profile with avatar URL
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ avatar_url: publicUrl })
            .eq('id', user.id);

        if (updateError) {
            return { url: null, error: updateError.message };
        }

        return { url: publicUrl, error: null };
    } catch (err) {
        return { url: null, error: '上傳頭像失敗' };
    }
}

/**
 * Delete avatar
 */
export async function deleteAvatar(): Promise<{ error: string | null }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { error: '用戶未登錄' };
        }

        // List files in user's folder
        const { data: files, error: listError } = await supabase.storage
            .from('avatars')
            .list(user.id);

        if (listError) {
            return { error: listError.message };
        }

        if (files && files.length > 0) {
            const filesToRemove = files.map(f => `${user.id}/${f.name}`);
            const { error: removeError } = await supabase.storage
                .from('avatars')
                .remove(filesToRemove);

            if (removeError) {
                return { error: removeError.message };
            }
        }

        // Clear avatar URL in profile
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ avatar_url: null })
            .eq('id', user.id);

        if (updateError) {
            return { error: updateError.message };
        }

        return { error: null };
    } catch (err) {
        return { error: '刪除頭像失敗' };
    }
}
