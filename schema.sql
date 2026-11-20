-- JDNEXA / Supabase PostgreSQL
-- Exécuter dans Supabase SQL Editor. Toutes les tables activent RLS.
create extension if not exists pgcrypto;

create table if not exists public.sites (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 nom text not null check (char_length(nom) between 1 and 80),
 slug text not null check (slug ~ '^[a-z0-9-]{2,80}$'),
 settings_json jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now(),
 unique(owner_id, slug)
);

create table if not exists public.pages (
 id uuid primary key default gen_random_uuid(),
 site_id uuid not null references public.sites(id) on delete cascade,
 titre text not null default 'Accueil',
 slug text not null default 'accueil',
 content_json jsonb not null default '{"blocks":[]}'::jsonb,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(site_id, slug)
);

create table if not exists public.collections_donnees (
 id uuid primary key default gen_random_uuid(),
 site_id uuid not null references public.sites(id) on delete cascade,
 type_donnee text not null check (type_donnee in ('article','produit','annonce','profil_rencontre')),
 contenu_json jsonb not null default '{}'::jsonb,
 date_creation timestamptz not null default now()
);

create table if not exists public.utilisateurs_finaux (
 id uuid primary key default gen_random_uuid(),
 site_id uuid not null references public.sites(id) on delete cascade,
 email text not null,
 profil_json jsonb not null default '{}'::jsonb,
 date_creation timestamptz not null default now(),
 unique(site_id,email)
);

create table if not exists public.messages_et_commandes (
 id uuid primary key default gen_random_uuid(),
 site_id uuid not null references public.sites(id) on delete cascade,
 expediteur_id uuid references public.utilisateurs_finaux(id) on delete set null,
 destinataire_id uuid references public.utilisateurs_finaux(id) on delete set null,
 type text not null check (type in ('message_chat','commande')),
 details_json jsonb not null default '{}'::jsonb,
 date_creation timestamptz not null default now()
);

create index if not exists idx_pages_site on public.pages(site_id);
create index if not exists idx_collections_site_type on public.collections_donnees(site_id,type_donnee);
create index if not exists idx_visiteurs_site on public.utilisateurs_finaux(site_id);
create index if not exists idx_interactions_site_date on public.messages_et_commandes(site_id,date_creation desc);

alter table public.sites enable row level security;
alter table public.pages enable row level security;
alter table public.collections_donnees enable row level security;
alter table public.utilisateurs_finaux enable row level security;
alter table public.messages_et_commandes enable row level security;

-- Helper: un utilisateur authentifié possède-t-il le site concerné ?
create or replace function public.owns_site(check_site uuid)
returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.sites s where s.id=check_site and s.owner_id=auth.uid()); $$;
revoke all on function public.owns_site(uuid) from public;
grant execute on function public.owns_site(uuid) to authenticated;

drop policy if exists "owners manage own sites" on public.sites;
create policy "owners manage own sites" on public.sites for all to authenticated
using (owner_id=auth.uid()) with check (owner_id=auth.uid());

drop policy if exists "owners manage own pages" on public.pages;
create policy "owners manage own pages" on public.pages for all to authenticated
using (public.owns_site(site_id)) with check (public.owns_site(site_id));

drop policy if exists "owners manage own collections" on public.collections_donnees;
create policy "owners manage own collections" on public.collections_donnees for all to authenticated
using (public.owns_site(site_id)) with check (public.owns_site(site_id));

-- Données des visiteurs/interactions : seul le propriétaire du site peut les lire/administrer.
-- Un formulaire public d'inscription/chat/commande doit passer par une Edge Function
-- ou une API serveur qui valide les champs et applique anti-spam/rate-limit.
drop policy if exists "owners manage site visitors" on public.utilisateurs_finaux;
create policy "owners manage site visitors" on public.utilisateurs_finaux for all to authenticated
using (public.owns_site(site_id)) with check (public.owns_site(site_id));

drop policy if exists "owners manage site interactions" on public.messages_et_commandes;
create policy "owners manage site interactions" on public.messages_et_commandes for all to authenticated
using (public.owns_site(site_id)) with check (public.owns_site(site_id));

grant select,insert,update,delete on public.sites,public.pages,public.collections_donnees,public.utilisateurs_finaux,public.messages_et_commandes to authenticated;

-- IMPORTANT : aucun accès anonyme aux données privées. N'ajoutez pas de policy public
-- avant d'avoir défini précisément quelles colonnes peuvent être publiques.
