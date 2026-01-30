-- 特別面談登録をイベントごとに永続化するためのテーブル
CREATE TABLE public.event_special_interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
    session_number INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(event_id, company_id, session_number),
    UNIQUE(event_id, candidate_id, session_number)
);

-- RLSの設定
ALTER TABLE public.event_special_interviews ENABLE ROW LEVEL SECURITY;

-- 管理者はすべての操作が可能
CREATE POLICY "Admins have full access to event_special_interviews"
    ON public.event_special_interviews
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- リクルーターは自分の企業の特別面談を閲覧可能
CREATE POLICY "Recruiters can view their company's special interviews"
    ON public.event_special_interviews
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'recruiter'
            AND profiles.company_id = event_special_interviews.company_id
        )
    );

-- トリガーでupdated_atを自動更新
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_event_special_interviews_updated_at
    BEFORE UPDATE ON public.event_special_interviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();





