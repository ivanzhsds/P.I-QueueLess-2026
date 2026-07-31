import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

function isValidSupabaseUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

function isPlaceholder(value) {
  return /seu-projeto|sua-chave|seu-valor|example\.supabase\.co/i.test(value);
}

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  isValidSupabaseUrl(supabaseUrl) &&
  !isPlaceholder(supabaseUrl) &&
  !isPlaceholder(supabaseKey),
);
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl.trim(), supabaseKey.trim())
  : null;

function unavailableError() {
  return new Error('Supabase não está configurado.');
}

export async function registerUser({ nome, email, senha }) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: unavailableError() };
  }

  return supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password: senha,
    options: { data: { nome: nome.trim() } },
  });
}

export async function loginUser({ email, senha }) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: unavailableError() };
  }

  return supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password: senha,
  });
}

export async function logoutUser() {
  if (!isSupabaseConfigured || !supabase) {
    return { error: unavailableError() };
  }

  return supabase.auth.signOut();
}

export async function getCurrentSession() {
  if (!isSupabaseConfigured || !supabase) {
    return { data: { session: null }, error: unavailableError() };
  }

  return supabase.auth.getSession();
}

export async function fetchAppointments(userId) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: [], error: unavailableError() };
  }

  return supabase
    .from('agendamentos')
    .select('*')
    .eq('usuario_id', userId)
    .order('data', { ascending: true })
    .order('hora', { ascending: true });
}

export async function createAppointment(appointment) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: unavailableError() };
  }

  return supabase.from('agendamentos').insert(appointment).select().single();
}

export async function updateAppointment(id, appointment) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: unavailableError() };
  }

  return supabase
    .from('agendamentos')
    .update(appointment)
    .eq('id', id)
    .select()
    .single();
}

export async function deleteAppointment(id) {
  if (!isSupabaseConfigured || !supabase) {
    return { error: unavailableError() };
  }

  return supabase.from('agendamentos').delete().eq('id', id);
}

export async function fetchServices() {
  if (!isSupabaseConfigured || !supabase) {
    return { data: [], error: unavailableError() };
  }

  return supabase
    .from('servicos')
    .select('*')
    .order('inicio', { ascending: true });
}

export async function finishService(service) {
  if (!isSupabaseConfigured || !supabase) {
    return { error: unavailableError() };
  }

  const { error: historyError } = await supabase.from('historico').insert({
    servico_id: service.id,
    cliente: service.cliente,
    placa: service.placa,
    servico: service.servico,
    finalizado_em: new Date().toISOString(),
  });

  if (historyError) return { error: historyError };
  return supabase.from('servicos').delete().eq('id', service.id);
}

export async function fetchHistory() {
  if (!isSupabaseConfigured || !supabase) {
    return { data: [], error: unavailableError() };
  }

  return supabase
    .from('historico')
    .select('*')
    .order('finalizado_em', { ascending: false });
}

export async function deleteHistoryItem(id) {
  if (!isSupabaseConfigured || !supabase) {
    return { error: unavailableError() };
  }

  return supabase.from('historico').delete().eq('id', id);
}

export async function deleteAllHistory() {
  if (!isSupabaseConfigured || !supabase) {
    return { error: unavailableError() };
  }

  return supabase.from('historico').delete().not('id', 'is', null);
}
