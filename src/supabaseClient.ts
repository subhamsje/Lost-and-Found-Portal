import { createClient } from '@supabase/supabase-js';
import { Item } from './types';

// Supabase project configurations
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://zwrlnnyfmfgudchvoygk.supabase.co';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_OPOQrWgUx1i3FtOsrPWcXg_zBCWEEXx';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper to map DB row from Supabase back into the frontend TypeScript structure
export function mapRowToItem(row: any): Item {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    location: row.location,
    dateReported: row.date_reported || row.dateReported || row.created_at || new Date().toISOString(),
    status: row.status,
    reward: row.reward || undefined,
    contactEmail: row.contact_email || row.contactEmail || '',
    founderOrLoserName: row.founder_or_loser_name || row.founderOrLoserName || '',
    accentColor: (row.accent_color || row.accentColor || 'blue') as Item['accentColor'],
    icon: row.icon || '📦',
    specs: row.specs || undefined,
    views: Number(row.views ?? 0)
  };
}

// Helper to map modern camelCase TypeScript structure into PostgreSQL snake_case columns
export function mapItemToRow(item: Item) {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    location: item.location,
    date_reported: item.dateReported,
    status: item.status,
    reward: item.reward || null,
    contact_email: item.contactEmail,
    founder_or_loser_name: item.founderOrLoserName,
    accent_color: item.accentColor,
    icon: item.icon,
    specs: item.specs || null,
    views: item.views
  };
}
