-- candidatesテーブルに卒年度と担当者を追加

-- 卒年度カラムを追加
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS graduation_year INTEGER;

-- 担当者カラムを追加（profilesテーブルへの参照）
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- インデックスを追加（担当者での検索を高速化）
CREATE INDEX IF NOT EXISTS idx_candidates_assigned_to ON candidates(assigned_to);







