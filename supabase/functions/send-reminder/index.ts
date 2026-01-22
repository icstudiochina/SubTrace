// Supabase Edge Function: Send Renewal Reminder Emails
// Deploy with: supabase functions deploy send-reminder

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

interface Service {
    id: string;
    name: string;
    category: string;
    price: string;
    expiry_date: string;
    days_remaining: number;
    status: string;
}

interface Profile {
    id: string;
    email: string;
    nickname: string;
    email_notify: boolean;
    reminder_days: number;
}

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sendEmail(to: string, subject: string, html: string) {
    if (!RESEND_API_KEY) {
        console.log("RESEND_API_KEY not configured, skipping email send");
        return { success: false, error: "Email not configured" };
    }

    try {
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: "SubTrack <noreply@yourdomain.com>",
                to: [to],
                subject,
                html,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error("Failed to send email:", error);
            return { success: false, error };
        }

        return { success: true };
    } catch (error) {
        console.error("Email send error:", error);
        return { success: false, error: error.message };
    }
}

function generateReminderEmail(profile: Profile, services: Service[]): string {
    const expiredServices = services.filter((s) => s.status === "expired");
    const expiringServices = services.filter((s) => s.status === "expiring");

    const serviceRows = [...expiredServices, ...expiringServices]
        .map(
            (s) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${s.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${s.category}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${s.price}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${s.expiry_date}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; color: ${s.status === "expired" ? "#dc2626" : "#d97706"}; font-weight: bold;">
          ${s.status === "expired" ? "已過期" : `${s.days_remaining} 天後到期`}
        </td>
      </tr>
    `
        )
        .join("");

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f6f7f8; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #137fec 0%, #0f6bca 100%); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">📋 SubTrack 訂閱提醒</h1>
        </div>
        
        <div style="padding: 32px;">
          <p style="color: #333; font-size: 16px; margin-bottom: 24px;">
            嗨 ${profile.nickname || "用戶"}，
          </p>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
            您有 <strong style="color: #dc2626;">${expiredServices.length}</strong> 個服務已過期，
            <strong style="color: #d97706;">${expiringServices.length}</strong> 個服務即將到期。
            請及時處理以避免服務中斷。
          </p>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
            <thead>
              <tr style="background: #f8f9fa;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #eee;">服務名稱</th>
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #eee;">類別</th>
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #eee;">價格</th>
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #eee;">到期日</th>
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #eee;">狀態</th>
              </tr>
            </thead>
            <tbody>
              ${serviceRows}
            </tbody>
          </table>
          
          <div style="text-align: center;">
            <a href="https://yourdomain.com" style="display: inline-block; background: #137fec; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              查看詳情
            </a>
          </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            此郵件由 SubTrack 自動發送 | <a href="https://yourdomain.com/settings" style="color: #137fec;">管理通知設置</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error("Supabase configuration missing");
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        // Get all users with email notifications enabled
        const { data: profiles, error: profilesError } = await supabase
            .from("profiles")
            .select("*")
            .eq("email_notify", true);

        if (profilesError) {
            throw profilesError;
        }

        const results = [];

        for (const profile of profiles || []) {
            if (!profile.email) continue;

            // Get services that need attention for this user
            const { data: services, error: servicesError } = await supabase
                .from("services")
                .select("*")
                .eq("user_id", profile.id)
                .or(`status.eq.expired,days_remaining.lte.${profile.reminder_days}`);

            if (servicesError) {
                console.error(`Error fetching services for user ${profile.id}:`, servicesError);
                continue;
            }

            if (!services || services.length === 0) {
                continue;
            }

            // Send email
            const emailHtml = generateReminderEmail(profile, services);
            const emailResult = await sendEmail(
                profile.email,
                `📋 SubTrack: 您有 ${services.length} 個訂閱需要關注`,
                emailHtml
            );

            results.push({
                userId: profile.id,
                email: profile.email,
                servicesCount: services.length,
                emailSent: emailResult.success,
            });
        }

        return new Response(
            JSON.stringify({
                success: true,
                processedUsers: results.length,
                results,
            }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            }
        );
    } catch (error) {
        console.error("Error:", error);
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 500,
            }
        );
    }
});
