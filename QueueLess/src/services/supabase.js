import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

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
  supabasePublishableKey &&
  isValidSupabaseUrl(supabaseUrl) &&
  !isPlaceholder(supabaseUrl) &&
  !isPlaceholder(supabasePublishableKey),
);
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl.trim(), supabasePublishableKey.trim())
  : null;

function unavailableError() {
  return new Error('Supabase não está configurado.');
}

function insertUserRecord(table, userId, record) {
  if (!isSupabaseConfigured || !supabase) {
    return Promise.resolve({ data: null, error: unavailableError() });
  }

  return supabase
    .from(table)
    .insert({ ...record, usuario_id: userId })
    .select()
    .single();
}

function updateUserRecord(table, userId, id, record) {
  if (!isSupabaseConfigured || !supabase) {
    return Promise.resolve({ data: null, error: unavailableError() });
  }

  return supabase
    .from(table)
    .update(record)
    .eq('id', id)
    .eq('usuario_id', userId)
    .select()
    .single();
}

function deleteUserRecord(table, userId, id) {
  if (!isSupabaseConfigured || !supabase) {
    return Promise.resolve({ error: unavailableError() });
  }

  return supabase
    .from(table)
    .delete()
    .eq('id', id)
    .eq('usuario_id', userId)
    .select('id')
    .single();
}

export async function registerUser({ nome, email, senha, tipoAcompanhamento = 'ambos' }) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: unavailableError() };
  }

  return supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password: senha,
    options: { 
      data: { 
        nome: nome.trim(),
        tipoAcompanhamento: tipoAcompanhamento
      } 
    },
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

export async function sendPasswordReset(email) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: unavailableError() };
  }

  return supabase.auth.resetPasswordForEmail(email.trim().toLowerCase());
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

// Cuida+ - Pressão Arterial
export async function fetchPressao(userId) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: [], error: unavailableError() };
  }

  return supabase
    .from('pressoes')
    .select('*')
    .eq('usuario_id', userId)
    .order('data', { ascending: false })
    .order('horario', { ascending: false });
}

export async function createPressao(userId, pressao) {
  return insertUserRecord('pressoes', userId, pressao);
}

export async function updatePressao(userId, id, pressao) {
  return updateUserRecord('pressoes', userId, id, pressao);
}

export async function deletePressao(userId, id) {
  return deleteUserRecord('pressoes', userId, id);
}

// Cuida+ - Glicemia
export async function fetchGlicemia(userId) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: [], error: unavailableError() };
  }

  return supabase
    .from('glicemias')
    .select('*')
    .eq('usuario_id', userId)
    .order('data', { ascending: false })
    .order('horario', { ascending: false });
}

export async function createGlicemia(userId, glicemia) {
  return insertUserRecord('glicemias', userId, glicemia);
}

export async function updateGlicemia(userId, id, glicemia) {
  return updateUserRecord('glicemias', userId, id, glicemia);
}

export async function deleteGlicemia(userId, id) {
  return deleteUserRecord('glicemias', userId, id);
}

// Cuida+ - Medicamentos
export async function fetchMedicamentos(userId) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: [], error: unavailableError() };
  }

  return supabase
    .from('medicamentos')
    .select('*')
    .eq('usuario_id', userId)
    .order('horario', { ascending: true });
}

export async function createMedicamento(userId, medicamento) {
  return insertUserRecord('medicamentos', userId, medicamento);
}

export async function updateMedicamento(userId, id, medicamento) {
  return updateUserRecord('medicamentos', userId, id, medicamento);
}

export async function deleteMedicamento(userId, id) {
  return deleteUserRecord('medicamentos', userId, id);
}

// Cuida+ - Consultas
export async function fetchConsultas(userId) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: [], error: unavailableError() };
  }

  return supabase
    .from('consultas')
    .select('*')
    .eq('usuario_id', userId)
    .order('data', { ascending: true })
    .order('horario', { ascending: true });
}

export async function createConsulta(userId, consulta) {
  return insertUserRecord('consultas', userId, consulta);
}

export async function updateConsulta(userId, id, consulta) {
  return updateUserRecord('consultas', userId, id, consulta);
}

export async function deleteConsulta(userId, id) {
  return deleteUserRecord('consultas', userId, id);
}

// Cuida+ - Atividades
export async function fetchAtividades(userId) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: [], error: unavailableError() };
  }

  return supabase
    .from('atividades')
    .select('*')
    .eq('usuario_id', userId)
    .order('data', { ascending: false });
}

export async function createAtividade(userId, atividade) {
  return insertUserRecord('atividades', userId, atividade);
}

export async function updateAtividade(userId, id, atividade) {
  return updateUserRecord('atividades', userId, id, atividade);
}

export async function deleteAtividade(userId, id) {
  return deleteUserRecord('atividades', userId, id);
}

export async function syncGamification() {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: unavailableError() };
  }

  return supabase.rpc('sync_gamification');
}

export async function fetchGamificationProfile(userId) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: unavailableError() };
  }

  return supabase
    .from('gamification_profiles')
    .select('xp, current_streak, best_streak')
    .eq('usuario_id', userId)
    .maybeSingle();
}

export async function fetchGamificationAchievements(userId) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: [], error: unavailableError() };
  }

  return supabase
    .from('gamification_achievements')
    .select('achievement_id, unlocked_at')
    .eq('usuario_id', userId)
    .order('unlocked_at', { ascending: false });
}
