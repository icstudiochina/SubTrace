import { supabase } from '../lib/supabaseClient';
import type { Service, ServiceStatus } from '../types';

export interface ServiceRecord {
    id: string;
    user_id: string;
    name: string;
    category: string;
    price: string;
    currency: string;
    billing_cycle: 'monthly' | 'yearly';
    start_date: string;
    expiry_date: string;
    status: ServiceStatus;
    icon: string;
    days_remaining: number;
    notes: string | null;
    renewal_link: string | null;
    created_at: string;
    updated_at: string;
}

/**
 * Convert database record to frontend Service type
 */
function toService(record: ServiceRecord): Service {
    return {
        id: record.id,
        name: record.name,
        category: record.category,
        price: `${record.currency}${record.price.replace(/[^0-9.]/g, '')}`,
        currency: record.currency,
        billingCycle: record.billing_cycle,
        startDate: record.start_date,
        expiryDate: record.expiry_date,
        status: record.status,
        icon: record.icon,
        daysRemaining: record.days_remaining,
        notes: record.notes || undefined,
        renewalLink: record.renewal_link || undefined,
    };
}

/**
 * Convert frontend Service to database record format
 */
function toRecord(service: Partial<Service>, userId: string): Partial<ServiceRecord> {
    const priceNumeric = service.price?.replace(/[^0-9.]/g, '') || '0';

    return {
        user_id: userId,
        name: service.name,
        category: service.category,
        price: priceNumeric,
        currency: service.currency || '$',
        billing_cycle: service.billingCycle,
        start_date: service.startDate,
        expiry_date: service.expiryDate,
        icon: service.icon || 'cloud',
        notes: service.notes || null,
        renewal_link: service.renewalLink || null,
    };
}

/**
 * Get all services for the current user
 */
export async function getServices(): Promise<{ services: Service[]; error: string | null }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { services: [], error: '用戶未登錄' };
        }

        const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('user_id', user.id)
            .order('expiry_date', { ascending: true });

        if (error) {
            return { services: [], error: error.message };
        }

        const services = (data as ServiceRecord[]).map(toService);
        return { services, error: null };
    } catch (err) {
        return { services: [], error: '獲取服務列表失敗' };
    }
}

/**
 * Add a new service
 */
export async function addService(service: Omit<Service, 'id' | 'status' | 'daysRemaining'>): Promise<{ service: Service | null; error: string | null }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { service: null, error: '用戶未登錄' };
        }

        const record = toRecord(service as Partial<Service>, user.id);

        const { data, error } = await supabase
            .from('services')
            .insert(record)
            .select()
            .single();

        if (error) {
            return { service: null, error: error.message };
        }

        return { service: toService(data as ServiceRecord), error: null };
    } catch (err) {
        return { service: null, error: '新增服務失敗' };
    }
}

/**
 * Update an existing service
 */
export async function updateService(id: string, updates: Partial<Service>): Promise<{ service: Service | null; error: string | null }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { service: null, error: '用戶未登錄' };
        }

        const record = toRecord(updates, user.id);
        delete (record as any).user_id; // Don't update user_id

        const { data, error } = await supabase
            .from('services')
            .update(record)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) {
            return { service: null, error: error.message };
        }

        return { service: toService(data as ServiceRecord), error: null };
    } catch (err) {
        return { service: null, error: '更新服務失敗' };
    }
}

/**
 * Delete a service
 */
export async function deleteService(id: string): Promise<{ error: string | null }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { error: '用戶未登錄' };
        }

        const { error } = await supabase
            .from('services')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            return { error: error.message };
        }

        return { error: null };
    } catch (err) {
        return { error: '刪除服務失敗' };
    }
}

/**
 * Get services that are expiring soon or expired
 */
export async function getUrgentServices(): Promise<{ services: Service[]; error: string | null }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { services: [], error: '用戶未登錄' };
        }

        const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('user_id', user.id)
            .in('status', ['expiring', 'expired'])
            .order('days_remaining', { ascending: true });

        if (error) {
            return { services: [], error: error.message };
        }

        const services = (data as ServiceRecord[]).map(toService);
        return { services, error: null };
    } catch (err) {
        return { services: [], error: '獲取緊急服務失敗' };
    }
}
