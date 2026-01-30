-- companiesテーブルの更新
-- 削除: industry, address, phone, email, website, contact_person_name, contact_person_email
-- 追加: notes

-- まず、contact_person_emailを参照しているRLSポリシーを削除
DROP POLICY IF EXISTS "Company users can view their company job postings" ON job_postings;
DROP POLICY IF EXISTS "Company users can view applications for their company jobs" ON applications;
DROP POLICY IF EXISTS "Company users can view progress for their company job applications" ON application_progress;

-- notesカラムを追加
ALTER TABLE companies ADD COLUMN IF NOT EXISTS notes TEXT;

-- 不要なカラムを削除
ALTER TABLE companies DROP COLUMN IF EXISTS industry;
ALTER TABLE companies DROP COLUMN IF EXISTS address;
ALTER TABLE companies DROP COLUMN IF EXISTS phone;
ALTER TABLE companies DROP COLUMN IF EXISTS email;
ALTER TABLE companies DROP COLUMN IF EXISTS website;
ALTER TABLE companies DROP COLUMN IF EXISTS contact_person_name;
ALTER TABLE companies DROP COLUMN IF EXISTS contact_person_email;

