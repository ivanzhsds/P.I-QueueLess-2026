import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  fetchAtividades,
  fetchGamificationAchievements,
  fetchGamificationProfile,
  fetchGlicemia,
  fetchPressao,
  isSupabaseConfigured,
  syncGamification,
} from '../services/supabase';

const missions = [
  {
    id: 'check_in_diario',
    title: 'Acompanhe sua saúde hoje',
    description: 'Registre ao menos uma medição de pressão ou glicemia hoje.',
    reward: 20,
    target: 1,
    path: '/pressao',
    period: 'daily',
  },
  {
    id: 'movimento_semanal',
    title: 'Movimente-se na semana',
    description: 'Registre 3 atividades físicas nesta semana.',
    reward: 30,
    target: 3,
    path: '/atividades',
    period: 'weekly-activities',
  },
  {
    id: 'acompanhamento_semanal',
    title: 'Mantenha o acompanhamento',
    description: 'Registre 5 medições de pressão ou glicemia nesta semana.',
    reward: 25,
    target: 5,
    path: '/glicemia',
    period: 'weekly-measurements',
  },
];

const achievements = {
  primeiro_cuidado: { title: 'Primeiro cuidado', description: 'Fez seu primeiro registro de saúde.', icon: '♡' },
  primeira_atividade: { title: 'Em movimento', description: 'Registrou sua primeira atividade física.', icon: '⌁' },
  dez_registros: { title: 'Cuidado constante', description: 'Completou 10 registros de saúde ou atividades.', icon: '✚' },
  sete_dias: { title: '7 dias de cuidado', description: 'Acompanhou sua saúde por 7 dias consecutivos.', icon: '☆' },
};

function countOnDate(records, date) {
  return records.filter((record) => record.data === date).length;
}

function countInWeek(records, weekStart, today) {
  return records.filter((record) => record.data >= weekStart && record.data <= today).length;
}

function getMissionProgress(mission, dates, records) {
  if (mission.period === 'daily') {
    return Math.min(
      mission.target,
      countOnDate(records.pressoes, dates.today) + countOnDate(records.glicemias, dates.today),
    );
  }
  if (mission.period === 'weekly-activities') {
    return Math.min(mission.target, countInWeek(records.atividades, dates.week_start, dates.today));
  }
  return Math.min(
    mission.target,
    countInWeek(records.pressoes, dates.week_start, dates.today)
      + countInWeek(records.glicemias, dates.week_start, dates.today),
  );
}

export default function Missoes() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [unlocked, setUnlocked] = useState([]);
  const [records, setRecords] = useState({ pressoes: [], glicemias: [], atividades: [] });
  const [dates, setDates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured || !user?.id) {
      setLoading(false);
      return;
    }

    async function loadGamification() {
      try {
        const [pressureResult, glucoseResult, activityResult] = await Promise.all([
          fetchPressao(user.id),
          fetchGlicemia(user.id),
          fetchAtividades(user.id),
        ]);

        const dataResults = [pressureResult, glucoseResult, activityResult];
        const failedDataRequest = dataResults.find((result) => result.error);
        if (failedDataRequest) throw failedDataRequest.error;

        const syncResult = await syncGamification();
        if (syncResult.error) throw syncResult.error;

        const [profileResult, achievementsResult] = await Promise.all([
          fetchGamificationProfile(user.id),
          fetchGamificationAchievements(user.id),
        ]);
        const failedGamificationRequest = [profileResult, achievementsResult]
          .find((result) => result.error);
        if (failedGamificationRequest) throw failedGamificationRequest.error;

        setRecords({
          pressoes: pressureResult.data ?? [],
          glicemias: glucoseResult.data ?? [],
          atividades: activityResult.data ?? [],
        });
        setDates(syncResult.data);
        setProfile(profileResult.data);
        setUnlocked(achievementsResult.data ?? []);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadGamification();
  }, [user?.id]);

  if (loading) {
    return <section className="page-content"><p>Carregando gamificação...</p></section>;
  }

  const xp = profile?.xp ?? 0;
  const level = Math.floor(xp / 100) + 1;
  const levelProgress = xp % 100;
  const currentStreak = profile?.current_streak ?? 0;
  const bestStreak = profile?.best_streak ?? 0;

  return (
    <section className="page-content">
      <div className="section-header">
        <div>
          <span className="eyebrow">CUIDA+</span>
          <h1>Missões e conquistas</h1>
          <p className="page-description">Seu cuidado, reconhecido a cada passo.</p>
        </div>
      </div>

      {!isSupabaseConfigured && (
        <div className="warning-box">
          <strong>Supabase não configurado.</strong>
          <p>Configure o Supabase para carregar seu progresso real.</p>
        </div>
      )}
      {error && <p className="error" role="alert">{error}</p>}

      {isSupabaseConfigured && !error && (
        <>
          <section className="card level-card" aria-label="Nível e experiência">
            <div className="level-top">
              <span className="level-emblem" aria-hidden="true">✚</span>
              <div>
                <span className="eyebrow">NÍVEL {level}</span>
                <h2>Cuidador em evolução</h2>
              </div>
              <span className="level-xp">{xp} XP</span>
            </div>
            <div
              className="progress-track"
              role="progressbar"
              aria-label={`Progresso para o nível ${level + 1}`}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={levelProgress}
            >
              <span style={{ width: `${levelProgress}%` }} />
            </div>
            <div className="level-foot">
              <span>{levelProgress} / 100 XP</span>
              <span>Faltam {100 - levelProgress} XP para o nível {level + 1}</span>
            </div>
          </section>

          <div className="stats-grid" aria-label="Sequência de acompanhamento">
            <div className="card">
              <strong>{currentStreak}</strong>
              <span>{currentStreak === 1 ? 'dia seguido' : 'dias seguidos'}</span>
            </div>
            <div className="card">
              <strong>{bestStreak}</strong>
              <span>melhor sequência</span>
            </div>
            <div className="card">
              <strong>{unlocked.length}</strong>
              <span>{unlocked.length === 1 ? 'conquista' : 'conquistas'}</span>
            </div>
          </div>

          <h2 className="section-heading">Missões</h2>
          {!dates ? (
            <p className="empty-state">Não foi possível carregar o período das missões.</p>
          ) : (
            <div className="mission-list">
              {missions.map((mission) => {
                const progress = getMissionProgress(mission, dates, records);
                const isComplete = progress >= mission.target;
                return (
                  <article className="card mission-card" key={mission.id}>
                    <div className="mission-main">
                      <div className="mission-title">
                        <strong>{mission.title}</strong>
                        <span className="done-label">{isComplete ? 'Concluída' : `+${mission.reward} XP`}</span>
                      </div>
                      <p>{mission.description}</p>
                      <div
                        className="progress-track"
                        role="progressbar"
                        aria-label={`Progresso: ${mission.title}`}
                        aria-valuemin="0"
                        aria-valuemax={mission.target}
                        aria-valuenow={progress}
                      >
                        <span style={{ width: `${(progress / mission.target) * 100}%` }} />
                      </div>
                      <small>{progress} / {mission.target} • {isComplete ? 'Recompensa creditada' : `Recompensa: ${mission.reward} XP`}</small>
                    </div>
                    <Link
                      className="mission-action"
                      to={mission.path}
                      aria-label={`Abrir funcionalidade para: ${mission.title}`}
                    >
                      →
                    </Link>
                  </article>
                );
              })}
            </div>
          )}

          <h2 className="section-heading">Conquistas desbloqueadas</h2>
          {unlocked.length === 0 ? (
            <p className="empty-state">Suas conquistas aparecerão aqui quando forem desbloqueadas.</p>
          ) : (
            <div className="card achievement-list">
              {unlocked.map((achievement) => {
                const details = achievements[achievement.achievement_id];
                if (!details) return null;
                return (
                  <div key={achievement.achievement_id}>
                    <span className="achievement-icon" aria-hidden="true">{details.icon}</span>
                    <span>
                      <strong>{details.title}</strong>
                      <small>{details.description}</small>
                    </span>
                    <span className="achievement-check" aria-label="Desbloqueada">✓</span>
                  </div>
                );
              })}
            </div>
          )}

          <section className="card gamification-rules">
            <h2>Como ganhar XP</h2>
            <ul>
              <li>+10 XP pelo primeiro registro diário de pressão.</li>
              <li>+10 XP pelo primeiro registro diário de glicemia.</li>
              <li>+15 XP pela primeira atividade física registrada no dia.</li>
              <li>Missões concluídas: bônus de 20 a 30 XP, uma vez por período.</li>
              <li>Conquistas desbloqueadas: bônus único de 15 a 50 XP.</li>
              <li>Cada 100 XP avançam um nível. Editar ou excluir registros não gera XP.</li>
            </ul>
          </section>
        </>
      )}
    </section>
  );
}
