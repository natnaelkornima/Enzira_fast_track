import { createClient } from '@supabase/supabase-js'

function sanitizeUrl(rawUrl) {
    if (!rawUrl || typeof rawUrl !== 'string') return 'https://placeholder.supabase.co';
    let url = rawUrl.trim().replace(/^["']|["']$/g, '');
    if (!url || url === 'undefined' || url === 'null') return 'https://placeholder.supabase.co';
    
    // Prepend https:// if user pasted just the domain (e.g. xyz.supabase.co)
    if (!/^https?:\/\//i.test(url)) {
        url = `https://${url}`;
    }
    
    // Remove any trailing slashes
    url = url.replace(/\/+$/, '');
    
    try {
        new URL(url);
        return url;
    } catch {
        return 'https://placeholder.supabase.co';
    }
}

function sanitizeKey(rawKey) {
    if (!rawKey || typeof rawKey !== 'string') return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';
    const key = rawKey.trim().replace(/^["']|["']$/g, '');
    if (!key || key === 'undefined' || key === 'null') return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';
    return key;
}

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseUrl = sanitizeUrl(rawUrl);
const supabaseAnonKey = sanitizeKey(rawKey);

let client;
try {
    client = createClient(supabaseUrl, supabaseAnonKey);
} catch (err) {
    console.error('Warning: Failed to initialize custom Supabase client, using fallback:', err);
    client = createClient('https://placeholder.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder');
}

export const supabase = client;

export const isSupabaseConfigured = () => {
    return Boolean(
        rawUrl &&
        rawKey &&
        !supabaseUrl.includes('placeholder') &&
        !supabaseAnonKey.includes('placeholder')
    );
};
