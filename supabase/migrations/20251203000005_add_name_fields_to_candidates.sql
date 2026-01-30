-- candidatesテーブルに姓名とカナを追加

-- 姓と名を分ける
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS last_name_kana TEXT;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS first_name_kana TEXT;

-- 既存のfull_nameから姓名を分割する（オプション）
-- 注意: 既存データがある場合は、手動で分割するか、マイグレーション後に更新する必要があります






