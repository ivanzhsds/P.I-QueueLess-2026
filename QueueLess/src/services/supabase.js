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

export async function createPressao(pressao) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: unavailableError() };
  }

  return supabase.from('pressoes').insert(pressao).select().single();
}

export async function updatePressao(id, pressao) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: unavailableError() };
  }

  return supabase
    .from('pressoes')
    .update(pressao)
    .eq('id', id)
    .select()
    .single();
}

export async function deletePressao(id) {
  if (!isSupabaseConfigured || !supabase) {
    return { error: unavailableError() };
  }

  return supabase.from('pressoes').delete().eq('id', id);
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

export async function createGlicemia(glicemia) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: unavailableError() };
  }

  return supabase.from('glicemias').insert(glicemia).select().single();
}

export async function updateGlicemia(id, glicemia) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: unavailableError() };
  }

  return supabase
    .from('glicemias')
    .update(glicemia)
    .eq('id', id)
    .select()
    .single();
}

export async function deleteGlicemia(id) {
  if (!isSupabaseConfigured || !supabase) {
    return { error: unavailableError() };
  }

  return supabase.from('glicemias').delete().eq('id', id);
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

export async function createMedicamento(medicamento) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: unavailableError() };
  }

  return supabase.from('medicamentos').insert(medicamento).select().single();
}

export async function updateMedicamento(id, medicamento) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: unavailableError() };
  }

  return supabase
    .from('medicamentos')
    .update(medicamento)
    .eq('id', id)
    .select()
    .single();
}

export async function deleteMedicamento(id) {
  if (!isSupabaseConfigured || !supabase) {
    return { error: unavailableError() };
  }

  return supabase.from('medicamentos').delete().eq('id', id);
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

export async function createConsulta(consulta) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: unavailableError() };
  }

  return supabase.from('consultas').insert(consulta).select().single();
}

export async function updateConsulta(id, consulta) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: unavailableError() };
  }

  return supabase
    .from('consultas')
    .update(consulta)
    .eq('id', id)
    .select()
    .single();
}

export async function deleteConsulta(id) {
  if (!isSupabaseConfigured || !supabase) {
    return { error: unavailableError() };
  }

  return supabase.from('consultas').delete().eq('id', id);
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

export async function createAtividade(atividade) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: unavailableError() };
  }

  return supabase.from('atividades').insert(atividade).select().single();
}

export async function updateAtividade(id, atividade) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: unavailableError() };
  }

  return supabase
    .from('atividades')
    .update(atividade)
    .eq('id', id)
    .select()
    .single();
}

export async function deleteAtividade(id) {
  if (!isSupabaseConfigured || !supabase) {
    return { error: unavailableError() };
  }

  return supabase.from('atividades').delete().eq('id', id);
}
