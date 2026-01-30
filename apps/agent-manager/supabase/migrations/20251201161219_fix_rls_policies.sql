-- RLSポリシーの修正: auth.usersへの直接アクセスを削除

-- profilesテーブルにemailカラムを追加（既に存在する場合はスキップ）
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- 既存のprofilesレコードのemailを更新する関数
CREATE OR REPLACE FUNCTION public.sync_profiles_email()
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET email = (
    SELECT email FROM auth.users WHERE auth.users.id = profiles.id
  )
  WHERE email IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 関数を実行（管理者権限で実行される）
SELECT public.sync_profiles_email();

-- 関数を削除（一度だけ実行するため）
DROP FUNCTION IF EXISTS public.sync_profiles_email();

-- job_postingsテーブルのポリシーを修正
DROP POLICY IF EXISTS "Company users can view their company job postings" ON job_postings;

CREATE POLICY "Company users can view their company job postings"
  ON job_postings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'company_user'
      AND EXISTS (
        SELECT 1 FROM companies
        WHERE companies.id = job_postings.company_id
        AND companies.contact_person_email = profiles.email
      )
    )
  );

-- applicationsテーブルのポリシーを修正
DROP POLICY IF EXISTS "Company users can view applications for their company jobs" ON applications;

CREATE POLICY "Company users can view applications for their company jobs"
  ON applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'company_user'
      AND EXISTS (
        SELECT 1 FROM job_postings
        JOIN companies ON companies.id = job_postings.company_id
        WHERE job_postings.id = applications.job_posting_id
        AND companies.contact_person_email = profiles.email
      )
    )
  );

-- application_progressテーブルのポリシーを修正
DROP POLICY IF EXISTS "Company users can view progress for their company job applications" ON application_progress;

CREATE POLICY "Company users can view progress for their company job applications"
  ON application_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'company_user'
      AND EXISTS (
        SELECT 1 FROM applications
        JOIN job_postings ON job_postings.id = applications.job_posting_id
        JOIN companies ON companies.id = job_postings.company_id
        WHERE applications.id = application_progress.application_id
        AND companies.contact_person_email = profiles.email
      )
    )
  );

-- 新しいユーザーが作成されたときにemailを自動設定するトリガー関数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    'candidate'
  )
  ON CONFLICT (id) DO UPDATE
  SET email = NEW.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- トリガーが既に存在する場合は削除
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- トリガーを作成
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

