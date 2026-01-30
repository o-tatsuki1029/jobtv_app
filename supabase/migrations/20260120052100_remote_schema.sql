drop extension if exists "pg_net";

create type "public"."application_status" as enum ('applied', 'document_screening', 'first_interview', 'second_interview', 'final_interview', 'offer', 'rejected', 'withdrawn');

create type "public"."job_status" as enum ('active', 'closed');

create type "public"."user_role" as enum ('admin', 'RA', 'CA', 'MRK', 'recruiter');


  create table "public"."application_progress" (
    "id" uuid not null default gen_random_uuid(),
    "application_id" uuid not null,
    "status" public.application_status not null,
    "status_date" date not null default CURRENT_DATE,
    "notes" text,
    "created_by" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "updated_by" uuid,
    "previous_status" public.application_status
      );


alter table "public"."application_progress" enable row level security;


  create table "public"."applications" (
    "id" uuid not null default gen_random_uuid(),
    "candidate_id" uuid not null,
    "job_posting_id" uuid not null,
    "recruiter_id" uuid,
    "current_status" public.application_status not null default 'applied'::public.application_status,
    "applied_at" timestamp with time zone not null default now(),
    "notes" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."applications" enable row level security;


  create table "public"."ca_interviews" (
    "id" uuid not null default gen_random_uuid(),
    "candidate_id" uuid not null,
    "interview_date" timestamp with time zone not null,
    "interviewer_id" uuid,
    "status" text not null default 'scheduled'::text,
    "notes" text,
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid not null,
    "updated_at" timestamp with time zone not null default now(),
    "updated_by" uuid
      );


alter table "public"."ca_interviews" enable row level security;


  create table "public"."candidates" (
    "id" uuid not null default gen_random_uuid(),
    "email" text not null,
    "phone" text,
    "notes" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "graduation_year" integer,
    "assigned_to" uuid,
    "last_name" text not null,
    "first_name" text not null,
    "last_name_kana" text not null,
    "first_name_kana" text not null,
    "gender" text,
    "school_name" text default ''::text,
    "school_type" text,
    "major_field" text,
    "entry_channel" text,
    "referrer" text,
    "utm_source" text,
    "utm_medium" text,
    "utm_campaign" text,
    "utm_term" text,
    "utm_content" text,
    "desired_industry" text,
    "residence_location" text,
    "date_of_birth" date,
    "jobtv_id" text,
    "desired_job_type" text
      );


alter table "public"."candidates" enable row level security;


  create table "public"."comment_templates" (
    "id" uuid not null default gen_random_uuid(),
    "company_id" uuid not null,
    "template_text" text not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."comment_templates" enable row level security;


  create table "public"."companies" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "notes" text
      );


alter table "public"."companies" enable row level security;


  create table "public"."event_companies" (
    "id" uuid not null default gen_random_uuid(),
    "event_id" uuid not null,
    "company_id" uuid not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."event_companies" enable row level security;


  create table "public"."event_reservations" (
    "id" uuid not null default gen_random_uuid(),
    "event_id" uuid not null,
    "candidate_id" uuid not null,
    "seat_number" text,
    "status" text not null default 'reserved'::text,
    "attended" boolean not null default false,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "utm_source" text,
    "utm_medium" text,
    "utm_campaign" text,
    "utm_content" text,
    "utm_term" text,
    "referrer" text
      );


alter table "public"."event_reservations" enable row level security;


  create table "public"."events" (
    "id" uuid not null default gen_random_uuid(),
    "event_date" date not null,
    "start_time" time without time zone not null,
    "end_time" time without time zone not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "created_by" uuid,
    "event_type_id" uuid
      );


alter table "public"."events" enable row level security;


  create table "public"."job_postings" (
    "id" uuid not null default gen_random_uuid(),
    "company_id" uuid not null,
    "title" text not null,
    "description" text,
    "status" public.job_status not null default 'active'::public.job_status,
    "created_by" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "graduation_year" integer not null,
    "available_statuses" public.application_status[] not null default ARRAY['applied'::public.application_status, 'document_screening'::public.application_status, 'first_interview'::public.application_status, 'second_interview'::public.application_status, 'final_interview'::public.application_status, 'offer'::public.application_status, 'rejected'::public.application_status, 'withdrawn'::public.application_status]
      );


alter table "public"."job_postings" enable row level security;


  create table "public"."master_areas" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."master_areas" enable row level security;


  create table "public"."master_event_types" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "target_graduation_year" integer,
    "area" text
      );


alter table "public"."master_event_types" enable row level security;


  create table "public"."master_graduation_years" (
    "id" uuid not null default gen_random_uuid(),
    "year" integer not null,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."master_graduation_years" enable row level security;


  create table "public"."matching_results" (
    "id" uuid not null default gen_random_uuid(),
    "matching_session_id" uuid not null,
    "candidate_id" uuid not null,
    "company_id" uuid not null,
    "session_number" integer not null,
    "is_special_interview" boolean not null default false,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."matching_results" enable row level security;


  create table "public"."matching_sessions" (
    "id" uuid not null default gen_random_uuid(),
    "event_id" uuid not null,
    "session_count" integer not null,
    "candidate_weight" numeric(3,2) not null default 0.50,
    "company_weight" numeric(3,2) not null default 0.50,
    "status" text not null default 'pending'::text,
    "special_interviews" jsonb,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."matching_sessions" enable row level security;


  create table "public"."phone_call_list_items" (
    "id" uuid not null default gen_random_uuid(),
    "list_id" uuid not null,
    "candidate_id" uuid not null,
    "status" text not null default 'pending'::text,
    "notes" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."phone_call_list_items" enable row level security;


  create table "public"."phone_call_lists" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "description" text,
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid not null,
    "updated_at" timestamp with time zone not null default now(),
    "updated_by" uuid
      );


alter table "public"."phone_call_lists" enable row level security;


  create table "public"."phone_calls" (
    "id" uuid not null default gen_random_uuid(),
    "candidate_id" uuid not null,
    "call_date" timestamp with time zone not null,
    "caller_id" uuid,
    "call_type" text not null default 'outgoing'::text,
    "duration" integer,
    "status" text not null default 'completed'::text,
    "notes" text,
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid not null,
    "updated_at" timestamp with time zone not null default now(),
    "updated_by" uuid
      );


alter table "public"."phone_calls" enable row level security;


  create table "public"."profiles" (
    "id" uuid not null,
    "updated_at" timestamp with time zone default now(),
    "username" text,
    "full_name" text,
    "avatar_url" text,
    "website" text,
    "role" public.user_role default 'admin'::public.user_role,
    "email" text,
    "company_id" uuid,
    "last_name" text,
    "first_name" text,
    "last_name_kana" text,
    "first_name_kana" text,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."profiles" enable row level security;


  create table "public"."ratings_candidate_to_company" (
    "id" uuid not null default gen_random_uuid(),
    "event_id" uuid not null,
    "candidate_id" uuid not null,
    "company_id" uuid not null,
    "rating" integer not null,
    "comment" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."ratings_candidate_to_company" enable row level security;


  create table "public"."ratings_recruiter_to_candidate" (
    "id" uuid not null default gen_random_uuid(),
    "event_id" uuid not null,
    "candidate_id" uuid not null,
    "company_id" uuid not null,
    "recruiter_id" uuid,
    "overall_rating" integer,
    "communication_rating" integer,
    "cooperation_rating" integer,
    "logic_rating" integer,
    "creative_rating" integer,
    "initiative_rating" integer,
    "comment" text,
    "evaluator_name" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."ratings_recruiter_to_candidate" enable row level security;

CREATE UNIQUE INDEX application_progress_pkey ON public.application_progress USING btree (id);

CREATE UNIQUE INDEX applications_candidate_id_job_posting_id_key ON public.applications USING btree (candidate_id, job_posting_id);

CREATE UNIQUE INDEX applications_pkey ON public.applications USING btree (id);

CREATE UNIQUE INDEX ca_interviews_pkey ON public.ca_interviews USING btree (id);

CREATE UNIQUE INDEX candidates_pkey ON public.candidates USING btree (id);

CREATE INDEX comment_templates_company_id_idx ON public.comment_templates USING btree (company_id);

CREATE UNIQUE INDEX comment_templates_pkey ON public.comment_templates USING btree (id);

CREATE UNIQUE INDEX companies_pkey ON public.companies USING btree (id);

CREATE INDEX event_companies_company_id_idx ON public.event_companies USING btree (company_id);

CREATE UNIQUE INDEX event_companies_event_id_company_id_key ON public.event_companies USING btree (event_id, company_id);

CREATE INDEX event_companies_event_id_idx ON public.event_companies USING btree (event_id);

CREATE UNIQUE INDEX event_companies_pkey ON public.event_companies USING btree (id);

CREATE INDEX event_reservations_attended_idx ON public.event_reservations USING btree (attended);

CREATE INDEX event_reservations_candidate_id_idx ON public.event_reservations USING btree (candidate_id);

CREATE UNIQUE INDEX event_reservations_event_id_candidate_id_key ON public.event_reservations USING btree (event_id, candidate_id);

CREATE INDEX event_reservations_event_id_idx ON public.event_reservations USING btree (event_id);

CREATE UNIQUE INDEX event_reservations_pkey ON public.event_reservations USING btree (id);

CREATE INDEX events_created_at_idx ON public.events USING btree (created_at DESC);

CREATE INDEX events_event_date_idx ON public.events USING btree (event_date);

CREATE INDEX events_event_type_id_idx ON public.events USING btree (event_type_id);

CREATE UNIQUE INDEX events_pkey ON public.events USING btree (id);

CREATE INDEX idx_application_progress_application_id ON public.application_progress USING btree (application_id);

CREATE INDEX idx_application_progress_status_date ON public.application_progress USING btree (status_date);

CREATE INDEX idx_applications_candidate_id ON public.applications USING btree (candidate_id);

CREATE INDEX idx_applications_current_status ON public.applications USING btree (current_status);

CREATE INDEX idx_applications_job_posting_id ON public.applications USING btree (job_posting_id);

CREATE INDEX idx_applications_recruiter_id ON public.applications USING btree (recruiter_id);

CREATE INDEX idx_ca_interviews_candidate_id ON public.ca_interviews USING btree (candidate_id);

CREATE INDEX idx_ca_interviews_created_by ON public.ca_interviews USING btree (created_by);

CREATE INDEX idx_ca_interviews_interview_date ON public.ca_interviews USING btree (interview_date);

CREATE INDEX idx_ca_interviews_interviewer_id ON public.ca_interviews USING btree (interviewer_id);

CREATE INDEX idx_candidates_assigned_to ON public.candidates USING btree (assigned_to);

CREATE UNIQUE INDEX idx_candidates_jobtv_id ON public.candidates USING btree (jobtv_id) WHERE (jobtv_id IS NOT NULL);

CREATE INDEX idx_job_postings_company_id ON public.job_postings USING btree (company_id);

CREATE INDEX idx_job_postings_status ON public.job_postings USING btree (status);

CREATE INDEX idx_phone_call_list_items_candidate_id ON public.phone_call_list_items USING btree (candidate_id);

CREATE INDEX idx_phone_call_list_items_list_id ON public.phone_call_list_items USING btree (list_id);

CREATE INDEX idx_phone_call_list_items_status ON public.phone_call_list_items USING btree (status);

CREATE INDEX idx_phone_call_lists_created_at ON public.phone_call_lists USING btree (created_at);

CREATE INDEX idx_phone_call_lists_created_by ON public.phone_call_lists USING btree (created_by);

CREATE INDEX idx_phone_calls_call_date ON public.phone_calls USING btree (call_date);

CREATE INDEX idx_phone_calls_caller_id ON public.phone_calls USING btree (caller_id);

CREATE INDEX idx_phone_calls_candidate_id ON public.phone_calls USING btree (candidate_id);

CREATE INDEX idx_phone_calls_created_by ON public.phone_calls USING btree (created_by);

CREATE UNIQUE INDEX job_postings_pkey ON public.job_postings USING btree (id);

CREATE INDEX master_areas_is_active_idx ON public.master_areas USING btree (is_active);

CREATE UNIQUE INDEX master_areas_name_key ON public.master_areas USING btree (name);

CREATE UNIQUE INDEX master_areas_pkey ON public.master_areas USING btree (id);

CREATE INDEX master_event_types_area_idx ON public.master_event_types USING btree (area);

CREATE INDEX master_event_types_is_active_idx ON public.master_event_types USING btree (is_active);

CREATE UNIQUE INDEX master_event_types_name_key ON public.master_event_types USING btree (name);

CREATE UNIQUE INDEX master_event_types_pkey ON public.master_event_types USING btree (id);

CREATE INDEX master_event_types_target_graduation_year_idx ON public.master_event_types USING btree (target_graduation_year);

CREATE INDEX master_graduation_years_is_active_idx ON public.master_graduation_years USING btree (is_active);

CREATE UNIQUE INDEX master_graduation_years_pkey ON public.master_graduation_years USING btree (id);

CREATE UNIQUE INDEX master_graduation_years_year_key ON public.master_graduation_years USING btree (year);

CREATE INDEX matching_results_candidate_id_idx ON public.matching_results USING btree (candidate_id);

CREATE INDEX matching_results_company_id_idx ON public.matching_results USING btree (company_id);

CREATE UNIQUE INDEX matching_results_pkey ON public.matching_results USING btree (id);

CREATE INDEX matching_results_session_id_idx ON public.matching_results USING btree (matching_session_id);

CREATE INDEX matching_sessions_event_id_idx ON public.matching_sessions USING btree (event_id);

CREATE UNIQUE INDEX matching_sessions_pkey ON public.matching_sessions USING btree (id);

CREATE INDEX matching_sessions_status_idx ON public.matching_sessions USING btree (status);

CREATE UNIQUE INDEX phone_call_list_items_list_id_candidate_id_key ON public.phone_call_list_items USING btree (list_id, candidate_id);

CREATE UNIQUE INDEX phone_call_list_items_pkey ON public.phone_call_list_items USING btree (id);

CREATE UNIQUE INDEX phone_call_lists_pkey ON public.phone_call_lists USING btree (id);

CREATE UNIQUE INDEX phone_calls_pkey ON public.phone_calls USING btree (id);

CREATE INDEX profiles_company_id_idx ON public.profiles USING btree (company_id);

CREATE INDEX profiles_created_at_idx ON public.profiles USING btree (created_at);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE INDEX profiles_updated_at_idx ON public.profiles USING btree (updated_at);

CREATE UNIQUE INDEX profiles_username_key ON public.profiles USING btree (username);

CREATE INDEX ratings_candidate_to_company_candidate_id_idx ON public.ratings_candidate_to_company USING btree (candidate_id);

CREATE INDEX ratings_candidate_to_company_company_id_idx ON public.ratings_candidate_to_company USING btree (company_id);

CREATE UNIQUE INDEX ratings_candidate_to_company_event_id_candidate_id_company__key ON public.ratings_candidate_to_company USING btree (event_id, candidate_id, company_id);

CREATE INDEX ratings_candidate_to_company_event_id_idx ON public.ratings_candidate_to_company USING btree (event_id);

CREATE UNIQUE INDEX ratings_candidate_to_company_pkey ON public.ratings_candidate_to_company USING btree (id);

CREATE UNIQUE INDEX ratings_recruiter_to_candidat_event_id_candidate_id_company_key ON public.ratings_recruiter_to_candidate USING btree (event_id, candidate_id, company_id);

CREATE INDEX ratings_recruiter_to_candidate_candidate_id_idx ON public.ratings_recruiter_to_candidate USING btree (candidate_id);

CREATE INDEX ratings_recruiter_to_candidate_company_id_idx ON public.ratings_recruiter_to_candidate USING btree (company_id);

CREATE INDEX ratings_recruiter_to_candidate_event_id_idx ON public.ratings_recruiter_to_candidate USING btree (event_id);

CREATE UNIQUE INDEX ratings_recruiter_to_candidate_pkey ON public.ratings_recruiter_to_candidate USING btree (id);

alter table "public"."application_progress" add constraint "application_progress_pkey" PRIMARY KEY using index "application_progress_pkey";

alter table "public"."applications" add constraint "applications_pkey" PRIMARY KEY using index "applications_pkey";

alter table "public"."ca_interviews" add constraint "ca_interviews_pkey" PRIMARY KEY using index "ca_interviews_pkey";

alter table "public"."candidates" add constraint "candidates_pkey" PRIMARY KEY using index "candidates_pkey";

alter table "public"."comment_templates" add constraint "comment_templates_pkey" PRIMARY KEY using index "comment_templates_pkey";

alter table "public"."companies" add constraint "companies_pkey" PRIMARY KEY using index "companies_pkey";

alter table "public"."event_companies" add constraint "event_companies_pkey" PRIMARY KEY using index "event_companies_pkey";

alter table "public"."event_reservations" add constraint "event_reservations_pkey" PRIMARY KEY using index "event_reservations_pkey";

alter table "public"."events" add constraint "events_pkey" PRIMARY KEY using index "events_pkey";

alter table "public"."job_postings" add constraint "job_postings_pkey" PRIMARY KEY using index "job_postings_pkey";

alter table "public"."master_areas" add constraint "master_areas_pkey" PRIMARY KEY using index "master_areas_pkey";

alter table "public"."master_event_types" add constraint "master_event_types_pkey" PRIMARY KEY using index "master_event_types_pkey";

alter table "public"."master_graduation_years" add constraint "master_graduation_years_pkey" PRIMARY KEY using index "master_graduation_years_pkey";

alter table "public"."matching_results" add constraint "matching_results_pkey" PRIMARY KEY using index "matching_results_pkey";

alter table "public"."matching_sessions" add constraint "matching_sessions_pkey" PRIMARY KEY using index "matching_sessions_pkey";

alter table "public"."phone_call_list_items" add constraint "phone_call_list_items_pkey" PRIMARY KEY using index "phone_call_list_items_pkey";

alter table "public"."phone_call_lists" add constraint "phone_call_lists_pkey" PRIMARY KEY using index "phone_call_lists_pkey";

alter table "public"."phone_calls" add constraint "phone_calls_pkey" PRIMARY KEY using index "phone_calls_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."ratings_candidate_to_company" add constraint "ratings_candidate_to_company_pkey" PRIMARY KEY using index "ratings_candidate_to_company_pkey";

alter table "public"."ratings_recruiter_to_candidate" add constraint "ratings_recruiter_to_candidate_pkey" PRIMARY KEY using index "ratings_recruiter_to_candidate_pkey";

alter table "public"."application_progress" add constraint "application_progress_application_id_fkey" FOREIGN KEY (application_id) REFERENCES public.applications(id) ON DELETE CASCADE not valid;

alter table "public"."application_progress" validate constraint "application_progress_application_id_fkey";

alter table "public"."application_progress" add constraint "application_progress_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE RESTRICT not valid;

alter table "public"."application_progress" validate constraint "application_progress_created_by_fkey";

alter table "public"."application_progress" add constraint "application_progress_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."application_progress" validate constraint "application_progress_updated_by_fkey";

alter table "public"."applications" add constraint "applications_candidate_id_fkey" FOREIGN KEY (candidate_id) REFERENCES public.candidates(id) ON DELETE CASCADE not valid;

alter table "public"."applications" validate constraint "applications_candidate_id_fkey";

alter table "public"."applications" add constraint "applications_candidate_id_job_posting_id_key" UNIQUE using index "applications_candidate_id_job_posting_id_key";

alter table "public"."applications" add constraint "applications_job_posting_id_fkey" FOREIGN KEY (job_posting_id) REFERENCES public.job_postings(id) ON DELETE CASCADE not valid;

alter table "public"."applications" validate constraint "applications_job_posting_id_fkey";

alter table "public"."applications" add constraint "applications_recruiter_id_fkey" FOREIGN KEY (recruiter_id) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."applications" validate constraint "applications_recruiter_id_fkey";

alter table "public"."ca_interviews" add constraint "ca_interviews_candidate_id_fkey" FOREIGN KEY (candidate_id) REFERENCES public.candidates(id) ON DELETE CASCADE not valid;

alter table "public"."ca_interviews" validate constraint "ca_interviews_candidate_id_fkey";

alter table "public"."ca_interviews" add constraint "ca_interviews_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."ca_interviews" validate constraint "ca_interviews_created_by_fkey";

alter table "public"."ca_interviews" add constraint "ca_interviews_interviewer_id_fkey" FOREIGN KEY (interviewer_id) REFERENCES public.profiles(id) not valid;

alter table "public"."ca_interviews" validate constraint "ca_interviews_interviewer_id_fkey";

alter table "public"."ca_interviews" add constraint "ca_interviews_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES public.profiles(id) not valid;

alter table "public"."ca_interviews" validate constraint "ca_interviews_updated_by_fkey";

alter table "public"."candidates" add constraint "candidates_assigned_to_fkey" FOREIGN KEY (assigned_to) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."candidates" validate constraint "candidates_assigned_to_fkey";

alter table "public"."comment_templates" add constraint "comment_templates_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE not valid;

alter table "public"."comment_templates" validate constraint "comment_templates_company_id_fkey";

alter table "public"."event_companies" add constraint "event_companies_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE not valid;

alter table "public"."event_companies" validate constraint "event_companies_company_id_fkey";

alter table "public"."event_companies" add constraint "event_companies_event_id_company_id_key" UNIQUE using index "event_companies_event_id_company_id_key";

alter table "public"."event_companies" add constraint "event_companies_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE not valid;

alter table "public"."event_companies" validate constraint "event_companies_event_id_fkey";

alter table "public"."event_reservations" add constraint "event_reservations_candidate_id_fkey" FOREIGN KEY (candidate_id) REFERENCES public.candidates(id) ON DELETE CASCADE not valid;

alter table "public"."event_reservations" validate constraint "event_reservations_candidate_id_fkey";

alter table "public"."event_reservations" add constraint "event_reservations_event_id_candidate_id_key" UNIQUE using index "event_reservations_event_id_candidate_id_key";

alter table "public"."event_reservations" add constraint "event_reservations_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE not valid;

alter table "public"."event_reservations" validate constraint "event_reservations_event_id_fkey";

alter table "public"."events" add constraint "events_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."events" validate constraint "events_created_by_fkey";

alter table "public"."events" add constraint "events_event_type_id_fkey" FOREIGN KEY (event_type_id) REFERENCES public.master_event_types(id) ON DELETE SET NULL not valid;

alter table "public"."events" validate constraint "events_event_type_id_fkey";

alter table "public"."job_postings" add constraint "job_postings_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE not valid;

alter table "public"."job_postings" validate constraint "job_postings_company_id_fkey";

alter table "public"."job_postings" add constraint "job_postings_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE RESTRICT not valid;

alter table "public"."job_postings" validate constraint "job_postings_created_by_fkey";

alter table "public"."master_areas" add constraint "master_areas_name_key" UNIQUE using index "master_areas_name_key";

alter table "public"."master_event_types" add constraint "master_event_types_area_fkey" FOREIGN KEY (area) REFERENCES public.master_areas(name) ON DELETE SET NULL not valid;

alter table "public"."master_event_types" validate constraint "master_event_types_area_fkey";

alter table "public"."master_event_types" add constraint "master_event_types_name_key" UNIQUE using index "master_event_types_name_key";

alter table "public"."master_event_types" add constraint "master_event_types_target_graduation_year_fkey" FOREIGN KEY (target_graduation_year) REFERENCES public.master_graduation_years(year) ON DELETE SET NULL not valid;

alter table "public"."master_event_types" validate constraint "master_event_types_target_graduation_year_fkey";

alter table "public"."master_graduation_years" add constraint "master_graduation_years_year_key" UNIQUE using index "master_graduation_years_year_key";

alter table "public"."matching_results" add constraint "matching_results_candidate_id_fkey" FOREIGN KEY (candidate_id) REFERENCES public.candidates(id) ON DELETE CASCADE not valid;

alter table "public"."matching_results" validate constraint "matching_results_candidate_id_fkey";

alter table "public"."matching_results" add constraint "matching_results_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE not valid;

alter table "public"."matching_results" validate constraint "matching_results_company_id_fkey";

alter table "public"."matching_results" add constraint "matching_results_matching_session_id_fkey" FOREIGN KEY (matching_session_id) REFERENCES public.matching_sessions(id) ON DELETE CASCADE not valid;

alter table "public"."matching_results" validate constraint "matching_results_matching_session_id_fkey";

alter table "public"."matching_sessions" add constraint "matching_sessions_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE not valid;

alter table "public"."matching_sessions" validate constraint "matching_sessions_event_id_fkey";

alter table "public"."phone_call_list_items" add constraint "phone_call_list_items_candidate_id_fkey" FOREIGN KEY (candidate_id) REFERENCES public.candidates(id) ON DELETE CASCADE not valid;

alter table "public"."phone_call_list_items" validate constraint "phone_call_list_items_candidate_id_fkey";

alter table "public"."phone_call_list_items" add constraint "phone_call_list_items_list_id_candidate_id_key" UNIQUE using index "phone_call_list_items_list_id_candidate_id_key";

alter table "public"."phone_call_list_items" add constraint "phone_call_list_items_list_id_fkey" FOREIGN KEY (list_id) REFERENCES public.phone_call_lists(id) ON DELETE CASCADE not valid;

alter table "public"."phone_call_list_items" validate constraint "phone_call_list_items_list_id_fkey";

alter table "public"."phone_call_lists" add constraint "phone_call_lists_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."phone_call_lists" validate constraint "phone_call_lists_created_by_fkey";

alter table "public"."phone_call_lists" add constraint "phone_call_lists_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES public.profiles(id) not valid;

alter table "public"."phone_call_lists" validate constraint "phone_call_lists_updated_by_fkey";

alter table "public"."phone_calls" add constraint "phone_calls_caller_id_fkey" FOREIGN KEY (caller_id) REFERENCES public.profiles(id) not valid;

alter table "public"."phone_calls" validate constraint "phone_calls_caller_id_fkey";

alter table "public"."phone_calls" add constraint "phone_calls_candidate_id_fkey" FOREIGN KEY (candidate_id) REFERENCES public.candidates(id) ON DELETE CASCADE not valid;

alter table "public"."phone_calls" validate constraint "phone_calls_candidate_id_fkey";

alter table "public"."phone_calls" add constraint "phone_calls_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."phone_calls" validate constraint "phone_calls_created_by_fkey";

alter table "public"."phone_calls" add constraint "phone_calls_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES public.profiles(id) not valid;

alter table "public"."phone_calls" validate constraint "phone_calls_updated_by_fkey";

alter table "public"."profiles" add constraint "profiles_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE SET NULL not valid;

alter table "public"."profiles" validate constraint "profiles_company_id_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_username_key" UNIQUE using index "profiles_username_key";

alter table "public"."profiles" add constraint "username_length" CHECK ((char_length(username) >= 3)) not valid;

alter table "public"."profiles" validate constraint "username_length";

alter table "public"."ratings_candidate_to_company" add constraint "ratings_candidate_to_company_candidate_id_fkey" FOREIGN KEY (candidate_id) REFERENCES public.candidates(id) ON DELETE CASCADE not valid;

alter table "public"."ratings_candidate_to_company" validate constraint "ratings_candidate_to_company_candidate_id_fkey";

alter table "public"."ratings_candidate_to_company" add constraint "ratings_candidate_to_company_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE not valid;

alter table "public"."ratings_candidate_to_company" validate constraint "ratings_candidate_to_company_company_id_fkey";

alter table "public"."ratings_candidate_to_company" add constraint "ratings_candidate_to_company_event_id_candidate_id_company__key" UNIQUE using index "ratings_candidate_to_company_event_id_candidate_id_company__key";

alter table "public"."ratings_candidate_to_company" add constraint "ratings_candidate_to_company_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE not valid;

alter table "public"."ratings_candidate_to_company" validate constraint "ratings_candidate_to_company_event_id_fkey";

alter table "public"."ratings_candidate_to_company" add constraint "ratings_candidate_to_company_rating_check" CHECK (((rating >= 1) AND (rating <= 5))) not valid;

alter table "public"."ratings_candidate_to_company" validate constraint "ratings_candidate_to_company_rating_check";

alter table "public"."ratings_recruiter_to_candidate" add constraint "ratings_recruiter_to_candidat_event_id_candidate_id_company_key" UNIQUE using index "ratings_recruiter_to_candidat_event_id_candidate_id_company_key";

alter table "public"."ratings_recruiter_to_candidate" add constraint "ratings_recruiter_to_candidate_candidate_id_fkey" FOREIGN KEY (candidate_id) REFERENCES public.candidates(id) ON DELETE CASCADE not valid;

alter table "public"."ratings_recruiter_to_candidate" validate constraint "ratings_recruiter_to_candidate_candidate_id_fkey";

alter table "public"."ratings_recruiter_to_candidate" add constraint "ratings_recruiter_to_candidate_communication_rating_check" CHECK (((communication_rating >= 1) AND (communication_rating <= 5))) not valid;

alter table "public"."ratings_recruiter_to_candidate" validate constraint "ratings_recruiter_to_candidate_communication_rating_check";

alter table "public"."ratings_recruiter_to_candidate" add constraint "ratings_recruiter_to_candidate_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE not valid;

alter table "public"."ratings_recruiter_to_candidate" validate constraint "ratings_recruiter_to_candidate_company_id_fkey";

alter table "public"."ratings_recruiter_to_candidate" add constraint "ratings_recruiter_to_candidate_cooperation_rating_check" CHECK (((cooperation_rating >= 1) AND (cooperation_rating <= 5))) not valid;

alter table "public"."ratings_recruiter_to_candidate" validate constraint "ratings_recruiter_to_candidate_cooperation_rating_check";

alter table "public"."ratings_recruiter_to_candidate" add constraint "ratings_recruiter_to_candidate_creative_rating_check" CHECK (((creative_rating >= 1) AND (creative_rating <= 5))) not valid;

alter table "public"."ratings_recruiter_to_candidate" validate constraint "ratings_recruiter_to_candidate_creative_rating_check";

alter table "public"."ratings_recruiter_to_candidate" add constraint "ratings_recruiter_to_candidate_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE not valid;

alter table "public"."ratings_recruiter_to_candidate" validate constraint "ratings_recruiter_to_candidate_event_id_fkey";

alter table "public"."ratings_recruiter_to_candidate" add constraint "ratings_recruiter_to_candidate_initiative_rating_check" CHECK (((initiative_rating >= 1) AND (initiative_rating <= 5))) not valid;

alter table "public"."ratings_recruiter_to_candidate" validate constraint "ratings_recruiter_to_candidate_initiative_rating_check";

alter table "public"."ratings_recruiter_to_candidate" add constraint "ratings_recruiter_to_candidate_logic_rating_check" CHECK (((logic_rating >= 1) AND (logic_rating <= 5))) not valid;

alter table "public"."ratings_recruiter_to_candidate" validate constraint "ratings_recruiter_to_candidate_logic_rating_check";

alter table "public"."ratings_recruiter_to_candidate" add constraint "ratings_recruiter_to_candidate_overall_rating_check" CHECK (((overall_rating >= 1) AND (overall_rating <= 4))) not valid;

alter table "public"."ratings_recruiter_to_candidate" validate constraint "ratings_recruiter_to_candidate_overall_rating_check";

alter table "public"."ratings_recruiter_to_candidate" add constraint "ratings_recruiter_to_candidate_recruiter_id_fkey" FOREIGN KEY (recruiter_id) REFERENCES public.profiles(id) not valid;

alter table "public"."ratings_recruiter_to_candidate" validate constraint "ratings_recruiter_to_candidate_recruiter_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_candidate_attended_event(p_event_id uuid, p_candidate_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.event_reservations
    WHERE event_id = p_event_id
      AND candidate_id = p_candidate_id
      AND attended = true
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.check_candidate_in_company_event(p_candidate_id uuid, p_company_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.event_reservations er
    INNER JOIN public.event_companies ec ON er.event_id = ec.event_id
    WHERE er.candidate_id = p_candidate_id
      AND ec.company_id = p_company_id
      AND er.attended = true
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.check_company_in_event(p_event_id uuid, p_company_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.event_companies
    WHERE event_id = p_event_id
      AND company_id = p_company_id
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  existing_role public.user_role;
  user_role_value public.user_role;
BEGIN
  -- profilesテーブルに同じメールアドレスの既存レコードがあるか確認
  -- リクルーター作成時に先にprofilesに登録されている場合があるため
  BEGIN
    SELECT role INTO existing_role
    FROM public.profiles
    WHERE email = NEW.email
    LIMIT 1;
  EXCEPTION
    WHEN OTHERS THEN
      -- エラーが発生した場合は既存ロールなしとして扱う
      existing_role := NULL;
  END;
  
  -- 既存のroleがある場合はそれを使用、なければデフォルト値（'admin'）を使用
  -- user_metadataは参照しない（profiles.roleを唯一の情報源とする）
  user_role_value := COALESCE(
    existing_role,
    'admin'::public.user_role
  );
  
  -- profilesテーブルにINSERT
  -- created_atはDEFAULT値があるため、明示的に設定しない
  -- updated_atのみ明示的に設定
  BEGIN
    INSERT INTO public.profiles (id, email, role, updated_at)
    VALUES (
      NEW.id,
      NEW.email,
      user_role_value,
      NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET email = NEW.email,
        role = user_role_value,  -- 既存のroleを保持せず、常に新しい値を設定
        updated_at = NOW();
  EXCEPTION
    WHEN OTHERS THEN
      -- エラーをログに記録（詳細なエラー情報を含む）
      RAISE WARNING 'handle_new_user trigger error for user % (email: %): % (SQLSTATE: %)', 
        NEW.id, 
        NEW.email, 
        SQLERRM, 
        SQLSTATE;
      -- エラーが発生してもauth.usersの作成は続行する
  END;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- 最上位のエラーハンドリング（関数全体でエラーが発生した場合）
    RAISE WARNING 'handle_new_user trigger fatal error for user % (email: %): % (SQLSTATE: %)', 
      NEW.id, 
      NEW.email, 
      SQLERRM, 
      SQLSTATE;
    -- エラーが発生してもauth.usersの作成は続行する
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_application_progress_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_ca_interviews_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_phone_call_list_items_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_phone_call_lists_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_phone_calls_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."application_progress" to "anon";

grant insert on table "public"."application_progress" to "anon";

grant references on table "public"."application_progress" to "anon";

grant select on table "public"."application_progress" to "anon";

grant trigger on table "public"."application_progress" to "anon";

grant truncate on table "public"."application_progress" to "anon";

grant update on table "public"."application_progress" to "anon";

grant delete on table "public"."application_progress" to "authenticated";

grant insert on table "public"."application_progress" to "authenticated";

grant references on table "public"."application_progress" to "authenticated";

grant select on table "public"."application_progress" to "authenticated";

grant trigger on table "public"."application_progress" to "authenticated";

grant truncate on table "public"."application_progress" to "authenticated";

grant update on table "public"."application_progress" to "authenticated";

grant delete on table "public"."application_progress" to "service_role";

grant insert on table "public"."application_progress" to "service_role";

grant references on table "public"."application_progress" to "service_role";

grant select on table "public"."application_progress" to "service_role";

grant trigger on table "public"."application_progress" to "service_role";

grant truncate on table "public"."application_progress" to "service_role";

grant update on table "public"."application_progress" to "service_role";

grant delete on table "public"."applications" to "anon";

grant insert on table "public"."applications" to "anon";

grant references on table "public"."applications" to "anon";

grant select on table "public"."applications" to "anon";

grant trigger on table "public"."applications" to "anon";

grant truncate on table "public"."applications" to "anon";

grant update on table "public"."applications" to "anon";

grant delete on table "public"."applications" to "authenticated";

grant insert on table "public"."applications" to "authenticated";

grant references on table "public"."applications" to "authenticated";

grant select on table "public"."applications" to "authenticated";

grant trigger on table "public"."applications" to "authenticated";

grant truncate on table "public"."applications" to "authenticated";

grant update on table "public"."applications" to "authenticated";

grant delete on table "public"."applications" to "service_role";

grant insert on table "public"."applications" to "service_role";

grant references on table "public"."applications" to "service_role";

grant select on table "public"."applications" to "service_role";

grant trigger on table "public"."applications" to "service_role";

grant truncate on table "public"."applications" to "service_role";

grant update on table "public"."applications" to "service_role";

grant delete on table "public"."ca_interviews" to "anon";

grant insert on table "public"."ca_interviews" to "anon";

grant references on table "public"."ca_interviews" to "anon";

grant select on table "public"."ca_interviews" to "anon";

grant trigger on table "public"."ca_interviews" to "anon";

grant truncate on table "public"."ca_interviews" to "anon";

grant update on table "public"."ca_interviews" to "anon";

grant delete on table "public"."ca_interviews" to "authenticated";

grant insert on table "public"."ca_interviews" to "authenticated";

grant references on table "public"."ca_interviews" to "authenticated";

grant select on table "public"."ca_interviews" to "authenticated";

grant trigger on table "public"."ca_interviews" to "authenticated";

grant truncate on table "public"."ca_interviews" to "authenticated";

grant update on table "public"."ca_interviews" to "authenticated";

grant delete on table "public"."ca_interviews" to "service_role";

grant insert on table "public"."ca_interviews" to "service_role";

grant references on table "public"."ca_interviews" to "service_role";

grant select on table "public"."ca_interviews" to "service_role";

grant trigger on table "public"."ca_interviews" to "service_role";

grant truncate on table "public"."ca_interviews" to "service_role";

grant update on table "public"."ca_interviews" to "service_role";

grant delete on table "public"."candidates" to "anon";

grant insert on table "public"."candidates" to "anon";

grant references on table "public"."candidates" to "anon";

grant select on table "public"."candidates" to "anon";

grant trigger on table "public"."candidates" to "anon";

grant truncate on table "public"."candidates" to "anon";

grant update on table "public"."candidates" to "anon";

grant delete on table "public"."candidates" to "authenticated";

grant insert on table "public"."candidates" to "authenticated";

grant references on table "public"."candidates" to "authenticated";

grant select on table "public"."candidates" to "authenticated";

grant trigger on table "public"."candidates" to "authenticated";

grant truncate on table "public"."candidates" to "authenticated";

grant update on table "public"."candidates" to "authenticated";

grant delete on table "public"."candidates" to "service_role";

grant insert on table "public"."candidates" to "service_role";

grant references on table "public"."candidates" to "service_role";

grant select on table "public"."candidates" to "service_role";

grant trigger on table "public"."candidates" to "service_role";

grant truncate on table "public"."candidates" to "service_role";

grant update on table "public"."candidates" to "service_role";

grant delete on table "public"."comment_templates" to "anon";

grant insert on table "public"."comment_templates" to "anon";

grant references on table "public"."comment_templates" to "anon";

grant select on table "public"."comment_templates" to "anon";

grant trigger on table "public"."comment_templates" to "anon";

grant truncate on table "public"."comment_templates" to "anon";

grant update on table "public"."comment_templates" to "anon";

grant delete on table "public"."comment_templates" to "authenticated";

grant insert on table "public"."comment_templates" to "authenticated";

grant references on table "public"."comment_templates" to "authenticated";

grant select on table "public"."comment_templates" to "authenticated";

grant trigger on table "public"."comment_templates" to "authenticated";

grant truncate on table "public"."comment_templates" to "authenticated";

grant update on table "public"."comment_templates" to "authenticated";

grant delete on table "public"."comment_templates" to "service_role";

grant insert on table "public"."comment_templates" to "service_role";

grant references on table "public"."comment_templates" to "service_role";

grant select on table "public"."comment_templates" to "service_role";

grant trigger on table "public"."comment_templates" to "service_role";

grant truncate on table "public"."comment_templates" to "service_role";

grant update on table "public"."comment_templates" to "service_role";

grant delete on table "public"."companies" to "anon";

grant insert on table "public"."companies" to "anon";

grant references on table "public"."companies" to "anon";

grant select on table "public"."companies" to "anon";

grant trigger on table "public"."companies" to "anon";

grant truncate on table "public"."companies" to "anon";

grant update on table "public"."companies" to "anon";

grant delete on table "public"."companies" to "authenticated";

grant insert on table "public"."companies" to "authenticated";

grant references on table "public"."companies" to "authenticated";

grant select on table "public"."companies" to "authenticated";

grant trigger on table "public"."companies" to "authenticated";

grant truncate on table "public"."companies" to "authenticated";

grant update on table "public"."companies" to "authenticated";

grant delete on table "public"."companies" to "service_role";

grant insert on table "public"."companies" to "service_role";

grant references on table "public"."companies" to "service_role";

grant select on table "public"."companies" to "service_role";

grant trigger on table "public"."companies" to "service_role";

grant truncate on table "public"."companies" to "service_role";

grant update on table "public"."companies" to "service_role";

grant delete on table "public"."event_companies" to "anon";

grant insert on table "public"."event_companies" to "anon";

grant references on table "public"."event_companies" to "anon";

grant select on table "public"."event_companies" to "anon";

grant trigger on table "public"."event_companies" to "anon";

grant truncate on table "public"."event_companies" to "anon";

grant update on table "public"."event_companies" to "anon";

grant delete on table "public"."event_companies" to "authenticated";

grant insert on table "public"."event_companies" to "authenticated";

grant references on table "public"."event_companies" to "authenticated";

grant select on table "public"."event_companies" to "authenticated";

grant trigger on table "public"."event_companies" to "authenticated";

grant truncate on table "public"."event_companies" to "authenticated";

grant update on table "public"."event_companies" to "authenticated";

grant delete on table "public"."event_companies" to "service_role";

grant insert on table "public"."event_companies" to "service_role";

grant references on table "public"."event_companies" to "service_role";

grant select on table "public"."event_companies" to "service_role";

grant trigger on table "public"."event_companies" to "service_role";

grant truncate on table "public"."event_companies" to "service_role";

grant update on table "public"."event_companies" to "service_role";

grant delete on table "public"."event_reservations" to "anon";

grant insert on table "public"."event_reservations" to "anon";

grant references on table "public"."event_reservations" to "anon";

grant select on table "public"."event_reservations" to "anon";

grant trigger on table "public"."event_reservations" to "anon";

grant truncate on table "public"."event_reservations" to "anon";

grant update on table "public"."event_reservations" to "anon";

grant delete on table "public"."event_reservations" to "authenticated";

grant insert on table "public"."event_reservations" to "authenticated";

grant references on table "public"."event_reservations" to "authenticated";

grant select on table "public"."event_reservations" to "authenticated";

grant trigger on table "public"."event_reservations" to "authenticated";

grant truncate on table "public"."event_reservations" to "authenticated";

grant update on table "public"."event_reservations" to "authenticated";

grant delete on table "public"."event_reservations" to "service_role";

grant insert on table "public"."event_reservations" to "service_role";

grant references on table "public"."event_reservations" to "service_role";

grant select on table "public"."event_reservations" to "service_role";

grant trigger on table "public"."event_reservations" to "service_role";

grant truncate on table "public"."event_reservations" to "service_role";

grant update on table "public"."event_reservations" to "service_role";

grant delete on table "public"."events" to "anon";

grant insert on table "public"."events" to "anon";

grant references on table "public"."events" to "anon";

grant select on table "public"."events" to "anon";

grant trigger on table "public"."events" to "anon";

grant truncate on table "public"."events" to "anon";

grant update on table "public"."events" to "anon";

grant delete on table "public"."events" to "authenticated";

grant insert on table "public"."events" to "authenticated";

grant references on table "public"."events" to "authenticated";

grant select on table "public"."events" to "authenticated";

grant trigger on table "public"."events" to "authenticated";

grant truncate on table "public"."events" to "authenticated";

grant update on table "public"."events" to "authenticated";

grant delete on table "public"."events" to "service_role";

grant insert on table "public"."events" to "service_role";

grant references on table "public"."events" to "service_role";

grant select on table "public"."events" to "service_role";

grant trigger on table "public"."events" to "service_role";

grant truncate on table "public"."events" to "service_role";

grant update on table "public"."events" to "service_role";

grant delete on table "public"."job_postings" to "anon";

grant insert on table "public"."job_postings" to "anon";

grant references on table "public"."job_postings" to "anon";

grant select on table "public"."job_postings" to "anon";

grant trigger on table "public"."job_postings" to "anon";

grant truncate on table "public"."job_postings" to "anon";

grant update on table "public"."job_postings" to "anon";

grant delete on table "public"."job_postings" to "authenticated";

grant insert on table "public"."job_postings" to "authenticated";

grant references on table "public"."job_postings" to "authenticated";

grant select on table "public"."job_postings" to "authenticated";

grant trigger on table "public"."job_postings" to "authenticated";

grant truncate on table "public"."job_postings" to "authenticated";

grant update on table "public"."job_postings" to "authenticated";

grant delete on table "public"."job_postings" to "service_role";

grant insert on table "public"."job_postings" to "service_role";

grant references on table "public"."job_postings" to "service_role";

grant select on table "public"."job_postings" to "service_role";

grant trigger on table "public"."job_postings" to "service_role";

grant truncate on table "public"."job_postings" to "service_role";

grant update on table "public"."job_postings" to "service_role";

grant delete on table "public"."master_areas" to "anon";

grant insert on table "public"."master_areas" to "anon";

grant references on table "public"."master_areas" to "anon";

grant select on table "public"."master_areas" to "anon";

grant trigger on table "public"."master_areas" to "anon";

grant truncate on table "public"."master_areas" to "anon";

grant update on table "public"."master_areas" to "anon";

grant delete on table "public"."master_areas" to "authenticated";

grant insert on table "public"."master_areas" to "authenticated";

grant references on table "public"."master_areas" to "authenticated";

grant select on table "public"."master_areas" to "authenticated";

grant trigger on table "public"."master_areas" to "authenticated";

grant truncate on table "public"."master_areas" to "authenticated";

grant update on table "public"."master_areas" to "authenticated";

grant delete on table "public"."master_areas" to "service_role";

grant insert on table "public"."master_areas" to "service_role";

grant references on table "public"."master_areas" to "service_role";

grant select on table "public"."master_areas" to "service_role";

grant trigger on table "public"."master_areas" to "service_role";

grant truncate on table "public"."master_areas" to "service_role";

grant update on table "public"."master_areas" to "service_role";

grant delete on table "public"."master_event_types" to "anon";

grant insert on table "public"."master_event_types" to "anon";

grant references on table "public"."master_event_types" to "anon";

grant select on table "public"."master_event_types" to "anon";

grant trigger on table "public"."master_event_types" to "anon";

grant truncate on table "public"."master_event_types" to "anon";

grant update on table "public"."master_event_types" to "anon";

grant delete on table "public"."master_event_types" to "authenticated";

grant insert on table "public"."master_event_types" to "authenticated";

grant references on table "public"."master_event_types" to "authenticated";

grant select on table "public"."master_event_types" to "authenticated";

grant trigger on table "public"."master_event_types" to "authenticated";

grant truncate on table "public"."master_event_types" to "authenticated";

grant update on table "public"."master_event_types" to "authenticated";

grant delete on table "public"."master_event_types" to "service_role";

grant insert on table "public"."master_event_types" to "service_role";

grant references on table "public"."master_event_types" to "service_role";

grant select on table "public"."master_event_types" to "service_role";

grant trigger on table "public"."master_event_types" to "service_role";

grant truncate on table "public"."master_event_types" to "service_role";

grant update on table "public"."master_event_types" to "service_role";

grant delete on table "public"."master_graduation_years" to "anon";

grant insert on table "public"."master_graduation_years" to "anon";

grant references on table "public"."master_graduation_years" to "anon";

grant select on table "public"."master_graduation_years" to "anon";

grant trigger on table "public"."master_graduation_years" to "anon";

grant truncate on table "public"."master_graduation_years" to "anon";

grant update on table "public"."master_graduation_years" to "anon";

grant delete on table "public"."master_graduation_years" to "authenticated";

grant insert on table "public"."master_graduation_years" to "authenticated";

grant references on table "public"."master_graduation_years" to "authenticated";

grant select on table "public"."master_graduation_years" to "authenticated";

grant trigger on table "public"."master_graduation_years" to "authenticated";

grant truncate on table "public"."master_graduation_years" to "authenticated";

grant update on table "public"."master_graduation_years" to "authenticated";

grant delete on table "public"."master_graduation_years" to "service_role";

grant insert on table "public"."master_graduation_years" to "service_role";

grant references on table "public"."master_graduation_years" to "service_role";

grant select on table "public"."master_graduation_years" to "service_role";

grant trigger on table "public"."master_graduation_years" to "service_role";

grant truncate on table "public"."master_graduation_years" to "service_role";

grant update on table "public"."master_graduation_years" to "service_role";

grant delete on table "public"."matching_results" to "anon";

grant insert on table "public"."matching_results" to "anon";

grant references on table "public"."matching_results" to "anon";

grant select on table "public"."matching_results" to "anon";

grant trigger on table "public"."matching_results" to "anon";

grant truncate on table "public"."matching_results" to "anon";

grant update on table "public"."matching_results" to "anon";

grant delete on table "public"."matching_results" to "authenticated";

grant insert on table "public"."matching_results" to "authenticated";

grant references on table "public"."matching_results" to "authenticated";

grant select on table "public"."matching_results" to "authenticated";

grant trigger on table "public"."matching_results" to "authenticated";

grant truncate on table "public"."matching_results" to "authenticated";

grant update on table "public"."matching_results" to "authenticated";

grant delete on table "public"."matching_results" to "service_role";

grant insert on table "public"."matching_results" to "service_role";

grant references on table "public"."matching_results" to "service_role";

grant select on table "public"."matching_results" to "service_role";

grant trigger on table "public"."matching_results" to "service_role";

grant truncate on table "public"."matching_results" to "service_role";

grant update on table "public"."matching_results" to "service_role";

grant delete on table "public"."matching_sessions" to "anon";

grant insert on table "public"."matching_sessions" to "anon";

grant references on table "public"."matching_sessions" to "anon";

grant select on table "public"."matching_sessions" to "anon";

grant trigger on table "public"."matching_sessions" to "anon";

grant truncate on table "public"."matching_sessions" to "anon";

grant update on table "public"."matching_sessions" to "anon";

grant delete on table "public"."matching_sessions" to "authenticated";

grant insert on table "public"."matching_sessions" to "authenticated";

grant references on table "public"."matching_sessions" to "authenticated";

grant select on table "public"."matching_sessions" to "authenticated";

grant trigger on table "public"."matching_sessions" to "authenticated";

grant truncate on table "public"."matching_sessions" to "authenticated";

grant update on table "public"."matching_sessions" to "authenticated";

grant delete on table "public"."matching_sessions" to "service_role";

grant insert on table "public"."matching_sessions" to "service_role";

grant references on table "public"."matching_sessions" to "service_role";

grant select on table "public"."matching_sessions" to "service_role";

grant trigger on table "public"."matching_sessions" to "service_role";

grant truncate on table "public"."matching_sessions" to "service_role";

grant update on table "public"."matching_sessions" to "service_role";

grant delete on table "public"."phone_call_list_items" to "anon";

grant insert on table "public"."phone_call_list_items" to "anon";

grant references on table "public"."phone_call_list_items" to "anon";

grant select on table "public"."phone_call_list_items" to "anon";

grant trigger on table "public"."phone_call_list_items" to "anon";

grant truncate on table "public"."phone_call_list_items" to "anon";

grant update on table "public"."phone_call_list_items" to "anon";

grant delete on table "public"."phone_call_list_items" to "authenticated";

grant insert on table "public"."phone_call_list_items" to "authenticated";

grant references on table "public"."phone_call_list_items" to "authenticated";

grant select on table "public"."phone_call_list_items" to "authenticated";

grant trigger on table "public"."phone_call_list_items" to "authenticated";

grant truncate on table "public"."phone_call_list_items" to "authenticated";

grant update on table "public"."phone_call_list_items" to "authenticated";

grant delete on table "public"."phone_call_list_items" to "service_role";

grant insert on table "public"."phone_call_list_items" to "service_role";

grant references on table "public"."phone_call_list_items" to "service_role";

grant select on table "public"."phone_call_list_items" to "service_role";

grant trigger on table "public"."phone_call_list_items" to "service_role";

grant truncate on table "public"."phone_call_list_items" to "service_role";

grant update on table "public"."phone_call_list_items" to "service_role";

grant delete on table "public"."phone_call_lists" to "anon";

grant insert on table "public"."phone_call_lists" to "anon";

grant references on table "public"."phone_call_lists" to "anon";

grant select on table "public"."phone_call_lists" to "anon";

grant trigger on table "public"."phone_call_lists" to "anon";

grant truncate on table "public"."phone_call_lists" to "anon";

grant update on table "public"."phone_call_lists" to "anon";

grant delete on table "public"."phone_call_lists" to "authenticated";

grant insert on table "public"."phone_call_lists" to "authenticated";

grant references on table "public"."phone_call_lists" to "authenticated";

grant select on table "public"."phone_call_lists" to "authenticated";

grant trigger on table "public"."phone_call_lists" to "authenticated";

grant truncate on table "public"."phone_call_lists" to "authenticated";

grant update on table "public"."phone_call_lists" to "authenticated";

grant delete on table "public"."phone_call_lists" to "service_role";

grant insert on table "public"."phone_call_lists" to "service_role";

grant references on table "public"."phone_call_lists" to "service_role";

grant select on table "public"."phone_call_lists" to "service_role";

grant trigger on table "public"."phone_call_lists" to "service_role";

grant truncate on table "public"."phone_call_lists" to "service_role";

grant update on table "public"."phone_call_lists" to "service_role";

grant delete on table "public"."phone_calls" to "anon";

grant insert on table "public"."phone_calls" to "anon";

grant references on table "public"."phone_calls" to "anon";

grant select on table "public"."phone_calls" to "anon";

grant trigger on table "public"."phone_calls" to "anon";

grant truncate on table "public"."phone_calls" to "anon";

grant update on table "public"."phone_calls" to "anon";

grant delete on table "public"."phone_calls" to "authenticated";

grant insert on table "public"."phone_calls" to "authenticated";

grant references on table "public"."phone_calls" to "authenticated";

grant select on table "public"."phone_calls" to "authenticated";

grant trigger on table "public"."phone_calls" to "authenticated";

grant truncate on table "public"."phone_calls" to "authenticated";

grant update on table "public"."phone_calls" to "authenticated";

grant delete on table "public"."phone_calls" to "service_role";

grant insert on table "public"."phone_calls" to "service_role";

grant references on table "public"."phone_calls" to "service_role";

grant select on table "public"."phone_calls" to "service_role";

grant trigger on table "public"."phone_calls" to "service_role";

grant truncate on table "public"."phone_calls" to "service_role";

grant update on table "public"."phone_calls" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."ratings_candidate_to_company" to "anon";

grant insert on table "public"."ratings_candidate_to_company" to "anon";

grant references on table "public"."ratings_candidate_to_company" to "anon";

grant select on table "public"."ratings_candidate_to_company" to "anon";

grant trigger on table "public"."ratings_candidate_to_company" to "anon";

grant truncate on table "public"."ratings_candidate_to_company" to "anon";

grant update on table "public"."ratings_candidate_to_company" to "anon";

grant delete on table "public"."ratings_candidate_to_company" to "authenticated";

grant insert on table "public"."ratings_candidate_to_company" to "authenticated";

grant references on table "public"."ratings_candidate_to_company" to "authenticated";

grant select on table "public"."ratings_candidate_to_company" to "authenticated";

grant trigger on table "public"."ratings_candidate_to_company" to "authenticated";

grant truncate on table "public"."ratings_candidate_to_company" to "authenticated";

grant update on table "public"."ratings_candidate_to_company" to "authenticated";

grant delete on table "public"."ratings_candidate_to_company" to "service_role";

grant insert on table "public"."ratings_candidate_to_company" to "service_role";

grant references on table "public"."ratings_candidate_to_company" to "service_role";

grant select on table "public"."ratings_candidate_to_company" to "service_role";

grant trigger on table "public"."ratings_candidate_to_company" to "service_role";

grant truncate on table "public"."ratings_candidate_to_company" to "service_role";

grant update on table "public"."ratings_candidate_to_company" to "service_role";

grant delete on table "public"."ratings_recruiter_to_candidate" to "anon";

grant insert on table "public"."ratings_recruiter_to_candidate" to "anon";

grant references on table "public"."ratings_recruiter_to_candidate" to "anon";

grant select on table "public"."ratings_recruiter_to_candidate" to "anon";

grant trigger on table "public"."ratings_recruiter_to_candidate" to "anon";

grant truncate on table "public"."ratings_recruiter_to_candidate" to "anon";

grant update on table "public"."ratings_recruiter_to_candidate" to "anon";

grant delete on table "public"."ratings_recruiter_to_candidate" to "authenticated";

grant insert on table "public"."ratings_recruiter_to_candidate" to "authenticated";

grant references on table "public"."ratings_recruiter_to_candidate" to "authenticated";

grant select on table "public"."ratings_recruiter_to_candidate" to "authenticated";

grant trigger on table "public"."ratings_recruiter_to_candidate" to "authenticated";

grant truncate on table "public"."ratings_recruiter_to_candidate" to "authenticated";

grant update on table "public"."ratings_recruiter_to_candidate" to "authenticated";

grant delete on table "public"."ratings_recruiter_to_candidate" to "service_role";

grant insert on table "public"."ratings_recruiter_to_candidate" to "service_role";

grant references on table "public"."ratings_recruiter_to_candidate" to "service_role";

grant select on table "public"."ratings_recruiter_to_candidate" to "service_role";

grant trigger on table "public"."ratings_recruiter_to_candidate" to "service_role";

grant truncate on table "public"."ratings_recruiter_to_candidate" to "service_role";

grant update on table "public"."ratings_recruiter_to_candidate" to "service_role";


  create policy "Admin and recruiters can delete application progress"
  on "public"."application_progress"
  as permissive
  for delete
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'RA'::public.user_role]))))));



  create policy "Admin and recruiters can insert application progress"
  on "public"."application_progress"
  as permissive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'RA'::public.user_role]))))));



  create policy "Admin and recruiters can update application progress"
  on "public"."application_progress"
  as permissive
  for update
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'RA'::public.user_role]))))));



  create policy "Admin and recruiters can view all application progress"
  on "public"."application_progress"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'RA'::public.user_role]))))));



  create policy "Candidates can view their own application progress"
  on "public"."application_progress"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.applications
  WHERE ((applications.id = application_progress.application_id) AND (applications.candidate_id = auth.uid())))));



  create policy "Admin and recruiters can delete applications"
  on "public"."applications"
  as permissive
  for delete
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'RA'::public.user_role]))))));



  create policy "Admin and recruiters can insert applications"
  on "public"."applications"
  as permissive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'RA'::public.user_role]))))));



  create policy "Admin and recruiters can update applications"
  on "public"."applications"
  as permissive
  for update
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'RA'::public.user_role]))))));



  create policy "Admin and recruiters can view all applications"
  on "public"."applications"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'RA'::public.user_role]))))));



  create policy "Candidates can insert their own applications"
  on "public"."applications"
  as permissive
  for insert
  to public
with check ((candidate_id = auth.uid()));



  create policy "Candidates can view their own applications"
  on "public"."applications"
  as permissive
  for select
  to public
using ((candidate_id = auth.uid()));



  create policy "Allow authenticated users to delete ca_interviews"
  on "public"."ca_interviews"
  as permissive
  for delete
  to authenticated
using (true);



  create policy "Allow authenticated users to insert ca_interviews"
  on "public"."ca_interviews"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Allow authenticated users to read ca_interviews"
  on "public"."ca_interviews"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow authenticated users to update ca_interviews"
  on "public"."ca_interviews"
  as permissive
  for update
  to authenticated
using (true)
with check (true);



  create policy "Admin and recruiters can delete candidates"
  on "public"."candidates"
  as permissive
  for delete
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'RA'::public.user_role]))))));



  create policy "Admin and recruiters can insert candidates"
  on "public"."candidates"
  as permissive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'RA'::public.user_role]))))));



  create policy "Admin and recruiters can update candidates"
  on "public"."candidates"
  as permissive
  for update
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'RA'::public.user_role]))))));



  create policy "Admin and recruiters can view all candidates"
  on "public"."candidates"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'RA'::public.user_role]))))));



  create policy "Candidates can update their own data"
  on "public"."candidates"
  as permissive
  for update
  to public
using ((id = auth.uid()));



  create policy "Candidates can view their own data"
  on "public"."candidates"
  as permissive
  for select
  to public
using ((id = auth.uid()));



  create policy "Authenticated users can manage comment templates"
  on "public"."comment_templates"
  as permissive
  for all
  to authenticated
using (true);



  create policy "Authenticated users can view comment templates"
  on "public"."comment_templates"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admin and recruiters can delete companies"
  on "public"."companies"
  as permissive
  for delete
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'RA'::public.user_role]))))));



  create policy "Admin and recruiters can insert companies"
  on "public"."companies"
  as permissive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'RA'::public.user_role]))))));



  create policy "Admin and recruiters can update companies"
  on "public"."companies"
  as permissive
  for update
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'RA'::public.user_role]))))));



  create policy "Admin and recruiters can view all companies"
  on "public"."companies"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'RA'::public.user_role]))))));



  create policy "Authenticated users can manage event companies"
  on "public"."event_companies"
  as permissive
  for all
  to authenticated
using (true);



  create policy "Authenticated users can view event companies"
  on "public"."event_companies"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Authenticated users can manage event reservations"
  on "public"."event_reservations"
  as permissive
  for all
  to authenticated
using (true);



  create policy "Authenticated users can view event reservations"
  on "public"."event_reservations"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Authenticated users can create events"
  on "public"."events"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Authenticated users can delete events"
  on "public"."events"
  as permissive
  for delete
  to authenticated
using (true);



  create policy "Authenticated users can update events"
  on "public"."events"
  as permissive
  for update
  to authenticated
using (true);



  create policy "Authenticated users can view all events"
  on "public"."events"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admin and recruiters can delete job postings"
  on "public"."job_postings"
  as permissive
  for delete
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'RA'::public.user_role]))))));



  create policy "Admin and recruiters can insert job postings"
  on "public"."job_postings"
  as permissive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'RA'::public.user_role]))))));



  create policy "Admin and recruiters can update job postings"
  on "public"."job_postings"
  as permissive
  for update
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'RA'::public.user_role]))))));



  create policy "Admin and recruiters can view all job postings"
  on "public"."job_postings"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'RA'::public.user_role]))))));



  create policy "Admins can manage master areas"
  on "public"."master_areas"
  as permissive
  for all
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::public.user_role)))));



  create policy "Authenticated users can view all master areas"
  on "public"."master_areas"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admins can manage master event types"
  on "public"."master_event_types"
  as permissive
  for all
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::public.user_role)))));



  create policy "Authenticated users can view all master event types"
  on "public"."master_event_types"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admins can manage master graduation years"
  on "public"."master_graduation_years"
  as permissive
  for all
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::public.user_role)))));



  create policy "Authenticated users can view all master graduation years"
  on "public"."master_graduation_years"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Authenticated users can manage matching results"
  on "public"."matching_results"
  as permissive
  for all
  to authenticated
using (true);



  create policy "Authenticated users can view matching results"
  on "public"."matching_results"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Authenticated users can manage matching sessions"
  on "public"."matching_sessions"
  as permissive
  for all
  to authenticated
using (true);



  create policy "Authenticated users can view matching sessions"
  on "public"."matching_sessions"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow authenticated users to delete phone_call_list_items"
  on "public"."phone_call_list_items"
  as permissive
  for delete
  to authenticated
using (true);



  create policy "Allow authenticated users to insert phone_call_list_items"
  on "public"."phone_call_list_items"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Allow authenticated users to read phone_call_list_items"
  on "public"."phone_call_list_items"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow authenticated users to update phone_call_list_items"
  on "public"."phone_call_list_items"
  as permissive
  for update
  to authenticated
using (true)
with check (true);



  create policy "Allow authenticated users to delete phone_call_lists"
  on "public"."phone_call_lists"
  as permissive
  for delete
  to authenticated
using (true);



  create policy "Allow authenticated users to insert phone_call_lists"
  on "public"."phone_call_lists"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Allow authenticated users to read phone_call_lists"
  on "public"."phone_call_lists"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow authenticated users to update phone_call_lists"
  on "public"."phone_call_lists"
  as permissive
  for update
  to authenticated
using (true)
with check (true);



  create policy "Allow authenticated users to delete phone_calls"
  on "public"."phone_calls"
  as permissive
  for delete
  to authenticated
using (true);



  create policy "Allow authenticated users to insert phone_calls"
  on "public"."phone_calls"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Allow authenticated users to read phone_calls"
  on "public"."phone_calls"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow authenticated users to update phone_calls"
  on "public"."phone_calls"
  as permissive
  for update
  to authenticated
using (true)
with check (true);



  create policy "Admins can insert profiles"
  on "public"."profiles"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.id = auth.uid()) AND (p.role = 'admin'::public.user_role)))));



  create policy "Admins can update all profiles"
  on "public"."profiles"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.id = auth.uid()) AND (p.role = 'admin'::public.user_role)))))
with check ((EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.id = auth.uid()) AND (p.role = 'admin'::public.user_role)))));



  create policy "Authenticated users can update their own profile"
  on "public"."profiles"
  as permissive
  for update
  to authenticated
using ((id = auth.uid()))
with check ((id = auth.uid()));



  create policy "Authenticated users can view all profiles"
  on "public"."profiles"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Authenticated users can view their own profile"
  on "public"."profiles"
  as permissive
  for select
  to authenticated
using ((id = auth.uid()));



  create policy "Public profiles are viewable by everyone."
  on "public"."profiles"
  as permissive
  for select
  to public
using (true);



  create policy "Users can insert their own profile"
  on "public"."profiles"
  as permissive
  for insert
  to authenticated
with check ((id = auth.uid()));



  create policy "Users can insert their own profile."
  on "public"."profiles"
  as permissive
  for insert
  to public
with check ((( SELECT auth.uid() AS uid) = id));



  create policy "Users can update own profile."
  on "public"."profiles"
  as permissive
  for update
  to public
using ((( SELECT auth.uid() AS uid) = id));



  create policy "Authenticated users can manage candidate ratings"
  on "public"."ratings_candidate_to_company"
  as permissive
  for all
  to authenticated
using (true);



  create policy "Authenticated users can view candidate ratings"
  on "public"."ratings_candidate_to_company"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Authenticated users can manage recruiter ratings"
  on "public"."ratings_recruiter_to_candidate"
  as permissive
  for all
  to authenticated
using (true);



  create policy "Authenticated users can view recruiter ratings"
  on "public"."ratings_recruiter_to_candidate"
  as permissive
  for select
  to authenticated
using (true);


CREATE TRIGGER trigger_update_application_progress_updated_at BEFORE UPDATE ON public.application_progress FOR EACH ROW EXECUTE FUNCTION public.update_application_progress_updated_at();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ca_interviews_updated_at BEFORE UPDATE ON public.ca_interviews FOR EACH ROW EXECUTE FUNCTION public.update_ca_interviews_updated_at();

CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON public.candidates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comment_templates_updated_at BEFORE UPDATE ON public.comment_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_event_companies_updated_at BEFORE UPDATE ON public.event_companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_event_reservations_updated_at BEFORE UPDATE ON public.event_reservations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_postings_updated_at BEFORE UPDATE ON public.job_postings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_areas_updated_at BEFORE UPDATE ON public.master_areas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_event_types_updated_at BEFORE UPDATE ON public.master_event_types FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_graduation_years_updated_at BEFORE UPDATE ON public.master_graduation_years FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_matching_sessions_updated_at BEFORE UPDATE ON public.matching_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_phone_call_list_items_updated_at BEFORE UPDATE ON public.phone_call_list_items FOR EACH ROW EXECUTE FUNCTION public.update_phone_call_list_items_updated_at();

CREATE TRIGGER update_phone_call_lists_updated_at BEFORE UPDATE ON public.phone_call_lists FOR EACH ROW EXECUTE FUNCTION public.update_phone_call_lists_updated_at();

CREATE TRIGGER update_phone_calls_updated_at BEFORE UPDATE ON public.phone_calls FOR EACH ROW EXECUTE FUNCTION public.update_phone_calls_updated_at();

CREATE TRIGGER update_ratings_candidate_to_company_updated_at BEFORE UPDATE ON public.ratings_candidate_to_company FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ratings_recruiter_to_candidate_updated_at BEFORE UPDATE ON public.ratings_recruiter_to_candidate FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


  create policy "Anyone can upload an avatar."
  on "storage"."objects"
  as permissive
  for insert
  to public
with check ((bucket_id = 'avatars'::text));



  create policy "Avatar images are publicly accessible."
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'avatars'::text));



