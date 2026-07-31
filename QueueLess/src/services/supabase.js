import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

function unavailableError() {
  return new Error('Supabase não está configurado.');
}

export async function registerUser({ nome, email, senha }) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: unavailableError() };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const { data: existingUser, error: lookupError } = await supabase
    .from('usuarios')
    .select('id')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (lookupError) return { data: null, error: lookupError };
  if (existingUser) {
    return { data: null, error: new Error('Este email já está cadastrado.') };
  }

  return supabase
    .from('usuarios')
    .insert({
      nome: nome.trim(),
      email: normalizedEmail,
      senha,
    })
    .select('id, nome, email, created_at')
    .single();
}

export async function loginUser({ email, senha }) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: unavailableError() };
  }

  const { data, error } = await supabase
    .from('usuarios')
    .select('id, nome, email, created_at')
    .eq('email', email.trim().toLowerCase())
    .eq('senha', senha)
    .maybeSingle();

  if (error) return { data: null, error };
  if (!data) return { data: null, error: new Error('Email ou senha inválidos.') };
  return { data, error: null };
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
