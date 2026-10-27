import { supabase } from './supabase';
import { sampleState } from './sample';
import { uid } from './format';

// Two interchangeable stores with the same async API:
// load, setGestora, create, save, remove, setShare.

const DEMO_KEY = 'performance-social-demo-v1';

const toData = client => { const { id, shareToken, ...data } = client; return data; };
const fromRow = row => ({ ...row.data, id: row.id, shareToken: row.share_token || null });

function readDemo() {
  try {
    const raw = localStorage.getItem(DEMO_KEY);
    if (raw) { const s = JSON.parse(raw); if (s && Array.isArray(s.clients)) return s; }
  } catch (e) {}
  return sampleState();
}
function writeDemo(s) { try { localStorage.setItem(DEMO_KEY, JSON.stringify(s)); } catch (e) {} }

export function demoStore() {
  const mutate = fn => { const s = readDemo(); fn(s); writeDemo(s); return s; };
  return {
    kind: 'demo',
    async load() { const s = readDemo(); writeDemo(s); return s; },
    async setGestora(name) { mutate(s => { s.gestora = name; }); },
    async create(client) { const c = { ...client, id: uid() }; mutate(s => { s.clients.push(c); }); return c; },
    async save(client) { mutate(s => { s.clients = s.clients.map(x => x.id === client.id ? client : x); }); },
    async remove(id) { mutate(s => { s.clients = s.clients.filter(x => x.id !== id); }); },
    async setShare(id, token) { mutate(s => { const c = s.clients.find(x => x.id === id); if (c) c.shareToken = token; }); },
  };
}

export function demoShared(token) {
  const s = readDemo();
  const client = s.clients.find(c => c.shareToken === token);
  return client ? { client, gestora: s.gestora } : null;
}

export function cloudStore(user) {
  return {
    kind: 'cloud',
    async load() {
      const [profile, rows] = await Promise.all([
        supabase.from('profiles').select('name').eq('id', user.id).maybeSingle(),
        supabase.from('clients').select('id, data, share_token').order('created_at'),
      ]);
      if (rows.error) throw rows.error;
      const gestora = profile.data?.name || user.user_metadata?.name || user.email.split('@')[0];
      return { gestora, clients: rows.data.map(fromRow) };
    },
    async setGestora(name) {
      const { error } = await supabase.from('profiles').upsert({ id: user.id, name });
      if (error) throw error;
    },
    async create(client) {
      const { data, error } = await supabase.from('clients').insert({ data: toData(client) }).select('id, data, share_token').single();
      if (error) throw error;
      return fromRow(data);
    },
    async save(client) {
      const { error } = await supabase.from('clients').update({ data: toData(client) }).eq('id', client.id);
      if (error) throw error;
    },
    async remove(id) {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error;
    },
    async setShare(id, token) {
      const { error } = await supabase.from('clients').update({ share_token: token }).eq('id', id);
      if (error) throw error;
    },
  };
}

export async function cloudShared(token) {
  const { data, error } = await supabase.rpc('get_shared_report', { p_token: token });
  if (error) throw error;
  return data;
}
