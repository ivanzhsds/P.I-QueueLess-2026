CREATE TABLE IF NOT EXISTS public.gamification_profiles (
  usuario_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  xp INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
  current_streak INTEGER NOT NULL DEFAULT 0 CHECK (current_streak >= 0),
  best_streak INTEGER NOT NULL DEFAULT 0 CHECK (best_streak >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.gamification_xp_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  xp INTEGER NOT NULL CHECK (xp > 0),
  awarded_on DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (usuario_id, source_type, source_id)
);

CREATE TABLE IF NOT EXISTS public.gamification_achievements (
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (usuario_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS gamification_xp_events_period_idx
  ON public.gamification_xp_events (usuario_id, source_type, awarded_on);

ALTER TABLE public.gamification_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gamification_xp_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gamification_achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários podem ver seu perfil de gamificação" ON public.gamification_profiles;
CREATE POLICY "Usuários podem ver seu perfil de gamificação"
  ON public.gamification_profiles FOR SELECT
  USING (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "Usuários podem ver seus eventos de XP" ON public.gamification_xp_events;
CREATE POLICY "Usuários podem ver seus eventos de XP"
  ON public.gamification_xp_events FOR SELECT
  USING (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "Usuários podem ver suas conquistas" ON public.gamification_achievements;
CREATE POLICY "Usuários podem ver suas conquistas"
  ON public.gamification_achievements FOR SELECT
  USING (auth.uid() = usuario_id);

REVOKE ALL ON public.gamification_profiles FROM anon, authenticated;
REVOKE ALL ON public.gamification_xp_events FROM anon, authenticated;
REVOKE ALL ON public.gamification_achievements FROM anon, authenticated;
GRANT SELECT ON public.gamification_profiles TO authenticated;
GRANT SELECT ON public.gamification_xp_events TO authenticated;
GRANT SELECT ON public.gamification_achievements TO authenticated;

CREATE OR REPLACE FUNCTION public.add_gamification_xp(
  p_usuario_id UUID,
  p_source_type TEXT,
  p_source_id TEXT,
  p_xp INTEGER,
  p_awarded_on DATE DEFAULT CURRENT_DATE
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_inserted INTEGER;
BEGIN
  INSERT INTO public.gamification_xp_events (
    usuario_id, source_type, source_id, xp, awarded_on
  )
  VALUES (p_usuario_id, p_source_type, p_source_id, p_xp, p_awarded_on)
  ON CONFLICT (usuario_id, source_type, source_id) DO NOTHING;

  GET DIAGNOSTICS v_inserted = ROW_COUNT;
  RETURN v_inserted = 1;
END;
$$;

REVOKE ALL ON FUNCTION public.add_gamification_xp(UUID, TEXT, TEXT, INTEGER, DATE) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.update_gamification_xp_total()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.gamification_profiles (usuario_id, xp, updated_at)
  VALUES (NEW.usuario_id, NEW.xp, NOW())
  ON CONFLICT (usuario_id) DO UPDATE
    SET xp = public.gamification_profiles.xp + EXCLUDED.xp,
        updated_at = NOW();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS gamification_xp_events_update_profile ON public.gamification_xp_events;
CREATE TRIGGER gamification_xp_events_update_profile
  AFTER INSERT ON public.gamification_xp_events
  FOR EACH ROW EXECUTE FUNCTION public.update_gamification_xp_total();

CREATE OR REPLACE FUNCTION public.award_gamification_record_xp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_xp INTEGER;
  v_source_type TEXT;
BEGIN
  IF NEW.usuario_id IS NULL THEN
    RETURN NEW;
  END IF;

  v_source_type := 'record:' || TG_TABLE_NAME;
  v_xp := CASE TG_TABLE_NAME
    WHEN 'atividades' THEN 15
    ELSE 10
  END;

  PERFORM pg_advisory_xact_lock(
    hashtextextended(NEW.usuario_id::TEXT || ':' || TG_TABLE_NAME || ':' || CURRENT_DATE::TEXT, 0)
  );

  IF NOT EXISTS (
    SELECT 1
    FROM public.gamification_xp_events
    WHERE usuario_id = NEW.usuario_id
      AND source_type = v_source_type
      AND awarded_on = CURRENT_DATE
  ) THEN
    PERFORM public.add_gamification_xp(
      NEW.usuario_id, v_source_type, NEW.id::TEXT, v_xp, CURRENT_DATE
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS pressoes_award_gamification_xp ON public.pressoes;
CREATE TRIGGER pressoes_award_gamification_xp
  AFTER INSERT ON public.pressoes
  FOR EACH ROW EXECUTE FUNCTION public.award_gamification_record_xp();

DROP TRIGGER IF EXISTS glicemias_award_gamification_xp ON public.glicemias;
CREATE TRIGGER glicemias_award_gamification_xp
  AFTER INSERT ON public.glicemias
  FOR EACH ROW EXECUTE FUNCTION public.award_gamification_record_xp();

DROP TRIGGER IF EXISTS atividades_award_gamification_xp ON public.atividades;
CREATE TRIGGER atividades_award_gamification_xp
  AFTER INSERT ON public.atividades
  FOR EACH ROW EXECUTE FUNCTION public.award_gamification_record_xp();

CREATE OR REPLACE FUNCTION public.sync_gamification()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_usuario_id UUID := auth.uid();
  v_dates DATE[];
  v_record_date DATE;
  v_last_record_date DATE;
  v_previous_date DATE;
  v_run INTEGER := 0;
  v_longest_streak INTEGER := 0;
  v_current_streak INTEGER := 0;
  v_latest_chain BOOLEAN := TRUE;
  v_total_records BIGINT := 0;
  v_total_activities BIGINT := 0;
  v_week_start DATE := date_trunc('week', CURRENT_DATE)::DATE;
  v_week_activities BIGINT := 0;
  v_week_measurements BIGINT := 0;
  v_has_record_today BOOLEAN := FALSE;
BEGIN
  IF v_usuario_id IS NULL THEN
    RAISE EXCEPTION 'É necessário estar autenticado para sincronizar a gamificação.';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtextextended(v_usuario_id::TEXT || ':gamification-sync', 0));

  INSERT INTO public.gamification_profiles (usuario_id)
  VALUES (v_usuario_id)
  ON CONFLICT (usuario_id) DO NOTHING;

  SELECT array_agg(record_date ORDER BY record_date DESC)
  INTO v_dates
  FROM (
    SELECT data AS record_date FROM public.pressoes WHERE usuario_id = v_usuario_id AND data <= CURRENT_DATE
    UNION
    SELECT data AS record_date FROM public.glicemias WHERE usuario_id = v_usuario_id AND data <= CURRENT_DATE
    UNION
    SELECT data AS record_date FROM public.atividades WHERE usuario_id = v_usuario_id AND data <= CURRENT_DATE
  ) AS care_dates;

  SELECT COUNT(*) INTO v_total_records
  FROM (
    SELECT id FROM public.pressoes WHERE usuario_id = v_usuario_id
    UNION ALL
    SELECT id FROM public.glicemias WHERE usuario_id = v_usuario_id
    UNION ALL
    SELECT id FROM public.atividades WHERE usuario_id = v_usuario_id
  ) AS all_records;

  SELECT COUNT(*) INTO v_total_activities
  FROM public.atividades
  WHERE usuario_id = v_usuario_id;

  SELECT COUNT(*) INTO v_week_activities
  FROM public.atividades
  WHERE usuario_id = v_usuario_id
    AND data >= v_week_start
    AND data <= CURRENT_DATE;

  SELECT COUNT(*) INTO v_week_measurements
  FROM (
    SELECT id FROM public.pressoes
    WHERE usuario_id = v_usuario_id AND data >= v_week_start AND data <= CURRENT_DATE
    UNION ALL
    SELECT id FROM public.glicemias
    WHERE usuario_id = v_usuario_id AND data >= v_week_start AND data <= CURRENT_DATE
  ) AS weekly_measurements;

  SELECT EXISTS (
    SELECT 1 FROM public.pressoes WHERE usuario_id = v_usuario_id AND data = CURRENT_DATE
    UNION ALL
    SELECT 1 FROM public.glicemias WHERE usuario_id = v_usuario_id AND data = CURRENT_DATE
  ) INTO v_has_record_today;

  FOREACH v_record_date IN ARRAY COALESCE(v_dates, ARRAY[]::DATE[])
  LOOP
    IF v_previous_date IS NULL THEN
      v_last_record_date := v_record_date;
      v_run := 1;
    ELSIF v_previous_date - v_record_date = 1 THEN
      v_run := v_run + 1;
    ELSE
      IF v_latest_chain THEN
        IF v_last_record_date >= CURRENT_DATE - 1 THEN
          v_current_streak := v_run;
        END IF;
        v_latest_chain := FALSE;
      END IF;
      v_run := 1;
    END IF;

    v_longest_streak := GREATEST(v_longest_streak, v_run);
    v_previous_date := v_record_date;
  END LOOP;

  IF v_latest_chain AND v_last_record_date >= CURRENT_DATE - 1 THEN
    v_current_streak := v_run;
  END IF;

  IF v_total_records >= 1 THEN
    INSERT INTO public.gamification_achievements (usuario_id, achievement_id)
    VALUES (v_usuario_id, 'primeiro_cuidado')
    ON CONFLICT DO NOTHING;
    PERFORM public.add_gamification_xp(v_usuario_id, 'achievement', 'primeiro_cuidado', 25);
  END IF;

  IF v_total_activities >= 1 THEN
    INSERT INTO public.gamification_achievements (usuario_id, achievement_id)
    VALUES (v_usuario_id, 'primeira_atividade')
    ON CONFLICT DO NOTHING;
    PERFORM public.add_gamification_xp(v_usuario_id, 'achievement', 'primeira_atividade', 15);
  END IF;

  IF v_total_records >= 10 THEN
    INSERT INTO public.gamification_achievements (usuario_id, achievement_id)
    VALUES (v_usuario_id, 'dez_registros')
    ON CONFLICT DO NOTHING;
    PERFORM public.add_gamification_xp(v_usuario_id, 'achievement', 'dez_registros', 30);
  END IF;

  IF v_longest_streak >= 7 THEN
    INSERT INTO public.gamification_achievements (usuario_id, achievement_id)
    VALUES (v_usuario_id, 'sete_dias')
    ON CONFLICT DO NOTHING;
    PERFORM public.add_gamification_xp(v_usuario_id, 'achievement', 'sete_dias', 50);
  END IF;

  IF v_has_record_today THEN
    PERFORM public.add_gamification_xp(
      v_usuario_id, 'mission:check_in_diario', CURRENT_DATE::TEXT, 20
    );
  END IF;

  IF v_week_activities >= 3 THEN
    PERFORM public.add_gamification_xp(
      v_usuario_id, 'mission:movimento_semanal', v_week_start::TEXT, 30
    );
  END IF;

  IF v_week_measurements >= 5 THEN
    PERFORM public.add_gamification_xp(
      v_usuario_id, 'mission:acompanhamento_semanal', v_week_start::TEXT, 25
    );
  END IF;

  UPDATE public.gamification_profiles
  SET current_streak = v_current_streak,
      best_streak = GREATEST(best_streak, v_longest_streak),
      updated_at = NOW()
  WHERE usuario_id = v_usuario_id;

  RETURN jsonb_build_object(
    'today', CURRENT_DATE,
    'week_start', v_week_start,
    'current_streak', v_current_streak,
    'best_streak', v_longest_streak,
    'weekly_activities', v_week_activities,
    'weekly_measurements', v_week_measurements,
    'has_record_today', v_has_record_today
  );
END;
$$;

REVOKE ALL ON FUNCTION public.sync_gamification() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.sync_gamification() TO authenticated;
