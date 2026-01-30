-- ==========================================
-- 1. 依存するすべてのポリシーを一旦削除
-- ==========================================

-- profiles
drop policy if exists "Admins can insert profiles" on "public"."profiles";
drop policy if exists "Admins can update all profiles" on "public"."profiles";

-- candidates
drop policy if exists "Admin and recruiters can delete candidates" on "public"."candidates";
drop policy if exists "Admin and recruiters can insert candidates" on "public"."candidates";
drop policy if exists "Admin and recruiters can update candidates" on "public"."candidates";
drop policy if exists "Admin and recruiters can view all candidates" on "public"."candidates";

-- companies
drop policy if exists "Admin and recruiters can delete companies" on "public"."companies";
drop policy if exists "Admin and recruiters can insert companies" on "public"."companies";
drop policy if exists "Admin and recruiters can update companies" on "public"."companies";
drop policy if exists "Admin and recruiters can view all companies" on "public"."companies";

-- applications
drop policy if exists "Admin and recruiters can delete applications" on "public"."applications";
drop policy if exists "Admin and recruiters can insert applications" on "public"."applications";
drop policy if exists "Admin and recruiters can update applications" on "public"."applications";
drop policy if exists "Admin and recruiters can view all applications" on "public"."applications";

-- application_progress
drop policy if exists "Admin and recruiters can delete application progress" on "public"."application_progress";
drop policy if exists "Admin and recruiters can insert application progress" on "public"."application_progress";
drop policy if exists "Admin and recruiters can update application progress" on "public"."application_progress";
drop policy if exists "Admin and recruiters can view all application progress" on "public"."application_progress";

-- job_postings
drop policy if exists "Admin and recruiters can delete job postings" on "public"."job_postings";
drop policy if exists "Admin and recruiters can insert job postings" on "public"."job_postings";
drop policy if exists "Admin and recruiters can update job postings" on "public"."job_postings";
drop policy if exists "Admin and recruiters can view all job postings" on "public"."job_postings";

-- masters
drop policy if exists "Admins can manage master areas" on "public"."master_areas";
drop policy if exists "Admins can manage master event types" on "public"."master_event_types";
drop policy if exists "Admins can manage master graduation years" on "public"."master_graduation_years";


-- ==========================================
-- 2. 既存データの移行 (RA, CA, MRK を admin に統合)
-- ==========================================
UPDATE public.profiles SET role = 'admin' WHERE role::text IN ('RA', 'CA', 'MRK');


-- ==========================================
-- 3. user_role enumの更新
-- ==========================================
ALTER TABLE "public"."profiles" ALTER COLUMN "role" DROP DEFAULT;

ALTER TYPE "public"."user_role" RENAME TO "user_role_old";
CREATE TYPE "public"."user_role" AS ENUM ('admin', 'recruiter');
ALTER TABLE "public"."profiles" ALTER COLUMN "role" TYPE "public"."user_role" USING "role"::text::"public"."user_role";

ALTER TABLE "public"."profiles" ALTER COLUMN "role" SET DEFAULT 'admin'::public.user_role;
DROP TYPE "public"."user_role_old";


-- ==========================================
-- 4. ポリシーの再作成 (admin と recruiter のみに限定)
-- ==========================================

-- profiles
create policy "Admins can insert profiles"
on "public"."profiles" as permissive for insert to authenticated
with check ((EXISTS ( SELECT 1 FROM public.profiles p WHERE ((p.id = auth.uid()) AND (p.role = 'admin'::public.user_role)))));

create policy "Admins can update all profiles"
on "public"."profiles" as permissive for update to authenticated
using ((EXISTS ( SELECT 1 FROM public.profiles p WHERE ((p.id = auth.uid()) AND (p.role = 'admin'::public.user_role)))))
with check ((EXISTS ( SELECT 1 FROM public.profiles p WHERE ((p.id = auth.uid()) AND (p.role = 'admin'::public.user_role)))));

-- candidates
create policy "Admin and recruiters can delete candidates" on "public"."candidates" as permissive for delete to public
using ((EXISTS ( SELECT 1 FROM public.profiles WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'recruiter'::public.user_role]))))));

create policy "Admin and recruiters can insert candidates" on "public"."candidates" as permissive for insert to public
with check ((EXISTS ( SELECT 1 FROM public.profiles WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'recruiter'::public.user_role]))))));

create policy "Admin and recruiters can update candidates" on "public"."candidates" as permissive for update to public
using ((EXISTS ( SELECT 1 FROM public.profiles WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'recruiter'::public.user_role]))))));

create policy "Admin and recruiters can view all candidates" on "public"."candidates" as permissive for select to public
using ((EXISTS ( SELECT 1 FROM public.profiles WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'recruiter'::public.user_role]))))));

-- companies
create policy "Admin and recruiters can delete companies" on "public"."companies" as permissive for delete to public
using ((EXISTS ( SELECT 1 FROM public.profiles WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'recruiter'::public.user_role]))))));

create policy "Admin and recruiters can insert companies" on "public"."companies" as permissive for insert to public
with check ((EXISTS ( SELECT 1 FROM public.profiles WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'recruiter'::public.user_role]))))));

create policy "Admin and recruiters can update companies" on "public"."companies" as permissive for update to public
using ((EXISTS ( SELECT 1 FROM public.profiles WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'recruiter'::public.user_role]))))));

create policy "Admin and recruiters can view all companies" on "public"."companies" as permissive for select to public
using ((EXISTS ( SELECT 1 FROM public.profiles WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'recruiter'::public.user_role]))))));

-- applications
create policy "Admin and recruiters can view all applications" on "public"."applications" as permissive for select to public
using ((EXISTS ( SELECT 1 FROM public.profiles WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'recruiter'::public.user_role]))))));

-- application_progress
create policy "Admin and recruiters can view all application progress" on "public"."application_progress" as permissive for select to public
using ((EXISTS ( SELECT 1 FROM public.profiles WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'recruiter'::public.user_role]))))));

-- job_postings
create policy "Admin and recruiters can view all job postings" on "public"."job_postings" as permissive for select to public
using ((EXISTS ( SELECT 1 FROM public.profiles WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'recruiter'::public.user_role]))))));

-- masters
create policy "Admins can manage master areas" on "public"."master_areas" as permissive for all to authenticated
using ((EXISTS ( SELECT 1 FROM public.profiles WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::public.user_role)))));

create policy "Admins can manage master event types" on "public"."master_event_types" as permissive for all to authenticated
using ((EXISTS ( SELECT 1 FROM public.profiles WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::public.user_role)))));

create policy "Admins can manage master graduation years" on "public"."master_graduation_years" as permissive for all to authenticated
using ((EXISTS ( SELECT 1 FROM public.profiles WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::public.user_role)))));
