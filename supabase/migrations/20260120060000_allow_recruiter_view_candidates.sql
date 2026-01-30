-- candidates テーブルのポリシーを修正 (select, insert, update, delete)
drop policy "Admin and recruiters can delete candidates" on "public"."candidates";
create policy "Admin and recruiters can delete candidates"
on "public"."candidates"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'recruiter'::public.user_role]))))));

drop policy "Admin and recruiters can insert candidates" on "public"."candidates";
create policy "Admin and recruiters can insert candidates"
on "public"."candidates"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'recruiter'::public.user_role]))))));

drop policy "Admin and recruiters can update candidates" on "public"."candidates";
create policy "Admin and recruiters can update candidates"
on "public"."candidates"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'recruiter'::public.user_role]))))));

drop policy "Admin and recruiters can view all candidates" on "public"."candidates";
create policy "Admin and recruiters can view all candidates"
on "public"."candidates"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'recruiter'::public.user_role]))))));

-- companies テーブルのポリシーを修正 (select, insert, update, delete)FR
drop policy "Admin and recruiters can delete companies" on "public"."companies";
create policy "Admin and recruiters can delete companies"
on "public"."companies"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'recruiter'::public.user_role]))))));

drop policy "Admin and recruiters can insert companies" on "public"."companies";
create policy "Admin and recruiters can insert companies"
on "public"."companies"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'recruiter'::public.user_role]))))));

drop policy "Admin and recruiters can update companies" on "public"."companies";
create policy "Admin and recruiters can update companies"
on "public"."companies"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'recruiter'::public.user_role]))))));

drop policy "Admin and recruiters can view all companies" on "public"."companies";
create policy "Admin and recruiters can view all companies"
on "public"."companies"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'recruiter'::public.user_role]))))));

-- 他のテーブル (applications, application_progress, job_postings) も同様に修正
drop policy "Admin and recruiters can view all applications" on "public"."applications";
create policy "Admin and recruiters can view all applications"
on "public"."applications"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'recruiter'::public.user_role]))))));

drop policy "Admin and recruiters can view all application progress" on "public"."application_progress";
create policy "Admin and recruiters can view all application progress"
on "public"."application_progress"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'recruiter'::public.user_role]))))));

drop policy "Admin and recruiters can view all job postings" on "public"."job_postings";
create policy "Admin and recruiters can view all job postings"
on "public"."job_postings"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'recruiter'::public.user_role]))))));
